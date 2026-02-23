const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDb'); 
const authRoutes = require('./routes/authRoutes'); 
const setupSwagger = require('./config/swaggerConfig'); 

// Carrega variáveis de ambiente
dotenv.config();

// Conecta ao MongoDB
connectDB(); 

// Cria a aplicação Express
const app = express(); 

// Configura o middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      'https://nota-gest.vercel.app',
      'https://micronotagest.onrender.com',
      'http://localhost:5001'
    ];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin não permitido pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Configura o Express para parsear JSON
app.use(express.json());

// Configura o Swagger
setupSwagger(app); // adiciona a rota /api-docs

// Rotas de autenticação
app.use('/api/users', authRoutes);

// Middleware para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

// Define a porta do servidor
const PORT = process.env.PORT || 5001;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Microsserviço de Autenticação rodando na porta ${PORT}`);
  console.log(`📘 Swagger disponível em http://localhost:${PORT}/api-docs`);
});
