const express = require('express');
const router = express.Router();

// Import route modules
const produtoRouter = require('./produtoRoutes');
const categoriaRouter = require('./categoriaRoutes');
const fabricanteRouter = require('./fabricanteRoutes');
const estoqueRouter = require('./estoqueRoutes');
const usuarioRouter = require('./usuarioRoutes');

// API Routes
router.use('/api/produtos', produtoRouter);
router.use('/api/categorias', categoriaRouter);
router.use('/api/fabricantes', fabricanteRouter);
router.use('/api/estoque', estoqueRouter);
router.use('/api/usuarios', usuarioRouter);

// Aliases para rotas singulares (redirecionamento)
router.use('/api/usuario', usuarioRouter);
router.use('/api/produto', produtoRouter);
router.use('/api/categoria', categoriaRouter);
router.use('/api/fabricante', fabricanteRouter);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
