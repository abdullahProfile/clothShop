export interface Product {
  id: string;
  name: string;
  category: 'shirt' | 'jeans' | 'jacket' | 'accessories';
  price: number;
  stock: number;
  description: string;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  paymentStatus: 'pending' | 'success' | 'failed';
  paymentMethod?: 'credit-card' | 'paypal' | 'cash-on-delivery';
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

export interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'newest';
  searchQuery: string;
}