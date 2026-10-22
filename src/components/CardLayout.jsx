import React from 'react';
import CopyCardLink from './CopyCardLink.jsx';
import { isSharedCardLink } from '../services/cardLinkService.js';

export default function CardLayout() {
  return (
    <main className="landing-page wish-landing">
      <section className="wish-experience" aria-label="Greeting card">
        {!isSharedCardLink() && <CopyCardLink />}
        <div className="wish-card" aria-label="Blank greeting card" />
      </section>
    </main>
  );
}
