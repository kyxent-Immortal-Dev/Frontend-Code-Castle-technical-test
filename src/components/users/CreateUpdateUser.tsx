import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch
  } = useForm<UserFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'vendedor',
      is_active: true
    }
  });

  const watchedPassword = watch('password');

  useEffect(() => {
    if (mode === 'edit' && user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        is_active: user.is_active
      });
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'vendedor',
        is_active: true
      });
    }
  }, [mode, user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (mode === 'create') {
        // For create, we need to send the form data
        const createData = {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          role: data.role,
          is_active: data.is_active
        };
        await createUser(createData as unknown as DataUsers);
      } else if (mode === 'edit' && user) {
        // For edit, we need to send the complete user data
        const updateData = { 
          ...user,
          name: data.name,
          email: data.email,
          role: data.role,
          is_active: data.is_active
        };
        
        // Only include password if it was changed
        if (data.password) {
          (updateData as UserWithPassword).password = data.password;
          (updateData as UserWithPassword).password_confirmation = data.password_confirmation;
        }
        
        await updateUser(updateData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nombre completo *</span>
        </label>
        <input
          type="text"
          {...register('name', { 
            required: 'El nombre es requerido',
            minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
          })}
          className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
          placeholder="Ingresa el nombre completo"
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name.message}</span>
          </label>
        )}
      </div>

      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Correo electrónico *</span>
        </label>
        <input
          type="email"
          {...register('email', { 
            required: 'El email es requerido',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'El email no es válido'
            }
          })}
          className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
          placeholder="usuario@ejemplo.com"
        />
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.email.message}</span>
          </label>
        )}
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
            {...register('password', { 
              required: mode === 'create' ? 'La contraseña es requerida' : false,
              minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
            })}
            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.password.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              {mode === 'create' ? 'Confirmar contraseña *' : 'Confirmar nueva contraseña'}
            </span>
          </label>
          <input
            type="password"
            {...register('password_confirmation', { 
              required: mode === 'create' ? 'La confirmación de contraseña es requerida' : false,
              validate: (value) => {
                if (mode === 'create' || watchedPassword) {
                  return value === watchedPassword || 'Las contraseñas no coinciden';
                }
                return true;
              }
            })}
            className={`input input-bordered w-full ${errors.password_confirmation ? 'input-error' : ''}`}
            placeholder="Repite la contraseña"
          />
          {errors.password_confirmation && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.password_confirmation.message}</span>
            </label>
          )}
        </div>
      </div>

      {/* Role Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Rol *</span>
        </label>
        <select
          {...register('role', { 
            required: 'El rol es requerido' 
          })}
          className={`select select-bordered w-full ${errors.role ? 'select-error' : ''}`}
        >
          <option value="vendedor">Vendedor</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.role && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.role.message}</span>
          </label>
        )}
      </div>

      {/* Active Status Field */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Usuario activo</span>
          <input
            type="checkbox"
            {...register('is_active')}
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
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'
          )}
        </button>
      </div>
    </form>
  );
};
