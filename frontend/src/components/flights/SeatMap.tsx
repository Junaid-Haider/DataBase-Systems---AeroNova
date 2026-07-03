import type { SeatInfo } from '../../types/flight';
import { cn } from '../../lib/utils';

interface Props {
  cabinMap: Record<string, { seats: SeatInfo[]; config: { rows: number; seats_per_row: number; labels: string[]; start_row: number } }>;
  selectedSeats: string[];
  onSeatSelect: (seatNo: string) => void;
  maxSelectable: number;
}

const cabinLabels: Record<string, string> = { FIRST: 'First Class', BUSINESS: 'Business', ECONOMY: 'Economy' };
const cabinColors: Record<string, string> = { FIRST: 'border-first/30', BUSINESS: 'border-business/30', ECONOMY: 'border-surface-border' };

export default function SeatMap({ cabinMap, selectedSeats, onSeatSelect, maxSelectable }: Props) {
  const handleClick = (seat: SeatInfo) => {
    if (seat.status === 'occupied') return;
    if (selectedSeats.includes(seat.seat_no)) {
      onSeatSelect(seat.seat_no);
    } else if (selectedSeats.length < maxSelectable) {
      onSeatSelect(seat.seat_no);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Aircraft nose illustration */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-8 bg-gradient-to-b from-surface-overlay to-transparent rounded-t-full border border-b-0 border-surface-border" />
      </div>

      {Object.entries(cabinMap).map(([cabin, data]) => (
        <div key={cabin} className={cn('mb-6 pb-6 border-b', cabinColors[cabin] || 'border-surface-border', 'last:border-b-0 last:mb-0 last:pb-0')}>
          <div className="flex items-center gap-2 mb-4">
            <div className={cn('w-3 h-3 rounded-full', cabin === 'FIRST' ? 'bg-first' : cabin === 'BUSINESS' ? 'bg-business' : 'bg-economy')} />
            <h3 className="text-sm font-semibold text-white">{cabinLabels[cabin] || cabin}</h3>
            <span className="text-xs text-surface-muted">({data.seats.filter(s => s.status !== 'occupied').length} available)</span>
          </div>

          {/* Column labels */}
          <div className="flex justify-center gap-1 mb-2" style={{ maxWidth: `${data.config.seats_per_row * 36 + (data.config.seats_per_row > 6 ? 20 : 16)}px`, margin: '0 auto' }}>
            {data.config.labels.map((label, i) => (
              <div key={label} className="flex-shrink-0" style={{ width: '32px' }}>
                {/* Add aisle gap */}
                {i === Math.floor(data.config.seats_per_row / 2) && <div style={{ width: '12px', display: 'inline-block' }} />}
                <span className="text-xs text-surface-muted text-center block">{label}</span>
              </div>
            ))}
          </div>

          {/* Seat grid by rows */}
          {Array.from({ length: data.config.rows }, (_, rowIdx) => {
            const rowNum = data.config.start_row + rowIdx;
            const rowSeats = data.seats.filter(s => s.row === rowNum);
            if (rowSeats.length === 0) return null;

            return (
              <div key={rowNum} className="flex items-center justify-center gap-1 mb-1">
                <span className="text-xs text-surface-muted w-6 text-right mr-1">{rowNum}</span>
                {rowSeats.map((seat, i) => {
                  const isSelected = selectedSeats.includes(seat.seat_no);
                  const seatStatus = isSelected ? 'selected' : seat.status;

                  return (
                    <span key={seat.seat_no} className="inline-flex">
                      {/* Aisle gap */}
                      {i === Math.floor(rowSeats.length / 2) && i > 0 && <span className="w-3" />}
                      <button
                        onClick={() => handleClick(seat)}
                        disabled={seat.status === 'occupied'}
                        title={`${seat.seat_no} - ${seatStatus}`}
                        className={cn(
                          'seat-3d w-8 h-8 rounded-md text-xs font-medium transition-all flex items-center justify-center',
                          seatStatus === 'available' && 'bg-seat-available/20 text-seat-available hover:bg-seat-available/40 border border-seat-available/30',
                          seatStatus === 'occupied' && 'bg-seat-occupied/10 text-seat-occupied/40 cursor-not-allowed border border-seat-occupied/10',
                          seatStatus === 'selected' && 'bg-seat-selected text-white ring-2 ring-white/50 shadow-lg shadow-seat-selected/40 scale-105',
                          seatStatus === 'premium' && 'bg-seat-premium/20 text-seat-premium hover:bg-seat-premium/40 border border-seat-premium/30',
                        )}
                        style={{
                          background: isSelected
                            ? 'linear-gradient(145deg, #2563eb, #1d4ed8)'
                            : seat.status === 'occupied'
                            ? 'linear-gradient(145deg, #1f1f2e, #151520)'
                            : 'linear-gradient(145deg, #1e3050, #162038)',
                          boxShadow: isSelected
                            ? 'inset 2px 2px 4px rgba(0,0,0,.4), 0 0 12px rgba(59,130,246,.5)'
                            : '3px 3px 6px rgba(0,0,0,.4), -2px -2px 4px rgba(255,255,255,.04)',
                          borderRadius: '6px 6px 3px 3px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {seat.col}
                      </button>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/5">
        {[
          { color: 'bg-seat-available/30 border-seat-available/30', label: 'Available' },
          { color: 'bg-seat-occupied/20 border-seat-occupied/20', label: 'Occupied' },
          { color: 'bg-seat-selected border-white/50', label: 'Selected' },
          { color: 'bg-seat-premium/30 border-seat-premium/30', label: 'Premium' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn('w-5 h-5 rounded border', color)} />
            <span className="text-xs text-surface-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
