import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import api from '../../lib/api/client';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlights() {
      try {
        // Since we protected the route, you'd normally need admin tokens. 
        // We'll catch and ignore errors for now if auth fails during dev testing.
        const res = await api.get('/admin/flights').catch(() => ({ data: { flights: [] } }));
        setFlights(res.data.flights || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Flight Management</h1>
          <p className="text-surface-muted">Create, edit, and monitor all flight schedules.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          New Flight
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between bg-surface-overlay/20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input 
              type="text" 
              placeholder="Search flights by number or route..." 
              className="w-full pl-9 pr-4 py-2 bg-surface-base border border-white/10 rounded-lg text-sm text-white focus:border-sky-primary-500 outline-none transition-all"
            />
          </div>
          <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-overlay/40 text-xs uppercase text-surface-muted tracking-wider border-b border-white/5">
                <th className="px-6 py-4 font-medium">Flight No</th>
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Departure Date</th>
                <th className="px-6 py-4 font-medium">Aircraft</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-surface-muted">Loading flights...</td></tr>
              ) : flights.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-surface-muted">No flights found in database. Create one to get started.</td></tr>
              ) : (
                flights.map((f: any) => (
                  <tr key={f.FlightID} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{f.FlightNo}</td>
                    <td className="px-6 py-4 text-surface-muted">
                      {f.depAirport?.IATACode} → {f.arrAirport?.IATACode}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {new Date(f.DepDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-surface-muted">{f.aircraft?.Model || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                        {f.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-surface-muted hover:text-white transition-colors p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
