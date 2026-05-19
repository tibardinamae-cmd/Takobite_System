import React from 'react';
import { ShoppingBag, User, Award, Smartphone, Monitor, LogOut, Utensils, Clock, LayoutDashboard } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: (role?: 'customer' | 'admin') => void;
  onLogout: () => void;
  viewMode: 'mobile' | 'desktop';
  onChangeViewMode: (mode: 'mobile' | 'desktop') => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
  viewMode,
  onChangeViewMode,
  activeTab,
  onNavigate
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(isAdmin ? 'admin' : 'menu')} 
          className="flex items-center space-x-2 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <span className="text-2xl animate-float inline-block">🐙</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center">
              Tako<span className="text-rose-600">Bite</span>
              {isAdmin && <span className="ml-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-purple-100 text-purple-800 rounded-full border border-purple-200">Admin</span>}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 -mt-1">
              {isAdmin ? 'Store Operations Suite' : 'Premium Takoyaki Bar'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {viewMode === 'desktop' && (
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-600 hover:text-purple-600'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Operations Suite</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('menu')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'menu' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-600 hover:text-rose-600'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Browse Menu</span>
                </button>

                <button
                  onClick={() => onNavigate('orders')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'orders' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-600 hover:text-rose-600'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>My Orders</span>
                </button>

                <button
                  onClick={() => onNavigate('rewards')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'rewards' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-600 hover:text-rose-600'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Rewards Club</span>
                </button>

                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'profile' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-600 hover:text-rose-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
              </>
            )}
          </nav>
        )}

        {/* Center/Right: Device Preview Toggle */}
        <div className="hidden md:flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200 shadow-inner flex-shrink-0">
          <button
            onClick={() => onChangeViewMode('mobile')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-neutral-900 text-white shadow-sm font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
            title="Preview as Mobile App"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App View</span>
          </button>
          <button
            onClick={() => onChangeViewMode('desktop')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-neutral-900 text-white shadow-sm font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
            title="Preview Full Desktop Website"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          
          {/* Loyalty Badge (Customer Only) */}
          {!isAdmin && currentUser && (
            <button
              onClick={() => onNavigate('rewards')}
              className="hidden sm:flex items-center space-x-1.5 bg-amber-500/10 border border-amber-400 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-600 animate-bounce" />
              <span>{currentUser.loyaltyPoints} Pts</span>
            </button>
          )}

          {/* Cart Button (Customer Only) */}
          {!isAdmin && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div
                className={`flex items-center space-x-1.5 p-1 px-2 rounded-full border ${
                  isAdmin ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-white flex-shrink-0"
                />
                <span className="text-xs font-bold pr-1 truncate max-w-[100px]">
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-neutral-500 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer flex items-center space-x-1 bg-neutral-100 text-xs px-3 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth('customer')}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
              >
                <User className="w-3.5 h-3.5" />
                <span>Log In / Register</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
