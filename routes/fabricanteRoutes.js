const express = require('express');
const router = express.Router();
const fabricanteController = require('../controller/fabricante/controllerFabricante');

/**
 * @swagger
 * /api/fabricantes:
 *   post:
 *     summary: Cria um novo fabricante
 *     tags: [Fabricantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FabricanteInput'
 *     responses:
 *       201:
 *         description: Fabricante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fabricante'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', async (req, res) => {
    try {
        const result = await fabricanteController.inserirFabricante(req.body, req.headers['content-type']);
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
 * /api/fabricantes:
 *   put:
 *     summary: Erro - Use PUT /api/fabricantes/{id} para atualizar
 *     tags: [Fabricantes]
 *     responses:
 *       400:
 *         description: ID do fabricante não fornecido
 */
router.put('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do fabricante não fornecido. Use PUT /api/fabricantes/{id}'
    });
});

/**
 * @swagger
 * /api/fabricantes:
 *   delete:
 *     summary: Erro - Use DELETE /api/fabricantes/{id} para deletar
 *     tags: [Fabricantes]
 *     responses:
 *       400:
 *         description: ID do fabricante não fornecido
 */
router.delete('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do fabricante não fornecido. Use DELETE /api/fabricantes/{id}'
    });
});

/**
 * @swagger
 * /api/fabricantes:
 *   get:
 *     summary: Lista todos os fabricantes
 *     tags: [Fabricantes]
 *     responses:
 *       200:
 *         description: Lista de fabricantes retornada com sucesso
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
 *                 fabricantes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fabricante'
 */
router.get('/', async (req, res) => {
    try {
        const result = await fabricanteController.listarFabricantes();
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
 * /api/fabricantes/{id}:
 *   get:
 *     summary: Busca um fabricante por ID
 *     tags: [Fabricantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fabricante
 *     responses:
 *       200:
 *         description: Fabricante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fabricante'
 *       404:
 *         description: Fabricante não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const result = await fabricanteController.buscarFabricantePorId(req.params.id);
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
 * /api/fabricantes:
 *   post:
 *     summary: Cria um novo fabricante
 *     tags: [Fabricantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FabricanteInput'
 *     responses:
 *       201:
 *         description: Fabricante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fabricante'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', async (req, res) => {
    try {
        const result = await fabricanteController.inserirFabricante(req.body, req.headers['content-type']);
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
 * /api/fabricantes:
 *   put:
 *     summary: Erro - Use PUT /api/fabricantes/{id} para atualizar
 *     tags: [Fabricantes]
 *     responses:
 *       400:
 *         description: ID do fabricante não fornecido
 */
router.put('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do fabricante não fornecido. Use PUT /api/fabricantes/{id}'
    });
});

/**
 * @swagger
 * /api/fabricantes:
 *   delete:
 *     summary: Erro - Use DELETE /api/fabricantes/{id} para deletar
 *     tags: [Fabricantes]
 *     responses:
 *       400:
 *         description: ID do fabricante não fornecido
 */
router.delete('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do fabricante não fornecido. Use DELETE /api/fabricantes/{id}'
    });
});

/**
 * @swagger
 * /api/fabricantes/{id}:
 *   put:
 *     summary: Atualiza um fabricante existente
 *     tags: [Fabricantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fabricante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FabricanteInput'
 *     responses:
 *       200:
 *         description: Fabricante atualizado com sucesso
 *       404:
 *         description: Fabricante não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', async (req, res) => {
    try {
        const result = await fabricanteController.atualizarFabricante(req.body, req.params.id, req.headers['content-type']);
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
 * /api/fabricantes/{id}:
 *   delete:
 *     summary: Remove um fabricante
 *     tags: [Fabricantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fabricante
 *     responses:
 *       200:
 *         description: Fabricante removido com sucesso
 *       404:
 *         description: Fabricante não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await fabricanteController.excluirFabricante(req.params.id);
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
