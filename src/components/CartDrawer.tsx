import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, Truck, ShoppingBag, ShieldCheck, CheckCircle2, QrCode, Clock, Minus, Plus } from 'lucide-react';
import { CartItem, Order, User, PromoCode } from '../types';
import { PROMO_CODES } from '../data/storeData';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onPlaceOrder: (order: Order) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  currentUser,
  onOpenAuth,
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+63 917 555 1234');
  const [customerAddress, setCustomerAddress] = useState('Makati Ave, Condominium Tower B, Unit 1204');
  const [pickupTime, setPickupTime] = useState('In 20 Mins (ASAP)');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash' | 'card'>('gcash');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 500 ? 0 : 50) : 0;
  
  const discount = appliedPromo 
    ? (appliedPromo.discountPercent === 100 ? deliveryFee : Math.round(subtotal * (appliedPromo.discountPercent / 100)))
    : 0;

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyPromo = () => {
    setPromoError('');
    const matched = PROMO_CODES.find(p => p.code.toUpperCase() === promoInput.toUpperCase().trim());
    if (matched) {
      if (subtotal < matched.minSpend) {
        setPromoError(`Minimum spend of ₱${matched.minSpend} required for this coupon.`);
      } else {
        setAppliedPromo(matched);
      }
    } else {
      setPromoError('Invalid coupon code. Try TAKO20 or FREESHIP');
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (items.length === 0) return;

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      orderNumber: `#TB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || currentUser.name,
      customerPhone: customerPhone || '+63 917 000 0000',
      customerAddress: orderType === 'delivery' ? customerAddress : 'Store Pickup (TakoBite Express)',
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      orderType,
      paymentMethod,
      status: 'pending',
      createdAt: 'Just now',
      estimatedTime: orderType === 'delivery' ? '25 mins' : pickupTime,
      promoCodeUsed: appliedPromo ? appliedPromo.code : undefined
    };

    onPlaceOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto flex flex-col shadow-2xl border-l border-rose-100 animate-slideLeft">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-rose-100 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-black font-heading text-neutral-900">Your Tako Basket</h2>
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-4xl mb-4 animate-bounce">
              🐙
            </div>
            <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Your basket is feeling empty!</h3>
            <p className="text-neutral-500 text-xs max-w-xs mb-6 leading-relaxed">
              Looks like you haven't added any delicious piping hot takoyaki yet. Explore our Osaka menu to start ordering!
            </p>
            <button
              onClick={onClose}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-rose-500/20 text-xs transition-transform active:scale-95"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          /* Cart Content */
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            
            {/* Delivery vs Pickup Switcher */}
            <div className="flex bg-neutral-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  orderType === 'delivery'
                    ? 'bg-white text-rose-600 shadow-sm font-black'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Express Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  orderType === 'pickup'
                    ? 'bg-white text-rose-600 shadow-sm font-black'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Store Pickup</span>
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Order Items</span>
              {items.map((item) => (
                <div key={item.id} className="bg-rose-50/50 rounded-2xl p-3 border border-rose-100/80 flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-rose-100">
                    <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-neutral-900 truncate">{item.menuItem.name}</h4>
                      <span className="font-black text-xs text-rose-600 flex-shrink-0 ml-2">₱{item.itemTotal}</span>
                    </div>

                    <p className="text-[11px] text-neutral-500 font-medium">Size: {item.selectedSize.label}</p>
                    <p className="text-[10px] text-neutral-400 truncate">
                      Sauce: {item.customization.sauce} | Toppings: {item.customization.toppings.join(', ')}
                    </p>
                    {item.customization.specialInstructions && (
                      <p className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                        Note: {item.customization.specialInstructions}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center space-x-2 bg-white rounded-lg border border-neutral-200 px-1 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-neutral-500 hover:text-rose-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-neutral-500 hover:text-rose-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery/Pickup Details Form */}
            <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                {orderType === 'delivery' ? '🚚 Delivery Details' : '🏬 Pickup Details'}
              </span>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+63 917 000 0000"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {orderType === 'delivery' ? (
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Delivery Address</label>
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    rows={2}
                    placeholder="Street, Building, Unit Number"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {subtotal < 500 ? (
                    <p className="text-[10px] text-amber-700 mt-1">
                      💡 Add ₱{500 - subtotal} more for <strong className="font-bold">FREE Delivery</strong>!
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Eligible for Free Delivery!</span>
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Estimated Pickup Time</label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    <option>In 15 Mins (ASAP)</option>
                    <option>In 30 Mins</option>
                    <option>In 1 Hour</option>
                    <option>5:30 PM Dinner Pickup</option>
                  </select>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800 flex items-center space-x-1 mb-2">
                <Tag className="w-3.5 h-3.5 text-rose-600" />
                <span>Have a Promo Voucher?</span>
              </span>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. TAKO20"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-rose-300 text-xs font-bold uppercase tracking-wider bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between mt-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Applied: {appliedPromo.code} ({appliedPromo.discountPercent}% OFF)</span>
                  </div>
                  <button onClick={() => setAppliedPromo(null)} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                    Remove
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-[10px] text-rose-600 font-medium mt-1.5">{promoError}</p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gcash')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    paymentMethod === 'gcash'
                      ? 'border-blue-500 bg-blue-50/80 text-blue-900 font-bold ring-2 ring-blue-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs">GCash Express</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-rose-600 bg-rose-50/80 text-rose-900 font-bold ring-2 ring-rose-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-rose-600 mb-1" />
                  <span className="text-xs">Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold ring-2 ring-amber-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <Clock className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="text-xs">Cash {orderType === 'delivery' ? 'on Delivery' : 'at Store'}</span>
                </button>
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Subtotal</span>
                <span>₱{subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₱${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-₱{discount}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-2 flex justify-between text-base font-black text-neutral-900">
                <span>Total Amount</span>
                <span className="text-rose-600">₱{total}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handleCheckout}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center justify-center space-x-2 transition-transform active:scale-95 text-sm"
            >
              <span>Place Order (₱{total})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
