import { Plane, MapPin, Clock, User } from 'lucide-react';
import { formatCurrency, formatDuration, formatTime } from '../../lib/utils';
import type { FlightResult, CabinClass } from '../../types/flight';
import Badge, { CabinBadge } from '../ui/Badge';

interface Props {
  flight: FlightResult | null;
  cabinClass: CabinClass;
  selectedSeats: string[];
  passengerCount: number;
}

export default function BookingSummary({ flight, cabinClass, selectedSeats, passengerCount }: Props) {
  if (!flight) return null;
  const fare = flight.fares[cabinClass as keyof typeof flight.fares] || flight.fares.ECONOMY;
  const subtotal = fare * passengerCount;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  return (
    <div className="glass-strong glow-border rounded-2xl p-6 sticky top-20">
      <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>

      {/* Flight info */}
      <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-sky-primary-400" />
          <span className="text-sm font-medium text-white">{flight.flight_no}</span>
          <CabinBadge cabin={cabinClass} />
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-muted">
          <MapPin className="w-3 h-3" />
          <span>{flight.dep_airport?.iata_code} → {flight.arr_airport?.iata_code}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-muted">
          <Clock className="w-3 h-3" />
          <span>{formatTime(flight.schedule?.dep_time || '')} - {formatTime(flight.schedule?.arr_time || '')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-muted">
          <span>{formatDuration(flight.duration.hours, flight.duration.minutes)} • {flight.dep_date}</span>
        </div>
      </div>

      {/* Seats */}
      {selectedSeats.length > 0 && (
        <div className="mb-4 pb-4 border-b border-white/10">
          <p className="text-xs text-surface-muted mb-2">Selected Seats</p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span key={seat} className="px-2 py-1 bg-sky-primary-500/15 text-sky-primary-400 rounded-md text-sm font-medium border border-sky-primary-500/20">{seat}</span>
            ))}
          </div>
        </div>
      )}

      {/* Passengers */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm text-surface-muted">
          <User className="w-3 h-3" />
          <span>{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-surface-muted">Subtotal ({passengerCount} × {formatCurrency(fare)})</span>
          <span className="text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-muted">Taxes & Fees</span>
          <span className="text-white">{formatCurrency(taxes)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
          <span className="text-white">Total</span>
          <span className="text-sky-primary-400">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
