export function setAside(html = "") {
  const aside = document.getElementById("planner-aside");
  if (!aside) {
    console.warn("No se encontró #planner-aside en la página actual.");
    return;
  }
  aside.innerHTML = html;
}