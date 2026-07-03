import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api/client';
import Button from '../components/ui/Button';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-surface-muted mb-8">
              We've sent a password reset link to <span className="text-white">{email}</span>. The link will expire in 1 hour.
            </p>
            <Button variant="primary" onClick={() => navigate('/login')} className="w-full">
              Return to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-surface-muted">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-surface-muted" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                  {errorMessage}
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending link...
                  </span>
                ) : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-sm text-sky-primary-400 hover:text-sky-primary-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
