import React from 'react';
import { Sparkles, Flame, Clock, Truck, ShieldCheck, Tag } from 'lucide-react';

interface HeroBannerProps {
  onOpenPromo: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenPromo }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-rose-400/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Column: Text & CTA */}
        <div className="max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Osaka Street Food Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-heading mb-3">
            Crispy outside. <br />
            <span className="text-amber-200 underline decoration-wavy decoration-amber-300">Molten lava inside.</span> 🐙
          </h2>

          <p className="text-white/90 text-sm sm:text-base font-medium mb-6 leading-relaxed">
            Freshly grilled golden balls stuffed with premium octopus, torched cheese, and secret savory glazes. Order online for instant pickup or 20-min express delivery!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPromo}
              className="bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center space-x-2"
            >
              <Tag className="w-4 h-4 text-rose-600" />
              <span>Use Code <strong className="text-rose-700 font-black">TAKO20</strong> for 20% OFF</span>
            </button>
            <div className="text-xs text-white/80 font-semibold px-3 py-2 bg-black/20 rounded-xl backdrop-blur-sm">
              ✨ Free Delivery over ₱500
            </div>
          </div>
        </div>

        {/* Right Column: Visual highlights & floating badges */}
        <div className="relative flex flex-col items-center justify-center w-full md:w-auto">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-tr from-amber-300 to-rose-400 shadow-2xl animate-float">
            <img
              src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800"
              alt="Delicious Takoyaki"
              className="w-full h-full object-cover rounded-full shadow-inner border-4 border-white/80"
            />
            {/* Absolute badge */}
            <div className="absolute -bottom-2 right-4 bg-white text-neutral-900 px-4 py-2 rounded-2xl shadow-xl flex items-center space-x-1.5 border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-rose-600">4.9 ★ Bestseller</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mini Feature Badges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/20 text-white/90 text-xs font-bold">
        <div className="flex items-center space-x-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
          <Clock className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span>Made Fresh in 12 Mins</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
          <Truck className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span>Thermal Bag Delivery</span>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center space-x-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span>100% Japanese Ingredients</span>
        </div>
      </div>
    </div>
  );
};
