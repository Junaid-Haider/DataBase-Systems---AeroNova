import { useState } from 'react';
import { Search, Package, MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../lib/api/client';
import Button from '../components/ui/Button';
import { cn, formatTime } from '../lib/utils';

export default function BaggageTrackerPage() {
  const [tagNumber, setTagNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNumber) return;
    
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await api.get(`/baggage/${tagNumber}/track`);
      setData(res.data.baggage);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Baggage not found. Please check your tag number.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch(status) {
      case 'CHECKED_IN': return 1;
      case 'LOADED': return 2;
      case 'IN_TRANSIT': return 3;
      case 'DELIVERED': return 4;
      case 'LOST': return -1;
      default: return 0;
    }
  };

  const currentStep = data ? getStatusStep(data.Status) : 0;

  return (
    <div className="pt-24 pb-12 min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-sky-primary-500/20 border border-sky-primary-500/30 flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-sky-primary-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Track Your Baggage</h1>
        <p className="text-surface-muted">Enter your baggage tag number to see its current location.</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-surface-muted" />
          <input 
            type="text" 
            value={tagNumber}
            onChange={(e) => setTagNumber(e.target.value.toUpperCase())}
            placeholder="e.g. TAG-1A2B3C4D" 
            className="w-full pl-12 pr-32 py-4 bg-surface-elevated border border-white/10 rounded-2xl text-white text-lg focus:border-sky-primary-500 outline-none uppercase transition-all"
          />
          <Button 
            type="submit" 
            variant="primary" 
            className="absolute right-2"
            loading={loading}
          >
            Track
          </Button>
        </div>
        {error && <p className="text-danger text-center mt-4">{error}</p>}
      </form>

      {data && (
        <div className="glass-card rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-white/10">
            <div>
              <p className="text-sm text-surface-muted uppercase tracking-wider mb-1">Tag Number</p>
              <p className="text-2xl font-bold text-white tracking-widest">{data.TagNumber}</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-sm text-surface-muted uppercase tracking-wider mb-1">Flight</p>
              <p className="text-lg font-bold text-white">{data.ticket?.booking?.flight?.FlightNo || 'N/A'}</p>
            </div>
          </div>

          {data.Status === 'LOST' ? (
            <div className="bg-danger/10 border border-danger/30 rounded-2xl p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-danger mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Baggage Reported Lost</h3>
              <p className="text-surface-muted">We are actively searching for your baggage. Our support team will contact you soon.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 md:left-0 md:top-6 top-0 bottom-0 md:right-0 w-0.5 md:w-full md:h-0.5 bg-white/10 -z-10"></div>
              
              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                {[
                  { step: 1, label: 'Checked In', desc: 'Counter / Kiosk' },
                  { step: 2, label: 'Loaded', desc: data.ticket?.booking?.flight?.depAirport?.IATACode },
                  { step: 3, label: 'In Transit', desc: 'In Air' },
                  { step: 4, label: 'Delivered', desc: 'Baggage Claim' }
                ].map((s) => (
                  <div key={s.step} className="flex md:flex-col items-center gap-4 md:gap-4 relative group">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4",
                      currentStep >= s.step 
                        ? "bg-sky-primary-500 border-surface-base text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]" 
                        : "bg-surface-elevated border-surface-base text-surface-muted"
                    )}>
                      {currentStep >= s.step ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5 opacity-50" />}
                    </div>
                    
                    <div className="md:text-center">
                      <p className={cn(
                        "font-bold transition-colors",
                        currentStep >= s.step ? "text-white" : "text-surface-muted"
                      )}>{s.label}</p>
                      <p className="text-sm text-surface-muted flex items-center gap-1 mt-1 justify-start md:justify-center">
                        <MapPin className="w-3 h-3" /> {s.desc || 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 bg-surface-overlay/30 rounded-xl p-4 flex justify-between text-sm">
            <div>
              <span className="text-surface-muted block mb-1">Weight</span>
              <span className="text-white font-medium">{data.WeightKg} kg</span>
            </div>
            <div>
              <span className="text-surface-muted block mb-1">Type</span>
              <span className="text-white font-medium">{data.BaggageType}</span>
            </div>
            {data.HoldSection && (
              <div>
                <span className="text-surface-muted block mb-1">Hold Section</span>
                <span className="text-white font-medium">{data.HoldSection}</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
