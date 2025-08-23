import { create } from "zustand";
import type { LoginFormData, LoginUserI } from "../interfaces/auth/LoginI";
import type { RegisterDataI } from "../interfaces/auth/RegisterI";
import { AuthService } from "../services/api/Auth.service";

interface AuthServiceStore {
  user: LoginUserI | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: Partial<LoginFormData>) => Promise<void>;
  register: (data: Partial<RegisterDataI>) => Promise<void>;
  logout: () => Promise<void>;
  profile: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthService = create<AuthServiceStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (data) => {
    const response = await new AuthService().login(data);
    set({ user: response.data.user, isAuthenticated: true });
  },
  register: async (data) => {
    const response = await new AuthService().register(data);
    set({ user: response.data.user, isAuthenticated: true });
  },
  logout: async () => {
    await new AuthService().logout();
    set({ user: null, isAuthenticated: false });
  },
  profile: async () => {
    const response = await new AuthService().profile();
    set({ user: response.data, isAuthenticated: true });
  },
  refresh: async () => {
    const response = await new AuthService().refresh();
    set({ user: response.data.user, isAuthenticated: true });
  },
}));
