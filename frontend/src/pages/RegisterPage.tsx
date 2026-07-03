import RegisterForm from '../components/auth/RegisterForm';
import Starfield from '../components/ui/Starfield';

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
      <Starfield count={80} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[800px] h-[800px] rounded-full border border-sky-primary-500/20 animate-[spin_40s_linear_infinite]" />
      </div>
      
      <div className="relative z-10 w-full px-4 flex justify-center py-12">
        <RegisterForm />
      </div>
    </div>
  );
}
