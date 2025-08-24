import React, { useCallback, useState, useMemo, type ReactNode } from 'react';
import { PurchasesContext } from './PurchasesContextValue';
import { PurchaseService } from '../../services/api/Purchase.service';
import type { PurchaseInterface, CreatePurchaseData } from '../../interfaces/inventary/Purchases.interface';

interface PurchasesProviderProps {
    children: ReactNode;
}

const purchaseService = new PurchaseService();

export const PurchasesProvider: React.FC<PurchasesProviderProps> = ({ children }) => {
    const [purchases, setPurchases] = useState<PurchaseInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getPurchases = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await purchaseService.getPurchases();
            if (response.success && response.data && response.data.data) {
                setPurchases(response.data.data);
            }
        } catch (error) {
            setError('Error al obtener compras');
            console.error('Error fetching purchases:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createPurchase = useCallback(async (purchase: CreatePurchaseData) => {
        try {
            setError(null);
            const response = await purchaseService.createPurchase(purchase as unknown as PurchaseInterface);
            if (response) {
                // Update purchases silently without triggering loading state
                const newPurchase: PurchaseInterface = {
                    ...purchase,
                    id: Date.now(),
                    purchase_date: new Date(purchase.purchase_date),
                    supplier: { id: 0, name: '', email: '', phone: '', address: '', is_active: false },
                    user: { id: 0, name: '', email: '', email_verified_at: null, created_at: new Date(), updated_at: new Date(), role: '', is_active: false },
                    details: purchase.details.map(detail => ({
                        ...detail,
                        id: Date.now() + Math.random(),
                        purchase_id: Date.now(),
                        product: { id: 0, name: '', description: '', unit_price: '', stock: 0, is_active: false }
                    }))
                };
                setPurchases(prev => [...prev, newPurchase]);
            }
        } catch (error) {
            setError('Error al crear compra');
            console.error('Error creating purchase:', error);
            throw new Error('Error al crear compra');
        }
    }, []);

    const updatePurchase = useCallback(async (purchase: PurchaseInterface) => {
        try {
            setError(null);
            const response = await purchaseService.updatePurchase(purchase.id, purchase);
            if (response) {
                // Update purchases silently without triggering loading state
                setPurchases(prev => prev.map(p => p.id === purchase.id ? purchase : p));
            }
        } catch (error) {
            setError('Error al actualizar compra');
            console.error('Error updating purchase:', error);
            throw new Error('Error al actualizar compra');
        }
    }, []);

    const deletePurchase = useCallback(async (id: number) => {
        try {
            setError(null);
            await purchaseService.deletePurchase(id);
            // Update purchases silently without triggering loading state
            setPurchases(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            setError('Error al eliminar compra');
            console.error('Error deleting purchase:', error);
            throw new Error('Error al eliminar compra');
        }
    }, []);

    const getPurchaseById = useCallback(async (id: number): Promise<PurchaseInterface | null> => {
        try {
            const response = await purchaseService.getPurchaseById(id);
            return response;
        } catch (error) {
            console.error('Error fetching purchase by ID:', error);
            return null;
        }
    }, []);

    const contextValue = useMemo(() => ({
        purchases,
        isLoading,
        error,
        getPurchases,
        createPurchase,
        updatePurchase,
        deletePurchase,
        getPurchaseById,
    }), [purchases, isLoading, error, getPurchases, createPurchase, updatePurchase, deletePurchase, getPurchaseById]);

    return (
        <PurchasesContext.Provider value={contextValue}>
            {children}
        </PurchasesContext.Provider>
    );
};
