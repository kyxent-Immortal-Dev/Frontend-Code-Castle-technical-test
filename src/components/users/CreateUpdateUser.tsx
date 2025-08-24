import React, { useState, useEffect } from 'react';
import type { DataUsers } from '../../interfaces/users/Users.Interfaces';
import { useUsersContext } from '../../hooks/useUsersContext';

interface CreateUpdateUserProps {
  mode: 'create' | 'edit';
  user?: DataUsers | null;
  onSuccess: () => void;
}

// Interface for form data
interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  is_active: boolean;
}

// Interface for user with optional password fields
interface UserWithPassword extends Omit<DataUsers, 'id' | 'email_verified_at' | 'created_at' | 'updated_at'> {
  password?: string;
  password_confirmation?: string;
}

export const CreateUpdateUser = ({ mode, user, onSuccess }: CreateUpdateUserProps) => {
  const { createUser, updateUser } = useUsersContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'vendedor',
    is_active: true
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        is_active: user.is_active
      });
    }
  }, [mode, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'create') {
        // For create, we need to send the form data
        const createData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role: formData.role,
          is_active: formData.is_active
        };
        await createUser(createData as unknown as DataUsers);
      } else if (mode === 'edit' && user) {
        // For edit, we need to send the complete user data
        const updateData = { 
          ...user,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active
        };
        
        // Only include password if it was changed
        if (formData.password) {
          (updateData as UserWithPassword).password = formData.password;
          (updateData as UserWithPassword).password_confirmation = formData.password_confirmation;
        }
        
        await updateUser(updateData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (mode === 'create') {
      return formData.name && formData.email && formData.password && formData.password_confirmation;
    }
    return formData.name && formData.email;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nombre completo *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Ingresa el nombre completo"
          required
        />
      </div>

      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Correo electrónico *</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="usuario@ejemplo.com"
          required
        />
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              {mode === 'create' ? 'Contraseña *' : 'Nueva contraseña'}
            </span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required={mode === 'create'}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              {mode === 'create' ? 'Confirmar contraseña *' : 'Confirmar nueva contraseña'}
            </span>
          </label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Repite la contraseña"
            minLength={8}
            required={mode === 'create'}
          />
        </div>
      </div>

      {/* Role Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Rol *</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          required
        >
          <option value="vendedor">Vendedor</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      {/* Active Status Field */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Usuario activo</span>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="btn btn-outline"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'
          )}
        </button>
      </div>
    </form>
  );
};
