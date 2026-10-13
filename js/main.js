import { showMenu } from "./components/layout.js";
import { navigate } from "./components/router.js";

// showMenu("today")

function update(){
    showMenu(location.hash || "#/today");
navigate();
}

update();
window.addEventListener("hashchange", update);


