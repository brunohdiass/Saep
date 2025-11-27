const database = require('./database');

const listarCategorias = async () => {
    try {
        const [categorias] = await database.execute('SELECT * FROM Categoria');
        return categorias;
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        return [];
    }
};

const buscarCategoriaPorId = async (id) => {
    try {
        const [categoria] = await database.execute('SELECT * FROM Categoria WHERE categoria_id = ?', [id]);
        return categoria[0] || null;
    } catch (error) {
        console.error(`Erro ao buscar categoria com ID ${id}:`, error);
        return null;
    }
};

const inserirCategoria = async (categoria) => {
    try {
        const [result] = await database.execute('INSERT INTO Categoria (nome) VALUES (?)', 
            [categoria.nome]);
        return await buscarCategoriaPorId(result.insertId);
    } catch (error) {
        console.error('Erro ao inserir categoria:', error);
        return null;
    }
};

const atualizarCategoria = async (id, categoria) => {
    try {
        const [result] = await database.execute(
            'UPDATE Categoria SET nome = ? WHERE categoria_id = ?',
            [categoria.nome, id]
        );
        if (result.affectedRows > 0) {
            return await buscarCategoriaPorId(id);
        }
        return null;
    } catch (error) {
        console.error(`Erro ao atualizar categoria com ID ${id}:`, error);
        return null;
    }
};

const excluirCategoria = async (id) => {
    try {
        const [result] = await database.execute('DELETE FROM Categoria WHERE categoria_id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Erro ao excluir categoria com ID ${id}:`, error);
        throw error;
    }
};

module.exports = {
    listarCategorias,
    buscarCategoriaPorId,
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria
};
