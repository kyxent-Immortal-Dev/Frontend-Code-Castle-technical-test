import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { usePurchasesContext } from '../../hooks/usePurchasesContext';
import { useSuppliersContext } from '../../hooks/useSuppliersContext';
import { useProductsContext } from '../../hooks/useProductsContext';
import type { PurchaseInterface, PurchaseFormData } from '../../interfaces/inventary/Purchases.interface';

interface CreateUpdatePurchaseProps {
  onClose: () => void;
  purchase: PurchaseInterface | null;
}

export const CreateUpdatePurchase: React.FC<CreateUpdatePurchaseProps> = ({ 
  onClose, 
  purchase 
}) => {
  const { createPurchase, updatePurchase } = usePurchasesContext();
  const { suppliers } = useSuppliersContext();
  const { products } = useProductsContext();
  const isEditing = !!purchase;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    control,
    watch
  } = useForm<PurchaseFormData>({
    mode: 'onChange',
    defaultValues: {
      supplier_id: 0,
      user_id: 1, // Default user ID
      purchase_date: new Date().toISOString().split('T')[0],
      total_amount: '0.00',
      status: 'pending',
      notes: '',
      details: [{ product_id: 0, quantity: 1, purchase_price: '0.00', subtotal: '0.00' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details'
  });

  const watchedDetails = watch('details');

  useEffect(() => {
    if (purchase) {
      reset({
        supplier_id: purchase.supplier_id,
        user_id: purchase.user_id,
        purchase_date: new Date(purchase.purchase_date).toISOString().split('T')[0],
        total_amount: purchase.total_amount,
        status: purchase.status,
        notes: purchase.notes,
        details: purchase.details.map(detail => ({
          product_id: detail.product_id,
          quantity: detail.quantity,
          purchase_price: detail.purchase_price,
          subtotal: detail.subtotal
        }))
      });
    } else {
      reset({
        supplier_id: 0,
        user_id: 1,
        purchase_date: new Date().toISOString().split('T')[0],
        total_amount: '0.00',
        status: 'pending',
        notes: '',
        details: [{ product_id: 0, quantity: 1, purchase_price: '0.00', subtotal: '0.00' }]
      });
    }
  }, [purchase, reset]);

  // Calculate total when details change
  useEffect(() => {
    const total = watchedDetails.reduce((sum, detail) => {
      return sum + (parseFloat(detail.subtotal) || 0);
    }, 0);
    
    // Update total_amount field
    const totalInput = document.querySelector('input[name="total_amount"]') as HTMLInputElement;
    if (totalInput) {
      totalInput.value = total.toFixed(2);
    }
  }, [watchedDetails]);

  const calculateSubtotal = (index: number) => {
    const detail = watchedDetails[index];
    if (detail.quantity && detail.purchase_price) {
      const subtotal = (parseInt(detail.quantity.toString()) * parseFloat(detail.purchase_price)).toFixed(2);
      const subtotalInput = document.querySelector(`input[name="details.${index}.subtotal"]`) as HTMLInputElement;
      if (subtotalInput) {
        subtotalInput.value = subtotal;
      }
    }
  };

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      if (isEditing && purchase) {
        await updatePurchase({
          ...purchase,
          supplier_id: data.supplier_id,
          user_id: data.user_id,
          purchase_date: new Date(data.purchase_date),
          total_amount: data.total_amount,
          status: data.status,
          notes: data.notes,
          details: data.details.map(detail => ({
            ...detail,
            id: Date.now() + Math.random(),
            purchase_id: purchase.id,
            product: { id: 0, name: '', description: '', unit_price: '', stock: 0, is_active: false }
          }))
        });
      } else {
        await createPurchase(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  };

  const addDetail = () => {
    append({ product_id: 0, quantity: 1, purchase_price: '0.00', subtotal: '0.00' });
  };

  const removeDetail = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg mb-4">
        {isEditing ? 'Editar Compra' : 'Nueva Compra'}
      </h3>
        
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Proveedor *</span>
            </label>
            <select
              {...register('supplier_id', { 
                required: 'El proveedor es requerido',
                min: { value: 1, message: 'Selecciona un proveedor' }
              })}
              className={`select select-bordered w-full ${errors.supplier_id ? 'select-error' : ''}`}
            >
              <option value={0}>Selecciona un proveedor</option>
              {suppliers.filter(supplier => supplier.is_active).map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.supplier_id && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.supplier_id.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Fecha de Compra *</span>
            </label>
            <input
              type="date"
              {...register('purchase_date', { 
                required: 'La fecha es requerida' 
              })}
              className={`input input-bordered w-full ${errors.purchase_date ? 'input-error' : ''}`}
            />
            {errors.purchase_date && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.purchase_date.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Estado *</span>
            </label>
            <select
              {...register('status', { 
                required: 'El estado es requerido' 
              })}
              className={`select select-bordered w-full ${errors.status ? 'select-error' : ''}`}
            >
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
            {errors.status && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.status.message}</span>
              </label>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Notas</span>
          </label>
          <textarea
            {...register('notes')}
            className="textarea textarea-bordered w-full"
            placeholder="Notas adicionales sobre la compra"
            rows={3}
          />
        </div>

        {/* Purchase Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Detalles de la Compra</h4>
            <button
              type="button"
              onClick={addDetail}
              className="btn btn-outline btn-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Producto
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="card bg-base-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Producto *</span>
                  </label>
                  <select
                    {...register(`details.${index}.product_id`, { 
                      required: 'El producto es requerido',
                      min: { value: 1, message: 'Selecciona un producto' }
                    })}
                    className={`select select-bordered w-full ${errors.details?.[index]?.product_id ? 'select-error' : ''}`}
                  >
                    <option value={0}>Selecciona un producto</option>
                    {products.filter(product => product.is_active).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Cantidad *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register(`details.${index}.quantity`, { 
                      required: 'La cantidad es requerida',
                      min: { value: 1, message: 'La cantidad debe ser mayor a 0' }
                    })}
                    onChange={() => calculateSubtotal(index)}
                    className={`input input-bordered w-full ${errors.details?.[index]?.quantity ? 'input-error' : ''}`}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Precio Compra *</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`details.${index}.purchase_price`, { 
                      required: 'El precio es requerido',
                      min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
                    })}
                    onChange={() => calculateSubtotal(index)}
                    className={`input input-bordered w-full ${errors.details?.[index]?.purchase_price ? 'input-error' : ''}`}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subtotal</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`details.${index}.subtotal`)}
                    className="input input-bordered w-full bg-base-100"
                    readOnly
                  />
                </div>

                <div className="form-control">
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="btn btn-error btn-sm"
                    disabled={fields.length === 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Total de la Compra</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register('total_amount')}
            className="input input-bordered w-full bg-base-100 text-lg font-bold"
            readOnly
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
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
              isEditing ? 'Actualizar Compra' : 'Crear Compra'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
