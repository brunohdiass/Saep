const usuarioDAO = require('../../model/DAO/usuario.js')
const message = require('../../modulo/config.js')

const listarUsuarios = async function() {
    try {
        const usuarios = await usuarioDAO.listarUsuarios()

        if (usuarios && usuarios.length > 0) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                usuarios: usuarios
            }
            return resultDados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const buscarUsuarioPorId = async function(idUsuario) {
    try {
        if (!idUsuario || isNaN(idUsuario)) {
            return message.ERROR_INVALID_ID
        }

        const usuario = await usuarioDAO.buscarUsuarioPorId(idUsuario)

        if (usuario) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                usuario: usuario
            }
            return resultDados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const inserirUsuario = async function(dadosUsuario, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!dadosUsuario.nome || !dadosUsuario.email || !dadosUsuario.senha) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const resultadoDAO = await usuarioDAO.inserirUsuario(dadosUsuario)

        if (resultadoDAO && resultadoDAO.erro) {
            if (resultadoDAO.tipo === 'email_duplicado') {
                return message.ERROR_DUPLICATE_EMAIL
            }

            return message.ERROR_INTERNAL_SERVER_DB
        }

        if (resultadoDAO) {
            const resultDados = {
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
                usuario: resultadoDAO
            }
            return resultDados
        }

        return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const atualizarUsuario = async function(dadosUsuario, idUsuario, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!idUsuario || isNaN(idUsuario)) {
            return message.ERROR_INVALID_ID
        }

        if (!dadosUsuario.nome || !dadosUsuario.email) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const resultadoDAO = await usuarioDAO.atualizarUsuario(dadosUsuario, idUsuario)

        if (resultadoDAO && resultadoDAO.erro) {
            if (resultadoDAO.tipo === 'email_duplicado') {
                return message.ERROR_DUPLICATE_EMAIL
            }

            return message.ERROR_INTERNAL_SERVER_DB
        }

        if (resultadoDAO) {
            const resultDados = {
                status: message.SUCCESS_UPDATED_ITEM.status,
                status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                message: message.SUCCESS_UPDATED_ITEM.message,
                usuario: resultadoDAO
            }
            return resultDados
        }

        return message.ERROR_NOT_FOUND
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const excluirUsuario = async function(idUsuario) {
    try {
        if (!idUsuario || isNaN(idUsuario)) {
            return message.ERROR_INVALID_ID
        }

        const resultadoDAO = await usuarioDAO.excluirUsuario(idUsuario)

        if (resultadoDAO && resultadoDAO.erro) {
            return message.ERROR_INTERNAL_SERVER_DB
        }

        if (resultadoDAO === true) {
            return message.SUCCESS_DELETED_ITEM
        }

        return message.ERROR_NOT_FOUND
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const autenticarUsuario = async function(email, senha) {
    try {
        if (!email || !senha) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const usuario = await usuarioDAO.buscarUsuarioPorEmail(email)

        if (!usuario || usuario.senha !== senha) {
            return message.ERROR_INVALID_LOGIN
        }

        const usuarioRetorno = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }

        const resultDados = {
            status: message.SUCCESS_REQUEST.status,
            status_code: message.SUCCESS_REQUEST.status_code,
            message: 'Login realizado com sucesso',
            usuario: usuarioRetorno
        }

        return resultDados
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    autenticarUsuario
}
