import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle2, RefreshCw, AlertCircle, MapPin, Sparkles } from 'lucide-react';

interface LiveTrackingProps {
  orders: Order[];
  onAdvanceStatus: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onOpenMenu: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
  { status: 'pending', label: 'Order Received', icon: '📝', desc: 'Kitchen accepted your order' },
  { status: 'preparing', label: 'Grilling Batter', icon: '🔥', desc: 'Pouring dashi batter & diced octopus' },
  { status: 'saucing', label: 'Saucing & Toppings', icon: '🥢', desc: 'Adding Otafuku sauce & bonito flakes' },
  { status: 'ready_for_pickup', label: 'Ready / Delivering', icon: '🚴', desc: 'Packaging hot in thermal box' },
  { status: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your molten takoyaki!' },
];

export const LiveTracking: React.FC<LiveTrackingProps> = ({
  orders,
  onAdvanceStatus,
  onCancelOrder,
  onOpenMenu,
}) => {
  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
          🛸
        </div>
        <h2 className="text-2xl font-black font-heading text-neutral-800 mb-2">No Active Orders Yet</h2>
        <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6">
          Your active order radar is currently clear. Place an order from our Osaka menu to watch our chefs flip your takoyaki live!
        </p>
        <button
          onClick={onOpenMenu}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-rose-500/30 transition-transform active:scale-95 text-sm"
        >
          Start New Order
        </button>
      </div>
    );
  }

  const getStepCurrentIndex = (status: OrderStatus) => {
    if (status === 'out_for_delivery') return 3;
    const index = STATUS_STEPS.findIndex((s) => s.status === status);
    return index !== -1 ? index : 0;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 pb-24">
      <div className="flex items-center justify-between border-b border-rose-100 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-neutral-900 flex items-center gap-2">
            <span>Live Order Tracker</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Watch your golden takoyaki balls get prepared in real-time</p>
        </div>
        <button
          onClick={onOpenMenu}
          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-2xl text-xs border border-rose-200 transition-colors"
        >
          + Order More
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const currentIndex = getStepCurrentIndex(order.status);
          const isCancelled = order.status === 'cancelled';

          return (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 overflow-hidden relative">
              
              {/* Order Header info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-50">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-rose-600">{order.orderNumber}</span>
                    <span className="text-xs text-neutral-400 font-medium">• {order.createdAt}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      order.orderType === 'delivery' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.orderType === 'delivery' ? '🚚 Express Delivery' : '🏬 Store Pickup'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mt-1">
                    {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-400 font-semibold block">Total Paid ({order.paymentMethod.toUpperCase()})</span>
                  <span className="text-lg font-black text-neutral-900">₱{order.total}</span>
                </div>
              </div>

              {/* Status Stepper Progression */}
              {!isCancelled ? (
                <div className="py-8">
                  <div className="relative max-w-2xl mx-auto">
                    
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-neutral-100 -translate-y-1/2 rounded-full z-0 hidden sm:block"></div>
                    <div 
                      className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500 -translate-y-1/2 rounded-full z-0 transition-all duration-700 hidden sm:block"
                      style={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                    ></div>

                    {/* Steps */}
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                          <div key={step.status} className="flex sm:flex-col items-center sm:items-center text-left sm:text-center group">
                            
                            {/* Step Icon Circle */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md transition-all duration-300 z-10 ${
                              isCurrent 
                                ? 'bg-rose-600 text-white scale-125 shadow-rose-500/40 ring-4 ring-rose-100 animate-pulse' 
                                : isCompleted
                                  ? 'bg-amber-400 text-neutral-900 border-2 border-amber-500'
                                  : 'bg-neutral-100 text-neutral-400 border border-neutral-200 grayscale'
                            }`}>
                              {step.icon}
                            </div>

                            {/* Step Label */}
                            <div className="ml-4 sm:ml-0 sm:mt-3">
                              <span className={`block text-xs font-black uppercase ${isCurrent ? 'text-rose-600 font-bold' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'}`}>
                                {step.label}
                              </span>
                              <span className="block text-[11px] text-neutral-500 max-w-[120px] hidden md:block leading-tight mt-0.5">
                                {step.desc}
                              </span>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Estimated Delivery/Pickup Time Badge */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3 bg-amber-50 border border-amber-200/80 p-3 rounded-2xl text-amber-900 text-xs font-bold">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Estimated Completion: <strong className="text-rose-700 font-black">{order.estimatedTime}</strong></span>
                    <span className="text-neutral-300">|</span>
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>{order.customerAddress}</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-rose-800 bg-red-50 rounded-2xl my-4 border border-red-200">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-bold text-sm">Order Cancelled</h4>
                  <p className="text-xs text-neutral-600">This order was cancelled. Payment refunded to your account.</p>
                </div>
              )}

              {/* Order Actions & Simulator Trigger */}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50 -mx-6 -mb-6 p-4">
                <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Interactive Test: Simulate chef completing the next step</span>
                </div>

                <div className="flex items-center space-x-2">
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        className="text-xs font-bold text-neutral-500 hover:text-red-600 bg-white border border-neutral-200 px-3 py-2 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onAdvanceStatus(order.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-purple-500/20 flex items-center space-x-1 transition-transform active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Simulate Next Step</span>
                      </button>
                    </>
                  )}
                  {order.status === 'delivered' && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Order Completed Perfectly!</span>
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
