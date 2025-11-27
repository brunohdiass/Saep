const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/categoria/controllerCategoria');

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', async (req, res) => {
    try {
        const result = await categoriaController.inserirCategoria(req.body, req.headers['content-type']);
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/categorias:
 *   put:
 *     summary: Erro - Use PUT /api/categorias/{id} para atualizar
 *     tags: [Categorias]
 *     responses:
 *       400:
 *         description: ID da categoria não fornecido
 */
router.put('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID da categoria não fornecido. Use PUT /api/categorias/{id}'
    });
});

/**
 * @swagger
 * /api/categorias:
 *   delete:
 *     summary: Erro - Use DELETE /api/categorias/{id} para deletar
 *     tags: [Categorias]
 *     responses:
 *       400:
 *         description: ID da categoria não fornecido
 */
router.delete('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID da categoria não fornecido. Use DELETE /api/categorias/{id}'
    });
});

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 status_code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 categorias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Categoria'
 */
router.get('/', async (req, res) => {
    try {
        const result = await categoriaController.listarCategorias();
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Busca uma categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', async (req, res) => {
    try {
        const result = await categoriaController.buscarCategoriaPorId(req.params.id);
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', async (req, res) => {
    try {
        const result = await categoriaController.inserirCategoria(req.body, req.headers['content-type']);
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/categorias:
 *   put:
 *     summary: Erro - Use PUT /api/categorias/{id} para atualizar
 *     tags: [Categorias]
 *     responses:
 *       400:
 *         description: ID da categoria não fornecido
 */
router.put('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID da categoria não fornecido. Use PUT /api/categorias/{id}'
    });
});

/**
 * @swagger
 * /api/categorias:
 *   delete:
 *     summary: Erro - Use DELETE /api/categorias/{id} para deletar
 *     tags: [Categorias]
 *     responses:
 *       400:
 *         description: ID da categoria não fornecido
 */
router.delete('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID da categoria não fornecido. Use DELETE /api/categorias/{id}'
    });
});

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', async (req, res) => {
    try {
        const result = await categoriaController.atualizarCategoria(req.body, req.params.id, req.headers['content-type']);
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await categoriaController.excluirCategoria(req.params.id);
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

module.exports = router;
