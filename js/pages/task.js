
import { ManagerTask } from "../../services/ManagerTask.js";
import {
  renderTasks,
  mobileQuery,
  setTaskFilter
} from "../components/taskBoard.js";

import { withLoader } from "../../utils/loader.js";
import { validateTaskForm, showErrors } from "./taskValidation.js";

let cleanupTasksPage = null;

/**
 * Inicializa la página de tareas.
 */
export function initTasksPage() {

  // Evitar listeners duplicados si se vuelve a entrar a la página
  if (cleanupTasksPage) {
    cleanupTasksPage();
    cleanupTasksPage = null;
  }

  const controller = new AbortController();
  const { signal } = controller;

  // Elementos del tablero
  const list = document.getElementById("task-list");

  // Elementos del modal global
  const form = document.getElementById("task-form");
  const modalEl = document.getElementById("task-modal");
  const modalTitle = document.getElementById("task-modal-title");
  const formError = document.getElementById("form-error");

  if (!form || !list || !modalEl || !modalTitle || !formError) {
    console.error("No se encontraron los elementos necesarios para Mis Asuntos.");
    controller.abort();
    return;
  }

  let editingId = null;
  let saving = false;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  // Actualizar tablero
  const refresh = () => {
    renderTasks(list, ManagerTask.getAll());
  };

  // Limpiar formulario
  function resetForm() {
    editingId = null;
    form.reset();

    form.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });

    formError.textContent = "";
    modalTitle.textContent = "Nueva tarea";
  }

  // Abrir tarea para editar
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
    modal.show();
  }

  // Eventos del modal
  modalEl.addEventListener("hidden.bs.modal", resetForm, { signal });

  // Cambio de tamaño de pantalla
  mobileQuery.addEventListener("change", refresh, { signal });

  // Filtros y acciones del tablero
  list.addEventListener("click", (event) => {

    const chip = event.target.closest("[data-filter]");

    if (chip) {
      setTaskFilter(chip.dataset.filter);
      refresh();
      return;
    }

    const btn = event.target.closest("[data-action]");
    if (!btn) return;

    const { action, id } = btn.dataset;

    if (action === "edit") {
      openEdit(id);
    }

    if (action === "delete" && confirm("¿Eliminar esta tarea?")) {
      ManagerTask.remove(id);
      refresh();
    }

  }, { signal });

  // Drag and drop
  const clearOver = () => {
    list.querySelectorAll(".is-over").forEach((el) => {
      el.classList.remove("is-over");
    });

    list.querySelectorAll(".drop-before").forEach((el) => {
      el.classList.remove("drop-before");
    });
  };

  function getCardAfter(col, y) {
    const cards = [
      ...col.querySelectorAll(".task-card:not(.is-dragging)")
    ];

    return cards.find((card) => {
      const box = card.getBoundingClientRect();
      return y < box.top + box.height / 2;
    }) ?? null;
  }

  list.addEventListener("dragover", (event) => {
    const col = event.target.closest(".board-col");
    if (!col) return;

    event.preventDefault();
    clearOver();
    col.classList.add("is-over");

    const dragging = list.querySelector(".is-dragging");

    if (dragging && col.contains(dragging)) {
      getCardAfter(col, event.clientY)?.classList.add("drop-before");
    }

  }, { signal });

  list.addEventListener("drop", (event) => {
    const col = event.target.closest(".board-col");
    if (!col) return;

    event.preventDefault();

    const id = event.dataTransfer.getData("text/plain");
    const task = ManagerTask.getById(id);

    const sameColumn = task && task.status === col.dataset.status;

    const beforeId = sameColumn
      ? getCardAfter(col, event.clientY)?.dataset.id ?? null
      : null;

    clearOver();

    if (!task) return;

    ManagerTask.move(id, col.dataset.status, beforeId);
    refresh();

  }, { signal });

  list.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".task-card");
    if (!card) return;

    event.dataTransfer.setData("text/plain", card.dataset.id);
    event.dataTransfer.effectAllowed = "move";

    card.classList.add("is-dragging");

  }, { signal });

  list.addEventListener("dragend", (event) => {
    event.target.closest(".task-card")?.classList.remove("is-dragging");
    clearOver();

  }, { signal });

  // Guardar tarea
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

          modal.hide();
          refresh();
        },
        {
          text: isEdit ? "Guardando cambios…" : "Creando tu tarea…",
          doneText: isEdit ? "¡Cambios guardados!" : "¡Tarea creada!",
        }
      );

    } catch (error) {
      console.error(error);
      formError.textContent =
        "No se pudo guardar la tarea. Inténtalo de nuevo.";

    } finally {
      saving = false;
    }

  }, { signal });

  // Render inicial
  refresh();

  // Función para limpiar los eventos al salir de la página
  cleanupTasksPage = () => {
    controller.abort();
  };
}
