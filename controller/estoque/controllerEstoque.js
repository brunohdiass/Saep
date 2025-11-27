const estoqueDAO = require('../../model/DAO/estoque.js')
const message = require('../../modulo/config.js')

const registrarMovimentacao = async function(dadosMovimentacao, contentType) {
    try {
        const normalizedContentType = String(contentType || '').toLowerCase()

        if (!normalizedContentType.startsWith('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        if (!dadosMovimentacao.produto_id || !dadosMovimentacao.usuario_id || 
            !dadosMovimentacao.tipo || !dadosMovimentacao.quantidade) {
            return message.ERROR_REQUIRED_FIELDS
        }

        const movimentacaoRegistrada = await estoqueDAO.registrarMovimentacao(dadosMovimentacao)

        if (movimentacaoRegistrada && movimentacaoRegistrada.erro) {
            if (movimentacaoRegistrada.mensagem === 'Quantidade em estoque insuficiente') {
                return {
                    status: false,
                    status_code: 400,
                    message: 'Quantidade em estoque insuficiente para esta operação'
                }
            }
            return message.ERROR_INTERNAL_SERVER_DB
        }

        if (movimentacaoRegistrada && typeof movimentacaoRegistrada === 'number') {
            const resultDados = {
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
                movimentacao: {
                    movimentacao_id: movimentacaoRegistrada,
                    produto_id: dadosMovimentacao.produto_id,
                    usuario_id: dadosMovimentacao.usuario_id,
                    tipo: dadosMovimentacao.tipo,
                    quantidade: dadosMovimentacao.quantidade,
                    motivo: dadosMovimentacao.motivo || null,
                    data_movimentacao: new Date()
                }
            }
            return resultDados
        }

        return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const consultarEstoque = async function(produtoId) {
    try {
        if (!produtoId || isNaN(produtoId)) {
            return message.ERROR_INVALID_ID
        }

        const estoque = await estoqueDAO.consultarEstoque(produtoId)

        if (estoque) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                estoque: estoque
            }
            return resultDados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const listarHistoricoMovimentacoes = async function(filtro) {
    try {
        const movimentacoes = await estoqueDAO.listarHistoricoMovimentacoes(filtro)
        
        if (movimentacoes && movimentacoes.length > 0) {
            const resultDados = {
                status: message.SUCCESS_REQUEST.status,
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                movimentacoes: movimentacoes
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
    registrarMovimentacao,
    consultarEstoque,
    listarHistoricoMovimentacoes
}
