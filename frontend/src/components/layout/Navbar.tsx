import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

import { useAuthStore } from '../../lib/stores/authStore';
import api from '../../lib/api/client';

const navLinks = [
  { label: 'Flights', href: '/flights/search' },
  { label: 'My Trips', href: '/dashboard' },
  { label: 'Cargo', href: '/cargo' },
  { label: 'Loyalty', href: '/loyalty' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(e) {}
    clearAuth();
    navigate('/');
  };

  return (
    <nav className={cn(
      'fixed top-0 w-full z-50 transition-all duration-300',
      scrolled || !isHome
        ? 'glass-frosted border-b border-white/5'
        : 'bg-transparent border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-sky-primary-500/30 group-hover:shadow-sky-primary-500/50 transition-shadow">
              <img src="/logo.png" alt="AeroNova Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Aero<span className="text-sky-primary-400">Nova</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-sky-primary-400 bg-sky-primary-500/10'
                    : 'text-surface-muted hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin Link */}
            {user?.employeeProfile?.Role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname.startsWith('/admin')
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-purple-300/70 hover:text-purple-300 hover:bg-white/5'
                )}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-white hover:text-sky-primary-400 transition-colors mr-2">
                  Hi, {user?.firstName}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Log Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log In</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden glass-strong border-t border-white/5">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-surface-muted hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile Admin Link */}
            {user?.employeeProfile?.Role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-white/5"
              >
                Admin Panel
              </Link>
            )}
            
            <div className="pt-4 border-t border-white/10 flex gap-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 px-4 py-2 text-center text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors border border-white/10"
                  >
                    Dashboard
                  </Link>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
                    Log In
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => { navigate('/register'); setMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
