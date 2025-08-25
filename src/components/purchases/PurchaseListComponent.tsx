import React, { useState, useEffect } from 'react';
import { usePurchasesContext } from '../../hooks/usePurchasesContext';
import type { PurchaseInterface } from '../../interfaces/inventary/Purchases.interface';
import { CreateUpdatePurchase } from './CreateUpdatePurchase';
import { PurchaseDetails } from './PurchaseDetails';
import { DeleteConfirmation } from './DeleteConfirmation';
import { PurchaseStatsComponent } from './PurchaseStats';
import { PurchasesBySupplierReportForm } from './PurchasesBySupplierReportForm';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { ModalComponent } from '../atoms/ModalComponent';

type ModalType = 'create' | 'edit' | 'delete' | 'details' | null;

export const PurchaseListComponent: React.FC = () => {
  const { purchases, isLoading, error, getPurchases, deletePurchase } = usePurchasesContext();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState(0); // New state for supplier filter
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Helper function to get permissions for a purchase
  const getPurchasePermissions = (purchase: PurchaseInterface) => {
    const isPending = purchase.status === 'pending';
    return {
      canEdit: isPending,
      canDelete: isPending,
      canComplete: isPending,
      canCancel: isPending,
      canChangeStatus: isPending,
    };
  };

  useEffect(() => {
    getPurchases();
  }, [getPurchases]);

  const handleCreate = () => {
    setSelectedPurchase(null);
    setModalType('create');
  };

  const handleEdit = (purchase: PurchaseInterface) => {
    setSelectedPurchase(purchase);
    setModalType('edit');
  };

  const handleDelete = (purchase: PurchaseInterface) => {
    setSelectedPurchase(purchase);
    setModalType('delete');
  };

  const handleViewDetails = (purchase: PurchaseInterface) => {
    setSelectedPurchase(purchase);
    setModalType('details');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedPurchase(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedPurchase) {
      try {
        setIsDeleting(true);
        await deletePurchase(selectedPurchase.id);
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting purchase:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async () => {
    if (selectedPurchase) {
      try {
        // Refresh the purchases list to show updated status
        await getPurchases();
      } catch (error) {
        console.error('Error refreshing purchases:', error);
      }
    }
  };

  // Filter purchases based on search and filters
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    
    const matchesSupplier = supplierFilter === 0 || purchase.supplier_id === supplierFilter;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Get unique suppliers for filter
  const uniqueSuppliers = Array.from(new Set(purchases.map(p => p.supplier_id)))
    .map(id => purchases.find(p => p.supplier_id === id)?.supplier)
    .filter(Boolean);

  if (isLoading) {
    return (
      <LoadingSpinner text="Cargando compras..." />
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Gestión de Compras</h1>
        <p className="text-base-content/70">Administra las compras y adquisiciones del sistema</p>
      </div>

      {/* Statistics Cards */}
      <PurchaseStatsComponent />

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="form-control w-64">
            <input
              type="text"
              placeholder="Buscar compras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed' | 'cancelled')}
            className="select select-bordered"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Solo pendientes</option>
            <option value="completed">Solo completadas</option>
            <option value="cancelled">Solo canceladas</option>
          </select>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(parseInt(e.target.value))}
            className="select select-bordered"
          >
            <option value={0}>Todos los proveedores</option>
            {uniqueSuppliers.map(supplier => (
              <option key={supplier?.id} value={supplier?.id}>
                {supplier?.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="btn btn-primary btn-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generar Reporte 
        </button>

        <button
          onClick={handleCreate}
          className="btn btn-primary btn-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          + Nueva Compra
        </button>
      </div>

      {/* Purchases Table */}
      <div className="bg-base-100 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th>Compra</th>
                <th>Proveedor</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => {
                const permissions = getPurchasePermissions(purchase);
                return (
                  <tr key={purchase.id} className="hover:bg-base-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm font-semibold">
                              #{purchase.id}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">Compra #{purchase.id}</div>
                          <div className="text-sm opacity-70">
                            {purchase.details.length} productos
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold">{purchase.supplier?.name || 'N/A'}</div>
                        <div className="text-sm opacity-70">{purchase.supplier?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold">{purchase.user?.name || 'N/A'}</div>
                        <div className="text-sm opacity-70 capitalize">{purchase.user?.role || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm opacity-70">
                        {formatDate(purchase.purchase_date)}
                      </div>
                    </td>
                    <td className="font-semibold text-success">
                      {formatPrice(purchase.total_amount)}
                    </td>
                    <td>
                      <div className={`badge badge-${getStatusBadge(purchase.status).replace('badge-', '')} badge-outline`}>
                        {getStatusText(purchase.status)}
                      </div>
                    </td>
                    <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(purchase)}
                              className="btn btn-sm btn-info"
                            >
                              Ver
                            </button>
                            {permissions.canEdit && (
                              <button
                                onClick={() => handleEdit(purchase)}
                                className="btn btn-sm btn-warning"
                              >
                                Editar
                              </button>
                            )}
                            {permissions.canDelete && (
                              <button
                                onClick={() => handleDelete(purchase)}
                                className="btn btn-sm btn-error"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPurchases.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No se encontraron compras</h3>
            <p className="text-base-content/70 mb-4">Intenta ajustar los filtros o crear una nueva compra</p>
            <button
              onClick={handleCreate}
              className="btn btn-primary btn-lg gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Compra
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalComponent
        isOpen={modalType === 'create'}
        onClose={handleCloseModal}
        title="Nueva Compra"
        size="xl"
        showCloseButton={true}
      >
        <CreateUpdatePurchase
          onClose={handleCloseModal}
          purchase={null}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={modalType === 'edit'}
        onClose={handleCloseModal}
        title="Editar Compra"
        size="xl"
        showCloseButton={true}
      >
        {selectedPurchase && (
          <CreateUpdatePurchase
            onClose={handleCloseModal}
            purchase={selectedPurchase}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={modalType === 'delete'}
        onClose={handleCloseModal}
        title="Confirmar Eliminación"
        size="md"
        showCloseButton={true}
      >
        <DeleteConfirmation
          purchase={selectedPurchase}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
          isLoading={isDeleting}
        />
      </ModalComponent>

      {/* Purchase Details Modal */}
      <ModalComponent
        isOpen={modalType === 'details'}
        onClose={() => setModalType(null)}
        title="Detalles de la Compra"
        size="full"
      >
        <PurchaseDetails
          purchase={selectedPurchase}
          onEdit={() => setModalType('edit')}
          onDelete={() => setModalType('delete')}
          onStatusChange={handleStatusChange}
          onClose={() => setModalType(null)}
        />
      </ModalComponent>

      {/* Purchases Report Modal */}
      <ModalComponent
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Generar Reporte de Compras por Proveedor"
        size="lg"
        showCloseButton={true}
      >
        <PurchasesBySupplierReportForm
          onClose={() => setIsReportModalOpen(false)}
        />
      </ModalComponent>
    </div>
  );
};
