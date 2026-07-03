import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../lib/stores/authStore';
import api from '../../lib/api/client';
import Button from '../ui/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const successMessage = location.state?.message || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // We need to fetch the user profile right after login to populate store
      const userRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      
      setAuth(data.access_token, userRes.data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-surface-muted text-sm">Sign in to manage your bookings and miles.</p>
      </div>

      {successMessage && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg p-3">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-surface-muted mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 transition-all outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-surface-muted mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded bg-surface-overlay border-surface-border text-sky-primary-500 focus:ring-sky-primary-500/20" />
            <span className="text-xs text-surface-muted">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-xs text-sky-primary-400 hover:text-sky-primary-300">Forgot password?</Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-surface-muted">Don't have an account? </span>
        <Link to="/register" className="text-sky-primary-400 font-medium hover:text-sky-primary-300 transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
}
