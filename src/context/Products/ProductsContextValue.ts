import { createContext } from 'react';
import type { ProductInterface } from '../../interfaces/inventary/Product.interface';

export interface ProductsContextType {
    products: ProductInterface[];
    isLoading: boolean;
    error: string | null;
    getProducts: () => Promise<void>;
    createProduct: (product: Omit<ProductInterface, 'id' | 'purchase_details'>) => Promise<void>;
    updateProduct: (product: ProductInterface) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProductById: (id: number) => Promise<ProductInterface | null>;
    generateStockReport: () => Promise<void>;
}

export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);
