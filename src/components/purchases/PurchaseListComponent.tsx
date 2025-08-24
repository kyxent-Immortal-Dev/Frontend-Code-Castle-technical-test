import React, { useState, useEffect } from 'react';
import { usePurchasesContext } from '../../hooks/usePurchasesContext';
import { CreateUpdatePurchase } from './CreateUpdatePurchase';
import { DeleteConfirmation } from './DeleteConfirmation';
import { PurchaseDetails } from './PurchaseDetails';
import { ModalComponent } from '../atoms/ModalComponent';
import { LoadingSpinner } from '../atoms';
import type { PurchaseInterface } from '../../interfaces/inventary/Purchases.interface';

type ModalType = 'create' | 'edit' | 'delete' | 'details' | null;

export const PurchaseListComponent: React.FC = () => {
  const { purchases, isLoading, error, getPurchases, deletePurchase } = usePurchasesContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [supplierFilter, setSupplierFilter] = useState<number>(0);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseInterface | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="stat-title">Total de Compras</div>
          <div className="stat-value text-primary">{purchases.length}</div>
          <div className="stat-desc">En el sistema</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Completadas</div>
          <div className="stat-value text-success">{purchases.filter(p => p.status === 'completed').length}</div>
          <div className="stat-desc">Finalizadas</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-warning">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Pendientes</div>
          <div className="stat-value text-warning">{purchases.filter(p => p.status === 'pending').length}</div>
          <div className="stat-desc">En proceso</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-info">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="stat-title">Valor Total</div>
          <div className="stat-value text-info">
            {formatPrice(purchases.reduce((sum, p) => sum + parseFloat(p.total_amount), 0).toString())}
          </div>
          <div className="stat-desc">En compras</div>
        </div>
      </div>

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
              {filteredPurchases.map((purchase) => (
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
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(purchase)}
                        className="btn btn-sm btn-outline btn-info"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEdit(purchase)}
                        className="btn btn-sm btn-outline btn-warning"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(purchase)}
                        className="btn btn-sm btn-outline btn-error"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      <ModalComponent
        isOpen={modalType === 'details'}
        onClose={handleCloseModal}
        title="Detalles de la Compra"
        size="xl"
        showCloseButton={true}
      >
        <PurchaseDetails
          purchase={selectedPurchase}
          onEdit={() => {
            setModalType('edit');
          }}
          onDelete={() => {
            setModalType('delete');
          }}
        />
      </ModalComponent>
    </div>
  );
};
