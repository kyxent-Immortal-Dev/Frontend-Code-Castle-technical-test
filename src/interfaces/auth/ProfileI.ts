export interface ProfileResponseI {
    success: boolean;
    data:    ProfileDataI;
    message: string;
}

export interface ProfileDataI {
    id:                number;
    name:              string;
    email:             string;
    role:              string;
    is_active:         boolean;
    email_verified_at: Date;
    created_at:        Date;
    updated_at:        Date;
}
