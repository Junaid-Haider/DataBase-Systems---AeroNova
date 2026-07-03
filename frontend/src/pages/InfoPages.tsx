import { useState } from 'react';
import { Shield, FileText, Lock, Settings, HelpCircle, Briefcase, Accessibility, ChevronDown, Phone, Mail, MessageCircle, Clock, CheckCircle, AlertTriangle, ArrowRight, Globe, Plane, Users, Eye, Database, BellRing } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/* ── Shared Layout ── */
function PageHero({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) {
  return (
    <div className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-primary-500/5 via-transparent to-transparent" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-sky-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute top-40 left-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-primary-500/10 border border-sky-primary-500/20 flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-sky-primary-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-lg text-surface-muted max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children, accent = 'sky-primary' }: { icon: any; title: string; children: ReactNode; accent?: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:border-sky-primary-500/20 border border-transparent transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-primary-500/10 border border-sky-primary-500/20 flex items-center justify-center shrink-0 group-hover:bg-sky-primary-500/20 transition-colors">
          <Icon className="w-5 h-5 text-sky-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <div className="text-sm text-surface-muted leading-relaxed space-y-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-transparent hover:border-sky-primary-500/10 transition-all">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium text-white pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-sky-primary-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5 px-5' : 'max-h-0'}`}>
        <p className="text-sm text-surface-muted leading-relaxed border-t border-white/5 pt-4">{answer}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HELP CENTER
   ═══════════════════════════════════════════════════ */
export function HelpCenterPage() {
  const channels = [
    { icon: Phone, title: '24/7 Phone Support', desc: 'Speak directly with our support team anytime, anywhere.', detail: '+1 (800) 555-0199', action: 'Call Now' },
    { icon: Mail, title: 'Email Support', desc: 'Get a detailed response within 2 business hours.', detail: 'support@aeronova.com', action: 'Send Email' },
    { icon: MessageCircle, title: 'Live Chat', desc: 'Instant answers from our AI-powered chat assistant.', detail: 'Available on all pages', action: 'Start Chat' },
  ];
  const topics = [
    { icon: Plane, title: 'Flight Changes', desc: 'Modify departure dates, upgrade cabin class, or cancel your booking.' },
    { icon: Briefcase, title: 'Baggage Issues', desc: 'Report lost, delayed, or damaged baggage and track claims.' },
    { icon: Shield, title: 'Refunds', desc: 'Request refunds for eligible bookings and track processing status.' },
    { icon: Users, title: 'Special Assistance', desc: 'Request wheelchair service, medical support, or unaccompanied minor assistance.' },
    { icon: Lock, title: 'Account & Security', desc: 'Reset passwords, update personal info, or manage two-factor authentication.' },
    { icon: Globe, title: 'Travel Documents', desc: 'Visa requirements, passport validity, and health declaration forms.' },
  ];

  return (
    <div>
      <PageHero title="Help Center" subtitle="We're here to make your travel experience seamless. Find answers or reach out to our team." icon={HelpCircle} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        {/* Contact Channels */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channels.map(c => (
              <div key={c.title} className="glass-card rounded-2xl p-6 text-center group hover:border-sky-primary-500/20 border border-transparent transition-all">
                <div className="w-14 h-14 rounded-2xl bg-sky-primary-500/10 border border-sky-primary-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <c.icon className="w-7 h-7 text-sky-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{c.title}</h3>
                <p className="text-sm text-surface-muted mb-3">{c.desc}</p>
                <p className="text-sky-primary-400 font-medium text-sm">{c.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse Topics */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map(t => (
              <div key={t.title} className="glass-card rounded-xl p-5 flex items-start gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-sky-primary-500/10 flex items-center justify-center shrink-0">
                  <t.icon className="w-5 h-5 text-sky-primary-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1 group-hover:text-sky-primary-400 transition-colors">{t.title}</h4>
                  <p className="text-xs text-surface-muted">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Link to FAQs */}
        <div className="glass-card rounded-2xl p-8 text-center border border-sky-primary-500/10 bg-gradient-to-r from-sky-primary-500/5 to-indigo-500/5">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-surface-muted mb-6">Check our frequently asked questions for quick answers.</p>
          <Link to="/faqs" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-primary-500 hover:bg-sky-primary-600 text-white font-medium rounded-xl transition-colors">
            View FAQs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FAQs
   ═══════════════════════════════════════════════════ */
export function FaqPage() {
  const sections = [
    { title: 'Booking & Reservations', items: [
      { q: 'How do I book a flight?', a: 'Search for flights on our homepage by entering your origin, destination, and travel dates. Select your preferred flight, choose a cabin class, fill in passenger details, and proceed to secure payment.' },
      { q: 'Can I hold a reservation without paying?', a: 'We offer a 24-hour free cancellation window on all bookings. You can book now and cancel within 24 hours for a full refund if your plans change.' },
      { q: 'How do I add special meal requests?', a: 'After completing your booking, visit "My Trips" in your dashboard. Select your booking and click "Special Services" to add meal preferences up to 48 hours before departure.' },
    ]},
    { title: 'Check-in & Boarding', items: [
      { q: 'When does online check-in open?', a: 'Online check-in opens 24 hours before your scheduled departure and closes 1 hour before departure for domestic flights and 2 hours for international flights.' },
      { q: 'Can I select my seat during check-in?', a: 'Yes! During online check-in, you will be presented with our interactive seat map. Standard seats are free, while premium seats (extra legroom, window, exit row) may incur an additional fee.' },
      { q: 'What documents do I need at the gate?', a: 'You will need a valid government-issued photo ID (for domestic flights) or a passport (for international flights), along with your boarding pass (digital or printed).' },
    ]},
    { title: 'Payments & Refunds', items: [
      { q: 'What payment methods are accepted?', a: 'We accept Visa, Mastercard, American Express, digital wallets, and AeroNova Miles. All transactions are secured with 256-bit SSL encryption.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 5-10 business days depending on your payment provider. You will receive an email notification once the refund is initiated.' },
      { q: 'Can I pay with AeroNova Miles?', a: 'Yes, Silver tier members and above can redeem miles for flights. The conversion rate is displayed at checkout when you select "Pay with Miles".' },
    ]},
    { title: 'Baggage', items: [
      { q: 'What is the carry-on baggage allowance?', a: 'All passengers may bring one carry-on bag (max 22×14×9 inches, 15 lbs) and one personal item (purse, laptop bag, etc.) free of charge.' },
      { q: 'How do I report lost baggage?', a: 'Visit our Baggage Tracker page or report it at the airline counter immediately after landing. You will receive a tracking reference number to monitor your claim.' },
    ]},
  ];

  return (
    <div>
      <PageHero title="Frequently Asked Questions" subtitle="Quick answers to common questions about flying with AeroNova." icon={HelpCircle} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        {sections.map(section => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-sky-primary-500 rounded-full" />
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <AccordionItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BAGGAGE POLICY
   ═══════════════════════════════════════════════════ */
export function BaggagePolicyPage() {
  const allowances = [
    { cls: 'Economy', carry: '1 × 15 lbs', checked: '1 × 50 lbs (23 kg)', extra: '$35 per bag' },
    { cls: 'Business', carry: '2 × 18 lbs', checked: '2 × 70 lbs (32 kg)', extra: '$25 per bag' },
    { cls: 'First', carry: '2 × 18 lbs', checked: '3 × 70 lbs (32 kg)', extra: 'Complimentary' },
  ];

  return (
    <div>
      <PageHero title="Baggage Policy" subtitle="Everything you need to know about traveling with your belongings." icon={Briefcase} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        {/* Allowance Table */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Baggage Allowance by Class</h2>
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-white/70">
                  <tr>
                    <th className="px-6 py-4">Cabin Class</th>
                    <th className="px-6 py-4">Carry-On</th>
                    <th className="px-6 py-4">Checked Baggage</th>
                    <th className="px-6 py-4">Extra Bags</th>
                  </tr>
                </thead>
                <tbody>
                  {allowances.map(a => (
                    <tr key={a.cls} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-sky-primary-400">{a.cls}</td>
                      <td className="px-6 py-4 text-surface-muted">{a.carry}</td>
                      <td className="px-6 py-4 text-surface-muted">{a.checked}</td>
                      <td className="px-6 py-4 text-surface-muted">{a.extra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Size & Restrictions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={CheckCircle} title="Carry-On Dimensions">
            <p>Maximum: <span className="text-white font-medium">22 × 14 × 9 inches</span> (56 × 36 × 23 cm). Must fit in the overhead bin or under the seat in front of you.</p>
          </InfoCard>
          <InfoCard icon={CheckCircle} title="Checked Bag Dimensions">
            <p>Maximum: <span className="text-white font-medium">62 linear inches</span> (158 cm total of L+W+H). Bags exceeding this are subject to oversized fees.</p>
          </InfoCard>
          <InfoCard icon={AlertTriangle} title="Prohibited Items">
            <p>Flammable liquids, explosives, compressed gases, sharp objects, and lithium batteries over 160Wh are strictly prohibited in all baggage.</p>
          </InfoCard>
          <InfoCard icon={Shield} title="Valuable Items">
            <p>We recommend keeping electronics, medication, jewelry, and travel documents in your carry-on. AeroNova is not liable for valuables in checked baggage.</p>
          </InfoCard>
        </section>

        <div className="glass-card rounded-2xl p-8 text-center border border-sky-primary-500/10 bg-gradient-to-r from-sky-primary-500/5 to-indigo-500/5">
          <h3 className="text-xl font-bold text-white mb-2">Lost or delayed baggage?</h3>
          <p className="text-surface-muted mb-6">Track your bag's status in real time or file a claim.</p>
          <Link to="/baggage/track" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-primary-500 hover:bg-sky-primary-600 text-white font-medium rounded-xl transition-colors">
            Track Baggage <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACCESSIBILITY
   ═══════════════════════════════════════════════════ */
export function AccessibilityPage() {
  return (
    <div>
      <PageHero title="Accessibility Services" subtitle="AeroNova is committed to making air travel accessible and comfortable for every passenger." icon={Accessibility} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={Users} title="Wheelchair & Mobility Assistance">
            <p>Complimentary wheelchair service is available at all airports we operate. Request this at least 48 hours before departure through your booking dashboard or by calling our support line.</p>
          </InfoCard>
          <InfoCard icon={Eye} title="Visual & Hearing Assistance">
            <p>Safety briefings are available in Braille and large print. In-flight entertainment includes closed captions and audio descriptions on all content.</p>
          </InfoCard>
          <InfoCard icon={Shield} title="Service Animals">
            <p>Trained service animals fly free of charge in the cabin. Submit documentation at least 72 hours before departure via our Special Services form.</p>
          </InfoCard>
          <InfoCard icon={Plane} title="Onboard Accessibility">
            <p>Our wide-body aircraft feature accessible lavatories, movable armrests, and priority boarding for passengers who need extra time.</p>
          </InfoCard>
          <InfoCard icon={Phone} title="Dedicated Accessibility Hotline">
            <p>Our trained accessibility coordinators are available 24/7 at <span className="text-sky-primary-400 font-medium">+1 (800) 555-0200</span> to assist with any special requirements.</p>
          </InfoCard>
          <InfoCard icon={Globe} title="Airport Assistance">
            <p>We partner with all major airports to provide escort services, accessible check-in counters, and sensory rooms for passengers with autism or anxiety.</p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRIVACY POLICY
   ═══════════════════════════════════════════════════ */
export function PrivacyPolicyPage() {
  const sections = [
    { icon: Database, title: 'Information We Collect', content: 'We collect personal information you provide during booking (name, email, phone, passport details, payment information), data from your use of our website (IP address, browser type, pages visited), and information from loyalty program participation.' },
    { icon: Settings, title: 'How We Use Your Data', content: 'Your data is used to process bookings, issue tickets, manage your account, communicate flight updates, process payments, fulfill legal obligations, improve our services, and personalize your experience.' },
    { icon: Shield, title: 'Data Protection', content: 'We employ industry-standard 256-bit SSL/TLS encryption for all data in transit. Payment card data is tokenized and never stored on our servers. We undergo annual SOC 2 Type II security audits.' },
    { icon: Users, title: 'Data Sharing', content: 'We share data only with: immigration and customs authorities (as legally required), payment processors (for transaction processing), partner airlines (for codeshare bookings), and airport operators (for ground handling). We never sell your data.' },
    { icon: Lock, title: 'Your Rights', content: 'You have the right to access, correct, delete, or export your personal data at any time. You can also opt out of marketing communications. Submit requests through your account settings or contact our Data Protection Officer.' },
    { icon: Clock, title: 'Data Retention', content: 'Booking records are retained for 7 years as required by aviation regulations. Account data is kept until you request deletion. Marketing preferences can be changed at any time.' },
  ];

  return (
    <div>
      <PageHero title="Privacy Policy" subtitle="How AeroNova collects, uses, and protects your personal information." icon={Lock} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-sm text-surface-muted mb-8">Last updated: January 1, {new Date().getFullYear()}</p>
        <div className="space-y-6">
          {sections.map(s => (
            <InfoCard key={s.title} icon={s.icon} title={s.title}><p>{s.content}</p></InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TERMS OF SERVICE
   ═══════════════════════════════════════════════════ */
export function TermsOfServicePage() {
  const sections = [
    { icon: FileText, title: '1. Agreement to Terms', content: 'By accessing our website or booking a flight, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.' },
    { icon: Plane, title: '2. Booking & Ticketing', content: 'All fares are subject to availability and may change until a ticket is issued. A booking is only confirmed after full payment is received and a PNR is generated. E-tickets are non-transferable.' },
    { icon: Clock, title: '3. Check-in & Boarding', content: 'Passengers must check in at least 45 minutes before domestic departures and 2 hours before international departures. Failure to check in on time may result in cancellation without refund.' },
    { icon: AlertTriangle, title: '4. Cancellations & Refunds', content: 'Refund eligibility depends on your fare class. Flexible tickets are fully refundable. Standard tickets incur a cancellation fee. Non-refundable tickets are eligible for credit only. All cancellations must be made at least 2 hours before departure.' },
    { icon: Shield, title: '5. Passenger Conduct', content: 'Passengers must comply with all crew instructions and applicable laws. Disruptive behavior, intoxication, or refusal to follow safety procedures may result in denied boarding, removal from the aircraft, and a permanent ban.' },
    { icon: BellRing, title: '6. Flight Changes & Delays', content: 'AeroNova reserves the right to change schedules, cancel flights, or substitute aircraft. In the event of delays exceeding 3 hours, passengers are entitled to meals, refreshments, and accommodation as applicable under local regulations.' },
  ];

  return (
    <div>
      <PageHero title="Terms of Service" subtitle="The terms and conditions governing your use of AeroNova Airlines services." icon={FileText} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-sm text-surface-muted mb-8">Effective date: January 1, {new Date().getFullYear()}</p>
        <div className="space-y-6">
          {sections.map(s => (
            <InfoCard key={s.title} icon={s.icon} title={s.title}><p>{s.content}</p></InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COOKIE POLICY
   ═══════════════════════════════════════════════════ */
export function CookiePolicyPage() {
  const cookies = [
    { name: 'Essential', purpose: 'Login sessions, security tokens, shopping cart', retention: 'Session', required: true },
    { name: 'Performance', purpose: 'Page load analytics, error tracking', retention: '1 year', required: false },
    { name: 'Functional', purpose: 'Language, currency, and display preferences', retention: '6 months', required: false },
    { name: 'Marketing', purpose: 'Personalized offers and retargeting', retention: '1 year', required: false },
  ];

  return (
    <div>
      <PageHero title="Cookie Policy" subtitle="How we use cookies to improve your browsing experience." icon={Settings} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        <InfoCard icon={HelpCircle} title="What are Cookies?">
          <p>Cookies are small text files stored on your device when you visit our website. They help us recognize your browser, remember your preferences, and understand how you interact with our site so we can continuously improve your experience.</p>
        </InfoCard>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Cookie Categories</h2>
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-white/70">
                  <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Purpose</th>
                    <th className="px-6 py-4">Retention</th>
                    <th className="px-6 py-4">Required</th>
                  </tr>
                </thead>
                <tbody>
                  {cookies.map(c => (
                    <tr key={c.name} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-sky-primary-400">{c.name}</td>
                      <td className="px-6 py-4 text-surface-muted">{c.purpose}</td>
                      <td className="px-6 py-4 text-surface-muted">{c.retention}</td>
                      <td className="px-6 py-4">
                        {c.required ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sky-primary-500/10 text-sky-primary-400 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Required
                          </span>
                        ) : (
                          <span className="text-surface-muted text-xs">Optional</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <InfoCard icon={Settings} title="Managing Your Cookies">
          <p>You can manage cookie preferences through your browser settings. Most browsers allow you to block or delete cookies. However, disabling essential cookies may prevent you from using core features like booking flights or managing your account.</p>
        </InfoCard>
      </div>
    </div>
  );
}
