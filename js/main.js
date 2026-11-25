import { showMenu } from "./components/layout.js";
import { navigate } from "./components/router.js";

// showMenu("today")
import { initMascots } from "../utils/mascot.js";
import { loadTaskModal } from "./components/loadTaskModal.js";

 async function initApp(){ 

const container = document.getElementById("task-modal-container");

await loadTaskModal(container);
initMascots();

function update(){
    showMenu(location.hash || "#/today");
navigate();
}
if(!location.hash) location.hash = "#/tasks";
update();
window.addEventListener("hashchange", update);
}

initApp();


