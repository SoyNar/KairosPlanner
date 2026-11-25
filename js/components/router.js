
import { initTasksPage } from "../pages/task.js";
const routes = {
  "#/today": {page:"pages/today.html",init:initTasksPage},
  "#/week": {page:"pages/week.html",init:initTasksPage},
  "#/my-schedule": {page:"pages/schedule.html",init:initTasksPage},
 "#/tasks": { page: "pages/tasks.html",init:initTasksPage },
  "#/new-task": { page: "pages/new-task.html",  },
};

export async function navigate() {
  const route = routes[location.hash];
  const content = document.getElementById("content");
  if (!route) { content.textContent = "Pantalla no encontrada"; return; }
  const res = await fetch(route.page);
  if(!res.ok){
    content.textContent ="No se puede cargar la pantalla";
    return;

  }
  content.innerHTML = await res.text();
  if(route.init) route.init();
}