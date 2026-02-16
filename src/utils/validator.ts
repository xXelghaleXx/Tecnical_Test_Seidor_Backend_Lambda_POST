/**
 * Utilidad para validar y sanitizar datos de personajes favoritos
 */

export interface FavoriteCharacterData {
    id: string;
    name: string;
    height?: string;
    mass?: string;
    hair_color?: string;
    skin_color?: string;
    eye_color?: string;
    birth_year?: string;
    gender?: string;
}

export class FavoriteValidator {
    /**
     * Valida los datos de un personaje favorito
     * @returns Array de errores (vacío si es válido)
     */
    static validate(data: any): string[] {
        const errors: string[] = [];

        // Validar que data sea un objeto
        if (!data || typeof data !== 'object') {
            errors.push('Los datos deben ser un objeto JSON válido');
            return errors;
        }

        // Campo obligatorio: id
        if (!data.id || typeof data.id !== 'string') {
            errors.push('El campo "id" es obligatorio y debe ser texto');
        }

        // Campo obligatorio: name
        if (!data.name || typeof data.name !== 'string') {
            errors.push('El campo "name" es obligatorio y debe ser texto');
        } else if (data.name.trim().length === 0) {
            errors.push('El campo "name" no puede estar vacío');
        } else if (data.name.length > 100) {
            errors.push('El campo "name" no puede exceder 100 caracteres');
        }

        // Validar campos opcionales si están presentes
        if (data.height !== undefined && data.height !== null && data.height !== '') {
            if (typeof data.height !== 'string') {
                errors.push('El campo "height" debe ser texto');
            }
        }

        if (data.mass !== undefined && data.mass !== null && data.mass !== '') {
            if (typeof data.mass !== 'string') {
                errors.push('El campo "mass" debe ser texto');
            }
        }

        // Validar longitud de campos de texto
        const textFields = ['hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender'];
        textFields.forEach(field => {
            if (data[field] && typeof data[field] === 'string' && data[field].length > 50) {
                errors.push(`El campo "${field}" no puede exceder 50 caracteres`);
            }
        });

        return errors;
    }

    /**
     * Sanitiza los datos eliminando espacios innecesarios y valores null/undefined
     */
    static sanitize(data: any): FavoriteCharacterData {
        const sanitized: any = {};

        // Sanitizar campos obligatorios
        sanitized.id = data.id?.toString().trim() || '';
        sanitized.name = data.name?.trim() || '';

        // Sanitizar campos opcionales
        const optionalFields = [
            'height', 'mass', 'hair_color', 'skin_color',
            'eye_color', 'birth_year', 'gender'
        ];

        optionalFields.forEach(field => {
            if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
                sanitized[field] = typeof data[field] === 'string'
                    ? data[field].trim()
                    : data[field];
            }
        });

        return sanitized;
    }

    /**
     * Valida y sanitiza en un solo paso
     */
    static validateAndSanitize(data: any): { valid: boolean; errors: string[]; data?: FavoriteCharacterData } {
        const errors = this.validate(data);

        if (errors.length > 0) {
            return { valid: false, errors };
        }

        const sanitizedData = this.sanitize(data);
        return { valid: true, errors: [], data: sanitizedData };
    }
}
