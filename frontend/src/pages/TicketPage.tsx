import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Printer } from 'lucide-react';
import api from '../lib/api/client';
import BoardingPassCard from '../components/ticket/BoardingPassCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

export default function TicketPage() {
  const { pnr } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await api.get(`/tickets/${pnr}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load ticket details.');
      } finally {
        setLoading(false);
      }
    }
    if (pnr) fetchTicket();
  }, [pnr]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 max-w-5xl mx-auto px-4">
        <Skeleton className="w-full h-96 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center max-w-md border border-danger/20">
          <span className="text-4xl mb-4 block">❌</span>
          <h2 className="text-xl font-bold text-white mb-2">Ticket Not Found</h2>
          <p className="text-surface-muted mb-6">{error}</p>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sky-primary-400 hover:text-sky-primary-300 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Your Boarding Pass</h1>
            <p className="text-surface-muted">You're all set! Present this pass at the gate.</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
              Print
            </Button>
            <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>
              Save PDF
            </Button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="print:m-0 print:shadow-none">
          <BoardingPassCard ticket={data.ticket} booking={data.booking} />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          <div className="glass-card rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-2">Baggage Allowance</h3>
            <p className="text-sm text-surface-muted">Your ticket includes {data.ticket.BaggageAllw}kg of checked baggage and 1 cabin bag. Excess baggage fees apply at the counter.</p>
          </div>
          <div className="glass-card rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-2">Lounge Access</h3>
            <p className="text-sm text-surface-muted">
              {data.ticket.LoungeAccess 
                ? "You have complimentary access to the AeroNova First Lounge. Present your boarding pass at entry."
                : "No lounge access is included with this ticket class."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
