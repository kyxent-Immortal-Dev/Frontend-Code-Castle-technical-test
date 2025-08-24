import type { SupplierInterface, SupplierResponse } from "../../interfaces/inventary/Supliers.interface";
import { httpClient } from "../htttp.client.service";



export class SupplierService {
    private httpClient: typeof httpClient;

    constructor() {
        this.httpClient = httpClient;
    }

    async getSuppliers(): Promise<SupplierResponse> {
        const response = await this.httpClient.get("/suppliers");
        return response.data;
    }

    async createSupplier(supplier: SupplierInterface): Promise<SupplierResponse> {
        const response = await this.httpClient.post("/suppliers", supplier);
        return response.data;
    }
    
    async updateSupplier(supplier: SupplierInterface): Promise<SupplierResponse> {
        const response = await this.httpClient.put(`/suppliers/${supplier.id}`, supplier);
        return response.data;
    }
    
    async deleteSupplier(id: number): Promise<SupplierResponse> {
        const response = await this.httpClient.delete(`/suppliers/${id}`);
        return response.data;
    }
    
    
    
}