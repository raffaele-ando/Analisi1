import { html } from '../vendor/preact-htm.js';

const S = (d, extra = '') => (p = {}) =>
  html`<svg class=${p.class || 'ico'} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=${p.sw || 2.2} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" dangerouslySetInnerHTML=${{ __html: d + extra }}></svg>`;

export const I = {
  path: S('<path d="M5 19c3-1 4-4 7-4s4 3 7 2"/><circle cx="6" cy="6" r="2.5"/><circle cx="17" cy="9" r="2.5"/><path d="M8 7.5c2 1 5 1 7 1.5"/>'),
  review: S('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>'),
  book: S('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>'),
  exam: S('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
  user: S('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
  flame: S('<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6.5-4-10-2 1.5-3 3.5-3 5.5C10.5 9 9.5 8 9 6.5 6.5 9 5 11.5 5 15c0 4.3 3 7 7 7z" fill="currentColor" stroke="none"/>'),
  bolt: S('<path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor" stroke="none"/>'),
  crown: S('<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor" stroke="none"/>'),
  lock: S('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  check: S('<path d="M4 12.5 9.5 18 20 6"/>'),
  x: S('<path d="M6 6l12 12M18 6 6 18"/>'),
  up: S('<path d="M6 15l6-6 6 6"/>'),
  down: S('<path d="M6 9l6 6 6-6"/>'),
  play: S('<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"/>'),
  star: S('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor" stroke="none"/>'),
  clock: S('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  cloud: S('<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/>'),
  gear: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  history: S('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>'),
  download: S('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  upload: S('<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>'),
  sparkle: S('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
  target: S('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
  sigma: S('<path d="M18 5H6l6 7-6 7h12"/>'),
  integral: S('<path d="M15 3c-2 0-3 1.5-3 4v10c0 2.5-1 4-3 4"/>'),
  fn: S('<path d="M14 4c-2.5 0-3.5 1.5-4 4l-2 10c-.5 2.5-1.5 3-3 3"/><path d="M7 10h7"/><path d="M15 13l5 6M20 13l-5 6"/>'),
  cube: S('<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>'),
  infinity: S('<path d="M7 9a3 3 0 1 0 0 6c3 0 7-6 10-6a3 3 0 1 1 0 6c-3 0-7-6-10-6z"/>'),
  i: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
  limit: S('<path d="M4 18c4 0 6-10 16-12"/><path d="M16 5l4 1-1 4"/>'),
  deriv: S('<path d="M3 18c3 0 5-12 9-12s5 8 9 8"/><path d="M6 13l10-6"/>'),
  seq: S('<circle cx="5" cy="17" r="1.6" fill="currentColor"/><circle cx="10" cy="12" r="1.6" fill="currentColor"/><circle cx="15" cy="9" r="1.6" fill="currentColor"/><circle cx="20" cy="7.5" r="1.6" fill="currentColor"/>'),
  sets: S('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>'),
  abc: S('<path d="M4 18l3.5-12L11 18M5 14h5M14 6h3a3 3 0 0 1 0 6h-3zM14 12h3.5a3 3 0 0 1 0 6H14z"/>'),
  plane: S('<path d="M3 16l6-9h12l-6 9z"/><path d="M12 3v15"/>'),
  continuity: S('<path d="M3 15c3 0 4-6 7-6s3 6 6 6 3-4 5-4"/>'),
  study: S('<path d="M3 20h18M5 20V9M10 20V5M15 20v-8M20 20v-5"/>'),
  taylor: S('<path d="M3 12h18"/><path d="M4 18c3-1 4-12 8-12s5 11 8 12"/>'),
  sound: S('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>'),
  sun: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  ai: S('<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>'),
  arrow: S('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  back: S('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
  eye: S('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
};

export const SECTION_ICON = {
  s00: 'abc', s01: 'sets', s02: 'i', s03: 'fn', s04: 'seq', s05: 'limit', s06: 'infinity', s07: 'continuity',
  s08: 'deriv', s09: 'study', s10: 'taylor', s11: 'integral', s12: 'integral', s13: 'sigma', s14: 'sigma', s15: 'cube',
};

// Colori di sezione: abbastanza scuri da reggere testo bianco in entrambi i temi.
export const SECTION_COLOR = {
  s00: '#5b6b8c', s01: '#3d63d6', s02: '#7a4fd1', s03: '#1f8a8a', s04: '#2a7fc9', s05: '#c2492f', s06: '#b5532a',
  s07: '#2f8f5b', s08: '#3456c9', s09: '#8c4bb8', s10: '#c0397a', s11: '#2e7d6b', s12: '#1f6f8f', s13: '#b8541e', s14: '#9b4a2a', s15: '#4a5bb5',
};
