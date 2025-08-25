import React from 'react';
import { formatCurrency } from '../../utils/NumberUtils';
import type { Sale } from '../../interfaces/sales/Sales.interfaces';

interface ViewMobileSalesProps {
  sales: Sale[];
  onViewDetails: (sale: Sale) => void;
  onCancelSale: (id: number) => void;
  onDeleteSale: (sale: Sale) => void;
}

export const ViewMobileSales: React.FC<ViewMobileSalesProps> = ({
  sales,
  onViewDetails,
  onCancelSale,
  onDeleteSale
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-base-content/50 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No hay ventas registradas</h3>
        <p className="text-base-content/70 mb-4">Comienza registrando la primera venta del sistema</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2">
      {sales.map((sale) => (
        <div key={sale.id} className="card bg-base-100 shadow-lg border border-base-200">
          <div className="card-body p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                    <span className="text-xs font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      #{sale.id}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base">Venta #{sale.id}</h3>
                  <p className="text-sm text-base-content/70">
                    {sale.sale_details.length} producto{sale.sale_details.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className={`badge badge-${sale.status === 'active' ? 'success' : 'error'} badge-outline`}>
                {sale.status === 'active' ? 'Activa' : 'Cancelada'}
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-base-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-semibold text-base-content/80">Cliente</span>
              </div>
              <p className="font-bold text-sm">{sale.client.name}</p>
              <p className="text-xs text-base-content/70">{sale.client.email}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-base-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                </svg>
                <span className="text-sm font-semibold text-base-content/80">Vendedor</span>
              </div>
              <p className="font-bold text-sm">{sale.user.name}</p>
              <p className="text-xs text-base-content/70 capitalize">{sale.user.role}</p>
            </div>

            {/* Date and Total */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-semibold text-base-content/80">Fecha</span>
                </div>
                <p className="text-sm font-medium">{formatDate(sale.sale_date)}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1 justify-end">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-xs font-semibold text-base-content/80">Total</span>
                </div>
                <p className="text-lg font-bold text-success">
                  {formatCurrency(Number(sale.total_amount))}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="card-actions justify-end gap-2">
              <button
                onClick={() => onViewDetails(sale)}
                className="btn btn-sm btn-outline btn-info flex-1 sm:flex-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">Ver</span>
              </button>
              
              {sale.status === 'active' && (
                <button
                  onClick={() => onCancelSale(sale.id)}
                  className="btn btn-sm btn-outline btn-warning"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span className="hidden sm:inline">Cancelar</span>
                </button>
              )}
              
              <button
                onClick={() => onDeleteSale(sale)}
                className="btn btn-sm btn-outline btn-error"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0016.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};