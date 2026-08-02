import MenuItemCard from './MenuItemCard.jsx';
import './MenuGrid.css';

export default function MenuGrid({ items, isLoading, error }) {
  if (isLoading) {
    return <p className="menu-grid__status">Loading the menu…</p>;
  }
  if (error) {
    return (
      <p className="menu-grid__status menu-grid__status--error">
        Couldn't load the menu: {error}
      </p>
    );
  }
  if (items.length === 0) {
    return <p className="menu-grid__status">No dishes here yet — check another category.</p>;
  }

  return (
    <div className="menu-grid">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
