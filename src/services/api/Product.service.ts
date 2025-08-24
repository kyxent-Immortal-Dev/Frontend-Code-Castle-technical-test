import type { ProductInterface, ProductResponse } from '../../interfaces/inventary/Product.interface';
import { httpClient } from '../htttp.client.service';




export class ProductService {
    private httpClient : typeof httpClient;

    constructor() {
        this.httpClient = httpClient;
    }

    async getProducts():Promise<ProductResponse> {
        const response = await this.httpClient.get('/products');
        return response.data;
    }

    async createProduct(product: ProductInterface):Promise<ProductResponse> {
        const response = await this.httpClient.post('/products', product);
        return response.data;
    }

    async updateProduct(product: ProductInterface):Promise<ProductResponse> {
        const response = await this.httpClient.put(`/products/${product.id}`, product);
        return response.data;
    }

    async deleteProduct(id: number):Promise<ProductResponse> {
        const response = await this.httpClient.delete(`/products/${id}`);
        return response.data;
    }

}