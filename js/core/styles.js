const loaded = new Map();

export function loadStyle(href) {
  if (loaded.has(href)) return loaded.get(href); // no lo cargues dos veces

  const promise = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });

  loaded.set(href, promise);
  return promise;
}