import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api/client';
import Button from '../components/ui/Button';
import { Search, Package, MapPin, CheckCircle, Clock } from 'lucide-react';
import ShipmentTracker from '../components/cargo/ShipmentTracker';

export default function CargoTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNo, setTrackingNo] = useState(searchParams.get('awb') || '');
  const [cargo, setCargo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingNo.trim()) return;

    setLoading(true);
    setError('');
    setSearchParams({ awb: trackingNo });
    
    try {
      const { data } = await api.get(`/cargo/${trackingNo}/track`);
      setCargo(data.cargo);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Tracking number not found.');
      setCargo(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if mounted with query param
  useEffect(() => {
    if (searchParams.get('awb')) {
      handleSearch();
    }
  }, []);

  return (
    <div className="pt-24 pb-12 min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Track Your Shipment</h1>
        <p className="text-surface-muted">Enter your Air Waybill (AWB) number to get real-time status.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-muted" />
            <input
              type="text"
              placeholder="e.g. AWB-123456"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-elevated border border-white/10 rounded-2xl text-lg text-white focus:border-sky-primary-500 outline-none transition-all shadow-lg font-mono uppercase"
            />
          </div>
          <Button type="submit" variant="primary" className="px-8" disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </form>
        {error && <p className="text-danger mt-4 text-center">{error}</p>}
      </div>

      {cargo && (
        <div className="space-y-8 animate-fade-in">
          {/* Tracking Status Visualizer */}
          <div className="glass-card rounded-2xl p-8 border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-sm text-surface-muted uppercase tracking-wider mb-1">Status</p>
                <h2 className="text-2xl font-bold text-white">{cargo.Status}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-surface-muted uppercase tracking-wider mb-1">AWB Number</p>
                <p className="text-xl font-mono text-sky-primary-400 font-bold">{cargo.TrackingNo}</p>
              </div>
            </div>

            <ShipmentTracker status={cargo.Status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-primary-400" />
                Shipment Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-white/5">
                  <span className="text-surface-muted">Type</span>
                  <span className="font-medium text-white">
                    <span className="px-2 py-1 bg-surface-overlay rounded text-xs mr-2">{cargo.CargoType}</span>
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/5">
                  <span className="text-surface-muted">Weight</span>
                  <span className="font-medium text-white">{cargo.WeightKg} kg</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/5">
                  <span className="text-surface-muted">Volume</span>
                  <span className="font-medium text-white">{cargo.VolumeM3} m³</span>
                </div>
                {cargo.CargoType === 'PERISHABLE' && (
                  <div className="flex justify-between pb-3 border-b border-white/5">
                    <span className="text-surface-muted">Temp. Requirement</span>
                    <span className="font-medium text-sky-primary-400">{cargo.TempReq_C}°C</span>
                  </div>
                )}
                {cargo.CargoType === 'HAZMAT' && (
                  <div className="flex justify-between pb-3 border-b border-white/5">
                    <span className="text-surface-muted">UN Class</span>
                    <span className="font-medium text-danger">{cargo.HazClass}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-primary-400" />
                Routing Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-white/5">
                  <span className="text-surface-muted">Flight No</span>
                  <span className="font-medium text-white">{cargo.flight?.FlightNo || 'TBD'}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/5">
                  <span className="text-surface-muted">Departure Date</span>
                  <span className="font-medium text-white">{cargo.flight?.DepDate || 'TBD'}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/5">
                  <span className="text-surface-muted">Sender</span>
                  <span className="font-medium text-white">{cargo.SenderName}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/5">
                  <span className="text-surface-muted">Receiver</span>
                  <span className="font-medium text-white">{cargo.ReceiverName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
