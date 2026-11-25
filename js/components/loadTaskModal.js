export async function loadTaskModal(container) {
  const response = await fetch(
    "/js/components/templates/taskForm.html"
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar el formulario de tareas");
  }

  container.insertAdjacentHTML(
    "beforeend",
    await response.text()
  );
}