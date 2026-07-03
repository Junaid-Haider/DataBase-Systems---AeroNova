import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/stores/authStore';
import api from '../lib/api/client';
import { Plane, Calendar, User, CreditCard } from 'lucide-react';
import { formatTime, cn } from '../lib/utils';
import { StatusBadge } from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    passportNo: user?.passengerProfile?.PassportNo || '',
    phone: user?.phone || '',
    nationality: user?.nationality || '',
    mealPlanId: user?.passengerProfile?.MealPlanID || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [mealPlans, setMealPlans] = useState<any[]>([]);

  // Saved Cards State
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', name: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const [bookingsRes, mealPlansRes] = await Promise.all([
          api.get('/users/me/bookings'),
          api.get('/users/meal-plans')
        ]);
        setBookings(bookingsRes.data.bookings || []);
        setMealPlans(mealPlansRes.data.mealPlans || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]); // Re-run if user changes so we can set editFormData

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      await api.put('/users/me', {
        passportNo: editFormData.passportNo,
        phone: editFormData.phone,
        nationality: editFormData.nationality,
        mealPlanId: editFormData.mealPlanId || null
      });
      // Refresh user profile in store
      const userRes = await api.get('/users/me');
      useAuthStore.getState().setAuth(useAuthStore.getState().accessToken!, userRes.data);
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRefund = async (paymentId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking and request a refund?')) return;
    try {
      await api.post(`/payments/${paymentId}/refund`, { reason: 'Customer requested refund via dashboard' });
      alert('Refund processed successfully!');
      // Refresh bookings
      const res = await api.get('/users/me/bookings');
      setBookings(res.data.bookings || []);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to process refund');
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardForm.number.length >= 15) {
      setSavedCards([...savedCards, {
        id: Math.random().toString(),
        last4: cardForm.number.slice(-4),
        brand: cardForm.number.startsWith('4') ? 'Visa' : 'Mastercard',
        expiry: cardForm.expiry
      }]);
      setIsAddingCard(false);
      setCardForm({ number: '', expiry: '', name: '' });
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.firstName}</h1>
        <p className="text-surface-muted">Manage your bookings, profile, and loyalty points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="w-16 h-16 rounded-full bg-sky-primary-500/20 flex items-center justify-center mb-4 border border-sky-primary-500/30">
              <User className="w-8 h-8 text-sky-primary-400" />
            </div>
            <h2 className="text-lg font-bold text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-surface-muted mb-4">{user?.email}</p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-surface-muted mb-1">AeroNova Miles</p>
              <p className="text-2xl font-bold text-sky-primary-400">0</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors",
                activeTab === 'bookings'
                  ? "bg-sky-primary-500/10 text-sky-primary-400"
                  : "text-surface-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Plane className="w-4 h-4" /> My Bookings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors",
                activeTab === 'profile'
                  ? "bg-sky-primary-500/10 text-sky-primary-400"
                  : "text-surface-muted hover:text-white hover:bg-white/5"
              )}
            >
              <User className="w-4 h-4" /> Profile Details
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors",
                activeTab === 'payments'
                  ? "bg-sky-primary-500/10 text-sky-primary-400"
                  : "text-surface-muted hover:text-white hover:bg-white/5"
              )}
            >
              <CreditCard className="w-4 h-4" /> Payment Methods
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'bookings' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6">Upcoming Flights</h2>

              <div className="space-y-4">
                {loading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="w-full h-32 rounded-2xl" />)}

                {!loading && bookings.length === 0 && (
                  <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-white/20">
                    <Plane className="w-12 h-12 text-surface-muted mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-white mb-2">No upcoming flights</h3>
                    <p className="text-sm text-surface-muted mb-6">You don't have any booked flights yet.</p>
                    <a href="/flights/search" className="inline-flex items-center justify-center px-6 py-2 bg-sky-primary-500 hover:bg-sky-primary-600 text-white rounded-lg font-medium transition-colors">
                      Search Flights
                    </a>
                  </div>
                )}

                {!loading && bookings.map(booking => (
                  <div key={booking.BookingID} className="glass-card rounded-2xl p-6 group hover:border-sky-primary-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white">{booking.flight.FlightNo}</span>
                          <StatusBadge status={booking.Status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-white font-medium">{booking.flight.depAirport.City} <span className="text-surface-muted mx-1">→</span> {booking.flight.arrAirport.City}</div>
                        </div>
                      </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-8">
                            <div className="text-center">
                              <p className="text-xs text-surface-muted mb-1">Departure</p>
                              <p className="text-lg font-bold text-white">{formatTime(booking.flight.schedules[0]?.DepTime_Time)}</p>
                              <p className="text-xs text-sky-primary-400">{booking.flight.DepDate}</p>
                            </div>

                            <div className="h-10 w-px bg-white/10 hidden md:block"></div>

                            <div>
                              <p className="text-xs text-surface-muted mb-1">PNR</p>
                              <p className="text-lg font-bold tracking-wider text-white">{booking.PNR}</p>
                            </div>
                          </div>
                          
                          {booking.Status === 'CONFIRMED' && booking.payments?.[0] && (
                            <button
                              onClick={() => handleRefund(booking.payments[0].PaymentID)}
                              className="mt-2 px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/20"
                            >
                              Cancel & Refund
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6">Profile Details</h2>
              <div className="glass-card rounded-2xl p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4 border-b border-white/10 pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-surface-muted mb-1">Full Name</p>
                      <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-muted mb-1">Email Address</p>
                      <p className="text-white font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <h3 className="text-lg font-medium text-white">Travel Documents</h3>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors text-xs"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs font-medium text-surface-muted mb-1">Passport Number</label>
                        <input
                          type="text"
                          value={editFormData.passportNo}
                          onChange={(e) => setEditFormData({ ...editFormData, passportNo: e.target.value })}
                          className="w-full px-4 py-2 bg-surface-overlay/30 border border-surface-border rounded-lg text-white text-sm focus:border-sky-primary-500 outline-none"
                          placeholder="Enter passport number"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-surface-muted mb-1">Meal Preference</label>
                        <select
                          value={editFormData.mealPlanId}
                          onChange={(e) => setEditFormData({ ...editFormData, mealPlanId: e.target.value })}
                          className="w-full px-4 py-2 bg-surface-overlay/30 border border-surface-border rounded-lg text-white text-sm focus:border-sky-primary-500 outline-none"
                        >
                          <option value="">No Preference</option>
                          {mealPlans.map((plan) => (
                            <option key={plan.PlanID} value={plan.PlanID}>
                              {plan.PlanName.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={savingProfile}
                          className="px-4 py-2 bg-sky-primary-500 hover:bg-sky-primary-600 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                        >
                          {savingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-surface-muted mb-1">Passport Number</p>
                        <p className="text-white font-medium">{user?.passengerProfile?.PassportNo || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-surface-muted mb-1">Meal Preference</p>
                        <p className="text-white font-medium">
                          {user?.passengerProfile?.MealPlanID 
                            ? mealPlans.find(p => p.PlanID === user.passengerProfile.MealPlanID)?.PlanName.replace('_', ' ') || 'Standard'
                            : 'No Preference'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-surface-muted mb-1">Frequent Flyer ID</p>
                        <p className="text-white font-medium">Not enrolled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6">Payment Methods</h2>

              {isAddingCard ? (
                <div className="glass-card rounded-2xl p-8 max-w-md">
                  <h3 className="text-lg font-medium text-white mb-6">Add New Card</h3>
                  <form onSubmit={handleAddCard} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-muted mb-1">Cardholder Name</label>
                      <input required type="text" value={cardForm.name} onChange={e => setCardForm({ ...cardForm, name: e.target.value })} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-lg text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="Name on card" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-muted mb-1">Card Number</label>
                      <input required type="text" maxLength={16} value={cardForm.number} onChange={e => setCardForm({ ...cardForm, number: e.target.value })} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-lg text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-surface-muted mb-1">Expiry Date</label>
                        <input required type="text" maxLength={5} value={cardForm.expiry} onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-lg text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-surface-muted mb-1">CVC</label>
                        <input required type="password" maxLength={3} className="w-full px-4 py-3 bg-surface-overlay/30 border border-surface-border rounded-lg text-white text-sm focus:border-sky-primary-500 outline-none" placeholder="123" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setIsAddingCard(false)} className="flex-1 px-4 py-3 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-lg font-medium transition-colors text-sm">Cancel</button>
                      <button type="submit" className="flex-1 px-4 py-3 bg-sky-primary-500 hover:bg-sky-primary-600 text-white rounded-lg font-medium transition-colors text-sm">Save Card</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedCards.map(card => (
                    <div key={card.id} className="glass-card rounded-2xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-white">
                          {card.brand}
                        </div>
                        <div>
                          <p className="text-white font-medium">•••• •••• •••• {card.last4}</p>
                          <p className="text-xs text-surface-muted">Expires {card.expiry}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSavedCards(savedCards.filter(c => c.id !== card.id))}
                        className="text-xs text-danger hover:text-danger/80 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {savedCards.length === 0 && (
                    <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-white/20">
                      <CreditCard className="w-12 h-12 text-surface-muted mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-white mb-2">No saved payment methods</h3>
                      <p className="text-sm text-surface-muted mb-6">Add a card to make future bookings faster.</p>
                      <button
                        onClick={() => setIsAddingCard(true)}
                        className="inline-flex items-center justify-center px-6 py-2 bg-sky-primary-500 hover:bg-sky-primary-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Add New Card
                      </button>
                    </div>
                  )}

                  {savedCards.length > 0 && (
                    <button
                      onClick={() => setIsAddingCard(true)}
                      className="inline-flex items-center gap-2 text-sm text-sky-primary-400 hover:text-sky-primary-300 font-medium transition-colors"
                    >
                      + Add another card
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
