/**
 * Helper para generar respuestas HTTP consistentes con headers CORS
 */

interface ResponseOptions {
    statusCode: number;
    data?: any;
    message?: string;
    error?: string;
}

export class ResponseHelper {
    /**
     * Headers CORS para permitir peticiones desde navegadores
     */
    private static getCorsHeaders() {
        return {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // En producción, especifica el dominio exacto
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
        };
    }

    /**
     * Genera una respuesta de éxito
     */
    static success(data: any, message: string = 'Operación exitosa', statusCode: number = 200) {
        return {
            statusCode,
            headers: this.getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                message,
                data,
            }),
        };
    }

    /**
     * Genera una respuesta de error
     */
    static error(message: string, statusCode: number = 500, error?: any) {
        console.error('Error Response:', { message, statusCode, error });

        return {
            statusCode,
            headers: this.getCorsHeaders(),
            body: JSON.stringify({
                success: false,
                message,
                error: error?.message || error,
            }),
        };
    }

    /**
     * Genera una respuesta de validación fallida
     */
    static validationError(errors: string[]) {
        return {
            statusCode: 400,
            headers: this.getCorsHeaders(),
            body: JSON.stringify({
                success: false,
                message: 'Errores de validación',
                errors,
            }),
        };
    }
}
