import React from 'react';
import { CartItem } from '../types/cart';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, isOpen, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-stone-50 shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-stone-200">
          <div>
            <h2 className="text-xl font-bold text-stone-800">Shopping Cart</h2>
            <p className="text-xs text-stone-500 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-all hover:rotate-90 duration-300"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <p className="text-stone-700 font-bold text-lg mb-1">Your cart is empty</p>
              <p className="text-stone-500 text-sm mb-6">Add some delicious coffee to get started!</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-800 text-white rounded-xl font-medium hover:bg-amber-900 transition-colors shadow-md"
              >
                Browse Coffee
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-stone-800 text-sm leading-tight">{item.product.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors -mt-1 -mr-1 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-stone-500 text-xs mb-1">{item.product.weight} • {item.product.roast}</p>
                      <p className="text-amber-800 font-bold text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-amber-50 transition-colors text-stone-600 text-sm font-medium"
                      >
                        −
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-xs font-bold text-stone-800 border-x border-stone-200 bg-stone-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-amber-50 transition-colors text-stone-600 text-sm font-medium"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-stone-400">${item.product.price.toFixed(2)} each</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 bg-white p-6">
            {/* Free Shipping Progress */}
            {subtotal < 35 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-stone-600 font-medium">Add ${(35 - subtotal).toFixed(2)} for free shipping</span>
                  <span className="text-amber-700 font-bold">{Math.round((subtotal / 35) * 100)}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / 35) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-medium'}>
                  {shipping === 0 ? '✓ Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-stone-800 pt-3 border-t border-stone-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-amber-800 to-amber-700 text-white font-bold rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-lg shadow-amber-800/20 active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-center text-stone-400 mt-3">🔒 Secure checkout • Free returns</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
