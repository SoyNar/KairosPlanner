const STORAGE_KEY = "kairos_tasks";

function save(tasks){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));
}
/**
 * Metodos para manejar crud
 */
export const ManagerTask = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  },

  /**
   * MEtodo para buscar por id
   */
  getById(id){
    return this.getAll().find((t) => t.id === id) ?? null;
  },


  /**
   * MEtodo para actualiar una tarea
   * usa operador spread( de propagacion)
   * copia las tareas de la tarea original , y le agrega los cambios
   * si no coincide la deja tal cual
   * @param {string} id identificador
   * @param {object} changes propiedades  nuevas
   */
  update(id,changes)
  {
    const tasks = this.getAll().map((t) => (t.id === id) ? {...t, ...changes}: t)
    save(tasks);

  },

  /**
   * MEtodo para eliminar una tarea
   * @param {string} id el identificador de la tarea
   */
  remove(id){
    save(this.getAll().filter((t) => t.id !== id));
  },
  /**
 * Metodo para mover una tarea a otra columna y/o a una posicion
 * @param {string} id la tarea que se mueve
 * @param {string} status el estado (columna) de destino
 * @param {string|null} beforeId id de la tarea ANTES de la cual queda; null = al final
 */
move(id, status, beforeId = null) {
    console.log("move llamado:", id, status, beforeId);
  const tasks = this.getAll();
  const from = tasks.findIndex((t) => t.id === id);
  if (from === -1) return;

  const [task] = tasks.splice(from, 1);   // 1. sacarla de donde estaba
  task.status = status;                   // 2. cambiarle el estado

  const to = beforeId ? tasks.findIndex((t) => t.id === beforeId) : -1;
    console.log("indice encontrado:", from);
  if (to === -1) tasks.push(task);        // 3a. sin referencia: al final
  else tasks.splice(to, 0, task);         // 3b. con referencia: justo antes

  save(tasks);                            // 4. persistir
},  

  
/**
 * Metodo para guardar una tarea en el localStorage
 * lee las tareas actuales o [] si no hay nada
 * agrega nueva al arreglo 
 * conviert3 el arreglo a string nuevamente con todo incluido
 * @param {*} taskData 
 * @returns 
 */

  add(taskData) {
    const tasks = this.getAll();
    const task = {
      id: crypto.randomUUID(),
      ...taskData,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    save(tasks)
    return task;
  },
};