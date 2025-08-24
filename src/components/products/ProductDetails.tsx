import React from 'react';
import type { ProductInterface } from '../../interfaces/inventary/Product.interface';

interface ProductDetailsProps {
  product: ProductInterface | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onEdit,
  onDelete
}) => {
  // Early return if product is null
  if (!product) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Producto no encontrado</h3>
        <p className="text-gray-600">No se pudo cargar la información del producto.</p>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(price));
    } catch {
      return '$0.00';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Sin stock', color: 'text-error' };
    if (stock < 10) return { text: 'Stock bajo', color: 'text-warning' };
    return { text: 'En stock', color: 'text-success' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="btn btn-outline btn-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={onDelete}
            className="btn btn-error btn-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className={`badge ${product.is_active ? 'badge-success' : 'badge-error'}`}>
          {product.is_active ? 'Activo' : 'Inactivo'}
        </span>
        <span className={`badge ${stockStatus.color === 'text-error' ? 'badge-error' : stockStatus.color === 'text-warning' ? 'badge-warning' : 'badge-success'}`}>
          {stockStatus.text}
        </span>
      </div>

      {/* Description */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="font-semibold text-gray-900">Precio Unitario</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatPrice(product.unit_price)}</p>
        </div>

        {/* Stock */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-semibold text-gray-900">Stock Disponible</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{product.stock}</p>
        </div>

        {/* ID */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="font-semibold text-gray-900">ID del Producto</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">#{product.id}</p>
        </div>
      </div>

      {/* Purchase History */}
      {product.purchase_details && product.purchase_details.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Historial de Compras</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID Compra</th>
                  <th>Cantidad</th>
                  <th>Precio Compra</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {product.purchase_details.map((detail) => (
                  <tr key={detail.id}>
                    <td>#{detail.purchase_id}</td>
                    <td>{detail.quantity}</td>
                    <td>{formatPrice(detail.purchase_price)}</td>
                    <td>{formatPrice(detail.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 