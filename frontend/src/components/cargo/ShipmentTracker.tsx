import { cn } from '../../lib/utils';
import { Package, Truck, Plane, CheckCircle } from 'lucide-react';

interface ShipmentTrackerProps {
  status: string;
}

export default function ShipmentTracker({ status }: ShipmentTrackerProps) {
  const steps = [
    { id: 'BOOKED', label: 'Booked', icon: Package },
    { id: 'RECEIVED', label: 'Received at Facility', icon: Truck },
    { id: 'LOADED', label: 'Loaded on Aircraft', icon: Plane },
    { id: 'IN_TRANSIT', label: 'In Transit', icon: Plane },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="py-8 relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-overlay/50 -translate-y-1/2 z-0 rounded-full"></div>
      
      <div className="absolute top-1/2 left-0 h-1 bg-sky-primary-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
           style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}></div>
      
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-4 border-surface-base transition-colors duration-500",
                isCompleted ? "bg-sky-primary-500 text-white" : "bg-surface-overlay text-surface-muted",
                isCurrent && "ring-4 ring-sky-primary-500/20"
              )}>
                <step.icon className="w-5 h-5" />
              </div>
              <p className={cn(
                "mt-3 text-xs font-medium text-center w-24 hidden md:block",
                isCompleted ? "text-white" : "text-surface-muted"
              )}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
