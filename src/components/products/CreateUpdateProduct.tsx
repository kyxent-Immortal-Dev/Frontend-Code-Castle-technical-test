import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProductsContext } from '../../hooks/useProductsContext';
import type { ProductInterface, ProductFormData } from '../../interfaces/inventary/Product.interface';

interface CreateUpdateProductProps {
  onClose: () => void;
  product: ProductInterface | null;
}

export const CreateUpdateProduct: React.FC<CreateUpdateProductProps> = ({ 
  onClose, 
  product 
}) => {
  const { createProduct, updateProduct } = useProductsContext();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset
  } = useForm<ProductFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      unit_price: '',
      stock: 0,
      is_active: true
    }
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        unit_price: product.unit_price,
        stock: product.stock,
        is_active: product.is_active
      });
    } else {
      reset({
        name: '',
        description: '',
        unit_price: '',
        stock: 0,
        is_active: true
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && product) {
        await updateProduct({
          ...product,
          ...data
        });
      } else {
        await createProduct(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg mb-4">
        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
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
            placeholder="Nombre del producto"
          />
          {errors.name && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.name.message}</span>
            </label>
          )}
        </div>

        {/* Descripción */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Descripción *</span>
          </label>
          <textarea
            {...register('description', { 
              required: 'La descripción es requerida',
              minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' }
            })}
            className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
            placeholder="Descripción detallada del producto"
            rows={3}
          />
          {errors.description && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.description.message}</span>
            </label>
          )}
        </div>

        {/* Precio Unitario y Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Precio Unitario *</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('unit_price', { 
                required: 'El precio es requerido',
                min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
              })}
              className={`input input-bordered w-full ${errors.unit_price ? 'input-error' : ''}`}
              placeholder="0.00"
            />
            {errors.unit_price && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.unit_price.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock *</span>
            </label>
            <input
              type="number"
              min="0"
              {...register('stock', { 
                required: 'El stock es requerido',
                min: { value: 1, message: 'El stock debe ser mayor o igual a 1' }
              })}
              className={`input input-bordered w-full ${errors.stock ? 'input-error' : ''}`}
              placeholder="0"
            />
            {errors.stock && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.stock.message}</span>
              </label>
            )}
          </div>
        </div>

        {/* Estado Activo */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Producto Activo</span>
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
              isEditing ? 'Actualizar' : 'Crear'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 