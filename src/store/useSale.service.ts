import { create } from "zustand";
import { SalesService } from "../services/api/Sales.service";
import type { 
    Sale, 
    CreateSaleRequest,
    SaleStats
} from "../interfaces/sales/Sales.interfaces";

interface SaleState {
    // State
    sales: Sale[];
    selectedSale: Sale | null;
    isLoading: boolean;
    error: string | null;
    totalSales: number;
    currentPage: number;
    perPage: number;
    
    // Actions
    getSales: (page?: number, perPage?: number) => Promise<void>;
    getSale: (id: number) => Promise<void>;
    createSale: (sale: CreateSaleRequest) => Promise<boolean>;
    cancelSale: (id: number) => Promise<boolean>;
    getSalesByClient: (clientId: number) => Promise<void>;
    getSalesByUser: (userId: number) => Promise<void>;
    getSalesByDateRange: (startDate: string, endDate: string) => Promise<void>;
    getSalesByStatus: (status: string) => Promise<void>;
    getSalesStats: () => Promise<SaleStats | null>;
    getTopSellingProducts: (limit?: number) => Promise<unknown>;
    getMonthlyTotals: (year?: number) => Promise<unknown>;
    setSelectedSale: (sale: Sale | null) => void;
    clearError: () => void;
    resetState: () => void;
}

export const useSaleStore = create<SaleState>((set, get) => {
    const saleService = new SalesService();
    
    return {
        // Initial state
        sales: [],
        selectedSale: null,
        isLoading: false,
        error: null,
        totalSales: 0,
        currentPage: 1,
        perPage: 15,

        // Get all sales
        getSales: async (page = 1, perPage = 15) => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getSales(page, perPage);
                
                if (response.success) {
                    set({
                        sales: response.data.data || response.data,
                        totalSales: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        currentPage: response.data.current_page || page,
                        perPage: response.data.per_page || perPage,
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error al obtener ventas' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Get single sale
        getSale: async (id: number) => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getSale(id);
                
                if (response.success) {
                    set({ selectedSale: response.data, error: null });
                } else {
                    set({ error: response.message || 'Error al obtener la venta' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Create sale
        createSale: async (sale: CreateSaleRequest): Promise<boolean> => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.createSale(sale);
                
                if (response.success) {
                    // Refresh the sales list
                    await get().getSales();
                    return true;
                } else {
                    set({ error: response.message || 'Error al crear la venta' });
                    return false;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return false;
            } finally {
                set({ isLoading: false });
            }
        },

        // Cancel sale
        cancelSale: async (id: number): Promise<boolean> => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.cancelSale(id);
                
                if (response.success) {
                    // Update the sale in the list
                    const updatedSales = get().sales.map(s => 
                        s.id === id ? { ...s, ...response.data } : s
                    );
                    set({ sales: updatedSales });
                    
                    // Update selected sale if it's the one being cancelled
                    if (get().selectedSale?.id === id) {
                        set({ selectedSale: response.data });
                    }
                    
                    return true;
                } else {
                    set({ error: response.message || 'Error al cancelar la venta' });
                    return false;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return false;
            } finally {
                set({ isLoading: false });
            }
        },

        // Get sales by client
        getSalesByClient: async (clientId: number) => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getSalesByClient(clientId);
                
                if (response.success) {
                    set({
                        sales: response.data.data || response.data,
                        totalSales: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        currentPage: 1, // Reset to first page for filtered results
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error al obtener ventas del cliente' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Get sales by user
        getSalesByUser: async (userId: number) => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getSalesByUser(userId);
                
                if (response.success) {
                    set({
                        sales: response.data.data || response.data,
                        totalSales: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        currentPage: 1, // Reset to first page for filtered results
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error al obtener ventas del usuario' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Get sales by date range
        getSalesByDateRange: async (startDate: string, endDate: string) => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getSalesByDateRange(startDate, endDate);
                
                if (response.success) {
                    set({
                        sales: response.data.data || response.data,
                        totalSales: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        currentPage: 1, // Reset to first page for filtered results
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error al obtener ventas por rango de fechas' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Get sales by status
        getSalesByStatus: async (status: string) => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getSalesByStatus(status);
                
                if (response.success) {
                    set({
                        sales: response.data.data || response.data,
                        totalSales: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        currentPage: 1, // Reset to first page for filtered results
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error al obtener ventas por estado' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Get sales statistics
        getSalesStats: async (): Promise<SaleStats | null> => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getSalesStats();
                
                if (response.success) {
                    return response.data;
                } else {
                    set({ error: response.message || 'Error al obtener estadísticas' });
                    return null;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return null;
            } finally {
                set({ isLoading: false });
            }
        },

        // Get top selling products
        getTopSellingProducts: async (limit = 10): Promise<unknown> => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getTopSellingProducts(limit);
                
                if (response.success) {
                    return response.data;
                } else {
                    set({ error: response.message || 'Error al obtener productos más vendidos' });
                    return null;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return null;
            } finally {
                set({ isLoading: false });
            }
        },

        // Get monthly totals
        getMonthlyTotals: async (year = new Date().getFullYear()): Promise<unknown> => {
            try {
                set({ isLoading: true, error: null });
                const response = await saleService.getMonthlyTotals(year);
                
                if (response.success) {
                    return response.data;
                } else {
                    set({ error: response.message || 'Error al obtener totales mensuales' });
                    return null;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return null;
            } finally {
                set({ isLoading: false });
            }
        },

        // Set selected sale
        setSelectedSale: (sale: Sale | null) => {
            set({ selectedSale: sale });
        },

        // Clear error
        clearError: () => {
            set({ error: null });
        },

        // Reset state
        resetState: () => {
            set({
                sales: [],
                selectedSale: null,
                isLoading: false,
                error: null,
                totalSales: 0,
                currentPage: 1,
                perPage: 15
            });
        }
    };
});