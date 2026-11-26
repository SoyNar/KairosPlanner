import { escapeHTML } from "../../../utils/html.js";

export function renderTodayAside({ total, done, overdue, next }) {

    
  let kayosMessage = "Todo despejado hoy. Aprovecha para avanzar con calma.";

  if (overdue > 0) {
    kayosMessage = `Tienes ${overdue} tarea${overdue > 1 ? "s" : ""} vencida${overdue > 1 ? "s" : ""}. Empieza por ahí.`;
  } else if (total > 0) {
    kayosMessage = `Llevas ${done} de ${total} tarea${total === 1 ? "" : "s"} completada${done === 1 ? "" : "s"} hoy. ¡Buen ritmo!`;
  }

  return `
    <div class="aside-card aside-card--kayos">
      <span class="aside-badge"><i class="bi bi-circle-fill"></i> KAYOS ESTÁ CONTIGO</span>
      <div class="aside-kayos-figure" aria-hidden="true">
        <img src="./assets/img/kayos.svg" alt="" />
      </div>
      <h3>Un día a la vez,<br>sin prisas.</h3>
      <p>${kayosMessage}</p>
      <a href="#/my-schedule" class="aside-btn">Ver mi horario <i class="bi bi-arrow-up-right"></i></a>
    </div>

    <div class="aside-card aside-card--next">
      <span class="aside-label">ENFÓCATE EN ESTO</span>
      <h3>${next ? "Una cosa a la vez." : "Meta cumplida."}</h3>
      <p>${next
        ? `Abre "${escapeHTML(next.name)}" y dedícale un bloque corto ahora.`
        : "No tienes tareas pendientes para hoy."}</p>
    </div>

    <a href="#/week" class="aside-card aside-card--hole">
      <div>
        <h3>Mira tu semana.</h3>
        <p>Revisa lo que viene los próximos días</p>
      </div>
      <i class="bi bi-arrow-up-right"></i>
    </a>`;
}