
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { AuthGuardProtected } from '../guards/Auth.guard.protected'
import { AuthGuardPublic } from '../guards/Auth.guard.public'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes - require authentication */}
        <Route path="/" element={
          <AuthGuardProtected>
            <AppLayout />
          </AuthGuardProtected>
        }>
          <Route index element={<HomePage />} />
        </Route>
        
        {/* Public routes - redirect if already authenticated */}
        <Route path="/login" element={
          <AuthGuardPublic>
            <LoginPage />
          </AuthGuardPublic>
        } />
        <Route path="/register" element={
          <AuthGuardPublic>
            <RegisterPage />
          </AuthGuardPublic>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
