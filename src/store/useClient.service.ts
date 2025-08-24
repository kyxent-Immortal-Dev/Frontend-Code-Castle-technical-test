import { create } from "zustand";
import { ClientService } from "../services/api/Client.service";
import type { 
    Client, 
    CreateClientRequest,
    UpdateClientRequest,
    SearchClientRequest
} from "../interfaces/sales/Client.interfaces";

interface ClientState {
    // State
    clients: Client[];
    selectedClient: Client | null;
    isLoading: boolean;
    error: string | null;
    totalClients: number;
    currentPage: number;
    perPage: number;
    
    // Actions
    getClients: (page?: number, perPage?: number) => Promise<void>;
    getClient: (id: number) => Promise<void>;
    createClient: (client: CreateClientRequest) => Promise<boolean>;
    updateClient: (id: number, client: UpdateClientRequest) => Promise<boolean>;
    deleteClient: (id: number) => Promise<boolean>;
    searchClients: (criteria: SearchClientRequest) => Promise<void>;
    getActiveClients: () => Promise<void>;
    toggleClientStatus: (id: number) => Promise<boolean>;
    getClientStats: () => Promise<unknown>;
    setSelectedClient: (client: Client | null) => void;
    clearError: () => void;
    resetState: () => void;
}

export const useClientStore = create<ClientState>((set, get) => {
    const clientService = new ClientService();
    
    return {
        // Initial state
        clients: [],
        selectedClient: null,
        isLoading: false,
        error: null,
        totalClients: 0,
        currentPage: 1,
        perPage: 15,

        // Get all clients
        getClients: async (page = 1, perPage = 15) => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.getClients(page, perPage);
                
                if (response.success) {
                    set({
                        clients: response.data.data || response.data,
                        totalClients: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        currentPage: response.data.current_page || page,
                        perPage: response.data.per_page || perPage,
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error al obtener clientes' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Get single client
        getClient: async (id: number) => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.getClient(id);
                
                if (response.success) {
                    set({ selectedClient: response.data, error: null });
                } else {
                    set({ error: response.message || 'Error al obtener el cliente' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Create client
        createClient: async (client: CreateClientRequest): Promise<boolean> => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.createClient(client);
                
                if (response.success) {
                    // Refresh the clients list
                    await get().getClients();
                    return true;
                } else {
                    set({ error: response.message || 'Error al crear el cliente' });
                    return false;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return false;
            } finally {
                set({ isLoading: false });
            }
        },

        // Update client
        updateClient: async (id: number, client: UpdateClientRequest): Promise<boolean> => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.updateClient(id, client);
                
                if (response.success) {
                    // Update the client in the list
                    const updatedClients = get().clients.map(c => 
                        c.id === id ? { ...c, ...response.data } : c
                    );
                    set({ clients: updatedClients });
                    
                    // Update selected client if it's the one being edited
                    if (get().selectedClient?.id === id) {
                        set({ selectedClient: response.data });
                    }
                    
                    return true;
                } else {
                    set({ error: response.message || 'Error al actualizar el cliente' });
                    return false;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return false;
            } finally {
                set({ isLoading: false });
            }
        },

        // Delete client
        deleteClient: async (id: number): Promise<boolean> => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.deleteClient(id);
                
                if (response.success) {
                    // Remove client from the list
                    const updatedClients = get().clients.filter(c => c.id !== id);
                    set({ 
                        clients: updatedClients,
                        totalClients: get().totalClients - 1
                    });
                    
                    // Clear selected client if it's the one being deleted
                    if (get().selectedClient?.id === id) {
                        set({ selectedClient: null });
                    }
                    
                    return true;
                } else {
                    set({ error: response.message || 'Error al eliminar el cliente' });
                    return false;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return false;
            } finally {
                set({ isLoading: false });
            }
        },

        // Search clients
        searchClients: async (criteria: SearchClientRequest) => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.searchClients(criteria);
                
                if (response.success) {
                    set({
                        clients: response.data.data || response.data,
                        totalClients: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        currentPage: 1, // Reset to first page for search results
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error en la búsqueda' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Get active clients
        getActiveClients: async () => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.getActiveClients();
                
                if (response.success) {
                    set({
                        clients: response.data.data || response.data,
                        totalClients: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
                        error: null
                    });
                } else {
                    set({ error: response.message || 'Error al obtener clientes activos' });
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                set({ isLoading: false });
            }
        },

        // Toggle client status
        toggleClientStatus: async (id: number): Promise<boolean> => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.toggleClientStatus(id);
                
                if (response.success) {
                    // Update the client in the list
                    const updatedClients = get().clients.map(c => 
                        c.id === id ? { ...c, ...response.data } : c
                    );
                    set({ clients: updatedClients });
                    
                    // Update selected client if it's the one being toggled
                    if (get().selectedClient?.id === id) {
                        set({ selectedClient: response.data });
                    }
                    
                    return true;
                } else {
                    set({ error: response.message || 'Error al cambiar el estado del cliente' });
                    return false;
                }
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Error desconocido' });
                return false;
            } finally {
                set({ isLoading: false });
            }
        },

        // Get client statistics
        getClientStats: async () => {
            try {
                set({ isLoading: true, error: null });
                const response = await clientService.getClientStats();
                
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

        // Set selected client
        setSelectedClient: (client: Client | null) => {
            set({ selectedClient: client });
        },

        // Clear error
        clearError: () => {
            set({ error: null });
        },

        // Reset state
        resetState: () => {
            set({
                clients: [],
                selectedClient: null,
                isLoading: false,
                error: null,
                totalClients: 0,
                currentPage: 1,
                perPage: 15
            });
        }
    };
});