import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const occasions = [
  { id: 'birthday', name: 'Birthday', cards: [
    ['MAKE A WISH', 'A little more magic'],
    ['FIND THE GIFT', 'A 10-second birthday challenge'],
    ['SWIFTIE ERA', 'A birthday made for a Taylor Swift fan'],
  ] },
  { id: 'anniversary', name: 'Anniversary', cards: [
    ['STILL US', 'And always will be'],
  ] },
  { id: 'wedding', name: 'Wedding', cards: [
    ['THE HAPPY COUPLE', 'So happy for you'],
  ] },
];

// Replace these placeholders when recipient name and photo forms are added.
const birthdayRecipient = { name: 'Birthday Star', photoUrl: '' };

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let birthdaySfxContext;
let activeTuneStop;

function stopCelebrationAudio() {
  activeTuneStop?.();
  if (birthdaySfxContext && birthdaySfxContext.state !== 'closed') birthdaySfxContext.close();
  birthdaySfxContext = null;
}

function playBirthdaySfx(action, variation = 0) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const patterns = {
    start: [[523, 0, 'sine'], [659, 0.09, 'sine'], [784, 0.18, 'triangle']],
    candle: [[880 - variation * 45, 0, 'sine'], [587 - variation * 30, 0.08, 'triangle']],
    cake: [[523, 0, 'triangle'], [659, 0.1, 'triangle'], [784, 0.2, 'sine']],
    pop: [[420 + variation * 25, 0, 'square'], [180, 0.035, 'triangle']],
    choice: [[659 + variation * 32, 0, 'sine'], [880 + variation * 40, 0.1, 'sine']],
    next: [[440, 0, 'sine'], [660, 0.055, 'sine']],
    back: [[520, 0, 'sine'], [390, 0.06, 'sine']],
    celebrate: [[523, 0, 'triangle'], [659, 0.08, 'triangle'], [784, 0.16, 'triangle'], [1047, 0.24, 'sine']],
  };

  try {
    const context = birthdaySfxContext || (birthdaySfxContext = new AudioContextClass());
    if (context.state === 'suspended') context.resume().catch(() => {});
    const now = context.currentTime;
    (patterns[action] ?? patterns.next).forEach(([frequency, delay, type]) => {
      const oscillator = context.createOscillator();
      const volume = context.createGain();
      const startAt = now + delay;
      const length = action === 'pop' ? 0.13 : 0.2;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      if (action === 'pop') oscillator.frequency.exponentialRampToValueAtTime(72, startAt + length);
      volume.gain.setValueAtTime(0.0001, startAt);
      volume.gain.exponentialRampToValueAtTime(action === 'pop' ? 0.045 : 0.035, startAt + 0.012);
      volume.gain.exponentialRampToValueAtTime(0.0001, startAt + length);
      oscillator.connect(volume);
      volume.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + length + 0.015);
    });
  } catch {
    // Sound is an enhancement; the card activities stay usable if audio is unavailable.
  }
}

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

function GiftPuzzleArt() {
  return <svg className="occasion-art" viewBox="0 0 180 130" role="img" aria-label="Colorful gift puzzle grid">
    <rect x="34" y="14" width="35" height="31" rx="8" fill="#ff729c"/>
    <rect x="74" y="14" width="35" height="31" rx="8" fill="#ffd34e"/>
    <rect x="114" y="14" width="35" height="31" rx="8" fill="#59d2c0"/>
    <rect x="34" y="50" width="35" height="31" rx="8" fill="#9e7cff"/>
    <rect x="74" y="50" width="35" height="31" rx="8" fill="#ff9855"/>
    <rect x="114" y="50" width="35" height="31" rx="8" fill="#6dbaff"/>
    <rect x="34" y="86" width="35" height="31" rx="8" fill="#65c886"/>
    <rect x="74" y="86" width="35" height="31" rx="8" fill="#ff75b9"/>
    <rect x="114" y="86" width="35" height="31" rx="8" fill="#f6bd4c"/>
    <path d="M84 62h16v19H84zM81 58h22v7H81zM92 58v23" fill="#fff8e8" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M92 58c-8-2-8-9-3-9 4 0 4 5 3 9Zm0 0c8-2 8-9 3-9-4 0-4 5-3 9Z" fill="#ffe881" stroke="#fff" strokeWidth="1.5"/>
  </svg>;
}

