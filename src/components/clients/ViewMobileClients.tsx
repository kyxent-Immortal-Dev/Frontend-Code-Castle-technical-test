import React from 'react';
import type { Client } from '../../interfaces/sales/Client.interfaces';

interface ViewMobileClientsProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onToggleStatus: (id: number) => void;
  onDeleteClient: (client: Client) => void;
  formatDate: (dateString: string) => string;
}

export const ViewMobileClients: React.FC<ViewMobileClientsProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onToggleStatus,
  onDeleteClient,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {clients.map((client) => (
        <div key={client.id} className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-4">
            {/* Header con avatar y nombre */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span className="text-lg font-bold">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{client.name}</h3>
                  <p className="text-sm text-base-content/70">ID: {client.id}</p>
                </div>
              </div>
              <div className={`badge badge-${client.is_active ? 'success' : 'error'} badge-outline`}>
                {client.is_active ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <a href={`mailto:${client.email}`} className="link link-primary text-sm">
                  {client.email}
                </a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${client.phone}`} className="link link-secondary text-sm">
                    {client.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-base-200 rounded-lg">
              <div>
                <p className="text-xs text-base-content/70 font-medium">Registrado</p>
                <p className="text-sm">{formatDate(client.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/70 font-medium">Actualizado</p>
                <p className="text-sm">{formatDate(client.updated_at)}</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onViewClient(client)}
                className="btn btn-sm btn-outline btn-info flex-1 min-w-0"
                title="Ver detalles"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">Ver</span>
              </button>
              <button
                onClick={() => onEditClient(client)}
                className="btn btn-sm btn-outline btn-warning flex-1 min-w-0"
                title="Editar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Editar</span>
              </button>
              <button
                onClick={() => onToggleStatus(client.id)}
                className={`btn btn-sm btn-outline ${client.is_active ? 'btn-warning' : 'btn-success'} flex-1 min-w-0`}
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
                <span className="hidden sm:inline">
                  {client.is_active ? 'Desactivar' : 'Activar'}
                </span>
              </button>
              <button
                onClick={() => onDeleteClient(client)}
                className="btn btn-sm btn-outline btn-error flex-1 min-w-0"
                title="Eliminar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};