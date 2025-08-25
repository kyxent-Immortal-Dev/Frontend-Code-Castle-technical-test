import React, { useState, useEffect } from 'react';
import type { Client } from '../../interfaces/sales/Client.interfaces';
import { CreateUpdateClient } from './CreateUpdateClient';
import { ClientDetails } from './ClientDetails';
import { DeleteConfirmation } from './DeleteConfirmation';
import { ModalComponent } from '../atoms/ModalComponent';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Toast } from '../atoms/Toast';
import { ViewMobileClients } from './ViewMobileClients';
import { useClientStore } from '../../store/useClient.service';

export const ClientListComponent: React.FC = () => {
  const { 
    clients, 
    isLoading, 
    error, 
    getClients, 
    deleteClient, 
    toggleClientStatus,
    clearError 
  } = useClientStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    getClients();
  }, []);

  const handleDeleteClient = async (id: number) => {
    try {
      const success = await deleteClient(id);
      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedClient(null);
        showToast('Cliente eliminado exitosamente', 'success');
      } else {
        showToast('Error al eliminar el cliente', 'error');
      }
    } catch {
      showToast('Error al eliminar el cliente', 'error');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const success = await toggleClientStatus(id);
      if (success) {
        showToast('Estado del cliente actualizado exitosamente', 'success');
      } else {
        showToast('Error al cambiar el estado del cliente', 'error');
      }
    } catch {
      showToast('Error al cambiar el estado del cliente', 'error');
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

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const openViewModal = (client: Client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
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

  if (isLoading && clients.length === 0) {
    return <LoadingSpinner text="Cargando clientes..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="alert alert-error">
          <span>Error: {error}</span>
          <button onClick={clearError} className="btn btn-sm">Limpiar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">Gestión de Clientes</h1>
        <p className="text-sm sm:text-base text-base-content/70">Administra los clientes del sistema y su información de contacto</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="stat bg-base-100 shadow-lg rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="stat-figure text-primary">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="stat-title text-sm">Total de Clientes</div>
              <div className="stat-value text-primary text-2xl sm:text-3xl">{clients.length}</div>
              <div className="stat-desc text-xs">Registrados en el sistema</div>
            </div>
          </div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="stat-figure text-success">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="stat-title text-sm">Clientes Activos</div>
              <div className="stat-value text-success text-2xl sm:text-3xl">{clients.filter(c => c.is_active).length}</div>
              <div className="stat-desc text-xs">Cuentas activas actualmente</div>
            </div>
          </div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="stat-figure text-info">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <div className="stat-title text-sm">Con Teléfono</div>
              <div className="stat-value text-info text-2xl sm:text-3xl">{clients.filter(c => c.phone).length}</div>
              <div className="stat-desc text-xs">Clientes con teléfono registrado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full sm:w-auto"></div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm sm:text-base">+ Nuevo Cliente</span>
        </button>
      </div>

      {/* Vista Móvil - Cards (visible solo en móvil) */}
      <div className="block lg:hidden">
        {clients.length > 0 ? (
          <ViewMobileClients
            clients={clients}
            onViewClient={openViewModal}
            onEditClient={openEditModal}
            onToggleStatus={handleToggleStatus}
            onDeleteClient={openDeleteModal}
            formatDate={formatDate}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay clientes registrados</h3>
            <p className="text-base-content/70 mb-4 text-sm">Comienza agregando el primer cliente al sistema</p>
            <button
              onClick={openCreateModal}
              className="btn btn-primary btn-md gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Cliente
            </button>
          </div>
        )}
      </div>

      {/* Vista Desktop - Tabla (oculta en móvil) */}
      <div className="hidden lg:block bg-base-100 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Registrado</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-base-200">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="text-sm font-semibold">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{client.name}</div>
                        <div className="text-sm opacity-70">ID: {client.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <a href={`mailto:${client.email}`} className="link link-primary">
                          {client.email}
                        </a>
                      </div>
                      {client.phone && (
                        <div className="text-sm">
                          <a href={`tel:${client.phone}`} className="link link-secondary">
                            {client.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-${client.is_active ? 'success' : 'error'} badge-outline`}>
                      {client.is_active ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>
                  <td>{formatDate(client.created_at)}</td>
                  <td>{formatDate(client.updated_at)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openViewModal(client)}
                        className="btn btn-sm btn-outline btn-info"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditModal(client)}
                        className="btn btn-sm btn-outline btn-warning"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(client.id)}
                        className={`btn btn-sm btn-outline ${client.is_active ? 'btn-warning' : 'btn-success'}`}
                        title={client.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {client.is_active ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => openDeleteModal(client)}
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

        {clients.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay clientes registrados</h3>
            <p className="text-base-content/70 mb-4">Comienza agregando el primer cliente al sistema</p>
            <button
              onClick={openCreateModal}
              className="btn btn-primary btn-lg gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Cliente
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalComponent
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Cliente"
        size="lg"
        showCloseButton={true}
      >
        <CreateUpdateClient
          mode="create"
          onSuccess={() => setIsCreateModalOpen(false)}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingClient(null);
        }}
        title="Editar Cliente"
        size="lg"
        showCloseButton={true}
      >
        {editingClient && (
          <CreateUpdateClient
            mode="edit"
            client={editingClient}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setEditingClient(null);
            }}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedClient(null);
        }}
        title="Detalles del Cliente"
        size="md"
        showCloseButton={true}
      >
        {selectedClient && (
          <ClientDetails
            client={selectedClient}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        title="Confirmar Eliminación"
        size="md"
        showCloseButton={true}
      >
        {selectedClient && (
          <DeleteConfirmation
            client={selectedClient}
            onConfirm={() => handleDeleteClient(selectedClient.id)}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setSelectedClient(null);
            }}
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