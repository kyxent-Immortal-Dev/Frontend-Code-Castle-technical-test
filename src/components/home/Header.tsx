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
          <button>
            <Sidebar />
          </button>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </label>
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
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={handleProfileClick}
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleProfileClick} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ModalComponent
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">User Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Name:</label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email:</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role:</label>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status:</label>
              <p className={`text-sm ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button 
              className="btn btn-primary"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Close
            </button>
            <button 
              className="btn btn-outline btn-error"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </ModalComponent>
    </>
  );
};
