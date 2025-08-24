import type { PurchaseInterface, PurchaseResponseInterface } from "../../interfaces/inventary/Purchases.interface";
import { httpClient } from '../htttp.client.service';


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
}