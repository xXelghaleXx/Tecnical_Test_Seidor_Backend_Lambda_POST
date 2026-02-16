import { pool } from '../utils/db'; // Importa el pool de conexiones seguro
import { ResultSetHeader } from 'mysql2';

export class FavoritesRepository {
    // Definimos 'db' para que los métodos puedan usar la conexión
    private db = pool;

    /**
     * Obtiene todos los personajes guardados como favoritos
     */
    async getAll() {
        try {
            const query = 'SELECT * FROM favorites ORDER BY created_at DESC';
            console.log('Ejecutando query: getAll favorites');
            const [rows] = await this.db.execute(query);
            console.log(`✅ Se obtuvieron ${Array.isArray(rows) ? rows.length : 0} favoritos`);
            return rows;
        } catch (error) {
            console.error('❌ Error al obtener favoritos:', error);
            throw new Error('Error al consultar la base de datos');
        }
    }

    /**
     * Guarda un nuevo personaje usando consultas parametrizadas seguras
     */
    async create(data: any) {
        try {
            // Extraemos los campos del objeto 'data' enviado desde el handler
            const {
                id,
                name,
                height,
                mass,
                hair_color,
                skin_color,
                eye_color,
                birth_year,
                gender
            } = data;

            // Consulta SQL con placeholders (?) para evitar inyecciones
            const query = `
                INSERT INTO favorites
                (id, name, height, mass, hair_color, skin_color, eye_color, birth_year, gender)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Mapeo de valores en el mismo orden que la consulta
            const values = [
                id,
                name,
                height || null,
                mass || null,
                hair_color || null,
                skin_color || null,
                eye_color || null,
                birth_year || null,
                gender || null
            ];

            console.log(`Ejecutando query: INSERT INTO favorites con valores:`, values);

            // Ejecutar la consulta
            const [result] = await this.db.execute<ResultSetHeader>(query, values);

            console.log(`✅ Personaje "${name}" guardado exitosamente con ID ${result.insertId}`);

            return {
                insertId: result.insertId,
                affectedRows: result.affectedRows
            };
        } catch (error: any) {
            console.error('❌ Error al guardar en DB:', error);

            // Manejar error de duplicado (código 1062 de MySQL)
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Este personaje ya está en favoritos');
            }

            throw new Error(`Error al guardar en la base de datos: ${error.message}`);
        }
    }

    /**
     * Elimina un personaje favorito por su ID
     */
    async delete(id: number) {
        try {
            const query = 'DELETE FROM favorites WHERE id = ?';
            console.log(`Ejecutando query: DELETE favorite con ID ${id}`);

            const [result] = await this.db.execute<ResultSetHeader>(query, [id]);

            if (result.affectedRows === 0) {
                console.warn(`⚠️ No se encontró favorito con ID: ${id}`);
                throw new Error('Favorito no encontrado');
            }

            console.log(`✅ Favorito con ID ${id} eliminado exitosamente`);

            return {
                affectedRows: result.affectedRows
            };
        } catch (error: any) {
            console.error('❌ Error al eliminar favorito de DB:', error);

            if (error.message === 'Favorito no encontrado') {
                throw error;
            }

            throw new Error(`Error al eliminar de la base de datos: ${error.message}`);
        }
    }
}
