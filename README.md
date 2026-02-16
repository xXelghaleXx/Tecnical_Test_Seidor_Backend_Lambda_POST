🌐 SWAPI Lambda API – Favorites Service (POST)

Microservicio Serverless encargado de la persistencia de personajes favoritos para la Prueba Técnica Seidor 2026.

Este servicio permite:

✅ Crear personajes favoritos

✅ Eliminar favoritos

✅ Ejecutar migración automática de base de datos

Se despliega de forma independiente al módulo GET, pero ambos comparten la misma base de datos MySQL.

🏗️ Arquitectura

Stack Tecnológico

Backend: AWS Lambda (Node.js + TypeScript)

Infraestructura: Serverless Framework

API: API Gateway (HTTP API)

Base de Datos: MySQL (Amazon RDS)

Validación: JSON Schema + TypeScript Types

Patrón: Arquitectura modular por capas

📂 Estructura del Proyecto
Swapi-Lambda-http-api-post/
├── src/
│   ├── handlers/
│   │   ├── createFavorite.ts
│   │   ├── deleteFavorite.ts
│   │   └── migrateFavorites.ts
│   ├── services/
│   │   └── db.service.ts
│   ├── models/
│   │   └── favorite.model.ts
│   └── utils/
│       └── response.util.ts
├── serverless.yml
├── package.json
├── tsconfig.json
└── README.md
🚀 Instalación Rápida (5 minutos)
1️⃣ Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

Node.js ≥ 18

Serverless Framework

npm install -g serverless

AWS CLI configurado

aws configure
2️⃣ Clonar e instalar dependencias
git clone <repo-url>
cd Swapi-Lambda-http-api-post
npm install
3️⃣ Configurar variables de entorno

Crear archivo .env en la raíz del proyecto:

DB_HOST=swapi-db.cluster-xyz.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=tu_password_secreto
DB_NAME=swapi_db

⚠️ Importante:
Debe usar exactamente las mismas credenciales que el proyecto GET para compartir la base de datos.

4️⃣ Desplegar en AWS
serverless deploy

Al finalizar, verás algo como:

endpoints:
  POST - https://xxxxx.execute-api.us-east-1.amazonaws.com/api/favorites
  DELETE - https://xxxxx.execute-api.us-east-1.amazonaws.com/api/favorites/{id}
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/api/migrate
🛠️ Migración Automática (Primer uso obligatorio)

Para crear la tabla favorites, ejecuta:

GET https://TU_URL/api/migrate

Respuesta esperada:

{
  "message": "Tabla 'favorites' creada o verificada con éxito."
}

Una vez ejecutado, la base de datos queda lista.

🔌 Endpoints
➕ Crear Favorito

POST /api/favorites

Body
{
  "id": "1",
  "name": "Luke Skywalker",
  "height": "172",
  "mass": "77",
  "gender": "male"
}
Respuestas
Código	Descripción
201	Favorito creado correctamente
400	Datos inválidos o incompletos
500	Error interno de base de datos
❌ Eliminar Favorito

DELETE /api/favorites/{id}

Ejemplo:

DELETE /api/favorites/1
Respuestas
Código	Descripción
200	Eliminado correctamente
404	ID no encontrado
🧠 Consideraciones Técnicas

Se utiliza Singleton Pattern para la conexión MySQL.

Validación estricta del body mediante tipos TypeScript.

Separación clara por capas: handler → service → model.

Compatible con despliegue independiente (microservicio real).

🧪 Scripts Disponibles
Comando	Descripción
npm install	Instalar dependencias
serverless deploy	Desplegar en AWS
serverless remove	Eliminar stack completo
npm test	Ejecutar pruebas
🚑 Troubleshooting
❗ Table doesn't exist

Ejecuta /api/migrate una vez.

❗ Access denied for user

Revisa credenciales en .env y vuelve a desplegar:

serverless deploy
❗ Error CORS

Verifica que estás usando HTTPS y la URL correcta de API Gateway.

📌 Autor

Adrian Nuñuvero Ochoa
Prueba Técnica – Seidor 2026