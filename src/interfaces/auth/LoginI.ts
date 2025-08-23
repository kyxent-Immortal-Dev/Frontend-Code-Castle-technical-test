export interface LoginResponseI {
    success: boolean;
    data:    LoginDataI;
    message: string;
}

export interface LoginDataI {
    user:  LoginUserI;
  
}

export interface LoginUserI {
    id:                number;
    name:              string;
    email:             string;
    role:              string;
    is_active:         boolean;
    email_verified_at: Date;
    created_at:        Date;
    updated_at:        Date;
}
