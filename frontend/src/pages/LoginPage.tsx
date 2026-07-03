import LoginForm from '../components/auth/LoginForm';
import Starfield from '../components/ui/Starfield';

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
      <Starfield count={80} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] rounded-full border border-sky-primary-500/20 animate-[spin_60s_linear_infinite]" />
      </div>
      
      <div className="relative z-10 w-full px-4 flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
