import { httpClient } from '../htttp.client.service';
import type { 
    SalesResponse, 
    SingleSaleResponse,
    CreateSaleRequest,
    SaleStats
} from '../../interfaces/sales/Sales.interfaces';

export class SalesService {
    private httpClient = httpClient;

    constructor() {
        this.httpClient = httpClient;
    }

    // Get all sales with pagination
    public async getSales(page: number = 1, perPage: number = 15): Promise<SalesResponse> {
        const response = await this.httpClient.get(`/sales?page=${page}&per_page=${perPage}`);
        return response.data;
    }

    // Get a single sale by ID
    public async getSale(id: number): Promise<SingleSaleResponse> {
        const response = await this.httpClient.get(`/sales/${id}`);
        return response.data;
    }

    // Create a new sale
    public async createSale(sale: CreateSaleRequest): Promise<SingleSaleResponse> {
        const response = await this.httpClient.post('/sales', sale);
        return response.data;
    }

    // Cancel a sale
    public async cancelSale(id: number): Promise<SingleSaleResponse> {
        const response = await this.httpClient.patch(`/sales/${id}/cancel`);
        return response.data;
    }

    // Get sales by client
    public async getSalesByClient(clientId: number): Promise<SalesResponse> {
        const response = await this.httpClient.get(`/sales/client/${clientId}`);
        return response.data;
    }

    // Get sales by user
    public async getSalesByUser(userId: number): Promise<SalesResponse> {
        const response = await this.httpClient.get(`/sales/user/${userId}`);
        return response.data;
    }

    // Get sales by date range
    public async getSalesByDateRange(startDate: string, endDate: string): Promise<SalesResponse> {
        const response = await this.httpClient.get(`/sales/date-range?start_date=${startDate}&end_date=${endDate}`);
        return response.data;
    }

    // Get sales by status
    public async getSalesByStatus(status: string): Promise<SalesResponse> {
        const response = await this.httpClient.get(`/sales/status/${status}`);
        return response.data;
    }

    // Get sales statistics
    public async getSalesStats(): Promise<{ success: boolean; data: SaleStats; message?: string }> {
        const response = await this.httpClient.get('/sales/stats');
        return response.data;
    }

    // Get top selling products
    public async getTopSellingProducts(limit: number = 10): Promise<{ success: boolean; data: unknown; message?: string }> {
        const response = await this.httpClient.get(`/sales/top-products?limit=${limit}`);
        return response.data;
    }

    // Get monthly totals
    public async getMonthlyTotals(year: number = new Date().getFullYear()): Promise<{ success: boolean; data: unknown; message?: string }> {
        const response = await this.httpClient.get(`/sales/monthly?year=${year}`);
        return response.data;
    }
}