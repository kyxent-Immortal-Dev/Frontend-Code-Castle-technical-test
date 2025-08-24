import React, { useCallback, useState, type ReactNode } from "react";
import { SuppliersContext } from "./SupplersContextValue";
import { SupplierService } from "../../services/api/Supplier.service";
import type { SupplierInterface } from "../../interfaces/inventary/Supliers.interface";



interface SuppliersProviderProps {
    children: ReactNode;
}

export const SuppliersProvider: React.FC<SuppliersProviderProps> = ({ children }) => {
    const [suppliers, setSuppliers] = useState<SupplierInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supplierService = new SupplierService();

    const getSuppliers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await supplierService.getSuppliers();
            if (response.data) {
                setSuppliers(response.data);
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
            setIsLoading(true);
            setError(null);
            const response = await supplierService.createSupplier(supplier);
            if (response.data) {
                await getSuppliers();
            }
        } catch (error) {
            setError('Error al crear proveedor');
            console.error('Error creating supplier:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const updateSupplier = useCallback(async (supplier: SupplierInterface) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await supplierService.updateSupplier(supplier);
            if (response.data) {
                await getSuppliers();
            }
        } catch (error) {
            setError('Error al actualizar proveedor');
            console.error('Error updating supplier:', error);
        }
    }, []);

    const deleteSupplier = useCallback(async (id: number) => {
        try {
            setIsLoading(true);
            setError(null); 
            await supplierService.deleteSupplier(id);
            await getSuppliers();
        } catch (error) {
            setError('Error al eliminar proveedor');
            console.error('Error deleting supplier:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <SuppliersContext.Provider value={{ suppliers, isLoading, error, getSuppliers, createSupplier, updateSupplier, deleteSupplier }}>
            {children}
        </SuppliersContext.Provider>
    );
}