function SwiftieCardArt() {
  return <svg className="occasion-art" viewBox="0 0 180 130" role="img" aria-label="Colorful friendship bracelet with stars">
    <path d="M43 66c0-24 21-43 47-43s47 19 47 43-21 43-47 43S43 90 43 66Z" fill="none" stroke="#f3a6c4" strokeWidth="11" strokeDasharray="2 1"/>
    <path d="M47 66c0-21 19-38 43-38s43 17 43 38-19 38-43 38-43-17-43-38Z" fill="none" stroke="#8c70df" strokeWidth="7" strokeDasharray="3 2"/>
    <circle cx="90" cy="28" r="8" fill="#ffd65a"/><circle cx="128" cy="50" r="8" fill="#71d6c5"/><circle cx="125" cy="87" r="8" fill="#ff8c9f"/>
    <circle cx="88" cy="104" r="8" fill="#ffb15c"/><circle cx="51" cy="84" r="8" fill="#7ac5f3"/><circle cx="53" cy="47" r="8" fill="#b58af2"/>
    <path d="m31 24 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1zM145 16l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1zM151 98l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#ffd85b"/>
    <path d="M76 61h29M78 71h24" stroke="#fffaf5" strokeWidth="3" strokeLinecap="round"/>
    <text x="90" y="68" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fffaf5">13</text>
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

function CakeActivity({ flames, onBlow, sliced, onSlice }) {
  return <div className="cake-activity">
    <div className="birthday-candles" aria-label="Birthday candles">
      {flames.map((lit, index) => <button className={`birthday-candle ${lit ? 'lit' : 'blown'}`} key={index} type="button" disabled={!lit} onClick={() => { playBirthdaySfx('candle', index); onBlow(index); }} aria-label={`${lit ? 'Blow out' : 'Blown out'} candle ${index + 1}`}>
        {lit ? <span className="candle-flame" aria-hidden="true"/> : <span className="candle-smoke" aria-hidden="true">〰</span>}
        <span className="candle-wick" aria-hidden="true"/><span className="candle-stick" aria-hidden="true"/>
      </button>)}
    </div>
    <button className={`cake-body ${sliced ? 'sliced' : ''}`} type="button" onClick={onSlice ?? undefined} disabled={!onSlice} aria-label={sliced ? 'Cake sliced' : 'Tap to cut the cake'}>
      <span className="cake-top"/><span className="cake-layer"/><span className="cake-base"/>
      {sliced && <span className="cake-slice-result" aria-hidden="true">🍰</span>}
    </button>
  </div>;
}

function BirthdaySlidesPage({ recipient }) {
  const [slide, setSlide] = useState(0);
  const [flames, setFlames] = useState([true, true, true]);
  const [cakeSliced, setCakeSliced] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState([]);
  const [birthdayPick, setBirthdayPick] = useState('');
  const activities = [
    { title: 'Birthday wishes, just for you', hint: 'Let’s make this day feel like yours.' },
    { title: 'Make a wish', hint: 'Tap each candle flame to blow it out.' },
    { title: 'Cake time!', hint: 'Tap the cake to cut the very first slice.' },
    { title: 'Pop! Pop! Pop!', hint: 'Tap every balloon and send a wish flying.' },
    { title: 'A little birthday joy', hint: 'What sounds the most fun today?' },
  ];
  const activity = activities[slide];
  const canContinue = slide === 1 ? flames.every((lit) => !lit)
    : slide === 2 ? cakeSliced
      : slide === 3 ? poppedBalloons.length === 3
        : slide === 4 ? Boolean(birthdayPick) : true;

  function nextSlide() {
    if (!canContinue) return;
    setSlide((current) => current === activities.length - 1 ? 0 : current + 1);
  }

  function resetActivities() {
    setSlide(0);
    setFlames([true, true, true]);
    setCakeSliced(false);
    setPoppedBalloons([]);
    setBirthdayPick('');
  }

  return <main className="landing-page wish-landing birthday-activities-page">
    <BalloonScene />
    <section className="wish-experience">
      <div className={`wish-card birthday-slides-card slide-theme-${slide}`} aria-live="polite">
        <CelebrationTune occasionId="birthday"/>
        <div className="party-sprinkles" key={`sprinkles-${slide}`} aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => <span key={index}/>) }
        </div>
        <div className="slide-progress" style={{ '--slide-progress': `${((slide + 1) / activities.length) * 100}%` }} aria-label={`Slide ${slide + 1} of ${activities.length}`}>
          <span>{String(slide + 1).padStart(2, '0')}</span><i/> <span>{String(activities.length).padStart(2, '0')}</span>
        </div>
        <div className="activity-content" key={slide}>
          {slide === 0 ? <>
            <div className="recipient-photo">
              {recipient.photoUrl ? <img src={recipient.photoUrl} alt={`${recipient.name}`} /> : <><span aria-hidden="true">♡</span><small>Photo goes here</small></>}
            </div>
            <p className="activity-kicker">A little celebration for</p>
            <h1>{recipient.name}!</h1>
            <p className="activity-hint">{activity.hint}</p>
            <div className="welcome-sparkles" aria-hidden="true">✦　♡　✧</div>
          </> : <>
            <p className="activity-kicker">A birthday moment for {recipient.name}</p>
            <h1>{activity.title}</h1>
            <p className="activity-hint">{activity.hint}</p>
            {slide === 1 && <CakeActivity flames={flames} onBlow={(index) => setFlames((current) => current.map((lit, i) => i === index ? false : lit))} sliced={false}/>}
            {slide === 2 && <CakeActivity flames={flames.map(() => false)} onBlow={() => {}} sliced={cakeSliced} onSlice={() => { playBirthdaySfx('cake'); setCakeSliced(true); }}/>}
            {slide === 3 && <div className="pop-balloons" aria-label="Pop the birthday balloons">
              {['#e98e9a', '#80bfb1', '#f0bd63'].map((color, index) => poppedBalloons.includes(index)
                ? <span className="popped-star" key={color} aria-label="Popped">✦</span>
                : <button className="pop-balloon" key={color} style={{ '--balloon-color': color }} type="button" onClick={() => { playBirthdaySfx('pop', index); setPoppedBalloons((current) => [...current, index]); }} aria-label={`Pop balloon ${index + 1}`}><span/><i/></button>)}
            </div>}
            {slide === 4 && <div className="birthday-choices">
              {['Cake & ice cream', 'Your favorite song', 'A little dance break', 'Make one more wish'].map((choice, index) => <button className={birthdayPick === choice ? 'chosen' : ''} key={choice} type="button" onClick={() => { playBirthdaySfx('choice', index); setBirthdayPick(choice); }}>{choice}</button>)}
            </div>}
          </>}
        </div>
        <nav className="slide-navigation" aria-label="Birthday card slides">
          {slide > 0 ? <button className="slide-back" type="button" onClick={() => { playBirthdaySfx('back'); setSlide((current) => current - 1); }}>Back</button> : <span/>}
          <button className="slide-next" type="button" onClick={() => {
            if (slide === activities.length - 1) {
              playBirthdaySfx('celebrate');
              resetActivities();
            } else {
              playBirthdaySfx(slide === 0 ? 'start' : 'next');
              nextSlide();
            }
          }} disabled={!canContinue}>
            {slide === 0 ? 'Start the fun' : slide === activities.length - 1 ? 'Celebrate again' : 'Next'} <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </section>
  </main>;
}

