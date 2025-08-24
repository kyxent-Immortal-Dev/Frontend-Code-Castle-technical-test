import { Menu, Home, Users, Settings, LogOut, Shield, Box, ArrowRightToLine } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthService } from "../../store/useAuth.service";
import { useThemeStore } from "../../store/useTheme.store";

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthService();
  const { theme, setTheme, supportedThemes } = useThemeStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/users', label: 'Usuarios', icon: Users },
    { path: '/suppliers', label: 'Proveedores', icon: Users },
    { path: '/products', label: 'Productos', icon: Box },
    { path: '/settings', label: 'Configuración', icon: Settings },

  ];

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <button onClick={() => document.getElementById('my-drawer')?.click()} className="drawer-button cursor-pointer btn btn-ghost btn-circle">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="drawer-side z-50">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          
          {/* Sidebar Content */}
          <div className="bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-base-100 rounded-lg">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-12">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Sistema</h2>
                <p className="text-sm opacity-70">Inventario</p>
              </div>
                <div className="flex items-center gap-2">
                  Cerrar <ArrowRightToLine className="cursor-pointer w-6 h-6" onClick={() => document.getElementById('my-drawer')?.click()} />
                </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="mb-6 p-4 bg-base-100 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span className="text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs opacity-70 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`badge badge-sm ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1">
              <ul className="menu menu-lg">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link 
                        to={item.path} 
                        className={`${isActiveRoute(item.path) ? 'active' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Theme Selector */}
            <div className="mb-4">
              <div className="divider">Tema</div>
              <div className="flex gap-2">
                {supportedThemes.map((themeOption) => (
                  <button
                    key={themeOption.name}
                    onClick={() => handleThemeChange(themeOption.name)}
                    className={`btn btn-sm ${theme === themeOption.name ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {themeOption.name === 'light' ? '🌞' : '🌙'}
                  </button>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-auto">
              <button 
                onClick={handleLogout}
                className="btn btn-error btn-outline w-full gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
