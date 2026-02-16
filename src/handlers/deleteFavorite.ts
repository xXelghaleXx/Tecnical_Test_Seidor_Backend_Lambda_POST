import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { FavoritesRepository } from '../repositories/favorites.repository';
import { ResponseHelper } from '../utils/response.helper';

/**
 * Handler para eliminar un personaje favorito
 * Endpoint: DELETE /api/favorites/{id}
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log('📥 Recibida petición DELETE /api/favorites/{id}');
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        // Manejar preflight CORS (OPTIONS request)
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
                },
                body: '',
            };
        }

        // Extraer ID del path: /api/favorites/{id}
        const id = event.pathParameters?.id;

        if (!id) {
            console.error('❌ ID de favorito no proporcionado');
            return ResponseHelper.error('ID de favorito requerido', 400);
        }

        console.log(`🗑️ Eliminando favorito con ID: ${id}`);

        // Eliminar de la base de datos
        const repo = new FavoritesRepository();
        await repo.delete(parseInt(id, 10));

        console.log('✅ Favorito eliminado exitosamente');

        // Respuesta exitosa
        return ResponseHelper.success(
            { id: parseInt(id, 10) },
            'Favorito eliminado con éxito',
            200
        );

    } catch (error: any) {
        console.error('❌ Error en handler:', error);

        // Manejar diferentes tipos de errores
        if (error.message?.includes('no encontrado')) {
            return ResponseHelper.error(
                'Favorito no encontrado',
                404,
                error
            );
        }

        if (error.message?.includes('base de datos')) {
            return ResponseHelper.error(
                'Error al conectar con la base de datos. Por favor, intenta nuevamente.',
                503,
                error
            );
        }

        // Error genérico
        return ResponseHelper.error(
            'Error interno del servidor',
            500,
            error
        );
    }
};
