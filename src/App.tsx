import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import { Order } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

function AppContent() {
  const {
    products,
    testimonials,
    cart,
    loading,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    processPayment,
    subscribeToOrder,
    loadProducts
  } = useStore();

  const navigate = useNavigate();
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);

  const handleCheckout = async () => {
    const order = await checkout('credit-card');
    if (order) {
      setCheckoutOrder(order);
      navigate('/checkout');
    }
  };

  const handleNewOrder = () => {
    setCheckoutOrder(null);
    navigate('/');
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header cartCount={cartCount} />
      
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                products={products} 
                testimonials={testimonials}
                onAddToCart={addToCart}
              />
            } 
          />
          <Route 
            path="/shop" 
            element={
              <ShopPage 
                products={products}
                onAddToCart={addToCart}
              />
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProductsPage 
                products={products}
                onAddToCart={addToCart}
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <CartPage 
                cart={cart}
                cartTotal={cartTotal}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                onCheckout={handleCheckout}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <CheckoutPage 
                order={checkoutOrder}
                onProcessPayment={processPayment}
                onSubscribeToOrder={subscribeToOrder}
                onNewOrder={handleNewOrder}
              />
            } 
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;