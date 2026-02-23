const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const PORT = process.env.PORT || 5001;

// 👉 URL correta do microserviço (Auth Service)
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || 'https://micronotagest.onrender.com';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service - NotaGest',
      version: '1.0.0',
      description: 'Microserviço responsável pelo registro e login de usuários com JWT.',
    },

    // 👉 Swagger só precisa apontar para o Auth Service (este micro)
    servers: [
      {
        url: AUTH_SERVICE_URL,
        description: 'Servidor Auth Service',
      },
    ],

    components: {
      schemas: {
        RegisterInput: {
          type: 'object',
          properties: {
            nome: { type: 'string', example: 'Bianca' },
            email: { type: 'string', example: 'usuario@email.com' },
            senha: { type: 'string', example: 'senha123' },
          },
          required: ['nome', 'email', 'senha'],
        },
        RegisterSuccess: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Usuário registrado com sucesso!' },
            user: {
              type: 'object',
              example: {
                id: '672ffb1b2ac87031aaf4889c',
                nome: 'Bianca',
                email: 'usuario@email.com'
              }
            },
            token: { type: 'string', example: 'jwt_aqui' },
          },
        },
        LoginInput: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'usuario@email.com' },
            senha: { type: 'string', example: 'senha123' },
          },
          required: ['email', 'senha'],
        },
        LoginSuccess: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login realizado com sucesso!' },
            user: {
              type: 'object',
              example: {
                id: '672ffb1b2ac87031aaf4889c',
                nome: 'Bianca',
                email: 'usuario@email.com'
              }
            },
            token: { type: 'string', example: 'jwt_aqui' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro.' },
          },
        },
      },
    },
  },

  // 👉 Importa os comentários das rotas
  apis: [path.join(__dirname, '../routes/authRoutes.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger rodando em: ${AUTH_SERVICE_URL}/api-docs`);
};

module.exports = setupSwagger;
