import React, { useState } from 'react';
import { X, Shield, User as UserIcon, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { DEMO_USERS } from '../data/storeData';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  initialRole?: 'customer' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialRole = 'customer'
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'customer') {
      if (email.includes('admin') || email === 'admin@takobite.com') {
        setError('Please use the Store Admin tab for administrator access.');
        return;
      }

      if (authMode === 'register') {
        if (!fullName || !phone) {
          setError('Please fill in your name and phone number to register.');
          return;
        }
        const newUser: User = {
          id: 'cust_' + Date.now(),
          name: fullName.trim(),
          email: email.trim().toLowerCase() || 'customer@gmail.com',
          role: 'customer',
          phone: phone.trim(),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          loyaltyPoints: 50, // Welcome bonus
          stampsCount: 1
        };
        onLogin(newUser);
        onClose();
      } else {
        // Customer login
        const customUser: User = {
          id: 'cust_' + Math.floor(Math.random() * 1000),
          name: email.split('@')[0].toUpperCase(),
          email: email.trim().toLowerCase() || 'customer@gmail.com',
          role: 'customer',
          phone: '+63 917 000 1111',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          loyaltyPoints: 120,
          stampsCount: 3
        };
        onLogin(customUser);
        onClose();
      }
    } else {
      // Admin Login
      if (email.trim().toLowerCase() === 'admin@takobite.com' && password === 'admin123') {
        onLogin(DEMO_USERS.admin);
        onClose();
      } else {
        setError('Invalid admin credentials. (Hint: use admin@takobite.com / admin123 or click Admin Demo below)');
      }
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    onLogin(DEMO_USERS[role]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-rose-100">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-3 text-3xl">
            🐙
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {activeTab === 'admin' ? 'Store Administrator Portal' : 'Welcome to TakoBite!'}
          </h2>
          <p className="text-white/90 text-xs font-medium mt-1">
            {activeTab === 'admin' ? 'Kitchen Dispatch & Menu Catalog Management' : 'Savor the authentic taste of Osaka in every bite'}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Role Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-full">
            <button
              onClick={() => { setActiveTab('customer'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-rose-600 text-white shadow-md font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Store Admin</span>
            </button>
          </div>

          {/* Customer Sub-tabs (Login vs Register) */}
          {activeTab === 'customer' && (
            <div className="flex border-b border-neutral-200">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  authMode === 'login' ? 'border-rose-600 text-rose-600 font-black' : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In Existing</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  authMode === 'register' ? 'border-rose-600 text-rose-600 font-black' : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Account</span>
              </button>
            </div>
          )}

          {/* Quick Demo Credentials Reminder / Buttons */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
            <p className="text-[11px] font-bold text-neutral-600 mb-2 flex items-center justify-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 animate-spin" />
              <span>Quick Login Demo (One-Click)</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 py-2 px-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer truncate"
              >
                🐙 Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 py-2 px-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer truncate"
              >
                👑 Admin Portal Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-semibold border border-red-200 text-center animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualAuth} className="space-y-3.5">
            {activeTab === 'customer' && authMode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kenji Tanaka"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0917 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder={activeTab === 'admin' ? 'admin@takobite.com' : 'takolover@gmail.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-medium bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1 flex justify-between">
                <span>Password *</span>
                {activeTab === 'admin' && <span className="text-[10px] text-purple-600 font-normal">Default: admin123</span>}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-medium bg-white"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 text-xs uppercase tracking-wider cursor-pointer ${
                activeTab === 'admin' 
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' 
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
              }`}
            >
              {activeTab === 'admin' 
                ? 'Login to Store Admin' 
                : authMode === 'register' ? 'Register & Start Ordering' : 'Log In Customer'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
