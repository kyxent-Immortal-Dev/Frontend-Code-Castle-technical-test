import React, { useEffect, useState } from 'react';
import type { PurchaseInterface } from '../../interfaces/inventary/Purchases.interface';
import { PurchaseStatusManager } from './PurchaseStatusManager';

interface PurchaseDetailsProps {
  purchase: PurchaseInterface | null;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: () => void;
  onClose?: () => void; // Add onClose prop
}

export const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ 
  purchase, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onClose 
}) => {
  // Track the previous status to detect changes
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  // Auto-close modal when status changes from pending to completed/cancelled
  useEffect(() => {
    if (purchase && previousStatus === 'pending' && purchase.status !== 'pending' && onClose) {
      // Status changed from pending to completed/cancelled, close modal after delay
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Give user time to see the success message
      
      return () => clearTimeout(timer);
    }
    
    // Update previous status for next comparison
    if (purchase) {
      setPreviousStatus(purchase.status);
    }
  }, [purchase?.status, previousStatus, onClose]);

  if (!purchase) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No se ha seleccionado ninguna compra</p>
      </div>
    );
  }

  // Get permissions based on status
  const isPending = purchase.status === 'pending';
  const canEdit = isPending;
  const canDelete = isPending;

  // Enhanced status change handler that includes modal closing
  const handleStatusChange = () => {
    onStatusChange();
    // The modal will be closed automatically by the useEffect when status changes
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Compra #{purchase.id}</h2>
          <p className="text-gray-600">
            {new Date(purchase.purchase_date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className={`badge badge-lg ${
            purchase.status === 'pending' ? 'badge-warning' :
            purchase.status === 'completed' ? 'badge-success' : 'badge-error'
          }`}>
            {purchase.status === 'pending' ? 'Pendiente' :
             purchase.status === 'completed' ? 'Completada' : 'Cancelada'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {canEdit && (
          <button
            onClick={onEdit}
            className="btn btn-warning"
          >
            Editar Compra
          </button>
        )}
        {canDelete && (
          <button
            onClick={onDelete}
            className="btn btn-error"
          >
            Eliminar Compra
          </button>
        )}
      </div>

      {/* Info about auto-close */}
      {isPending && (
        <div className="alert alert-info">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Nota:</strong> Al cambiar el estado de la compra, este modal se cerrará automáticamente en 2 segundos.
          </span>
        </div>
      )}

      {/* Purchase Status Manager */}
      <PurchaseStatusManager purchase={purchase} onStatusChange={handleStatusChange} />

      {/* Purchase Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Information */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Información del Proveedor</h3>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {purchase.supplier?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {purchase.supplier?.email || 'N/A'}</p>
              <p><strong>Teléfono:</strong> {purchase.supplier?.phone || 'N/A'}</p>
              <p><strong>Dirección:</strong> {purchase.supplier?.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Información del Usuario</h3>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {purchase.user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {purchase.user?.email || 'N/A'}</p>
              <p><strong>Rol:</strong> {purchase.user?.role || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Details */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Detalles de la Compra</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {purchase.details.map((detail) => (
                  <tr key={detail.id}>
                    <td>{detail.product?.name || 'N/A'}</td>
                    <td>{detail.quantity}</td>
                    <td>${parseFloat(detail.purchase_price).toFixed(2)}</td>
                    <td>${parseFloat(detail.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">
              Total: ${parseFloat(purchase.total_amount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {purchase.notes && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Notas</h3>
            <p className="whitespace-pre-wrap">{purchase.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};
