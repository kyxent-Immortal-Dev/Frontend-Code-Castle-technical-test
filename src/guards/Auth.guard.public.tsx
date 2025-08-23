import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { useAuthService } from '../store/useAuth.service';

interface AuthGuardPublicProps {
  children: React.ReactNode;
}

export const AuthGuardPublic = ({ children }: AuthGuardPublicProps) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthService();

  useEffect(() => {
    // Check authentication status on component mount
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the public content
  return <>{children}</>;
}; 