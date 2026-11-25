import { ManagerTask } from "../../services/ManagerTask.js";

export function getTodayData() {
  const tasks = ManagerTask.getAll();

  const today = new Date().toLocaleDateString("en-CA");

  const todayTasks = tasks.filter(
    task => task.dueDate === today
  );

  const overdueTasks = tasks.filter(
    task =>
      task.dueDate < today &&
      task.status !== "Completada"
  );

  const completed = todayTasks.filter(
    task => task.status === "Completada"
  );

  return {
    todayTasks,
    overdueTasks,
    pending: todayTasks.filter(
      task => task.status === "Pendiente"
    ),
    inProgress: todayTasks.filter(
      task => task.status === "En progreso"
    ),
    completed,
  };
}