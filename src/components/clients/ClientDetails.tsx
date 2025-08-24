import { formatDate } from '../../utils/FormatDate';
import type { Client } from '../../interfaces/sales/Client.interfaces';

interface ClientDetailsProps {
  client: Client | null;
}

export const ClientDetails = ({ client }: ClientDetailsProps) => {
  if (!client) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Cliente no encontrado</h3>
        <p className="text-base-content/70">No se pudo cargar la información del cliente</p>
      </div>
    );
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <span className="badge badge-success gap-1">
        <div className="w-2 h-2 bg-current rounded-full"></div>
        Activo
      </span> : 
      <span className="badge badge-error gap-1">
        <div className="w-2 h-2 bg-current rounded-full"></div>
        Inactivo
      </span>;
  };

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-20">
            <span className="text-2xl font-semibold">
              {client.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div>
          <h4 className="text-2xl font-bold">{client.name}</h4>
          <p className="text-lg opacity-70">{client.email}</p>
        </div>
      </div>

      {/* Client Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Teléfono</div>
          <div className="stat-value text-lg">
            {client.phone ? (
              <a href={`tel:${client.phone}`} className="link link-primary">
                {client.phone}
              </a>
            ) : (
              <span className="text-base-content/50">No especificado</span>
            )}
          </div>
        </div>
        
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Estado</div>
          <div className="stat-value text-lg">{getStatusBadge(client.is_active)}</div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <div className="card bg-base-100">
          <div className="card-body">
            <h5 className="card-title">Información del cliente</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">ID del cliente:</span>
                <span className="font-mono text-sm">{client.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <a href={`mailto:${client.email}`} className="link link-primary">
                  {client.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha de registro:</span>
                <span>{formatDate(new Date(client.created_at))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Última actualización:</span>
                <span>{formatDate(new Date(client.updated_at))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Information */}
        {client.sales && client.sales.length > 0 && (
          <div className="card bg-base-100">
            <div className="card-body">
              <h5 className="card-title">Historial de ventas</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Total de ventas:</span>
                  <span className="badge badge-info">{client.sales.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ventas activas:</span>
                  <span className="badge badge-success">
                    {client.sales.filter(sale => sale.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ventas canceladas:</span>
                  <span className="badge badge-warning">
                    {client.sales.filter(sale => sale.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
