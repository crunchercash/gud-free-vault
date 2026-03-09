import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Menu, 
  X, 
  Wallet, 
  Building2, 
  CheckCircle,
  Info,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { base44 } from '@/api/base44Client';

const navigation = [
  { name: 'Home', href: 'Home', icon: Shield },
  { name: 'My Wallet', href: 'Dashboard', icon: Wallet },
  { name: 'Verify', href: 'Verify', icon: CheckCircle },
  { name: 'Network', href: 'Network', icon: Building2 },
  { name: 'About', href: 'About', icon: Info },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = currentPageName === 'Home';

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        :root {
          --coral-50: #fff5f2;
          --coral-100: #ffe8e0;
          --coral-200: #ffd1c2;
          --coral-300: #ffb099;
          --coral-400: #ff8566;
          --coral-500: #e85a3c;
          --coral-600: #d14427;
          --coral-700: #ae3520;
          --navy-50: #f0f4f8;
          --navy-100: #d9e2ec;
          --navy-200: #bcccdc;
          --navy-600: #334e68;
          --navy-700: #243b53;
          --navy-800: #1a2f44;
          --navy-900: #102a43;
        }
        
        .bg-coral-50 { background-color: var(--coral-50); }
        .bg-coral-100 { background-color: var(--coral-100); }
        .bg-coral-500 { background-color: var(--coral-500); }
        .bg-coral-600 { background-color: var(--coral-600); }
        .hover\\:bg-coral-600:hover { background-color: var(--coral-600); }
        .hover\\:bg-coral-700:hover { background-color: var(--coral-700); }
        .text-coral-400 { color: var(--coral-400); }
        .text-coral-500 { color: var(--coral-500); }
        .text-coral-600 { color: var(--coral-600); }
        .hover\\:text-coral-600:hover { color: var(--coral-600); }
        .hover\\:text-coral-700:hover { color: var(--coral-700); }
        .border-coral-200 { border-color: var(--coral-200); }
        .hover\\:border-coral-300:hover { border-color: var(--coral-300); }
        .from-coral-400 { --tw-gradient-from: var(--coral-400); }
        .from-coral-500 { --tw-gradient-from: var(--coral-500); }
        .to-coral-500 { --tw-gradient-to: var(--coral-500); }
        .to-coral-600 { --tw-gradient-to: var(--coral-600); }
        .shadow-coral-500\\/25 { --tw-shadow-color: rgba(232, 90, 60, 0.25); }
        .shadow-coral-500\\/30 { --tw-shadow-color: rgba(232, 90, 60, 0.3); }
        
        .bg-navy-50 { background-color: var(--navy-50); }
        .bg-navy-100 { background-color: var(--navy-100); }
        .bg-navy-600 { background-color: var(--navy-600); }
        .bg-navy-700 { background-color: var(--navy-700); }
        .bg-navy-800 { background-color: var(--navy-800); }
        .text-navy-700 { color: var(--navy-700); }
        .from-navy-600 { --tw-gradient-from: var(--navy-600); }
        .from-navy-700 { --tw-gradient-from: var(--navy-700); }
        .to-navy-700 { --tw-gradient-to: var(--navy-700); }
        .to-navy-800 { --tw-gradient-to: var(--navy-800); }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isHomePage ? 'bg-transparent absolute w-full' : 'bg-white shadow-sm'
      }`}>
        <nav className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isHomePage ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-br from-coral-500 to-coral-600'
              }`}>
                <Shield className={`w-6 h-6 ${isHomePage ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`text-xl font-bold ${isHomePage ? 'text-white' : 'text-slate-900'}`}>
                RefsVault
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPageName === item.href
                      ? isHomePage 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 text-slate-900'
                      : isHomePage
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={isHomePage ? "outline" : "ghost"}
                      className={isHomePage 
                        ? "border-white/30 text-white hover:bg-white/10" 
                        : "text-slate-600"
                      }
                    >
                      <User className="w-4 h-4 mr-2" />
                      Account
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Dashboard')} className="flex items-center">
                        <Wallet className="w-4 h-4 mr-2" />
                        My Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${isHomePage ? 'text-white' : 'text-slate-600'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100"
            >
              <div className="px-6 py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPageName === item.href
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">RefsVault</span>
              </div>
              <p className="text-slate-400 text-sm">
                The universal digital credential wallet for secure, verified academic 
                and professional records.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to={createPageUrl('Dashboard')} className="hover:text-white transition-colors">My Wallet</Link></li>
                <li><Link to={createPageUrl('Verify')} className="hover:text-white transition-colors">Verify Credentials</Link></li>
                <li><Link to={createPageUrl('Network')} className="hover:text-white transition-colors">Trust Registry</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to={createPageUrl('About')} className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Organizations</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Become an Issuer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} RefsVault. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}