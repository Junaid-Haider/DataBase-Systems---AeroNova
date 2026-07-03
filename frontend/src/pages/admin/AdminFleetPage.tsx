import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import { PenTool, Plane, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';

export default function AdminFleetPage() {
  const { data: aircraftData, isLoading: loadingAircraft } = useQuery({
    queryKey: ['admin-fleet-aircraft'],
    queryFn: async () => {
      const res = await api.get('/admin/fleet/aircraft');
      return res.data?.data || [];
    }
  });

  const { data: maintenanceData, isLoading: loadingMaintenance, refetch } = useQuery({
    queryKey: ['admin-fleet-maintenance'],
    queryFn: async () => {
      const res = await api.get('/admin/fleet/maintenance');
      return res.data?.data || [];
    }
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Fleet & Maintenance</h1>
          <p className="text-surface-muted">Monitor aircraft status, capacity, and maintenance schedules.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Aircraft List */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-primary-400" />
              Active Fleet
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {loadingAircraft ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : aircraftData?.length === 0 ? (
              <div className="text-center py-8 text-surface-muted">No aircraft found.</div>
            ) : (
              aircraftData?.map((a: any) => (
                <div key={a.AircraftID} className="flex items-center justify-between p-4 rounded-xl bg-surface-overlay/30 border border-white/5">
                  <div>
                    <h3 className="font-bold text-white">{a.Model}</h3>
                    <p className="text-sm text-sky-primary-400">{a.RegNumber}</p>
                    <p className="text-xs text-surface-muted mt-1">Capacity: {a.Capacity} • Mfg: {a.MfgYear}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={a.Status === 'ACTIVE' ? 'success' : a.Status === 'MAINTENANCE' ? 'warning' : 'default'}>
                      {a.Status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Maintenance Logs */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PenTool className="w-5 h-5 text-sky-primary-400" />
              Maintenance Logs
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {loadingMaintenance ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : maintenanceData?.length === 0 ? (
              <div className="text-center py-8 text-surface-muted">No maintenance logs found.</div>
            ) : (
              maintenanceData?.map((m: any) => (
                <div key={m.MaintenID} className="flex items-start gap-4 p-4 rounded-xl bg-surface-overlay/30 border border-white/5">
                  <div className={`p-2 rounded-lg ${m.Status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {m.Status === 'COMPLETED' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white">{m.Type}</h3>
                      <Badge variant={
                        m.Status === 'COMPLETED' ? 'success' : 
                        m.Status === 'IN_PROGRESS' ? 'info' : 
                        m.Status === 'DELAYED' ? 'danger' : 'warning'
                      }>
                        {m.Status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-sky-primary-400 my-1">{m.aircraft?.Model} ({m.aircraft?.RegNumber})</p>
                    <p className="text-xs text-surface-muted">
                      Started: {new Date(m.StartDate).toLocaleDateString()}
                      {m.EndDate && ` • Ended: ${new Date(m.EndDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
