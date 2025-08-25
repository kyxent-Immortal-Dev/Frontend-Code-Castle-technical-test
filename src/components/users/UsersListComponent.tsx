import React, { useState, useEffect } from 'react';
import type { DataUsers } from '../../interfaces/users/Users.Interfaces';
import { CreateUpdateUser } from './CreateUpdateUser';
import { UserDetails } from './UserDetails';
import { DeleteConfirmation } from './DeleteConfirmation';
import { ViewMobileUsers } from './ViewMobileUsers';
import { ModalComponent } from '../atoms/ModalComponent';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Toast } from '../atoms/Toast';
import { useUsersContext } from '../../hooks/useUsersContext';

export const UsersListComponent: React.FC = () => {
  const { users, isLoading, error, getUsers, deleteUser } = useUsersContext();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataUsers | null>(null);
  const [editingUser, setEditingUser] = useState<DataUsers | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    getUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      showToast('Usuario eliminado exitosamente', 'success');
    } catch {
      showToast('Error al eliminar usuario', 'error');
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

  const openEditModal = (user: DataUsers) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const openViewModal = (user: DataUsers) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (user: DataUsers) => {
    setSelectedUser(user);
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

  if (isLoading && users.length === 0) {
    return <LoadingSpinner text="Cargando usuarios..." />;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">Gestión de Usuarios</h1>
        <p className="text-sm sm:text-base text-base-content/70">Administra los usuarios del sistema y sus permisos</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="stat bg-base-100 shadow-lg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-sm">Total de Usuarios</div>
              <div className="stat-value text-2xl sm:text-3xl text-primary">{users.length}</div>
              <div className="stat-desc text-xs">Registrados en el sistema</div>
            </div>
            <div className="stat-figure text-primary">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-sm">Usuarios Activos</div>
              <div className="stat-value text-2xl sm:text-3xl text-success">{users.filter(u => u.is_active).length}</div>
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
              <div className="stat-title text-sm">Administradores</div>
              <div className="stat-value text-2xl sm:text-3xl text-warning">{users.filter(u => u.role === 'admin').length}</div>
              <div className="stat-desc text-xs">Usuarios administrativos</div>
            </div>
            <div className="stat-figure text-warning">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="hidden sm:block"></div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary w-full sm:w-auto sm:btn-lg"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          + Nuevo Usuario
        </button>
      </div>

      {/* Users Display - Table for Desktop, Cards for Mobile */}
      <div className="bg-base-100 shadow-lg rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-primary text-primary-content">
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Última Actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-base-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-sm opacity-70">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge badge-${user.role === 'admin' ? 'secondary' : 'warning'}`}>
                        {user.role}
                      </div>
                    </td>
                    <td>
                      <div className={`badge badge-${user.is_active ? 'success' : 'error'} badge-outline`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </div>
                    </td>
                    <td>{formatDate(user.created_at.toString())}</td>
                    <td>{formatDate(user.updated_at.toString())}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="btn btn-sm btn-outline btn-info"
                          title="Ver detalles"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="btn btn-sm btn-outline btn-warning"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
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

          {users.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-base-content/50 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay usuarios registrados</h3>
              <p className="text-base-content/70 mb-4">Comienza agregando el primer usuario al sistema</p>
              <button
                onClick={openCreateModal}
                className="btn btn-primary btn-lg gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar Usuario
              </button>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4">
          <ViewMobileUsers
            users={users}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            formatDate={formatDate}
          />
          
          {users.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <button
                onClick={openCreateModal}
                className="btn btn-primary w-full gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar Usuario
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalComponent
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Usuario"
        size="lg"
        showCloseButton={true}
      >
        <CreateUpdateUser
          mode="create"
          onSuccess={() => setIsCreateModalOpen(false)}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        title="Editar Usuario"
        size="lg"
        showCloseButton={true}
      >
        {editingUser && (
          <CreateUpdateUser
            mode="edit"
            user={editingUser}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setEditingUser(null);
            }}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="Detalles del Usuario"
        size="md"
        showCloseButton={true}
      >
        {selectedUser && (
          <UserDetails
            user={selectedUser}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Confirmar Eliminación"
        size="md"
        showCloseButton={true}
      >
        {selectedUser && (
          <DeleteConfirmation
            user={selectedUser}
            onConfirm={() => handleDeleteUser(selectedUser.id.toString())}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
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