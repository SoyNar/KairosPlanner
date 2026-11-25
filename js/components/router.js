
import { initTasksPage } from "../pages/task.js";

const routes = {
    "#/today": {
        page: "pages/today.html"
    },
    "#/week": {
        page: "pages/week.html"
    },
    "#/my-schedule": {
        page: "pages/schedule.html"
    },
    "#/tasks": {
        page: "pages/tasks.html",
        init: initTasksPage
    },
    "#/new-task": {
        page: "pages/new-task.html"
    },
};

export async function navigate() {
    const route = routes[location.hash];
    const content = document.getElementById("content");

    if (!route) {
        content.textContent = "Pantalla no encontrada";
        return;
    }

    const res = await fetch(route.page);

    if (!res.ok) {
        content.textContent = "No se puede cargar la pantalla";
        return;
    }

    content.innerHTML = await res.text();

    // Esperar la inicialización de la página
    if (route.init) {
        await route.init();
    }
}
