# Centro de Idiomas Global - Backend

API REST para la gestión integral de un centro de idiomas.

## 🛠️ Tecnologías

- **NestJS** - Framework Node.js (TypeScript)
- **Prisma** - ORM con PostgreSQL
- **JWT** - Autenticación

## 🚀 Instalación

```bash
npm install
```

## ▶️ Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## 🔐 Endpoints de Autenticación

| Método | Endpoint         | Descripción             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Registrar nuevo usuario |
| POST   | `/auth/login`    | Iniciar sesión          |

## 📘 Endpoints de Cursos

| Método | Endpoint       | Rol   | Descripción      |
| ------ | -------------- | ----- | ---------------- |
| GET    | `/courses`     | Todos | Listar cursos    |
| POST   | `/courses`     | Admin | Crear curso      |
| GET    | `/courses/:id` | Todos | Ver curso        |
| PATCH  | `/courses/:id` | Admin | Actualizar curso |
| DELETE | `/courses/:id` | Admin | Eliminar curso   |

## 👥 Endpoints de Grupos

| Método | Endpoint            | Rol            | Descripción       |
| ------ | ------------------- | -------------- | ----------------- |
| GET    | `/groups`           | Admin/Profesor | Listar grupos     |
| GET    | `/groups/teachers`  | Admin          | Listar profesores |
| GET    | `/groups/by-course` | Admin/Profesor | Grupos por curso  |
| POST   | `/groups`           | Admin          | Crear grupo       |
| GET    | `/groups/:id`       | Todos          | Ver grupo         |
| PATCH  | `/groups/:id`       | Admin          | Actualizar grupo  |
| DELETE | `/groups/:id`       | Admin          | Eliminar grupo    |

## 🧑‍🎓 Endpoints de Matrículas

| Método | Endpoint                         | Rol              | Descripción                |
| ------ | -------------------------------- | ---------------- | -------------------------- |
| GET    | `/enrollments`                   | Admin/Profesor\* | Todas las inscripciones    |
| POST   | `/enrollments`                   | Admin            | Inscribir alumno           |
| PATCH  | `/enrollments/:id`               | Admin            | Actualizar progreso/estado |
| GET    | `/enrollments/by-group?groupId=` | Admin/Profesor\* | Alumnos por grupo          |
| GET    | `/enrollments/by-user?userId=`   | Admin            | Matrículas por usuario     |
| GET    | `/enrollments/progress/:groupId` | Todos            | Progreso por grupo         |
| GET    | `/enrollments/my-progress`       | Alumno           | Mi progreso                |

\*Profesor solo ve inscripciones de sus grupos

## 📅 Endpoints de Asistencia

| Método | Endpoint                        | Rol            | Descripción            |
| ------ | ------------------------------- | -------------- | ---------------------- |
| GET    | `/attendance`                   | Admin/Profesor | Todas las assistencias |
| POST   | `/attendance`                   | Admin/Profesor | Registrar asistencia   |
| GET    | `/attendance/my-attendance`     | Alumno         | Mi historial           |
| GET    | `/attendance/by-enrollment/:id` | Admin/Profesor | Por matrícula          |

## 💰 Endpoints de Pagos

| Método | Endpoint                      | Rol            | Descripción               |
| ------ | ----------------------------- | -------------- | ------------------------- |
| GET    | `/payments`                   | Admin          | Todos los pagos (filtros) |
| POST   | `/payments`                   | Admin          | Crear pago                |
| PATCH  | `/payments/:id/pay`           | Admin          | Marcar como pagado        |
| GET    | `/payments/by-user`           | Admin          | Pagos por usuario         |
| GET    | `/payments/my-payments`       | Alumno         | Mis pagos                 |
| GET    | `/payments/by-enrollment/:id` | Admin/Profesor | Pagos por matrícula       |
| GET    | `/payments/group/:id`         | Admin/Profesor | Pagos por grupo           |

Filtros disponibles: `?groupId=` y `?status=` (pending/paid/late)

## 🧾 Endpoints de Certificados

| Método | Endpoint                           | Rol            | Descripción             |
| ------ | ---------------------------------- | -------------- | ----------------------- |
| GET    | `/certificates`                    | Admin/Profesor | Todos los certificados  |
| GET    | `/certificates/my-certificates`    | Alumno         | Mis certificados        |
| GET    | `/certificates/view/:enrollmentId` | Alumno         | Ver/Generar certificado |
| GET    | `/certificates/by-group/:groupId`  | Admin/Profesor | Por grupo               |

## 📊 Endpoints de Reportes

| Método | Endpoint                        | Rol   | Descripción         |
| ------ | ------------------------------- | ----- | ------------------- |
| GET    | `/reports/summary`              | Admin | Resumen global      |
| GET    | `/reports/groups`               | Admin | Resumen por grupos  |
| GET    | `/reports/group/:id`            | Admin | Reporte detallado   |
| GET    | `/reports/retention/global`     | Admin | Retención global    |
| GET    | `/reports/retention/course/:id` | Admin | Retención por curso |

