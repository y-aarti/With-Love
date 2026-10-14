import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const occasions = [
  { id: 'birthday', name: 'Birthday', cards: [
    ['✳', 'MAKE A WISH', 'A little more magic'],
  ] },
  { id: 'anniversary', name: 'Anniversary', cards: [
    ['♡', 'STILL US', 'And always will be'],
  ] },
  { id: 'wedding', name: 'Wedding', cards: [
    ['♡', 'THE HAPPY COUPLE', 'So happy for you'],
  ] },
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function App() {
  const route = window.location.pathname.match(/^\/cards\/([^/]+)\/([^/]+)\/?$/);
  const routeOccasion = route && occasions.find(({ id }) => id === route[1]);
  const cardPage = routeOccasion?.cards.find(([, title]) => slugify(title) === route?.[2]);
  const [active, setActive] = useState(routeOccasion?.id ?? 'birthday');
  const [shareState, setShareState] = useState('');
  const occasion = occasions.find((item) => item.id === active);

  async function shareCard() {
    const shareData = { title: `${cardPage[1]} — WithLove`, text: `${occasion.name}: ${cardPage[2]}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareState('Link copied');
        window.setTimeout(() => setShareState(''), 2500);
      }
    } catch (error) {
      if (error.name !== 'AbortError') setShareState('Could not share this link');
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar"><a href="/" className="wordmark" aria-label="WithLove home">with<span>love</span><i>®</i></a></header>
      {cardPage && routeOccasion ? <main className="landing-page">
        <a className="back-link" href="/">← All cards</a>
        <section className="shared-card" aria-labelledby="shared-card-title">
          <p className="eyebrow">A {routeOccasion.name.toLowerCase()} card, with love</p>
          <div className="shared-card-paper">
            <span className="shared-card-label">A LITTLE NOTE FOR YOU</span>
            <h1 id="shared-card-title">{cardPage[1]}</h1>
            <p className="shared-card-caption">{cardPage[2]}</p>
            <span className="shared-card-heart" aria-hidden="true">♡</span>
            <p className="shared-card-message">{landingMessage(routeOccasion.id, cardPage[1], cardPage[2])}</p>
            <span className="shared-card-signoff">with love,</span>
          </div>
          <button className="share-button" onClick={shareCard}>Share this card <span aria-hidden="true">↗</span></button>
          <p className="share-status" aria-live="polite">{shareState}</p>
        </section>
        <footer><span>A little note goes a long way.</span><span className="footer-heart">♥</span></footer>
      </main> : <main id="home">
        <section className="intro">
          <p className="eyebrow">A reason to celebrate</p>
          <h1>Say it <em>with love.</em></h1>
          <p className="intro-copy">Find a little something for their big moment.</p>
        </section>
        <nav className="occasion-tabs" aria-label="Choose an occasion" role="tablist">
          {occasions.map((item) => (
            <button key={item.id} id={`tab-${item.id}`} className={`occasion-tab ${active === item.id ? 'active' : ''}`} role="tab" aria-selected={active === item.id} aria-controls="card-grid" onClick={() => setActive(item.id)}>
              {item.name}
            </button>
          ))}
        </nav>
        <section className="card-grid" id="card-grid" role="tabpanel" aria-labelledby={`tab-${occasion.id}`} key={occasion.id}>
          {occasion.cards.map(([, title, caption]) => (
            <a className="greeting-card" key={`${occasion.id}-${title}`} href={`/cards/${occasion.id}/${slugify(title)}`} aria-label={`${title}: ${caption}`}>
              <span className="card-title">{title}</span>
              <span className="card-caption">{caption}</span>
            </a>
          ))}
        </section>
        <footer><span>A little note goes a long way.</span><span className="footer-heart">♥</span></footer>
      </main>}
    </div>
  );
}

function landingMessage(occasionId, title, caption) {
  const opening = {
    birthday: `Today is all about celebrating you. ${caption} — may the year ahead bring you more joy, laughter, and little surprises.`,
    anniversary: `Every chapter with you is my favorite. ${caption} — thank you for all the love, laughter, and life we keep sharing.`,
    wedding: `Here’s to the beginning of a wonderful new chapter. ${caption} — wishing you a lifetime of laughter, kindness, and choosing each other.`,
  };
  return `${opening[occasionId]} ${title.toLowerCase()} — and always, with love.`;
}

createRoot(document.getElementById('root')).render(<App />);
