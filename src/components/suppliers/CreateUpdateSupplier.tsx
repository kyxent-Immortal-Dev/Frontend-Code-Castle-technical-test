import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSuppliersContext } from '../../hooks/useSuppliersContext'
import type { SupplierInterface } from '../../interfaces/inventary/Supliers.interface'

interface CreateUpdateSupplierProps {
  onClose: () => void;
  supplier: SupplierInterface | null;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

export const CreateUpdateSupplier: React.FC<CreateUpdateSupplierProps> = ({ 
  onClose, 
  supplier 
}) => {
  const { createSupplier, updateSupplier, isLoading } = useSuppliersContext();
  const isEditing = !!supplier;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      is_active: true
    }
  });

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        is_active: supplier.is_active
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        is_active: true
      });
    }
  }, [supplier, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && supplier) {
        await updateSupplier({
          ...supplier,
          ...data
        });
      } else {
        await createSupplier({
          id: 0, // Will be assigned by the backend
          ...data,
          purchases: []
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg mb-4">
        {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      </h3>
        
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nombre *</span>
          </label>
          <input
            type="text"
            {...register('name', { 
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            })}
            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
            placeholder="Nombre del proveedor"
          />
          {errors.name && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.name.message}</span>
            </label>
          )}
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email *</span>
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
            placeholder="email@ejemplo.com"
          />
          {errors.email && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.email.message}</span>
            </label>
          )}
        </div>

        {/* Teléfono y Dirección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Teléfono *</span>
            </label>
            <input
              type="tel"
              {...register('phone', { 
                required: 'El teléfono es requerido',
                minLength: { value: 10, message: 'El teléfono debe tener al menos 10 dígitos' },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'El teléfono debe contener solo números'
                }
              })}
              className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.phone.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Dirección *</span>
            </label>
            <input
              type="text"
              {...register('address', { 
                required: 'La dirección es requerida',
                minLength: { value: 10, message: 'La dirección debe tener al menos 10 caracteres' }
              })}
              className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`}
              placeholder="123 Business St, City, State 12345"
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.address.message}</span>
              </label>
            )}
          </div>
        </div>

        {/* Estado Activo */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Estado Activo</span>
            <input
              type="checkbox"
              {...register('is_active')}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>

        {/* Botones */}
        <div className="modal-action">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isLoading || isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !isValid || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              isEditing ? 'Actualizar' : 'Crear'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
