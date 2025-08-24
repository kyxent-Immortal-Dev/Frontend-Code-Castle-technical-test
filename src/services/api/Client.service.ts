import { httpClient } from '../htttp.client.service';
import type { 
    ClientResponse, 
    SingleClientResponse,
    CreateClientRequest,
    UpdateClientRequest,
    SearchClientRequest
} from '../../interfaces/sales/Client.interfaces';

export class ClientService {
    private httpClient = httpClient;

    constructor() {
        this.httpClient = httpClient;
    }

    // Get all clients with pagination
    public async getClients(page: number = 1, perPage: number = 15): Promise<ClientResponse> {
        const response = await this.httpClient.get(`/clients?page=${page}&per_page=${perPage}`);
        return response.data;
    }

    // Get a single client by ID
    public async getClient(id: number): Promise<SingleClientResponse> {
        const response = await this.httpClient.get(`/clients/${id}`);
        return response.data;
    }

    // Create a new client
    public async createClient(client: CreateClientRequest): Promise<SingleClientResponse> {
        const response = await this.httpClient.post('/clients', client);
        return response.data;
    }

    // Update an existing client
    public async updateClient(id: number, client: UpdateClientRequest): Promise<SingleClientResponse> {
        const response = await this.httpClient.put(`/clients/${id}`, client);
        return response.data;
    }

    // Delete a client
    public async deleteClient(id: number): Promise<{ success: boolean; message: string }> {
        const response = await this.httpClient.delete(`/clients/${id}`);
        return response.data;
    }

    // Search clients by criteria
    public async searchClients(criteria: SearchClientRequest): Promise<ClientResponse> {
        const params = new URLSearchParams();
        Object.entries(criteria).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });
        
        const response = await this.httpClient.get(`/clients/search?${params.toString()}`);
        return response.data;
    }

    // Get active clients only
    public async getActiveClients(): Promise<ClientResponse> {
        const response = await this.httpClient.get('/clients/active');
        return response.data;
    }

    // Toggle client status
    public async toggleClientStatus(id: number): Promise<SingleClientResponse> {
        const response = await this.httpClient.patch(`/clients/${id}/toggle-status`);
        return response.data;
    }

    // Get client statistics
    public async getClientStats(): Promise<{ success: boolean; data: unknown; message?: string }> {
        const response = await this.httpClient.get('/clients/stats');
        return response.data;
    }
}