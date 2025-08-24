import React, { useCallback, useState, useMemo, type ReactNode } from "react";
import { SuppliersContext } from "./SuppliersContextValue";
import { SupplierService } from "../../services/api/Supplier.service";
import type { SupplierInterface } from "../../interfaces/inventary/Supliers.interface";



interface SuppliersProviderProps {
    children: ReactNode;
}
const supplierService = new SupplierService();

export const SuppliersProvider: React.FC<SuppliersProviderProps> = ({ children }) => {
    const [suppliers, setSuppliers] = useState<SupplierInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const getSuppliers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await supplierService.getSuppliers();
            if (response.data && response.data.data) {
                setSuppliers(response.data.data);
            }
        } catch (error) {
            setError('Error al obtener proveedores');
            console.error('Error fetching suppliers:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createSupplier = useCallback(async (supplier: SupplierInterface) => {
        try {
            setError(null);
            const response = await supplierService.createSupplier(supplier);
            if (response.data) {
                await getSuppliers();
            }
        } catch (error) {
            setError('Error al crear proveedor');
            console.error('Error creating supplier:', error);
            throw new Error('Error al crear proveedor');
        }
    }, []);

    const updateSupplier = useCallback(async (supplier: SupplierInterface) => {
        try {
            setError(null);
            const response = await supplierService.updateSupplier(supplier);
            if (response.data) {
                await getSuppliers();
            }
        } catch (error) {
            setError('Error al actualizar proveedor');
            console.error('Error updating supplier:', error);
            throw new Error('Error al actualizar proveedor');
        }
    }, []);

    const deleteSupplier = useCallback(async (id: number) => {
        try {
            setError(null); 
            await supplierService.deleteSupplier(id);
            await getSuppliers();
        } catch (error) {
            setError('Error al eliminar proveedor');
            console.error('Error deleting supplier:', error);
            throw new Error('Error al eliminar proveedor');
        }
    }, []);

    const contextValue = useMemo(() => ({
        suppliers, 
        isLoading, 
        error, 
        getSuppliers, 
        createSupplier, 
        updateSupplier, 
        deleteSupplier
    }), [suppliers, isLoading, error, getSuppliers, createSupplier, updateSupplier, deleteSupplier]);

    return (
        <SuppliersContext.Provider value={contextValue}>
            {children}
        </SuppliersContext.Provider>
    );
}