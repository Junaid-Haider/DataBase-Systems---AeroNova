import { useState } from 'react';
import { CreditCard, Wallet, Award, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface CheckoutFormProps {
  amount: number;
  onSubmit: (details: any) => void;
  disabled?: boolean;
}

export default function CheckoutForm({ amount, onSubmit, disabled }: CheckoutFormProps) {
  const [method, setMethod] = useState<'CARD' | 'WALLET' | 'MILES'>('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    // Format the last 4 digits for the API
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    
    onSubmit({
      paymentMethod: method,
      cardType: cardNumber.startsWith('4') ? 'VISA' : 'MASTERCARD',
      last4Digits: last4 || '0000',
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Lock className="w-5 h-5 text-sky-primary-400" />
        Secure Checkout
      </h2>

      {/* Method Selector */}
      <div className="flex gap-2 mb-8 bg-surface-overlay/30 p-1 rounded-xl">
        {[
          { id: 'CARD', label: 'Credit Card', icon: CreditCard },
          { id: 'WALLET', label: 'Digital Wallet', icon: Wallet },
          { id: 'MILES', label: 'AeroNova Miles', icon: Award }
        ].map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id as any)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-all",
              method === m.id 
                ? "bg-sky-primary-500 text-white shadow-lg shadow-sky-primary-500/20" 
                : "text-surface-muted hover:text-white hover:bg-white/5"
            )}
          >
            <m.icon className="w-5 h-5" />
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {method === 'CARD' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">Cardholder Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} disabled={disabled} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white focus:border-sky-primary-500 focus:ring-1 focus:ring-sky-primary-500 outline-none transition-all" placeholder="JOHN DOE" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
                <input type="text" required maxLength={19} value={cardNumber} onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  val = val.replace(/(\d{4})/g, '$1 ').trim();
                  setCardNumber(val);
                }} disabled={disabled} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white font-mono focus:border-sky-primary-500 outline-none transition-all" placeholder="0000 0000 0000 0000" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-surface-muted mb-1.5">Expiry Date</label>
                <input type="text" required maxLength={5} value={expiry} onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length >= 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                  setExpiry(val);
                }} disabled={disabled} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white focus:border-sky-primary-500 outline-none text-center tracking-widest transition-all" placeholder="MM/YY" />
              </div>
              <div className="w-1/3">
                <label className="block text-xs font-medium text-surface-muted mb-1.5">CVC</label>
                <input type="text" required maxLength={4} value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, ''))} disabled={disabled} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white focus:border-sky-primary-500 outline-none text-center tracking-widest transition-all" placeholder="123" />
              </div>
            </div>
          </div>
        )}

        {method === 'WALLET' && (
          <div className="text-center py-8 animate-in fade-in duration-300">
            <Wallet className="w-12 h-12 text-surface-muted mx-auto mb-4 opacity-50" />
            <p className="text-white font-medium mb-2">Pay with Digital Wallet</p>
            <p className="text-sm text-surface-muted">You will be redirected to your wallet provider.</p>
          </div>
        )}

        {method === 'MILES' && (
          <div className="text-center py-8 animate-in fade-in duration-300">
            <Award className="w-12 h-12 text-sky-primary-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Redeem AeroNova Miles</p>
            <p className="text-sm text-surface-muted">Required: <span className="text-white font-bold">{Math.round((amount || 0) * 100).toLocaleString()}</span> miles</p>
            <div className="mt-4 inline-block bg-danger/10 text-danger text-xs px-3 py-1 rounded-full border border-danger/20">Insufficient miles balance</div>
          </div>
        )}

        <div className="pt-6 border-t border-white/5 mt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-surface-muted">Total to pay</span>
            <span className="text-2xl font-bold text-white">${(amount || 0).toLocaleString()}</span>
          </div>
          
          <Button type="submit" variant="primary" className="w-full py-4 text-lg btn-glow" disabled={disabled || method === 'MILES'}>
            Pay ${(amount || 0).toLocaleString()}
          </Button>

          <p className="text-xs text-surface-muted text-center mt-4 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Payments are securely processed and encrypted.
          </p>
        </div>
      </form>
    </div>
  );
}
