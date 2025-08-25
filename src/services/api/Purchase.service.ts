import type { PurchaseInterface, PurchaseResponseInterface } from "../../interfaces/inventary/Purchases.interface";
import { httpClient } from '../htttp.client.service';

export interface PurchaseStatsResponse {
    success: boolean;
    data: {
        total_purchases: number;
        pending_purchases: number;
        completed_purchases: number;
        cancelled_purchases: number;
        total_amount: number;
        average_amount: number;
        this_month_purchases: number;
        this_month_amount: number;
    };
    message: string;
}

export interface PurchasesByStatusResponse {
    success: boolean;
    data: PurchaseInterface[];
    message: string;
}

export interface PurchasesBySupplierResponse {
    success: boolean;
    data: PurchaseInterface[];
    message: string;
}

export class PurchaseService {
    
    private httpClient: typeof httpClient;

    constructor() {
        this.httpClient = httpClient;
    }

    async getPurchases():Promise<PurchaseResponseInterface> {
        try {
            const response = await this.httpClient.get('/purchases');
            return response.data;
        } catch (error) {
            console.error('Error fetching purchases:', error);
            throw error;
        }
    }

    async getPurchaseById(id: number): Promise<PurchaseInterface> {
        try {
            const response = await this.httpClient.get(`/purchases/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching purchase by id:', error);
            throw error;
        }
    }

    async createPurchase(purchase: PurchaseInterface): Promise<PurchaseInterface> {
        try {
            const response = await this.httpClient.post('/purchases', purchase);
            return response.data;
        } catch (error) {
            console.error('Error creating purchase:', error);
            throw error;
        }
    }

    async updatePurchase(id: number, purchase: PurchaseInterface): Promise<PurchaseInterface> {
        try {
            const response = await this.httpClient.put(`/purchases/${id}`, purchase);
            return response.data;
        } catch (error) {
            console.error('Error updating purchase:', error);
            throw error;
        }
    }

    async deletePurchase(id: number): Promise<void> {
        try {
            await this.httpClient.delete(`/purchases/${id}`);
        } catch (error) {
            console.error('Error deleting purchase:', error);
            throw error;
        }
    }

    async completePurchase(id: number): Promise<PurchaseInterface> {
        try {
            const response = await this.httpClient.patch(`/purchases/${id}/complete`);
            return response.data;
        } catch (error) {
            console.error('Error completing purchase:', error);
            throw error;
        }
    }

    async cancelPurchase(id: number): Promise<PurchaseInterface> {
        try {
            const response = await this.httpClient.patch(`/purchases/${id}/cancel`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling purchase:', error);
            throw error;
        }
    }

    async getPurchaseStats(): Promise<PurchaseStatsResponse> {
        try {
            const response = await this.httpClient.get('/purchases/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching purchase stats:', error);
            throw error;
        }
    }

    async getPurchasesByStatus(status: string): Promise<PurchasesByStatusResponse> {
        try {
            const response = await this.httpClient.get(`/purchases/status/${status}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching purchases by status:', error);
            throw error;
        }
    }

    async getPurchasesBySupplier(supplierId: number): Promise<PurchasesBySupplierResponse> {
        try {
            const response = await this.httpClient.get(`/purchases/supplier/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching purchases by supplier:', error);
            throw error;
        }
    }

    // Generate purchases report by supplier
    async generatePurchasesBySupplierReport(supplierId: number): Promise<Blob> {
        try {
            const response = await this.httpClient.get(`/purchases/supplier/${supplierId}/report`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Error generating purchases report by supplier:', error);
            throw error;
        }
    }
}