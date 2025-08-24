import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { CreateSaleRequest } from '../../interfaces/sales/Sales.interfaces';
import { useSaleStore } from '../../store/useSale.service';
import { useClientStore } from '../../store/useClient.service';
import { useProductsContext } from '../../hooks/useProductsContext';


interface CreateUpdateSalesProps {
  mode: 'create' | 'edit';
  sale?: unknown | null;
  onSuccess: () => void;
}

// Interface for form data
interface SaleFormData {
  client_id: number;
  sale_date: string;
  notes: string;
  sale_details: {
    product_id: number;
    quantity: number;
    sale_price: number;
  }[];
}

export const CreateUpdateSales = ({ mode, sale, onSuccess }: CreateUpdateSalesProps) => {
  const { createSale } = useSaleStore();
  const { clients, getClients } = useClientStore();
  const { products, getProducts } = useProductsContext();
  
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<SaleFormData>({
    mode: 'onChange',
    defaultValues: {
      client_id: 0,
      sale_date: new Date().toISOString().split('T')[0],
      notes: '',
      sale_details: [
        {
          product_id: 0,
          quantity: 1,
          sale_price: 0
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sale_details"
  });

  // Watch for changes to calculate totals
  const watchedSaleDetails = watch("sale_details");

  useEffect(() => {
    // Load data for select options
    getClients();
    getProducts();
  }, [getClients, getProducts]);

  useEffect(() => {
    if (mode === 'edit' && sale && typeof sale === 'object' && sale !== null) {
      const saleObj = sale as { client_id: number; sale_date: string; notes?: string; sale_details: Array<{ product_id: number; quantity: number; sale_price: number }> };
      reset({
        client_id: saleObj.client_id,
        sale_date: saleObj.sale_date.split('T')[0],
        notes: saleObj.notes || '',
        sale_details: saleObj.sale_details.map((detail) => ({
          product_id: detail.product_id,
          quantity: detail.quantity,
          sale_price: detail.sale_price
        }))
      });
    }
  }, [mode, sale, reset]);

  const calculateSubtotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  const calculateTotal = () => {
    return watchedSaleDetails.reduce((total, detail) => {
      return total + calculateSubtotal(detail.quantity || 0, detail.sale_price || 0);
    }, 0);
  };

  const handleProductChange = (index: number, productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const unitPrice = typeof product.unit_price === 'string' ? parseFloat(product.unit_price) : product.unit_price;
      setValue(`sale_details.${index}.sale_price`, unitPrice);
    }
  };

  const addProductRow = () => {
    append({
      product_id: 0,
      quantity: 1,
      sale_price: 0
    });
  };

  const removeProductRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: SaleFormData) => {
    try {
      setIsLoading(true);
      
      // Validate that at least one product is selected
      if (data.sale_details.some(detail => detail.product_id === 0)) {
        alert('Por favor selecciona todos los productos');
        return;
      }

      const saleData: CreateSaleRequest = {
        client_id: data.client_id,
        sale_date: data.sale_date,
        notes: data.notes,
        sale_details: data.sale_details.map(detail => ({
          product_id: detail.product_id,
          quantity: detail.quantity,
          sale_price: detail.sale_price
        }))
      };

      const success = await createSale(saleData);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving sale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Client Selection */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Cliente *</span>
        </label>
        <select
          {...register('client_id', { 
            required: 'El cliente es requerido',
            validate: value => value > 0 || 'Debes seleccionar un cliente'
          })}
          className={`select select-bordered w-full ${errors.client_id ? 'select-error' : ''}`}
        >
          <option value={0}>Selecciona un cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.email}
            </option>
          ))}
        </select>
        {errors.client_id && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.client_id.message}</span>
          </label>
        )}
      </div>

      {/* Sale Date */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Fecha de venta *</span>
        </label>
        <input
          type="date"
          {...register('sale_date', { 
            required: 'La fecha es requerida' 
          })}
          className={`input input-bordered w-full ${errors.sale_date ? 'input-error' : ''}`}
        />
        {errors.sale_date && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.sale_date.message}</span>
          </label>
        )}
      </div>

      {/* Notes */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Notas</span>
        </label>
        <textarea
          {...register('notes')}
          className="textarea textarea-bordered w-full"
          placeholder="Notas adicionales sobre la venta..."
          rows={3}
        />
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Productos</h3>
          <button
            type="button"
            onClick={addProductRow}
            className="btn btn-sm btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Producto
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="card bg-base-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Product Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Producto *</span>
                </label>
                <select
                  {...register(`sale_details.${index}.product_id`, { 
                    required: 'El producto es requerido',
                    validate: value => value > 0 || 'Debes seleccionar un producto'
                  })}
                  className={`select select-bordered w-full ${errors.sale_details?.[index]?.product_id ? 'select-error' : ''}`}
                  onChange={(e) => handleProductChange(index, parseInt(e.target.value))}
                >
                  <option value={0}>Selecciona un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Stock: {product.stock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cantidad *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  {...register(`sale_details.${index}.quantity`, { 
                    required: 'La cantidad es requerida',
                    min: { value: 1, message: 'La cantidad debe ser al menos 1' }
                  })}
                  className={`input input-bordered w-full ${errors.sale_details?.[index]?.quantity ? 'input-error' : ''}`}
                />
              </div>

              {/* Sale Price */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Precio de venta *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`sale_details.${index}.sale_price`, { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                  className={`input input-bordered w-full ${errors.sale_details?.[index]?.sale_price ? 'input-error' : ''}`}
                />
              </div>

              {/* Actions */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Acciones</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => removeProductRow(index)}
                    className="btn btn-sm btn-error"
                    disabled={fields.length === 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Subtotal for this row */}
            <div className="mt-2 text-right">
              <span className="text-sm font-medium">
                Subtotal: ${calculateSubtotal(
                  watchedSaleDetails[index]?.quantity || 0,
                  watchedSaleDetails[index]?.sale_price || 0
                ).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="card bg-primary text-primary-content p-4">
        <div className="text-center">
          <h3 className="text-xl font-bold">Total de la Venta</h3>
          <p className="text-3xl font-bold">${calculateTotal().toFixed(2)}</p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="btn btn-outline"
          disabled={isSubmitting || isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || isLoading || !isValid}
        >
          {isSubmitting || isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            mode === 'create' ? 'Crear Venta' : 'Actualizar Venta'
          )}
        </button>
      </div>
    </form>
  );
};
