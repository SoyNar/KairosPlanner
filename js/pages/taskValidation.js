import { ManagerForm } from "../../services/ManagerForm.js";

// validacion del formulario
export function validateTaskForm(name, description, assignedTo, date, status) {
  const errors = {
    name: ManagerForm.validateText(name, 8, "El nombre"),
    description: ManagerForm.validateText(description, 15, "La descripción"),
    assignedTo: ManagerForm.validateText(assignedTo, 8, "El campo asignado a"),
    dueDate: ManagerForm.validateRequired(date, "La fecha de entrega"),
    status: ManagerForm.validateRequired(status, "El estado"),
  };
  const isValid = Object.values(errors).every((error) => error === null);
  return { isValid, errors };
}

/**
 * metodo para ver errores del formulario
 */
export function showErrors(form, errors) {
  for (const [field, message] of Object.entries(errors)) {
    const input = form.elements[field];
    const feedback = input.nextElementSibling;

    input.classList.toggle("is-invalid", message !== null);
    feedback.textContent = message ?? "";
  }
}