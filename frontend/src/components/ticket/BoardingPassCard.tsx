import { QRCodeSVG } from 'qrcode.react';
import { Plane, Calendar, Clock, MapPin } from 'lucide-react';
import { formatTime } from '../../lib/utils';

interface BoardingPassCardProps {
  ticket: any;
  booking: any;
}

export default function BoardingPassCard({ ticket, booking }: BoardingPassCardProps) {
  const { flight, passengerName, pnr } = booking;
  const { depAirport, arrAirport, schedules } = flight;
  const depTime = schedules[0]?.DepTime_Time;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
      {/* Decorative notch */}
      <div className="hidden md:block absolute top-0 bottom-0 left-[70%] w-px border-l-2 border-dashed border-gray-300 z-10"></div>
      <div className="hidden md:block absolute -top-4 left-[70%] -translate-x-1/2 w-8 h-8 rounded-full bg-surface-base z-20"></div>
      <div className="hidden md:block absolute -bottom-4 left-[70%] -translate-x-1/2 w-8 h-8 rounded-full bg-surface-base z-20"></div>

      {/* Main Pass Section */}
      <div className="w-full md:w-[70%] p-8 bg-white relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-primary-600 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              AeroNova<span className="text-sky-primary-600">Air</span>
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Boarding Pass</p>
            <p className="text-sm font-bold text-gray-900">{ticket.CabinClass}</p>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase font-medium mb-1">Passenger Name</p>
          <p className="text-xl font-bold text-gray-900 uppercase">{passengerName}</p>
        </div>

        {/* Flight Route */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <p className="text-4xl font-bold text-gray-900">{depAirport.IATACode}</p>
            <p className="text-sm text-gray-500 truncate">{depAirport.City}</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center px-4 relative">
            <div className="w-full h-px bg-gray-300 absolute top-1/2 -translate-y-1/2"></div>
            <Plane className="w-6 h-6 text-sky-primary-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1" />
          </div>

          <div className="flex-1 text-right">
            <p className="text-4xl font-bold text-gray-900">{arrAirport.IATACode}</p>
            <p className="text-sm text-gray-500 truncate">{arrAirport.City}</p>
          </div>
        </div>

        {/* Flight Details Grid */}
        <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Flight</p>
            <p className="font-bold text-gray-900">{flight.FlightNo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Date</p>
            <p className="font-bold text-gray-900">{new Date(flight.DepDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Gate</p>
            <p className="font-bold text-gray-900">{depAirport.Terminal}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Seat</p>
            <p className="font-bold text-gray-900">{ticket.SeatNo || 'Any'}</p>
          </div>
        </div>
      </div>

      {/* Stub Section */}
      <div className="w-full md:w-[30%] bg-sky-primary-50 p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-gray-300">
        <div className="bg-white p-3 rounded-xl shadow-sm mb-6">
          <QRCodeSVG value={ticket.TicketNo} size={120} level="H" />
        </div>
        
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-sky-primary-200">
            <span className="text-xs text-sky-primary-700 uppercase font-medium">Boarding Time</span>
            <span className="font-bold text-sky-primary-900">{formatTime(depTime)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-sky-primary-200">
            <span className="text-xs text-sky-primary-700 uppercase font-medium">Ticket No</span>
            <span className="font-bold text-sky-primary-900">{ticket.TicketNo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-sky-primary-700 uppercase font-medium">PNR</span>
            <span className="font-bold text-sky-primary-900">{pnr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
