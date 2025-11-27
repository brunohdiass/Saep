const express = require('express');
const router = express.Router();
const estoqueController = require('../controller/estoque/controllerEstoque');

/**
 * @swagger
 * /api/estoque/produtos:
 *   get:
 *     summary: Lista produtos com informações de estoque
 *     tags: [Estoque]
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de categoria
 *       - in: query
 *         name: fabricante_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de fabricante
 *       - in: query
 *         name: estoque_minimo
 *         schema:
 *           type: integer
 *         description: Filtrar produtos com estoque abaixo deste valor
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Termo de busca no nome ou código do produto
 *     responses:
 *       200:
 *         description: Lista de produtos com estoque
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProdutoEstoque'
 */
/**
 * @swagger
 * /api/estoque:
 *   put:
 *     summary: Erro - Use POST /api/estoque/entrada ou /api/estoque/saida
 *     tags: [Estoque]
 *     responses:
 *       400:
 *         description: Método não permitido
 */
router.put('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'Método não permitido. Use POST /api/estoque/entrada ou POST /api/estoque/saida'
    });
});

/**
 * @swagger
 * /api/estoque:
 *   delete:
 *     summary: Erro - Operação não permitida
 *     tags: [Estoque]
 *     responses:
 *       400:
 *         description: Método não permitido
 */
router.delete('/', async (req, res) => {
    res.status(400).json({
        status: false,
        status_code: 400,
        message: 'Método não permitido para esta rota'
    });
});

router.get('/produtos', async (req, res) => {
    try {
        const result = await estoqueController.listarProdutosComEstoque(req.query);
        res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'Produtos com estoque listados com sucesso',
            data: result
        });
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
 * /api/estoque/produtos/{id}:
 *   get:
 *     summary: Obtém o estoque de um produto específico
 *     tags: [Estoque]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Informações de estoque do produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstoqueAtual'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/produtos/:id', async (req, res) => {
    try {
        const result = await estoqueController.consultarEstoque(req.params.id);
        res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'Estoque consultado com sucesso',
            data: result
        });
    } catch (error) {
        if (error.message === 'Produto não encontrado no estoque') {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado no estoque'
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/estoque/movimentacoes:
 *   get:
 *     summary: Lista o histórico de movimentações de estoque
 *     tags: [Estoque]
 *     parameters:
 *       - in: query
 *         name: produto_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do produto
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [entrada, saida]
 *         description: Tipo de movimentação (entrada ou saída)
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro (YYYY-MM-DD)
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro (YYYY-MM-DD)
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Limite de registros retornados
 *     responses:
 *       200:
 *         description: Histórico de movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovimentacaoEstoque'
 */
router.get('/movimentacoes', async (req, res) => {
    try {
        const result = await estoqueController.listarHistoricoMovimentacoes({
            produto_id: req.query.produto_id,
            tipo: req.query.tipo,
            data_inicio: req.query.data_inicio,
            data_fim: req.query.data_fim,
            limite: req.query.limite
        });
        
        res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'Histórico de movimentações listado com sucesso',
            data: result
        });
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
 * /api/estoque/entrada:
 *   post:
 *     summary: Registra uma entrada de estoque
 *     tags: [Estoque]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produto_id
 *               - quantidade
 *               - usuario_id
 *             properties:
 *               produto_id:
 *                 type: integer
 *                 description: ID do produto
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade a ser adicionada ao estoque
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário responsável pela movimentação
 *               motivo:
 *                 type: string
 *                 description: Motivo da entrada (opcional)
 *     responses:
 *       201:
 *         description: Entrada de estoque registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimentacaoEstoque'
 *       400:
 *         description: Dados inválidos
 */
router.post('/entrada', async (req, res) => {
    try {
        const { produto_id, quantidade, usuario_id, motivo } = req.body;
        
        if (!produto_id || !quantidade || !usuario_id) {
            return res.status(400).json({
                status: false,
                status_code: 400,
                message: 'Campos obrigatórios não informados (produto_id, quantidade, usuario_id)'
            });
        }

        const movimentacao = {
            produto_id,
            quantidade: parseInt(quantidade),
            usuario_id,
            tipo: 'entrada',
            motivo: motivo || 'Entrada de estoque',
            data_movimentacao: new Date()
        };

        const result = await estoqueController.registrarMovimentacao(movimentacao, req.headers['content-type']);
        
        res.status(result.status_code).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao registrar entrada de estoque',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/estoque/saida:
 *   post:
 *     summary: Registra uma saída de estoque
 *     tags: [Estoque]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produto_id
 *               - quantidade
 *               - usuario_id
 *             properties:
 *               produto_id:
 *                 type: integer
 *                 description: ID do produto
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade a ser retirada do estoque
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário responsável pela movimentação
 *               motivo:
 *                 type: string
 *                 description: Motivo da saída (opcional)
 *     responses:
 *       201:
 *         description: Saída de estoque registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimentacaoEstoque'
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 */
router.post('/saida', async (req, res) => {
    try {
        const { produto_id, quantidade, usuario_id, motivo } = req.body;
        
        if (!produto_id || !quantidade || !usuario_id) {
            return res.status(400).json({
                status: false,
                status_code: 400,
                message: 'Campos obrigatórios não informados (produto_id, quantidade, usuario_id)'
            });
        }

        const movimentacao = {
            produto_id,
            quantidade: parseInt(quantidade),
            usuario_id,
            tipo: 'saida',
            motivo: motivo || 'Saída de estoque',
            data_movimentacao: new Date()
        };

        const result = await estoqueController.registrarMovimentacao(movimentacao, req.headers['content-type']);
        
        res.status(result.status_code).json(result);
    } catch (error) {
        if (error.message === 'Quantidade em estoque insuficiente') {
            return res.status(400).json({
                status: 'error',
                message: 'Quantidade em estoque insuficiente para esta operação'
            });
        }
        
        res.status(500).json({
            status: 'error',
            message: 'Erro ao registrar saída de estoque',
            error: error.message
        });
    }
});

module.exports = router;
