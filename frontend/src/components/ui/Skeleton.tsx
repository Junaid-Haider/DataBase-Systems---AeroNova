import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

export function FlightCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div><Skeleton className="w-16 h-3 mb-2" /><Skeleton className="w-20 h-3" /></div>
        </div>
        <div className="flex-1 mx-8 flex items-center gap-4">
          <Skeleton className="w-16 h-6" />
          <div className="flex-1"><Skeleton className="w-full h-px" /><Skeleton className="w-12 h-3 mt-1 mx-auto" /></div>
          <Skeleton className="w-16 h-6" />
        </div>
        <div className="text-right">
          <Skeleton className="w-20 h-7 mb-2" />
          <Skeleton className="w-16 h-8" />
        </div>
      </div>
    </div>
  );
}
