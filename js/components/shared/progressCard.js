export function progressOf(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Completada").length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

export function renderProgressCard({
  done,
  total,
  title = "Un paso a la vez.",
  subtitle = `${done} de ${total} tareas completadas`,
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `
    <div class="progress-card">
      <div class="progress-check"><i class="bi bi-check-lg"></i></div>
      <div class="progress-text">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
      <div class="progress-pct">${pct} %</div>
      <div class="progress-bar"><span style="width: ${pct}%"></span></div>
    </div>`;
}