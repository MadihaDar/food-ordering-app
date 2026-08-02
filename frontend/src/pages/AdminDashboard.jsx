import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuManager from '../components/admin/MenuManager.jsx';
import OrderManager from '../components/admin/OrderManager.jsx';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders');
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('zaiqa_admin_token');
    navigate('/admin/login');
  }

  return (
    <div className="admin-dash">
      <div className="container admin-dash__head">
        <h1>Admin dashboard</h1>
        <button className="btn btn-secondary" onClick={logout}>
          Log out
        </button>
      </div>

      <div className="container admin-dash__tabs">
        <button className={tab === 'orders' ? 'is-active' : ''} onClick={() => setTab('orders')}>
          Orders
        </button>
        <button className={tab === 'menu' ? 'is-active' : ''} onClick={() => setTab('menu')}>
          Menu
        </button>
      </div>

      <div className="container">{tab === 'orders' ? <OrderManager /> : <MenuManager />}</div>
    </div>
  );
}
