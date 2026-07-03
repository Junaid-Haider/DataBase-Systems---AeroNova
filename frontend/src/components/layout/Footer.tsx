import { Plane, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  // Don't show footer on admin pages or login/register pages
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  return (
    <footer className="bg-surface-elevated border-t border-white/5 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg shadow-sky-primary-500/30">
              <img src="/logo.png" alt="AeroNova Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-white">Aero<span className="text-sky-primary-400">Nova</span></span>
          </div>
          <p className="text-sm text-surface-muted leading-relaxed">
            Experience premium air travel with AeroNova Airlines. We are dedicated to providing unmatched comfort, safety, and reliability for every journey.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/flights/search" className="text-sm text-surface-muted hover:text-white transition-colors">Book a Flight</Link></li>
            <li><Link to="/cargo" className="text-sm text-surface-muted hover:text-white transition-colors">Cargo Services</Link></li>
            <li><Link to="/loyalty" className="text-sm text-surface-muted hover:text-white transition-colors">Loyalty Program</Link></li>
            <li><Link to="/baggage/track" className="text-sm text-surface-muted hover:text-white transition-colors">Track Baggage</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-3">
            <li><Link to="/help" className="text-sm text-surface-muted hover:text-white transition-colors">Help Center</Link></li>
            <li><Link to="/faqs" className="text-sm text-surface-muted hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="/policies/baggage" className="text-sm text-surface-muted hover:text-white transition-colors">Baggage Policy</Link></li>
            <li><Link to="/accessibility" className="text-sm text-surface-muted hover:text-white transition-colors">Accessibility</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-sky-primary-400 shrink-0" />
              <span className="text-sm text-surface-muted">123 Aviation Way<br/>Skyline District<br/>New York, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-sky-primary-400 shrink-0" />
              <span className="text-sm text-surface-muted">+1 (800) 555-0199</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-sky-primary-400 shrink-0" />
              <span className="text-sm text-surface-muted">support@aeronova.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-surface-muted">
          © {new Date().getFullYear()} AeroNova Airlines. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <Link to="/legal/privacy" className="text-sm text-surface-muted hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/legal/terms" className="text-sm text-surface-muted hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/legal/cookies" className="text-sm text-surface-muted hover:text-white transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
