/**
 * Metodo para limpiar texto antes de meterlo en innerHTML
 * @param {*} text
 * @returns
 */
export function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}