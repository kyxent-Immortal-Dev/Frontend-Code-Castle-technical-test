import { create } from "zustand";
import type { LoginFormData, LoginUserI } from "../interfaces/auth/LoginI";
import type { RegisterDataI, RegisterFormData } from "../interfaces/auth/RegisterI";
import { AuthService } from "../services/api/Auth.service";

interface AuthServiceStore {
  user: LoginUserI | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: Partial<LoginFormData>) => Promise<void>;
  register: (data: Partial<RegisterFormData>) => Promise<void>;
  logout: () => Promise<void>;
  profile: () => Promise<void>;
  refresh: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthService = create<AuthServiceStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await new AuthService().login(data);
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  
  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await new AuthService().register(data as RegisterDataI);
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      await new AuthService().logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      // Even if logout fails, clear local state
      set({ user: null, isAuthenticated: false });
    }
  },
  
  profile: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await new AuthService().profile();
      set({ 
        user: response.data, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  
  refresh: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await new AuthService().refresh();
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      await get().profile();
    } catch {
      set({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));
