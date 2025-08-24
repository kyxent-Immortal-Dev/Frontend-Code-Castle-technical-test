import React from 'react';
import type { ProductInterface } from '../../interfaces/inventary/Product.interface';

interface DeleteConfirmationProps {
  product: ProductInterface | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  product,
  onConfirm,
  onCancel,
  isLoading
}) => {
  // Early return if product is null
  if (!product) {
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
            No se pudo cargar la información del producto para eliminar.
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
          No podrás revertir esta acción. El producto{' '}
          <span className="font-semibold">"{product.name}"</span>{' '}
          será eliminado permanentemente.
        </p>
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