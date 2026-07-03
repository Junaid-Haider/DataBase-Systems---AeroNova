import { CheckCircle, Copy, Download, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookingResponse } from '../../types/flight';
import { formatCurrency } from '../../lib/utils';
import Button from '../ui/Button';

interface Props {
  booking: BookingResponse;
}

export default function PNRConfirmation({ booking }: Props) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyPNR = () => {
    navigator.clipboard.writeText(booking.pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center border-2 border-success/30 animate-[pulse_2s_ease-in-out_1]">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">Booking Confirmed!</h2>
      <p className="text-surface-muted text-center mb-8">Your booking has been created successfully.</p>

      {/* PNR Card */}
      <div className="glass-strong glow-border rounded-2xl p-6 mb-6">
        <p className="text-xs text-surface-muted mb-1">Booking Reference (PNR)</p>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold tracking-wider text-sky-primary-400">{booking.pnr}</span>
          <button onClick={copyPNR} className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Copy PNR">
            {copied ? <CheckCircle className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5 text-surface-muted" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-surface-muted">Flight</p>
            <p className="text-white font-medium">{booking.flight.flight_no}</p>
          </div>
          <div>
            <p className="text-xs text-surface-muted">Date</p>
            <p className="text-white font-medium">{booking.flight.dep_date}</p>
          </div>
          <div>
            <p className="text-xs text-surface-muted">Class</p>
            <p className="text-white font-medium">{booking.cabin_class}</p>
          </div>
          <div>
            <p className="text-xs text-surface-muted">Total</p>
            <p className="text-sky-primary-400 font-bold">{formatCurrency(booking.total_amount)}</p>
          </div>
        </div>

        {/* Passengers */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-surface-muted mb-2">Passengers</p>
          {booking.passengers.map((p, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span className="text-white">{p.name}</span>
              <span className="text-sky-primary-400 font-medium">Seat {p.seat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" leftIcon={<Download className="w-4 h-4" />}>
          Download
        </Button>
        <Button variant="primary" className="flex-1" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('/')}>
          Book Another
        </Button>
      </div>
    </div>
  );
}
