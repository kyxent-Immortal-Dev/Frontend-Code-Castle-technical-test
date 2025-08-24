import { formatCurrency } from '../../utils/NumberUtils';
import type { Sale } from '../../interfaces/sales/Sales.interfaces';
import { useSaleStore } from '../../store/useSale.service';

interface DeleteConfirmationProps {
  sale: Sale | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation = ({ sale, onConfirm, onCancel }: DeleteConfirmationProps) => {
  const { isLoading } = useSaleStore();

  if (!sale) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Venta no encontrada</h3>
        <p className="text-base-content/70">No se puede eliminar una venta inexistente</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      {/* Warning Icon */}
      <div className="text-6xl mb-4">⚠️</div>
      
      {/* Warning Message */}
      <div>
        <h3 className="text-xl font-bold text-error mb-2">¿Estás seguro?</h3>
        <p className="text-base-content/70">
          Esta acción no se puede deshacer. Se eliminará permanentemente la venta:
        </p>
      </div>

      {/* Sale Info */}
      <div className="card bg-base-200">
        <div className="card-body p-4">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-12">
                <span className="text-lg font-semibold">
                  {formatCurrency(sale.total_amount)}
                </span>
              </div>
            </div>
            <div className="text-left">
              <h4 className="font-bold">Venta #{sale.id}</h4>
              <p className="text-sm opacity-70">Cliente: {sale.client.name}</p>
              <p className="text-xs opacity-50">
                {new Date(sale.sale_date).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Details */}
      <div className="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>
          <strong>¡Atención!</strong> Esta acción eliminará todos los datos asociados a la venta.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button 
          onClick={onCancel}
          className="btn btn-outline btn-lg"
        >
          Cancelar
        </button>
        <button 
          onClick={onConfirm}
          className="btn btn-error btn-lg"
          disabled={isLoading}
        >
          Sí, Eliminar
        </button>
      </div>
    </div>
  );
};
