

export interface LogoutResponseI {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
}