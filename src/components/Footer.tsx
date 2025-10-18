import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ClothStore</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for premium quality clothing at affordable prices.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/shop?category=shirt" className="hover:text-white transition-colors">Shirts</Link></li>
              <li><Link to="/shop?category=jeans" className="hover:text-white transition-colors">Jeans</Link></li>
              <li><Link to="/shop?category=jacket" className="hover:text-white transition-colors">Jackets</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@clothstore.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Fashion Street, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 ClothStore. All rights reserved. | Built with concurrency-safe architecture</p>
        </div>
      </div>
    </footer>
  );
}
