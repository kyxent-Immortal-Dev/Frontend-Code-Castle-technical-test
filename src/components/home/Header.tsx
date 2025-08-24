import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../atoms/Sidebar";
import { ModalComponent } from "../atoms/ModalComponent";
import { useAuthService } from "../../store/useAuth.service";
import { useThemeStore } from "../../store/useTheme.store";

export const Header = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthService();
  const navigate = useNavigate();

  const { setTheme, supportedThemes } = useThemeStore();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render header if not authenticated
  }

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <div>
            <Sidebar />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {supportedThemes.map((theme) => (
                <li key={theme.name}>
                  <button onClick={() => handleThemeChange(theme.name)}>
                    {theme.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              onClick={handleProfileClick}
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleProfileClick} className="justify-between">
                  Perfil
                  <span className="badge badge-primary">Nuevo</span>
                </a>
              </li>
              <li>
                <a>Configuración</a>
              </li>
              <li>
                <a onClick={handleLogout}>Cerrar Sesión</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ModalComponent
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Perfil de Usuario"
        size="md"
        showCloseButton={true}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-xl font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{user.name}</h4>
              <p className="text-sm opacity-70">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title">Rol</div>
              <div className="stat-value text-lg capitalize">{user.role}</div>
            </div>
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title">Estado</div>
              <div className="stat-value text-lg">
                <div className={`badge ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              className="btn btn-outline btn-error flex-1"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </ModalComponent>
    </>
  );
};
