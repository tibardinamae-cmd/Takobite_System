import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { HeroBanner } from './components/HeroBanner';
import { MenuItemCard } from './components/MenuItemCard';
import { CustomizeModal } from './components/CustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { LiveTracking } from './components/LiveTracking';
import { MiniGame } from './components/MiniGame';
import { AdminView } from './components/AdminView';
import { ReviewsModal } from './components/ReviewsModal';
import { UserProfile } from './components/UserProfile';

import { MENU_ITEMS, INITIAL_ORDERS, REVIEWS, DEMO_USERS } from './data/storeData';
import { MenuItem, CartItem, Order, Review, User, OrderStatus, Category } from './types';
import { MessageSquare, Search, Filter, ShieldAlert } from 'lucide-react';

export default function App() {
  // App View & Tab State
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'desktop' : 'mobile'
  );
  
  // Store & User State (Start with customer logged in by default or demo user)
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS.customer);
  const [activeTab, setActiveTab] = useState<string>('menu'); // menu, orders, rewards, profile, admin

  // Handle automatic resize listening
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('mobile');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Controllers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'customer' | 'admin'>('customer');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Auth Handlers
  const handleOpenAuth = (role: 'customer' | 'admin' = 'customer') => {
    setAuthRole(role);
    setIsAuthOpen(true);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
      showToast(`👑 Welcome Chef Administrator!`);
    } else {
      setActiveTab('menu');
      showToast(`🐙 Welcome back, ${user.name}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('menu');
    showToast('Logged out successfully.');
  };

  // Cart Handlers (Customer Only)
  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?.role === 'admin') {
      showToast('⚠️ Kitchen Admin cannot order. Switch to Customer account.');
      return;
    }
    const defaultCartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      menuItem: item,
      selectedSize: item.availableSizes[0],
      quantity: 1,
      customization: {
        sauce: 'Original Osaka Otafuku & Kewpie',
        toppings: ['Katsuobushi (Bonito Flakes)', 'Aonori (Japanese Seaweed Powder)'],
        spiceLevel: item.isSpicy ? 'Spicy' : 'None',
      },
      itemTotal: item.price,
    };
    setCartItems(prev => [...prev, defaultCartItem]);
    showToast(`Added ${item.name} to basket! 🥢`);
  };

  const handleOpenCustomize = (item: MenuItem) => {
    if (currentUser?.role === 'admin') {
      showToast('⚠️ Kitchen Admin cannot order. Switch to Customer account.');
      return;
    }
    setSelectedItemForCustomization(item);
    setIsCustomizeOpen(true);
  };

  const handleAddToCartCustomized = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
    showToast(`Customized ${item.menuItem.name} added to basket! 🔥`);
  };

  const handleUpdateCartQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === cartId) {
        const newQ = item.quantity + delta;
        if (newQ <= 0) return null;
        const singlePrice = item.itemTotal / item.quantity;
        return { ...item, quantity: newQ, itemTotal: singlePrice * newQ };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== cartId));
    showToast('Item removed from basket.');
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setActiveTab('orders');
    showToast('🎉 Order placed successfully! Tracking live dispatch...');

    if (currentUser && currentUser.role === 'customer') {
      const updatedPts = currentUser.loyaltyPoints + Math.round(newOrder.total * 0.1);
      const updatedStamps = currentUser.stampsCount + 1;
      setCurrentUser({
        ...currentUser,
        loyaltyPoints: updatedPts,
        stampsCount: updatedStamps > 8 ? 1 : updatedStamps
      });
    }
  };

  // Live Tracking & Admin Simulation Handlers
  const handleAdvanceStatus = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const flow: OrderStatus[] = ['pending', 'preparing', 'saucing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];
        const currentIdx = flow.indexOf(ord.status);
        const nextStatus = currentIdx < flow.length - 1 ? flow[currentIdx + 1] : ord.status;
        showToast(`Simulated status update: Order #${ord.orderNumber} is now ${nextStatus.replace(/_/g, ' ').toUpperCase()}`);
        return { ...ord, status: nextStatus };
      }
      return ord;
    }));
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: 'cancelled' } : ord));
    showToast('Order successfully cancelled.');
  };

  const handleAdminUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status.toUpperCase()}`);
  };

  const handleToggleItemStock = (itemId: string) => {
    setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, price: i.price } : i));
    showToast(`Toggled stock status for item #${itemId}`);
  };

  // Admin Menu CRUD Handlers
  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
    showToast(`✨ Added new item: ${newItem.name}!`);
  };

  const handleEditMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    showToast(`✏️ Updated item: ${updatedItem.name}!`);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    showToast('🗑️ Item deleted successfully.');
  };

  // Mini Game / Loyalty Handlers
  const handleAddPoints = (pts: number) => {
    if (currentUser && currentUser.role === 'customer') {
      setCurrentUser({ ...currentUser, loyaltyPoints: currentUser.loyaltyPoints + pts });
      showToast(`+${pts} Loyalty Points added! 🌟`);
    }
  };

  const handleAddStamp = () => {
    if (currentUser && currentUser.role === 'customer') {
      const newStamps = currentUser.stampsCount + 1;
      if (newStamps >= 8) {
        showToast('🎉 PASSPORT FULL! You earned a FREE Party Box!');
      } else {
        showToast(`+1 Stamp! (${newStamps}/8 collected) 🐙`);
      }
      setCurrentUser({ ...currentUser, stampsCount: newStamps > 8 ? 1 : newStamps });
    }
  };

  const handleAddReview = (review: Review) => {
    setReviews([review, ...reviews]);
    showToast('Thank you for your delicious review! ★');
    setIsReviewsOpen(false);
  };

  // Filter items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.japaneseName.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const categories: Category[] = ['All', 'Classic', 'Premium Fusion', 'Party Boxes', 'Sides & Drinks'];
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-amber-50/60 font-sans text-neutral-800 flex flex-col items-center justify-start selection:bg-rose-500 selection:text-white pb-safe">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 z-50 left-1/2 -translate-x-1/2 bg-neutral-900 text-white font-bold px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce border border-rose-500 text-xs">
          <span className="text-rose-400">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div className={`w-full transition-all duration-500 ${
        viewMode === 'mobile' 
          ? 'max-w-md my-0 sm:my-8 bg-white sm:rounded-[48px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] sm:border-[12px] sm:border-neutral-900 overflow-hidden relative min-h-screen sm:min-h-[850px]'
          : 'max-w-7xl w-full bg-transparent'
      }`}>

        {/* Header Bar */}
        <Header
          currentUser={currentUser}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          activeTab={activeTab}
          onNavigate={(tab) => {
            if (tab === 'admin' && !isAdmin) {
              handleOpenAuth('admin');
              return;
            }
            setActiveTab(tab);
          }}
        />

        {/* Account Mode Indicator */}
        <div className={`px-4 py-2 text-white text-xs font-bold flex items-center justify-between shadow-inner ${
          isAdmin ? 'bg-gradient-to-r from-purple-800 to-indigo-700' : 'bg-gradient-to-r from-rose-500 to-amber-500'
        }`}>
          <div className="flex items-center space-x-2 truncate">
            {isAdmin ? (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span className="truncate">👑 Store Operations Portal Active: Live Queue & Menu Catalog</span>
              </>
            ) : (
              <>
                <span className="text-sm">🐙</span>
                <span className="truncate">TakoBite Foodie Ordering Portal • {currentUser ? `Welcome ${currentUser.name}` : 'Register or login to collect stamps!'}</span>
              </>
            )}
          </div>
          
          <button
            onClick={() => handleOpenAuth(isAdmin ? 'customer' : 'admin')}
            className="bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider transition-colors flex-shrink-0 ml-2 cursor-pointer"
          >
            {isAdmin ? 'Switch to Customer 👤' : 'Admin Portal 👑'}
          </button>
        </div>

        {/* View Mode Indicator Info for Desktop View */}
        {viewMode === 'mobile' && (
          <div className="hidden sm:block text-center bg-neutral-900 text-neutral-400 text-[10px] py-1 tracking-widest uppercase font-bold">
            📱 Simulated Mobile App View Frame Active
          </div>
        )}

        {/* Main Body Content based on Active Tab & Role */}
        <main className="min-h-[calc(100vh-140px)]">

          {/* If user is Admin, strictly show Admin Operations Suite */}
          {isAdmin ? (
            <AdminView
              orders={orders}
              menuItems={menuItems}
              onUpdateOrderStatus={handleAdminUpdateOrderStatus}
              onToggleItemAvailability={handleToggleItemStock}
              onAddMenuItem={handleAddMenuItem}
              onEditMenuItem={handleEditMenuItem}
              onDeleteMenuItem={handleDeleteMenuItem}
            />
          ) : (
            /* Otherwise, show Customer Foodie Pages */
            <>
              {/* TAB 1: MENU / ONLINE ORDERING */}
              {activeTab === 'menu' && (
                <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24">
                  
                  {/* Hero Banner */}
                  <HeroBanner onOpenPromo={() => showToast('Coupon code TAKO20 copied! Apply at checkout.')} />

                  {/* Search & Reviews trigger bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search takoyaki flavors, drinks, sides..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium shadow-sm"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold bg-neutral-100 px-2 py-0.5 rounded-full cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setIsReviewsOpen(true)}
                      className="w-full sm:w-auto bg-white hover:bg-rose-50 text-neutral-800 font-bold px-5 py-3.5 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-rose-600" />
                      <span>Customer Reviews ★ ({reviews.length})</span>
                    </button>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
                    <span className="text-xs font-bold text-neutral-400 flex items-center space-x-1 pl-1 pr-2 flex-shrink-0">
                      <Filter className="w-3.5 h-3.5" />
                      <span>Category:</span>
                    </span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30 font-black scale-105'
                            : 'bg-white hover:bg-rose-50 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {cat === 'All' ? '🥢 All Menu' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Menu Grid */}
                  {filteredMenuItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 my-8 shadow-sm">
                      <span className="text-4xl block mb-2">🔍</span>
                      <h3 className="font-bold font-heading text-neutral-800 text-lg">No Takoyaki Matches Found</h3>
                      <p className="text-neutral-500 text-xs mt-1">Try searching for "Octopus", "Cheese", "Spicy", or select "All Menu".</p>
                      <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 bg-rose-600 text-white text-xs font-bold px-6 py-2 rounded-full cursor-pointer">
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {filteredMenuItems.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onSelect={handleOpenCustomize}
                          onQuickAdd={handleQuickAdd}
                        />
                      ))}
                    </div>
                  )}

                  {/* Bottom App Promo Banner */}
                  <div className="bg-gradient-to-tr from-amber-400 to-rose-500 p-8 rounded-3xl text-white text-center shadow-lg my-12 border border-amber-300">
                    <span className="text-4xl block mb-2">🍡</span>
                    <h3 className="text-2xl font-bold font-heading">Craving an Office Party or Birthday Feast?</h3>
                    <p className="text-sm text-white/90 max-w-lg mx-auto mt-2 mb-6 leading-relaxed">
                      Our Tako Sumo Boxes (36 pcs) come with complimentary chopsticks, extra Otafuku bottles, and nori seasoning!
                    </p>
                    <button
                      onClick={() => setSelectedCategory('Party Boxes')}
                      className="bg-neutral-900 hover:bg-black text-white font-black px-8 py-3.5 rounded-full text-xs shadow-xl transition-transform active:scale-95 cursor-pointer"
                    >
                      View Party Boxes
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: MY ORDERS TRACKING */}
              {activeTab === 'orders' && (
                <LiveTracking
                  orders={orders}
                  onAdvanceStatus={handleAdvanceStatus}
                  onCancelOrder={handleCancelOrder}
                  onOpenMenu={() => setActiveTab('menu')}
                />
              )}

              {/* TAB 3: REWARDS & MINI GAME */}
              {activeTab === 'rewards' && (
                <MiniGame
                  loyaltyPoints={currentUser?.loyaltyPoints || 100}
                  stampsCount={currentUser?.stampsCount || 3}
                  onAddPoints={handleAddPoints}
                  onAddStamp={handleAddStamp}
                  onOpenMenu={() => setActiveTab('menu')}
                />
              )}

              {/* TAB 4: PROFILE */}
              {activeTab === 'profile' && (
                <UserProfile
                  currentUser={currentUser}
                  orders={orders}
                  onLogout={handleLogout}
                  onOpenAuth={() => handleOpenAuth('customer')}
                  onNavigate={setActiveTab}
                />
              )}
            </>
          )}

        </main>

        {/* Modals */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          initialRole={authRole}
        />

        <CustomizeModal
          isOpen={isCustomizeOpen}
          item={selectedItemForCustomization}
          onClose={() => setIsCustomizeOpen(false)}
          onAddToCart={handleAddToCartCustomized}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onPlaceOrder={handlePlaceOrder}
          currentUser={currentUser}
          onOpenAuth={() => handleOpenAuth('customer')}
        />

        <ReviewsModal
          isOpen={isReviewsOpen}
          onClose={() => setIsReviewsOpen(false)}
          reviews={reviews}
          onAddReview={handleAddReview}
          currentUser={currentUser}
          onOpenAuth={() => handleOpenAuth('customer')}
        />

        {/* Customer / Admin Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onNavigate={setActiveTab}
          currentUser={currentUser}
          activeOrdersCount={activeOrdersCount}
          viewMode={viewMode}
        />

      </div>
    </div>
  );
}
