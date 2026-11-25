
import { ManagerTask } from "../../services/ManagerTask.js";
import { withLoader } from "../../utils/loader.js";
import { validateTaskForm, showErrors } from "../pages/taskValidation.js";

/**
 * Inicializa la gestión del formulario de tareas.
 */
export function initTaskForm({
  form,
  modalEl,
  modalTitle,
  formError,
  onSaved,
}) {
  let editingId = null;
  let saving = false;

  // Limpia el formulario
  function resetForm() {
    editingId = null;
    form.reset();

    form.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });

    formError.textContent = "";
    modalTitle.textContent = "Nueva tarea";
  }

  // Abre el modal para editar una tarea
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

  // Limpia el formulario cuando se cierra el modal
  modalEl.addEventListener("hidden.bs.modal", resetForm);

  // Guardar o actualizar tarea
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

    // Validación
    const result = validateTaskForm(
      data.name,
      data.description,
      data.assignedTo,
      data.dueDate,
      data.status
    );

    showErrors(form, result.errors);

    if (!result.isValid) return;

    // Guardamos los datos antes del await
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

          bootstrap.Modal.getOrCreateInstance(modalEl).hide();

          onSaved();
        },
        {
          text: isEdit
            ? "Guardando cambios…"
            : "Creando tu tarea…",

          doneText: isEdit
            ? "¡Cambios guardados!"
            : "¡Tarea creada!",
        }
      );
    } catch (error) {
      console.error(error);

      formError.textContent =
        "No se pudo guardar la tarea. Inténtalo de nuevo.";
    } finally {
      saving = false;
    }
  });

  // Exponemos la función para que el tablero pueda editar
  return {
    openEdit,
  };
}
