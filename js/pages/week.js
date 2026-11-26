// js/pages/week.js
import { ManagerTask } from "../../services/ManagerTask.js";
import { setAside } from "../core/aside.js";
import { loadStyle } from "../core/styles.js";
import { renderWeekAside } from "./renderAside/renderAsideWeek.js";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export async function initWeekPage() {
  await loadStyle("css/views/week.css");
  await loadStyle("css/views/planner.css");

  const board = document.querySelector(".week-board");
  if (!board) {
    console.error("No se encontró el tablero de Mi semana.");
    return;
  }

  // Lunes de la semana actual (0 = lunes)
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIndex);

  const tasks = ManagerTask.getAll();

  board.innerHTML = DAY_NAMES.map((name, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const dayTasks = tasks.filter(
      (t) => t.dueDate === toISODate(date)
    );

    const classes = [
      "week-day",
      i < todayIndex ? "week-day--past" : "",
      i === todayIndex ? "week-day--today" : "",
    ].join(" ");

    return `
      <article class="${classes}">
        ${i === todayIndex ? '<span class="week-today-flag">HOY</span>' : ""}
        <header class="week-day-header">
          <div>
            <span class="week-day-name">${name}</span>
            <strong class="week-day-number">${date.getDate()}</strong>
          </div>
          <span class="week-day-count">${dayTasks.length}</span>
        </header>
        <div class="week-day-list">
          ${dayTasks.length
            ? dayTasks.map(taskItem).join("")
            : `<div class="week-empty"><i class="bi bi-cup-hot"></i><span>Día libre</span></div>`}
        </div>
      </article>`;
  }).join("");

  // Resumen
  const pending = tasks.filter((t) => t.status !== "Completada").length;
  const done = tasks.filter((t) => t.status === "Completada").length;
  const overdue = tasks.filter(
    (t) => t.status !== "Completada" && t.dueDate < toISODate(today)
  ).length;

  setText(".week-stat--pending strong", pending);
  setText(".week-stat--done strong", done);
  setText(".week-stat--overdue strong", overdue);

 const next = tasks.find((t) => t.status === "En progreso")
          ?? tasks.find((t) => t.status === "Pendiente");

setAside(renderWeekAside({ pending, overdue, next }));
}

// ----- helpers -----

function taskItem(task) {
  const overdue = task.status !== "Completada" && task.dueDate < toISODate(new Date());
  const cls = task.status === "Completada" ? "week-item--done"
            : overdue ? "week-item--overdue"
            : "week-item--task";
  return `
    <article class="week-item ${cls}">
      <h3>${escapeHTML(task.name)}</h3>
    </article>`;
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = String(value).padStart(2, "0");
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

