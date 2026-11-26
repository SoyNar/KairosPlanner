import { initTasksPage } from "../pages/task.js";
import { loadStyle } from "../../js/core/styles.js"; // ajusta la ruta
import { initWeekPage } from "../pages/week.js";
import { setAside } from "../core/aside.js";
import { initSchedulePage } from "../pages/schedule.js";
import { initTodayPage } from "../pages/today.js";

const routes = {
    "#/today": {
        page: "pages/today.html",
        title: "Mis tareas Hoy",
        css: ["css/views/today.css","css/views/planner.css"],
        init:initTodayPage
    },
    "#/week": {
        page: "pages/week.html",
        css: ["css/views/week.css","css/views/planner.css"],
        init:initWeekPage
    },
    "#/my-schedule": {
        page: "pages/schedule.html",
        css: ["css/views/schedule.css"],
        init:initSchedulePage
    },
    "#/tasks": {
        page: "pages/tasks.html",
        css: ["css/views/tasks.css", "css/views/board.css","css/views/planner.css"],
        init: initTasksPage
    },
    "#/new-task": {
        page: "pages/new-task.html",
        css: []
    },
};

let navigationId = 0;

export async function navigate() {
    const route = routes[location.hash];
    const content = document.getElementById("content");
    const currentId = ++navigationId;

const titleEl = document.getElementById("topbar-title");
if (titleEl) titleEl.textContent = route.title ?? "";

    if (!route) {
        content.textContent = "Pantalla no encontrada";
        return;
    }

    try {
        // HTML y CSS se descargan en paralelo
        const [res] = await Promise.all([
            fetch(route.page),
            ...(route.css ?? []).map(loadStyle),
        ]);

        if (!res.ok) {
            content.textContent = "No se puede cargar la pantalla";
            return;
        }

        const html = await res.text();

        // Si el usuario ya navegó a otra ruta mientras cargaba, no pintes esta
        if (currentId !== navigationId) return;

        content.innerHTML = html;
        setAside("");

        if (route.init) {
            await route.init();
        }
    } catch (error) {
        console.error(error);
        content.textContent = "No se puede cargar la pantalla";
    }
}