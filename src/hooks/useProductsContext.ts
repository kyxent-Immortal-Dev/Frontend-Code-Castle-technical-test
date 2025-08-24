import { useContext } from 'react';
import { ProductsContext, type ProductsContextType } from '../context/Products/ProductsContextValue';

export const useProductsContext = (): ProductsContextType => {
    const context = useContext(ProductsContext);
    
    if (context === undefined) {
        throw new Error('useProductsContext must be used within a ProductsProvider');
    }
    
    return context;
};
