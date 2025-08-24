import { createContext } from "react";
import type { SupplierInterface } from "../../interfaces/inventary/Supliers.interface";



export interface SuppliersContextType {
    isLoading: boolean;
    suppliers: SupplierInterface[];
    error: string | null;
    getSuppliers: () => Promise<void>;
    createSupplier: (supplier: SupplierInterface) => Promise<void>;
    updateSupplier: (supplier: SupplierInterface) => Promise<void>;
    deleteSupplier: (id: number) => Promise<void>;
}


export const SuppliersContext = createContext<SuppliersContextType>({
    isLoading: false,
    suppliers: [],
    error: null,
    getSuppliers: async () => {},
    createSupplier: async () => {},
    updateSupplier: async () => {},
    deleteSupplier: async () => {},
});