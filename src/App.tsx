import React, { useState, useMemo } from 'react';
import { products, categories, roastLevels, sortOptions, Product } from './data/products';
import { CartItem, WishlistItem } from './types/cart';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesRoast = selectedRoast === 'All' || product.roast === selectedRoast;
      return matchesSearch && matchesCategory && matchesRoast;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedRoast, sortBy]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

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

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        showNotification(`${product.name} removed from wishlist`);
        return prev.filter(item => item.product.id !== product.id);
      } else {
        showNotification(`${product.name} added to wishlist ♥`);
        return [...prev, { product, addedAt: Date.now() }];
      }
    });
  };

  const isWishlisted = (productId: number) => wishlist.some(item => item.product.id === productId);

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      showNotification('Welcome to the Ember & Bloom family! ☕');
      setTimeout(() => setNewsletterSubmitted(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div className="bg-stone-800 text-white px-6 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center shadow-lg shadow-amber-800/20">
                <svg className="w-5 h-5 text-amber-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21V19H20V21H2ZM20 8V5H22V8C22 9.1 21.55 10.1 20.83 10.83C20.1 11.55 19.1 12 18 12H17.72C17.36 13.77 16.34 15.26 14.88 16.21C13.43 17.16 11.7 17.55 10 17.33C8.3 17.11 6.79 16.29 5.73 15C4.67 13.71 4.13 12.07 4.22 10.41C4.31 8.75 5.02 7.18 6.22 6.02C7.42 4.86 9.02 4.22 10.68 4.22H12V6.5H10.68C9.54 6.5 8.47 6.93 7.64 7.73C6.81 8.53 6.33 9.62 6.28 10.78C6.23 11.94 6.61 13.07 7.34 13.95C8.07 14.83 9.1 15.38 10.22 15.5C11.34 15.62 12.46 15.3 13.34 14.61C14.22 13.92 14.8 12.93 14.95 11.82L15.11 10.5H18C18.57 10.5 19.07 10.29 19.44 9.94C19.81 9.59 20 9.07 20 8.5V8Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-stone-800 leading-tight">Ember & Bloom</h1>
                <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] hidden sm:block">Specialty Coffee Roasters</p>
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

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors"
              >
                <svg className={`w-5 h-5 ${wishlistCount > 0 ? 'text-red-500 fill-current' : 'text-stone-600'}`} fill={wishlistCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-gradient-to-r from-amber-800 to-amber-700 text-white px-4 py-2.5 rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-md shadow-amber-800/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-sm font-semibold hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-amber-800 text-xs font-bold rounded-full flex items-center justify-center shadow-md border-2 border-amber-800">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
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
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-amber-100 text-xs font-medium">Freshly roasted this week</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-[1.1]">
              Exceptional Coffee,<br />
              <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Thoughtfully Sourced</span>
            </h2>
            <p className="text-amber-100/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Discover our curated selection of single-origin and artisan blend coffees, roasted to perfection and delivered fresh to your door.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
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
                Subscribe & Save 15%
              </div>
            </div>
            <a href="#products" className="inline-flex items-center gap-2 bg-white text-amber-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-50 transition-colors shadow-xl">
              Shop Collection
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '15+', label: 'Origin Countries' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '24h', label: 'Roast to Ship' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-amber-800">{stat.value}</p>
                <p className="text-xs md:text-sm text-stone-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Filters & Sort */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-stone-800">Our Collection</h3>
              <p className="text-stone-500 text-sm mt-0.5">{filteredProducts.length} coffee{filteredProducts.length !== 1 ? 's' : ''} available</p>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:border-amber-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(selectedCategory !== 'All' || selectedRoast !== 'All') && (
                  <span className="w-2 h-2 bg-amber-600 rounded-full" />
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-4 space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-amber-800 text-white shadow-md'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Roast Level</label>
                <div className="flex flex-wrap gap-2">
                  {roastLevels.map(roast => (
                    <button
                      key={roast}
                      onClick={() => setSelectedRoast(roast)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedRoast === roast
                          ? 'bg-amber-800 text-white shadow-md'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {roast}
                    </button>
                  ))}
                </div>
              </div>
              {(selectedCategory !== 'All' || selectedRoast !== 'All') && (
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedRoast('All'); }}
                  className="text-xs text-amber-700 font-medium hover:text-amber-900 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={viewProduct}
                onAddToCart={(p) => addToCart(p)}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-stone-700 mb-2">No coffees found</h4>
            <p className="text-stone-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRoast('All'); }}
              className="px-5 py-2.5 bg-amber-800 text-white rounded-xl text-sm font-medium hover:bg-amber-900 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16">
            <h3 className="text-xl font-bold text-stone-800 mb-4">Recently Viewed</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentlyViewed.map(product => (
                <button
                  key={product.id}
                  onClick={() => viewProduct(product)}
                  className="flex-shrink-0 w-40 bg-white rounded-xl border border-stone-100 overflow-hidden hover:shadow-md transition-all text-left"
                >
                  <img src={product.image} alt={product.name} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-bold text-stone-800 truncate">{product.name}</p>
                    <p className="text-xs text-amber-700 font-bold mt-1">${product.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Brewing Guide Section */}
      <section className="bg-gradient-to-br from-stone-100 to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">The Art of Brewing</h3>
            <p className="text-stone-500 max-w-md mx-auto">Master your morning ritual with our expert brewing guides</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { method: 'Pour Over', time: '3-4 min', ratio: '1:16', icon: '☕', desc: 'Clean, bright cup with clarity' },
              { method: 'French Press', time: '4 min', ratio: '1:15', icon: '🫖', desc: 'Full body, rich and bold' },
              { method: 'Espresso', time: '25-30 sec', ratio: '1:2', icon: '⚡', desc: 'Intense, concentrated flavor' },
              { method: 'Cold Brew', time: '12-24 hrs', ratio: '1:8', icon: '🧊', desc: 'Smooth, low acidity, refreshing' }
            ].map((brew, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-stone-100 hover:shadow-lg transition-all group">
                <div className="text-3xl mb-3">{brew.icon}</div>
                <h4 className="font-bold text-stone-800 mb-1">{brew.method}</h4>
                <p className="text-xs text-stone-500 mb-3">{brew.desc}</p>
                <div className="flex gap-3 text-xs">
                  <span className="text-amber-700 font-semibold">⏱ {brew.time}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-amber-700 font-semibold">⚖ {brew.ratio}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-amber-900 to-stone-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 mb-4">
              <span className="text-amber-200 text-xs font-medium">☕ Join 50,000+ coffee lovers</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Get 10% Off Your First Order</h3>
            <p className="text-amber-100/70 text-sm mb-6">Subscribe for brewing tips, new arrivals, and exclusive offers delivered to your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-amber-200/50 focus:bg-white/20 focus:border-amber-300 outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-amber-900 font-bold rounded-xl hover:bg-amber-50 transition-colors shadow-lg text-sm"
              >
                {newsletterSubmitted ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
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
              <h4 className="text-white font-semibold mb-4 text-sm">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">All Coffee</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Single Origin</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Blends</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Subscriptions</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Brewing Guides</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Our Story</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Sustainability</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Blog</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>hello@emberandbloom.co</li>
                <li>+1 (555) 234-5678</li>
                <li>Mon-Fri: 8am - 6pm EST</li>
              </ul>
              <div className="flex gap-3 mt-4">
                {['instagram', 'twitter', 'facebook'].map(social => (
                  <span key={social} className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-800 transition-colors cursor-pointer">
                    <span className="text-xs text-stone-400 capitalize">{social[0].toUpperCase()}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs">© 2026 Ember & Bloom. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <span className="hover:text-amber-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-amber-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-amber-400 cursor-pointer transition-colors">Shipping</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          isWishlisted={isWishlisted(selectedProduct.id)}
          onToggleWishlist={toggleWishlist}
          onViewProduct={viewProduct}
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

      {/* Wishlist Sidebar */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsWishlistOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-stone-50 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 bg-white border-b border-stone-200">
              <div>
                <h2 className="text-xl font-bold text-stone-800">Wishlist</h2>
                <p className="text-xs text-stone-500 mt-0.5">{wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved</p>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-all hover:rotate-90 duration-300"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-stone-700 font-bold text-lg mb-1">Your wishlist is empty</p>
                  <p className="text-stone-500 text-sm mb-6">Save your favorite coffees for later</p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="px-6 py-2.5 bg-amber-800 text-white rounded-xl font-medium hover:bg-amber-900 transition-colors shadow-md"
                  >
                    Browse Coffee
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map(item => (
                    <div key={item.product.id} className="bg-white rounded-xl p-3 shadow-sm border border-stone-100 flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-stone-800 text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-stone-500">{item.product.origin}</p>
                        <p className="text-sm font-bold text-amber-800 mt-1">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => addToCart(item.product)}
                          className="w-8 h-8 bg-amber-800 text-white rounded-lg flex items-center justify-center hover:bg-amber-900 transition-colors"
                          title="Add to cart"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleWishlist(item.product)}
                          className="w-8 h-8 bg-stone-100 text-stone-500 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
