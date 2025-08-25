import React from 'react';
import type { SupplierInterface } from '../../interfaces/inventary/Supliers.interface';

interface ViewMobileSuppliersProps {
  suppliers: SupplierInterface[];
  onView: (supplier: SupplierInterface) => void;
  onEdit: (supplier: SupplierInterface) => void;
  onDelete: (supplier: SupplierInterface) => void;
}

export const ViewMobileSuppliers: React.FC<ViewMobileSuppliersProps> = ({
  suppliers,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {suppliers.map((supplier) => (
        <div key={supplier.id} className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-4">
            {/* Header with Avatar and Name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-12 h-12">
                  <span className="text-lg font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {supplier.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="card-title text-lg">{supplier.name}</h3>
                <p className="text-sm opacity-70">ID: #{supplier.id}</p>
              </div>
              <div className={`badge badge-${supplier.is_active ? 'success' : 'error'} badge-outline`}>
                {supplier.is_active ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-mono">{supplier.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 opacity-70 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm opacity-80 leading-tight">{supplier.address}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center mb-4">
              <div className="stat p-0">
                <div className="stat-title text-xs">Compras</div>
                <div className="stat-value text-lg text-primary">{supplier.purchases.length}</div>
              </div>
             
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end">
              <div className="btn-group">
                <button
                  onClick={() => onView(supplier)}
                  className="btn btn-sm btn-outline btn-info"
                  title="Ver detalles"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(supplier)}
                  className="btn btn-sm btn-outline btn-warning"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(supplier)}
                  className="btn btn-sm btn-outline btn-error"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};