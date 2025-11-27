const database = require('./database');
const message = require('../../modulo/config');

// Inserir um novo usuário
const inserirUsuario = async (usuario) => {
    try {
        const { nome, email, senha } = usuario;

        if (!nome || !email || !senha) {
            return { erro: true, mensagem: "Campos obrigatórios faltando." };
        }

        const sql = `
            INSERT INTO Usuario (nome, email, senha)
            VALUES (?, ?, ?)
        `;
        
        const values = [nome, email, senha];
        const [result] = await database.execute(sql, values);

        if (result && result.affectedRows > 0) {
            const novoUsuario = await buscarUsuarioPorId(result.insertId);
            return novoUsuario;
        } else {
            return { erro: true, mensagem: "Falha ao inserir usuário." };
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return {
                erro: true,
                tipo: "email_duplicado",
                mensagem: "E-mail já cadastrado."
            };
        }

        console.error('Erro ao inserir usuário no DAO:', error);
        return { erro: true, mensagem: "Erro interno no DAO." };
    }
};

// Atualizar um usuário existente
const atualizarUsuario = async (usuario, id) => {
    try {
        const { nome, email } = usuario;

        if (!nome || !email) {
            return { erro: true, mensagem: "Campos obrigatórios faltando." };
        }

        // Verificar se o email já existe em outro usuário (apenas se for um email diferente)
        const usuarioAtual = await buscarUsuarioPorId(id);
        if (!usuarioAtual) {
            return { erro: true, mensagem: "Usuário não encontrado." };
        }

        // Se o email mudou, verificar se já existe em outro usuário
        if (email !== usuarioAtual.email) {
            const usuarioComEmail = await buscarUsuarioPorEmail(email);
            if (usuarioComEmail) {
                return {
                    erro: true,
                    tipo: "email_duplicado",
                    mensagem: "E-mail já está sendo usado por outro usuário."
                };
            }
        }

        let sql = 'UPDATE Usuario SET nome = ?, email = ?';
        const values = [nome, email];

        if (usuario.senha) {
            sql += ', senha = ?';
            values.push(usuario.senha);
        }

        sql += ' WHERE usuario_id = ?';
        values.push(id);

        const [result] = await database.execute(sql, values);

        if (result && result.affectedRows > 0) {
            return await buscarUsuarioPorId(id);
        } else {
            return { erro: true, mensagem: "Usuário não encontrado." };
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário no DAO:', error);
        return { erro: true, mensagem: "Erro interno no DAO." };
    }
};

// Excluir um usuário
const excluirUsuario = async (id) => {
    try {
        const sql = 'DELETE FROM Usuario WHERE usuario_id = ?';
        const [result] = await database.execute(sql, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Erro ao excluir usuário no DAO:', error);
        return { erro: true };
    }
};

// Listar todos os usuários
const listarUsuarios = async () => {
    try {
        const sql = 'SELECT usuario_id AS id, nome, email FROM Usuario';
        const [usuarios] = await database.execute(sql);
        return usuarios;
    } catch (error) {
        console.error('Erro ao listar usuários no DAO:', error);
        return [];
    }
};

// Buscar usuário por ID
const buscarUsuarioPorId = async (id) => {
    try {
        const sql = 'SELECT usuario_id AS id, nome, email FROM Usuario WHERE usuario_id = ?';
        const [usuarios] = await database.execute(sql, [id]);
        return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por ID no DAO:', error);
        return null;
    }
};

// Buscar usuário por email (usado na autenticação)
const buscarUsuarioPorEmail = async (email) => {
    try {
        const sql = 'SELECT usuario_id AS id, nome, email, senha FROM Usuario WHERE email = ?';
        const [usuarios] = await database.execute(sql, [email]);
        return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por email no DAO:', error);
        return null;
    }
};

module.exports = {
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail
};
