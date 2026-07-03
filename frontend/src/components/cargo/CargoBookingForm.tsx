import { useState } from 'react';
import Button from '../ui/Button';
import { Package, Thermometer, AlertTriangle, User } from 'lucide-react';

interface CargoBookingFormProps {
  flightId: number;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function CargoBookingForm({ flightId, onSubmit, isLoading }: CargoBookingFormProps) {
  const [formData, setFormData] = useState({
    CargoType: 'STANDARD',
    WeightKg: '',
    VolumeM3: '',
    TempReq_C: '',
    HazClass: '',
    SenderName: '',
    ReceiverName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      FlightID: flightId,
      ...formData,
      WeightKg: parseFloat(formData.WeightKg),
      VolumeM3: parseFloat(formData.VolumeM3),
      TempReq_C: formData.TempReq_C ? parseFloat(formData.TempReq_C) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-muted mb-1">Cargo Type</label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <select
              name="CargoType"
              value={formData.CargoType}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 bg-surface-base border border-white/10 rounded-xl text-white focus:border-sky-primary-500 outline-none appearance-none"
              required
            >
              <option value="STANDARD">Standard Cargo</option>
              <option value="PERISHABLE">Perishable Goods</option>
              <option value="HAZMAT">Hazardous Materials</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-surface-muted mb-1">Weight (kg)</label>
            <input
              type="number"
              name="WeightKg"
              step="0.01"
              value={formData.WeightKg}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-surface-base border border-white/10 rounded-xl text-white focus:border-sky-primary-500 outline-none"
              required
              min="0.1"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-surface-muted mb-1">Volume (m³)</label>
            <input
              type="number"
              name="VolumeM3"
              step="0.01"
              value={formData.VolumeM3}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-surface-base border border-white/10 rounded-xl text-white focus:border-sky-primary-500 outline-none"
              required
              min="0.1"
            />
          </div>
        </div>
      </div>

      {formData.CargoType === 'PERISHABLE' && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-surface-muted mb-1">Temperature Requirement (°C)</label>
          <div className="relative">
            <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-primary-400" />
            <input
              type="number"
              name="TempReq_C"
              step="0.1"
              value={formData.TempReq_C}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 bg-sky-primary-500/10 border border-sky-primary-500/30 rounded-xl text-white focus:border-sky-primary-500 outline-none"
              required
            />
          </div>
        </div>
      )}

      {formData.CargoType === 'HAZMAT' && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-surface-muted mb-1">Hazardous Class (UN Code)</label>
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-danger" />
            <input
              type="text"
              name="HazClass"
              placeholder="e.g. UN 1090"
              value={formData.HazClass}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 bg-danger/10 border border-danger/30 rounded-xl text-white focus:border-danger outline-none"
              required
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-muted mb-1">Sender Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input
              type="text"
              name="SenderName"
              value={formData.SenderName}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 bg-surface-base border border-white/10 rounded-xl text-white focus:border-sky-primary-500 outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-muted mb-1">Receiver Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input
              type="text"
              name="ReceiverName"
              value={formData.ReceiverName}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2 bg-surface-base border border-white/10 rounded-xl text-white focus:border-sky-primary-500 outline-none"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Book Shipment & Generate AWB'}
        </Button>
      </div>
    </form>
  );
}
