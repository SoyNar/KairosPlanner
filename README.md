# KairosPlanner

> Planificador web para organizar las tareas y los horarios de la vida universitaria en un solo lugar.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange)
![Etapa](https://img.shields.io/badge/etapa%20actual-1%20(tareas)-6a00f4)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Bootstrap-blue)

---

## Tabla de contenido

1. [¿Qué es?](#qué-es)
2. [Problema que resuelve](#problema-que-resuelve)
3. [¿A quién está dirigida?](#a-quién-está-dirigida)
4. [¿Qué puede hacer el usuario?](#qué-puede-hacer-el-usuario)
5. [Etapas del proyecto](#etapas-del-proyecto)
6. [Secciones de la app](#secciones-de-la-app)
7. [Autenticación](#autenticación)
8. [Arquitectura y organización del código](#arquitectura-y-organización-del-código)
9. [Modelo de datos](#modelo-de-datos)
10. [Tecnologías](#tecnologías)
11. [Cómo ejecutarlo](#cómo-ejecutarlo)
12. [Roadmap](#roadmap)
13. [Decisiones de diseño](#decisiones-de-diseño)
14. [Autora](#autora)

---

## ¿Qué es?

KairosPlanner es una aplicación web que reúne en un solo lugar las **tareas** y el **horario de clases** de un estudiante universitario. Permite ver qué hay que hacer hoy, cómo viene la semana y en qué estado va cada pendiente.

Actualmente es una aplicación **solo front-end**: corre en el navegador y guarda la información en el propio dispositivo (`localStorage`).

## Problema que resuelve

Un estudiante suele manejar varias materias, entregas y parciales al mismo tiempo, y los pendientes quedan repartidos en notas sueltas, chats o en la memoria. Esto provoca:

- olvido de fechas de entrega,
- poca claridad sobre las prioridades,
- sobrecarga de trabajo en ciertos días de la semana,
- dificultad para ver el avance real.

KairosPlanner centraliza esa información y la muestra de forma visual y simple.

## ¿A quién está dirigida?

- Estudiantes universitarios con varias materias y entregas a la vez.
- Estudiantes que además trabajan o tienen otras actividades y necesitan repartir bien su tiempo.
- Cualquier persona que quiera un tablero de tareas sencillo, sin la complejidad de herramientas como Trello o Notion.

## ¿Qué puede hacer el usuario?

| Capacidad | Descripción | Estado |
|---|---|---|
| Crear tareas | Formulario en modal con validación de campos | Hecho |
| Listar tareas | Tablero por estado: Pendiente, En progreso, Completada | Hecho |
| Editar tareas | Modificar los datos y cambiar el estado | Hecho |
| Eliminar tareas | Borrar tareas que ya no se necesitan | Hecho |
| Persistir datos | Las tareas se conservan al cerrar la página (`localStorage`) | Hecho |
| Ver el día | Tareas y clases de hoy en una sola vista | Pendiente |
| Registrar el horario | Clases por día y hora | Pendiente |
| Ver la semana | Tareas y clases distribuidas de lunes a domingo | Pendiente |
| Cuenta de usuario | Registro e inicio de sesión | Futuro |

## Etapas del proyecto

### Etapa 1: Tareas (completada)
CRUD completo de tareas con tablero por estado.
- Modal de creación con validación (`ManagerForm`).
- Gestión de datos de tareas (`ManagerTask`).
- Tablero en tres columnas con contador por estado.
- Persistencia en `localStorage`.

### Etapa 2: Fecha límite y materia en las tareas (siguiente)
Es la base para que las demás vistas funcionen.
- Agregar `fecha límite` (obligatoria) a cada tarea.
- Agregar `materia` y, opcionalmente, `prioridad`.
- Marcar visualmente las tareas **atrasadas**.
- Actualizar el formulario, la validación y las tarjetas.

### Etapa 3: Vista Today
Responde la pregunta: **¿qué hago hoy?**
- Tareas que vencen hoy y tareas atrasadas.
- Clases del día ordenadas por hora (cuando exista My Schedule).
- Marcar una tarea como completada sin salir de la vista.
- Mensaje de día libre cuando no hay nada pendiente.

### Etapa 4: My Schedule
Responde la pregunta: **¿cuándo son mis clases?**
- CRUD de clases: materia, día, hora de inicio, hora de fin, salón y color.
- Grilla semanal con las clases ubicadas por día y hora.
- Validación para evitar clases cruzadas en el mismo horario.

### Etapa 5: Vista Week
Responde la pregunta: **¿cómo viene mi semana?**
- Siete columnas (lunes a domingo) con tareas y clases.
- Navegación a la semana anterior y a la siguiente.
- Resaltado del día actual y de los días sobrecargados.

### Etapa 6: Autenticación y backend (opcional)
Cuentas de usuario y datos guardados en servidor. Ver la sección [Autenticación](#autenticación).

### Etapa 7: Mejoras
- Filtros y búsqueda de tareas.
- Arrastrar y soltar tareas entre columnas.
- Modo oscuro.
- Recordatorios y notificaciones.
- Exportar e importar datos (JSON).
- Convertirla en PWA para usarla como app en el celular.

## Secciones de la app

El menú lateral contiene cuatro secciones. Cada una responde una pregunta distinta del estudiante:

| Sección | Pregunta que responde | Guarda datos propios | Estado |
|---|---|---|---|
| `tasks` | ¿Qué tengo pendiente y en qué estado va? | Sí (tareas) | Hecha |
| `today` | ¿Qué hago hoy? | No, solo lee | Pendiente |
| `My Schedule` | ¿Cuándo son mis clases? | Sí (clases) | Pendiente |
| `week` | ¿Cómo viene mi semana? | No, solo lee | Pendiente |

Dependencias entre secciones:

```
tasks ──────┐
            ├──> today
My Schedule ┤
            └──> week
```

`today` y `week` son **vistas de lectura**: no almacenan nada propio, solo filtran y muestran lo que guardan `tasks` y `My Schedule`.

## Autenticación

### ¿Es necesario autenticarse para crear tareas?

**Depende de la etapa del proyecto.**

- **Etapas 1 a 5 (solo front, `localStorage`): no es necesario.** Los datos viven en el navegador del propio usuario, así que no hay "otros usuarios" de los cuales separarlos. Agregar un login aquí sería solo una pantalla decorativa: cualquiera podría abrir las herramientas del navegador y leer o modificar los datos.
- **Etapa 6 (con backend y base de datos): sí tiene sentido.** Cuando las tareas se guardan en un servidor, hay que saber a quién pertenece cada tarea y evitar que un usuario vea o edite las de otro.

> Una autenticación hecha únicamente en el front-end **no protege nada**. La seguridad real siempre se valida en el servidor.

### Plan para la Etapa 6

**Funcionalidades**
- Registro con correo y contraseña.
- Inicio y cierre de sesión.
- Rutas protegidas: sin sesión no se accede a `tasks`, `today`, `week` ni `My Schedule`.
- Cada tarea y cada clase queda asociada a un usuario (`userId`).
- Opcional: recuperación de contraseña.

**Flujo propuesto**

```
1. El usuario se registra o inicia sesión  ->  POST /auth/register | /auth/login
2. El servidor valida y responde con un token (JWT)
3. El front guarda el token y lo envía en cada petición  ->  Authorization: Bearer <token>
4. El servidor identifica al usuario y devuelve solo sus datos
```

**Endpoints previstos**

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Crear cuenta |
| POST | `/auth/login` | Iniciar sesión y recibir token |
| GET | `/tasks` | Listar las tareas del usuario autenticado |
| POST | `/tasks` | Crear tarea |
| PUT | `/tasks/:id` | Editar tarea |
| DELETE | `/tasks/:id` | Eliminar tarea |
| GET / POST / PUT / DELETE | `/schedule` | CRUD de clases del usuario |

**Buenas prácticas a respetar**
- Guardar las contraseñas con hash (bcrypt o equivalente), nunca en texto plano.
- Validar siempre en el servidor, aunque el front ya valide.
- Verificar que cada recurso pertenezca al usuario antes de editarlo o borrarlo.
- Usar HTTPS y tokens con expiración.
- No guardar información sensible en `localStorage` sin considerar el riesgo de XSS.

**Impacto en el código**
- La carpeta `js/api` pasa a llamar al backend en lugar de leer `localStorage`.
- `ManagerTask` deja de acceder directamente al almacenamiento y usa la capa `api`.
- Se agregan las páginas `login.html` y `register.html`, y un guard que revisa la sesión antes de mostrar cada página.
- Se necesita migrar las tareas que el usuario ya tenga en `localStorage` (importarlas al crear la cuenta).

## Arquitectura y organización del código

Estructura actual del proyecto:

```
KairosPlanner/
├── css/
├── js/
│   ├── api/            # acceso a datos (hoy localStorage, luego backend)
│   ├── components/     # piezas reutilizables de interfaz
│   ├── pages/          # lógica de cada página
│   ├── config.js
│   └── main.js
├── pages/
│   ├── tasks.html
│   └── today.html
├── services/
│   ├── ManagerForm.js  # validación de formularios
│   └── ManagerTask.js  # lógica de tareas
├── utils/
│   └── dates.js        # utilidades de fechas
├── index.html
└── README.md
```

**Principio guía: un archivo, un rol.**

| Capa | Responsabilidad | No debe hacer |
|---|---|---|
| `pages/` (js) | Conectar eventos y coordinar la página | Guardar datos ni validar reglas |
| `components/` | Construir y pintar elementos de interfaz | Acceder al almacenamiento |
| `services/` | Reglas de negocio y validaciones | Manipular el DOM |
| `api/` | Leer y escribir datos | Conocer la interfaz |
| `utils/` | Funciones puras reutilizables | Tener estado |

Separar así el acceso a datos (`api`) permite cambiar `localStorage` por un backend en la Etapa 6 sin reescribir la interfaz.

## Modelo de datos

### Tarea

```json
{
  "id": "uuid",
  "titulo": "Entregar laboratorio de bases de datos",
  "descripcion": "Opcional",
  "estado": "pendiente",
  "fechaLimite": "2026-11-05",
  "materia": "Bases de datos",
  "prioridad": "alta",
  "creadaEn": "2026-10-30T10:00:00Z"
}
```

- `estado`: `pendiente` | `en_progreso` | `completada`
- `fechaLimite` y `materia`: se agregan en la Etapa 2.
- `prioridad`: opcional.

### Clase (My Schedule)

```json
{
  "id": "uuid",
  "materia": "Bases de datos",
  "dia": "lunes",
  "horaInicio": "08:00",
  "horaFin": "10:00",
  "salon": "Opcional",
  "color": "#6a00f4"
}
```

### Usuario (Etapa 6)

```json
{
  "id": "uuid",
  "correo": "estudiante@correo.com",
  "passwordHash": "…"
}
```

## Tecnologías

- **HTML5** y **CSS3**
- **JavaScript vanilla** (ES modules)
- **Bootstrap** para componentes y diseño responsive
- **localStorage** para persistencia (Etapas 1 a 5)
- Backend y base de datos por definir (Etapa 6)

## Cómo ejecutarlo

```bash
# 1. Clonar el repositorio
git clone https://github.com/SoyNar/KairosPlanner.git

# 2. Entrar a la carpeta
cd KairosPlanner

# 3. Abrir con un servidor local (necesario si se usan módulos ES)
npx serve .
# o con la extensión Live Server de VS Code
```

## Roadmap

- [x] Etapa 1: CRUD de tareas con tablero por estado
- [ ] Etapa 2: fecha límite, materia y prioridad en las tareas
- [ ] Etapa 3: vista Today
- [ ] Etapa 4: My Schedule
- [ ] Etapa 5: vista Week
- [ ] Etapa 6: autenticación y backend
- [ ] Etapa 7: filtros, modo oscuro, notificaciones, PWA

## Decisiones de diseño

- **Primero el front, luego el backend.** Validar la experiencia de uso antes de invertir en servidor.
- **Vistas de lectura para Today y Week.** Evitan duplicar datos y mantienen una única fuente de verdad.
- **Capa `api` aislada.** Facilita migrar de `localStorage` a un backend.
- **Autenticación solo cuando hay servidor.** Evita una falsa sensación de seguridad en el front.

## Autora

**Narciris Mena Mosquera**
GitHub: [SoyNar](https://github.com/SoyNar)