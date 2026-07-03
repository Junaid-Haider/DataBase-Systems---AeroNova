import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useBookingStore } from '../lib/stores/bookingStore';
import { getFlightDetail, createBooking } from '../lib/api/flights';
import BookingSummary from '../components/booking/BookingSummary';
import Button from '../components/ui/Button';
import { User, ArrowRight, Plus, Trash2 } from 'lucide-react';
// import { cn } from '../lib/utils';
import type { PassengerInput } from '../types/flight';

export default function BookingPage() {
  const navigate = useNavigate();
  const { flightId, cabinClass, selectedSeats, passengers, setPassengers, contactEmail, contactPhone, setContact } = useBookingStore();
  const [email, setEmail] = useState(contactEmail);
  const [phone, setPhone] = useState(contactPhone);

  const { data: flight } = useQuery({
    queryKey: ['flight', flightId],
    queryFn: () => getFlightDetail(flightId!),
    enabled: !!flightId,
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      navigate('/booking/confirm', { state: { booking: data, flightDetails: flight } });
    },
  });

  const updatePassenger = (index: number, field: keyof PassengerInput, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const addPassenger = () => {
    if (passengers.length < 9) {
      setPassengers([...passengers, { first_name: '', last_name: '' }]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    if (!flightId) return;
    setContact(email, phone);
    mutation.mutate({
      flight_id: flightId,
      cabin_class: cabinClass,
      passengers,
      seats: selectedSeats,
      contact_email: email,
      contact_phone: phone,
    });
  };

  const isValid = passengers.every(p => p.first_name && p.last_name) && selectedSeats.length === passengers.length;

  if (!flightId) {
    navigate('/');
    return null;
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-primary-500 text-white text-sm font-bold flex items-center justify-center">1</div>
            <span className="text-sm font-medium text-white">Passengers</span>
          </div>
          <div className="h-px flex-1 bg-surface-border" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-8 rounded-full bg-surface-overlay text-surface-muted text-sm font-bold flex items-center justify-center">2</div>
            <span className="text-sm text-surface-muted">Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white">Passenger Details</h2>

            {passengers.map((p, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Passenger {i + 1} (Adult)</h3>
                  </div>
                  {passengers.length > 1 && (
                    <button onClick={() => removePassenger(i)} className="text-danger hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-surface-muted mb-1">First Name *</label>
                    <input
                      type="text" value={p.first_name} onChange={(e) => updatePassenger(i, 'first_name', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-muted mb-1">Last Name *</label>
                    <input
                      type="text" value={p.last_name} onChange={(e) => updatePassenger(i, 'last_name', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 outline-none transition-all"
                      placeholder="Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-muted mb-1">Passport No.</label>
                    <input
                      type="text" value={p.passport_no || ''} onChange={(e) => updatePassenger(i, 'passport_no', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 outline-none transition-all"
                      placeholder="AB1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-muted mb-1">Nationality</label>
                    <input
                      type="text" value={p.nationality || ''} onChange={(e) => updatePassenger(i, 'nationality', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 outline-none transition-all"
                      placeholder="British"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addPassenger} className="flex items-center gap-2 text-sm text-sky-primary-400 hover:text-sky-primary-300 transition-colors">
              <Plus className="w-4 h-4" /> Add Another Passenger
            </button>

            {/* Contact info */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-surface-muted mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none transition-all"
                    placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs text-surface-muted mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none transition-all"
                    placeholder="+44 7700 900000" />
                </div>
              </div>
            </div>

            {mutation.error && (
              <div className="glass-card rounded-xl p-4 border border-danger/30 bg-danger/5">
                <p className="text-sm text-danger">{(mutation.error as Error).message || 'Booking failed. Please try again.'}</p>
              </div>
            )}

            <Button variant="primary" size="xl" className="w-full btn-glow" disabled={!isValid} loading={mutation.isPending}
              rightIcon={<ArrowRight className="w-5 h-5" />} onClick={handleSubmit}>
              Confirm Booking
            </Button>
          </div>

          {/* Right - Summary */}
          <div>
            {flight && (
              <BookingSummary flight={flight} cabinClass={cabinClass} selectedSeats={selectedSeats} passengerCount={passengers.length} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