## 👤 Gestión de Usuarios

| Método | Endpoint     | Rol   | Descripción                  |
| ------ | ------------ | ----- | ---------------------------- |
| GET    | `/users`     | Admin | Todos los usuarios (?role=) |
| POST   | `/users`     | Admin | Crear usuario                |
| GET    | `/users/:id` | Admin | Ver usuario                  |
| PATCH  | `/users/:id` | Admin | Actualizar usuario          |
| DELETE | `/users/:id` | Admin | Eliminar usuario             |
| DELETE | `/users/:id` | Admin | Eliminar usuario   |

## 🔔 Endpoints de Notificaciones

| Método | Endpoint               | Rol   | Descripción                |
| ------ | ---------------------- | ----- | -------------------------- |
| GET    | `/notifications/my`    | Todos | Mis notificaciones         |
| GET    | `/notifications/badge` | Todos | Contador de notificaciones |

### Tipos de notificaciones

- **payment**: Pagos vencidos/pendientes
- **certificate**: Certificados disponibles
- **progress**: Bajo progreso (< 50%)
- **enrollment**: Alumnos completados

## 🔒 Roles y Permisos

| Recurso      | Admin | Profesor   | Alumno    |
| ------------ | ----- | ---------- | --------- |
| Cursos       | ✔     | ⚠️ propios | ✔ propios |
| Grupos       | ✔     | ✔ propios  | ✔ propios |
| Matrículas   | ✔     | ❌         | ❌        |
| Asistencia   | ✔     | ✔ propios  | ✔ propia  |
| Pagos        | ✔     | ❌         | ✔ propios |
| Certificados | ✔     | ✔ generar  | ✔ propios |
| Reportes     | ✔     | ❌         | ❌        |

## ⭐ Funcionalidad Extra: Sistema de Notificaciones

Se implementó un sistema de notificaciones dinámicas orientado a mejorar la comunicación con el alumno.

### 🎯 Objetivo

Informar automáticamente a los usuarios sobre eventos relevantes del sistema.

---

### 🔔 Tipos de notificaciones

- Pago pendiente o vencido
- Alumno apto para certificación (≥80% progreso)
- Progreso bajo

---

### ⚙️ Implementación

Se creó un endpoint:

```text
GET /notifications/my
```

El sistema genera notificaciones dinámicamente en base a:

- progreso del alumno
- estado de pagos
- certificados generados

---

### 💡 Valor para el negocio

- mejora la retención de alumnos
- reduce pagos atrasados
- incentiva finalización de cursos
- mejora la experiencia del usuario

---

### 🧠 Decisión técnica

Se optó por notificaciones dinámicas en lugar de almacenamiento persistente para simplificar la implementación y mantener eficiencia.

---

### 📬 Validación de requerimientos con el cliente

Durante el desarrollo se realizaron consultas técnicas para aclarar ambigüedades y asegurar que la implementación cumpliera correctamente con las necesidades del cliente.

🔹 Progreso del alumno

Problema:
El requerimiento mencionaba “progreso por skill”, lo que podía implicar un sistema complejo por habilidades (speaking, listening, etc.).

Consulta:
¿Se requiere progreso por habilidades o es suficiente un progreso global?

Respuesta:
Se confirmó que un progreso global por curso es suficiente.

Implementación:
El progreso se modeló como un porcentaje (0–100) dentro de enrollment.

🔹 Criterio de certificación

Problema:
No estaba definido el criterio de aprobación.

Consulta:
¿Existe un porcentaje mínimo o condiciones adicionales?

Respuesta:
Se requiere un mínimo de 80% de progreso, sin evaluaciones adicionales.

Implementación:
El sistema solo genera certificados si:

progreso ≥ 80%
estado = completed

🔹 Evaluaciones académicas

Problema:
No estaba claro si se debían manejar notas.

Consulta:
¿El sistema debe incluir evaluaciones o calificaciones?

Respuesta:
No es necesario.

Implementación:
Se eliminó la necesidad de un módulo de evaluaciones.

🔹 Certificados PDF

Problema:
No estaba definido el método de acceso a certificados.

Consulta:
¿Deben almacenarse o solo generarse?

Respuesta:
Se requiere un endpoint de descarga para usuarios autenticados.

Implementación:
Se implementó generación y descarga de PDF mediante endpoint protegido.

🔹 Estructura cursos y grupos

Problema:
Ambigüedad en la relación entre niveles, cursos y grupos.

Consulta:
¿Es válido integrar nivel y tipo en Course y usar Group como instancia?

Respuesta:
Sí, es correcto.

🔹 Implementación:

Course → A1 Speaking
Group → A1-01
Enrollment → alumno en grupo

### 🧠 Decisiones Técnicas

Uso de JWT stateless (sin sesiones en base de datos)
Progreso gestionado en enrollment
Separación clara entre Course y Group
Arquitectura modular escalable
Validación de reglas de negocio en services

---
