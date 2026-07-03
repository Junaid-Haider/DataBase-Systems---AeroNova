import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAnimatedCounter } from '../../lib/hooks/useAnimatedCounter';
import { useCardTilt } from '../../lib/hooks/useCardTilt';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ElementType;
}

export default function KPICard({ title, value, trend, icon: Icon }: KPICardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, '')) || 0;
  const isNumeric = !isNaN(numericValue) && typeof value === 'number';
  const animatedValue = useAnimatedCounter(numericValue);
  const displayValue = isNumeric ? animatedValue : value;
  
  const { cardRef, handleMouseMove, handleMouseLeave } = useCardTilt(5);

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-36 relative overflow-hidden group glass-blue card-lift"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-primary-500/10 rounded-full blur-2xl group-hover:bg-sky-primary-500/20 transition-colors"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <p className="text-sm font-medium text-surface-muted">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-surface-overlay/50 flex items-center justify-center border border-white/10">
          <Icon className="w-5 h-5 text-sky-primary-400" />
        </div>
      </div>
      
      <div className="relative z-10 flex items-end justify-between">
        <h3 className="text-3xl font-bold text-white tracking-tight">{displayValue}</h3>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend >= 0 ? "text-success" : "text-danger"
          )}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
