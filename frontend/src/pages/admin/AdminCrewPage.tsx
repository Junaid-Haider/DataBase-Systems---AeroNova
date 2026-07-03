import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, Mail, Phone, Globe, Shield, RefreshCw } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';

export default function AdminCrewPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-crew'],
    queryFn: async () => {
      const res = await api.get('/admin/crew');
      return res.data?.data || [];
    }
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Crew Management</h1>
          <p className="text-surface-muted">Manage pilots, cabin crew, and flight assignments.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-muted">
            <thead className="text-xs uppercase bg-white/5 text-white/70">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Crew Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">License / Cert</th>
                <th className="px-6 py-4 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                  </tr>
                ))
              ) : data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-surface-muted mx-auto mb-3 opacity-50" />
                    <p>No crew members found.</p>
                  </td>
                </tr>
              ) : (
                data?.map((crew: any) => (
                  <tr key={crew.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{crew.name}</div>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <Globe className="w-3 h-3" /> {crew.nationality}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        crew.role.includes('PILOT') ? 'default' : 'info'
                      }>
                        {crew.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {crew.email}</div>
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {crew.phone}</div>
                    </td>
                    <td className="px-6 py-4 space-y-1 text-xs">
                      <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-sky-primary-400" /> {crew.license}</div>
                      <div>Med Cert: <span className="text-white">{crew.medicalCert}</span></div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
