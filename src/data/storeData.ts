import { MenuItem, PromoCode, Review, Order, User } from '../types';

export const DEMO_USERS: Record<string, User> = {
  customer: {
    id: 'cust_101',
    name: 'Hiroshi Tanaka',
    email: 'takolover@gmail.com',
    role: 'customer',
    phone: '+63 917 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    loyaltyPoints: 340,
    stampsCount: 5, // 5 out of 8 stamps
  },
  admin: {
    id: 'admin_999',
    name: 'Chef Kenji Sato',
    email: 'admin@takobite.com',
    role: 'admin',
    phone: '+63 920 987 6543',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200',
    loyaltyPoints: 0,
    stampsCount: 0,
  }
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'tako_1',
    name: 'Classic Osaka Octopus',
    japaneseName: '元祖たこ焼き',
    description: 'Crispy outside, creamy molten center filled with premium Japanese diced octopus, pickled ginger, and green onions. Drizzled with Otafuku sauce and Kewpie mayo.',
    price: 130, // in PHP or currency
    category: 'Classic',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 142,
    prepTime: '10-12 mins',
    isBestseller: true,
    availableSizes: [
      { size: 6, price: 130, label: '6 Pcs Solo Bites' },
      { size: 8, price: 170, label: '8 Pcs Standard' },
      { size: 12, price: 245, label: '12 Pcs Sumo Box' },
    ]
  },
  {
    id: 'tako_2',
    name: 'Cheesy Bacon Overload',
    japaneseName: 'チーズベーコン',
    description: 'Stuffed with crispy smoked bacon bits and melted cheddar, topped with a torched 3-cheese blend and rich garlic butter mayo.',
    price: 150,
    category: 'Premium Fusion',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 98,
    prepTime: '12-15 mins',
    isBestseller: true,
    availableSizes: [
      { size: 6, price: 150, label: '6 Pcs Solo Bites' },
      { size: 8, price: 195, label: '8 Pcs Standard' },
      { size: 12, price: 280, label: '12 Pcs Sumo Box' },
    ]
  },
  {
    id: 'tako_3',
    name: 'Spicy Ebi Tempura Crunch',
    japaneseName: 'スパイシーエビ',
    description: 'Juicy black tiger prawns inside, generously coated with fiery sriracha mayo, roasted nori shreds, and extra crispy golden tempura flakes.',
    price: 165,
    category: 'Premium Fusion',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 115,
    prepTime: '12 mins',
    isSpicy: true,
    availableSizes: [
      { size: 6, price: 165, label: '6 Pcs Solo Bites' },
      { size: 8, price: 215, label: '8 Pcs Standard' },
      { size: 12, price: 310, label: '12 Pcs Sumo Box' },
    ]
  },
  {
    id: 'tako_4',
    name: 'Truffle Teriyaki Mushroom',
    japaneseName: 'トリュフきのこ',
    description: 'Savory shiitake and button mushrooms infused with white truffle oil, finished with sweet teriyaki glaze and freshly grated parmesan.',
    price: 175,
    category: 'Premium Fusion',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 64,
    prepTime: '15 mins',
    isVegetarian: true,
    availableSizes: [
      { size: 6, price: 175, label: '6 Pcs Solo Bites' },
      { size: 8, price: 225, label: '8 Pcs Standard' },
      { size: 12, price: 330, label: '12 Pcs Sumo Box' },
    ]
  },
  {
    id: 'tako_5',
    name: 'Sweet Corn & Mozzarella Melt',
    japaneseName: 'コーンチーズ',
    description: 'A comforting blend of Hokkaido sweet corn kernels and gooey mozzarella. Perfect for kids and cheese lovers alike!',
    price: 140,
    category: 'Classic',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewsCount: 52,
    prepTime: '10 mins',
    isVegetarian: true,
    availableSizes: [
      { size: 6, price: 140, label: '6 Pcs Solo Bites' },
      { size: 8, price: 180, label: '8 Pcs Standard' },
      { size: 12, price: 260, label: '12 Pcs Sumo Box' },
    ]
  },
  {
    id: 'tako_6',
    name: 'Ultimate Samurai Party Feast',
    japaneseName: 'サムライパーティー',
    description: 'Can\'t decide? Get 24 pieces of 4 assorted flavors (6 Classic, 6 Cheesy Bacon, 6 Spicy Ebi, 6 Truffle Mushroom) in our premium golden festival box!',
    price: 580,
    category: 'Party Boxes',
    image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviewsCount: 230,
    prepTime: '20-25 mins',
    isBestseller: true,
    availableSizes: [
      { size: 24, price: 580, label: '24 Pcs Ultimate Feast' },
      { size: 36, price: 850, label: '36 Pcs Mega Emperor Box' },
    ]
  },
  {
    id: 'side_1',
    name: 'Crispy Karaage Chicken Bites',
    japaneseName: '鳥の唐揚げ',
    description: 'Soy-ginger marinated juicy chicken thigh nuggets, fried to absolute golden perfection. Served with lemon wedge and garlic mayo.',
    price: 160,
    category: 'Sides & Drinks',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 88,
    prepTime: '10 mins',
    availableSizes: [
      { size: 1, price: 160, label: 'Standard Bowl (200g)' },
      { size: 2, price: 290, label: 'Large Sharing (400g)' },
    ]
  },
  {
    id: 'drink_1',
    name: 'Ice-Cold Ramune Japanese Soda',
    japaneseName: 'ラムネソーダ',
    description: 'The iconic traditional Japanese glass bottle soda with a marble stopper. Refreshing lychee and melon notes.',
    price: 85,
    category: 'Sides & Drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 167,
    prepTime: 'Instant',
    availableSizes: [
      { size: 1, price: 85, label: 'Original Lychee 200ml' },
      { size: 2, price: 85, label: 'Melon Burst 200ml' },
    ]
  },
  {
    id: 'drink_2',
    name: 'Iced Matcha Green Tea Latte',
    japaneseName: '抹茶ラテ',
    description: 'Ceremonial grade Uji matcha whisked with creamy oat milk and a touch of organic cane sugar syrup.',
    price: 120,
    category: 'Sides & Drinks',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 94,
    prepTime: '5 mins',
    availableSizes: [
      { size: 1, price: 120, label: 'Medium 16oz' },
      { size: 2, price: 145, label: 'Large 22oz' },
    ]
  }
];

