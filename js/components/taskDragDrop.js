
import { ManagerTask } from "../../services/ManagerTask.js";

/**
 * Inicializa Drag & Drop del tablero.
 */
export function initTaskDragDrop(list, onRefresh) {

  // Limpia los estilos de las columnas
  // y tarjetas durante el arrastre.
  const clearOver = () => {
    list.querySelectorAll(".is-over").forEach((el) => {
      el.classList.remove("is-over");
    });

    list.querySelectorAll(".drop-before").forEach((el) => {
      el.classList.remove("drop-before");
    });
  };

  // Busca la tarjeta antes de la cual se soltará
  // la tarea según la posición del cursor.
  function getCardAfter(col, y) {
    const cards = [
      ...col.querySelectorAll(".task-card:not(.is-dragging)")
    ];

    return (
      cards.find((card) => {
        const box = card.getBoundingClientRect();

        return y < box.top + box.height / 2;
      }) ?? null
    );
  }

  // Al comenzar a arrastrar
  list.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".task-card");

    if (!card) return;

    event.dataTransfer.setData(
      "text/plain",
      card.dataset.id
    );

    event.dataTransfer.effectAllowed = "move";

    card.classList.add("is-dragging");
  });

  // Al pasar sobre una columna
  list.addEventListener("dragover", (event) => {
    const col = event.target.closest(".board-col");

    if (!col) return;

    event.preventDefault();

    clearOver();

    col.classList.add("is-over");

    const dragging = list.querySelector(".is-dragging");

    // Indicador visual al reordenar dentro de la misma columna
    if (dragging && col.contains(dragging)) {
      getCardAfter(col, event.clientY)
        ?.classList.add("drop-before");
    }
  });

  // Al soltar la tarea
  list.addEventListener("drop", (event) => {
    const col = event.target.closest(".board-col");

    if (!col) return;

    event.preventDefault();

    const id = event.dataTransfer.getData("text/plain");

    const task = ManagerTask.getById(id);

    if (!task) {
      clearOver();
      return;
    }

    const sameColumn = task.status === col.dataset.status;

    const beforeId = sameColumn
      ? getCardAfter(col, event.clientY)?.dataset.id ?? null
      : null;

    clearOver();

    ManagerTask.move(
      id,
      col.dataset.status,
      beforeId
    );

    onRefresh();
  });

  // Al terminar el arrastre
  list.addEventListener("dragend", (event) => {
    event.target.closest(".task-card")
      ?.classList.remove("is-dragging");

    clearOver();
  });
}
