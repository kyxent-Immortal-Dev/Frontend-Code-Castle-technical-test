import { createContext } from 'react';
import type { DataUsers } from '../../interfaces/users/Users.Interfaces';

export interface UsersContextType {
  users: DataUsers[];
  isLoading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  createUser: (user: Omit<DataUsers, 'id' | 'email_verified_at' | 'created_at' | 'updated_at'>) => Promise<DataUsers>;
  updateUser: (user: DataUsers) => Promise<DataUsers>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => Promise<DataUsers | null>;
}

export const UsersContext = createContext<UsersContextType | undefined>(undefined); 