import React from 'react';
import { Star, Clock, Flame, Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect, onQuickAdd }) => {
  return (
    <div 
      onClick={() => onSelect(item)}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-rose-100 transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-rose-50">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {item.isBestseller && (
            <span className="bg-amber-400 text-neutral-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <span>★ Bestseller</span>
            </span>
          )}
          {item.isSpicy && (
            <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <Flame className="w-3 h-3" />
              <span>Spicy</span>
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
              Veggie
            </span>
          )}
        </div>

        {/* Rating & Prep Time Badge on bottom left of image */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-white text-xs font-bold z-10">
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{item.rating} ({item.reviewsCount})</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <Clock className="w-3.5 h-3.5 text-rose-300" />
            <span>{item.prepTime}</span>
          </div>
        </div>

        {/* Japanese subtitle watermark */}
        <span className="absolute top-3 right-3 text-white/90 font-black text-xl tracking-widest drop-shadow-md z-10">
          {item.japaneseName}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-lg text-neutral-900 group-hover:text-rose-600 transition-colors font-heading">
              {item.name}
            </h3>
          </div>
          <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Price & Action button */}
        <div className="flex items-center justify-between pt-3 border-t border-rose-50">
          <div>
            <span className="text-xs text-neutral-400 font-semibold block">Starts at</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-sm font-bold text-rose-600">₱</span>
              <span className="text-xl font-black text-neutral-900">{item.price}</span>
              <span className="text-[11px] text-neutral-500">/ 6 pcs</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(item, e);
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md shadow-rose-500/20 flex items-center space-x-1 transition-all hover:scale-105 active:scale-95 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
