const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuario/controllerUsuario');

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const result = await usuarioController.autenticarUsuario(email, senha);
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao autenticar usuário',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', async (req, res) => {
    try {
        const result = await usuarioController.inserirUsuario(req.body, req.headers['content-type']);
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
 * /api/usuarios:
 *   put:
 *     summary: Erro - Use PUT /api/usuarios/{id} para atualizar
 *     tags: [Usuários]
 *     responses:
 *       400:
 *         description: ID do usuário não fornecido
 */
router.put('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do usuário não fornecido. Use PUT /api/usuarios/{id}'
    });
});

/**
 * @swagger
 * /api/usuarios:
 *   delete:
 *     summary: Erro - Use DELETE /api/usuarios/{id} para deletar
 *     tags: [Usuários]
 *     responses:
 *       400:
 *         description: ID do usuário não fornecido
 */
router.delete('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do usuário não fornecido. Use DELETE /api/usuarios/{id}'
    });
});

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 */
router.get('/', async (req, res) => {
    try {
        const result = await usuarioController.listarUsuarios();
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
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const result = await usuarioController.buscarUsuarioPorId(req.params.id);
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
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', async (req, res) => {
    try {
        const result = await usuarioController.atualizarUsuario(req.body, req.params.id, req.headers['content-type']);
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
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await usuarioController.excluirUsuario(req.params.id);
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
