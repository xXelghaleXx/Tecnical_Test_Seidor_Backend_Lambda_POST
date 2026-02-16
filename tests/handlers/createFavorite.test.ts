/// <reference types="jest" />
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// 1. Mocks definidos fuera
const mockCreate = jest.fn();
const mockValidateAndSanitize = jest.fn();

// 2. Mock FavoritesRepository (Instancia)
jest.mock('../../src/repositories/favorites.repository', () => {
    return {
        FavoritesRepository: jest.fn().mockImplementation(() => ({
            create: mockCreate
        }))
    };
});

// 3. Mock FavoriteValidator (Métodos Estáticos)
jest.mock('../../src/utils/validator', () => {
    return {
        FavoriteValidator: {
            validateAndSanitize: mockValidateAndSanitize // Mock directo del método estático
        }
    };
});

import { handler } from '../../src/handlers/createFavorite';

describe('createFavorite Handler', () => {
    beforeEach(() => {
        mockCreate.mockReset();
        mockValidateAndSanitize.mockReset();
    });

    it('should return 201 when validation passes and creation succeeds', async () => {
        // Arrange
        const mockBody = {
            id: '1',
            name: 'Luke Skywalker',
            gender: 'male'
        };

        // Simular validación exitosa
        mockValidateAndSanitize.mockReturnValue({
            valid: true,
            data: mockBody,
            errors: []
        });

        // Simular creación exitosa en DB
        mockCreate.mockResolvedValue({ insertId: 1, ...mockBody });

        const event = {
            body: JSON.stringify(mockBody)
        } as unknown as APIGatewayProxyEvent;
        const context = {} as Context;

        // Act
        const result: any = await handler(event, context, () => { });

        // Assert
        expect(result.statusCode).toBe(201);
        expect(mockValidateAndSanitize).toHaveBeenCalled();
        expect(mockCreate).toHaveBeenCalledWith(mockBody);
    });

    it('should return 400 when validation fails', async () => {
        // Arrange
        mockValidateAndSanitize.mockReturnValue({
            valid: false,
            errors: ['Name is required']
        });

        const event = {
            body: JSON.stringify({ id: '1' })
        } as unknown as APIGatewayProxyEvent;
        const context = {} as Context;

        // Act
        const result: any = await handler(event, context, () => { });

        // Assert
        expect(result.statusCode).toBe(400); // ResponseHelper usa validationError que suele ser 400
        expect(mockCreate).not.toHaveBeenCalled();
    });
});
