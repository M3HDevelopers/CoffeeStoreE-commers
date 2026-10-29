import React from 'react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-stone-100 relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.bestSeller && (
          <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wide">
            Best Seller
          </span>
        )}
        {product.newArrival && (
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wide">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 transition-all duration-300"
        aria-label="Add to wishlist"
      >
        <svg
          className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-current scale-110' : 'text-stone-400'}`}
          viewBox="0 0 24 24"
          fill={isWishlisted ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative overflow-hidden aspect-square cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick View Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => onViewDetails(product)}
            className="bg-white/95 backdrop-blur-sm text-stone-800 px-5 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-white transition-colors"
          >
            Quick View
          </button>
        </div>

        {/* Roast Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/50">
            {product.roast} Roast
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-bold text-stone-800 text-base leading-tight truncate">{product.name}</h3>
            <p className="text-stone-500 text-xs mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product.origin}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-amber-800">${product.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-stone-200'} fill-current`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
          <span className="text-xs text-stone-500 font-medium">{product.rating}</span>
          <span className="text-xs text-stone-400">({product.reviews})</span>
        </div>

        {/* Notes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.notes.slice(0, 3).map((note, i) => (
            <span key={i} className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-100 font-medium">
              {note}
            </span>
          ))}
        </div>

        {/* Actions */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-md shadow-amber-800/10 hover:shadow-lg hover:shadow-amber-800/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
