import React from 'react';
import { User, Order } from '../types';
import { Award, Clock, MapPin, Phone, Shield, LogOut, CheckCircle2 } from 'lucide-react';

interface UserProfileProps {
  currentUser: User | null;
  orders: Order[];
  onLogout: () => void;
  onOpenAuth: () => void;
  onNavigate: (tab: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  orders,
  onLogout,
  onOpenAuth,
  onNavigate
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
          👤
        </div>
        <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-2">Sign in to your account</h2>
        <p className="text-neutral-500 text-xs mb-6">Track your orders, earn takoyaki loyalty stamps, and save favorite glazes.</p>
        <button
          onClick={onOpenAuth}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-rose-500/20 text-xs"
        >
          Open Login Form
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(
    o => o.customerName.toLowerCase() === currentUser.name.toLowerCase() || o.id.startsWith('ord_30')
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 pb-24">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-rose-500 shadow-lg"
        />

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black font-heading text-neutral-900">{currentUser.name}</h2>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
              currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {currentUser.role.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-neutral-500 flex items-center justify-center sm:justify-start gap-1">
            <span>✉️ {currentUser.email}</span>
          </p>
          <p className="text-xs text-neutral-500 flex items-center justify-center sm:justify-start gap-1">
            <Phone className="w-3.5 h-3.5 text-neutral-400" />
            <span>{currentUser.phone || '+63 917 123 4567'}</span>
          </p>

          <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start">
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-900">{currentUser.loyaltyPoints} Points</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="text-base">🐙</span>
              <span className="text-xs font-bold text-rose-900">{currentUser.stampsCount} / 8 Stamps</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Delivery Addresses */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <h3 className="text-lg font-bold font-heading text-neutral-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-rose-600" />
          <span>Saved Delivery Address</span>
        </h3>
        
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 flex items-center justify-between">
          <div>
            <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">Home Address</span>
            <p className="text-xs font-semibold text-neutral-800 mt-1">Makati Executive Tower 3, Unit 14B, Senator Gil Puyat Ave</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Instructions: Please ring the doorbell, leave at front desk if not home.</p>
          </div>
          <button className="text-xs text-rose-600 font-bold hover:underline">Edit</button>
        </div>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-heading text-neutral-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-600" />
          <span>Order History ({userOrders.length})</span>
        </h3>

        {userOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200">
            <p className="text-neutral-500 text-xs">No order history found for this account.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userOrders.map((ord) => (
              <div key={ord.id} className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-rose-600 text-sm">{ord.orderNumber}</span>
                    <span className="text-xs text-neutral-400 font-medium">• {ord.createdAt}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{ord.status.toUpperCase()}</span>
                    </span>
                  </div>

                  <p className="text-xs font-bold text-neutral-800 mt-1.5">
                    {ord.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Order Type: <strong className="capitalize text-neutral-700">{ord.orderType}</strong> • Payment: <strong className="uppercase text-neutral-700">{ord.paymentMethod}</strong>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                  <span className="text-base font-black text-neutral-900">₱{ord.total}</span>
                  <button
                    onClick={() => onNavigate('orders')}
                    className="text-xs text-rose-600 font-bold hover:underline mt-1"
                  >
                    View Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