export const PROMO_CODES: PromoCode[] = [
  { code: 'TAKO20', discountPercent: 20, minSpend: 300, description: '20% OFF on orders over ₱300' },
  { code: 'FREESHIP', discountPercent: 100, minSpend: 500, description: 'Free Delivery on orders over ₱500' },
  { code: 'WELCOME10', discountPercent: 10, minSpend: 0, description: '10% OFF your first order!' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_301',
    orderNumber: '#TB-8842',
    customerName: 'Mei Lin Wong',
    customerPhone: '+63 917 555 0192',
    customerAddress: 'Makati Executive Tower 3, Unit 14B',
    items: [
      {
        id: 'cart_1',
        menuItem: MENU_ITEMS[0],
        selectedSize: MENU_ITEMS[0].availableSizes[1], // 8 pcs
        quantity: 2,
        customization: {
          sauce: 'Original Otafuku',
          toppings: ['Bonito Flakes', 'Aonori Seaweed', 'Extra Scallions'],
          spiceLevel: 'Mild',
        },
        itemTotal: 340
      },
      {
        id: 'cart_2',
        menuItem: MENU_ITEMS[7], // Ramune
        selectedSize: MENU_ITEMS[7].availableSizes[0],
        quantity: 2,
        customization: {
          sauce: 'None',
          toppings: [],
          spiceLevel: 'None',
        },
        itemTotal: 170
      }
    ],
    subtotal: 510,
    deliveryFee: 50,
    discount: 102, // 20% off
    total: 458,
    orderType: 'delivery',
    paymentMethod: 'gcash',
    status: 'saucing',
    createdAt: '12 mins ago',
    estimatedTime: '25 mins',
    promoCodeUsed: 'TAKO20'
  },
  {
    id: 'ord_302',
    orderNumber: '#TB-8843',
    customerName: 'Carlos Santos',
    customerPhone: '+63 920 123 4567',
    customerAddress: 'BGC High Street South Corporate Plaza',
    items: [
      {
        id: 'cart_3',
        menuItem: MENU_ITEMS[5], // Party Feast
        selectedSize: MENU_ITEMS[5].availableSizes[0], // 24 pcs
        quantity: 1,
        customization: {
          sauce: 'Special Teriyaki & Mayo',
          toppings: ['Bonito Flakes', 'Aonori Seaweed', 'Mozzarella Melt'],
          spiceLevel: 'Spicy',
          specialInstructions: 'Please put spicy sauce on the side for kids'
        },
        itemTotal: 580
      }
    ],
    subtotal: 580,
    deliveryFee: 0, // Pickup
    discount: 0,
    total: 580,
    orderType: 'pickup',
    paymentMethod: 'card',
    status: 'preparing',
    createdAt: '5 mins ago',
    estimatedTime: '18 mins'
  },
  {
    id: 'ord_300',
    orderNumber: '#TB-8839',
    customerName: 'Sarah Jenkins',
    customerPhone: '+63 918 888 2211',
    customerAddress: 'Salcedo Village, Makati',
    items: [
      {
        id: 'cart_4',
        menuItem: MENU_ITEMS[1], // Cheesy Bacon
        selectedSize: MENU_ITEMS[1].availableSizes[2], // 12 pcs
        quantity: 1,
        customization: {
          sauce: 'Garlic Butter Mayo',
          toppings: ['Extra Cheese Blend', 'Bacon Bits'],
          spiceLevel: 'None',
        },
        itemTotal: 280
      }
    ],
    subtotal: 280,
    deliveryFee: 50,
    discount: 0,
    total: 330,
    orderType: 'delivery',
    paymentMethod: 'cash',
    status: 'delivered',
    createdAt: '1 hour ago',
    estimatedTime: 'Delivered'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev_1',
    userName: 'Akari M.',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'The Cheesy Bacon overload is literally out of this world! Perfect molten center and arrived hot in 20 minutes.',
    date: 'Yesterday',
    itemName: 'Cheesy Bacon Overload'
  },
  {
    id: 'rev_2',
    userName: 'David K.',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'Reminds me exactly of Dotonbori in Osaka. The octopus chunks are huge and generous! Best takoyaki in town.',
    date: '2 days ago',
    itemName: 'Classic Osaka Octopus'
  },
  {
    id: 'rev_3',
    userName: 'Samantha L.',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    rating: 4,
    comment: 'Spicy ebi has an amazing kick! Loved the tempura crunch on top. Will order the 24pc party box next time.',
    date: '1 week ago',
    itemName: 'Spicy Ebi Tempura Crunch'
  }
];
