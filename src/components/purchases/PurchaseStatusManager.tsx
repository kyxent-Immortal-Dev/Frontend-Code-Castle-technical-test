import React, { useState } from 'react';
import type { PurchaseInterface } from '../../interfaces/inventary/Purchases.interface';
import { usePurchasesContext } from '../../hooks';
import { ModalComponent } from '../atoms';


interface PurchaseStatusManagerProps {
  purchase: PurchaseInterface;
  onStatusChange: () => void;
}

export const PurchaseStatusManager: React.FC<PurchaseStatusManagerProps> = ({ purchase, onStatusChange }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { completePurchase, cancelPurchase } = usePurchasesContext();

  // Only show actions for pending purchases
  const canComplete = purchase.status === 'pending';
  const canCancel = purchase.status === 'pending';

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'warning',
          text: 'Pendiente',
          description: 'La compra está pendiente de procesamiento. Puedes completarla, cancelarla o editarla.'
        };
      case 'completed':
        return {
          color: 'success',
          text: 'Completada',
          description: 'La compra ha sido completada exitosamente. No se pueden realizar más cambios.'
        };
      case 'cancelled':
        return {
          color: 'error',
          text: 'Cancelada',
          description: 'La compra ha sido cancelada. No se pueden realizar más cambios.'
        };
      default:
        return {
          color: 'neutral',
          text: status,
          description: 'Estado desconocido.'
        };
    }
  };

  const statusInfo = getStatusInfo(purchase.status);

  const handleComplete = async () => {
    try {
      await completePurchase(purchase.id);
      setShowCompleteModal(false);
      setShowSuccessMessage(true);
      onStatusChange();
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error completing purchase:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelPurchase(purchase.id);
      setShowCancelModal(false);
      setShowSuccessMessage(true);
      onStatusChange();
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error cancelling purchase:', error);
    }
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Estado de la Compra</h3>
        
        {/* Current Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`badge badge-lg badge-${statusInfo.color}`}>
            {statusInfo.text}
          </div>
          <p className="text-sm text-gray-600">{statusInfo.description}</p>
        </div>

        {/* Action Buttons - Only show for pending purchases */}
        {canComplete && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompleteModal(true)}
              className="btn btn-success"
            >
              Completar Compra
            </button>
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn btn-error"
              >
                Cancelar Compra
              </button>
            )}
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="alert alert-success">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {purchase.status === 'completed' 
                ? '¡Compra completada exitosamente! El stock de los productos ha sido actualizado.'
                : '¡Compra cancelada exitosamente!'
              }
            </span>
          </div>
        )}

        {/* Info Alert for non-pending purchases */}
        {!canComplete && (
          <div className="alert alert-info">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {purchase.status === 'completed' 
                ? 'Esta compra ya ha sido completada y no se pueden realizar más cambios.'
                : 'Esta compra ha sido cancelada y no se pueden realizar más cambios.'
              }
            </span>
          </div>
        )}

        {/* Complete Confirmation Modal */}
        <ModalComponent
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          title="Confirmar Completar Compra"
        >
          <div className="space-y-4">
            <p>
              ¿Estás seguro de que quieres marcar esta compra como completada?
            </p>
            <div className="alert alert-warning">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-bold">Acción Irreversible</h4>
                <p className="text-sm">
                  Una vez completada, la compra no se podrá editar ni eliminar. 
                  El stock de los productos será actualizado automáticamente.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={handleComplete}
                className="btn btn-success"
              >
                Completar Compra
              </button>
            </div>
          </div>
        </ModalComponent>

        {/* Cancel Confirmation Modal */}
        <ModalComponent
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Confirmar Cancelar Compra"
        >
          <div className="space-y-4">
            <p>
              ¿Estás seguro de que quieres cancelar esta compra?
            </p>
            <div className="alert alert-error">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-bold">Acción Irreversible</h4>
                <p className="text-sm">
                  Una vez cancelada, la compra no se podrá editar ni eliminar. 
                  Esta acción no afectará el stock de los productos.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-error"
              >
                Cancelar Compra
              </button>
            </div>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
}; 