import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../../interfaces/sales/Client.interfaces';
import { useClientStore } from '../../store/useClient.service';

interface CreateUpdateClientProps {
  mode: 'create' | 'edit';
  client?: Client | null;
  onSuccess: () => void;
}

// Interface for form data
interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export const CreateUpdateClient = ({ mode, client, onSuccess }: CreateUpdateClientProps) => {
  const { createClient, updateClient } = useClientStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<ClientFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      is_active: true
    }
  });

  useEffect(() => {
    if (mode === 'edit' && client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        is_active: client.is_active
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        is_active: true
      });
    }
  }, [mode, client, reset]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (mode === 'create') {
        const createData: CreateClientRequest = {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          is_active: data.is_active
        };
        await createClient(createData);
      } else if (mode === 'edit' && client) {
        const updateData: UpdateClientRequest = {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          is_active: data.is_active
        };
        await updateClient(client.id, updateData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving client:', error);
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
          placeholder="Ingresa el nombre completo del cliente"
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
          placeholder="cliente@ejemplo.com"
        />
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.email.message}</span>
          </label>
        )}
      </div>

      {/* Phone Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Teléfono</span>
        </label>
        <input
          type="tel"
          {...register('phone', { 
            pattern: {
              value: /^[+]?[0-9\s\-()]+$/,
              message: 'El teléfono no es válido'
            }
          })}
          className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
          placeholder="+1234567890"
        />
        {errors.phone && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.phone.message}</span>
          </label>
        )}
      </div>

      {/* Active Status Field */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Cliente activo</span>
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
            mode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente'
          )}
        </button>
      </div>
    </form>
  );
};
