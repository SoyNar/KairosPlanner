const routes = {
 "#/tasks": { page: "pages/tasks.html" },
  "#/new-task": { page: "pages/new-task.html" },
};

export async function navigate() {
  const route = routes[location.hash];
  const content = document.getElementById("content");
  if (!route) { content.textContent = "Pantalla no encontrada"; return; }
  const res = await fetch(route.page);
  content.innerHTML = await res.text();
}