const birthdayPuzzleIcons = ['🎈', '⭐', '🧁', '🎊', '🍓', '🎀', '🎁', '🍰', '🎉', '🍒', '🪅', '💝', '🌟', '🍭', '🎈', '🎂'];
const birthdayPuzzleDuration = 10000;

function shufflePuzzleGrid() {
  const grid = [...birthdayPuzzleIcons];
  for (let index = grid.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [grid[index], grid[swapIndex]] = [grid[swapIndex], grid[index]];
  }
  return grid;
}

function BirthdayPuzzlePage({ recipient }) {
  const [tiles, setTiles] = useState(shufflePuzzleGrid);
  const [gameState, setGameState] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(birthdayPuzzleDuration);
  const [showOops, setShowOops] = useState(false);
  const [showYay, setShowYay] = useState(false);
  const giftIndex = tiles.indexOf('🎁');

  useEffect(() => {
    if (gameState !== 'playing') return undefined;
    const deadline = Date.now() + birthdayPuzzleDuration;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) setGameState('lost');
    }, 35);
    return () => window.clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (!showOops) return undefined;
    const dismiss = window.setTimeout(() => setShowOops(false), 1400);
    return () => window.clearTimeout(dismiss);
  }, [showOops]);

  useEffect(() => {
    if (!showYay) return undefined;
    const dismiss = window.setTimeout(() => setShowYay(false), 1800);
    return () => window.clearTimeout(dismiss);
  }, [showYay]);

  function startGame() {
    setTiles(shufflePuzzleGrid());
    setTimeLeft(birthdayPuzzleDuration);
    setGameState('playing');
    playBirthdaySfx('start');
  }

  function chooseTile(index) {
    if (gameState !== 'playing') return;
    if (index === giftIndex) {
      setGameState('won');
      setShowYay(true);
      playBirthdaySfx('celebrate');
    } else {
      setTimeLeft(0);
      setGameState('lost');
      setShowOops(true);
      playBirthdaySfx('pop');
    }
  }

  const message = gameState === 'won'
    ? `You found your gift, ${recipient.name}! Happy birthday!`
    : gameState === 'lost'
      ? 'So close! The gift was hiding in plain sight.'
      : gameState === 'playing'
        ? 'Quick! Tap the gift before the timer runs out.'
        : 'Your present is hiding in the colorful grid. Find it in 10 seconds!';

  return <main className="landing-page wish-landing birthday-puzzle-page">
    <BalloonScene />
    <section className="wish-experience">
      <div className={`wish-card gift-puzzle-card puzzle-${gameState}`}>
        <CelebrationTune occasionId="birthday" />
        <div className="puzzle-sparkle puzzle-sparkle-one" aria-hidden="true">✦</div>
        <div className="puzzle-sparkle puzzle-sparkle-two" aria-hidden="true">✧</div>
        <div className="puzzle-heading">
          <span className="puzzle-eyebrow">A birthday mini challenge</span>
          <h1>Find the gift!</h1>
          <p>{message}</p>
        </div>
        <div className="puzzle-timer" aria-label={gameState === 'playing' ? `${Math.ceil(timeLeft / 1000)} seconds remaining` : 'Ten second challenge'}>
          <span>{gameState === 'playing' ? Math.ceil(timeLeft / 1000) : gameState === 'won' ? '✓' : gameState === 'lost' ? '0' : '10'}</span>
          <small>{gameState === 'won' ? 'found!' : 'seconds'}</small>
        </div>
        <div className="puzzle-clock-track" role="progressbar" aria-label="Time remaining" aria-valuemin="0" aria-valuemax={birthdayPuzzleDuration} aria-valuenow={timeLeft}>
          <span style={{ width: `${gameState === 'playing' ? (timeLeft / birthdayPuzzleDuration) * 100 : gameState === 'ready' ? 100 : 0}%` }} />
        </div>
        <div className="gift-grid" aria-label="Colorful birthday puzzle grid">
          {tiles.map((icon, index) => <button
            className={`gift-grid-tile gift-tile-${index % 8} ${gameState === 'won' && index === giftIndex ? 'gift-found' : ''} ${gameState === 'lost' && index === giftIndex ? 'gift-reveal' : ''}`}
            key={`${icon}-${index}`}
            type="button"
            disabled={gameState !== 'playing'}
            onClick={() => chooseTile(index)}
            aria-label={icon === '🎁' ? `Gift, tile ${index + 1}` : `Birthday surprise, tile ${index + 1}`}
          >{icon}</button>)}
        </div>
        <div className="puzzle-footer" aria-live="polite">
          {gameState === 'ready' && <button className="puzzle-play" type="button" onClick={startGame}>Ready, go! <span aria-hidden="true">→</span></button>}
          {(gameState === 'won' || gameState === 'lost') && <button className="puzzle-play" type="button" onClick={startGame}>Play again <span aria-hidden="true">↻</span></button>}
          {gameState === 'playing' && <span className="puzzle-live-hint">Tap the present! 🎁</span>}
        </div>
        {showOops && <div className="puzzle-oops" role="status"><span aria-hidden="true">🙈</span><strong>Oops!</strong><small>That’s not your gift!</small></div>}
        {showYay && <div className="puzzle-yay" role="status"><span aria-hidden="true">🎉</span><strong>You found it!</strong><small>Happy birthday, {recipient.name}!</small></div>}
      </div>
    </section>
  </main>;
}

