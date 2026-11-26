import { escapeHTML } from "../../../utils/html.js";

/**
 * Panel derecho de Mi semana
 */
export function renderWeekAside({ pending, overdue, next }) {
  const kayosMessage = overdue > 0
    ? `Tienes ${overdue} tarea${overdue > 1 ? "s" : ""} vencida${overdue > 1 ? "s" : ""}. Empieza por ahí.`
    : "Todo al día. Buen ritmo.";

  return `
    <div class="aside-card aside-card--kayos">
      <span class="aside-badge"><i class="bi bi-circle-fill"></i> KAYOS ESTÁ CONTIGO</span>
      <div class="aside-kayos-figure" aria-hidden="true">
        <img src="./assets/img/kayos.svg" alt="" />
      </div>
      <h3>Tu semana,<br>sin enredos.</h3>
      <p>${kayosMessage}</p>
    </div>

    <div class="aside-card aside-card--next">
      <span class="aside-label">TU SIGUIENTE PASO</span>
      <h3>${next ? "Una cosa a la vez." : "Todo al día."}</h3>
      <p>${next
        ? `Abre "${escapeHTML(next.name)}" y retoma desde donde te quedaste.`
        : "No tienes tareas pendientes."}</p>
    </div>

    <a href="#/tasks" class="aside-card aside-card--hole">
      <div>
        <h3>Un paso a la vez.</h3>
        <p>${pending} pendiente${pending === 1 ? "" : "s"} esta semana</p>
      </div>
      <i class="bi bi-arrow-up-right"></i>
    </a>`;
}