import React from 'react';
import type { PurchaseInterface } from '../../interfaces/inventary/Purchases.interface';

interface DeleteConfirmationProps {
  purchase: PurchaseInterface | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  purchase,
  onConfirm,
  onCancel,
  isLoading
}) => {
  // Early return if purchase is null
  if (!purchase) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-error/10 rounded-full">
          <svg
            className="w-8 h-8 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Error
          </h3>
          <p className="opacity-70 mb-4">
            No se pudo cargar la información de la compra para eliminar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline btn-sm sm:btn-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-error/10 rounded-full">
        <svg
          className="w-8 h-8 text-error"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          ¿Estás seguro?
        </h3>
        <p className="opacity-70 mb-4">
          No podrás revertir esta acción. La compra será eliminada permanentemente.
        </p>
      </div>

      {/* Purchase Info */}
      <div className="card bg-base-200">
        <div className="card-body p-4">
          <div className="text-left space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">ID:</span>
              <span>#{purchase.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Proveedor:</span>
              <span>{purchase.supplier?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Fecha:</span>
              <span>{formatDate(purchase.purchase_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="text-success font-bold">{formatPrice(purchase.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Estado:</span>
              <span className={`badge badge-${purchase.status === 'completed' ? 'success' : purchase.status === 'pending' ? 'warning' : 'error'}`}>
                {purchase.status === 'completed' ? 'Completada' : purchase.status === 'pending' ? 'Pendiente' : 'Cancelada'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline btn-sm sm:btn-md"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn btn-error btn-sm sm:btn-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Sí, eliminar'
          )}
        </button>
      </div>
    </div>
  );
};
