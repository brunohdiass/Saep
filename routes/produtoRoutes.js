const express = require('express');
const router = express.Router();
const produtoController = require('../controller/produto/controllerProduto');

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', async (req, res) => {
    try {
        const result = await produtoController.inserirProduto(req.body, req.headers['content-type']);
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
 * /api/produtos:
 *   put:
 *     summary: Erro - Use PUT /api/produtos/{id} para atualizar
 *     tags: [Produtos]
 *     responses:
 *       400:
 *         description: ID do produto não fornecido
 */
router.put('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do produto não fornecido. Use PUT /api/produtos/{id}'
    });
});

/**
 * @swagger
 * /api/produtos:
 *   delete:
 *     summary: Erro - Use DELETE /api/produtos/{id} para deletar
 *     tags: [Produtos]
 *     responses:
 *       400:
 *         description: ID do produto não fornecido
 */
router.delete('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'ID do produto não fornecido. Use DELETE /api/produtos/{id}'
    });
});

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de categoria
 *       - in: query
 *         name: fabricante
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de fabricante
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Termo de busca no nome ou código do produto
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
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
 *                 produtos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 */
router.get('/', async (req, res) => {
    try {
        const result = await produtoController.listarProdutos(req.query);
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
 * /api/produtos/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoDetalhado'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const result = await produtoController.buscarProdutoPorId(req.params.id);
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
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', async (req, res) => {
    try {
        const result = await produtoController.atualizarProduto(req.body, req.params.id, req.headers['content-type']);
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
 * /api/produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await produtoController.excluirProduto(req.params.id);
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
 * /api/produtos/{id}/especificacao:
 *   get:
 *     summary: Obtém a especificação de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Especificação do produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especificacao'
 *       404:
 *         description: Produto ou especificação não encontrada
 */
router.get('/:id/especificacao', async (req, res) => {
    try {
        const result = await produtoController.buscarEspecificacaoPorIdProduto(req.params.id);
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
 * /api/produtos/{id}/especificacao:
 *   put:
 *     summary: Atualiza a especificação de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EspecificacaoInput'
 *     responses:
 *       200:
 *         description: Especificação atualizada com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id/especificacao', async (req, res) => {
    try {
        const result = await produtoController.atualizarEspecificacao(req.params.id, req.body, req.headers['content-type']);
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
 * /api/produtos/{id}/variacoes:
 *   get:
 *     summary: Lista as variações de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Lista de variações do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Variacao'
 */
router.get('/:id/variacoes', async (req, res) => {
    try {
        const result = await produtoController.listarVariacoesPorProdutoId(req.params.id);
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
 * /api/produtos/{id}/variacoes:
 *   post:
 *     summary: Adiciona uma variação a um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VariacaoInput'
 *     responses:
 *       201:
 *         description: Variação adicionada com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.post('/:id/variacoes', async (req, res) => {
    try {
        const result = await produtoController.adicionarVariacao(req.params.id, req.body, req.headers['content-type']);
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
 * /api/produtos/{id}/variacoes/{variacaoId}:
 *   delete:
 *     summary: Remove uma variação de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *       - in: path
 *         name: variacaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da variação
 *     responses:
 *       200:
 *         description: Variação removida com sucesso
 *       404:
 *         description: Produto ou variação não encontrada
 */
router.delete('/:id/variacoes/:variacaoId', async (req, res) => {
    try {
        const result = await produtoController.removerVariacao(req.params.variacaoId);
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
