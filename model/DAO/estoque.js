const database = require('./database');

const consultarEstoque = async (produtoId) => {
    try {
        const [estoque] = await database.execute(
            'SELECT * FROM Estoque_Atual WHERE produto_id = ?',
            [produtoId]
        );
        return estoque[0] || null;
    } catch (error) {
        console.error(`Erro ao consultar estoque do produto ${produtoId}:`, error);
        return null;
    }
};

const registrarMovimentacao = async (movimentacao) => {
    try {
        // 1. Obter o estoque atual
        const [estoqueAtual] = await database.execute(
            'SELECT quantidade FROM Estoque_Atual WHERE produto_id = ?',
            [movimentacao.produto_id]
        );

        if (estoqueAtual.length === 0) {
            return {
                erro: true,
                mensagem: 'Produto não encontrado no estoque'
            };
        }

        const quantidadeAtual = estoqueAtual[0].quantidade;
        let novaQuantidade = quantidadeAtual;

        // 2. Calcular nova quantidade
        if (movimentacao.tipo === 'entrada') {
            novaQuantidade += movimentacao.quantidade;
        } else if (movimentacao.tipo === 'saida') {
            if (quantidadeAtual < movimentacao.quantidade) {
                return {
                    erro: true,
                    mensagem: 'Quantidade em estoque insuficiente'
                };
            }
            novaQuantidade -= movimentacao.quantidade;
        } else {
            return {
                erro: true,
                mensagem: 'Tipo de movimentação inválido'
            };
        }

        // 3. Atualizar estoque atual
        await database.execute(
            'UPDATE Estoque_Atual SET quantidade = ? WHERE produto_id = ?',
            [novaQuantidade, movimentacao.produto_id]
        );

        // 4. Registrar a movimentação
        const [result] = await database.execute(
            `INSERT INTO Estoque_Movimentacao 
             (produto_id, usuario_id, tipo, quantidade, motivo, estoque_antes, estoque_depois)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                movimentacao.produto_id,
                movimentacao.usuario_id,
                movimentacao.tipo,
                movimentacao.quantidade,
                movimentacao.motivo || null,
                quantidadeAtual,
                novaQuantidade
            ]
        );

        return result.insertId;
    } catch (error) {
        console.error('Erro ao registrar movimentação de estoque:', error);
        return {
            erro: true,
            mensagem: 'Erro ao registrar movimentação de estoque'
        };
    }
};

const listarHistoricoMovimentacoes = async (filtro = {}) => {
    try {
        let query = `
            SELECT 
                em.*, 
                p.nome as produto_nome,
                p.codigo as produto_codigo,
                u.nome as usuario_nome
            FROM Estoque_Movimentacao em
            JOIN Produto p ON em.produto_id = p.produto_id
            JOIN Usuario u ON em.usuario_id = u.usuario_id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filtro.produto_id) {
            query += ' AND em.produto_id = ?';
            params.push(filtro.produto_id);
        }
        
        if (filtro.tipo) {
            query += ' AND em.tipo = ?';
            params.push(filtro.tipo);
        }
        
        if (filtro.data_inicio) {
            query += ' AND em.data_movimentacao >= ?';
            params.push(filtro.data_inicio);
        }
        
        if (filtro.data_fim) {
            query += ' AND em.data_movimentacao <= ?';
            params.push(filtro.data_fim);
        }
        
        query += ' ORDER BY em.data_movimentacao DESC';
        
        if (filtro.limite) {
            query += ' LIMIT ?';
            params.push(parseInt(filtro.limite));
        }
        
        const [movimentacoes] = await database.execute(query, params);
        return movimentacoes;
    } catch (error) {
        console.error('Erro ao listar histórico de movimentações:', error);
        return [];
    }
};

const listarProdutosComEstoque = async (filtro = {}) => {
    try {
        let query = `
            SELECT 
                p.*,
                c.nome as categoria_nome,
                f.nome as fabricante_nome,
                COALESCE(e.quantidade, 0) as quantidade_estoque
            FROM Produto p
            JOIN Categoria c ON p.categoria_id = c.categoria_id
            JOIN Fabricante f ON p.fabricante_id = f.fabricante_id
            LEFT JOIN Estoque_Atual e ON p.produto_id = e.produto_id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filtro.categoria_id) {
            query += ' AND p.categoria_id = ?';
            params.push(filtro.categoria_id);
        }
        
        if (filtro.fabricante_id) {
            query += ' AND p.fabricante_id = ?';
            params.push(filtro.fabricante_id);
        }
        
        if (filtro.estoque_minimo !== undefined) {
            query += ' AND COALESCE(e.quantidade, 0) <= ?';
            params.push(parseInt(filtro.estoque_minimo));
        }
        
        if (filtro.busca) {
            query += ' AND (p.nome LIKE ? OR p.codigo LIKE ?)';
            const buscaTerm = `%${filtro.busca}%`;
            params.push(buscaTerm, buscaTerm);
        }
        
        query += ' ORDER BY p.nome';
        
        const [produtos] = await database.execute(query, params);
        return produtos;
    } catch (error) {
        console.error('Erro ao listar produtos com estoque:', error);
        return [];
    }
};

module.exports = {
    consultarEstoque,
    registrarMovimentacao,
    listarHistoricoMovimentacoes,
    listarProdutosComEstoque
};
