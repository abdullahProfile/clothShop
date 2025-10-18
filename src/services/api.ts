import { Product, CartItem, Order, PaymentResponse, Testimonial } from '../types';

// Simulated database with atomic operations
class InventoryDatabase {
  private products: Map<string, Product>;
  private locks: Map<string, boolean> = new Map();
  private requestQueue: Array<() => void> = [];

  constructor() {
    this.products = new Map([
      ['1', { id: '1', name: 'Classic White Shirt', category: 'shirt', price: 29.99, stock: 10, description: 'Premium cotton white shirt perfect for any occasion', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', isFeatured: true }],
      ['2', { id: '2', name: 'Blue Denim Jeans', category: 'jeans', price: 49.99, stock: 8, description: 'Comfortable slim-fit jeans with stretch fabric', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', isFeatured: true }],
      ['3', { id: '3', name: 'Leather Jacket', category: 'jacket', price: 129.99, stock: 5, description: 'Genuine leather jacket with premium finish', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', isFeatured: true }],
      ['4', { id: '4', name: 'Black T-Shirt', category: 'shirt', price: 19.99, stock: 15, description: 'Casual cotton t-shirt for everyday wear', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', isNew: true }],
      ['5', { id: '5', name: 'Winter Jacket', category: 'jacket', price: 89.99, stock: 3, description: 'Warm winter jacket with insulation', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80' }],
      ['6', { id: '6', name: 'Cargo Pants', category: 'jeans', price: 39.99, stock: 12, description: 'Utility cargo pants with multiple pockets', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', isNew: true }],
      ['7', { id: '7', name: 'Striped Polo Shirt', category: 'shirt', price: 34.99, stock: 20, description: 'Classic striped polo shirt', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80', isNew: true }],
      ['8', { id: '8', name: 'Bomber Jacket', category: 'jacket', price: 99.99, stock: 7, description: 'Stylish bomber jacket for casual wear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80' }],
      ['9', { id: '9', name: 'Skinny Jeans', category: 'jeans', price: 54.99, stock: 10, description: 'Modern skinny fit jeans', image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80' }],
      ['10', { id: '10', name: 'Leather Belt', category: 'accessories', price: 24.99, stock: 25, description: 'Premium leather belt', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80', isNew: true }],
      ['11', { id: '11', name: 'Designer Watch', category: 'accessories', price: 149.99, stock: 5, description: 'Elegant designer watch', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80', isFeatured: true }],
      ['12', { id: '12', name: 'Sunglasses', category: 'accessories', price: 79.99, stock: 15, description: 'UV protection sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80' }],
      ['13', { id: '13', name: 'Formal Shirt', category: 'shirt', price: 44.99, stock: 18, description: 'Professional formal shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80' }],
      ['14', { id: '14', name: 'Denim Jacket', category: 'jacket', price: 69.99, stock: 9, description: 'Classic denim jacket', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80', isNew: true }],
      ['15', { id: '15', name: 'Chino Pants', category: 'jeans', price: 42.99, stock: 14, description: 'Comfortable chino pants', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80' }],
    ]);
  }

  // Atomic operation with mutex lock to prevent race conditions
  async acquireLock(productId: string): Promise<void> {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        if (!this.locks.get(productId)) {
          this.locks.set(productId, true);
          resolve();
        } else {
          // Queue the request to prevent starvation
          this.requestQueue.push(tryAcquire);
          setTimeout(() => {
            const index = this.requestQueue.indexOf(tryAcquire);
            if (index > -1) {
              this.requestQueue.splice(index, 1);
              tryAcquire();
            }
          }, 50);
        }
      };
      tryAcquire();
    });
  }

  releaseLock(productId: string): void {
    this.locks.set(productId, false);
    // Process next request in queue (fairness)
    if (this.requestQueue.length > 0) {
      const next = this.requestQueue.shift();
      if (next) setTimeout(next, 0);
    }
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProduct(id: string): Product | undefined {
    return this.products.get(id);
  }

  // Atomic stock update
  async updateStock(productId: string, quantity: number): Promise<boolean> {
    await this.acquireLock(productId);
    try {
      const product = this.products.get(productId);
      if (!product || product.stock < quantity) {
        return false;
      }
      product.stock -= quantity;
      this.products.set(productId, { ...product });
      return true;
    } finally {
      this.releaseLock(productId);
    }
  }
}

// Simulated API service with concurrency handling
class ClothStoreAPI {
  private db: InventoryDatabase;
  private orders: Map<string, Order> = new Map();
  private eventListeners: Map<string, Array<(order: Order) => void>> = new Map();
  private testimonials: Testimonial[] = [
    { id: '1', name: 'Sarah Johnson', rating: 5, comment: 'Amazing quality! The shirts fit perfectly and the fabric is so comfortable.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', date: '2024-01-15' },
    { id: '2', name: 'Mike Chen', rating: 5, comment: 'Fast shipping and great customer service. Will definitely order again!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', date: '2024-01-10' },
    { id: '3', name: 'Emma Davis', rating: 4, comment: 'Love the collection! Stylish and affordable.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', date: '2024-01-08' },
    { id: '4', name: 'John Smith', rating: 5, comment: 'Best online clothing store! High quality products at reasonable prices.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', date: '2024-01-05' },
  ];

  constructor() {
    this.db = new InventoryDatabase();
  }

  // Non-blocking product fetch
  async getProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(this.db.getAllProducts());
      }, 300);
    });
  }

  // Non-blocking checkout with atomic stock validation
  async checkout(items: CartItem[], paymentMethod: 'credit-card' | 'paypal' | 'cash-on-delivery'): Promise<{ success: boolean; orderId?: string; message: string }> {
    return new Promise(async (resolve) => {
      // Simulate processing delay
      await new Promise(r => setTimeout(r, 500));

      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Atomic stock validation and update
      const stockUpdates: Array<{ productId: string; quantity: number }> = [];
      
      for (const item of items) {
        const success = await this.db.updateStock(item.product.id, item.quantity);
        if (!success) {
          // Rollback previous updates
          for (const update of stockUpdates) {
            await this.db.updateStock(update.productId, -update.quantity);
          }
          resolve({ success: false, message: `Insufficient stock for ${item.product.name}` });
          return;
        }
        stockUpdates.push({ productId: item.product.id, quantity: item.quantity });
      }

      const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const order: Order = {
        id: orderId,
        items,
        total,
        status: 'pending',
        timestamp: Date.now(),
        paymentStatus: 'pending',
        paymentMethod
      };

      this.orders.set(orderId, order);
      resolve({ success: true, orderId, message: 'Order created successfully' });
    });
  }

  // Event-driven payment processing
  async processPayment(orderId: string): Promise<PaymentResponse> {
    return new Promise((resolve) => {
      const order = this.orders.get(orderId);
      if (!order) {
        resolve({ success: false, message: 'Order not found' });
        return;
      }

      // Update order status
      order.status = 'processing';
      this.orders.set(orderId, { ...order });
      this.emitOrderEvent(orderId, order);

      // Simulate async payment gateway (non-blocking)
      setTimeout(() => {
        // 90% success rate simulation
        const success = Math.random() > 0.1;
        const transactionId = success ? `TXN-${Date.now()}` : undefined;

        order.paymentStatus = success ? 'success' : 'failed';
        order.status = success ? 'completed' : 'failed';
        this.orders.set(orderId, { ...order });

        // Emit event for order status change
        this.emitOrderEvent(orderId, order);

        resolve({
          success,
          transactionId,
          message: success ? 'Payment successful' : 'Payment failed'
        });
      }, 2000);
    });
  }

  // Event-driven programming: Subscribe to order updates
  onOrderUpdate(orderId: string, callback: (order: Order) => void): () => void {
    if (!this.eventListeners.has(orderId)) {
      this.eventListeners.set(orderId, []);
    }
    this.eventListeners.get(orderId)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(orderId);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      }
    };
  }

  private emitOrderEvent(orderId: string, order: Order): void {
    const listeners = this.eventListeners.get(orderId);
    if (listeners) {
      listeners.forEach(callback => callback(order));
    }
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }
}

// Singleton instance
export const api = new ClothStoreAPI();