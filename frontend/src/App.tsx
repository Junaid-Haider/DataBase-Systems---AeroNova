import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FlightSearchPage from './pages/FlightSearchPage';
import FlightDetailPage from './pages/FlightDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './components/auth/AuthGuard';
import TicketPage from './pages/TicketPage';
import BaggageTrackerPage from './pages/BaggageTrackerPage';
import LoyaltyPage from './pages/LoyaltyPage';
import CargoPage from './pages/CargoPage';
import CargoTrackingPage from './pages/CargoTrackingPage';
import AdminGuard from './components/auth/AdminGuard';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminFlightsPage from './pages/admin/AdminFlightsPage';
import AdminCrewPage from './pages/admin/AdminCrewPage';
import AdminFleetPage from './pages/admin/AdminFleetPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import { HelpCenterPage, FaqPage, BaggagePolicyPage, AccessibilityPage, PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage } from './pages/InfoPages';
import { AppBackground } from './components/effects/AppBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col w-full relative z-10"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen relative">
          <AppBackground />
          <Navbar />
          <RouteWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />
            <Route path="/flights/search" element={<FlightSearchPage />} />
            <Route path="/flights/:id" element={<FlightDetailPage />} />
            <Route path="/booking/new" element={<BookingPage />} />
            <Route path="/booking/confirm" element={<BookingConfirmPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>} />
            <Route path="/tickets/:pnr" element={<TicketPage />} />
            <Route path="/baggage/track" element={<BaggageTrackerPage />} />
            <Route path="/loyalty" element={<AuthGuard><LoyaltyPage /></AuthGuard>} />
            <Route path="/cargo" element={<CargoPage />} />
            <Route path="/cargo/track" element={<CargoTrackingPage />} />
            
            {/* Info & Legal Routes */}
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/policies/baggage" element={<BaggagePolicyPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/legal/terms" element={<TermsOfServicePage />} />
            <Route path="/legal/cookies" element={<CookiePolicyPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
            <Route path="/admin/flights" element={<AdminGuard><AdminFlightsPage /></AdminGuard>} />
            <Route path="/admin/crew" element={<AdminGuard><AdminCrewPage /></AdminGuard>} />
            <Route path="/admin/fleet" element={<AdminGuard><AdminFleetPage /></AdminGuard>} />
            <Route path="/admin/settings" element={<AdminGuard><AdminSettingsPage /></AdminGuard>} />
          </Routes>
          </RouteWrapper>
          <div className="relative z-10 w-full">
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
