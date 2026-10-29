import React, { useState } from 'react';
import { Product, products } from '../data/products';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart, isWishlisted, onToggleWishlist, onViewProduct }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedBrew, setSelectedBrew] = useState(product.brewingMethods[0]);
  const [activeTab, setActiveTab] = useState<'description' | 'brewing' | 'reviews'>('description');

  const relatedProducts = products.filter(p => p.id !== product.id && (p.category === product.category || p.roast === product.roast)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-stone-100 transition-all hover:rotate-90 duration-300"
        >
          <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 md:h-full object-cover md:rounded-l-3xl"
            />
            {product.bestSeller && (
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  ⭐ Best Seller
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full">{product.category}</span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500">{product.weight}</span>
            </div>

            <h2 className="text-2xl font-bold text-stone-800 mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-stone-200'} fill-current`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-700">{product.rating}</span>
              <span className="text-sm text-stone-400">({product.reviews} reviews)</span>
            </div>

            <p className="text-stone-600 text-sm leading-relaxed mb-5">{product.description}</p>

            {/* Tasting Notes */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Tasting Notes</h4>
              <div className="flex flex-wrap gap-2">
                {product.notes.map((note, i) => (
                  <span key={i} className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 text-sm px-3 py-1.5 rounded-full border border-amber-100 font-medium">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Flavor Profile */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Intensity</div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < product.intensity ? 'bg-amber-700' : 'bg-stone-200'}`} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Acidity</div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < product.acidity ? 'bg-amber-500' : 'bg-stone-200'}`} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Body</div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < product.body ? 'bg-amber-900' : 'bg-stone-200'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-5 border-b border-stone-200">
              <div className="flex gap-4">
                {(['description', 'brewing', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium capitalize transition-colors relative ${
                      activeTab === tab ? 'text-amber-800' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 min-h-[80px]">
              {activeTab === 'description' && (
                <div className="text-sm text-stone-600 space-y-2">
                  <p><span className="font-semibold text-stone-700">Origin:</span> {product.origin}</p>
                  <p><span className="font-semibold text-stone-700">Roast Level:</span> {product.roast}</p>
                  <p><span className="font-semibold text-stone-700">Process:</span> Washed</p>
                  <p><span className="font-semibold text-stone-700">Altitude:</span> 1,800 - 2,200m</p>
                </div>
              )}
              {activeTab === 'brewing' && (
                <div>
                  <p className="text-xs text-stone-500 mb-2">Recommended brewing methods:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.brewingMethods.map(method => (
                      <button
                        key={method}
                        onClick={() => setSelectedBrew(method)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedBrew === method
                            ? 'bg-amber-800 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 mt-3">
                    💡 For {selectedBrew}, use a 1:16 ratio and water at {product.roast.includes('Light') ? '96°C' : product.roast === 'Medium' ? '93°C' : '90°C'}
                  </p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="bg-stone-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800">S</div>
                      <span className="text-xs font-semibold text-stone-700">Sarah M.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600">Absolutely love this coffee! The flavor notes are spot on. Will definitely order again.</p>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">J</div>
                      <span className="text-xs font-semibold text-stone-700">James K.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400' : 'text-stone-200'} fill-current`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600">Great quality beans. Fresh roast and amazing aroma when you open the bag.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Actions */}
            <div className="border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-amber-800">${product.price.toFixed(2)}</span>
                  <span className="text-sm text-stone-400 ml-2">/ {product.weight}</span>
                </div>
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600 font-medium"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-stone-800 border-x border-stone-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600 font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-800 to-amber-700 text-white font-semibold rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-lg shadow-amber-800/20 active:scale-[0.98]"
                >
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </button>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all ${
                    isWishlisted ? 'border-red-200 bg-red-50' : 'border-stone-200 hover:border-red-200 hover:bg-red-50'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-stone-400'}`}
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-6 pt-5 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">You might also like</h4>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {relatedProducts.map(rp => (
                    <button
                      key={rp.id}
                      onClick={() => onViewProduct(rp)}
                      className="flex-shrink-0 flex items-center gap-2 bg-stone-50 hover:bg-stone-100 rounded-lg p-2 pr-3 transition-colors"
                    >
                      <img src={rp.image} alt={rp.name} className="w-10 h-10 rounded-md object-cover" />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-stone-700 truncate w-20">{rp.name}</p>
                        <p className="text-xs text-amber-700 font-bold">${rp.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
