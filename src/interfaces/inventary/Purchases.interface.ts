export interface PurchaseResponseInterface {
    success: boolean;
    data:    PurchaseResponseDataInterface;
    message: string;
}

export interface PurchaseResponseDataInterface {
    current_page:   number;
    data:           PurchaseInterface[];
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

export interface PurchaseInterface {
    id:            number;
    supplier_id:   number;
    user_id:       number;
    purchase_date: Date;
    total_amount:  string;
    status:        string;
    notes:         string;
    supplier:      Supplier;
    user:          User;
    details:       Detail[];
}

export interface Detail {
    id:             number;
    purchase_id:    number;
    product_id:     number;
    quantity:       number;
    purchase_price: string;
    subtotal:       string;
    product:        Product;
}

export interface Product {
    id:          number;
    name:        string;
    description: string;
    unit_price:  string;
    stock:       number;
    is_active:   boolean;
}

export interface Supplier {
    id:        number;
    name:      string;
    email:     string;
    phone:     string;
    address:   string;
    is_active: boolean;
}

export interface User {
    id:                number;
    name:              string;
    email:             string;
    email_verified_at: null;
    created_at:        Date;
    updated_at:        Date;
    role:              string;
    is_active:         boolean;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}

// User interface types for forms
export interface CreatePurchaseData {
    supplier_id: number;
    user_id: number;
    purchase_date: string;
    total_amount: string;
    status: string;
    notes: string;
    details: CreatePurchaseDetailData[];
}

export interface CreatePurchaseDetailData {
    product_id: number;
    quantity: number;
    purchase_price: string;
    subtotal: string;
}

export interface UpdatePurchaseData extends CreatePurchaseData {
    id: number;
}

export interface PurchaseFormData {
    supplier_id: number;
    user_id: number;
    purchase_date: string;
    total_amount: string;
    status: string;
    notes: string;
    details: PurchaseDetailFormData[];
}

export interface PurchaseDetailFormData {
    product_id: number;
    quantity: number;
    purchase_price: string;
    subtotal: string;
}
