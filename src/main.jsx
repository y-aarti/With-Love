import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import CardLayout from './components/CardLayout.jsx';
import './styles.css';

const occasions = [
  {
    id: 'birthday',
    label: 'Birthday',
    cards: [
      { id: 'BDAY-001', title: 'Happy Birthday', caption: 'A little more magic' },
      { id: 'BDAY-002', title: 'Happy Birthday Bestie', caption: 'For your favorite person' },
    ],
  },
  { id: 'anniversary', label: 'Anniversary', cards: [{ id: 'ANN-001', title: 'STILL US', caption: 'And always will be' }] },
  { id: 'wedding', label: 'Wedding', cards: [{ id: 'WED-001', title: 'THE HAPPY COUPLE', caption: 'So happy for you' }] },
  { id: 'religious', label: 'Religious', cards: [{ id: 'REL-001', title: 'HANUMANJI BLESSINGS', caption: 'May Hanumanji bless you' }] },
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const baseUrl = import.meta.env.BASE_URL;
const appPath = window.location.pathname.startsWith(baseUrl)
  ? `/${window.location.pathname.slice(baseUrl.length)}`
  : window.location.pathname;
const route = appPath.match(/^\/cards\/([^/]+)\/([^/]+)\/?$/);
const routeOccasion = route && occasions.find(({ id }) => id === route[1]);
const cardPage = routeOccasion?.cards.find(({ title }) => slugify(title) === route?.[2]);

function App() {
  const [activeId, setActiveId] = useState(routeOccasion?.id ?? 'birthday');
  const activeOccasion = occasions.find(({ id }) => id === activeId) ?? occasions[0];

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href={baseUrl}>with<span>love</span><i>®</i></a>
      </header>

      {cardPage && routeOccasion ? (
        <CardLayout />
      ) : (
        <main className="home-page">
          <section className="intro">
            <p className="eyebrow">A little something, made with love</p>
            <h1>Make their day <em>special</em></h1>
            <p className="intro-copy">Choose a card to share a moment that matters.</p>
          </section>

          <nav className="occasion-tabs" aria-label="Card occasions">
            {occasions.map(({ id, label }) => (
              <button
                type="button"
                className={`occasion-tab${activeId === id ? ' active' : ''}`}
                aria-pressed={activeId === id}
                key={id}
                onClick={() => setActiveId(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="card-grid" aria-label={`${activeOccasion.label} cards`}>
            {activeOccasion.cards.map(({ id, title, caption }) => (
              <a
                className="greeting-card"
                href={`${baseUrl}cards/${activeOccasion.id}/${slugify(title)}`}
                key={id}
              >
                <span className="card-id">{id}</span>
                <span className="card-title">{title}</span>
                <span className="card-caption">{caption}</span>
              </a>
            ))}
          </section>

          <footer><span>Made with <span className="footer-heart">♥</span> for your favorite people</span></footer>
        </main>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
