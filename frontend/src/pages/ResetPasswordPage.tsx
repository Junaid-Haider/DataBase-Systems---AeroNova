import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api/client';
import Button from '../components/ui/Button';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
    }
  };

  if (!token && status !== 'error') {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-surface-muted mb-6">This password reset link is missing or malformed.</p>
          <Button variant="primary" onClick={() => navigate('/forgot-password')} className="w-full">
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-surface-muted mb-8">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Button variant="primary" onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
              <p className="text-surface-muted">Enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-surface-muted" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 outline-none transition-all"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-surface-muted" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-surface-overlay/50 border border-surface-border rounded-xl text-white focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 outline-none transition-all"
                    placeholder="Confirm new password"
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
                className="w-full mt-6"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Resetting...
                  </span>
                ) : 'Reset Password'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
