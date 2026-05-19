import React from 'react';
import { Utensils, Clock, Award, User, LayoutDashboard } from 'lucide-react';
import { User as UserType } from '../types';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserType | null;
  activeOrdersCount: number;
  viewMode: 'mobile' | 'desktop';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onNavigate,
  currentUser,
  activeOrdersCount,
  viewMode,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  if (viewMode === 'desktop') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-lg pb-safe md:hidden">
      <div className="max-w-md mx-auto px-4 flex justify-around items-center h-16">
        
        {isAdmin ? (
          <button
            onClick={() => onNavigate('admin')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              activeTab === 'admin' ? 'text-purple-600 scale-105 font-bold' : 'text-neutral-400 hover:text-neutral-600 font-medium'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-1 text-purple-600" />
            <span className="text-[11px] tracking-tight">Operations Suite</span>
          </button>
        ) : (
          <>
            {/* Menu Tab */}
            <button
              onClick={() => onNavigate('menu')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
                activeTab === 'menu' ? 'text-rose-600 scale-105 font-bold' : 'text-neutral-400 hover:text-neutral-600 font-medium'
              }`}
            >
              <Utensils className="w-5 h-5 mb-1" />
              <span className="text-[11px] tracking-tight">Menu</span>
            </button>

            {/* Orders Tab (Customer tracking) */}
            <button
              onClick={() => onNavigate('orders')}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
                activeTab === 'orders' ? 'text-rose-600 scale-105 font-bold' : 'text-neutral-400 hover:text-neutral-600 font-medium'
              }`}
            >
              <div className="relative">
                <Clock className="w-5 h-5 mb-1" />
                {activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {activeOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">My Orders</span>
            </button>

            {/* Rewards / Mini Game Tab (Customer Only) */}
            <button
              onClick={() => onNavigate('rewards')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
                activeTab === 'rewards' ? 'text-rose-600 scale-105 font-bold' : 'text-neutral-400 hover:text-neutral-600 font-medium'
              }`}
            >
              <Award className="w-5 h-5 mb-1" />
              <span className="text-[11px] tracking-tight">Rewards 🐙</span>
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => onNavigate('profile')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
                activeTab === 'profile' ? 'text-rose-600 scale-105 font-bold' : 'text-neutral-400 hover:text-neutral-600 font-medium'
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-[11px] tracking-tight">Profile</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
};
