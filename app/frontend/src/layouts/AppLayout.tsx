import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  Shield,
  BarChart2,
  ClipboardList,
  UserCog,
  Settings,
  HardDrive,
  LogOut,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/loans', label: 'Loans', icon: CreditCard },
  { to: '/payments', label: 'Payments', icon: Wallet },
  { to: '/collateral', label: 'Collateral', icon: Shield },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/audit', label: 'Audit Log', icon: ClipboardList },
  { to: '/users', label: 'Users', icon: UserCog },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/backups', label: 'Backups', icon: HardDrive },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-200">
          <Building2 className="text-primary-600 shrink-0" size={28} />
          {!collapsed && (
            <span className="font-bold text-lg text-gray-800">MIG LMS</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 px-4 py-3 text-gray-500 hover:text-gray-700 border-t border-gray-200"
        >
          {collapsed ? <Menu size={18} /> : <><X size={18} /><span className="text-sm">Collapse</span></>}
        </button>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-200 shrink-0">
          <h1 className="text-gray-700 font-semibold text-sm">Loan Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user?.username} <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{user?.role}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
