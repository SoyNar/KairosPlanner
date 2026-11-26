import { escapeHTML } from "../../utils/html.js";
import { setAside } from "../core/aside.js";
import { renderTodayAside } from "./renderAside/renderTodayAside.js";
import { progressOf, renderProgressCard } from "../components/shared/progressCard.js";
import { getTasks, updateTask } from "../api/tasks.js";

const STORAGE_KEY = "kayros_tasks";
let allTasks = [];
let activeFilter = "all";

function getLocalTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatHeaderDate() {
  const text = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  return `TU FOCO DE HOY · ${text.toUpperCase()}`;
}

function getFallbackTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // Si el JSON falla, usa los datos mock
    }
  }

  const today = getLocalTodayISO();
  const mockTasks = [
    {
      id: "1",
      name: "Terminar diseño de vistas en Kayros Planner",
      status: "En progreso",
      dueDate: today,
      assignee: "Narciris Mena",
    },
    {
      id: "2",
      name: "Repasar ejercicios de Cálculo Diferencial",
      status: "Pendiente",
      dueDate: today,
      assignee: "Narciris Mena",
    },
    {
      id: "3",
      name: "Revisar estructura de endpoints REST",
      status: "Pendiente",
      dueDate: today,
      assignee: "Narciris Mena",
    },
    {
      id: "4",
      name: "Configurar ilustración de Kayos en el aside",
      status: "Completada",
      dueDate: today,
      assignee: "Narciris Mena",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
  return mockTasks;
}

function renderToday() {
  const todayISO = getLocalTodayISO();

  // Tareas cuya fecha es hoy
  const todayTasks = allTasks.filter((t) => (t.dueDate ?? "").slice(0, 10) === todayISO);

  // Tareas vencidas sin completar (para el aviso de Kayos)
  const overdueCount = allTasks.filter(
    (t) => t.dueDate && t.dueDate.slice(0, 10) < todayISO && t.status !== "Completada"
  ).length;

  // Contadores por estado
  const todoCount  = todayTasks.filter((t) => t.status === "Pendiente").length;
  const doingCount = todayTasks.filter((t) => t.status === "En progreso").length;
  const doneCount  = todayTasks.filter((t) => t.status === "Completada").length;

  const dateLabel = document.getElementById("today-date-label");
  if (dateLabel) dateLabel.textContent = formatHeaderDate();

  document.getElementById("stat-today-todo").textContent  = todoCount;
  document.getElementById("stat-today-doing").textContent = doingCount;
  document.getElementById("stat-today-done").textContent  = doneCount;
  document.getElementById("today-count").textContent =
    `${todayTasks.length} ${todayTasks.length === 1 ? "tarea" : "tareas"} para hoy`;

  // Filtro activo (Todas / Pendiente / En progreso / Completada)
  const visibleTasks = activeFilter === "all"
    ? todayTasks
    : todayTasks.filter((t) => t.status === activeFilter);

  const listEl = document.getElementById("today-task-list");

  if (visibleTasks.length === 0) {
    listEl.innerHTML = `
      <div class="today-empty">
        <img src="./assets/img/kayos.svg" alt="" />
        <h3>Todo despejado por aquí</h3>
        <p>No tienes tareas en esta vista para hoy. Aprovecha para respirar o crear una nueva.</p>
      </div>`;
  } else {
    listEl.innerHTML = visibleTasks.map((task) => {
      const isDone = task.status === "Completada";
      const pillClass =
        task.status === "Completada" ? "today-pill--done" :
        task.status === "En progreso" ? "today-pill--doing" : "today-pill--todo";

      return `
        <article class="today-item ${isDone ? "is-done" : ""}" data-id="${escapeHTML(String(task.id))}">
          <button
            type="button"
            class="today-check"
            data-action="toggle-done"
            aria-label="Marcar como completada"
          >
            <i class="bi bi-check-lg"></i>
          </button>

          <div class="today-item__body">
            <h3 class="today-item__title">${escapeHTML(task.name)}</h3>
            <div class="today-item__meta">
              <span class="today-pill ${pillClass}">${escapeHTML(task.status)}</span>
              ${task.assignee ? `<span><i class="bi bi-person"></i> ${escapeHTML(task.assignee)}</span>` : ""}
              <span><i class="bi bi-clock"></i> Vence hoy</span>
            </div>
          </div>

          <a href="#/tasks" class="btn btn-sm btn-outline-secondary" aria-label="Ver en tablero">
            <i class="bi bi-arrow-up-right"></i>
          </a>
        </article>`;
    }).join("");
  }

  // Franja oscura de progreso del día
  const progressEl = document.getElementById("today-progress");
  if (progressEl) {
    progressEl.innerHTML = `
      ${renderProgressCard(progressOf(todayTasks))}
      <p class="planner-footnote">Tu avance del día en tiempo real.</p>`;
  }

  // Siguiente tarea recomendada (prioriza En progreso, luego Pendiente)
  const nextTask = todayTasks.find((t) => t.status === "En progreso")
                ?? todayTasks.find((t) => t.status === "Pendiente")
                ?? null;

  // Cargar el panel derecho de Kayos usando setAside
  setAside(
    renderTodayAside({
      total: todayTasks.length,
      done: doneCount,
      overdue: overdueCount,
      next: nextTask,
    })
  );
}

function bindTodayEvents() {
  // Botones de filtro rápido
  document.querySelectorAll("[data-today-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.todayFilter;
      document.querySelectorAll("[data-today-filter]").forEach((b) =>
        b.classList.toggle("is-active", b === btn)
      );
      renderToday();
    });
  });

  // Marcar / desmarcar tarea como completada
  const listEl = document.getElementById("today-task-list");
  listEl?.addEventListener("click", async (e) => {
    const toggleBtn = e.target.closest('[data-action="toggle-done"]');
    if (!toggleBtn) return;

    const card = toggleBtn.closest("[data-id]");
    const id = card?.dataset.id;
    const task = allTasks.find((t) => String(t.id) === String(id));
    if (!task) return;

    const nextStatus = task.status === "Completada" ? "Pendiente" : "Completada";
    task.status = nextStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks));
    renderToday();

    try {
      await updateTask(task.id, { ...task, status: nextStatus });
    } catch (err) {
      console.warn("API no disponible aún, cambio guardado localmente:", err);
    }
  });
}

export async function initTodayPage() {
  activeFilter = "all";

  try {
    const apiTasks = await getTasks();
    allTasks = Array.isArray(apiTasks) && apiTasks.length > 0 ? apiTasks : getFallbackTasks();
  } catch {
    allTasks = getFallbackTasks();
  }

  renderToday();
  bindTodayEvents();
}