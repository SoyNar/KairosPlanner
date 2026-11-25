import { showMenu } from "./components/layout.js";
import { navigate } from "./components/router.js";

// showMenu("today")
import { initMascots } from "../utils/mascot.js";
initMascots();

function update(){
    showMenu(location.hash || "#/today");
navigate();
}
if(!location.hash) location.hash = "#/tasks";
update();
window.addEventListener("hashchange", update);


