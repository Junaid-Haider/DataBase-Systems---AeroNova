import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeftRight, Users, Calendar } from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';
import Button from '../ui/Button';
import type { Airport, CabinClass } from '../../types/flight';
import { cn } from '../../lib/utils';

export default function FlightSearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [depDate, setDepDate] = useState(new Date().toISOString().split('T')[0]);
  const [cabinClass, setCabinClass] = useState<CabinClass>('ECONOMY');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showPassengers, setShowPassengers] = useState(false);

  const swap = () => { const t = origin; setOrigin(destination); setDestination(t); };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (origin) params.set('origin', origin.iata_code);
    if (destination) params.set('destination', destination.iata_code);
    params.set('dep_date', depDate);
    params.set('cabin_class', cabinClass);
    params.set('adults', String(adults));
    params.set('children', String(children));
    navigate(`/flights/search?${params.toString()}`);
  };

  const totalPassengers = adults + children;

  return (
    <div className={cn('glass-strong rounded-2xl', compact ? 'p-4' : 'p-6 md:p-8')}>
      {/* Cabin class tabs */}
      {!compact && (
        <div className="flex gap-1 mb-6 bg-surface-overlay/50 rounded-xl p-1 w-fit">
          {(['ECONOMY', 'BUSINESS', 'FIRST'] as CabinClass[]).map((cls) => (
            <button
              key={cls}
              onClick={() => setCabinClass(cls)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                cabinClass === cls
                  ? 'bg-sky-primary-500 text-white shadow-lg shadow-sky-primary-500/25'
                  : 'text-surface-muted hover:text-white'
              )}
            >
              {cls.charAt(0) + cls.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      <div className={cn('grid gap-4', compact ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4')}>
        {/* Origin */}
        <div className="relative">
          <AirportAutocomplete label="From" value={origin} onChange={setOrigin} icon="departure" />
        </div>

        {/* Swap button (positioned between origin/dest on desktop) */}
        <button
          onClick={swap}
          className="hidden md:flex absolute left-[calc(25%-12px)] lg:left-[calc(25%-12px)] top-[50%] z-10 w-8 h-8 items-center justify-center rounded-full bg-sky-primary-500 text-white hover:bg-sky-primary-600 transition-colors shadow-lg"
          style={{ display: 'none' }} // Simplified layout
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* Destination */}
        <div className="relative">
          <AirportAutocomplete label="To" value={destination} onChange={setDestination} icon="arrival" />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-surface-muted mb-1.5">Departure</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-primary-400" />
            <input
              type="date"
              value={depDate}
              onChange={(e) => setDepDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 transition-all outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="relative">
          <label className="block text-xs font-medium text-surface-muted mb-1.5">Passengers</label>
          <button
            onClick={() => setShowPassengers(!showPassengers)}
            className="w-full pl-10 pr-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm text-left focus:border-sky-primary-500 transition-all"
          >
            <Users className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 w-4 h-4 text-sky-primary-400" />
            {totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}
          </button>
          {showPassengers && (
            <div className="absolute z-50 top-full mt-1 w-full glass-strong rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Adults</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-lg bg-surface-overlay text-white hover:bg-surface-border transition-colors flex items-center justify-center">−</button>
                  <span className="text-white font-medium w-4 text-center">{adults}</span>
                  <button onClick={() => setAdults(Math.min(9, adults + 1))} className="w-8 h-8 rounded-lg bg-surface-overlay text-white hover:bg-surface-border transition-colors flex items-center justify-center">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Children</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-lg bg-surface-overlay text-white hover:bg-surface-border transition-colors flex items-center justify-center">−</button>
                  <span className="text-white font-medium w-4 text-center">{children}</span>
                  <button onClick={() => setChildren(Math.min(9, children + 1))} className="w-8 h-8 rounded-lg bg-surface-overlay text-white hover:bg-surface-border transition-colors flex items-center justify-center">+</button>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full" onClick={() => setShowPassengers(false)}>Done</Button>
            </div>
          )}
        </div>
      </div>

      {/* Search button */}
      <Button
        variant="primary"
        size={compact ? 'lg' : 'xl'}
        className={cn('mt-4 btn-glow', compact ? 'w-auto' : 'w-full')}
        leftIcon={<Search className="w-5 h-5" />}
        onClick={handleSearch}
      >
        Search Flights
      </Button>
    </div>
  );
}
