import { useContext } from "react";
import { SuppliersContext } from "../context/suppliers/SuppliersContextValue";

export const useSuppliersContext = () => {
    const context = useContext(SuppliersContext);
    if (!context) {
        throw new Error('useSuppliersContext must be used within a SuppliersProvider');
    }
    return context;
}