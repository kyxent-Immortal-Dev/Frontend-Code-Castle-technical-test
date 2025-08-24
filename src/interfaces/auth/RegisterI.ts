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

// Interfaz para el formulario de registro
export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
}
