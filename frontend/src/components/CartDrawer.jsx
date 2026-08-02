import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItemRow from './CartItemRow.jsx';
import './CartDrawer.css';

export default function CartDrawer() {
  const { items, subtotal, isOpen, setIsOpen } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  function goToCheckout() {
    setIsOpen(false);
    navigate('/checkout');
  }

  return (
    <div className="drawer-backdrop" onClick={() => setIsOpen(false)}>
      <aside
        className="chit"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Your order"
      >
        <div className="chit__perforation" aria-hidden="true" />
        <div className="chit__content">
          <div className="chit__head">
            <span className="eyebrow">Your order</span>
            <button className="chit__close" onClick={() => setIsOpen(false)} aria-label="Close cart">
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <p className="chit__empty">Your token is empty — add something tasty from the menu.</p>
          ) : (
            <>
              <div className="chit__rows">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>

              <div className="chit__divider" aria-hidden="true" />

              <div className="chit__totals">
                <div className="chit__totals-row">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toFixed(0)}</span>
                </div>
                <p className="chit__note">Delivery fee calculated at checkout</p>
              </div>

              <button className="btn btn-primary chit__checkout" onClick={goToCheckout}>
                Go to checkout
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
