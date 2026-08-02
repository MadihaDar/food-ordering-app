import { useCart } from '../context/CartContext.jsx';

export default function CartItemRow({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="chit__row">
      <div className="chit__row-main">
        <span className="chit__row-name">{item.name}</span>
        <span className="chit__row-price">Rs {(item.price * item.quantity).toFixed(0)}</span>
      </div>
      <div className="chit__row-controls">
        <button aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
          −
        </button>
        <span>{item.quantity}</span>
        <button aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          +
        </button>
        <button className="chit__row-remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}
