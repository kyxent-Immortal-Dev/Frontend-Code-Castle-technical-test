export interface UsersResponseI {
    success: boolean;
    data:    DataUsers[];
    message: string;
}

export interface DataUsers {
    id:                number;
    name:              string;
    email:             string;
    email_verified_at: null;
    created_at:        Date;
    updated_at:        Date;
    role:              string;
    is_active:         boolean;
}
