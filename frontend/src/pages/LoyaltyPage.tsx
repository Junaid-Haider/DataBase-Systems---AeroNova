import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, Star, Plane, Shield, ArrowRight, Zap, Coffee } from 'lucide-react';
import api from '../lib/api/client';
import Button from '../components/ui/Button';
import { useAuthStore } from '../lib/stores/authStore';

export default function LoyaltyPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: loyaltyData, isLoading, error } = useQuery({
    queryKey: ['loyaltyAccount'],
    queryFn: async () => {
      const { data } = await api.get('/loyalty/account');
      return data;
    },
    enabled: isAuthenticated,
    retry: false
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/loyalty/enroll');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyAccount'] });
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-sky-primary-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Join AeroNova Rewards</h2>
          <p className="text-surface-muted mb-8">Sign in or create an account to start earning miles and unlock exclusive benefits.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen pt-24 px-4 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-primary-500"></div></div>;
  }

  const isEnrolled = !error && loyaltyData;

  if (!isEnrolled) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-20 h-20 text-sky-primary-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-6">AeroNova Frequent Flyer</h1>
          <p className="text-lg text-surface-muted max-w-2xl mx-auto mb-10">
            Earn miles on every flight. Redeem for free travel, cabin upgrades, lounge access, and more.
          </p>
          
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => enrollMutation.mutate()}
            loading={enrollMutation.isPending}
            className="px-12 py-4 text-lg"
          >
            Enroll Now for Free
          </Button>

          <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
            <div className="glass-card p-6 rounded-2xl">
              <Star className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Earn Miles</h3>
              <p className="text-surface-muted">Get rewarded for every mile you fly with us or our global partners.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <Zap className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Exclusive Upgrades</h3>
              <p className="text-surface-muted">Use your miles to upgrade to Business or First Class on eligible flights.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <Coffee className="w-10 h-10 text-sky-primary-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Lounge Access</h3>
              <p className="text-surface-muted">Relax in premium lounges worldwide as you climb the membership tiers.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { frequentFlyer, account } = loyaltyData;

  const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
  const currentTierIndex = tiers.indexOf(frequentFlyer.TierLevel);
  const nextTier = tiers[currentTierIndex + 1];
  
  // Calculate progress to next tier
  const tierThresholds = { SILVER: 25000, GOLD: 50000, PLATINUM: 100000 };
  const nextThreshold = nextTier ? tierThresholds[nextTier as keyof typeof tierThresholds] : null;
  const progressPercent = nextThreshold 
    ? Math.min(100, Math.round((account.TotalMiles / nextThreshold) * 100))
    : 100;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Award className="w-8 h-8 text-sky-primary-500" />
          My Loyalty Dashboard
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm text-surface-muted font-medium mb-1">Total Miles Available</p>
                    <h2 className="text-5xl font-bold text-white">
                      {frequentFlyer.MilesBalance.toLocaleString()}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-surface-muted font-medium mb-1">Account Number</p>
                    <p className="text-lg text-white font-mono">{account.AccountNo}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm text-surface-muted">Current Tier</p>
                      <p className="text-xl font-bold text-sky-primary-400">{frequentFlyer.TierLevel}</p>
                    </div>
                    {nextTier && (
                      <div className="text-right text-sm text-surface-muted">
                        <span className="text-white font-bold">{nextThreshold?.toLocaleString()}</span> miles to {nextTier}
                      </div>
                    )}
                  </div>
                  {nextTier && (
                    <div className="w-full h-3 bg-surface-overlay rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-primary-600 to-sky-primary-400 rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="text-center py-12">
                <Plane className="w-12 h-12 text-surface-muted mx-auto mb-4 opacity-50" />
                <p className="text-surface-muted">No recent flights found. Book a flight to start earning miles!</p>
                <Button variant="outline" className="mt-6" onClick={() => window.location.href='/flights/search'}>
                  Search Flights
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Current Benefits</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-sky-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Earn {account.BonusMult}x Miles</p>
                    <p className="text-xs text-surface-muted">On all eligible flights</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-surface-muted shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium opacity-50">Lounge Access ({account.LoungePass} passes)</p>
                    <p className="text-xs text-surface-muted">Earn passes at Silver tier</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-surface-muted shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium opacity-50">Upgrade Credits ({account.UpgradeCred})</p>
                    <p className="text-xs text-surface-muted">Unlock at Gold tier</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-sky-primary-900/40 to-transparent border-sky-primary-500/20">
              <h3 className="text-lg font-bold text-white mb-2">Redeem Miles</h3>
              <p className="text-sm text-surface-muted mb-6">Use your miles at checkout to get discounts on your next booking.</p>
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => window.location.href='/flights/search'}>
                Book with Miles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
