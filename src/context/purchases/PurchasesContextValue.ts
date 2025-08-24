import { createContext } from 'react';
import type { PurchaseInterface, CreatePurchaseData } from '../../interfaces/inventary/Purchases.interface';

export interface PurchasesContextType {
    purchases: PurchaseInterface[];
    isLoading: boolean;
    error: string | null;
    getPurchases: () => Promise<void>;
    createPurchase: (purchase: CreatePurchaseData) => Promise<void>;
    updatePurchase: (purchase: PurchaseInterface) => Promise<void>;
    deletePurchase: (id: number) => Promise<void>;
    getPurchaseById: (id: number) => Promise<PurchaseInterface | null>;
}

export const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);
