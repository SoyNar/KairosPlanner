import { escapeHTML } from "../../../utils/html.js";
import { progressOf, renderProgressCard } from "../shared/progressCard.js";
// Si lo tienes como módulo JS con el string del SVG:
// import { KAYOS_SVG } from "../../../assets/kayos.js";

/**
 * Franja de progreso (va debajo del tablero)
 */
export function renderProgress(tasks) {
  return `
    ${renderProgressCard(progressOf(tasks))}
    <p class="planner-footnote">Tus tareas, organizadas por estado.</p>`;
}

/**
 * Columna derecha: Kayos, siguiente paso y "Hazle un hueco"
 */
export function renderAside(tasks) {
  const { done } = progressOf(tasks);
  const next = tasks.find((t) => t.status === "En progreso")
            ?? tasks.find((t) => t.status === "Pendiente");

  const kayosMessage = done === 0
    ? "Aún no completas tareas hoy. Empieza con una pequeña, ¡cada avance cuenta!"
    : `Ya completaste ${done === 1 ? "tu primera tarea" : `${done} tareas`}. Sigue con lo que está en progreso, ¡cada avance cuenta!`;

  return `
    <div class="aside-card aside-card--kayos">
      <span class="aside-badge"><i class="bi bi-circle-fill"></i> KAYOS ESTÁ CONTIGO</span>
      
      <div class="aside-kayos-figure" aria-hidden="true">
        <img src="./assets/img/kayos.svg" alt="" />
        <!-- O si lo inyectas inline: \${KAYOS_SVG} -->
      </div>

      <h3>Pequeños pasos.<br>Grandes avances.</h3>
      <p>${kayosMessage}</p>
      <a href="#/my-schedule" class="aside-btn">Ir a mi horario <i class="bi bi-arrow-up-right"></i></a>
    </div>

    <div class="aside-card aside-card--next">
      <span class="aside-label">TU SIGUIENTE PASO</span>
      <h3>${next ? "Una cosa a la vez." : "Todo al día."}</h3>
      <p>${next ? `Abre "${escapeHTML(next.name)}" y retoma desde donde te quedaste.` : "No tienes tareas pendientes."}</p>
    </div>

    <a href="#/my-schedule" class="aside-card aside-card--hole">
      <div>
        <h3>Hazle un hueco.</h3>
        <p>Consulta tu horario semanal</p>
      </div>
      <i class="bi bi-arrow-up-right"></i>
    </a>`;
}