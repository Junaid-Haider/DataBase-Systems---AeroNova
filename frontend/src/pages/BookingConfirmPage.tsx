import { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/payment/CheckoutForm';
import PaymentOverlay from '../components/payment/PaymentOverlay';
import api from '../lib/api/client';
import { Plane } from 'lucide-react';
import { formatTime } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

export default function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const flightDetails = location.state?.flightDetails;

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');

  if (!booking || !flightDetails) {
    return <Navigate to="/" replace />;
  }

  const { passengers = [], pnr = '', total_amount = 0, cabin_class = '', booking_id = 0 } = booking;

  const handlePayment = async (paymentDetails: any) => {
    setPaymentStatus('processing');
    try {
      await api.post('/payments/process', {
        bookingId: booking_id,
        amount: total_amount,
        idempotencyKey: uuidv4(),
        ...paymentDetails
      });
      
      setPaymentStatus('success');
      setPaymentMessage('Ticket generated successfully.');
      
      // Redirect to ticket page after a short delay
      setTimeout(() => {
        navigate(`/tickets/${pnr}`);
      }, 2000);

    } catch (error: any) {
      setPaymentStatus('error');
      setPaymentMessage(error.response?.data?.error || 'Payment failed. Please try again.');
      
      // Reset overlay after showing error
      setTimeout(() => {
        setPaymentStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <PaymentOverlay status={paymentStatus} message={paymentMessage} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Complete Your Booking</h1>
        <p className="text-surface-muted">Please review your flight details and process your payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Flight Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Flight Summary</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-white">{flightDetails?.dep_airport?.iata_code}</p>
                <p className="text-xs text-surface-muted">{formatTime(flightDetails?.schedule?.dep_time || '')}</p>
              </div>
              <Plane className="w-5 h-5 text-sky-primary-500 mx-2" />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-white">{flightDetails?.arr_airport?.iata_code}</p>
                <p className="text-xs text-surface-muted">{formatTime(flightDetails?.schedule?.arr_time || '')}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-muted">Date</span>
                <span className="text-white font-medium">{flightDetails.dep_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-muted">Passengers</span>
                <span className="text-white font-medium">{passengers?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-muted">Cabin Class</span>
                <span className="text-white font-medium">{cabin_class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-muted">PNR</span>
                <span className="text-sky-primary-400 font-bold">{pnr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Payment */}
        <div className="lg:col-span-2">
          <CheckoutForm 
            amount={total_amount} 
            onSubmit={handlePayment} 
            disabled={paymentStatus !== 'idle'}
          />
        </div>
      </div>
    </div>
  );
}
