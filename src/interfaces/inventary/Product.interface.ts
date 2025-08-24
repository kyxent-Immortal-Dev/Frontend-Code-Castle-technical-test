export interface ProductResponse {
    success: boolean;
    data:    ProductInterface[];
    message: string;
}

export interface ProductInterface {
    id:               number;
    name:             string;
    description:      string;
    unit_price:       string;
    stock:            number;
    is_active:        boolean;
    purchase_details: PurchaseDetail[];
}

export interface PurchaseDetail {
    id:             number;
    purchase_id:    number;
    product_id:     number;
    quantity:       number;
    purchase_price: string;
    subtotal:       string;
}

// User interface types for forms
export interface CreateProductData {
    name: string;
    description: string;
    unit_price: string;
    stock: number;
    is_active: boolean;
}

export interface UpdateProductData extends CreateProductData {
    id: number;
}

export interface ProductFormData {
    name: string;
    description: string;
    unit_price: string;
    stock: number;
    is_active: boolean;
}
