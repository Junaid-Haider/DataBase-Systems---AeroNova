import { Plane, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FlightResult } from '../../types/flight';
import { formatCurrency, formatDuration, formatTime } from '../../lib/utils';
import Badge, { StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { useCardTilt } from '../../lib/hooks/useCardTilt';
import { useScrollReveal } from '../../lib/hooks/useScrollReveal';

interface Props {
  flight: FlightResult;
  cabinClass?: string;
}

export default function FlightCard({ flight, cabinClass = 'ECONOMY' }: Props) {
  const navigate = useNavigate();
  let fares = flight.fares || { ECONOMY: 0 };
  if (typeof fares === 'string') { try { fares = JSON.parse(fares); } catch(e) {} }
  if (typeof fares === 'string') { try { fares = JSON.parse(fares); } catch(e) {} }
  const fare = fares[cabinClass as keyof typeof fares] || fares.ECONOMY || 0;
  const depTime = flight.schedule?.dep_time || '00:00';
  const arrTime = flight.schedule?.arr_time || '00:00';

  const { ref, isVisible } = useScrollReveal();
  const { cardRef, handleMouseMove, handleMouseLeave } = useCardTilt(6);

  const cardRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardRevealVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card card-3d rounded-xl p-5 border border-surface-border hover:border-sky-primary-500/50 transition-all duration-300 group glass-blue card-lift"
      >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Airline + flight info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-sky-primary-500/15 flex items-center justify-center border border-sky-primary-500/20">
            <Plane className="w-5 h-5 text-sky-primary-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{flight.flight_no}</p>
            <div className="flex items-center gap-2">
              <Badge variant={flight.aircraft?.type === 'WIDE-BODY' ? 'info' : 'default'} size="sm">
                {flight.aircraft?.model || 'Aircraft'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Route: Dep → Duration → Arr */}
        <div className="flex-1 flex items-center gap-3 md:mx-6">
          {/* Departure */}
          <div className="text-center min-w-[70px]">
            <p className="text-xl font-bold text-white">{formatTime(depTime)}</p>
            <p className="text-xs text-sky-primary-400 font-semibold">{flight.dep_airport?.iata_code}</p>
            <p className="text-xs text-surface-muted truncate max-w-[80px]">{flight.dep_airport?.city}</p>
          </div>

          {/* Duration line */}
          <div className="flex-1 relative px-2">
            <div className="h-px bg-gradient-to-r from-sky-primary-500/50 via-sky-primary-400 to-sky-primary-500/50" />
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-sky-primary-400 bg-surface-elevated rounded-full p-0.5" />
            <div className="flex justify-center mt-1.5">
              <span className="text-xs text-surface-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(flight.duration.hours, flight.duration.minutes)}
              </span>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center min-w-[70px]">
            <p className="text-xl font-bold text-white">{formatTime(arrTime)}</p>
            <p className="text-xs text-sky-primary-400 font-semibold">{flight.arr_airport?.iata_code}</p>
            <p className="text-xs text-surface-muted truncate max-w-[80px]">{flight.arr_airport?.city}</p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="text-right shrink-0 flex flex-row md:flex-col items-center md:items-end gap-3">
          <div>
            <p className="text-2xl font-bold text-white">{formatCurrency(fare)}</p>
            <p className="text-xs text-surface-muted">per person</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/flights/${flight.flight_id}`)}
            className="group-hover:shadow-lg group-hover:shadow-sky-primary-500/25 transition-shadow"
          >
            Select
          </Button>
        </div>
      </div>

      {/* Status + Type badges */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        <StatusBadge status={flight.status} />
        <Badge>{flight.flight_type}</Badge>
        {flight.available_seats[cabinClass] !== undefined && (
          <Badge variant={flight.available_seats[cabinClass] < 10 ? 'danger' : 'success'}>
            {flight.available_seats[cabinClass]} seats left
          </Badge>
        )}
      </div>
    </div>
    </motion.div>
  );
}
