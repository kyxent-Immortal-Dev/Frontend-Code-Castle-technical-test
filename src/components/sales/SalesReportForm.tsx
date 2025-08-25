import React, { useState } from 'react';
import { SalesService } from '../../services/api/Sales.service';

interface SalesReportFormProps {
  onClose: () => void;
}

export const SalesReportForm: React.FC<SalesReportFormProps> = ({ onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const salesService = new SalesService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('Por favor selecciona ambas fechas');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      const blob = await salesService.generateSalesReport(startDate, endDate);
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-ventas-${startDate}-a-${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Cerrar el modal después de la descarga
      onClose();
      
    } catch (error) {
      setError('Error al generar el reporte. Verifica las fechas e intenta nuevamente.');
      console.error('Error generating sales report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-base-content mb-2">
          📊 Generar Reporte de Ventas
        </h3>
        <p className="text-base-content/70">
          Selecciona el rango de fechas para generar un reporte detallado de las ventas del período.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Fecha de Inicio</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today}
              className="input input-bordered w-full"
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Selecciona desde cuándo quieres el reporte
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Fecha de Fin</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={today}
              className="input input-bordered w-full"
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Selecciona hasta cuándo quieres el reporte
              </span>
            </label>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="bg-base-200 rounded-lg p-4">
          <h4 className="font-medium text-base-content mb-3">📅 Selección Rápida</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setStartDate(oneMonthAgo);
                setEndDate(today);
              }}
              className="btn btn-sm btn-outline"
            >
              Último Mes
            </button>
            <button
              type="button"
              onClick={() => {
                const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                setStartDate(lastWeek);
                setEndDate(today);
              }}
              className="btn btn-sm btn-outline"
            >
              Última Semana
            </button>
            <button
              type="button"
              onClick={() => {
                const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                setStartDate(startOfMonth);
                setEndDate(today);
              }}
              className="btn btn-sm btn-outline"
            >
              Este Mes
            </button>
            <button
              type="button"
              onClick={() => {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
                setStartDate(startOfYear);
                setEndDate(today);
              }}
              className="btn btn-sm btn-outline"
            >
              Este Año
            </button>
          </div>
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
            disabled={isGenerating || !startDate || !endDate}
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