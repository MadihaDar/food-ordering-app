import { useEffect, useState } from 'react';

const emptyForm = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  image_url: '',
  is_veg: false,
  is_available: true,
};

export default function MenuItemForm({ categories, initialItem, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialItem) {
      setForm({
        category_id: initialItem.category_id,
        name: initialItem.name,
        description: initialItem.description || '',
        price: initialItem.price,
        image_url: initialItem.image_url || '',
        is_veg: !!initialItem.is_veg,
        is_available: !!initialItem.is_available,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialItem]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ ...form, category_id: Number(form.category_id), price: Number(form.price) });
  }

  return (
    <form className="menu-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
      </label>
      <label>
        Category
        <select
          required
          value={form.category_id}
          onChange={(e) => update('category_id', e.target.value)}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Description
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </label>
      <div className="menu-form__row">
        <label>
          Price (Rs)
          <input
            required
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
          />
        </label>
        <label>
          Image URL
          <input value={form.image_url} onChange={(e) => update('image_url', e.target.value)} />
        </label>
      </div>
      <div className="menu-form__checks">
        <label className="menu-form__check">
          <input
            type="checkbox"
            checked={form.is_veg}
            onChange={(e) => update('is_veg', e.target.checked)}
          />
          Vegetarian
        </label>
        <label className="menu-form__check">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => update('is_available', e.target.checked)}
          />
          Available on menu
        </label>
      </div>
      <div className="menu-form__actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary">{initialItem ? 'Save changes' : 'Add item'}</button>
      </div>
    </form>
  );
}
