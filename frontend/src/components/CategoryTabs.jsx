import './CategoryTabs.css';

export default function CategoryTabs({ categories, active, onSelect }) {
  return (
    <div className="cat-tabs" role="tablist" aria-label="Menu categories">
      <button
        className={`cat-tabs__tab ${!active ? 'is-active' : ''}`}
        onClick={() => onSelect(null)}
        role="tab"
        aria-selected={!active}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          className={`cat-tabs__tab ${active === c.slug ? 'is-active' : ''}`}
          onClick={() => onSelect(c.slug)}
          role="tab"
          aria-selected={active === c.slug}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
