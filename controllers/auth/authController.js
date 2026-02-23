const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;

// ==========================
// 🔑 FUNÇÃO: GERAR TOKEN JWT
// ==========================
const generateToken = (email, id, nome) => {
  return jwt.sign({ email, id, nome }, JWT_SECRET, { expiresIn: '6h' });
};

// ==========================
// 🔐 LOGIN DE USUÁRIO
// ==========================
const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca usuário no back-end principal
    const response = await axios.get(`${BACKEND_URL}/byEmail/${email}`);
    const user = response.data;

    if (!user) return res.status(400).json({ error: 'Credenciais inválidas.' });

    // Compara a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ error: 'Credenciais inválidas.' });

    // Gera token
    const token = generateToken(user.email, user._id, user.nome);

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: { id: user._id, nome: user.nome, email: user.email },
      token,
    });

  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
};

// ==========================
// 🧾 REGISTRO DE USUÁRIO
// ==========================
const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // --- Verifica se o e-mail já está cadastrado ---
    const existingUser = await axios
      .get(`${BACKEND_URL}/byEmail/${email}`)
      .then((res) => res.data)
      .catch(() => null);

    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    // --- Criptografa a senha ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // --- Envia dados ao backend principal para criação ---
    const response = await axios.post(`${BACKEND_URL}/internal`, {
      nome,
      email,
      senha: hashedPassword,
    });

    const user = response.data.user;

    // --- Gera token ---
    const token = generateToken(user.email, user._id, user.nome);

    // --- Retorna sucesso ---
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user,
      token,
    });

  } catch (err) {
    console.error('Erro ao registrar usuário:', err.message);
    res.status(500).json({ error: 'Falha ao registrar usuário.' });
  }
};

module.exports = { loginUser, registerUser };
