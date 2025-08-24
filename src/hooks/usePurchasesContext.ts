import { useContext } from 'react';
import { PurchasesContext, type PurchasesContextType } from '../context/purchases/PurchasesContextValue';

export const usePurchasesContext = (): PurchasesContextType => {
    const context = useContext(PurchasesContext);
    
    if (context === undefined) {
        throw new Error('usePurchasesContext must be used within a PurchasesProvider');
    }
    
    return context;
}; 