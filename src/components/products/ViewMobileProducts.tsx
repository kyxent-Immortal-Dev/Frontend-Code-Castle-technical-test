import React from 'react';
import type { ProductInterface } from '../../interfaces/inventary/Product.interface';

interface ViewMobileProductsProps {
  products: ProductInterface[];
  onViewDetails: (product: ProductInterface) => void;
  onEdit: (product: ProductInterface) => void;
  onDelete: (product: ProductInterface) => void;
}

export const ViewMobileProducts: React.FC<ViewMobileProductsProps> = ({
  products,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Sin stock', color: 'badge-error' };
    if (stock < 10) return { text: 'Stock bajo', color: 'badge-warning' };
    return { text: 'En stock', color: 'badge-success' };
  };

  return (
    <div className="grid grid-cols-1 gap-4 break-words">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.stock);
        return (
          <div key={product.id} className="card bg-base-100 grid grid-cols-1 shadow-lg">
            <div className="card-body p-4">
              {/* Product Header */}
              <div className="grid grid-cols-1 items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="avatar placeholder shrink-0">
                    <div className="bg-neutral text-neutral-content rounded-full w-12 h-12">
                      <span className="text-lg font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="card-title text-lg font-bold text-base-content truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className={`badge badge-${product.is_active ? 'success' : 'error'} badge-outline shrink-0`}>
                  {product.is_active ? 'Activo' : 'Inactivo'}
                </div>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="text-sm text-base-content/70">Precio</div>
                  <div className="text-xl font-bold text-success">
                    {formatPrice(product.unit_price)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-base-content/70">Stock</div>
                  <div className="flex flex-col gap-1">
                    <span >
                      {stockStatus.text}
                    </span>
                    <span className="text-sm text-base-content/70">
                      {product.stock} unidades
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions justify-end gap-2">
                <button
                  onClick={() => onViewDetails(product)}
                  className="btn btn-sm btn-outline btn-info"
                  title="Ver detalles"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="hidden sm:inline">Ver</span>
                </button>
                <button
                  onClick={() => onEdit(product)}
                  className="btn btn-sm btn-outline btn-warning"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="btn btn-sm btn-outline btn-error"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};