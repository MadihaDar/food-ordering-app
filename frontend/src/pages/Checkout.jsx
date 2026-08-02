import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../services/api.js';
import './Checkout.css';

const DELIVERY_FEE = 100;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    order_type: 'delivery',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const deliveryFee = form.order_type === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await api.placeOrder({
        ...form,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      });
      clearCart();
      navigate('/order-confirmation', { state: result });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container checkout-empty">
        <p>Your cart is empty — add something from the menu before checking out.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="container checkout">
      <h1>Checkout</h1>
      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              required
              value={form.customer_name}
              onChange={(e) => update('customer_name', e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label>
            Phone number
            <input
              required
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="03xx xxxxxxx"
            />
          </label>

          <fieldset className="checkout__order-type">
            <legend>Order type</legend>
            <label className="checkout__radio">
              <input
                type="radio"
                name="order_type"
                checked={form.order_type === 'delivery'}
                onChange={() => update('order_type', 'delivery')}
              />
              Delivery (+Rs {DELIVERY_FEE})
            </label>
            <label className="checkout__radio">
              <input
                type="radio"
                name="order_type"
                checked={form.order_type === 'pickup'}
                onChange={() => update('order_type', 'pickup')}
              />
              Pickup (free)
            </label>
          </fieldset>

          {form.order_type === 'delivery' && (
            <label>
              Delivery address
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="House, street, area"
              />
            </label>
          )}

          <label>
            Notes for the kitchen (optional)
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="e.g. less spicy, no onions"
            />
          </label>

          {error && <p className="checkout__error">{error}</p>}

          <button className="btn btn-primary checkout__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Placing order…' : `Place order · Rs ${total.toFixed(0)}`}
          </button>
        </form>

        <aside className="checkout__summary">
          <span className="eyebrow">Order summary</span>
          {items.map((i) => (
            <div key={i.id} className="checkout__summary-row">
              <span>
                {i.quantity} × {i.name}
              </span>
              <span>Rs {(i.price * i.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className="checkout__divider" />
          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <span>Rs {subtotal.toFixed(0)}</span>
          </div>
          <div className="checkout__summary-row">
            <span>Delivery fee</span>
            <span>Rs {deliveryFee.toFixed(0)}</span>
          </div>
          <div className="checkout__summary-row checkout__summary-total">
            <span>Total</span>
            <span>Rs {total.toFixed(0)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
