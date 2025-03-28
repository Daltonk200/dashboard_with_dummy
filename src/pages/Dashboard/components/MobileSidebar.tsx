// src/pages/Dashboard/components/MobileSidebar.tsx
import React from 'react';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import SidebarNavItems from './SidebarNavItems';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, user }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    onClose();
  };

  return (
    <div className={`md:hidden fixed inset-0 flex z-40 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <span className="text-2xl font-bold text-blue-600">Dashboard</span>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            <SidebarNavItems />
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.username}</p>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
