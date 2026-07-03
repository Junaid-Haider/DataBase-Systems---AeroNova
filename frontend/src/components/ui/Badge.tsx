import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'economy' | 'business' | 'first';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-surface-overlay text-surface-muted',
  success: 'bg-success/15 text-success border border-success/20',
  warning: 'bg-warning/15 text-warning border border-warning/20',
  danger: 'bg-danger/15 text-danger border border-danger/20',
  info: 'bg-info/15 text-info border border-info/20',
  economy: 'bg-economy/15 text-gray-300 border border-economy/20',
  business: 'bg-business/15 text-amber-400 border border-business/20',
  first: 'bg-first/15 text-purple-400 border border-first/20',
};

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variantStyles[variant], className
    )}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    CONFIRMED: 'success', COMPLETED: 'success', SCHEDULED: 'info',
    PENDING: 'warning', DELAYED: 'warning', BOARDING: 'info',
    CANCELLED: 'danger', DEPARTED: 'info', ARRIVED: 'success',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
}

export function CabinBadge({ cabin }: { cabin: string }) {
  const map: Record<string, 'economy' | 'business' | 'first'> = {
    ECONOMY: 'economy', BUSINESS: 'business', FIRST: 'first',
  };
  return <Badge variant={map[cabin] || 'default'}>{cabin}</Badge>;
}
