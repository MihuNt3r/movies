import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import swaggerAutogen from 'swagger-autogen'

const _dirname = dirname(fileURLToPath(import.meta.url))

const doc = {
    info: {
        title: 'My API',
        description: 'Description'
    },
    host: 'localhost:8050'
};

// путь и название генерируемого файла
const outputFile = './swagger-output.json';

// массив путей к роутерам
const routes = ['../index.ts'];

swaggerAutogen(outputFile, routes, doc);