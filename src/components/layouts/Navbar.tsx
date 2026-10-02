import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import Button from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const navItems = [
    { label: 'Transaksi (Kasir)', path: '/' },
    { label: 'Produk & Kategori', path: '/produk' },
    { label: 'Laporan', path: '/laporan' },
    { label: 'Pengaturan Toko', path: '/pengaturan-toko' },
    { label: 'User and Role', path: '/pengaturan-users' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img
            alt="KasirIn Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ZPvKyEQT0bWe9ToxLr5VDMOGzngLtGs6qjCT-RY3_bN56d5Kag9w2Ul5JgEK1uw3OYrfj4qyUk0sXcMFnshw1Jj6co1eeALKbXRaPd3s9DLlLaVUA3jZrvHQ0fR6xk5mGY7YJoAfL5T-D5E9rIN4BbMmtNg9OkFM5qU6Xf_cP0f8TeJHoNl4rv25PKYfe31XP9OsfJvaho-3X4bcegAq-uWY2vf92CXoizp0EhYrhUqJaf8QaLq9"
          />
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary tracking-tight">KasirIn</span>
            <span className="text-[11px] leading-[14px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full uppercase tracking-wider">
              UMKM POS
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm transition-colors ${isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Store & User Profile Info */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="text-sm font-semibold text-on-surface">Toko Sembako Jaya</span>
              <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded">
                Online
              </span>
            </div>
            <div className="text-xs text-text-muted">Senin, 24 Okt • 09:41 WIB</div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full p-0 hover:bg-transparent"
              aria-label="User profile menu"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed hover:ring-primary transition-all"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZTzgl9ibBZLoUZR2wDBhxx2klO4BwAg48p0GRoDFsI8-w_UCcIg1iALCOuMjzU2PCC2GWuj1nuou1Gjo7a8MqtXx3R1T_Eyc3wL0CTs1WlCsDmlI0qHV6yv3yY6r2vC-ho86K9Gbb7FRYOzUtsz-x5x880clD95ieSajII1dknoJenlfaj4J7vy6oytSGUqi83PzwIxyfpVzG_Jiv3nu1qENpL8bbis-mrXfgNrdfIxDp4VfKRnYm"
              />
            </Button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-surface-card border border-border-subtle shadow-xl py-1.5 z-50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4 text-status-danger" />}
                  className="w-full justify-start text-status-danger hover:bg-error-container/20 hover:text-status-danger px-4 py-2.5 rounded-lg text-sm font-medium"
                >
                  Keluar (Logout)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-surface-card px-4 py-3 flex flex-col gap-1 shadow-md">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
