// js/pages/schedule.js
import { setAside } from "../core/aside.js";
import { loadStyle } from "../core/styles.js";
import { escapeHTML } from "../../utils/html.js";
import { ManagerBlock } from "../../services/maganerBlock.js";
import { renderScheduleAside } from "./renderAside/scheduleAside.js";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 a 21:00
const DAY_NAMES = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic"];
const TYPE_LABEL = { work: "Trabajo", class: "Clases", study: "Estudio", personal: "Personal" };

export async function initSchedulePage() {
  await loadStyle("css/views/planner.css");

  const root = document.getElementById("schedule-main");
  if (!root) {
    console.error("No se encontró #schedule-main en Mi horario.");
    return;
  }

  let weekStart = startOfWeek(new Date());

  const draw = () => render(root, weekStart);

  // Navegación por delegación: un solo listener para toda la barra
  root.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-nav]");
    if (!btn) return;

    if (btn.dataset.nav === "prev") weekStart = addDays(weekStart, -7);
    if (btn.dataset.nav === "next") weekStart = addDays(weekStart, 7);
    if (btn.dataset.nav === "today") weekStart = startOfWeek(new Date());

    draw();
  });

  draw();
  setAside(renderScheduleAside());
}

function render(root, weekStart) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayISO = toISO(new Date());
  const todayIndex = days.findIndex((d) => toISO(d) === todayISO);
  const blocks = ManagerBlock.getAll();

  // Bloques de esta semana: fecha exacta o día de la semana recurrente
  const weekBlocks = days.flatMap((day, i) =>
    blocks
      .filter((b) => (b.date ? b.date === toISO(day) : b.weekday === i))
      .map((b) => ({ ...b, dayIndex: i }))
  );

  const totals = Object.fromEntries(Object.keys(TYPE_LABEL).map((t) => [t, 0]));
  weekBlocks.forEach((b) => (totals[b.type] += b.end - b.start));

  root.innerHTML = `
    ${toolbarHTML(weekStart, days[6])}

    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div class="sch-legend">
        ${Object.entries(TYPE_LABEL).map(([type, label]) =>
          `<span class="sch-chip sch-chip--${type}">${label} · ${pad(totals[type])} h</span>`
        ).join("")}
      </div>
      <span class="sch-timezone">Hora local · 24 h</span>
    </div>

    <div class="sch-scroll">
      <div class="sch-grid">
        <div class="sch-corner">HORA</div>

        ${days.map((d, i) => `
          <div class="sch-day-head${i === todayIndex ? " sch-day-head--today" : ""}" style="--day: ${i + 1}">
            <span>${DAY_NAMES[i]}</span><strong>${d.getDate()}</strong>
          </div>`).join("")}

        ${HOURS.map((h) => `<div class="sch-hour" style="--h: ${h}">${pad(h)}:00</div>`).join("")}

        <div class="sch-bg" aria-hidden="true">
          ${days.map((_, i) => `<div${i === todayIndex ? ' class="sch-bg-today"' : ""}></div>`).join("")}
        </div>

        ${weekBlocks.map(blockHTML).join("")}
      </div>
    </div>`;
}

function toolbarHTML(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const range = sameMonth
    ? `${start.getDate()} – ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`
    : `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`;
  const title = capitalize(MONTHS[start.getMonth()]) + " " + start.getFullYear();

  return `
    <div class="sch-toolbar mb-3">
      <div class="sch-nav-group">
        <h2 class="sch-month-title m-0">${title}</h2>
        <div class="sch-nav-arrows">
          <button type="button" class="sch-icon-btn" data-nav="prev" aria-label="Semana anterior"><i class="bi bi-chevron-left"></i></button>
          <button type="button" class="sch-icon-btn" data-nav="next" aria-label="Semana siguiente"><i class="bi bi-chevron-right"></i></button>
        </div>
        <button type="button" class="sch-today-btn" data-nav="today">Hoy</button>
        <span class="sch-date-range">${range}</span>
      </div>

      <div class="sch-view-toggle">
        <button type="button" class="sch-toggle-btn is-active">Semana</button>
        <button type="button" class="sch-toggle-btn" disabled>Mes</button>
      </div>
    </div>`;
}

function blockHTML(b) {
  return `
    <article class="sch-block sch-block--${b.type}" style="--day: ${b.dayIndex + 1}; --start: ${b.start}; --end: ${b.end}">
      <div>
        <h3>${escapeHTML(b.title)}</h3>
        <span>${pad(b.start)}:00 – ${pad(b.end)}:00</span>
      </div>
      ${b.note ? `<small>${escapeHTML(b.note)}</small>` : ""}
    </article>`;
}

// ----- fechas -----

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // lunes
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}