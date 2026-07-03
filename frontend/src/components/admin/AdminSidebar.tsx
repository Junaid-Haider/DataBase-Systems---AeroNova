import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plane, Users, Settings, LogOut, Wrench } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../lib/stores/authStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Plane, label: 'Flights', href: '/admin/flights' },
  { icon: Users, label: 'Crew', href: '/admin/crew' },
  { icon: Wrench, label: 'Fleet & Maintenance', href: '/admin/fleet' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { clearAuth } = useAuthStore();

  return (
    <div className="w-64 bg-surface-elevated border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col pt-20">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-surface-muted uppercase tracking-wider mb-4">Admin Tools</p>
        
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive 
                  ? "bg-sky-primary-500/10 text-sky-primary-400" 
                  : "text-surface-muted hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={clearAuth}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
