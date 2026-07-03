import { Plane, Shield, Clock, Star, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FlightSearchBar from '../components/search/FlightSearchBar';
import Starfield from '../components/ui/Starfield';
import Button from '../components/ui/Button';
import { GlobeHero } from '../components/effects/GlobeHero';
import { motion } from 'framer-motion';
import { usePlaneScroll } from '../lib/hooks/usePlaneScroll';

const popularRoutes = [
  { from: 'LHR', to: 'DXB', fromCity: 'London', toCity: 'Dubai', price: 420, image: '🏙️' },
  { from: 'JFK', to: 'LAX', fromCity: 'New York', toCity: 'Los Angeles', price: 280, image: '🌴' },
  { from: 'SIN', to: 'HND', fromCity: 'Singapore', toCity: 'Tokyo', price: 350, image: '🗼' },
  { from: 'CDG', to: 'IST', fromCity: 'Paris', toCity: 'Istanbul', price: 220, image: '🕌' },
  { from: 'DXB', to: 'SIN', fromCity: 'Dubai', toCity: 'Singapore', price: 380, image: '🌆' },
  { from: 'LHR', to: 'JFK', fromCity: 'London', toCity: 'New York', price: 450, image: '🗽' },
];

const features = [
  { icon: Clock, title: 'Lightning Fast Booking', desc: 'Book your flight in under 60 seconds with our streamlined process.' },
  { icon: Shield, title: 'Secure Payments', desc: '256-bit SSL encryption protects every transaction you make.' },
  { icon: Star, title: 'Premium Experience', desc: 'First-class service from booking to landing, every single time.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { heroRef } = usePlaneScroll();

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
        
        {/* Layer 1: Stars parallax — slower than scroll */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)' }}
          id="hero-stars-layer"
        />

        {/* Layer 2: Atmospheric glow that fades on scroll */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none z-[1]"
          style={{ background: 'linear-gradient(to top, rgba(251,146,60,0.08) 0%, transparent 100%)' }}
          id="hero-atmosphere-layer"
        />

        <div className="absolute inset-0 z-0">
          <video 
            src="/plane.mp4" 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/60 to-surface"></div>
        </div>

        {/* 3D Globe/arc background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[600px] h-[600px] rounded-full border border-sky-primary-500/10 opacity-30 animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-sky-primary-400/10 opacity-20 animate-[spin_45s_linear_infinite_reverse]" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-sky-primary-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-primary-500/10 border border-sky-primary-500/20 text-sky-primary-400 text-sm mb-6 backdrop-blur-md">
            <Globe className="w-4 h-4" />
            <span>Connecting 50+ destinations worldwide</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-xl"
          >
            Fly Anywhere,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-primary-400 to-cyan-300">
              Anytime
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-lg text-surface-muted mb-10 max-w-2xl mx-auto drop-shadow-md"
          >
            Experience premium air travel with AeroNova Airlines. Discover the world with unmatched comfort, safety, and reliability.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <FlightSearchBar />
          </motion.div>
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* Popular Routes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Popular Routes</h2>
            <p className="text-surface-muted mt-1">Most booked destinations this month</p>
          </div>
          <Button variant="ghost" rightIcon={<ChevronRight className="w-4 h-4" />}>View All</Button>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {popularRoutes.map((route) => (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              key={`${route.from}-${route.to}`} 
              onClick={() => navigate(`/flights/search?origin=${route.from}&destination=${route.to}`)}
              className="glass-card card-hover rounded-xl overflow-hidden group cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-sky-primary-900/50 to-surface-elevated flex items-center justify-center text-5xl transition-transform group-hover:scale-105">
                {route.image}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-sky-primary-400">{route.from}</span>
                  <Plane className="w-3 h-3 text-surface-muted" />
                  <span className="text-sm font-bold text-sky-primary-400">{route.to}</span>
                </div>
                <p className="text-sm text-surface-muted">{route.fromCity} to {route.toCity}</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-surface-muted">From</span>
                  <span className="text-lg font-bold text-white">${route.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Why AeroNova Airlines?</h2>
        <p className="text-surface-muted text-center mb-12 max-w-xl mx-auto">We go above and beyond to ensure every journey is exceptional.</p>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              key={feature.title} 
              className="glass-card card-hover rounded-xl p-6 text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-primary-500/10 border border-sky-primary-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-primary-500/20 transition-colors">
                <feature.icon className="w-7 h-7 text-sky-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-surface-muted">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
}
