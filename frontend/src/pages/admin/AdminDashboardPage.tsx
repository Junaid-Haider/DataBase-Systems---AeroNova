import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import KPICard from '../../components/admin/KPICard';
import RevenueChart from '../../components/admin/RevenueChart';
import { DollarSign, PlaneTakeoff, Users, AlertCircle } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics/overview');
      return res.data;
    }
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-surface-muted">System metrics and live performance data.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Total Revenue" 
            value={`$${(data?.totalRevenue || 0).toLocaleString()}`} 
            trend={12.5} 
            icon={DollarSign} 
          />
          <KPICard 
            title="Active Flights" 
            value={(data?.activeFlights || 0).toLocaleString()} 
            trend={3.2} 
            icon={PlaneTakeoff} 
          />
          <KPICard 
            title="Passengers Today" 
            value={(data?.passengersToday || 0).toLocaleString()} 
            trend={-1.4} 
            icon={Users} 
          />
          <KPICard 
            title="System Alerts" 
            value={(data?.systemAlerts || 0).toLocaleString()} 
            icon={AlertCircle} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 border border-white/5 h-full">
            <h3 className="text-lg font-bold text-white mb-6">Recent Bookings</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {data?.recentBookings?.length > 0 ? (
                  data.recentBookings.map((b: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-overlay/30 hover:bg-surface-overlay/50 transition-colors">
                      <div>
                        <p className="font-bold text-sky-primary-400">{b.pnr}</p>
                        <p className="text-sm text-surface-muted">{b.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">${b.amount.toLocaleString()}</p>
                        <p className="text-xs text-surface-muted">{b.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-surface-muted py-4">No recent bookings</p>
                )}
              </div>
            )}
            
          </div>

          {/* Failed Notifications */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 mt-8">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-white">Failed Notifications</h3>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {data?.failedNotifications?.length > 0 ? (
                  data.failedNotifications.map((n: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div>
                        <p className="font-bold text-red-400">{n.type}</p>
                        <p className="text-xs text-red-300/70">{n.error}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-surface-muted">{n.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-surface-muted py-4">All notifications sent successfully</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
