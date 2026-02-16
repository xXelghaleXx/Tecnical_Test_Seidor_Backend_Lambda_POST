import mysql from 'mysql2/promise';

/**
 * Configuramos el Pool de conexiones usando las variables de entorno
 * que definimos en el serverless.yml y el archivo .env
 */
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306, // Puerto estándar de MariaDB/MySQL
    waitForConnections: true,
    connectionLimit: 5, // Reducido para Lambda (mejor para funciones serverless)
    queueLimit: 0,
    maxIdle: 2, // Máximo de conexiones inactivas
    idleTimeout: 60000, // Cerrar conexiones inactivas después de 60 segundos
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Configuración SSL segura para AWS RDS
    ssl: {
        // AWS RDS requiere SSL pero no necesita verificación de certificado
        // en la mayoría de casos. Para producción, considera usar certificados CA.
        rejectUnauthorized: false
    }
});

/**
 * Función helper para verificar la conexión a la base de datos
 */
export async function testConnection(): Promise<boolean> {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a base de datos exitosa');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        return false;
    }
}