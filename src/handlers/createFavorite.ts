import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { FavoritesRepository } from '../repositories/favorites.repository';
import { FavoriteValidator } from '../utils/validator';
import { ResponseHelper } from '../utils/response.helper';

/**
 * Handler para crear un nuevo personaje favorito
 * Endpoint: POST /api/favorites
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log('📥 Recibida petición POST /api/favorites');
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        // Manejar preflight CORS (OPTIONS request)
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS',
                },
                body: '',
            };
        }

        // Parsear el body - manejar tanto string como objeto
        let body: any;
        try {
            body = typeof event.body === 'string'
                ? JSON.parse(event.body)
                : event.body;
        } catch (parseError) {
            console.error('❌ Error al parsear JSON:', parseError);
            return ResponseHelper.error('El cuerpo de la petición debe ser JSON válido', 400);
        }

        console.log('📦 Datos recibidos:', body);

        // Validar y sanitizar datos
        const validation = FavoriteValidator.validateAndSanitize(body);

        if (!validation.valid) {
            console.warn('⚠️ Validación fallida:', validation.errors);
            return ResponseHelper.validationError(validation.errors);
        }

        console.log('✅ Validación exitosa, datos sanitizados:', validation.data);

        // Guardar en la base de datos
        const repo = new FavoritesRepository();
        const result = await repo.create(validation.data);

        console.log('✅ Favorito guardado exitosamente:', result);

        // Respuesta exitosa
        return ResponseHelper.success(
            {
                id: result.insertId,
                ...validation.data
            },
            'Favorito guardado con éxito',
            201
        );

    } catch (error: any) {
        console.error('❌ Error en handler:', error);

        // Manejar diferentes tipos de errores
        if (error.message?.includes('base de datos')) {
            return ResponseHelper.error(
                'Error al conectar con la base de datos. Por favor, intenta nuevamente.',
                503,
                error
            );
        }

        if (error.message?.includes('ya existe')) {
            return ResponseHelper.error(error.message, 409, error);
        }

        // Error genérico
        return ResponseHelper.error(
            'Error interno del servidor',
            500,
            error
        );
    }
};