import React from 'react';
import type { PurchaseInterface } from '../../interfaces/inventary/Purchases.interface';

interface PurchaseDetailsProps {
  purchase: PurchaseInterface | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({
  purchase,
  onEdit,
  onDelete
}) => {
  // Early return if purchase is null
  if (!purchase) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto opacity-40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">Compra no encontrada</h3>
        <p className="opacity-70">No se pudo cargar la información de la compra.</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compra #{purchase.id}</h2>
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
        <span className={`badge ${getStatusBadge(purchase.status)}`}>
          {getStatusText(purchase.status)}
        </span>
        <span className="text-sm opacity-70">
          Creada el {formatDate(purchase.purchase_date)}
        </span>
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supplier */}
        <div className="card bg-base-100 border">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold">Proveedor</span>
            </div>
            <p className="font-bold">{purchase.supplier?.name || 'N/A'}</p>
            <p className="text-sm opacity-70">{purchase.supplier?.email || 'N/A'}</p>
          </div>
        </div>

        {/* User */}
        <div className="card bg-base-100 border">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-semibold">Usuario</span>
            </div>
            <p className="font-bold">{purchase.user?.name || 'N/A'}</p>
            <p className="text-sm opacity-70 capitalize">{purchase.user?.role || 'N/A'}</p>
          </div>
        </div>

        {/* Total */}
        <div className="card bg-base-100 border">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-semibold">Total</span>
            </div>
            <p className="text-2xl font-bold text-success">{formatPrice(purchase.total_amount)}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {purchase.notes && (
        <div className="card bg-base-200">
          <div className="card-body p-4">
            <h3 className="font-semibold mb-2">Notas</h3>
            <p className="opacity-70">{purchase.notes}</p>
          </div>
        </div>
      )}

      {/* Purchase Details */}
      <div className="card bg-base-100 border">
        <div className="card-body p-4">
          <h3 className="font-semibold mb-4">Detalles de la Compra</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Compra</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {purchase.details.map((detail) => (
                  <tr key={detail.id}>
                    <td>
                      <div>
                        <div className="font-semibold">{detail.product?.name || 'N/A'}</div>
                        <div className="text-sm opacity-70">{detail.product?.description || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="text-center">{detail.quantity}</td>
                    <td className="text-success">{formatPrice(detail.purchase_price)}</td>
                    <td className="font-semibold text-success">{formatPrice(detail.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
