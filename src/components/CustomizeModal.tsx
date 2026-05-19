import React, { useState } from 'react';
import { X, Check, Flame, Plus, Minus, ShoppingBag } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface CustomizeModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

const SAUCE_OPTIONS = [
  { id: 'otafuku', label: 'Original Osaka Otafuku & Kewpie' },
  { id: 'teriyaki', label: 'Sweet Teriyaki Glaze' },
  { id: 'spicy_mayo', label: 'Fiery Sriracha Mayo' },
  { id: 'wasabi', label: 'Japanese Wasabi Crema' },
  { id: 'none', label: 'Sauce on the Side' },
];

const TOPPING_OPTIONS = [
  { id: 'bonito', label: 'Katsuobushi (Bonito Flakes)', price: 0 },
  { id: 'seaweed', label: 'Aonori (Japanese Seaweed Powder)', price: 0 },
  { id: 'scallions', label: 'Fresh Green Scallions', price: 0 },
  { id: 'tempura', label: 'Crispy Tempura Scraps (Tenkasu)', price: 0 },
  { id: 'cheese', label: 'Torched Mozzarella Topping', price: 20 },
];

const SPICE_LEVELS: Array<'None' | 'Mild' | 'Spicy' | 'Volcano'> = ['None', 'Mild', 'Spicy', 'Volcano'];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  item,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedSauce, setSelectedSauce] = useState(SAUCE_OPTIONS[0].label);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([
    TOPPING_OPTIONS[0].label,
    TOPPING_OPTIONS[1].label,
  ]);
  const [spiceLevel, setSpiceLevel] = useState<'None' | 'Mild' | 'Spicy' | 'Volcano'>('None');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const selectedSize = item.availableSizes[selectedSizeIndex] || item.availableSizes[0];

  const handleToppingToggle = (toppingLabel: string) => {
    if (selectedToppings.includes(toppingLabel)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingLabel));
    } else {
      setSelectedToppings([...selectedToppings, toppingLabel]);
    }
  };

  const calculateItemTotal = () => {
    let basePrice = selectedSize.price;
    let toppingsExtra = selectedToppings.reduce((acc, topping) => {
      const match = TOPPING_OPTIONS.find(t => t.label === topping);
      return acc + (match ? match.price : 0);
    }, 0);
    return (basePrice + toppingsExtra) * quantity;
  };

  const handleAdd = () => {
    const newCartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      menuItem: item,
      selectedSize,
      quantity,
      customization: {
        sauce: selectedSauce,
        toppings: selectedToppings,
        spiceLevel,
        specialInstructions,
      },
      itemTotal: calculateItemTotal(),
    };
    onAddToCart(newCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col border border-rose-100">
        
        {/* Modal Header Banner */}
        <div className="relative h-48 bg-rose-50 overflow-hidden flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">{item.category}</span>
            <h2 className="text-2xl font-black font-heading text-white">{item.name}</h2>
            <p className="text-white/80 text-xs line-clamp-1 mt-0.5">{item.description}</p>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar text-neutral-800">
          
          {/* Step 1: Choose Box Size */}
          <div>
            <label className="block text-xs font-black uppercase text-neutral-500 mb-2.5 tracking-wider">
              1. Choose Box Size / Portion
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {item.availableSizes.map((sizeObj, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSizeIndex(idx)}
                  className={`p-3 rounded-2xl border text-left sm:text-center transition-all ${
                    selectedSizeIndex === idx
                      ? 'border-rose-600 bg-rose-50/80 text-rose-900 shadow-sm font-bold ring-2 ring-rose-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-semibold">{sizeObj.label}</span>
                  <span className="block text-sm font-black text-rose-600 mt-0.5">₱{sizeObj.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Sauce */}
          <div>
            <label className="block text-xs font-black uppercase text-neutral-500 mb-2.5 tracking-wider">
              2. Select Sauce Drizzle
            </label>
            <div className="space-y-2">
              {SAUCE_OPTIONS.map((sauce) => (
                <label
                  key={sauce.id}
                  onClick={() => setSelectedSauce(sauce.label)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedSauce === sauce.label
                      ? 'bg-amber-50/80 border-amber-500 text-neutral-900 font-bold'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <span className="text-xs">{sauce.label}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedSauce === sauce.label ? 'bg-amber-500 border-amber-600 text-neutral-900' : 'border-neutral-300'
                  }`}>
                    {selectedSauce === sauce.label && <Check className="w-3.5 h-3.5" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Toppings */}
          <div>
            <label className="block text-xs font-black uppercase text-neutral-500 mb-2.5 tracking-wider flex justify-between">
              <span>3. Toppings & Garnishes</span>
              <span className="text-[10px] text-rose-600 font-bold">Select Multiple</span>
            </label>
            <div className="space-y-2">
              {TOPPING_OPTIONS.map((topping) => {
                const isSelected = selectedToppings.includes(topping.label);
                return (
                  <div
                    key={topping.id}
                    onClick={() => handleToppingToggle(topping.label)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50/60 border-rose-400 text-neutral-900 font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-rose-600 border-rose-700 text-white' : 'border-neutral-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs">{topping.label}</span>
                    </div>
                    {topping.price > 0 && (
                      <span className="text-xs font-bold text-rose-600">+₱{topping.price}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 4: Spice Level */}
          <div>
            <label className="block text-xs font-black uppercase text-neutral-500 mb-2.5 tracking-wider flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>4. Spice Level</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SPICE_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpiceLevel(lvl)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    spiceLevel === lvl
                      ? 'bg-red-600 text-white border-red-700 shadow-md'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Special Instructions */}
          <div>
            <label className="block text-xs font-black uppercase text-neutral-500 mb-2 tracking-wider">
              Special Instructions
            </label>
            <textarea
              placeholder="e.g. Please put extra bonito flakes, no green onions, ring doorbell."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

        </div>

        {/* Modal Footer / CTA */}
        <div className="p-4 bg-neutral-50 border-t border-rose-100 flex items-center justify-between gap-4 flex-shrink-0 pb-safe sm:pb-4">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3 bg-white p-1 rounded-2xl border border-neutral-200 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-rose-100 flex items-center justify-center text-neutral-700 hover:text-rose-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-black text-neutral-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-rose-100 flex items-center justify-center text-neutral-700 hover:text-rose-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center justify-between transition-transform active:scale-95 text-sm"
          >
            <span className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Basket</span>
            </span>
            <span className="font-black bg-white/20 px-3 py-1 rounded-xl text-white">
              ₱{calculateItemTotal()}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
