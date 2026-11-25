// Kai, la mascota de KairosPlanner (reloj de arena).
// Uso: mascotSVG('done', { size: 80 })  ->  string con el <svg>
// Estados: 'pending' | 'progress' | 'done' | 'loading'

const INK = '#14141A';
const TODO = '#FFD23F';
const DOING = '#B9A4FF';
const DONE = '#4FE0A0';
const HOT = '#FF5C8A';

const GLASS =
  'M46 32 H154 C154 90 120 110 112 130 C120 150 154 170 154 228 ' +
  'H46 C46 170 80 150 88 130 C80 110 46 90 46 32 Z';

const STROKE = `stroke="${INK}" stroke-linecap="round" stroke-linejoin="round" fill="none"`;

// Caras (una por estado)
const FACES = {
  pending: `
    <g ${STROKE}>
      <circle cx="82" cy="64" r="9" fill="#fff" stroke-width="4"/>
      <circle cx="118" cy="64" r="9" fill="#fff" stroke-width="4"/>
      <circle cx="80" cy="66" r="3.5" fill="${INK}" stroke="none"/>
      <circle cx="116" cy="66" r="3.5" fill="${INK}" stroke="none"/>
      <path d="M72 50 L90 44 M110 44 L128 50" stroke-width="4"/>
      <path d="M86 86 q7 -6 14 0 t14 0" stroke-width="4"/>
      <path d="M146 42 C154 54 154 62 146 62 C138 62 138 54 146 42Z" fill="#8FD3FF" stroke-width="3"/>
    </g>`,
  progress: `
    <g ${STROKE}>
      <circle cx="82" cy="64" r="8" fill="#fff" stroke-width="4"/>
      <circle cx="118" cy="64" r="8" fill="#fff" stroke-width="4"/>
      <circle cx="85" cy="65" r="3.5" fill="${INK}" stroke="none"/>
      <circle cx="121" cy="65" r="3.5" fill="${INK}" stroke="none"/>
      <path d="M72 44 L92 49 M108 49 L128 44" stroke-width="4"/>
      <path d="M92 86 H108" stroke-width="4"/>
    </g>`,
  done: `
    <g ${STROKE}>
      <path d="M72 66 Q82 50 92 66 M108 66 Q118 50 128 66" stroke-width="5"/>
      <path d="M84 80 Q100 102 116 80 Z" fill="#fff" stroke-width="4"/>
      <circle cx="68" cy="82" r="5" fill="${HOT}" stroke="none"/>
      <circle cx="132" cy="82" r="5" fill="${HOT}" stroke="none"/>
    </g>`,
};
FACES.loading = FACES.progress;

// Arena (una por estado). 'loading' lleva clases para animarla con CSS.
const SAND = {
  pending: `
    <rect x="40" y="98" width="120" height="34" fill="${TODO}"/>
    <rect x="40" y="206" width="120" height="24" fill="${TODO}"/>`,
  progress: `
    <rect x="40" y="112" width="120" height="20" fill="${DOING}"/>
    <rect x="97" y="128" width="6" height="64" fill="${DOING}"/>
    <rect x="40" y="186" width="120" height="44" fill="${DOING}"/>`,
  done: `<rect x="40" y="164" width="120" height="66" fill="${DONE}"/>`,
  loading: `
    <rect class="kai-top" x="40" y="100" width="120" height="30" fill="${DOING}"/>
    <rect class="kai-stream" x="97" y="128" width="6" height="64" fill="${DOING}"/>
    <rect class="kai-bottom" x="40" y="190" width="120" height="40" fill="${DOING}"/>`,
};

const CONFETTI = `
  <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
    <rect x="170" y="52" width="14" height="14" fill="${TODO}" transform="rotate(20 177 59)"/>
    <circle cx="26" cy="64" r="7" fill="${DOING}"/>
    <path d="M180 110 l8 14 h-16 z" fill="${DONE}"/>
  </g>`;

let counter = 0; // id único del clipPath por cada SVG en la página

export function mascotSVG(mood = 'progress', { size = 96, label = 'Kai, la mascota de KairosPlanner' } = {}) {
  const m = FACES[mood] ? mood : 'progress';
  const id = `kai-clip-${++counter}`;
  const cls = m === 'loading' ? 'kai kai--loading' : 'kai';

  return `
<svg class="${cls}" viewBox="0 0 200 260" width="${size}" height="${Math.round(size * 1.3)}" role="img" aria-label="${label}">
  <defs><clipPath id="${id}"><path d="${GLASS}"/></clipPath></defs>
  <g fill="${INK}">
    <rect x="37" y="21" width="140" height="18" rx="9"/>
    <rect x="37" y="235" width="140" height="18" rx="9"/>
    <path d="${GLASS}" transform="translate(7 7)"/>
  </g>
  <path d="${GLASS}" fill="#fff"/>
  <g clip-path="url(#${id})">${SAND[m]}</g>
  <path d="${GLASS}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  ${FACES[m]}
  <g fill="${HOT}" stroke="${INK}" stroke-width="6" stroke-linejoin="round">
    <rect x="30" y="14" width="140" height="18" rx="9"/>
    <rect x="30" y="228" width="140" height="18" rx="9"/>
  </g>
  ${m === 'done' ? CONFETTI : ''}
</svg>`;
}

// Rellena cualquier elemento <... data-kai="done" data-size="72"> del DOM
export function initMascots(root = document) {
  root.querySelectorAll('[data-kai]').forEach((el) => {
    el.innerHTML = mascotSVG(el.dataset.kai, { size: Number(el.dataset.size) || 96 });
  });
}