import React from 'react'
import type { SupplierInterface } from '../../interfaces/inventary/Supliers.interface'

interface SupplierDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierInterface;
}

export const SupplierDetails: React.FC<SupplierDetailsProps> = ({ 
  isOpen, 
  onClose, 
  supplier 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Detalles del Proveedor</h3>
        
        <div className="space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-base-content mb-2">Información General</h4>
                <div className="card bg-base-200 p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Nombre:</span>
                      <span>{supplier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estado:</span>
                      <div className={`badge ${supplier.is_active ? 'badge-success' : 'badge-error'}`}>
                        {supplier.is_active ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Precio Unitario:</span>
                      <span className="font-mono">${supplier.unit_price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Stock:</span>
                      <span className="font-mono">{supplier.stock} unidades</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-base-content mb-2">Descripción</h4>
              <div className="card bg-base-200 p-4">
                <p className="text-base-content/80 leading-relaxed">
                  {supplier.description}
                </p>
              </div>
            </div>
          </div>

          {/* Historial de Compras */}
          <div>
            <h4 className="font-semibold text-base-content mb-3">
              Historial de Compras ({supplier.purchase_details.length})
            </h4>
            
            {supplier.purchase_details.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-base-content/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-base-content/70">No hay historial de compras disponible</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>ID Compra</th>
                      <th>Producto ID</th>
                      <th>Cantidad</th>
                      <th>Precio Compra</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.purchase_details.map((detail) => (
                      <tr key={detail.id}>
                        <td className="font-mono text-sm">#{detail.purchase_id}</td>
                        <td className="font-mono text-sm">#{detail.product_id}</td>
                        <td>
                          <div className="badge badge-outline">
                            {detail.quantity}
                          </div>
                        </td>
                        <td className="font-mono">${detail.purchase_price}</td>
                        <td className="font-mono font-medium">${detail.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Compras</div>
              <div className="stat-value text-primary">{supplier.purchase_details.length}</div>
              <div className="stat-desc">Transacciones realizadas</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Stock Actual</div>
              <div className="stat-value text-secondary">{supplier.stock}</div>
              <div className="stat-desc">Unidades disponibles</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Valor Total</div>
              <div className="stat-value text-accent">
                ${(parseFloat(supplier.unit_price) * supplier.stock).toFixed(2)}
              </div>
              <div className="stat-desc">Stock × Precio unitario</div>
            </div>
          </div>
        </div>

        {/* Botón Cerrar */}
        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
      
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}