const swiftieEras = [
  { name: 'Lover', key: 'lover', color: '#ff77a6', wish: 'May your year be full of color, laughter, and the people who feel like home.' },
  { name: '1989', key: '1989', color: '#62cce8', wish: 'Here’s to a bright new chapter and a year that feels completely yours.' },
  { name: 'Reputation', key: 'reputation', color: '#514858', wish: 'Make a little mischief, take up space, and own every moment.' },
  { name: 'Fearless', key: 'fearless', color: '#f3bf54', wish: 'May this year bring big dreams, brave choices, and golden memories.' },
  { name: 'Midnights', key: 'midnights', color: '#7766c9', wish: 'Make a wish on every star. This next chapter is yours to write.' },
];

const swiftiePhotos = [
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_swift.jpg?width=500',
    alt: 'Taylor Swift performing during the Eras Tour in Los Angeles',
    author: 'Emazasm',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Taylor_swift.jpg',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_(1).png?width=500',
    alt: 'Taylor Swift at the 2023 MTV Video Music Awards',
    author: 'iHeartRadioCA',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_(1).png',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift,_2012.jpg?width=500',
    alt: 'Taylor Swift performing on the Speak Now tour in Sydney in 2012',
    author: 'Eva Rinaldi',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Taylor_Swift,_2012.jpg',
  },
];

