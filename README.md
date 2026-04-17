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

| Método | Endpoint | Descripción |
|-------|----------|------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |

## 📘 Endpoints de Cursos

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/courses` | Todos | Listar cursos |
| POST | `/courses` | Admin | Crear curso |
| GET | `/courses/:id` | Todos | Ver curso |
| PATCH | `/courses/:id` | Admin | Actualizar curso |
| DELETE | `/courses/:id` | Admin | Eliminar curso |

## 👥 Endpoints de Grupos

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/groups` | Admin/Profesor | Listar grupos |
| POST | `/groups` | Admin | Crear grupo |
| GET | `/groups/:id` | Todos | Ver grupo |
| PATCH | `/groups/:id` | Admin | Actualizar grupo |
| DELETE | `/groups/:id` | Admin | Eliminar grupo |

## 🧑‍🎓 Endpoints de Matrículas

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/enrollments` | Admin/Profesor | Todas las inscripciones |
| POST | `/enrollments` | Admin | Inscribir alumno |
| PATCH | `/enrollments/:id` | Admin/Profesor | Actualizar progreso/estado |
| GET | `/enrollments/by-group?groupId=` | Admin/Profesor | Alumnos por grupo |
| GET | `/enrollments/by-course?courseId=` | Admin/Profesor | Alumnos por curso |
| GET | `/enrollments/my-progress` | Alumno | Mi progreso |

## 📅 Endpoints de Asistencia

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/attendance` | Admin/Profesor | Todas las assistencias |
| POST | `/attendance` | Admin/Profesor | Registrar asistencia |
| GET | `/attendance/my-attendance` | Alumno | Mi historial |
| GET | `/attendance/by-enrollment/:id` | Admin/Profesor | Por matrícula |

## 💰 Endpoints de Pagos

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/payments` | Admin/Profesor | Todos los pagos |
| POST | `/payments` | Admin | Crear pago |
| PATCH | `/payments/:id/pay` | Admin | Marcar como pagado |
| GET | `/payments/my-payments` | Alumno | Mis pagos |

## 🧾 Endpoints de Certificados

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/certificates` | Admin/Profesor | Todos los certificados |
| GET | `/certificates/my-certificates` | Alumno | Mis certificados |
| GET | `/certificates/view/:enrollmentId` | Alumno | Ver/Generar certificado |
| GET | `/certificates/by-group/:groupId` | Admin/Profesor | Por grupo |

## 📊 Endpoints de Reportes

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/reports/summary` | Admin/Profesor | Resumen global |
| GET | `/reports/groups` | Admin/Profesor | Resumen por grupos |
| GET | `/reports/group/:id` | Admin/Profesor | Reporte detallado |

## 👤 Gestión de Usuarios

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/users` | Admin | Todos los usuarios |
| POST | `/users` | Admin | Crear usuario |
| GET | `/users/:id` | Admin | Ver usuario |
| PATCH | `/users/:id` | Admin | Actualizar usuario |
| DELETE | `/users/:id` | Admin | Eliminar usuario |

## 🔔 Endpoints de Notificaciones

| Método | Endpoint | Rol | Descripción |
|-------|----------|-----|-------------|
| GET | `/notifications/my` | Todos | Mis notificaciones |
| GET | `/notifications/badge` | Todos | Contador de notificaciones |

### Tipos de notificaciones
- **payment**: Pagos vencidos/pendientes
- **certificate**: Certificados disponibles
- **progress**: Bajo progreso (< 50%)
- **enrollment**: Alumnos completados

## 🔒 Roles

- **admin** - Acceso completo
- **profesor** - Gestiona sus grupos y estudiantes
- **alumno** - Acceso restringido a sus datos