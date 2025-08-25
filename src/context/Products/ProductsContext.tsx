import React, { useCallback, useState, useMemo, type ReactNode } from 'react';
import { ProductsContext } from './ProductsContextValue';
import { ProductService } from '../../services/api/Product.service';
import type { ProductInterface } from '../../interfaces/inventary/Product.interface';

interface ProductsProviderProps {
    children: ReactNode;
}

const productService = new ProductService();

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await productService.getProducts();
            console.log('Products API response:', response);
            if (response.success && response.data && Array.isArray(response.data)) {
                // Handle direct array response (ProductResponse structure)
                console.log('Setting products from response.data:', response.data);
                setProducts(response.data);
            } else {
                console.log('No valid data structure found in response');
                setProducts([]);
            }
        } catch (error) {
            setError('Error al obtener productos');
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createProduct = useCallback(async (product: Omit<ProductInterface, 'id' | 'purchase_details'>) => {
        try {
            setError(null);
            await productService.createProduct(product as ProductInterface);
            getProducts();
        } catch (error) {
            setError('Error al crear producto');
            console.error('Error creating product:', error);
            throw new Error('Error al crear producto');
        }
    }, []);

    const updateProduct = useCallback(async (product: ProductInterface) => {
        try {
            setError(null);
            await productService.updateProduct(product);
            getProducts();
        } catch (error) {
            setError('Error al actualizar producto');
            console.error('Error updating product:', error);
            throw new Error('Error al actualizar producto');
        }
    }, []);

    const deleteProduct = useCallback(async (id: number) => {
        try {
            setError(null);
            await productService.deleteProduct(id);
            getProducts();
        } catch (error) {
            setError('Error al eliminar producto');
            console.error('Error deleting product:', error);
            throw new Error('Error al eliminar producto');
        }
    }, []);

    const getProductById = useCallback(async (id: number): Promise<ProductInterface | null> => {
        try {
            const response = await productService.getProducts();
            if (response.success && response.data) {
                const product = response.data.find((p: ProductInterface) => p.id === id);
                return product || null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return null;
        }
    }, []);

    const generateStockReport = useCallback(async () => {
        try {
            setError(null);
            const blob = await productService.generateStockReport();
            
            // Crear URL del blob y descargar
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte-stock-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError('Error al generar reporte');
            console.error('Error generating stock report:', error);
            throw new Error('Error al generar reporte');
        }
    }, []);

    const contextValue = useMemo(() => ({
        products,
        isLoading,
        error,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        generateStockReport,
    }), [products, isLoading, error, getProducts, createProduct, updateProduct, deleteProduct, getProductById, generateStockReport]);

    return (
        <ProductsContext.Provider value={contextValue}>
            {children}
        </ProductsContext.Provider>
    );
};
