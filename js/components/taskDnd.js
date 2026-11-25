/**
 * Arrastrar y soltar con reordenamiento dentro de la columna.
 * @param {HTMLElement} container #task-list
 * @param {(id: string, status: string, beforeId: string|null) => void} onDrop
 */
export function initTaskDnd(container, onDrop) {
  const clearOver = () => {
    container.querySelectorAll(".is-over").forEach((el) => el.classList.remove("is-over"));
    container.querySelectorAll(".drop-before").forEach((el) => el.classList.remove("drop-before"));
  };

  // card ANTES de la cual se soltaría, o null si va al final
  function getCardAfter(col, y) {
    const cards = [...col.querySelectorAll(".task-card:not(.is-dragging)")];
    return cards.find((card) => {
      const box = card.getBoundingClientRect();
      return y < box.top + box.height / 2;
    }) ?? null;
  }

  container.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".task-card");
    if (!card) return;
    e.dataTransfer.setData("text/plain", card.dataset.id); // Firefox lo exige
    e.dataTransfer.effectAllowed = "move";
    requestAnimationFrame(() => card.classList.add("is-dragging"));
  });

  container.addEventListener("dragover", (e) => {
    const col = e.target.closest(".board-col");
    const dragging = container.querySelector(".is-dragging");
    if (!col || !dragging) return; // ignora archivos arrastrados desde fuera
    e.preventDefault();
    clearOver();
    col.classList.add("is-over");
    if (col.contains(dragging)) getCardAfter(col, e.clientY)?.classList.add("drop-before");
  });

  container.addEventListener("drop", (e) => {
    const col = e.target.closest(".board-col");
    const dragging = container.querySelector(".is-dragging");
    if (!col || !dragging) return;
    e.preventDefault();

    const sameColumn = col.contains(dragging);
    const beforeId = sameColumn ? getCardAfter(col, e.clientY)?.dataset.id ?? null : null;
    clearOver();
    onDrop(dragging.dataset.id, col.dataset.status, beforeId);
  });

  container.addEventListener("dragend", (e) => {
    e.target.closest(".task-card")?.classList.remove("is-dragging");
    clearOver();
  });
}