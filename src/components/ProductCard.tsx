import React from 'react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100/50">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-amber-900/80 text-amber-50 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            {product.roast} Roast
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 text-amber-900 text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
            <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            {product.rating}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-stone-800 text-lg leading-tight">{product.name}</h3>
            <p className="text-stone-500 text-sm mt-0.5">{product.origin}</p>
          </div>
          <span className="text-lg font-bold text-amber-800">${product.price.toFixed(2)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.notes.map((note, i) => (
            <span key={i} className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-100">
              {note}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-amber-900 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-800 rounded-xl hover:bg-amber-900 transition-colors shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
