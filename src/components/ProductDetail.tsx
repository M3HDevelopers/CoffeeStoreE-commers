import React from 'react';
import { Product } from '../data/products';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-stone-100 transition-colors"
        >
          <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover md:rounded-l-3xl"
            />
          </div>
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="mb-1">
              <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">{product.category}</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-1">{product.name}</h2>
            <p className="text-stone-500 text-sm mb-4">{product.origin} · {product.weight}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-stone-200'} fill-current`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-stone-500">{product.rating}</span>
            </div>

            <p className="text-stone-600 text-sm leading-relaxed mb-5">{product.description}</p>

            <div className="mb-5">
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Tasting Notes</h4>
              <div className="flex flex-wrap gap-2">
                {product.notes.map((note, i) => (
                  <span key={i} className="bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full border border-amber-100">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Roast Level</h4>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {['Light', 'Medium', 'Dark'].map((level, i) => (
                    <div
                      key={level}
                      className={`w-8 h-3 rounded-full ${
                        product.roast.includes('Light') && i === 0 ? 'bg-amber-400' :
                        product.roast === 'Medium' && i <= 1 ? 'bg-amber-600' :
                        product.roast === 'Light-Medium' && i <= 1 ? 'bg-amber-500' :
                        product.roast.includes('Dark') && i <= 2 ? 'bg-amber-800' :
                        'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-stone-600">{product.roast}</span>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-amber-800">${product.price.toFixed(2)}</span>
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-stone-800 border-x border-stone-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="w-full py-3 bg-amber-800 text-white font-medium rounded-xl hover:bg-amber-900 transition-colors shadow-lg shadow-amber-800/20"
              >
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
