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
            if (response.success && response.data) {
                setProducts(response.data);
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
            const response = await productService.createProduct(product as ProductInterface);
            if (response.success) {
                await getProducts();
            }
        } catch (error) {
            setError('Error al crear producto');
            console.error('Error creating product:', error);
            throw new Error('Error al crear producto');
        }
    }, [getProducts]);

    const updateProduct = useCallback(async (product: ProductInterface) => {
        try {
            setError(null);
            const response = await productService.updateProduct(product);
            if (response.success) {
                await getProducts();
            }
        } catch (error) {
            setError('Error al actualizar producto');
            console.error('Error updating product:', error);
            throw new Error('Error al actualizar producto');
        }
    }, [getProducts]);

    const deleteProduct = useCallback(async (id: number) => {
        try {
            setError(null);
            await productService.deleteProduct(id);
            await getProducts();
        } catch (error) {
            setError('Error al eliminar producto');
            console.error('Error deleting product:', error);
            throw new Error('Error al eliminar producto');
        }
    }, [getProducts]);

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

    const contextValue = useMemo(() => ({
        products,
        isLoading,
        error,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductById,
    }), [products, isLoading, error, getProducts, createProduct, updateProduct, deleteProduct, getProductById]);

    return (
        <ProductsContext.Provider value={contextValue}>
            {children}
        </ProductsContext.Provider>
    );
};
