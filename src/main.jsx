import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const occasions = [
  { id: 'birthday', name: 'Birthday', cards: [
    ['MAKE A WISH', 'A little more magic'],
    ['CAKE FIRST', 'Cake first, questions later'],
  ] },
  { id: 'anniversary', name: 'Anniversary', cards: [
    ['STILL US', 'And always will be'],
  ] },
  { id: 'wedding', name: 'Wedding', cards: [
    ['THE HAPPY COUPLE', 'So happy for you'],
  ] },
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function BirthdayCakeArt() {
  return <svg className="occasion-art" viewBox="0 0 180 130" role="img" aria-label="Birthday cake with a balloon">
    <path d="M125 18c-10 0-17 8-17 18 0 9 7 16 17 16s17-7 17-16c0-10-7-18-17-18Z" fill="#ef9da5" stroke="#bd727c" strokeWidth="2"/>
    <path d="M125 52c-1 10-5 16-8 22" fill="none" stroke="#bd727c" strokeWidth="1.5" strokeDasharray="3 3"/>
    <rect x="39" y="72" width="93" height="39" rx="5" fill="#fffdfb" stroke="#bd727c" strokeWidth="2"/>
    <path d="M39 85c9-8 15 7 24 0s15 7 24 0 15 7 24 0 14 7 21 0v11H39z" fill="#f3c1c2"/>
    <path d="M39 99h93v12H39z" fill="#f4d9d5"/>
    <path d="M55 71V57m28 14V53m28 18V57" stroke="#d18a5e" strokeWidth="5" strokeLinecap="round"/>
    <path d="M55 51c-3-4 3-6 0-10m28 8c-3-4 3-6 0-10m28 14c-3-4 3-6 0-10" fill="none" stroke="#e6ad55" strokeWidth="2" strokeLinecap="round"/>
    <path d="M27 56l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1zM146 77l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#e7bd69"/>
    <path d="M30 115h110" stroke="#d9b4a7" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

function AnniversaryArt() {
  return <svg className="occasion-art" viewBox="0 0 180 130" role="img" aria-label="Two hearts together">
    <path d="M84 47c-12-17-38-6-34 13 3 14 22 27 34 36 12-9 31-22 34-36 4-19-22-30-34-13Z" fill="#f4c8cf" stroke="#bd727c" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M104 41c-9-13-28-5-25 10 2 11 16 21 25 28 9-7 23-17 25-28 3-15-16-23-25-10Z" fill="#fff4f1" stroke="#d89a82" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="m37 35 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1zM143 74l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#e7bd69"/>
    <path d="M49 105h81" stroke="#d9b4a7" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

function WeddingArt() {
  return <svg className="occasion-art" viewBox="0 0 180 130" role="img" aria-label="Wedding rings with a flower">
    <circle cx="75" cy="70" r="25" fill="#fff8e9" stroke="#d7ad61" strokeWidth="7"/>
    <circle cx="105" cy="70" r="25" fill="#fffdfb" stroke="#e4c47f" strokeWidth="7"/>
    <path d="M90 42c-7-11-22-4-20 8 2 8 12 15 20 21 8-6 18-13 20-21 2-12-13-19-20-8Z" fill="#efb1b6" stroke="#bd727c" strokeWidth="2" strokeLinejoin="round"/>
    <path d="m41 42 2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1zM139 89l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#e7bd69"/>
    <path d="M48 108h84" stroke="#d9b4a7" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

function OccasionArt({ occasionId }) {
  if (occasionId === 'birthday') return <BirthdayCakeArt />;
  if (occasionId === 'anniversary') return <AnniversaryArt />;
  return <WeddingArt />;
}

function BalloonScene() {
  const colors = ['#ef9da5', '#f1bd63', '#86c4b7', '#e99479', '#b7acd8', '#f2c875'];
  return <div className="balloon-scene" aria-hidden="true">
    {colors.map((color, index) => <svg key={color} className={`rising-balloon balloon-${index + 1}`} viewBox="0 0 100 160">
      <ellipse cx="50" cy="43" rx="30" ry="37" fill={color}/>
      <path d="M40 18c-7 8-10 17-9 25" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6"/>
      <path d="m46 79 4 7 4-7" fill={color}/>
      <path d="M50 86c-8 17 9 27 1 41s9 19 2 31" fill="none" stroke="#aa9a8d" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>)}
  </div>;
}

function CelebrationTune({ occasionId }) {
  const contextRef = useRef(null);
  const timerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const melodies = {
    birthday: [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 659.25, 523.25],
    anniversary: [392, 493.88, 587.33, 659.25, 587.33, 493.88, 440, 523.25, 659.25, 587.33, 493.88, 392],
    wedding: [440, 554.37, 659.25, 783.99, 659.25, 554.37, 493.88, 587.33, 698.46, 659.25, 554.37, 440],
  };
  const notes = melodies[occasionId] ?? melodies.birthday;

  async function startMusic() {
    if (timerRef.current) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const context = contextRef.current || (contextRef.current = new AudioContextClass());
      await context.resume();
      if (context.state !== 'running') return;

      let step = 0;
      const playNote = () => {
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const volume = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = notes[step % notes.length];
        volume.gain.setValueAtTime(0.001, now);
        volume.gain.exponentialRampToValueAtTime(0.065, now + 0.025);
        volume.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
        oscillator.connect(volume);
        volume.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.35);
        step += 1;
      };

      playNote();
      timerRef.current = window.setInterval(playNote, 420);
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  function stopMusic() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
  }

  useEffect(() => {
    startMusic();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      contextRef.current?.close();
    };
  }, []);

  return <div className="music-control">
    <button className={`music-disc ${playing ? 'playing' : ''}`} type="button" onClick={playing ? stopMusic : startMusic} aria-label={playing ? `Pause ${occasionId} music` : `Play ${occasionId} music`} aria-pressed={playing} title={playing ? `Pause ${occasionId} music` : `Play ${occasionId} music`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="#344d43"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="#60746a" strokeWidth="1"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#60746a" strokeWidth="1"/>
        <circle cx="50" cy="50" r="28" fill="none" stroke="#60746a" strokeWidth="1"/>
        <circle cx="50" cy="50" r="18" fill="#e8a2a6"/>
        <text x="50" y="56" textAnchor="middle" fontSize="18" fill="#fffaf4">♫</text>
      </svg>
    </button>
    <span className="music-hint">Tap the disc to play or pause the tune</span>
  </div>;
}

function CelebrationCardPage({ routeOccasion, cardPage }) {
  const displayTitle = cardPage[0].toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <main className="landing-page wish-landing">
    <BalloonScene />
    <section className="wish-experience">
      <div className="wish-card">
        <span className="wish-star star-a" aria-hidden="true">✦</span>
        <span className="wish-star star-b" aria-hidden="true">✧</span>
        <CelebrationTune occasionId={routeOccasion.id} />
        <h1>{displayTitle}</h1>
        <OccasionArt occasionId={routeOccasion.id} />
      </div>
    </section>
  </main>;
}

function App() {
  const route = window.location.pathname.match(/^\/cards\/([^/]+)\/([^/]+)\/?$/);
  const routeOccasion = route && occasions.find(({ id }) => id === route[1]);
  const cardPage = routeOccasion?.cards.find(([title]) => slugify(title) === route?.[2]);
  const [active, setActive] = useState(routeOccasion?.id ?? 'birthday');
  const occasion = occasions.find((item) => item.id === active);

  return (
    <div className="site-shell">
      <header className="topbar"><a href="/" className="wordmark" aria-label="WithLove home">with<span>love</span><i>®</i></a></header>
      {cardPage && routeOccasion ? <CelebrationCardPage routeOccasion={routeOccasion} cardPage={cardPage} /> : <main id="home">
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
          {occasion.cards.map(([title, caption]) => (
            <a className="greeting-card" key={`${occasion.id}-${title}`} href={`/cards/${occasion.id}/${slugify(title)}`} aria-label={`${title}: ${caption}`}>
              <OccasionArt occasionId={occasion.id} />
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

createRoot(document.getElementById('root')).render(<App />);
