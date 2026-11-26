export function renderScheduleAside() {
  return `
    <div class="aside-card aside-card--kayos">
      <span class="aside-badge"><i class="bi bi-circle-fill"></i> KAYOS ESTÁ CONTIGO</span>
      <div class="aside-kayos-figure" aria-hidden="true">
        <img src="./assets/img/kayos.svg" alt="" />
      </div>
      <h3>Tu semana,<br>sin enredos.</h3>
      <p>¡Todo en orden! Tus bloques actuales no se cruzan. Yo cuido los horarios, tú concéntrate en lo que importa.</p>
      <button type="button" class="aside-btn w-100 border-0">
        Ver alerta de ejemplo <i class="bi bi-arrow-up-right"></i>
      </button>
    </div>

    <div class="aside-card aside-card--next">
      <span class="aside-label">ESPACIO PARA TODO</span>
      <h3>Trabajo, estudio y tú.</h3>
      <p>Equilibra tus bloques y deja también un lugar para descansar.</p>
    </div>

    <a href="#/tasks" class="aside-card aside-card--hole">
      <div>
        <h3>Un paso a la vez.</h3>
        <p>3 tareas en tu tablero</p>
      </div>
      <i class="bi bi-arrow-up-right"></i>
    </a>`;
}