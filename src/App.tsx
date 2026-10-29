import React, { useState, useMemo } from 'react';
import { products, categories, Product } from './data/products';
import { CartItem } from './types/cart';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
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
    showNotification(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    showNotification('Order placed successfully! 🎉');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div className="bg-stone-800 text-white px-6 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-amber-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21V19H20V21H2ZM20 8V5H22V8C22 9.1 21.55 10.1 20.83 10.83C20.1 11.55 19.1 12 18 12H17.72C17.36 13.77 16.34 15.26 14.88 16.21C13.43 17.16 11.7 17.55 10 17.33C8.3 17.11 6.79 16.29 5.73 15C4.67 13.71 4.13 12.07 4.22 10.41C4.31 8.75 5.02 7.18 6.22 6.02C7.42 4.86 9.02 4.22 10.68 4.22H12V6.5H10.68C9.54 6.5 8.47 6.93 7.64 7.73C6.81 8.53 6.33 9.62 6.28 10.78C6.23 11.94 6.61 13.07 7.34 13.95C8.07 14.83 9.1 15.38 10.22 15.5C11.34 15.62 12.46 15.3 13.34 14.61C14.22 13.92 14.8 12.93 14.95 11.82L15.11 10.5H18C18.57 10.5 19.07 10.29 19.44 9.94C19.81 9.59 20 9.07 20 8.5V8Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-stone-800 leading-tight">Ember & Bloom</h1>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest hidden sm:block">Specialty Coffee</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search coffees, origins, flavors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-100 rounded-xl border border-transparent focus:border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-stone-700 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search coffees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 rounded-xl border border-transparent focus:border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-stone-700 placeholder:text-stone-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Exceptional Coffee,<br />
              <span className="text-amber-300">Thoughtfully Sourced</span>
            </h2>
            <p className="text-amber-100/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Discover our curated selection of single-origin and artisan blend coffees, roasted to perfection and delivered fresh to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-amber-100 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Freshly Roasted
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-amber-100 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free Shipping $35+
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-amber-100 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ethically Sourced
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-stone-800">Our Collection</h3>
            <p className="text-stone-500 text-sm mt-0.5">{filteredProducts.length} coffee{filteredProducts.length !== 1 ? 's' : ''} available</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-800/20'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300 hover:text-amber-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
                onAddToCart={(p) => addToCart(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-stone-700 mb-1">No coffees found</h4>
            <p className="text-stone-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21V19H20V21H2ZM20 8V5H22V8C22 9.1 21.55 10.1 20.83 10.83C20.1 11.55 19.1 12 18 12H17.72C17.36 13.77 16.34 15.26 14.88 16.21C13.43 17.16 11.7 17.55 10 17.33C8.3 17.11 6.79 16.29 5.73 15C4.67 13.71 4.13 12.07 4.22 10.41C4.31 8.75 5.02 7.18 6.22 6.02C7.42 4.86 9.02 4.22 10.68 4.22H12V6.5H10.68C9.54 6.5 8.47 6.93 7.64 7.73C6.81 8.53 6.33 9.62 6.28 10.78C6.23 11.94 6.61 13.07 7.34 13.95C8.07 14.83 9.1 15.38 10.22 15.5C11.34 15.62 12.46 15.3 13.34 14.61C14.22 13.92 14.8 12.93 14.95 11.82L15.11 10.5H18C18.57 10.5 19.07 10.29 19.44 9.94C19.81 9.59 20 9.07 20 8.5V8Z"/>
                  </svg>
                </div>
                <span className="text-white font-bold">Ember & Bloom</span>
              </div>
              <p className="text-sm leading-relaxed">Crafting exceptional coffee experiences since 2019. Every bean tells a story of dedication and passion.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Our Story</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Brewing Guides</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Subscription</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Wholesale</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>hello@emberandbloom.co</li>
                <li>+1 (555) 234-5678</li>
                <li>Mon-Fri: 8am - 6pm EST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-xs">
            <p>© 2026 Ember & Bloom. All rights reserved. Crafted with ♥ and great coffee.</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Sidebar */}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Checkout
          items={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
}

export default App;
