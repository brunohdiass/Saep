const database = require('./database');

const listarFabricantes = async () => {
    try {
        const [fabricantes] = await database.execute('SELECT * FROM Fabricante');
        return fabricantes;
    } catch (error) {
        console.error('Erro ao listar fabricantes:', error);
        return [];
    }
};

const buscarFabricantePorId = async (id) => {
    try {
        const [fabricante] = await database.execute('SELECT * FROM Fabricante WHERE fabricante_id = ?', [id]);
        return fabricante[0] || null;
    } catch (error) {
        console.error(`Erro ao buscar fabricante com ID ${id}:`, error);
        return null;
    }
};

const inserirFabricante = async (fabricante) => {
    try {
        const [result] = await database.execute('INSERT INTO Fabricante (nome) VALUES (?)', 
            [fabricante.nome]);
        return await buscarFabricantePorId(result.insertId);
    } catch (error) {
        console.error('Erro ao inserir fabricante:', error);
        return null;
    }
};

const atualizarFabricante = async (id, fabricante) => {
    try {
        const [result] = await database.execute(
            'UPDATE Fabricante SET nome = ? WHERE fabricante_id = ?',
            [fabricante.nome, id]
        );
        if (result.affectedRows > 0) {
            return await buscarFabricantePorId(id);
        }
        return null;
    } catch (error) {
        console.error(`Erro ao atualizar fabricante com ID ${id}:`, error);
        return null;
    }
};

const excluirFabricante = async (id) => {
    try {
        const [result] = await database.execute('DELETE FROM Fabricante WHERE fabricante_id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Erro ao excluir fabricante com ID ${id}:`, error);
        throw error;
    }
};

module.exports = {
    listarFabricantes,
    buscarFabricantePorId,
    inserirFabricante,
    atualizarFabricante,
    excluirFabricante
};
