// js/services/ManagerBlock.js
const KEY = "kayros:blocks";

// weekday: 0 = lunes ... 6 = domingo. Si tiene "date", el bloque es de esa fecha.
const SEED = [
  { id: "w1", type: "work", title: "Trabajo", weekday: 0, start: 8, end: 12, note: "Bloque reservado" },
  { id: "w2", type: "work", title: "Trabajo", weekday: 1, start: 8, end: 12, note: "Bloque reservado" },
  { id: "w3", type: "work", title: "Trabajo", weekday: 2, start: 8, end: 12, note: "Bloque reservado" },
  { id: "w4", type: "work", title: "Trabajo", weekday: 3, start: 8, end: 12, note: "Bloque reservado" },
  { id: "w5", type: "work", title: "Trabajo", weekday: 4, start: 8, end: 12, note: "Bloque reservado" },

  { id: "c1", type: "class", title: "Cálculo", weekday: 0, start: 18, end: 20 },
  { id: "c2", type: "class", title: "Física", weekday: 1, start: 18, end: 20 },
  { id: "c3", type: "class", title: "Geometría vectorial", weekday: 2, start: 18, end: 20 },
  { id: "c4", type: "class", title: "Inglés", weekday: 3, start: 18, end: 19 },

  { id: "s1", type: "study", title: "Estudiar", weekday: 4, start: 14, end: 16 },
  { id: "p1", type: "personal", title: "Gimnasio", weekday: 2, start: 14, end: 15 },
  { id: "p2", type: "personal", title: "Tiempo libre", weekday: 5, start: 15, end: 17 },

  { id: "d1", type: "study", title: "Estudiar para el parcial", date: "2026-11-28", start: 9, end: 12, note: "Un paso a la vez" },
];

export const ManagerBlock = {
  getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (error) {
      console.error("No se pudieron leer los bloques guardados.", error);
    }
    localStorage.setItem(KEY, JSON.stringify(SEED));
    return structuredClone(SEED);
  },

  add(block) {
    const all = this.getAll();
    all.push({ id: crypto.randomUUID(), ...block });
    localStorage.setItem(KEY, JSON.stringify(all));
  },
};