import { ManagerForm } from "../../services/ManagerForm.js"


function validateTaskForm(name,description,assignedTo,date,status)
{
    const errors = {
       name: ManagerForm.validateText(name,8,"EL nombre"),
        description:ManagerForm.validateText(description,15,"La descripción"),
       assignedTo: ManagerForm.validateText(assignedTo,8, "El campo asignado a"),
       dueDate:  ManagerForm.validateRequired(date,"La fecha de entrega"),
       status: ManagerForm.validateRequired(status, "El estado ")
        
        
    }
    const isValid = Object.values(errors).every((error) => error === null);
    return {isValid, errors}

}
function showErrors(form, errors)
{
    for(const [field, message] of Object.entries(errors)){
        const input = form.elements[field];
        const feedBack  = input.nextElementSibling

        input.classList.toggle("is-invalid", message !== null);
        feedBack.textContent = message ?? "";
    }

}

export function initTasksPage(){

const form = document.getElementById("task-form");
const formError  = document.getElementById("form-error")

    form.addEventListener("submit", (event) => {
    event.preventDefault();

    const result = validateTaskForm(
        form.name.value,
        form.description.value,
        form.assignedTo.value,
        form.dueDate.value,
        form.status.value
    )
    showErrors(form,result.errors)
    if(!result.isValid)return;
    form.reset();
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("task-modal")).hide();


    // formError.textContent = ""
    //guardar tarea y cerra modal
})

}



