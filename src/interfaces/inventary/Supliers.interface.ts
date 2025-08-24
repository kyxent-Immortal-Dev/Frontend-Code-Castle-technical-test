export interface SupplierResponse {
    success: boolean;
    data:    PaginatedSuppliersData;
    message: string;
}

export interface PaginatedSuppliersData {
    current_page: number;
    data: SupplierInterface[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export interface SupplierInterface {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    is_active: boolean;
    purchases: Purchase[];
}

export interface Purchase {
    id: number;
    supplier_id: number;
    user_id: number;
    purchase_date: string;
    total_amount: string;
    status: string;
    notes: string;
}

export interface PurchaseDetail {
    id: number;
    purchase_id: number;
    product_id: number;
    quantity: number;
    purchase_price: string;
    subtotal: string;
}
