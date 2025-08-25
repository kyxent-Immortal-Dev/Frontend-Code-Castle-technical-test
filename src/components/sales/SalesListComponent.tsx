import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/NumberUtils';
import type { Sale } from '../../interfaces/sales/Sales.interfaces';
import { CreateUpdateSales } from './CreateUpdateSales';
import { SaleDetails } from './SaleDetails';
import { DeleteConfirmation } from './DeleteConfirmation';
import { SalesReportForm } from './SalesReportForm';
import { ModalComponent } from '../atoms/ModalComponent';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Toast } from '../atoms/Toast';
import { useSaleStore } from '../../store/useSale.service';

export const SalesListComponent: React.FC = () => {
  const { 
    sales, 
    isLoading, 
    error, 
    getSales, 
    cancelSale,
    clearError 
  } = useSaleStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    getSales();
  }, []);

  const handleCancelSale = async (id: number) => {
    try {
      const success = await cancelSale(id);
      if (success) {
        showToast('Venta cancelada exitosamente', 'success');
      } else {
        showToast('Error al cancelar la venta', 'error');
      }
    } catch {
      showToast('Error al cancelar la venta', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openViewModal = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };



  if (isLoading && sales.length === 0) {
    return <LoadingSpinner text="Cargando ventas..." />;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
        <button onClick={clearError} className="btn btn-sm">Limpiar</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Gestión de Ventas</h1>
        <p className="text-base-content/70">Administra las ventas del sistema y su información detallada</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="stat-title">Total de Ventas</div>
          <div className="stat-value text-primary">{sales.length}</div>
          <div className="stat-desc">Registradas en el sistema</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Ventas Activas</div>
          <div className="stat-value text-success">{sales.filter(s => s.status === 'active').length}</div>
          <div className="stat-desc">Ventas confirmadas</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-warning">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div className="stat-title">Ventas Canceladas</div>
          <div className="stat-value text-warning">{sales.filter(s => s.status === 'cancelled').length}</div>
          <div className="stat-desc">Ventas anuladas</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-info">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="stat-title">Total Generado</div>
          <div className="stat-value text-info">
            {formatCurrency(sales.reduce((total, sale) => total + Number(sale.total_amount), 0))}
          </div>
          <div className="stat-desc">Ingresos totales</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn btn-secondary btn-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generar Reporte
          </button>
          <button
            onClick={openCreateModal}
            className="btn btn-primary btn-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            + Nueva Venta
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-base-100 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th>Venta</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-base-200">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="text-sm font-semibold">
                            #{sale.id}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">Venta #{sale.id}</div>
                        <div className="text-sm opacity-70">
                          {sale.sale_details.length} producto{sale.sale_details.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="font-bold">{sale.client.name}</div>
                      <div className="text-sm opacity-70">{sale.client.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="font-bold">{sale.user.name}</div>
                      <div className="text-sm opacity-70 capitalize">{sale.user.role}</div>
                    </div>
                  </td>
                  <td>{formatDate(sale.sale_date)}</td>
                  <td>
                    <span className="font-bold text-lg">
                      {formatCurrency(Number(sale.total_amount))}
                    </span>
                  </td>
                  <td>
                    <div className={`badge badge-${sale.status === 'active' ? 'success' : 'error'} badge-outline`}>
                      {sale.status === 'active' ? 'Activa' : 'Cancelada'}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openViewModal(sale)}
                        className="btn btn-sm btn-outline btn-info"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {sale.status === 'active' && (
                        <button
                          onClick={() => handleCancelSale(sale.id)}
                          className="btn btn-sm btn-outline btn-warning"
                          title="Cancelar venta"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(sale)}
                        className="btn btn-sm btn-outline btn-error"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay ventas registradas</h3>
            <p className="text-base-content/70 mb-4">Comienza registrando la primera venta del sistema</p>
            <button
              onClick={openCreateModal}
              className="btn btn-primary btn-lg gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Registrar Venta
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalComponent
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Registrar Nueva Venta"
        size="xl"
        showCloseButton={true}
      >
        <CreateUpdateSales
          mode="create"
          onSuccess={() => setIsCreateModalOpen(false)}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSale(null);
        }}
        title="Detalles de la Venta"
        size="xl"
        showCloseButton={true}
      >
        {selectedSale && (
          <SaleDetails
            sale={selectedSale}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSale(null);
        }}
        title="Confirmar Eliminación"
        size="md"
        showCloseButton={true}
      >
        {selectedSale && (
          <DeleteConfirmation
            sale={selectedSale}
            onConfirm={() => {
              // Note: Sales deletion is not implemented in the backend
              showToast('La eliminación de ventas no está implementada', 'info');
              setIsDeleteModalOpen(false);
              setSelectedSale(null);
            }}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setSelectedSale(null);
            }}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Generar Reporte de Ventas"
        size="lg"
        showCloseButton={true}
      >
        <SalesReportForm
          onClose={() => setIsReportModalOpen(false)}
        />
      </ModalComponent>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
};
