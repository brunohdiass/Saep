const database = require('./database');

const listarProdutos = async () => {
    try {
        const [produtos] = await database.execute(`
            SELECT p.*, c.nome as categoria_nome, f.nome as fabricante_nome 
            FROM Produto p
            JOIN Categoria c ON p.categoria_id = c.categoria_id
            JOIN Fabricante f ON p.fabricante_id = f.fabricante_id
        `);
        return produtos;
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        return [];
    }
};

const buscarProdutoPorId = async (id) => {
    try {
        const [produto] = await database.execute(
            `SELECT p.*, c.nome as categoria_nome, f.nome as fabricante_nome 
             FROM Produto p
             JOIN Categoria c ON p.categoria_id = c.categoria_id
             JOIN Fabricante f ON p.fabricante_id = f.fabricante_id
             WHERE p.produto_id = ?`, 
            [id]
        );
        return produto[0] || null;
    } catch (error) {
        console.error(`Erro ao buscar produto com ID ${id}:`, error);
        return null;
    }
};

const inserirProduto = async (produto) => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();

        // Inserir o produto
        const [result] = await connection.query(
            'INSERT INTO Produto (nome, codigo, descricao, categoria_id, fabricante_id) VALUES (?, ?, ?, ?, ?)',
            [produto.nome, produto.codigo, produto.descricao, produto.categoria_id, produto.fabricante_id]
        );
        
        const produtoId = result.insertId;

        // Inserir estoque inicial
        await connection.query(
            'INSERT INTO Estoque_Atual (produto_id, quantidade) VALUES (?, 0)',
            [produtoId]
        );

        await connection.commit();
        return produtoId;
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao inserir produto:', error);
        throw error;
    } finally {
        connection.release();
    }
};

const atualizarProduto = async (id, produto) => {
    try {
        // Garante que todos os valores passados para o SQL são válidos (nenhum undefined)
        produto.nome = produto.nome || null;
        produto.codigo = produto.codigo || null;
        produto.descricao = produto.descricao || null;
        produto.categoria_id = produto.categoria_id || null;
        produto.fabricante_id = produto.fabricante_id || null;

        const [result] = await database.execute(
            `UPDATE Produto 
             SET nome = ?, codigo = ?, descricao = ?, categoria_id = ?, fabricante_id = ? 
             WHERE produto_id = ?`,
            [produto.nome, produto.codigo, produto.descricao, produto.categoria_id, produto.fabricante_id, id]
        );

        if (result.affectedRows > 0) {
            return await buscarProdutoPorId(id);  // Retorna o produto atualizado
        } else {
            return null;  // Produto não encontrado
        }
    } catch (error) {
        console.error(`Erro ao atualizar produto com ID ${id}:`, error);
        return null;
    }
};

const excluirProduto = async (id) => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();

        // Excluir especificações (cascata)
        await connection.query('DELETE FROM Especificacao WHERE produto_id = ?', [id]);
        
        // Excluir variações (cascata)
        await connection.query('DELETE FROM Variacao WHERE produto_id = ?', [id]);
        
        // Excluir movimentações de estoque
        await connection.query('DELETE FROM Estoque_Movimentacao WHERE produto_id = ?', [id]);
        
        // Excluir estoque atual
        await connection.query('DELETE FROM Estoque_Atual WHERE produto_id = ?', [id]);
        
        // Finalmente, excluir o produto
        const [result] = await connection.query('DELETE FROM Produto WHERE produto_id = ?', [id]);
        
        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        console.error(`Erro ao excluir produto com ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
};

// Métodos para gerenciar especificações
const buscarEspecificacaoPorProdutoId = async (produtoId) => {
    try {
        const [especificacao] = await database.query(
            'SELECT * FROM Especificacao WHERE produto_id = ?', 
            [produtoId]
        );
        return especificacao[0];
    } catch (error) {
        console.error(`Erro ao buscar especificação do produto ${produtoId}:`, error);
        throw error;
    }
};

const atualizarEspecificacao = async (produtoId, especificacao) => {
    try {
        const [result] = await database.query(
            `INSERT INTO Especificacao (
                produto_id, processador, memoria_ram, armazenamento_interno, 
                tela_tamanho, tela_resolucao, camera_frontal, camera_traseira, 
                conectividade, sistema_operacional, portas
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                processador = VALUES(processador),
                memoria_ram = VALUES(memoria_ram),
                armazenamento_interno = VALUES(armazenamento_interno),
                tela_tamanho = VALUES(tela_tamanho),
                tela_resolucao = VALUES(tela_resolucao),
                camera_frontal = VALUES(camera_frontal),
                camera_traseira = VALUES(camera_traseira),
                conectividade = VALUES(conectividade),
                sistema_operacional = VALUES(sistema_operacional),
                portas = VALUES(portas)`,
            [
                produtoId,
                especificacao.processador,
                especificacao.memoria_ram,
                especificacao.armazenamento_interno,
                especificacao.tela_tamanho,
                especificacao.tela_resolucao,
                especificacao.camera_frontal,
                especificacao.camera_traseira,
                especificacao.conectividade,
                especificacao.sistema_operacional,
                especificacao.portas
            ]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Erro ao atualizar especificação do produto ${produtoId}:`, error);
        throw error;
    }
};

// Métodos para gerenciar variações
const listarVariacoesPorProduto = async (produtoId) => {
    try {
        const [variacoes] = await database.query(
            'SELECT * FROM Variacao WHERE produto_id = ?',
            [produtoId]
        );
        return variacoes;
    } catch (error) {
        console.error(`Erro ao listar variações do produto ${produtoId}:`, error);
        throw error;
    }
};

const adicionarVariacao = async (produtoId, variacao) => {
    try {
        const [result] = await database.query(
            'INSERT INTO Variacao (produto_id, cor, armazenamento, modelo, voltagem, peso) VALUES (?, ?, ?, ?, ?, ?)',
            [
                produtoId,
                variacao.cor,
                variacao.armazenamento,
                variacao.modelo,
                variacao.voltagem,
                variacao.peso
            ]
        );
        return result.insertId;
    } catch (error) {
        console.error(`Erro ao adicionar variação ao produto ${produtoId}:`, error);
        throw error;
    }
};

const removerVariacao = async (variacaoId) => {
    try {
        const [result] = await database.query(
            'DELETE FROM Variacao WHERE variacao_id = ?',
            [variacaoId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Erro ao remover variação ${variacaoId}:`, error);
        throw error;
    }
};

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    inserirProduto,
    atualizarProduto,
    excluirProduto,
    buscarEspecificacaoPorProdutoId,
    atualizarEspecificacao,
    listarVariacoesPorProduto,
    adicionarVariacao,
    removerVariacao
};
