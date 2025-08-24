export interface SalesResponse {
    success: boolean;
    data: SalesData;
    message?: string;
}

export interface SalesData {
    current_page?: number;
    data: Sale[];
    first_page_url?: string;
    from?: number;
    last_page?: number;
    last_page_url?: string;
    links?: Link[];
    next_page_url?: string | null;
    path?: string;
    per_page?: number;
    prev_page_url?: string | null;
    to?: number;
    total?: number;
}

export interface Sale {
    id: number;
    client_id: number;
    user_id: number;
    sale_date: string;
    total_amount: string | number;
    status: 'active' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
    client: Client;
    user: User;
    sale_details: SaleDetail[];
}

export interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SaleDetail {
    id: number;
    sale_id: number;
    product_id: number;
    quantity: number;
    sale_price: string | number;
    subtotal: string | number;
    created_at: string;
    updated_at: string;
    product: Product;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    unit_price: string | number;
    stock: number;
    is_active: boolean;
}

export interface Link {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

// Request interfaces
export interface CreateSaleRequest {
    client_id: number;
    sale_date: string;
    notes?: string;
    sale_details: CreateSaleDetailRequest[];
}

export interface CreateSaleDetailRequest {
    product_id: number;
    quantity: number;
    sale_price: number;
}

export interface UpdateSaleRequest {
    client_id?: number;
    sale_date?: string;
    notes?: string;
    status?: 'active' | 'cancelled';
}

// Single sale response
export interface SingleSaleResponse {
    success: boolean;
    data: Sale;
    message?: string;
}

// Sale statistics
export interface SaleStats {
    total_sales: number;
    total_amount: number;
    active_sales: number;
    cancelled_sales: number;
    average_sale_amount: number;
    top_products: TopProduct[];
    monthly_totals: MonthlyTotal[];
}

export interface TopProduct {
    product_id: number;
    product_name: string;
    total_quantity: number;
    total_amount: number;
}

export interface MonthlyTotal {
    month: string;
    total_amount: number;
    total_sales: number;
}
