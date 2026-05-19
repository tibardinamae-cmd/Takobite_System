import React, { useState } from 'react';
import { Order, MenuItem, OrderStatus, PromoCode, Category } from '../types';
import { PROMO_CODES } from '../data/storeData';
import { TrendingUp, DollarSign, Package, CheckCircle2, Clock, AlertCircle, Plus, Eye, Tag, Flame, Edit, Trash2, X, Image, Sparkles } from 'lucide-react';

interface AdminViewProps {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onToggleItemAvailability: (itemId: string) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onEditMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
}

// Preset appetizing images for easy admin creation
const PRESET_IMAGES = [
  { label: 'Classic Golden Takoyaki', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Cheesy Melt Overload', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' },
  { label: 'Spicy Tempura Flakes', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800' },
  { label: 'Truffle Mushroom Drizzle', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800' },
  { label: 'Sweet Corn & Mozzarella', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800' },
  { label: 'Premium Party Box', url: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&q=80&w=800' },
  { label: 'Crispy Karaage Bites', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800' },
  { label: 'Ramune Japanese Soda', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800' },
  { label: 'Matcha Green Tea Latte', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES: Category[] = ['Classic', 'Premium Fusion', 'Party Boxes', 'Sides & Drinks'];

export const AdminView: React.FC<AdminViewProps> = ({
  orders,
  menuItems,
  onUpdateOrderStatus,
  onToggleItemAvailability,
  onAddMenuItem,
  onEditMenuItem,
  onDeleteMenuItem,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'promos'>('orders');
  const [promos, setPromos] = useState<PromoCode[]>(PROMO_CODES);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(15);
  const [newPromoMin, setNewPromoMin] = useState(250);

  // Modal State for Add / Edit Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields
  const [itemName, setItemName] = useState('');
  const [itemJapanese, setItemJapanese] = useState('たこ焼き');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState(150);
  const [itemCategory, setItemCategory] = useState<Category>('Classic');
  const [itemImage, setItemImage] = useState(PRESET_IMAGES[0].url);
  const [itemPrepTime, setItemPrepTime] = useState('12 mins');
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);

  // Statistics calculation
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0) + 1420; // base demo revenue
  const pendingCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const completedCount = orders.filter(o => o.status === 'delivered').length + 8; // demo count

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;
    const newP: PromoCode = {
      code: newPromoCode.toUpperCase().trim(),
      discountPercent: Number(newPromoDiscount),
      minSpend: Number(newPromoMin),
      description: `${newPromoDiscount}% OFF on orders over ₱${newPromoMin}`
    };
    setPromos([newP, ...promos]);
    setNewPromoCode('');
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItemId(null);
    setItemName('');
    setItemJapanese('たこ焼き');
    setItemDescription('');
    setItemPrice(150);
    setItemCategory('Classic');
    setItemImage(PRESET_IMAGES[0].url);
    setItemPrepTime('12 mins');
    setIsBestseller(false);
    setIsSpicy(false);
    setIsVegetarian(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setModalMode('edit');
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemJapanese(item.japaneseName);
    setItemDescription(item.description);
    setItemPrice(item.price);
    setItemCategory(item.category);
    setItemImage(item.image);
    setItemPrepTime(item.prepTime);
    setIsBestseller(!!item.isBestseller);
    setIsSpicy(!!item.isSpicy);
    setIsVegetarian(!!item.isVegetarian);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const baseSizes = [
      { size: 6, price: itemPrice, label: '6 Pcs Solo Bites' },
      { size: 8, price: Math.round(itemPrice * 1.3), label: '8 Pcs Standard' },
      { size: 12, price: Math.round(itemPrice * 1.8), label: '12 Pcs Sumo Box' },
    ];

    if (modalMode === 'add') {
      const newItem: MenuItem = {
        id: `tako_${Date.now()}`,
        name: itemName,
        japaneseName: itemJapanese || 'たこ焼き',
        description: itemDescription,
        price: Number(itemPrice),
        category: itemCategory,
        image: itemImage,
        rating: 5.0,
        reviewsCount: 1,
        prepTime: itemPrepTime,
        isBestseller,
        isSpicy,
        isVegetarian,
        availableSizes: itemCategory === 'Party Boxes' 
          ? [{ size: 24, price: itemPrice, label: '24 Pcs Party Box' }, { size: 36, price: itemPrice + 250, label: '36 Pcs Mega Emperor' }] 
          : baseSizes,
      };
      onAddMenuItem(newItem);
    } else if (modalMode === 'edit' && editingItemId) {
      // Find original to keep rating
      const orig = menuItems.find(m => m.id === editingItemId);
      const updatedItem: MenuItem = {
        id: editingItemId,
        name: itemName,
        japaneseName: itemJapanese,
        description: itemDescription,
        price: Number(itemPrice),
        category: itemCategory,
        image: itemImage,
        rating: orig?.rating || 5.0,
        reviewsCount: orig?.reviewsCount || 1,
        prepTime: itemPrepTime,
        isBestseller,
        isSpicy,
        isVegetarian,
        availableSizes: itemCategory === 'Party Boxes' 
          ? [{ size: 24, price: itemPrice, label: '24 Pcs Party Box' }, { size: 36, price: itemPrice + 250, label: '36 Pcs Mega Emperor' }] 
          : baseSizes,
      };
      onEditMenuItem(updatedItem);
    }

    setIsModalOpen(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> New Order</span>;
      case 'preparing':
        return <span className="bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Flame className="w-3 h-3 animate-pulse" /> Grilling Batter</span>;
      case 'saucing':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-bold">🥢 Adding Sauces</span>;
      case 'ready_for_pickup':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-bold">📦 Ready / Out</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 pb-24">
      
      {/* Top Banner & Quick Metrics */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-400/30">
        <div>
          <span className="bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
            👑 Chef Kenji Sato • Store Kitchen
          </span>
          <h2 className="text-3xl font-black font-heading mt-2">Kitchen Dispatch & Analytics</h2>
          <p className="text-purple-200 text-xs mt-1">Manage live queues, update order statuses instantly, and manage menu catalog.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[130px]">
            <span className="text-purple-300 text-[10px] uppercase font-bold tracking-wider block">Today's Revenue</span>
            <span className="text-2xl font-black text-amber-300 flex items-center gap-1 mt-0.5">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>₱{totalRevenue}</span>
            </span>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[130px]">
            <span className="text-purple-300 text-[10px] uppercase font-bold tracking-wider block">Active Queue</span>
            <span className="text-2xl font-black text-white flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span>{pendingCount}</span>
            </span>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[130px]">
            <span className="text-purple-300 text-[10px] uppercase font-bold tracking-wider block">Orders Served</span>
            <span className="text-2xl font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <Package className="w-5 h-5" />
              <span>{completedCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-neutral-100 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders' ? 'bg-purple-600 text-white shadow-md font-black' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          🐙 Live Queue ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'menu' ? 'bg-purple-600 text-white shadow-md font-black' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          📋 Menu Catalog ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('promos')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'promos' ? 'bg-purple-600 text-white shadow-md font-black' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          🏷️ Vouchers
        </button>
      </div>

      {/* Tab 1: Live Orders Queue */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-heading text-neutral-900">Incoming Orders ({orders.length})</h3>
            <span className="text-xs text-neutral-500">Real-time store updates</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
              <p className="text-neutral-500 font-medium">No orders in the system right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 shadow-md border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-purple-700">{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-neutral-500">• {order.createdAt}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.orderType === 'delivery' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderType.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-neutral-900 text-sm">
                      {order.customerName} ({order.customerPhone})
                    </h4>
                    {order.orderType === 'delivery' && (
                      <p className="text-xs text-neutral-600">📍 {order.customerAddress}</p>
                    )}

                    {/* Order Items Breakdown */}
                    <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100 space-y-1">
                      {order.items.map(item => (
                        <div key={item.id} className="text-xs flex justify-between text-neutral-800">
                          <span><strong className="text-purple-700 font-black">{item.quantity}x</strong> {item.menuItem.name} ({item.selectedSize.label})</span>
                          <span className="font-bold">₱{item.itemTotal}</span>
                        </div>
                      ))}
                      {order.promoCodeUsed && (
                        <div className="text-[10px] text-emerald-700 font-bold pt-1">
                          🏷️ Voucher Used: {order.promoCodeUsed} (-₱{order.discount})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions / Status updater */}
                  <div className="flex flex-col items-end justify-between gap-4 md:pl-6 md:border-l border-neutral-100">
                    <div className="text-right">
                      <span className="text-xs text-neutral-400 block">Total ({order.paymentMethod.toUpperCase()})</span>
                      <span className="text-xl font-black text-purple-700">₱{order.total}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                          className="bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                        >
                          🔥 Start Grilling
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'saucing')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                        >
                          🥢 Add Sauces
                        </button>
                      )}
                      {order.status === 'saucing' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'ready_for_pickup')}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                        >
                          📦 Package Order
                        </button>
                      )}
                      {order.status === 'ready_for_pickup' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                        >
                          🎉 Mark Delivered
                        </button>
                      )}

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                          className="text-xs text-neutral-400 hover:text-red-600 px-2 py-2 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Menu Stock & CRUD Status */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 bg-purple-50 p-6 rounded-3xl border border-purple-200">
            <div>
              <h3 className="text-xl font-bold font-heading text-purple-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Store Menu Catalog ({menuItems.length} items)</span>
              </h3>
              <p className="text-xs text-purple-700 mt-0.5">Add new takoyaki creations, update prices, change pictures, or remove items.</p>
            </div>
            
            <button
              onClick={openAddModal}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-purple-500/20 flex items-center space-x-2 text-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg border border-neutral-200 transition-all flex flex-col justify-between group">
                
                {/* Image Section */}
                <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Category & Tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      {item.category}
                    </span>
                    {item.isBestseller && <span className="bg-amber-400 text-neutral-900 text-[10px] font-black px-2 py-0.5 rounded-full">★ Bestseller</span>}
                  </div>

                  <span className="absolute bottom-3 left-3 text-white font-black text-lg tracking-tight font-heading z-10 truncate max-w-[85%]">
                    {item.name}
                  </span>
                  <span className="absolute bottom-3 right-3 text-amber-300 font-bold text-xs z-10">
                    ₱{item.price}
                  </span>
                </div>
                
                {/* Info & CRUD Controls */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {item.description || 'Fresh authentic Osaka ingredients expertly grilled.'}
                  </p>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    {/* Stock toggle */}
                    <button
                      onClick={() => onToggleItemAvailability(item.id)}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Item is active on menu"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>In Stock</span>
                    </button>

                    {/* Edit & Delete buttons */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 bg-neutral-100 hover:bg-purple-100 text-neutral-700 hover:text-purple-700 rounded-xl transition-colors cursor-pointer"
                        title="Edit Item Details & Picture"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${item.name}" from the store menu?`)) {
                            onDeleteMenuItem(item.id);
                          }
                        }}
                        className="p-2 bg-neutral-100 hover:bg-red-100 text-neutral-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Promo Codes */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200">
            <h3 className="font-bold font-heading text-purple-900 mb-1 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-purple-700" />
              <span>Create New Voucher</span>
            </h3>
            <p className="text-xs text-purple-700 mb-4">Add discounts to boost mini-store sales</p>

            <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TAKO30"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-300 text-xs font-bold uppercase tracking-wider bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">Discount %</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={100}
                  value={newPromoDiscount}
                  onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-purple-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">Min. Spend (₱)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newPromoMin}
                  onChange={(e) => setNewPromoMin(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-purple-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold p-2.5 rounded-xl text-xs shadow-md transition-transform active:scale-95 h-10 cursor-pointer"
                >
                  Add Voucher
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold font-heading text-neutral-800">Active Voucher Codes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {promos.map((p) => (
                <div key={p.code} className="bg-white rounded-3xl p-5 border border-purple-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-purple-100 text-purple-800 text-xs font-black uppercase px-3 py-1 rounded-full">
                      {p.code}
                    </span>
                    <Tag className="w-4 h-4 text-purple-500" />
                  </div>
                  <h5 className="font-black text-neutral-900 text-base">{p.discountPercent}% OFF</h5>
                  <p className="text-xs text-neutral-500 mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col border border-purple-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-6 text-white flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-black font-heading flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-300" />
                <span>{modalMode === 'add' ? 'Add New Takoyaki Creation' : 'Edit Menu Item Details'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 bg-black/20 hover:bg-black/30 rounded-full text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto space-y-4 flex-1 no-scrollbar text-neutral-800">
              
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volcano Garlic Butter Takoyaki"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Japanese Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. にんにくバター"
                    value={itemJapanese}
                    onChange={(e) => setItemJapanese(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Base Price (₱) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as Category)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Estimated Prep Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10-12 mins"
                    value={itemPrepTime}
                    onChange={(e) => setItemPrepTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description / Ingredients</label>
                <textarea
                  rows={2}
                  placeholder="Describe the crispy exterior, molten center, and premium sauces..."
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Picture Selection */}
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1 flex items-center gap-1">
                  <Image className="w-4 h-4 text-purple-600" />
                  <span>Item Picture URL or Preset</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium bg-white mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">Or Choose Appealing Stock Takoyaki Preset:</span>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 bg-neutral-50 rounded-2xl border border-neutral-200">
                  {PRESET_IMAGES.map((imgPreset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setItemImage(imgPreset.url)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 relative h-16 transition-all ${
                        itemImage === imgPreset.url ? 'border-purple-600 ring-2 ring-purple-300 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={imgPreset.url} alt={imgPreset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-semibold truncate px-1 text-center">
                        {imgPreset.label.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-4 text-xs font-bold text-neutral-700">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} className="rounded text-purple-600 w-4 h-4" />
                  <span>★ Bestseller Badge</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} className="rounded text-red-600 w-4 h-4" />
                  <span>🌶️ Spicy Flavor</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={isVegetarian} onChange={(e) => setIsVegetarian(e.target.checked)} className="rounded text-emerald-600 w-4 h-4" />
                  <span>🥬 Vegetarian</span>
                </label>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-neutral-200 flex gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-purple-500/30 transition-transform active:scale-95 cursor-pointer"
                >
                  {modalMode === 'add' ? 'Publish Item' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
