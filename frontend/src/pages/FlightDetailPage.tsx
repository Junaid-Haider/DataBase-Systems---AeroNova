import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFlightDetail, getFlightSeats } from '../lib/api/flights';
import { useBookingStore } from '../lib/stores/bookingStore';
import SeatMap from '../components/flights/SeatMap';
import BookingSummary from '../components/booking/BookingSummary';
import Button from '../components/ui/Button';
import Badge, { StatusBadge, CabinBadge } from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { Plane, Clock, ArrowRight, Users } from 'lucide-react';
import { formatDuration, formatTime, cn } from '../lib/utils';
import type { CabinClass } from '../types/flight';

export default function FlightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const flightId = parseInt(id || '0');

  const { cabinClass, setCabinClass, selectedSeats, toggleSeat, passengers, setFlight } = useBookingStore();

  const { data: flight, isLoading: loadingFlight } = useQuery({
    queryKey: ['flight', flightId],
    queryFn: () => getFlightDetail(flightId),
    enabled: flightId > 0,
  });

  const { data: seatData, isLoading: loadingSeats } = useQuery({
    queryKey: ['seats', flightId],
    queryFn: () => getFlightSeats(flightId),
    enabled: flightId > 0,
  });

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    setFlight(flightId);
    navigate('/booking/new');
  };

  if (loadingFlight) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="w-64 h-8 mb-4" />
        <Skeleton className="w-full h-48 mb-6" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 text-surface-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Flight not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-surface-muted mb-6">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate(-1)} className="hover:text-white transition-colors">
            {flight.dep_airport?.city} → {flight.arr_airport?.city}
          </button>
          <span>/</span>
          <span className="text-white">{flight.flight_no}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight detail card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-primary-500/15 flex items-center justify-center border border-sky-primary-500/20">
                    <Plane className="w-6 h-6 text-sky-primary-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{flight.flight_no}</h1>
                    <p className="text-sm text-surface-muted">{flight.aircraft?.model}</p>
                  </div>
                </div>
                <StatusBadge status={flight.status} />
              </div>

              {/* Route display */}
              <div className="flex items-center justify-between px-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{formatTime(flight.schedule?.dep_time || '')}</p>
                  <p className="text-lg font-semibold text-sky-primary-400 mt-1">{flight.dep_airport?.iata_code}</p>
                  <p className="text-sm text-surface-muted">{flight.dep_airport?.city}</p>
                  <p className="text-xs text-surface-muted mt-1">{flight.dep_airport?.terminal && `Terminal ${flight.dep_airport.terminal}`}</p>
                </div>

                <div className="flex-1 mx-8">
                  <div className="relative">
                    <div className="h-px bg-gradient-to-r from-sky-primary-500/30 via-sky-primary-400 to-sky-primary-500/30" />
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-sky-primary-400" />
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-surface-muted" />
                    <span className="text-sm text-surface-muted">{formatDuration(flight.duration.hours, flight.duration.minutes)}</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{formatTime(flight.schedule?.arr_time || '')}</p>
                  <p className="text-lg font-semibold text-sky-primary-400 mt-1">{flight.arr_airport?.iata_code}</p>
                  <p className="text-sm text-surface-muted">{flight.arr_airport?.city}</p>
                  <p className="text-xs text-surface-muted mt-1">{flight.arr_airport?.terminal && `Terminal ${flight.arr_airport.terminal}`}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/5">
                <Badge>{flight.flight_type}</Badge>
                <Badge variant="info">{flight.dep_date}</Badge>
                <Badge>{flight.aircraft?.type}</Badge>
              </div>
            </div>

            {/* Cabin class selector */}
            <div className="flex gap-2">
              {(['ECONOMY', 'BUSINESS', 'FIRST'] as CabinClass[]).map((cls) => {
                const fare = flight.fares[cls as keyof typeof flight.fares];
                if (!fare) return null;
                return (
                  <button
                    key={cls}
                    onClick={() => setCabinClass(cls)}
                    className={cn(
                      'flex-1 p-4 rounded-xl border transition-all',
                      cabinClass === cls
                        ? 'glass-strong border-sky-primary-500/50 glow-border'
                        : 'glass-card border-surface-border hover:border-surface-muted'
                    )}
                  >
                    <CabinBadge cabin={cls} />
                    <p className="text-lg font-bold text-white mt-2">${fare}</p>
                    <p className="text-xs text-surface-muted">per person</p>
                  </button>
                );
              })}
            </div>

            {/* Assigned Crew */}
            {flight.assigned_crew && flight.assigned_crew.length > 0 && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-sky-primary-400" />
                  <h2 className="text-lg font-semibold text-white">Your Crew</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {flight.assigned_crew.map((crew: any, idx: number) => (
                    <div key={idx} className="bg-surface-overlay/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-base border border-white/10 flex items-center justify-center overflow-hidden">
                        <span className="text-white text-sm font-bold">{crew.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{crew.name}</p>
                        <p className="text-xs text-sky-primary-400 leading-tight">{crew.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seat Map */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Select Your Seat</h2>
              {loadingSeats ? (
                <Skeleton className="w-full h-96" />
              ) : seatData?.cabin_map ? (
                <SeatMap
                  cabinMap={seatData.cabin_map}
                  selectedSeats={selectedSeats}
                  onSeatSelect={toggleSeat}
                  maxSelectable={passengers.length}
                />
              ) : null}
            </div>
          </div>

          {/* Right panel - Booking Summary */}
          <div>
            <BookingSummary
              flight={flight}
              cabinClass={cabinClass}
              selectedSeats={selectedSeats}
              passengerCount={passengers.length}
            />
            <Button
              variant="primary"
              size="xl"
              className="w-full mt-4"
              disabled={selectedSeats.length === 0}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={handleContinue}
            >
              Continue to Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
