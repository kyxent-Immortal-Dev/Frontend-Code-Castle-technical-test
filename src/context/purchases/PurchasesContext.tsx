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
            await purchaseService.createPurchase(purchase as unknown as PurchaseInterface);
            getPurchases();
        } catch (error) {
            setError('Error al crear compra');
            console.error('Error creating purchase:', error);
            throw new Error('Error al crear compra');
        }
    }, []);

    const updatePurchase = useCallback(async (purchase: PurchaseInterface) => {
        try {
            setError(null);
            await purchaseService.updatePurchase(purchase.id, purchase);
            getPurchases();
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
            getPurchases();
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

    const completePurchase = useCallback(async (id: number) => {
        try {
            setError(null);
            await purchaseService.completePurchase(id);
            getPurchases();
        } catch (error) {
            setError('Error al completar compra');
            console.error('Error completing purchase:', error);
            throw new Error('Error al completar compra');
        }
    }, []);

    const cancelPurchase = useCallback(async (id: number) => {
        try {
            setError(null);
            await purchaseService.cancelPurchase(id);
            getPurchases();
        } catch (error) {
            setError('Error al cancelar compra');
            console.error('Error canceling purchase:', error);
            throw new Error('Error al cancelar compra');
        }
    }, []);

    const getPurchaseStats = useCallback(async () => {
        try {
            const response = await purchaseService.getPurchaseStats();
            return response.data;
        } catch (error) {
            console.error('Error fetching purchase stats:', error);
            throw error;
        }
    }, []);

    const getPurchasesByStatus = useCallback(async (status: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await purchaseService.getPurchasesByStatus(status);
            if (response.success && response.data) {
                setPurchases(response.data);
            }
        } catch (error) {
            setError('Error al obtener compras por estado');
            console.error('Error fetching purchases by status:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getPurchasesBySupplier = useCallback(async (supplierId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await purchaseService.getPurchasesBySupplier(supplierId);
            if (response.success && response.data) {
                setPurchases(response.data);
            }
        } catch (error) {
            setError('Error al obtener compras por proveedor');
            console.error('Error fetching purchases by supplier:', error);
        } finally {
            setIsLoading(false);
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
        completePurchase,
        cancelPurchase,
        getPurchaseStats,
        getPurchasesByStatus,
        getPurchasesBySupplier,
    }), [purchases, isLoading, error, getPurchases, createPurchase, updatePurchase, deletePurchase, getPurchaseById, completePurchase, cancelPurchase, getPurchaseStats, getPurchasesByStatus, getPurchasesBySupplier]);

    return (
        <PurchasesContext.Provider value={contextValue}>
            {children}
        </PurchasesContext.Provider>
    );
};
