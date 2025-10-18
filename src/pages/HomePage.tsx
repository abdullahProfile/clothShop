import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Testimonial } from '../types';

interface HomePageProps {
  products?: Product[];
  testimonials?: Testimonial[];
  onAddToCart?: (product: Product) => void;
}

export default function HomePage({ 
  products = [], 
  testimonials = [],
  onAddToCart = () => {}
}: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: 'Summer Collection 2024',
      subtitle: 'Discover the latest trends',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
      cta: 'Shop Now'
    },
    {
      title: 'Premium Quality',
      subtitle: 'Crafted with excellence',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
      cta: 'Explore'
    },
    {
      title: 'Up to 50% Off',
      subtitle: 'Limited time offer',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
      cta: 'Get Deals'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                <Link
                  to="/shop"
                  className="inline-block px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600">Handpicked items just for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-gray-600">Check out our latest additions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Collection</h2>
          <p className="text-gray-600">Explore our curated collections</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Shirts', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', link: '/shop?category=shirt' },
            { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', link: '/shop?category=jeans' },
            { name: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', link: '/shop?category=jacket' },
            { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80', link: '/shop?category=accessories' }
          ].map((collection, index) => (
            <Link
              key={index}
              to={collection.link}
              className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <img src={collection.image} alt={collection.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end">
                <h3 className="text-white text-2xl font-bold p-6">{collection.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real reviews from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {'⭐'.repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Upgrade Your Wardrobe?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers shopping with us</p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
}
