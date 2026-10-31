import { ManagerTask } from "../../services/ManagerTask.js";
import { renderTasks } from "../components/taskBoard.js";
import { withLoader } from "../../utils/loader.js"
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
  const formError = document.getElementById("form-error");

  // null = modo crear; con id = modo editar
  let editingId = null;
  // evita enviar dos veces el formulario (por ejemplo, con Enter) mientras guarda
  let saving = false;

  // vuelve a pintar el tablero con lo que hay guardado
  const refresh = () => renderTasks(list, ManagerTask.getAll());

  // deja el formulario y el modal como nuevos
  function resetForm() {
    editingId = null;
    form.reset();
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    formError.textContent = "";
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

  // ===== mover tareas arrastrando entre columnas =====
  // (reemplaza al antiguo listener "change" del select de estado)
 const clearOver = () => {
  list.querySelectorAll(".is-over").forEach((el) => el.classList.remove("is-over"));
  list.querySelectorAll(".drop-before").forEach((el) => el.classList.remove("drop-before"));
};

// devuelve la card ANTES de la cual se soltaria (la primera cuyo punto medio
// queda por debajo del cursor), o null si va al final de la columna
function getCardAfter(col, y) {
  const cards = [...col.querySelectorAll(".task-card:not(.is-dragging)")];
  return (
    cards.find((card) => {
      const box = card.getBoundingClientRect();
      return y < box.top + box.height / 2;
    }) ?? null
  );
}

list.addEventListener("dragover", (event) => {
  const col = event.target.closest(".board-col");
  if (!col) return;
  event.preventDefault();
  clearOver();
  col.classList.add("is-over");

  // la barra de "caera aqui" solo tiene sentido si reordenas dentro de la misma columna
  const dragging = list.querySelector(".is-dragging");
  if (dragging && col.contains(dragging)) {
    getCardAfter(col, event.clientY)?.classList.add("drop-before");
  }
});

list.addEventListener("drop", (event) => {
    const col = event.target.closest(".board-col");
  if (!col) return;
  event.preventDefault();

  const id = event.dataTransfer.getData("text/plain");
  const task = ManagerTask.getById(id);
  const sameColumn = task && task.status === col.dataset.status;

  // otra columna: beforeId = null, o sea al final
  const beforeId = sameColumn
    ? getCardAfter(col, event.clientY)?.dataset.id ?? null
    : null;
  clearOver();

  if (!task) return;

  ManagerTask.move(id, col.dataset.status, beforeId);
  refresh();
});
list.addEventListener("dragstart", (event) => {
  const card = event.target.closest(".task-card");
  if (!card) return;
  event.dataTransfer.setData("text/plain", card.dataset.id);
  event.dataTransfer.effectAllowed = "move";
  card.classList.add("is-dragging");
});

list.addEventListener("dragend", (event) => {
  event.target.closest(".task-card")?.classList.remove("is-dragging");
  clearOver();
});
  // ===== fin del drag and drop =====

  // al cerrar el modal se limpia el estado
  modalEl.addEventListener("hidden.bs.modal", resetForm);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (saving) return;

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

    // se guardan ANTES del await: resetForm borra editingId al cerrar el modal
    const isEdit = editingId !== null;
    const id = editingId;

    saving = true;
    formError.textContent = "";

    try {
      await withLoader(
        () => {
          if (isEdit) {
            ManagerTask.update(id, data);
          } else {
            ManagerTask.add(data);
          }
          // el tablero y el modal se actualizan por debajo del overlay
          bootstrap.Modal.getOrCreateInstance(modalEl).hide();
          refresh();
        },
        {
          text: isEdit ? "Guardando cambios…" : "Creando tu tarea…",
          doneText: isEdit ? "¡Cambios guardados!" : "¡Tarea creada!",
        }
      );
    } catch (error) {
      console.error(error);
      formError.textContent = "No se pudo guardar la tarea. Inténtalo de nuevo.";
    } finally {
      saving = false;
    }
  });
}