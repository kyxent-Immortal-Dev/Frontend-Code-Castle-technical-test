import { create } from "zustand";
import type { LoginUserI } from "../interfaces/auth/LoginI";

interface AuthServiceStore {
  user: LoginUserI | null;
  setUser: (user: LoginUserI | null) => void;
}


export const useAuthService = create<AuthServiceStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));