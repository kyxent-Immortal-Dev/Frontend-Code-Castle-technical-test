import React from 'react';
import type { DataUsers } from '../../interfaces/users/Users.Interfaces';

interface ViewMobileUsersProps {
  users: DataUsers[];
  onView: (user: DataUsers) => void;
  onEdit: (user: DataUsers) => void;
  onDelete: (user: DataUsers) => void;
  formatDate: (dateString: string) => string;
}

export const ViewMobileUsers: React.FC<ViewMobileUsersProps> = ({
  users,
  onView,
  onEdit,
  onDelete,
  formatDate
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/50 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No hay usuarios registrados</h3>
        <p className="text-base-content/70 mb-4">Comienza agregando el primer usuario al sistema</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="card bg-base-100 shadow-lg">
          <div className="card-body p-4">
            {/* User Info Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-lg font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-sm text-base-content/70">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Status and Role Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div className={`badge badge-${user.role === 'admin' ? 'secondary' : 'warning'}`}>
                {user.role}
              </div>
              <div className={`badge badge-${user.is_active ? 'success' : 'error'} badge-outline`}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            {/* Dates Info */}
            <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/70">Creado:</span>
                <span className="font-medium">{formatDate(user.created_at.toString())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Actualizado:</span>
                <span className="font-medium">{formatDate(user.updated_at.toString())}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => onView(user)}
                className="btn btn-sm btn-outline btn-info flex-1 sm:flex-none"
                title="Ver detalles"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="sm:hidden">Ver</span>
              </button>
              <button
                onClick={() => onEdit(user)}
                className="btn btn-sm btn-outline btn-warning flex-1 sm:flex-none"
                title="Editar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="sm:hidden">Editar</span>
              </button>
              <button
                onClick={() => onDelete(user)}
                className="btn btn-sm btn-outline btn-error flex-1 sm:flex-none"
                title="Eliminar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="sm:hidden">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};