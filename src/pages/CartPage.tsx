import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartPageProps {
  cart?: CartItem[];
  cartTotal?: number;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveFromCart?: (productId: string) => void;
  onCheckout?: () => void;
}

export default function CartPage({
  cart = [],
  cartTotal = 0,
  onUpdateQuantity = () => {},
  onRemoveFromCart = () => {},
  onCheckout = () => {}
}: CartPageProps) {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md divide-y">
                {cart.map(item => (
                  <div key={item.product.id} className="p-6 flex flex-col sm:flex-row items-center gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-32 h-32 object-cover rounded-lg" 
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                      <p className="text-gray-600 mb-2">{item.product.description}</p>
                      <p className="text-lg font-bold text-blue-600">${item.product.price} each</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 shadow-sm"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 shadow-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (estimated)</span>
                    <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/shop"
                  className="block text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
