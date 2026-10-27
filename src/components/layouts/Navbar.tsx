import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogOut, ChevronDown, 
  MonitorSmartphone, Package, FileBarChart2, 
  Settings, Users, Clock, User 
} from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatDateTimeShort } from '../../lib/formatters';
import BrandLogo from '../common/BrandLogo';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const { store } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentFormattedTime = formatDateTimeShort(currentTime);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Error saat logout:', err);
    } finally {
      setProfileDropdownOpen(false);
      navigate('/login');
    }
  };

  const allNavItems = [
    {
      label: 'Kasir',
      path: '/',
      icon: MonitorSmartphone,
      isAllowed: () => hasPermission('transactions:view'),
    },
    {
      label: 'Produk',
      path: '/produk',
      icon: Package,
      isAllowed: () => hasPermission('products:view') || hasPermission('categories:view'),
    },
    {
      label: 'Laporan',
      path: '/laporan',
      icon: FileBarChart2,
      isAllowed: () => hasPermission('transactions:view'),
    },
    {
      label: 'Toko',
      path: '/pengaturan-toko',
      icon: Settings,
      isAllowed: () => hasPermission('store:view'),
    },
    {
      label: 'Pengguna',
      path: '/pengaturan-users',
      icon: Users,
      isAllowed: () => hasPermission('users:view') || hasPermission('roles:view'),
    },
  ];

  const navItems = allNavItems.filter((item) => item.isAllowed());

  return (
    <header className="fixed top-0 w-full z-40 bg-surface-card/90 backdrop-blur-md border-b border-border-subtle shadow-xs transition-all">
      <div className="h-16 w-full max-w-[1680px] mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
        
        {/* Kiri: Brand & Logo */}
        <div className="flex items-center gap-3 w-1/4 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-text-muted hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
            type="button"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div 
            className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]" 
            onClick={() => navigate('/')}
            title="KasirIn POS"
          >
            <BrandLogo variant="pill" size="md" />
          </div>
        </div>

        {/* Tengah: Navigation Tabs */}
        <nav className="hidden lg:flex items-center justify-center gap-1 w-2/4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                      : 'text-text-muted hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Kanan: Store, Time & Profile */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          <div className="hidden md:flex flex-col items-end border-r border-border-subtle pr-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-on-surface truncate max-w-[150px]">
                {store?.storeName || 'KasirIn Store'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
              <Clock className="w-3 h-3" />
              {currentFormattedTime}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer group"
              aria-expanded={profileDropdownOpen}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-on-surface leading-tight truncate max-w-[120px] sm:max-w-[150px]">
                  {user?.name || 'User'}
                </span>
                <span className="text-[11px] font-medium text-text-muted capitalize leading-tight">
                  {user?.roleName || 'Staff'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu dengan Animasi Sederhana */}
            <div 
              className={`absolute right-0 top-full mt-2 w-48 rounded-xl bg-surface-card border border-border-subtle shadow-lg p-1.5 z-50 transform origin-top-right transition-all duration-200 ${
                profileDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}
            >
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-surface-card border-t border-border-subtle shadow-lg ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="w-full max-w-[1680px] mx-auto px-4 lg:px-6 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-muted hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};