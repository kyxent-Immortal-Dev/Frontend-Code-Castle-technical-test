export interface SupplierResponse {
    success: boolean;
    data:    SupplierInterface[];
    message: string;
}

export interface SupplierInterface {
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
