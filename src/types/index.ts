export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar: string;
  loyaltyPoints: number;
  stampsCount: number; // 8 stamps = 1 free box
}

export type Category = 'All' | 'Classic' | 'Premium Fusion' | 'Party Boxes' | 'Sides & Drinks';

export interface MenuItem {
  id: string;
  name: string;
  japaneseName: string;
  description: string;
  price: number; // base price for 6pcs
  category: Category;
  image: string;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  isBestseller?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  availableSizes: { size: number; price: number; label: string }[];
}

export interface CustomizationOption {
  sauce: string;
  toppings: string[];
  spiceLevel: 'None' | 'Mild' | 'Spicy' | 'Volcano';
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItem: MenuItem;
  selectedSize: { size: number; price: number; label: string };
  quantity: number;
  customization: CustomizationOption;
  itemTotal: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'saucing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'gcash' | 'card';
  status: OrderStatus;
  createdAt: string;
  estimatedTime: string;
  promoCodeUsed?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  itemName: string;
}
