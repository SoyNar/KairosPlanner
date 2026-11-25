
import { ManagerTask } from "../../services/ManagerTask.js";
import { renderTasks, mobileQuery } from "../components/taskBoard.js";
import { initTaskBoardEvents } from "../components/taskBoardEvents.js";
import { initTaskForm } from "../components/taskForm.js";

/**
 * Inicializa la página de tareas.
 */
export function initTasksPage() {
  const form = document.getElementById("task-form");
  const list = document.getElementById("task-list");
  const modalEl = document.getElementById("task-modal");
  const modalTitle = document.getElementById("task-modal-title");
  const formError = document.getElementById("form-error");

  // Actualiza el tablero
  const refresh = () => {
    renderTasks(list, ManagerTask.getAll());
  };

  // Inicializa el formulario
  const taskForm = initTaskForm({
    form,
    modalEl,
    modalTitle,
    formError,
    onSaved: refresh,
  });

  // Inicializa eventos del tablero
  initTaskBoardEvents({
    list,
    onEdit: taskForm.openEdit,
    onRefresh: refresh,
  });

  // Detecta cambios entre vista móvil y escritorio
  mobileQuery.addEventListener("change", refresh);

  // Render inicial
  refresh();
}
