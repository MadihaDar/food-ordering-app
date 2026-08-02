import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="container confirm-empty">
        <p>No recent order found.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="container confirm">
      <div className="token-card">
        <div className="token-card__perforation" aria-hidden="true" />
        <span className="eyebrow">Order confirmed</span>
        <p className="token-card__label">Your token number</p>
        <p className="token-card__number">{String(state.token_number).padStart(3, '0')}</p>
        <p className="token-card__note">
          Show this number if you call to check on your order. We'll text you when it's on the way.
        </p>
        <div className="token-card__divider" />
        <div className="token-card__row">
          <span>Total paid on delivery</span>
          <span>Rs {Number(state.total).toFixed(0)}</span>
        </div>
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Order something else
      </button>
    </div>
  );
}
