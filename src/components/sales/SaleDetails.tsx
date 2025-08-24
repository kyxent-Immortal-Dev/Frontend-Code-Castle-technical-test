import { formatDate } from '../../utils/FormatDate';
import { formatCurrency } from '../../utils/NumberUtils';
import type { Sale } from '../../interfaces/sales/Sales.interfaces';

interface SaleDetailsProps {
  sale: Sale | null;
}

export const SaleDetails = ({ sale }: SaleDetailsProps) => {
  if (!sale) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Venta no encontrada</h3>
        <p className="text-base-content/70">No se pudo cargar la información de la venta</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 
      <span className="badge badge-success gap-1">
        <div className="w-2 h-2 bg-current rounded-full"></div>
        Activa
      </span> : 
      <span className="badge badge-error gap-1">
        <div className="w-2 h-2 bg-current rounded-full"></div>
        Cancelada
      </span>;
  };

  return (
    <div className="space-y-6">
      {/* Sale Header */}
      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-20">
            <span className="text-2xl font-semibold">
              {formatCurrency(sale.total_amount)}
            </span>
          </div>
        </div>
        <div>
          <h4 className="text-2xl font-bold">Venta #{sale.id}</h4>
          <p className="text-lg opacity-70">{formatDate(new Date(sale.sale_date))}</p>
        </div>
      </div>

      {/* Sale Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Cliente</div>
          <div className="stat-value text-lg">{sale.client.name}</div>
          <div className="stat-desc">{sale.client.email}</div>
        </div>
        
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Vendedor</div>
          <div className="stat-value text-lg">{sale.user.name}</div>
          <div className="stat-desc capitalize">{sale.user.role}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Estado</div>
          <div className="stat-value text-lg">{getStatusBadge(sale.status)}</div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <div className="card bg-base-100">
          <div className="card-body">
            <h5 className="card-title">Información de la venta</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">ID de venta:</span>
                <span className="font-mono text-sm">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha de venta:</span>
                <span>{formatDate(new Date(sale.sale_date))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">{formatCurrency(sale.total_amount)}</span>
              </div>
              {sale.notes && (
                <div className="flex justify-between">
                  <span className="font-medium">Notas:</span>
                  <span className="text-right max-w-xs">{sale.notes}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Fecha de registro:</span>
                <span>{formatDate(new Date(sale.created_at))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Última actualización:</span>
                <span>{formatDate(new Date(sale.updated_at))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Information */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h5 className="card-title">Productos vendidos</h5>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.sale_details.map((detail) => (
                    <tr key={detail.id}>
                      <td>
                        <div>
                          <div className="font-bold">{detail.product.name}</div>
                          <div className="text-sm opacity-70">{detail.product.description}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">{detail.quantity}</span>
                      </td>
                      <td>{formatCurrency(detail.sale_price)}</td>
                      <td className="font-bold">{formatCurrency(detail.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={3} className="text-right">Total:</td>
                    <td>{formatCurrency(sale.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h5 className="card-title">Información del cliente</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Nombre:</span>
                <span>{sale.client.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <a href={`mailto:${sale.client.email}`} className="link link-primary">
                  {sale.client.email}
                </a>
              </div>
              {sale.client.phone && (
                <div className="flex justify-between">
                  <span className="font-medium">Teléfono:</span>
                  <a href={`tel:${sale.client.phone}`} className="link link-secondary">
                    {sale.client.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
