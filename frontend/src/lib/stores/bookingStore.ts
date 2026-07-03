import { create } from 'zustand';
import type { CabinClass, PassengerInput } from '../../types/flight';

interface BookingState {
  flightId: number | null;
  cabinClass: CabinClass;
  selectedSeats: string[];
  passengers: PassengerInput[];
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  setFlight: (id: number) => void;
  setCabinClass: (cls: CabinClass) => void;
  toggleSeat: (seat: string) => void;
  setPassengers: (p: PassengerInput[]) => void;
  setContact: (email: string, phone: string) => void;
  setTotalAmount: (amount: number) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  flightId: null,
  cabinClass: 'ECONOMY',
  selectedSeats: [],
  passengers: [{ first_name: '', last_name: '' }],
  contactEmail: '',
  contactPhone: '',
  totalAmount: 0,

  setFlight: (id) => set({ flightId: id }),
  setCabinClass: (cls) => set({ cabinClass: cls, selectedSeats: [] }),

  toggleSeat: (seat) => {
    const { selectedSeats, passengers } = get();
    if (selectedSeats.includes(seat)) {
      set({ selectedSeats: selectedSeats.filter((s) => s !== seat) });
    } else if (selectedSeats.length < passengers.length) {
      set({ selectedSeats: [...selectedSeats, seat] });
    }
  },

  setPassengers: (p) => set({ passengers: p }),
  setContact: (email, phone) => set({ contactEmail: email, contactPhone: phone }),
  setTotalAmount: (amount) => set({ totalAmount: amount }),
  reset: () => set({
    flightId: null, cabinClass: 'ECONOMY', selectedSeats: [],
    passengers: [{ first_name: '', last_name: '' }],
    contactEmail: '', contactPhone: '', totalAmount: 0,
  }),
}));
