import { ManagerTask } from "../../services/ManagerTask.js";
import { renderTasks } from "../components/taskBoard.js";
import { validateTaskForm, showErrors } from "./taskValidation.js";

/**
 * Metodo de arranque de la pagina
 * para que arranque una vez cuando las tareas estan ya en el dom
 */
export function initTasksPage() {
  const form = document.getElementById("task-form");
  const list = document.getElementById("task-list");
  const modalEl = document.getElementById("task-modal");
  const modalTitle = document.getElementById("task-modal-title");

  // null = modo crear; con id = modo editar
  let editingId = null;

  // vuelve a pintar el tablero con lo que hay guardado
  const refresh = () => renderTasks(list, ManagerTask.getAll());

  // deja el formulario y el modal como nuevos
  function resetForm() {
    editingId = null;
    form.reset();
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    modalTitle.textContent = "Nueva tarea";
  }

  /**
   * Metodo para cargar la tarea y abrir el modal en modo editar
   * @param {string} id
   */
  function openEdit(id) {
    const task = ManagerTask.getById(id);
    if (!task) return;

    editingId = id;
    form.elements.name.value = task.name;
    form.elements.description.value = task.description;
    form.elements.assignedTo.value = task.assignedTo;
    form.elements.dueDate.value = task.dueDate;
    form.elements.status.value = task.status;
    modalTitle.textContent = "Editar tarea";
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  refresh();

  // delegacion de eventos: un solo listener para todos los botones de la lista
  list.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;

    if (action === "edit") openEdit(id);

    if (action === "delete" && confirm("¿Eliminar esta tarea?")) {
      ManagerTask.remove(id);
      refresh();
    }
  });

  // cambio rapido de estado desde la card
  list.addEventListener("change", (event) => {
    const select = event.target.closest('[data-action="status"]');
    if (!select) return;

    ManagerTask.update(select.dataset.id, { status: select.value });
    refresh();
  });

  // al cerrar el modal se limpia el estado
  modalEl.addEventListener("hidden.bs.modal", resetForm);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
      name: form.elements.name.value.trim(),
      description: form.elements.description.value.trim(),
      assignedTo: form.elements.assignedTo.value.trim(),
      dueDate: form.elements.dueDate.value,
      status: form.elements.status.value,
    };

    const result = validateTaskForm(
      data.name,
      data.description,
      data.assignedTo,
      data.dueDate,
      data.status
    );
    showErrors(form, result.errors);
    if (!result.isValid) return;

    if (editingId) {
      ManagerTask.update(editingId, data);
    } else {
      ManagerTask.add(data);
    }

    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    refresh();
  });
}