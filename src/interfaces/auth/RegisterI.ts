export interface RegisterResponseI {
    success: boolean;
    data:    RegisterDataI;
    message: string;
}

export interface RegisterDataI {
    user:  RegisterUserI,
}

export interface RegisterUserI {
    id:                number;
    name:              string;
    email:             string;
    role:              string;
    is_active:         boolean;
    email_verified_at: Date;
    created_at:        Date;
    updated_at:        Date;
}
