/************************************************************************************
 * Objetivo: API responsável pelo sistema de gerenciamento de estoque SAEB
 * Data: 27/11/2025
 * Autor: João Pedro
 * Versão: 2.0
 *****************************************************************************/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const jsonValidator = require('./middleware/jsonValidator');

// Importação das rotas
const router = require('./routes/router');

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API SAEB - Sistema de Gerenciamento de Estoque',
            version: '2.0.0',
            description: 'API para gerenciamento de produtos, categorias, fabricantes e estoque',
            contact: {
                name: 'Suporte SAEB',
                email: 'suporte@saeb.com'
            }
        },
        servers: [
            { url: 'http://localhost:8080', description: 'Servidor de Desenvolvimento' },
            { url: 'https://api.saeb.com', description: 'Servidor de Produção' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                Usuario: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nome: { type: 'string' },
                        email: { type: 'string', format: 'email' }
                    }
                },
                UsuarioInput: {
                    type: 'object',
                    required: ['nome', 'email', 'senha'],
                    properties: {
                        nome: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        senha: { type: 'string', format: 'password' }
                    }
                }
            }
        }
    },
    apis: [
        path.join(__dirname, 'routes/*.js'),
        path.join(__dirname, 'controller/**/*.js')
    ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Cria o objeto app para criar a API
const app = express();

// Configurações do CORS (deve vir primeiro)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Configurações de middlewares globais
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(jsonValidator);

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Rota para documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SAEB API Documentation',
    customfavIcon: '/favicon.ico'
}));

// Configuração das rotas da API
app.use(router);

// Rota raiz redireciona para a documentação
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Middleware para tratamento de erros 404
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint não encontrado',
        path: req.originalUrl
    });
});

// Middleware para tratamento de erros globais
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Configuração da porta
const PORT = process.env.PORT || 8080;

// Inicialização do servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse a documentação em: http://localhost:${PORT}/api-docs`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
    console.error('Erro não tratado:', err);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('Recebido sinal SIGTERM. Encerrando o servidor...');
    server.close(() => {
        console.log('Servidor encerrado com sucesso');
    });
});

module.exports = app;