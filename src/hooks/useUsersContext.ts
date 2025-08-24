import { useContext } from 'react';
import { UsersContext } from '../context/users/UsersContextValue';

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext must be used within a UsersProvider');
  }
  return context;
}; 