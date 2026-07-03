import { useState } from 'react';
import api from '../lib/api/client';
import CargoBookingForm from '../components/cargo/CargoBookingForm';
import { Plane, Search, CheckCircle, Package } from 'lucide-react';
import Button from '../components/ui/Button';

export default function CargoPage() {
  const [flightId, setFlightId] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleBookCargo = async (formData: any) => {
    setIsBooking(true);
    setError('');
    try {
      const res = await api.post('/cargo/book', formData);
      setBookingResult(res.data.cargo);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to book cargo shipment.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AeroNova <span className="text-sky-primary-400">Cargo</span></h1>
        <p className="text-lg text-surface-muted max-w-2xl mx-auto">
          Fast, reliable, and secure commercial shipping. From standard packages to perishables and hazardous materials.
        </p>
      </div>

      {bookingResult ? (
        <div className="glass-card rounded-2xl p-8 text-center border border-success/30 bg-success/5 animate-fade-in">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Shipment Booked!</h2>
          <p className="text-surface-muted mb-6">Your cargo has been successfully scheduled.</p>
          
          <div className="bg-surface-base border border-white/10 rounded-xl p-6 max-w-md mx-auto mb-8">
            <p className="text-sm text-surface-muted mb-1">Air Waybill (Tracking Number)</p>
            <p className="text-3xl font-bold text-sky-primary-400 font-mono tracking-wider">{bookingResult.TrackingNo}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => setBookingResult(null)} variant="secondary">Book Another</Button>
            <Button onClick={() => window.location.href = `/cargo/track?awb=${bookingResult.TrackingNo}`} variant="primary">
              Track Shipment
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-primary-400" />
              1. Select Flight
            </h2>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Enter Flight ID (e.g. 1)"
                value={flightId}
                onChange={(e) => setFlightId(e.target.value)}
                className="flex-1 px-4 py-2 bg-surface-base border border-white/10 rounded-xl text-white focus:border-sky-primary-500 outline-none"
              />
            </div>
            <p className="text-xs text-surface-muted mt-2">In a production environment, this would be a full flight search interface.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
              {error}
            </div>
          )}

          {flightId && parseInt(flightId) > 0 && (
            <div className="animate-fade-in border-t border-white/10 pt-8 mt-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-primary-400" />
                2. Shipment Details
              </h2>
              <CargoBookingForm 
                flightId={parseInt(flightId)} 
                onSubmit={handleBookCargo} 
                isLoading={isBooking} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
