export interface RefreshResponseI {
    success: boolean;
    data:    RefreshDataI;
    message: string;
}

export interface RefreshDataI {
    user: RefreshUserI;
}

export interface RefreshUserI {
    id:                number;
    name:              string;
    email:             string;
    role:              string;
    is_active:         boolean;
    email_verified_at: Date;
    created_at:        Date;
    updated_at:        Date;
}
