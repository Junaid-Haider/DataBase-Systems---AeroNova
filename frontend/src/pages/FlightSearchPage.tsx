import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchFlights } from '../lib/api/flights';
import FlightCard from '../components/flights/FlightCard';
import FlightSearchBar from '../components/search/FlightSearchBar';
import { FlightCardSkeleton } from '../components/ui/Skeleton';
import { Plane, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FlightSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [cabinFilter, setCabinFilter] = useState('ECONOMY');
  const [sortBy, setSortBy] = useState('price');

  const params: Record<string, string> = {};
  searchParams.forEach((v, k) => { params[k] = v; });

  const { data, isLoading, error } = useQuery({
    queryKey: ['flights', params],
    queryFn: () => searchFlights(params),
    enabled: Object.keys(params).length > 0,
  });

  // Client-side sort
  const sortedFlights = data?.flights ? [...data.flights].sort((a, b) => {
    if (sortBy === 'price') {
      const priceA = typeof a.fares === 'object' ? (a.fares[cabinFilter] || a.fares.ECONOMY || 0) : 0;
      const priceB = typeof b.fares === 'object' ? (b.fares[cabinFilter] || b.fares.ECONOMY || 0) : 0;
      return priceA - priceB;
    }
    if (sortBy === 'duration') {
      return (a.duration.hours * 60 + a.duration.minutes) - (b.duration.hours * 60 + b.duration.minutes);
    }
    if (sortBy === 'departure') {
      return (a.schedule?.dep_time || '').localeCompare(b.schedule?.dep_time || '');
    }
    return 0;
  }) : [];

  return (
    <div className="pt-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <FlightSearchBar compact />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {params.origin && params.destination
                ? `${params.origin} → ${params.destination}`
                : 'All Flights'}
            </h1>
            {data && <p className="text-sm text-surface-muted mt-1">{data.total} flight{data.total !== 1 ? 's' : ''} found</p>}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              showFilters 
                ? "bg-sky-primary-500/20 text-sky-primary-400 border border-sky-primary-500/30" 
                : "glass text-surface-muted hover:text-white"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="glass-card rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Filter & Sort</h3>
              <button onClick={() => setShowFilters(false)} className="text-surface-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-surface-muted mb-2">Cabin Class</label>
                <div className="flex gap-2">
                  {['ECONOMY', 'BUSINESS', 'FIRST'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setCabinFilter(c)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        cabinFilter === c
                          ? "bg-sky-primary-500 text-white"
                          : "bg-white/5 text-surface-muted hover:text-white"
                      )}
                    >
                      {c.charAt(0) + c.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-muted mb-2">Sort By</label>
                <div className="flex gap-2">
                  {[
                    { val: 'price', label: 'Price' },
                    { val: 'duration', label: 'Duration' },
                    { val: 'departure', label: 'Departure' },
                  ].map(s => (
                    <button 
                      key={s.val}
                      onClick={() => setSortBy(s.val)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        sortBy === s.val
                          ? "bg-sky-primary-500 text-white"
                          : "bg-white/5 text-surface-muted hover:text-white"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flight list */}
        <div className="space-y-4">
          {isLoading && Array.from({ length: 5 }).map((_, i) => <FlightCardSkeleton key={i} />)}

          {error && (
            <div className="glass-card rounded-xl p-12 text-center">
              <p className="text-danger mb-2">Error loading flights</p>
              <p className="text-sm text-surface-muted">Please try again later.</p>
            </div>
          )}

          {sortedFlights.map((flight) => (
            <FlightCard key={flight.flight_id} flight={flight} cabinClass={cabinFilter} />
          ))}

          {data && data.flights.length === 0 && (
            <div className="glass-card rounded-xl p-12 text-center">
              <Plane className="w-16 h-16 text-surface-muted mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-semibold text-white mb-2">No flights found</h3>
              <p className="text-sm text-surface-muted">Try different dates or destinations.</p>
            </div>
          )}

          {!data && !isLoading && !error && (
            <div className="glass-card rounded-xl p-12 text-center">
              <Plane className="w-16 h-16 text-sky-primary-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">Search for Flights</h3>
              <p className="text-sm text-surface-muted">Enter your origin and destination above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
