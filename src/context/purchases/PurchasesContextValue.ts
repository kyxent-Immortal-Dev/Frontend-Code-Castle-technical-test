import { createContext } from 'react';
import type { PurchaseInterface, CreatePurchaseData } from '../../interfaces/inventary/Purchases.interface';

export interface PurchaseStats {
    total_purchases: number;
    pending_purchases: number;
    completed_purchases: number;
    cancelled_purchases: number;
    total_amount: number;
    average_amount: number;
    this_month_purchases: number;
    this_month_amount: number;
}

export interface PurchasesContextType {
    purchases: PurchaseInterface[];
    isLoading: boolean;
    error: string | null;
    getPurchases: () => Promise<void>;
    createPurchase: (purchase: CreatePurchaseData) => Promise<void>;
    updatePurchase: (purchase: PurchaseInterface) => Promise<void>;
    deletePurchase: (id: number) => Promise<void>;
    getPurchaseById: (id: number) => Promise<PurchaseInterface | null>;
    completePurchase: (id: number) => Promise<void>;
    cancelPurchase: (id: number) => Promise<void>;
    getPurchaseStats: () => Promise<PurchaseStats>;
    getPurchasesByStatus: (status: string) => Promise<void>;
    getPurchasesBySupplier: (supplierId: number) => Promise<void>;
}

export const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);
