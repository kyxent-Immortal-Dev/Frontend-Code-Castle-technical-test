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
