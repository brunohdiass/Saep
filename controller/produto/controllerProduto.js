const produtoDAO = require('../../model/DAO/produto.js')
const message = require('../../modulo/config.js')

const inserirProduto = async function(dadosProduto, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!dadosProduto.nome || !dadosProduto.codigo || !dadosProduto.categoria_id || !dadosProduto.fabricante_id) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const novoProduto = await produtoDAO.inserirProduto(dadosProduto)

        if (novoProduto && !novoProduto.erro) {
            const resultDados = {
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
                produto: novoProduto
            }
            return resultDados
        } else if (novoProduto && novoProduto.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const atualizarProduto = async function(dadosProduto, idProduto, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase();

        // Verifica se o Content-Type é JSON
        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE;
        }

        // Verifica se o ID é válido
        if (!idProduto || isNaN(idProduto)) {
            return message.ERROR_INVALID_ID;
        }

        // Verifica se os campos obrigatórios estão presentes
        if (!dadosProduto.nome || !dadosProduto.codigo || !dadosProduto.categoria_id || !dadosProduto.fabricante_id) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        // Preenche valores nulos para evitar undefined no banco de dados
        dadosProduto.nome = dadosProduto.nome || null;
        dadosProduto.codigo = dadosProduto.codigo || null;
        dadosProduto.descricao = dadosProduto.descricao || null;
        dadosProduto.categoria_id = dadosProduto.categoria_id || null;
        dadosProduto.fabricante_id = dadosProduto.fabricante_id || null;

        // Atualiza o produto no banco de dados
        const produtoAtualizado = await produtoDAO.atualizarProduto(dadosProduto, idProduto);

        if (produtoAtualizado) {
            const resultDados = {
                status: message.SUCCESS_UPDATED_ITEM.status,
                status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                message: message.SUCCESS_UPDATED_ITEM.message,
                produto: produtoAtualizado
            };
            return resultDados;
        }

        return message.ERROR_NOT_FOUND;
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return message.ERROR_INTERNAL_SERVER;
    }
};


const excluirProduto = async function(idProduto) {
    try {
        if (!idProduto || isNaN(idProduto)) {
            return message.ERROR_INVALID_ID
        }

        const produtoExcluido = await produtoDAO.excluirProduto(idProduto)

        if (produtoExcluido && produtoExcluido.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        if (produtoExcluido === true) {
            return message.SUCCESS_DELETED_ITEM
        }

        return message.ERROR_NOT_FOUND
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const listarProdutos = async function() {
    try {
        const produtos = await produtoDAO.listarProdutos()
        
        if (produtos && produtos.length > 0) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                produtos: produtos
            }
            return resultDados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const buscarProdutoPorId = async function(idProduto) {
    try {
        if (!idProduto || isNaN(idProduto)) {
            return message.ERROR_INVALID_ID
        }

        const produto = await produtoDAO.buscarProdutoPorId(idProduto)

        if (produto) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                produto: produto
            }
            return resultDados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    inserirProduto,
    atualizarProduto,
    excluirProduto,
    listarProdutos,
    buscarProdutoPorId
}
