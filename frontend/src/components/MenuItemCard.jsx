import { useCart } from '../context/CartContext.jsx';
import './MenuItemCard.css';

export default function MenuItemCard({ item }) {
  const { addItem } = useCart();

  return (
    <article className="item-card">
      <div className="item-card__media">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} loading="lazy" />
        ) : (
          <div className="item-card__placeholder" aria-hidden="true">
            {item.name.charAt(0)}
          </div>
        )}
        <span className={`item-card__dot ${item.is_veg ? 'is-veg' : 'is-meat'}`} title={item.is_veg ? 'Vegetarian' : 'Non-vegetarian'} />
      </div>

      <div className="item-card__body">
        <div className="item-card__top">
          <h3>{item.name}</h3>
          <span className="item-card__price">Rs {Number(item.price).toFixed(0)}</span>
        </div>
        {item.description && <p className="item-card__desc">{item.description}</p>}
        <button className="btn btn-primary item-card__add" onClick={() => addItem(item)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
