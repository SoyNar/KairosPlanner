
import { initTasksPage } from "../pages/task.js";
const routes = {
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