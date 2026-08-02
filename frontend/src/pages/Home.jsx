import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import CategoryTabs from '../components/CategoryTabs.jsx';
import MenuGrid from '../components/MenuGrid.jsx';
import './Home.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api
      .getMenu(activeCategory)
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [activeCategory]);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <span className="eyebrow">Lahore, on a plate</span>
          <h1>
            The taste of the old city, <br /> delivered to your door.
          </h1>
          <p>
            Karahi, BBQ, biryani and more — cooked to order, dispatched hot, and
            handed over with a token number, just like the counter at your
            favourite stall.
          </p>
          <a href="#menu" className="btn btn-primary">
            See today's menu
          </a>
        </div>
      </section>

      <section className="container" id="menu">
        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
        <MenuGrid items={items} isLoading={isLoading} error={error} />
      </section>

      <section className="about container" id="about">
        <div className="about__content">
          <h2>About Zaiqa</h2>
          <p>
            Zaiqa brings the authentic flavors of Lahore to your doorstep.
            From traditional karahi and BBQ to biryani and desserts, we serve
            freshly prepared meals inspired by the streets of the old city.
          </p>

          <p>
            Whether you're craving a family dinner or a quick meal with friends,
            Zaiqa makes ordering delicious food simple, fast, and reliable.
          </p>
        </div>
      </section>
    </>
  );
}
