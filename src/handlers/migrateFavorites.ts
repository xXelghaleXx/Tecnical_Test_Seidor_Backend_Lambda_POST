import { pool } from '../utils/db';

/**
 * Lambda function para ejecutar la migración de la tabla favorites
 * IMPORTANTE: Esta función solo debe ejecutarse UNA VEZ
 */
export const handler = async () => {
    console.log('🔄 Iniciando migración de tabla favorites...');

    const connection = await pool.getConnection();

    try {
        // Iniciar transacción
        await connection.beginTransaction();

        console.log('📋 Paso 1: Eliminando tabla antigua si existe...');
        await connection.execute('DROP TABLE IF EXISTS favorites');

        console.log('📋 Paso 2: Creando nueva tabla con campos en inglés...');
        await connection.execute(`
            CREATE TABLE favorites (
                id VARCHAR(10) PRIMARY KEY COMMENT 'ID del personaje de SWAPI',
                name VARCHAR(100) NOT NULL COMMENT 'Nombre del personaje',
                height VARCHAR(50) COMMENT 'Altura en cm',
                mass VARCHAR(50) COMMENT 'Masa en kg',
                hair_color VARCHAR(50) COMMENT 'Color de cabello',
                skin_color VARCHAR(50) COMMENT 'Color de piel',
                eye_color VARCHAR(50) COMMENT 'Color de ojos',
                birth_year VARCHAR(50) COMMENT 'Año de nacimiento',
                gender VARCHAR(50) COMMENT 'Género',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
                INDEX idx_name (name),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('📋 Paso 3: Verificando estructura de la tabla...');
        const [columns] = await connection.execute('DESCRIBE favorites');
        console.log('✅ Estructura de la tabla:', columns);

        // Confirmar transacción
        await connection.commit();

        console.log('✅ Migración completada exitosamente');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: 'Migración completada exitosamente',
                tableStructure: columns
            })
        };

    } catch (error: any) {
        // Revertir transacción en caso de error
        await connection.rollback();

        console.error('❌ Error durante la migración:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                message: 'Error durante la migración',
                error: error.message
            })
        };
    } finally {
        connection.release();
    }
};
