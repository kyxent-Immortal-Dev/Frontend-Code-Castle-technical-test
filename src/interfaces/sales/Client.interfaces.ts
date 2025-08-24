export interface ClientResponse {
    success: boolean;
    data: ClientData;
    message?: string;
}

export interface ClientData {
    current_page?: number;
    data: Client[];
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

export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sales?: Sale[];
}

export interface Sale {
    id: number;
    client_id: number;
    user_id: number;
    sale_date: string;
    total_amount: number;
    status: 'active' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Link {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

// Request interfaces
export interface CreateClientRequest {
    name: string;
    email: string;
    phone?: string;
    is_active?: boolean;
}

export interface UpdateClientRequest {
    name?: string;
    email?: string;
    phone?: string;
    is_active?: boolean;
}

export interface SearchClientRequest {
    name?: string;
    email?: string;
    phone?: string;
    is_active?: boolean;
}

// Single client response
export interface SingleClientResponse {
    success: boolean;
    data: Client;
    message?: string;
}
