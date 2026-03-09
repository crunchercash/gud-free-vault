import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import UserTypeCards from '@/components/landing/UserTypeCards';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <UserTypeCards />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}