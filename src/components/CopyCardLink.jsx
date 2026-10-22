import React, { useEffect, useRef, useState } from 'react';
import { copyCardLink, createUniqueCardLink } from '../services/cardLinkService.js';

export default function CopyCardLink() {
  const [copyLink] = useState(createUniqueCardLink);
  const [message, setMessage] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = (text) => {
    window.clearTimeout(toastTimer.current);
    setMessage(text);
    toastTimer.current = window.setTimeout(() => setMessage(''), 2200);
  };

  const handleCopy = async () => {
    try {
      await copyCardLink(copyLink);
      notify('Copied!');
    } catch {
      notify('Select the link to copy');
    }
  };

  return (
    <div className="card-share card-share--top">
      <div className="share-row">
        <input id="card-share-link" className="share-link" aria-label="Unique card link" readOnly value={copyLink} onFocus={(event) => event.currentTarget.select()} />
        <button className="copy-button" type="button" onClick={handleCopy}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
          <span>Copy</span>
        </button>
      </div>
      {message && <div className="copy-toast" role="status" aria-live="polite">{message}</div>}
    </div>
  );
}
