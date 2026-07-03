import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Globe, ArrowRight } from 'lucide-react';
import api from '../../lib/api/client';
import Button from '../ui/Button';

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: 'PREFER_NOT',
    nationality: '', phone: '', email: '', password: '', confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      // Registration successful — redirect to login page
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setError(Array.isArray(msg) ? msg[0].message : msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-surface-muted text-sm">
          {step === 1 ? 'Step 1: Account Details' : 'Step 2: Personal Info'}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 transition-all outline-none" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input type="password" required minLength={8} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 transition-all outline-none" placeholder="Min. 8 characters" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-muted mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 focus:ring-2 focus:ring-sky-primary-500/20 transition-all outline-none" placeholder="••••••••" />
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full mt-6" rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
                <input type="text" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="John" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
                <input type="text" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="Smith" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">Date of Birth</label>
              <input type="date" required value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">Gender</label>
              <select required value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none appearance-none">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT">Prefer not to say</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-muted mb-1.5">Nationality</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input type="text" required value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="e.g. British" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-muted mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-xl text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="+44 7700 900000" />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button type="submit" variant="primary" className="flex-1" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>Create Account</Button>
          </div>
        </form>
      )}

      {step === 1 && (
        <div className="mt-6 text-center text-sm">
          <span className="text-surface-muted">Already have an account? </span>
          <Link to="/login" className="text-sky-primary-400 font-medium hover:text-sky-primary-300 transition-colors">Sign in</Link>
        </div>
      )}
    </div>
  );
}
