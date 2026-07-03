import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants = {
  primary: 'bg-sky-primary-500 hover:bg-sky-primary-600 text-white hover:glow-blue active:bg-sky-primary-700 shadow-lg shadow-sky-primary-500/25',
  secondary: 'bg-surface-elevated hover:bg-surface-overlay text-white border border-surface-border',
  ghost: 'bg-transparent hover:bg-white/5 text-surface-muted hover:text-white',
  danger: 'bg-danger hover:bg-red-600 text-white',
  outline: 'bg-transparent border border-sky-primary-500 text-sky-primary-400 hover:bg-sky-primary-500/10',
};

const sizes = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-8 py-4 text-lg rounded-xl font-semibold',
};

export default function Button({
  variant = 'primary', size = 'md', loading, leftIcon, rightIcon,
  className, children, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
