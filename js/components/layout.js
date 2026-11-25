export const LINKS = [
    {text: "today", href: "#/today"},
    {text: "week", href: "#/week"},
    {text: "tasks", href: "#/tasks"},
    {text: "My Schedule", href: "#/my-schedule"}
]

export function link (active,clas) {
    return LINKS.map((l) => {
        const isActive = l.href === active;
        return `<a class="${clas}${isActive ? " active" : ""}" href="${l.href}"${isActive ? ' aria-current="page"' : ""}>${l.text}</a>`;

    }).join("");

}

export function showMenu(active)
{
    document.getElementById("sidebar").innerHTML =
    `<strong class="brand">Planeador</strong>${link(active, "menu-link")} `;
     document.getElementById("bottom-nav").innerHTML = link(active, "bottom-link")

}