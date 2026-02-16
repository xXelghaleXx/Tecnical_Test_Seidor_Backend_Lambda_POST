# 🌐 SWAPI Lambda API (POST) - Serverless Service

Bienvenido al microservicio **POST** de la Prueba Técnica Seidor. Este proyecto maneja la persistencia de datos, permitiendo **Guardar** y **Eliminar** personajes favoritos, además de incluir herramientas de **Migración** automática de base de datos.

## 🏗️ Arquitectura y Tecnologías

Este servicio complementa al módulo GET y se despliega de forma independiente.

-   **Stack**: Serverless Framework + AWS Lambda + API Gateway.
-   **Base de Datos**: MySQL (Escritura y Borrado).
-   **Seguridad**: Validación de esquemas JSON (Schema Validation) con TypeScript.

---

## 📂 Estructura del Proyecto

```text
Swapi-Lambda-http-api-post/
├── src/
│   ├── handlers/             # ⚡ Controladores Lambda
│   │   ├── createFavorite.ts # INSERT en base de datos
│   │   ├── deleteFavorite.ts # DELETE en base de datos
│   │   └── migrateFavorites.ts # CREATE TABLE (Script de inicialización)
│   ├── services/
│   │   └── db.service.ts     # Cliente MySQL singleton
│   ├── models/               # 📦 Modelos de datos
│   │   └── favorite.model.ts # Interfaz y validación de tipos
│   └── utils/                # 🛠️ Helpers de respuesta HTTP
├── serverless.yml            # ⚙️ Configuración de AWS y rutas
├── package.json
└── tsconfig.json
```

---

## 🚀 Guía de Instalación "Paso a Paso"

### 1. Inicialización
Clona el repositorio y entra en la carpeta:

```bash
cd Swapi-Lambda-http-api-post
npm install
```

### 2. Configuración de Entorno (.env)
Crea el archivo `.env` en la raíz. **Es crítico que las credenciales sean las mismas que en el proyecto GET** para compartir la misma base de datos.

**Archivo: `.env`**
```ini
DB_HOST=swapi-db.cluster-xyz.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=tu_password_secreto
DB_NAME=swapi_db
```

---

## 🛠️ Despliegue y Migración (Setup de Base de Datos)

### Paso 1: Desplegar el código
Sube las funciones a AWS Lambda:

```bash
serverless deploy
```

Al terminar, copia la URL que termina en `/api/migrate`.

### Paso 2: Inicializar la Base de Datos (Primer uso)
Para evitar crear tablas manualmente con SQL, hemos creado un endpoint especial.
Simplemente abre tu navegador o usa Postman y haz una petición GET a:

`https://TU_URL_AWS.amazonaws.com/api/migrate`

**Respuesta esperada:**
```json
{
  "message": "Tabla 'favorites' creada o verificado con éxito."
}
```
*¡Listo! Tu base de datos MySQL ahora tiene la tabla necesaria.*

---

## 🔌 Documentación de Endpoints

### 1. Crear Favorito (POST)
Guarda un nuevo personaje en la lista de favoritos. El ID debe ser el original de SWAPI para mantener la referencia.

-   **URL:** `/api/favorites`
-   **Método:** `POST`
-   **Body (JSON):**
    ```json
    {
      "id": "1",
      "name": "Luke Skywalker",
      "height": "172",
      "mass": "77",
      "gender": "male"
    }
    ```
-   **Códigos de Estado:**
    -   `201 Created`: Guardado exitosamente.
    -   `400 Bad Request`: Faltan datos obligatorios.
    -   `500 Error`: Error de base de datos.

### 2. Eliminar Favorito (DELETE)
Elimina un personaje de favoritos basándose en su ID.

-   **URL:** `/api/favorites/{id}`
-   **Método:** `DELETE`
-   **Ejemplo:** `/api/favorites/1`
-   **Códigos de Estado:**
    -   `200 OK`: Eliminado correctamente.
    -   `404 Not Found`: El ID no existía en la base de datos.

---

## 🚑 Solución de Problemas (Troubleshooting)

### Error: `Table 'swapi_db.favorites' doesn't exist`
-   **Causa:** Intentaste guardar un favorito pero la tabla no existe en la BD.
-   **Solución:** Ejecuta el endpoint `/api/migrate` una vez para crear la tabla.

### Error: `Access denied for user...`
-   **Causa:** Usuario o contraseña incorrectos en el archivo `.env`.
-   **Solución:** Verifica las credenciales. Si cambias el `.env`, **debes ejecutar `serverless deploy` de nuevo** para actualizar las variables en AWS Lambda.

### CORS Error en Frontend
-   **Causa:** El navegador bloquea la petición.
-   **Solución:** El archivo `serverless.yml` ya incluye configuración CORS (`allowedOrigins: '*'`). Si falla, verifica que estás llamando a la URL `https` correcta y no a `http`.

---

## 📦 Scripts Disponibles

| Script | Descripción |
| :--- | :--- |
| `npm install` | Instala las dependencias del proyecto. |
| `serverless deploy` | Desplegar la aplicación en AWS. |
| `serverless remove` | Eliminar el stack completo de AWS (¡Cuidado!). |
| `npm test` | Ejecutar pruebas unitarias. |

---

**Desarrollado por Adrian Nuñuvero Ochoa con cariño para la Prueba Técnica Seidor 2026**