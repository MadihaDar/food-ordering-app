import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import MenuItemForm from './MenuItemForm.jsx';

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  async function refresh() {
    setIsLoading(true);
    try {
      const [menuData, catData] = await Promise.all([api.getMenuAdmin(), api.getCategories()]);
      setItems(menuData);
      setCategories(catData);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(formData) {
    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, formData);
      } else {
        await api.addMenuItem(formData);
      }
      setEditingItem(null);
      setIsAdding(false);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Remove "${item.name}" from the menu?`)) return;
    try {
      await api.deleteMenuItem(item.id);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  if (isLoading) return <p>Loading menu items…</p>;

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Menu items</h2>
        {!isAdding && !editingItem && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + Add item
          </button>
        )}
      </div>

      {error && <p className="admin-panel__error">{error}</p>}

      {(isAdding || editingItem) && (
        <div className="admin-panel__form-wrap">
          <h3>{editingItem ? `Editing "${editingItem.name}"` : 'New item'}</h3>
          <MenuItemForm
            categories={categories}
            initialItem={editingItem}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Veg</th>
            <th>Available</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category_name}</td>
              <td>Rs {Number(item.price).toFixed(0)}</td>
              <td>{item.is_veg ? 'Yes' : 'No'}</td>
              <td>{item.is_available ? 'Yes' : 'No'}</td>
              <td className="admin-table__actions">
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setEditingItem(item);
                    setIsAdding(false);
                  }}
                >
                  Edit
                </button>
                <button className="btn-ghost" onClick={() => handleDelete(item)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
