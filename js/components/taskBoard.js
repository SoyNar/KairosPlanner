import { escapeHTML } from "../../utils/html.js";
import { mascotSVG } from "../../utils/mascot.js";
import { progressOf, renderProgressCard } from "./shared/progressCard.js";

// clase css por estado
const STATUS_CLASS = {
  "Pendiente": "pending",
  "En progreso": "progress",
  "Completada": "done",
};
const STATUSES = ["Pendiente", "En progreso", "Completada"];

// icono de cada columna
const STATUS_ICON = {
  "Pendiente": "bi-circle",
  "En progreso": "bi-circle-half",
  "Completada": "bi-check-lg",
};

// cara de Kai por estado
const MOOD = {
  "Pendiente": "pending",
  "En progreso": "progress",
  "Completada": "done",
};

// true cuando la pantalla es de celular (menos de 992px)
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
 * Inicial del responsable para el avatar
 */
function initial(name) {
  return escapeHTML((name || "?").trim().charAt(0).toUpperCase());
}

/**
 * Card de tarea.
 * @param {object} t tarea
 * @param {string|null} badge texto del badge arriba (null = sin badge)
 * @returns {string}
 */
function taskCard(t, badge = null) {
  const due = dueInfo(t.dueDate, t.status);
  const isDone = t.status === "Completada";

  return `
    <article class="task-card task-card--${STATUS_CLASS[t.status] ?? "pending"}"
             data-action="edit" data-id="${t.id}" tabindex="0" draggable="true">

      <div class="task-top">
        ${badge
          ? `<span class="task-badge">${isDone ? '<i class="bi bi-check"></i> ' : ""}${escapeHTML(badge)}</span>`
          : "<span></span>"}
        <button type="button" class="task-btn task-btn--danger"
                data-action="delete" data-id="${t.id}" aria-label="Eliminar">
          <i class="bi bi-trash"></i>
        </button>
      </div>

      <h2 class="task-title">${escapeHTML(t.name)}</h2>

      <div class="task-person">
        <span class="task-avatar">${initial(t.assignedTo)}</span>
        <span>${escapeHTML(t.assignedTo)}</span>
      </div>

      <div class="task-foot">
        <span class="task-date ${due.cls}">
          <i class="bi bi-clock"></i> ${escapeHTML(due.text)}
        </span>
        ${isDone
          ? `<span class="task-check"><i class="bi bi-check"></i></span>`
          : `<button type="button" class="task-btn" data-action="edit" data-id="${t.id}"
                     aria-label="Editar tarea"><i class="bi bi-arrow-up-right"></i></button>`}
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
          ? visible.map((t) => taskCard(t, t.status)).join("")
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
        const badge = status === "Completada" ? "Completada" : "Tarea";

        return `
          <section class="board-col board-col--${STATUS_CLASS[status]}" data-status="${status}">
            <header class="board-col-header">
              <h2 class="board-col-title">
                <i class="bi ${STATUS_ICON[status]}"></i> ${status}
              </h2>
              <span class="board-count">${items.length}</span>
            </header>

            <div class="board-col-body">
              ${items.length
                ? items.map((t) => taskCard(t, badge)).join("")
                : emptyState(status)}
            </div>

            <button type="button" class="board-add"
                    data-bs-toggle="modal" data-bs-target="#task-modal">
              <i class="bi bi-plus"></i> Añadir tarea
            </button>

            <footer class="board-col-foot">
              ${items.length} ${items.length === 1 ? "tarea" : "tareas"}
            </footer>
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

    const progressEl = document.getElementById("tasks-progress");
if (progressEl) {
  progressEl.innerHTML = `
    ${renderProgressCard({
      ...progressOf(tasks),
      title: "Progreso general.",
    })}
    <p class="planner-footnote">Actualizado automáticamente según el estado de tus tareas.</p>`;
}
}