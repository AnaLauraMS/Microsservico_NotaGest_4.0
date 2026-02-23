const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome || '', 
    };

    next();
  } catch (err) {
    console.error('Token inválido ou expirado:', err.message);
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = verifyToken;
