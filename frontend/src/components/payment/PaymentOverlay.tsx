import { CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaymentOverlayProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}

export default function PaymentOverlay({ status, message }: PaymentOverlayProps) {
  if (status === 'idle') return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 transition-all"
      style={{ backdropFilter: 'blur(8px) brightness(0.6)', WebkitBackdropFilter: 'blur(8px) brightness(0.6)' }}
    >
      <div className={cn(
        "bg-surface-elevated border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center transition-all duration-500 transform glass-elevated",
        status === 'success' ? 'scale-100 opacity-100' : 'scale-95 opacity-100'
      )}>
        
        {status === 'processing' && (
          <>
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-sky-primary-500 border-t-transparent animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-sky-primary-400 animate-spin opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
            <p className="text-surface-muted text-sm">Please don't close this window or click back. We are confirming your ticket.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-surface-muted text-sm">Your booking is confirmed and tickets have been issued.</p>
            {message && <p className="text-sky-primary-400 text-sm mt-4 font-medium">{message}</p>}
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-danger/20 flex items-center justify-center mb-6">
              <span className="text-4xl">❌</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
            <p className="text-surface-muted text-sm">{message || 'Something went wrong while processing your payment.'}</p>
          </>
        )}

      </div>
    </div>
  );
}
