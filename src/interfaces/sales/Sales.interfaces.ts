export interface SalesResponse {
    success: boolean;
    data:    SalesData;
}

export interface SalesData {
    current_page:   number;
    data:           Sale[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Sale {
    id:           number;
    client_id:    number;
    user_id:      number;
    sale_date:    Date;
    total_amount: string;
    status:       string;
    notes:        string;
    created_at:   Date;
    updated_at:   Date;
    client:       Client;
    user:         Client;
    sale_details: SaleDetail[];
}

export interface Client {
    id:                 number;
    name:               string;
    email:              string;
    phone?:             string;
    is_active:          boolean;
    created_at:         Date;
    updated_at:         Date;
    email_verified_at?: null;
    role?:              string;
}

export interface SaleDetail {
    id:         number;
    sale_id:    number;
    product_id: number;
    quantity:   number;
    sale_price: string;
    subtotal:   string;
    created_at: Date;
    updated_at: Date;
    product:    Product;
}

export interface Product {
    id:          number;
    name:        string;
    description: string;
    unit_price:  string;
    stock:       number;
    is_active:   boolean;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
