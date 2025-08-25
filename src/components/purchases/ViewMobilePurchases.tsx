import React from 'react';
import type { PurchaseInterface } from '../../interfaces/inventary/Purchases.interface';

interface ViewMobilePurchasesProps {
  purchases: PurchaseInterface[];
  onViewDetails: (purchase: PurchaseInterface) => void;
  onEdit: (purchase: PurchaseInterface) => void;
  onDelete: (purchase: PurchaseInterface) => void;
  getPurchasePermissions: (purchase: PurchaseInterface) => {
    canEdit: boolean;
    canDelete: boolean;
    canComplete: boolean;
    canCancel: boolean;
    canChangeStatus: boolean;
  };
}

export const ViewMobilePurchases: React.FC<ViewMobilePurchasesProps> = ({
  purchases,
  onViewDetails,
  onEdit,
  onDelete,
  getPurchasePermissions
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
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

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/50 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No se encontraron compras</h3>
        <p className="text-base-content/70 mb-4">Intenta ajustar los filtros o crear una nueva compra</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => {
        const permissions = getPurchasePermissions(purchase);
        return (
          <div key={purchase.id} className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10">
                      <span className="text-xs font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        #{purchase.id}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Compra #{purchase.id}</h3>
                    <p className="text-sm text-base-content/70">
                      {purchase.details.length} productos
                    </p>
                  </div>
                </div>
                <div className={`badge ${getStatusBadge(purchase.status)} badge-outline`}>
                  {getStatusText(purchase.status)}
                </div>
              </div>

              {/* Purchase Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-base-content/70">Proveedor:</span>
                  <span className="text-sm font-semibold text-right">
                    {purchase.supplier?.name || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-base-content/70">Usuario:</span>
                  <span className="text-sm font-semibold text-right">
                    {purchase.user?.name || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-base-content/70">Fecha:</span>
                  <span className="text-sm font-semibold">
                    {formatDate(purchase.purchase_date)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-base-content/70">Total:</span>
                  <span className="text-base font-bold text-success">
                    {formatPrice(purchase.total_amount)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions justify-end pt-3 border-t border-base-300">
                <button
                  onClick={() => onViewDetails(purchase)}
                  className="btn btn-sm btn-info flex-1 sm:flex-none"
                >
                  Ver Detalles
                </button>
                {permissions.canEdit && (
                  <button
                    onClick={() => onEdit(purchase)}
                    className="btn btn-sm btn-warning flex-1 sm:flex-none"
                  >
                    Editar
                  </button>
                )}
                {permissions.canDelete && (
                  <button
                    onClick={() => onDelete(purchase)}
                    className="btn btn-sm btn-error flex-1 sm:flex-none"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};