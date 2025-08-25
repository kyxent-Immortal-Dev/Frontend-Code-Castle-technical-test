import { formatDate } from '../../utils/FormatDate';
import type { DataUsers } from '../../interfaces/users/Users.Interfaces';

interface UserDetailsProps {
  user: DataUsers | null;
}

export const UserDetails = ({ user }: UserDetailsProps) => {
  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Usuario no encontrado</h3>
        <p className="text-base-content/70">No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'badge-error',
      vendedor: 'badge-warning'
    };
    return <span className={`badge ${roleColors[role as keyof typeof roleColors] || 'badge-info'}`}>{role}</span>;
  };

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
      {/* User Header */}
      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-20">
            <span className="text-2xl font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div>
          <h4 className="text-2xl font-bold">{user.name}</h4>
          <p className="text-lg opacity-70">{user.email}</p>
        </div>
      </div>

      {/* User Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Rol</div>
          <div className="stat-value text-lg">{getRoleBadge(user.role)}</div>
        </div>
        
        <div className="stat bg-base-100 rounded-lg">
          <div className="stat-title">Estado</div>
          <div className="stat-value text-lg">{getStatusBadge(user.is_active)}</div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <div className="card bg-base-100">
          <div className="card-body">
            <h5 className="card-title">Información de la cuenta</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">ID de usuario:</span>
                <span className="font-mono text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Verificación de email:</span>
                <span className={user.email_verified_at ? 'text-success' : 'text-warning'}>
                  {user.email_verified_at ? 'Verificado' : 'No verificado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha de creación:</span>
                <span>{formatDate(user.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Última actualización:</span>
                <span>{formatDate(user.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 