function SwiftieBirthdayPage({ recipient }) {
  const [selectedEra, setSelectedEra] = useState(swiftieEras[0]);

  return <main className="landing-page wish-landing swiftie-page">
    <BalloonScene />
    <section className="wish-experience">
      <div className={`wish-card swiftie-card era-${selectedEra.key}`}>
        <CelebrationTune occasionId="birthday" />
        <div className="swiftie-sparkle swiftie-sparkle-a" aria-hidden="true">✦</div>
        <div className="swiftie-sparkle swiftie-sparkle-b" aria-hidden="true">✧</div>
        <span className="swiftie-ticket">A TAYLOR SWIFT FAN BIRTHDAY</span>
        <div className="swiftie-headliner">
          <p>Tonight’s headliner</p>
          <h1>{recipient.name}<span>!</span></h1>
          <p className="swiftie-era-line">Welcome to your birthday era</p>
        </div>
        <div className="swiftie-gallery" aria-label="Taylor Swift photos">
          {swiftiePhotos.map((photo) => <figure className="swiftie-photo-card" key={photo.sourceUrl}>
            <img src={photo.src} alt={photo.alt} decoding="async" />
            <figcaption><a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.author}</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> · cropped</figcaption>
          </figure>)}
        </div>
        <div className="swiftie-bracelet" aria-label="Friendship bracelet spelling birthday">
          {'BIRTHDAY'.split('').map((letter, index) => <span className={`bracelet-bead bead-${index % 5}`} key={`${letter}-${index}`}>{letter}</span>)}
          <i aria-hidden="true">✦</i>
        </div>
        <p className="swiftie-wish">{selectedEra.wish}</p>
        <div className="swiftie-era-picker">
          <span>Pick your era color</span>
          <div className="swiftie-era-options" role="group" aria-label="Choose a birthday era color">
            {swiftieEras.map((era) => <button
              className={`swiftie-era-option ${selectedEra.key === era.key ? 'selected' : ''}`}
              key={era.key}
              type="button"
              onClick={() => { setSelectedEra(era); playBirthdaySfx('choice', swiftieEras.indexOf(era)); }}
              aria-pressed={selectedEra.key === era.key}
              style={{ '--era-color': era.color }}
            >{era.name}</button>)}
          </div>
        </div>
        <div className="swiftie-signoff"><span aria-hidden="true">♥</span> Your next chapter starts now <span aria-hidden="true">♥</span></div>
      </div>
    </section>
  </main>;
}

