const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Novas rotas
const authRoutes = require("./config/server/routers/auth.cjs")
const materialRoutes = require("./config/server/routers/material.cjs")
const verifyRoutes = require("./config/server/routers/verify.cjs")
const alunosRoutes = require("./config/server/routers/alunos.cjs")
const chamadasRoutes = require("./config/server/routers/chamadas.cjs")
const configRoutes = require("./config/server/routers/config.cjs")
const statisticsRoutes = require("./config/server/routers/statistics.cjs")

const app = express();

const connectWithRetry = async () => {
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    console.log('Tentando se reconectar em 5 segundos...');
    setTimeout(connectWithRetry, 8000); // Tenta se reconectar após 5 segundos
  }
};

connectWithRetry(); // Inicia a primeira tentativa de conexão

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Servidor funcional!');
});

app.use('/auth', authRoutes);
app.use('/material', materialRoutes);
app.use('/verify', verifyRoutes);
app.use('/alunos', alunosRoutes);
app.use('/chamadas', chamadasRoutes);
app.use('/config', configRoutes);
app.use('/statistics', statisticsRoutes);

const PORT = process.env.PORT || 3000;

// Inicie o servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor funcional em http://35.208.36.27:${PORT}`);
});
