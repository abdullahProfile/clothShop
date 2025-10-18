import { useState, useEffect } from 'react';
import { Product, CartItem, Order, Testimonial } from '../types';
import { api } from '../services/api';

export const useStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadProducts();
    loadTestimonials();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const loadTestimonials = async () => {
    const data = await api.getTestimonials();
    setTestimonials(data);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const checkout = async (paymentMethod: 'credit-card' | 'paypal' | 'cash-on-delivery') => {
    if (cart.length === 0) return null;
    
    const result = await api.checkout(cart, paymentMethod);
    if (result.success && result.orderId) {
      const order = api.getOrder(result.orderId);
      if (order) {
        setCurrentOrder(order);
        setCart([]);
        return order;
      }
    }
    return null;
  };

  const processPayment = async (orderId: string) => {
    const response = await api.processPayment(orderId);
    return response;
  };

  const subscribeToOrder = (orderId: string, callback: (order: Order) => void) => {
    return api.onOrderUpdate(orderId, callback);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    products,
    testimonials,
    cart,
    loading,
    currentOrder,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    processPayment,
    subscribeToOrder,
    setCurrentOrder,
    loadProducts
  };
};