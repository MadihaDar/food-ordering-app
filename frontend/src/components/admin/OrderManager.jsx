import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';

const STATUSES = ['pending', 'preparing', 'on_the_way', 'completed', 'cancelled'];
const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  on_the_way: 'On the way',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refresh() {
    setIsLoading(true);
    try {
      const data = await api.getOrders(statusFilter || undefined);
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleStatusChange(order, status) {
    try {
      await api.updateOrderStatus(order.id, status);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Orders</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="admin-panel__error">{error}</p>}
      {isLoading ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
        <p>No orders here yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{String(order.token_number).padStart(3, '0')}</td>
                <td>{order.customer_name}</td>
                <td>{order.phone}</td>
                <td>{order.order_type}</td>
                <td>Rs {Number(order.total).toFixed(0)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
