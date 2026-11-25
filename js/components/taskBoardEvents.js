
import { ManagerTask } from "../../services/ManagerTask.js";
import { setTaskFilter } from "./taskBoard.js";
import { initTaskDragDrop } from "./taskDragDrop.js";

/**
 * Inicializa los eventos del tablero.
 */
export function initTaskBoardEvents({
  list,
  onEdit,
  onRefresh,
}) {
  // Filtrar tareas y gestionar acciones
  list.addEventListener("click", (event) => {

    // Filtros de la vista móvil
    const chip = event.target.closest("[data-filter]");

    if (chip) {
      setTaskFilter(chip.dataset.filter);
      onRefresh();
      return;
    }

    // Acciones de las tarjetas
    const btn = event.target.closest("[data-action]");

    if (!btn) return;

    const { action, id } = btn.dataset;

    if (action === "edit") {
      onEdit(id);
    }

    if (action === "delete") {
      if (!confirm("¿Eliminar esta tarea?")) return;

      ManagerTask.remove(id);
      onRefresh();
    }
  });

  // Inicializar arrastrar y soltar
  initTaskDragDrop(list, onRefresh);
}
