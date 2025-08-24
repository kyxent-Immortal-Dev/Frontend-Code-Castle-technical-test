import { httpClient } from '../htttp.client.service';



export class SalesService {
    private httpClient = this.httpClient;

    constructor() {
        this.httpClient = httpClient;
    }

    public async getSales(page: number = 1, perPage: number = 10): Promise<SalesResponse> {
        const response = await this.httpClient.get(`/sales?page=${page}&per_page=${perPage}`);
        return response.data;
    }
}