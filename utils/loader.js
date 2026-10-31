// Overlay de carga con Kai.
// Uso típico:
//   await withLoader(() => ManagerTask.create(data), { text: 'Creando tu tarea…', doneText: '¡Tarea creada!' });

import { mascotSVG } from '../utils/mascot.js';

let overlay = null;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function build() {
  overlay = document.createElement('div');
  overlay.className = 'kp-loader';
  overlay.hidden = true;
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.innerHTML = `
    <div class="kp-loader__box">
      <div class="kp-loader__mascot"></div>
      <p class="kp-loader__text"></p>
    </div>`;
  document.body.append(overlay);
}

function render(mood, text) {
  overlay.querySelector('.kp-loader__mascot').innerHTML = mascotSVG(mood, { size: 110 });
  overlay.querySelector('.kp-loader__text').textContent = text;
}

export function showLoader(text = 'Cargando…') {
  if (!overlay) build();
  render('loading', text);
  overlay.hidden = false;
  document.body.classList.add('kp-loading');
}

export function hideLoader() {
  if (!overlay) return;
  overlay.hidden = true;
  document.body.classList.remove('kp-loading');
}

/**
 * Muestra el overlay mientras corre `task` (función o promesa).
 * - min: tiempo mínimo visible (ms), para que no parpadee si la tarea es instantánea.
 * - doneMs: cuánto se muestra Kai feliz al terminar.
 * Si `task` falla, oculta el overlay y vuelve a lanzar el error.
 */
export async function withLoader(
  task,
  { text = 'Cargando…', doneText = '¡Listo!', min = 900, doneMs = 700 } = {}
) {
  showLoader(text);
  try {
    const run = typeof task === 'function' ? Promise.resolve().then(task) : Promise.resolve(task);
    const [result] = await Promise.all([run, wait(min)]);
    render('done', doneText);
    await wait(doneMs);
    return result;
  } finally {
    hideLoader();
  }
}