import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Plane } from 'lucide-react';
import { searchAirports } from '../../lib/api/flights';
import type { Airport } from '../../types/flight';
import { cn } from '../../lib/utils';

interface Props {
  label: string;
  placeholder?: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  icon?: 'departure' | 'arrival';
}

export default function AirportAutocomplete({ label, placeholder = 'City or airport', onChange, icon = 'departure' }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) { setResults([]); return; }
    setLoading(true);
    try {
      const airports = await searchAirports(q);
      setResults(airports);
      setIsOpen(true);
    } catch { setResults([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); selectAirport(results[activeIndex]); }
    if (e.key === 'Escape') setIsOpen(false);
  };

  const selectAirport = (airport: Airport) => {
    onChange(airport);
    setQuery(`${airport.city} (${airport.iata_code})`);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-surface-muted mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-primary-400">
          {icon === 'departure' ? <Plane className="w-4 h-4" /> : <Plane className="w-4 h-4 rotate-90" />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(null); }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white placeholder-surface-muted text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 transition-all outline-none"
        />
        {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2"><div className="w-4 h-4 border-2 border-sky-primary-400 border-t-transparent rounded-full animate-spin" /></div>}
      </div>

      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} className="absolute z-50 w-full mt-1 py-1 glass-strong rounded-xl overflow-hidden max-h-60 overflow-y-auto">
          {results.map((airport, i) => (
            <button
              key={airport.iata_code}
              onClick={() => selectAirport(airport)}
              className={cn(
                'w-full text-left px-4 py-3 flex items-center gap-3 transition-colors',
                i === activeIndex ? 'bg-sky-primary-500/15 text-white' : 'text-surface-muted hover:bg-white/5 hover:text-white'
              )}
            >
              <MapPin className="w-4 h-4 text-sky-primary-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{airport.city}, {airport.country}</div>
                <div className="text-xs text-surface-muted truncate">{airport.airport_name}</div>
              </div>
              <span className="text-xs font-bold text-sky-primary-400 bg-sky-primary-500/10 px-2 py-0.5 rounded">{airport.iata_code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
