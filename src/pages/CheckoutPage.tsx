import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

interface CheckoutPageProps {
  order?: Order | null;
  onProcessPayment?: (orderId: string) => Promise<any>;
  onSubscribeToOrder?: (orderId: string, callback: (order: Order) => void) => () => void;
  onNewOrder?: () => void;
}

export default function CheckoutPage({
  order = null,
  onProcessPayment = async () => {},
  onSubscribeToOrder = () => () => {},
  onNewOrder = () => {}
}: CheckoutPageProps) {
  const navigate = useNavigate();
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(order);
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal' | 'cash-on-delivery'>('credit-card');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!order) {
      navigate('/cart');
    } else {
      setCheckoutOrder(order);
    }
  }, [order, navigate]);

  useEffect(() => {
    if (checkoutOrder) {
      const unsubscribe = onSubscribeToOrder(checkoutOrder.id, (updatedOrder) => {
        setCheckoutOrder(updatedOrder);
        if (updatedOrder.status === 'completed' || updatedOrder.status === 'failed') {
          setPaymentProcessing(false);
        }
      });
      return unsubscribe;
    }
  }, [checkoutOrder, onSubscribeToOrder]);

  const handlePayment = async () => {
    if (!checkoutOrder) return;
    
    setPaymentProcessing(true);
    setPaymentResult(null);
    
    const result = await onProcessPayment(checkoutOrder.id);
    setPaymentResult(result);
  };

  if (!checkoutOrder) return null;

  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: '💳', description: 'Pay securely with your credit card' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Fast and secure PayPal checkout' },
    { id: 'cash-on-delivery', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {checkoutOrder.items.map(item => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">${checkoutOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span className="font-semibold">${(checkoutOrder.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${(checkoutOrder.total * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    disabled={checkoutOrder.status !== 'pending'}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${checkoutOrder.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{method.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  checkoutOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                  checkoutOrder.status === 'failed' ? 'bg-red-100 text-red-800' :
                  checkoutOrder.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Status: {checkoutOrder.status.toUpperCase()}
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  checkoutOrder.paymentStatus === 'success' ? 'bg-green-100 text-green-800' :
                  checkoutOrder.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Payment: {checkoutOrder.paymentStatus.toUpperCase()}
                </div>
              </div>

              {paymentResult && (
                <div className={`mb-4 p-4 rounded-lg ${
                  paymentResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-semibold ${paymentResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {paymentResult.message}
                  </p>
                  {paymentResult.success && (
                    <p className="text-green-700 text-sm mt-1">Order ID: {checkoutOrder.id}</p>
                  )}
                </div>
              )}

              {checkoutOrder.status === 'pending' && !paymentProcessing && (
                <button
                  onClick={handlePayment}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Complete Payment
                </button>
              )}

              {paymentProcessing && (
                <div className="w-full px-6 py-4 bg-gray-300 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700"></div>
                  Processing Payment...
                </div>
              )}

              {(checkoutOrder.status === 'completed' || checkoutOrder.status === 'failed') && (
                <button
                  onClick={onNewOrder}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Place New Order
                </button>
              )}
            </div>

            {/* Concurrency Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🔒 Concurrency Features</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ <strong>Atomic Operations:</strong> Stock updates use mutex locks</li>
                <li>✓ <strong>Non-Blocking I/O:</strong> Async payment processing</li>
                <li>✓ <strong>Event-Driven:</strong> Real-time order status updates</li>
                <li>✓ <strong>Race Condition Prevention:</strong> Thread-safe inventory</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
