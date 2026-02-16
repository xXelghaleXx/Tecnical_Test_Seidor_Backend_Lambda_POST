#!/usr/bin/env node

/**
 * Script de prueba para el endpoint POST /api/favorites
 * 
 * Uso:
 *   node test-api.js [URL_DEL_API]
 * 
 * Si no se proporciona URL, usa localhost por defecto
 */

const https = require('https');
const http = require('http');

// URL del API (puede ser local o desplegado en AWS)
const API_URL = process.argv[2] || 'http://localhost:3000/api/favorites';

console.log('🧪 Iniciando pruebas del API POST /api/favorites');
console.log(`📍 URL: ${API_URL}\n`);

// Función helper para hacer peticiones POST
function makeRequest(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;

        const postData = JSON.stringify(data);

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = client.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    });
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Casos de prueba
const tests = [
    {
        name: '✅ Test 1: Datos válidos completos',
        data: {
            nombre: 'Luke Skywalker',
            altura: '172',
            masa: '77',
            color_cabello: 'blond',
            color_piel: 'fair',
            color_ojos: 'blue',
            anio_nacimiento: '19BBY',
            genero: 'male',
            url_original: 'https://swapi.dev/api/people/1/'
        },
        expectedStatus: 201
    },
    {
        name: '✅ Test 2: Solo nombre (campos opcionales)',
        data: {
            nombre: 'Darth Vader'
        },
        expectedStatus: 201
    },
    {
        name: '❌ Test 3: Sin nombre (debe fallar)',
        data: {
            altura: '202',
            masa: '136'
        },
        expectedStatus: 400
    },
    {
        name: '❌ Test 4: Nombre vacío (debe fallar)',
        data: {
            nombre: '   '
        },
        expectedStatus: 400
    },
    {
        name: '❌ Test 5: Altura inválida (debe fallar)',
        data: {
            nombre: 'Yoda',
            altura: 'muy bajo'
        },
        expectedStatus: 400
    },
    {
        name: '❌ Test 6: JSON inválido',
        data: 'esto no es JSON',
        expectedStatus: 400,
        skipStringify: true
    }
];

// Ejecutar pruebas
async function runTests() {
    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(test.name);
        console.log(`${'='.repeat(60)}`);
        console.log('📤 Datos enviados:', JSON.stringify(test.data, null, 2));

        try {
            const response = await makeRequest(API_URL, test.data);

            console.log(`📥 Status Code: ${response.statusCode}`);
            console.log('📥 Respuesta:', JSON.stringify(response.body, null, 2));

            // Verificar CORS headers
            if (response.headers['access-control-allow-origin']) {
                console.log('✅ CORS headers presentes');
            } else {
                console.log('⚠️  CORS headers faltantes');
            }

            // Verificar status code esperado
            if (response.statusCode === test.expectedStatus) {
                console.log(`✅ Test PASÓ (esperado ${test.expectedStatus}, recibido ${response.statusCode})`);
                passed++;
            } else {
                console.log(`❌ Test FALLÓ (esperado ${test.expectedStatus}, recibido ${response.statusCode})`);
                failed++;
            }

        } catch (error) {
            console.log('❌ Error en la petición:', error.message);
            failed++;
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Pasaron: ${passed}`);
    console.log(`❌ Fallaron: ${failed}`);
    console.log(`📈 Total: ${tests.length}`);
    console.log(`${'='.repeat(60)}\n`);
}

// Ejecutar
runTests().catch(console.error);
