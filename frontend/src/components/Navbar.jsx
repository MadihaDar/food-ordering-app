import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-mark">ز</span>
          Zaiqa
        </Link>
        <nav className="navbar__links">
          <a href="/#menu">Menu</a>
          <a href="/#about">About</a>
        </nav>
        <button className="navbar__cart" onClick={() => setIsOpen(true)} aria-label="Open cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="21" r="1.4" fill="currentColor" />
            <circle cx="17" cy="21" r="1.4" fill="currentColor" />
          </svg>
          {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}
