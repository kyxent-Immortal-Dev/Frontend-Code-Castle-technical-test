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
  const { suppliers, getSuppliers, isLoading: isLoadingSuppliers } = useSuppliersContext();
  const { products, getProducts, isLoading: isLoadingProducts } = useProductsContext();
  const isEditing = !!purchase;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    control,
    watch,
    setValue
  } = useForm<PurchaseFormData>({
    mode: 'onChange',
    defaultValues: {
      supplier_id: 0,
      user_id: 1, // Default user ID
      purchase_date: new Date().toISOString().split('T')[0], // Today's date
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

  // Helper function to calculate total (similar to CreateUpdateSales)
  const calculateTotal = () => {
    return watchedDetails.reduce((total, detail) => {
      const quantity = parseInt(detail.quantity?.toString() || '0');
      const price = parseFloat(detail.purchase_price || '0');
      return total + (quantity * price);
    }, 0);
  };

  // Watch for changes to force re-renders
  watch('total_amount');

  // Load suppliers and products when component mounts
  useEffect(() => {
    getSuppliers();
    getProducts();
  }, [getSuppliers, getProducts]);

  // Update total when details change
  useEffect(() => {
    const total = calculateTotal().toFixed(2);
    setValue('total_amount', total);
  }, [watchedDetails, setValue]);



  // Ensure suppliers and products are arrays
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const activeSuppliers = safeSuppliers.filter(supplier => supplier.is_active);
  const activeProducts = safeProducts.filter(product => product.is_active);

  useEffect(() => {
    if (purchase) {
      const detailsWithSubtotals = purchase.details.map(detail => ({
        product_id: detail.product_id,
        quantity: detail.quantity,
        purchase_price: detail.purchase_price,
        subtotal: (detail.quantity * parseFloat(detail.purchase_price)).toFixed(2)
      }));
      
      reset({
        supplier_id: purchase.supplier_id,
        user_id: purchase.user_id,
        purchase_date: new Date(purchase.purchase_date).toISOString().split('T')[0],
        total_amount: purchase.total_amount,
        status: purchase.status,
        notes: purchase.notes,
        details: detailsWithSubtotals
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

  // Helper function to calculate subtotal for a specific detail
  const calculateSubtotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  // Show loading state while data is being fetched
  if (isLoadingSuppliers || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }

  // Show error if no data is available
  if (activeSuppliers.length === 0 || activeProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="alert alert-warning">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="font-bold">Datos no disponibles</h3>
            <div className="text-sm">
              {activeSuppliers.length === 0 && (
                <div>
                  <p>• No hay proveedores activos disponibles</p>
                  <p className="text-xs opacity-70 mt-1">
                    Total proveedores: {safeSuppliers.length} | 
                    Activos: {activeSuppliers.length} | 
                    Inactivos: {safeSuppliers.filter(s => !s.is_active).length}
                  </p>
                  {safeSuppliers.length > 0 && (
                    <div className="text-xs opacity-70 mt-1">
                      <p>Proveedores encontrados:</p>
                      {safeSuppliers.map(s => (
                        <p key={s.id} className="ml-2">
                          • {s.name} ({s.is_active ? 'Activo' : 'Inactivo'})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeProducts.length === 0 && (
                <div>
                  <p>• No hay productos activos disponibles</p>
                  <p className="text-xs opacity-70 mt-1">
                    Total productos: {safeProducts.length} | 
                    Activos: {activeProducts.length} | 
                    Inactivos: {safeProducts.filter(p => !p.is_active).length}
                  </p>
                </div>
              )}
            </div>
            <div className="text-xs opacity-70 mt-2">
              <p>Estado de carga:</p>
              <p>• Proveedores: {isLoadingSuppliers ? 'Cargando...' : 'Completado'}</p>
              <p>• Productos: {isLoadingProducts ? 'Cargando...' : 'Completado'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      // Validate no duplicate products
      const productIds = data.details.map(detail => detail.product_id).filter(id => id > 0);
      const uniqueProductIds = [...new Set(productIds)];
      
      if (productIds.length !== uniqueProductIds.length) {
        alert('No puede haber productos duplicados en la misma compra. Por favor, elimina los productos duplicados.');
        return;
      }

      // Calculate total dynamically
      const calculatedTotal = calculateTotal().toFixed(2);
      
      if (isEditing && purchase) {
        await updatePurchase({
          ...purchase,
          supplier_id: data.supplier_id,
          user_id: data.user_id,
          purchase_date: new Date(data.purchase_date),
          total_amount: calculatedTotal,
          status: data.status,
          notes: data.notes,
          details: data.details.map(detail => ({
            ...detail,
            id: Math.floor(Math.random() * 999999) + 1,
            purchase_id: purchase.id,
            product: { id: 0, name: '', description: '', unit_price: '', stock: 0, is_active: false }
          }))
        });
      } else {
        await createPurchase({
          ...data,
          total_amount: calculatedTotal
        });
        reset();
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
              <span className="label-text-alt text-info">
                {activeSuppliers.length} activos disponibles
              </span>
            </label>
            <select
              {...register('supplier_id', { 
                required: 'El proveedor es requerido',
                min: { value: 1, message: 'Selecciona un proveedor' }
              })}
              className={`select select-bordered w-full ${errors.supplier_id ? 'select-error' : ''}`}
            >
              <option value={0}>Selecciona un proveedor</option>
              {activeSuppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ✅
                </option>
              ))}
              {activeSuppliers.length === 0 && safeSuppliers.length > 0 && (
                <optgroup label="⚠️ Solo proveedores inactivos disponibles">
                  {safeSuppliers.filter(s => !s.is_active).map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} ❌ (Inactivo)
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            {activeSuppliers.length === 0 && (
              <label className="label">
                <span className="label-text-alt text-warning">No hay proveedores activos disponibles</span>
              </label>
            )}
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
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              {...register('purchase_date', { 
                required: 'La fecha es requerida',
                validate: (value) => {
                  const today = new Date();
                  const selectedDate = new Date(value);
                  if (selectedDate > today) {
                    return 'La fecha de compra no puede ser en el futuro.';
                  }
                  return true;
                }
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
                    <span className="label-text-alt text-info">
                      {activeProducts.length} activos
                    </span>
                  </label>
                  <select
                    {...register(`details.${index}.product_id`, { 
                      required: 'El producto es requerido',
                      min: { value: 1, message: 'Selecciona un producto' },
                      validate: (value) => {
                        if (value === 0) return true; // Skip validation for placeholder
                        
                        // Check for duplicates
                        const currentProductIds = watchedDetails
                          .map((detail, idx) => idx !== index ? detail.product_id : null)
                          .filter(id => id !== null && id > 0);
                        
                        if (currentProductIds.includes(value)) {
                          return 'Producto duplicado';
                        }
                        
                        return true;
                      }
                    })}
                    className={`select select-bordered w-full ${errors.details?.[index]?.product_id ? 'select-error' : ''}`}
                  >
                    <option value={0}>Selecciona un producto</option>
                    {activeProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ✅
                      </option>
                    ))}
                    {activeProducts.length === 0 && safeProducts.length > 0 && (
                      <optgroup label="⚠️ Solo productos inactivos disponibles">
                        {safeProducts.filter(p => !p.is_active).map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ❌ (Inactivo)
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {errors.details?.[index]?.product_id && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.details[index]?.product_id?.message}</span>
                    </label>
                  )}
                  {activeProducts.length === 0 && (
                    <label className="label">
                      <span className="label-text-alt text-warning">No hay productos activos disponibles</span>
                    </label>
                  )}
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
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value) || 0;
                      const price = parseFloat(watchedDetails[index]?.purchase_price || '0');
                      if (quantity > 0 && price > 0) {
                        const subtotal = (quantity * price).toFixed(2);
                        setValue(`details.${index}.subtotal`, subtotal);
                      }
                    }}
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
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const quantity = parseInt(watchedDetails[index]?.quantity?.toString() || '0');
                      if (quantity > 0 && price > 0) {
                        const subtotal = (quantity * price).toFixed(2);
                        setValue(`details.${index}.subtotal`, subtotal);
                      }
                    }}
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
                    value={calculateSubtotal(
                      parseInt(watchedDetails[index]?.quantity?.toString() || '0'),
                      parseFloat(watchedDetails[index]?.purchase_price || '0')
                    ).toFixed(2)}
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
            value={watch('total_amount') || calculateTotal().toFixed(2)}
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
