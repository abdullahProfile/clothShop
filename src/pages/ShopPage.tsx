import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';

interface ShopPageProps {
  products?: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function ShopPage({ products = [], onAddToCart = () => {} }: ShopPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name' | 'newest'>('newest');

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'shirt', name: 'Shirts', icon: '👕' },
    { id: 'jeans', name: 'Jeans', icon: '👖' },
    { id: 'jacket', name: 'Jackets', icon: '🧥' },
    { id: 'accessories', name: 'Accessories', icon: '⌚' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-gray-600">Browse our complete collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Categories</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Min: ${priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max: ${priceRange.max}</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No products found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                      {product.isNew && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          NEW
                        </div>
                      )}
                      {product.isFeatured && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                          <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                        </div>
                        <button
                          onClick={() => onAddToCart(product)}
                          disabled={product.stock === 0}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            product.stock === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
