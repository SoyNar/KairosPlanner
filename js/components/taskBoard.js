import { escapeHTML } from "../../utils/html.js";
import { mascotSVG } from "../../utils/mascot.js";

// clase css por estado
const STATUS_CLASS = {
  "Pendiente": "pending",
  "En progreso": "progress",
  "Completada": "done",
};
const STATUSES = ["Pendiente", "En progreso", "Completada"];

// cara de Kai por estado (coincide con las claves de STATUS_CLASS)
const MOOD = {
  "Pendiente": "pending",
  "En progreso": "progress",
  "Completada": "done",
};

// true cuando la pantalla es de celular (menos de 768px)
export const mobileQuery = window.matchMedia("(max-width: 991.98px)");
// filtro activo de la vista movil: "all" o uno de STATUSES
let activeFilter = "all";
export function setTaskFilter(value) {
  activeFilter = value;
}

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
 * @param {boolean} showStatus muestra el badge de estado (vista lista en movil)
 * @returns {string}
 */
function taskCard(t, showStatus = false) {
  const due = dueInfo(t.dueDate, t.status);
  return `
    <article class="task-card task-card--${STATUS_CLASS[t.status] ?? "pending"}"
             data-action="edit" data-id="${t.id}" tabindex="0" draggable="true">
      <h2 class="task-title">${escapeHTML(t.name)}</h2>

      <div class="d-flex justify-content-between align-items-center gap-3">
        <div class="task-meta">
          ${showStatus ? `<span class="task-badge">${escapeHTML(t.status)}</span>` : ""}
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
 * Estado vacio: Kai con la cara de ese estado
 */
function emptyState(status) {
  return `
    <div class="board-empty">
      ${mascotSVG(MOOD[status], { size: 72 })}
      <p class="m-0">Sin tareas</p>
    </div>`;
}

/**
 * Vista movil: lista unica con chips para filtrar por estado.
 * Orden: pendientes primero por fecha de entrega, completadas al final.
 * @param {object[]} tasks
 * @returns {string}
 */
function taskListView(tasks) {
  const visible = tasks
    .filter((t) => activeFilter === "all" || t.status === activeFilter)
    .sort(
      (a, b) =>
        (a.status === "Completada") - (b.status === "Completada") ||
        a.dueDate.localeCompare(b.dueDate)
    );

  const chips = ["all", ...STATUSES]
    .map(
      (s) => `
    <button type="button" data-filter="${s}"
            class="task-filter ${s === activeFilter ? "is-active" : ""}">
      ${s === "all" ? "Todas" : s}
    </button>`
    )
    .join("");

  return `
    <div class="task-filters">${chips}</div>
    <div class="task-stack">
      ${
        visible.length
          ? visible.map((t) => taskCard(t, true)).join("")
          : emptyState(MOOD[activeFilter] ? activeFilter : "Pendiente")
      }
    </div>`;
}

/**
 * Vista web: tablero en columnas por estado
 * @param {object[]} tasks
 * @returns {string}
 */
function taskBoardView(tasks) {
  return `
    <div class="board">
      ${STATUSES.map((status) => {
        const items = tasks.filter((t) => t.status === status);
        return `
          <section class="board-col board-col--${STATUS_CLASS[status]}" data-status="${status}">
            <header class="board-col-header">
              <h2 class="board-col-title">${status}</h2>
              <span class="board-count">${items.length}</span>
            </header>
            <div class="board-col-body">
              ${items.length ? items.map((t) => taskCard(t)).join("") : emptyState(status)}
            </div>
          </section>`;
      }).join("")}
    </div>`;
}

/**
 * Metodo para renderizar las tareas:
 * lista con filtros en movil, tablero por columnas en web
 * @param {HTMLElement} container donde se pinta
 * @param {object[]} tasks tareas a mostrar
 */
export function renderTasks(container, tasks) {
  container.innerHTML = mobileQuery.matches
    ? taskListView(tasks)
    : taskBoardView(tasks);
}