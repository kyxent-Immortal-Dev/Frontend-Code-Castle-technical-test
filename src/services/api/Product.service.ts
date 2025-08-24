import { httpClient } from '../htttp.client.service';




export class ProductService {
    private httpClient : typeof httpClient;

    constructor() {
        this.httpClient = httpClient;
    }

    async getProducts() {
        const response = await this.httpClient.get('/products');
        return response.data;
    }
}