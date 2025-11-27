const fabricanteDAO = require('../../model/DAO/fabricante.js')
const message = require('../../modulo/config.js')

const inserirFabricante = async function(dadosFabricante, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!dadosFabricante.nome) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const novoFabricante = await fabricanteDAO.inserirFabricante(dadosFabricante)

        if (novoFabricante && !novoFabricante.erro) {
            const resultDados = {
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
                fabricante: novoFabricante
            }
            return resultDados
        } else if (novoFabricante && novoFabricante.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const atualizarFabricante = async function(dadosFabricante, idFabricante, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!idFabricante || isNaN(idFabricante)) {
            return message.ERROR_INVALID_ID
        }

        if (!dadosFabricante.nome) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const fabricanteAtualizado = await fabricanteDAO.atualizarFabricante(dadosFabricante, idFabricante)

        if (fabricanteAtualizado && !fabricanteAtualizado.erro) {
            const resultDados = {
                status: message.SUCCESS_UPDATED_ITEM.status,
                status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                message: message.SUCCESS_UPDATED_ITEM.message,
                fabricante: fabricanteAtualizado
            }
            return resultDados
        } else if (fabricanteAtualizado && fabricanteAtualizado.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        return message.ERROR_NOT_FOUND
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const excluirFabricante = async function(idFabricante) {
    try {
        if (!idFabricante || isNaN(idFabricante)) {
            return message.ERROR_INVALID_ID
        }

        const fabricanteExcluido = await fabricanteDAO.excluirFabricante(idFabricante)

        if (fabricanteExcluido && fabricanteExcluido.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        if (fabricanteExcluido === true) {
            return message.SUCCESS_DELETED_ITEM
        }

        return message.ERROR_NOT_FOUND
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const listarFabricantes = async function() {
    try {
        const fabricantes = await fabricanteDAO.listarFabricantes()
        
        if (fabricantes && fabricantes.length > 0) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                fabricantes: fabricantes
            }
            return resultDados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const buscarFabricantePorId = async function(idFabricante) {
    try {
        if (!idFabricante || isNaN(idFabricante)) {
            return message.ERROR_INVALID_ID
        }

        const fabricante = await fabricanteDAO.buscarFabricantePorId(idFabricante)

        if (fabricante) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                fabricante: fabricante
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
    inserirFabricante,
    atualizarFabricante,
    excluirFabricante,
    listarFabricantes,
    buscarFabricantePorId
}
