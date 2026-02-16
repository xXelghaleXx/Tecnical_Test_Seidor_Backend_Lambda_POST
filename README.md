# SEIDOR SWAPI - Backend POST Service
⭐ Microservicio Serverless para Escritura de Datos ⭐

![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

## 📋 Tabla de Contenidos
1.  [Descripción](#-descripción)
2.  [Características](#-características)
3.  [Tecnologías](#-tecnologías)
4.  [Requisitos Previos](#-requisitos-previos)
5.  [Instalación](#-instalación)
6.  [Configuración](#-configuración)
7.  [Despliegue y Migración](#-despliegue-y-migración)
8.  [Testing](#-testing)
9.  [Estructura del Proyecto](#-estructura-del-proyecto)
10. [Endpoints](#-endpoints)
11. [Decisiones Técnicas](#-decisiones-técnicas)

---

## 🚀 Descripción
Este microservicio backend gestiona la **persistencia y mutación de datos**. Es responsable de recibir solicitudes para guardar o eliminar favoritos en la base de datos MySQL. Incluye mecanismos de autogestión de esquemas de base de datos.

---

## ✨ Características

### 💾 Persistencia de Datos
-   **Creación de Favoritos**: Valida y guarda personajes en MySQL.
-   **Eliminación Segura**: Permite borrar registros por ID.

### 🛠 Herramientas DevOps
-   **Auto-Migración**: Endpoint dedicado para crear tablas automáticamente, facilitando el despliegue inicial en nuevos entornos.
-   **Validación de Esquema**: Asegura que los datos entrantes (JSON) cumplan con el formato esperado antes de procesarlos.

---

## 🛠 Tecnologías
-   **Node.js 20.x**
-   **Serverless Framework v3**
-   **TypeScript**
-   **AWS Lambda & API Gateway**
-   **MySQL2** (Driver optimizado)

---

## 📦 Requisitos Previos

-   **Node.js** >= 18.x
-   **Serverless Framework**
-   **AWS CLI** configurado
-   **Instancia MySQL** disponible

---

## 💻 Instalación

1.  **Clonar y acceder:**
    ```bash
    cd Swapi-Lambda-http-api-post
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

---

## ⚙️ Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz. **Debe coincidir con la configuración del servicio GET** para compartir la misma base de datos.

```ini
DB_HOST=database-swapi.ci54eqae82ye.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_NAME=SWAPI_DB_tec_test
DB_PASSWORD=adrian123
```

---

## 🚀 Despliegue y Migración

### 1. Desplegar a AWS
```bash
serverless deploy
```

### 2. Inicializar Base de Datos (Migración)
Una vez desplegado, obtendrás una URL `/api/migrate`. Ejecútala una sola vez para crear la tabla necesaria:
```http
GET https://xyz.execute-api.us-east-1.amazonaws.com/api/migrate
```
*Respuesta esperada: "Tabla 'favorites' creada..."*

---

## 🧪 Testing

### Evidencia de Validación
Pruebas unitarias ejecutadas con éxito.

**Ejecutar Tests:**
```bash
npm test
```

**Resultado de ejecución:**
```bash
PASS  tests/handlers/createFavorite.test.ts
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.469 s
```

---

## 📁 Estructura del Proyecto

```text
Swapi-Lambda-http-api-post/
├── src/
│   ├── handlers/          # Funciones Lambda
│   │   ├── createFavorite.ts
│   │   ├── deleteFavorite.ts
│   │   └── migrateFavorites.ts # Script SQL
│   ├── services/
│   │   └── db.service.ts  # Singleton Conexion DB
│   ├── models/            # Interfaces de Favorito
│   └── utils/
├── serverless.yml
└── package.json
```

---

## 🔗 Endpoints

| Método | Ruta | Descripción | Body Requerido |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/favorites` | Crea un nuevo favorito. | `{ id, name, ... }` |
| **DELETE** | `/api/favorites/{id}` | Elimina un favorito. | N/A |
| **GET** | `/api/migrate` | Crea la tabla en la BD. | N/A |

---

## 🧠 Decisiones Técnicas

### Endpoint de Migración (`/migrate`)
En lugar de depender de scripts SQL manuales o herramientas de migración externas complejas, se implementó una función Lambda dedicada a la inicialización de la base de datos.
-   **Justificación**: Permite que el entorno sea "Plug & Play". Un desarrollador nuevo solo necesita desplegar y llamar a esta URL para tener todo listo.

### Validación Estricta de Tipos
Se utiliza TypeScript en conjunto con validación en tiempo de ejecución para el body del POST.
-   **Justificación**: Previene inconsistencias en la base de datos y errores silenciosos ("Garbage In, Garbage Out").

### Conexión Singleton a DB
Se implementó un patrón Singleton para la conexión MySQL dentro del ciclo de vida de Lambda.
-   **Justificación**: Aprovecha el "container reuse" de AWS Lambda para no abrir una nueva conexión por cada petición, reduciendo la latencia y la carga en el servidor de base de datos.

---

**Desarrollado por Adrian Nuñuvero Ochoa con cariño para la Prueba Técnica Seidor 2026**