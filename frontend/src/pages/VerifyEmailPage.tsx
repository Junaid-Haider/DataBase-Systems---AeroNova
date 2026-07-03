import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/api/client';
import Button from '../components/ui/Button';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing.');
      return;
    }

    const verifyToken = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.error || 'Failed to verify email. The link may have expired or is invalid.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-12 h-12 text-sky-primary-400 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying your email</h2>
            <p className="text-surface-muted">Please wait while we confirm your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-surface-muted mb-8">
              Your email has been successfully verified. Your account is now fully active.
            </p>
            <Button variant="primary" onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-surface-muted mb-8">{errorMessage}</p>
            <div className="flex flex-col gap-3 w-full">
              <Button variant="primary" onClick={() => navigate('/login')} className="w-full">
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