function CelebrationTune({ occasionId }) {
  const contextRef = useRef(null);
  const timerRef = useRef(null);
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
    } catch {
      // Autoplay may be blocked until the visitor interacts with the card.
    }
  }

  useEffect(() => {
    startMusic();
    const retryAfterGesture = () => startMusic();
    const stopTune = () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      if (contextRef.current && contextRef.current.state !== 'closed') contextRef.current.close();
      contextRef.current = null;
    };
    activeTuneStop = stopTune;
    window.addEventListener('pointerdown', retryAfterGesture, { once: true });
    window.addEventListener('keydown', retryAfterGesture, { once: true });
    window.addEventListener('pagehide', stopTune);
    return () => {
      window.removeEventListener('pointerdown', retryAfterGesture);
      window.removeEventListener('keydown', retryAfterGesture);
      window.removeEventListener('pagehide', stopTune);
      if (activeTuneStop === stopTune) activeTuneStop = null;
      stopTune();
    };
  }, []);

  return null;
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
  const baseUrl = import.meta.env.BASE_URL;
  const appPath = window.location.pathname.startsWith(baseUrl)
    ? `/${window.location.pathname.slice(baseUrl.length)}`
    : window.location.pathname;
  const route = appPath.match(/^\/cards\/([^/]+)\/([^/]+)\/?$/);
  const routeOccasion = route && occasions.find(({ id }) => id === route[1]);
  const cardPage = routeOccasion?.cards.find(([title]) => slugify(title) === route?.[2]);
  const isFirstBirthdayCard = routeOccasion?.id === 'birthday' && cardPage?.[0] === 'MAKE A WISH';
  const isBirthdayPuzzleCard = routeOccasion?.id === 'birthday' && cardPage?.[0] === 'FIND THE GIFT';
  const isSwiftieBirthdayCard = routeOccasion?.id === 'birthday' && cardPage?.[0] === 'SWIFTIE ERA';
  const [active, setActive] = useState(routeOccasion?.id ?? 'birthday');
  const occasion = occasions.find((item) => item.id === active);

  return (
    <div className="site-shell">
      <header className="topbar"><a href={baseUrl} className="wordmark" aria-label="WithLove home" onClick={stopCelebrationAudio}>with<span>love</span><i>®</i></a></header>
      {cardPage && routeOccasion ? (isFirstBirthdayCard ? <BirthdaySlidesPage recipient={birthdayRecipient}/> : isBirthdayPuzzleCard ? <BirthdayPuzzlePage recipient={birthdayRecipient}/> : isSwiftieBirthdayCard ? <SwiftieBirthdayPage recipient={birthdayRecipient}/> : <CelebrationCardPage routeOccasion={routeOccasion} cardPage={cardPage} />) : <main id="home">
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
            <a className="greeting-card" key={`${occasion.id}-${title}`} href={`${baseUrl}cards/${occasion.id}/${slugify(title)}`} aria-label={`${title}: ${caption}`}>
              {occasion.id === 'birthday' && title === 'FIND THE GIFT' ? <GiftPuzzleArt /> : occasion.id === 'birthday' && title === 'SWIFTIE ERA' ? <SwiftieCardArt /> : <OccasionArt occasionId={occasion.id} />}
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
