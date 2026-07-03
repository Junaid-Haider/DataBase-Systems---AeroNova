import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings, Shield, Server, Key, RefreshCw, Check, Power } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('access');

  const { data: admins, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/settings/admins');
      return res.data?.data || [];
    }
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-surface-muted">Configure global application parameters and access control.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('access')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'access' ? 'bg-sky-primary-500/20 text-sky-primary-400' : 'text-surface-muted hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> Access Control
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'config' ? 'bg-sky-primary-500/20 text-sky-primary-400' : 'text-surface-muted hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" /> Global Config
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'api' ? 'bg-sky-primary-500/20 text-sky-primary-400' : 'text-surface-muted hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" /> API Integrations
        </button>
      </div>

      {activeTab === 'access' && (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">System Administrators</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-muted">
              <thead className="text-xs uppercase bg-white/5 text-white/70">
                <tr>
                  <th className="px-6 py-4">Admin Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Scope</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                    </tr>
                  ))
                ) : (
                  admins?.map((admin: any) => (
                    <tr key={admin.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-primary-500/20 flex items-center justify-center text-sky-primary-400 font-bold">
                          {admin.name.charAt(0)}
                        </div>
                        {admin.name}
                      </td>
                      <td className="px-6 py-4">{admin.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={admin.scope === 'ALL' ? 'default' : 'info'}>{admin.scope}</Badge>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {admin.lastLogin !== 'Never' ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
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
      )}

      {activeTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Core Systems</h3>
            <div className="space-y-4">
              {[
                { name: 'Flight Booking Engine', desc: 'Allow passengers to search and book flights', status: true },
                { name: 'Loyalty Program Engine', desc: 'Process miles accrual and redemptions', status: true },
                { name: 'Cargo Booking System', desc: 'Accept new freight and cargo bookings', status: false },
                { name: 'Automated Seat Assignment', desc: 'Auto-assign seats for basic economy', status: true }
              ].map((sys, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-overlay/30">
                  <div>
                    <h4 className="font-bold text-white">{sys.name}</h4>
                    <p className="text-xs text-surface-muted">{sys.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${sys.status ? 'bg-green-500' : 'bg-surface-muted'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${sys.status ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Maintenance Tasks</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-overlay/30 hover:bg-white/5 transition-colors text-left">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2"><RefreshCw className="w-4 h-4 text-sky-primary-400"/> Clear Search Cache</h4>
                  <p className="text-xs text-surface-muted">Clears cached flight search results</p>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-overlay/30 hover:bg-white/5 transition-colors text-left">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/> Sync Flight Statuses</h4>
                  <p className="text-xs text-surface-muted">Force sync with external ATC APIs</p>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-danger/10 hover:bg-danger/20 border border-danger/20 transition-colors text-left">
                <div>
                  <h4 className="font-bold text-danger flex items-center gap-2"><Power className="w-4 h-4"/> Maintenance Mode</h4>
                  <p className="text-xs text-danger/70">Take entire passenger system offline</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5">
          <Key className="w-16 h-16 text-sky-primary-400 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-white mb-2">API Keys & Webhooks</h2>
          <p className="text-surface-muted max-w-md mx-auto">
            Manage your external API integrations for payments, SMS notifications, and ATC data here.
          </p>
        </div>
      )}

    </AdminLayout>
  );
}
