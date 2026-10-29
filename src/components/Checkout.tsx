import React, { useState } from 'react';
import { CartItem } from '../types/cart';

interface CheckoutProps {
  items: CartItem[];
  onClose: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onClose, onComplete }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState('monthly');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const discount = isSubscription ? subtotal * 0.15 : 0;
  const total = subtotal - discount + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onComplete}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Order Confirmed!</h2>
          <p className="text-stone-500 mb-1">Thank you for your order.</p>
          <p className="text-sm text-stone-400 mb-6">
            Order #EB-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
          {isSubscription && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 text-left">
              <p className="text-xs text-amber-800 font-semibold mb-1">☕ Subscription Active</p>
              <p className="text-xs text-amber-700">You'll receive this coffee every {subscriptionFrequency}. Save 15% on every order!</p>
            </div>
          )}
          <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left">
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-stone-600">{item.product.name} × {item.quantity}</span>
                  <span className="text-stone-800 font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {isSubscription && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Subscription discount (15%)</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between font-bold text-stone-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="w-full py-3 bg-gradient-to-r from-amber-800 to-amber-700 text-white font-bold rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Processing Payment</h2>
          <p className="text-stone-500 text-sm">Please wait while we process your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Steps */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-stone-100 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-stone-800">Checkout</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-all hover:rotate-90 duration-300"
            >
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: 'Cart' },
              { num: 2, label: 'Shipping' },
              { num: 3, label: 'Payment' }
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= s.num
                      ? 'bg-amber-800 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    {currentStep > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${currentStep >= s.num ? 'text-stone-800' : 'text-stone-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${currentStep > s.num ? 'bg-amber-800' : 'bg-stone-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Cart Review */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-800">Review Your Order</h3>
              
              {/* Subscription Toggle */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-amber-900">Subscribe & Save 15%</span>
                      <span className="text-[10px] bg-amber-700 text-white px-1.5 py-0.5 rounded-full font-bold">SAVE</span>
                    </div>
                    <p className="text-xs text-amber-700">Get fresh coffee delivered regularly. Cancel anytime.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSubscription(!isSubscription)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isSubscription ? 'bg-amber-700' : 'bg-stone-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isSubscription ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {isSubscription && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <label className="text-xs font-semibold text-amber-800 mb-2 block">Delivery frequency:</label>
                    <div className="flex gap-2">
                      {['weekly', 'biweekly', 'monthly'].map(freq => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setSubscriptionFrequency(freq)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                            subscriptionFrequency === freq
                              ? 'bg-amber-800 text-white'
                              : 'bg-white text-amber-800 border border-amber-200'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
                    <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-amber-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {isSubscription && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Subscription discount</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-medium'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-800 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full py-3 bg-gradient-to-r from-amber-800 to-amber-700 text-white font-bold rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-lg"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-800">Shipping Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="123 Coffee Street"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Seattle"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      placeholder="98101"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-800 to-amber-700 text-white font-bold rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-800">Payment Details</h3>
              <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-stone-500 mb-2">Order total:</p>
                <p className="text-2xl font-bold text-amber-800">${total.toFixed(2)}</p>
                {isSubscription && <p className="text-xs text-green-700 mt-1">✓ 15% subscription discount applied</p>}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">Expiry</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-800 to-amber-700 text-white font-bold rounded-xl hover:from-amber-900 hover:to-amber-800 transition-all shadow-lg"
                >
                  Place Order — ${total.toFixed(2)}
                </button>
              </div>
              <p className="text-xs text-center text-stone-400">
                🔒 This is a simulated checkout. No real payment will be processed.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
