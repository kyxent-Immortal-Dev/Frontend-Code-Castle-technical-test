import React, { useState, useEffect } from 'react';
import type { SupplierInterface } from '../../interfaces/inventary/Supliers.interface';
import { CreateUpdateSupplier } from './CreateUpdateSupplier';
import { DeleteConfirmation } from './DeleteConfirmation';
import { SupplierDetails } from './SupplierDetails';
import { ViewMobileSuppliers } from './ViewMobileSuppliers';
import { ModalComponent } from '../atoms/ModalComponent';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Toast } from '../atoms/Toast';
import { useSuppliersContext } from '../../hooks/useSuppliersContext';

export const SuppliersListComponent: React.FC = () => {
  const { suppliers, isLoading, error, getSuppliers, deleteSupplier } = useSuppliersContext();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierInterface | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<SupplierInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    getSuppliers();
  }, []);

  const handleDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id);
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
      showToast('Proveedor eliminado exitosamente', 'success');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('compras asociadas')) {
        showToast('No se puede eliminar el proveedor. Verifique que no tenga compras asociadas.', 'error');
      } else {
        showToast('Error al eliminar proveedor', 'error');
      }
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

  const openEditModal = (supplier: SupplierInterface) => {
    setEditingSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const openViewModal = (supplier: SupplierInterface) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (supplier: SupplierInterface) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const filteredSuppliers = suppliers.filter((supplier: SupplierInterface) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && suppliers.length === 0) {
    return <LoadingSpinner text="Cargando proveedores..." />;
  }

  if (error) {
    return (
      <div className="alert alert-error mx-4 my-6">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">Gestión de Proveedores</h1>
        <p className="text-sm sm:text-base text-base-content/70">Administra los proveedores del sistema y su información de contacto</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="stat bg-base-100 shadow-lg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-xs sm:text-sm">Total de Proveedores</div>
              <div className="stat-value text-2xl sm:text-3xl text-primary">{suppliers.length}</div>
              <div className="stat-desc text-xs">Registrados en el sistema</div>
            </div>
            <div className="stat-figure text-primary">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-xs sm:text-sm">Proveedores Activos</div>
              <div className="stat-value text-2xl sm:text-3xl text-success">{suppliers.filter(s => s.is_active).length}</div>
              <div className="stat-desc text-xs">Cuentas activas actualmente</div>
            </div>
            <div className="stat-figure text-success">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-xs sm:text-sm">Total Compras</div>
              <div className="stat-value text-2xl sm:text-3xl text-info">
                {suppliers.reduce((total, s) => total + s.purchases.length, 0)}
              </div>
              <div className="stat-desc text-xs">Transacciones realizadas</div>
            </div>
            <div className="stat-figure text-info">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="form-control w-full sm:max-w-md">
          <div className="input-group">
            <input
              type="text"
              placeholder="Buscar proveedores..."
              className="input input-bordered flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <button
          onClick={openCreateModal}
          className="btn btn-primary "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">+ Nuevo Proveedor</span>
          <span className="sm:hidden">+ Agregar</span>
        </button>
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden lg:block bg-base-100 shadow-lg rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th>Proveedor</th>
                <th>Contacto</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Compras</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-base-200">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="text-sm font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            {supplier.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{supplier.name}</div>
                        <div className="text-sm opacity-70">ID: #{supplier.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{supplier.email}</div>
                      <div className="text-sm opacity-70 font-mono">{supplier.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div className="max-w-xs truncate text-sm opacity-80">
                      {supplier.address}
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-${supplier.is_active ? 'success' : 'error'} badge-outline`}>
                      {supplier.is_active ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>
                  <td>
                    <div className="badge badge-outline">
                      {supplier.purchases.length} compras
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openViewModal(supplier)}
                        className="btn btn-sm btn-outline btn-info"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditModal(supplier)}
                        className="btn btn-sm btn-outline btn-warning"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {supplier.purchases.length === 0 ? (
                        <button
                          onClick={() => openDeleteModal(supplier)}
                          className="btn btn-sm btn-outline btn-error"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline btn-disabled"
                          title="No se puede eliminar - Tiene compras asociadas"
                          disabled
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile and Tablet Card View */}
      <div className="lg:hidden">
        {filteredSuppliers.length > 0 ? (
          <ViewMobileSuppliers
            suppliers={filteredSuppliers}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ) : null}
      </div>

      {/* Empty State */}
      {filteredSuppliers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-base-content/50 mb-4">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
          </h3>
          <p className="text-sm sm:text-base text-base-content/70 mb-4 px-4">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando el primer proveedor al sistema'}
          </p>
          {!searchTerm && (
            <button
              onClick={openCreateModal}
              className="btn btn-primary btn-lg gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Proveedor
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <ModalComponent
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Proveedor"
        size="lg"
        showCloseButton={true}
      >
        <CreateUpdateSupplier
          onClose={() => setIsCreateModalOpen(false)}
          supplier={null}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSupplier(null);
        }}
        title="Editar Proveedor"
        size="lg"
        showCloseButton={true}
      >
        {editingSupplier && (
          <CreateUpdateSupplier
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingSupplier(null);
            }}
            supplier={editingSupplier}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSupplier(null);
        }}
        title="Detalles del Proveedor"
        size="lg"
        showCloseButton={true}
      >
        {selectedSupplier && (
          <SupplierDetails
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedSupplier(null);
            }}
            supplier={selectedSupplier}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSupplier(null);
        }}
        title="Confirmar Eliminación"
        size="md"
        showCloseButton={true}
      >
        {selectedSupplier && (
          <DeleteConfirmation
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedSupplier(null);
            }}
            onConfirm={() => handleDeleteSupplier(selectedSupplier.id)}
            supplierName={selectedSupplier.name}
          />
        )}
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