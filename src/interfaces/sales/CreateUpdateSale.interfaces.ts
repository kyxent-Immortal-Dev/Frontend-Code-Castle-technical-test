export interface Welcome {
    success: boolean;
    message: string;
    data:    Data;
}

export interface Data {
    client_id:    number;
    user_id:      number;
    sale_date:    Date;
    total_amount: string;
    status:       string;
    notes:        string;
    updated_at:   Date;
    created_at:   Date;
    id:           number;
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
