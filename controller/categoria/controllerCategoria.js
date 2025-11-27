const categoriaDAO = require('../../model/DAO/categoria.js')
const message = require('../../modulo/config.js')

const inserirCategoria = async function(dadosCategoria, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!dadosCategoria.nome) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const novaCategoria = await categoriaDAO.inserirCategoria(dadosCategoria)

        if (novaCategoria && !novaCategoria.erro) {
            const resultDados = {
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
                categoria: novaCategoria
            }
            return resultDados
        } else if (novaCategoria && novaCategoria.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const atualizarCategoria = async function(dadosCategoria, idCategoria, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!idCategoria || isNaN(idCategoria)) {
            return message.ERROR_INVALID_ID
        }

        if (!dadosCategoria.nome) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const categoriaAtualizada = await categoriaDAO.atualizarCategoria(idCategoria, dadosCategoria)

        if (categoriaAtualizada && !categoriaAtualizada.erro) {
            const resultDados = {
                status: message.SUCCESS_UPDATED_ITEM.status,
                status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                message: message.SUCCESS_UPDATED_ITEM.message,
                categoria: categoriaAtualizada
            }
            return resultDados
        } else if (categoriaAtualizada && categoriaAtualizada.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        return message.ERROR_NOT_FOUND
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const excluirCategoria = async function(idCategoria) {
    try {
        if (!idCategoria || isNaN(idCategoria)) {
            return message.ERROR_INVALID_ID
        }

        const categoriaExcluida = await categoriaDAO.excluirCategoria(idCategoria)

        if (categoriaExcluida && categoriaExcluida.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        if (categoriaExcluida === true) {
            return message.SUCCESS_DELETED_ITEM
        }

        return message.ERROR_NOT_FOUND
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const listarCategorias = async function() {
    try {
        const categorias = await categoriaDAO.listarCategorias()
        
        if (categorias && categorias.length > 0) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                categorias: categorias
            }
            return resultDados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const buscarCategoriaPorId = async function(idCategoria) {
    try {
        if (!idCategoria || isNaN(idCategoria)) {
            return message.ERROR_INVALID_ID
        }

        const categoria = await categoriaDAO.buscarCategoriaPorId(idCategoria)

        if (categoria) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                categoria: categoria
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
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria,
    listarCategorias,
    buscarCategoriaPorId
}
