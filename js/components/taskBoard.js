import { escapeHTML } from "../../utils/html.js";

// clase css por estado
const STATUS_CLASS = {
  "Pendiente": "pending",
  "En progreso": "progress",
  "Completada": "done",
};
const STATUSES = ["Pendiente", "En progreso", "Completada"];

/**
 * Texto y clase css de la fecha de entrega (vencida, hoy o normal)
 */
function dueInfo(dueDate, status) {
  const today = new Date().toLocaleDateString("en-CA");
  if (status === "Completada") return { text: dueDate, cls: "" };
  if (dueDate < today) return { text: `Vencida · ${dueDate}`, cls: "task-due--late" };
  if (dueDate === today) return { text: "Vence hoy", cls: "task-due--today" };
  return { text: dueDate, cls: "" };
}

/**
 * metodo que recibe una tarea y devuelve el html de su card como texto
 * @param {object} t
 * @returns {string}
 */
function taskCard(t) {
  const due = dueInfo(t.dueDate, t.status);
  return `
    <article class="task-card task-card--${STATUS_CLASS[t.status] ?? "pending"}"
             data-action="edit" data-id="${t.id}" tabindex="0">
      <div class="d-flex justify-content-between align-items-start gap-3">
        <h2 class="task-title">${escapeHTML(t.name)}</h2>
        <select class="task-badge task-status" data-action="status" data-id="${t.id}" aria-label="Cambiar estado">
          ${STATUSES.map((s) => `<option value="${s}" ${s === t.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>


      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div class="task-meta">
          <span><i class="bi bi-person"></i> ${escapeHTML(t.assignedTo)}</span>
          <span class="${due.cls}"><i class="bi bi-calendar-event"></i> ${escapeHTML(due.text)}</span>
        </div>
        <div class="task-actions">
          <button type="button" class="task-btn task-btn--danger" data-action="delete" data-id="${t.id}" aria-label="Eliminar"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    </article>`;
}

/**
 * Metodo para renderizar el tablero en columnas por estado
 * @param {HTMLElement} container donde se pinta
 * @param {object[]} tasks tareas a mostrar
 */
export function renderTasks(container, tasks) {
  container.innerHTML = `
    <div class="board">
      ${STATUSES.map((status) => {
        const items = tasks.filter((t) => t.status === status);
        return `
          <section class="board-col board-col--${STATUS_CLASS[status]}">
            <header class="board-col-header">
              <h2 class="board-col-title">${status}</h2>
              <span class="board-count">${items.length}</span>
            </header>
            <div class="board-col-body">
              ${items.length
                ? items.map(taskCard).join("")
                : `<p class="board-empty">Sin tareas</p>`}
            </div>
          </section>`;
      }).join("")}
    </div>`;
}