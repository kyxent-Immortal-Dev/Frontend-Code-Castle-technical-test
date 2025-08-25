import React, { useState, useEffect } from 'react';
import { PurchaseService } from '../../services/api/Purchase.service';
import { useSuppliersContext } from '../../hooks/useSuppliersContext';

interface PurchasesBySupplierReportFormProps {
  onClose: () => void;
}

export const PurchasesBySupplierReportForm: React.FC<PurchasesBySupplierReportFormProps> = ({ onClose }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { suppliers, getSuppliers } = useSuppliersContext();
  const purchaseService = new PurchaseService();

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplierId) {
      setError('Por favor selecciona un proveedor');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      const blob = await purchaseService.generatePurchasesBySupplierReport(selectedSupplierId);
      
      // Obtener el nombre del proveedor seleccionado para el nombre del archivo
      const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);
      const supplierName = selectedSupplier?.name || 'proveedor';
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-compras-${supplierName}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Cerrar el modal después de la descarga
      onClose();
      
    } catch (error) {
      setError('Error al generar el reporte. Verifica que el proveedor tenga compras registradas.');
      console.error('Error generating purchases report by supplier:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-base-content mb-2">
          📊 Generar Reporte de Compras por Proveedor
        </h3>
        <p className="text-base-content/70">
          Selecciona el proveedor para generar un reporte detallado de todas sus compras en el sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Proveedor</span>
          </label>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(parseInt(e.target.value))}
            className="select select-bordered w-full"
            required
          >
            <option value={0}>Selecciona un proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} {supplier.email ? `(${supplier.email})` : ''}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Solo se mostrarán proveedores que tengan compras registradas
            </span>
          </label>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
            disabled={isGenerating}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isGenerating || !selectedSupplierId}
          >
            {isGenerating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Generando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generar Reporte
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 