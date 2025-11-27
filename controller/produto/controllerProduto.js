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

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE;
        }

        if (!idProduto || isNaN(idProduto)) {
            return message.ERROR_INVALID_ID;
        }

        if (!dadosProduto.nome || !dadosProduto.codigo || !dadosProduto.categoria_id || !dadosProduto.fabricante_id) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        const produtoAtualizado = await produtoDAO.atualizarProduto(idProduto, dadosProduto);

        if (produtoAtualizado) {
            return {
                status: message.SUCCESS_REQUEST.status,
                status_code: 200,
                message: 'Produto atualizado com sucesso',
                produto: produtoAtualizado
            };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(`Erro ao atualizar produto:`, error);
        return {
            status: false,
            status_code: 500,
            message: error.message || 'Erro ao atualizar produto'
        };
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
