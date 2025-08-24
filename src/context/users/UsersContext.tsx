import React, { useState, useCallback, type ReactNode } from 'react';
import type { DataUsers } from '../../interfaces/users/Users.Interfaces';
import { UserService } from '../../services/api/User.service';
import { UsersContext, type UsersContextType } from './UsersContextValue';



interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<DataUsers[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userService = new UserService();

  const getUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getUsers();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      const errorMessage = 'Error al obtener usuarios';
      setError(errorMessage);
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (user: Omit<DataUsers, 'id' | 'email_verified_at' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.createUser(user as unknown as DataUsers);
      
      if (response.data) {
        // Simplemente recargar toda la lista
        await getUsers();
      }
      return response.data as unknown as DataUsers;
    } catch (error) {
      const errorMessage = 'Error al crear usuario';
      setError(errorMessage);
      console.error('Error creating user:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (user: DataUsers) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.updateUser(user);
      
      if (response.data) {
        // Simplemente recargar toda la lista
        await getUsers();
      }
      return response.data as unknown as DataUsers;
    } catch (error) {
      const errorMessage = 'Error al actualizar usuario';
      setError(errorMessage);
      console.error('Error updating user:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await userService.deleteUser(id);
      
      // Simplemente recargar toda la lista
      await getUsers();
    } catch (error) {
      const errorMessage = 'Error al eliminar usuario';
      setError(errorMessage);
      console.error('Error deleting user:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id: string): Promise<DataUsers | null> => {
    try {
      const response = await userService.getUserById(id);
      return response.data as unknown as DataUsers | null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }, []);

  const value: UsersContextType = {
    users,
    isLoading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}; 