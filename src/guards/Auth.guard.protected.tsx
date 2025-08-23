import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthService } from '../store/useAuth.service';

interface AuthGuardProtectedProps {
  children: React.ReactNode;
}

export const AuthGuardProtected = ({ children }: AuthGuardProtectedProps) => {
  const { isAuthenticated, checkAuth } = useAuthService();

  useEffect(() => {
    // Check authentication status on component mount
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking authentication
  

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};
