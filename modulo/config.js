/******************************************************************************
 * Objetivo: Arquivo de configuração de projeto, onde teremos mensagens padronizadas
 *      variáveis e constantes para o projeto
 * Data: 13/02/2025
 * Autor: Joao Pedro
 * versão: 1.0
 */
/************************* MENSAGENS DE STATUS DA API **************************/

/************************* MENSAGENS DE ERRO ****************************/
const ERROR_REQUIRED_FIELDS =            { status: false, status_code: 400, message: 'Existem campos obrigatórios que não foram encontrados' }
const ERROR_INTERNAL_SERVER_MODEL =      { status: false, status_code: 500, message: 'Erro interno no servidor de modelagem de dados' }
const ERROR_INTERNAL_SERVER_CONTROLLER = { status: false, status_code: 500, message: 'Erro interno no servidor de controle de dados' }
const ERROR_CONTENT_TYPE =               { status: false, status_code: 415, message: 'O tipo de dados enviado não foi aceito. Envie apenas JSON' }
const ERROR_INTERNAL_SERVER_DB =         { status: false, status_code: 500, message: 'Erro interno no servidor de banco de dados' }
const ERROR_INTERNAL_SERVER =            { status: false, status_code: 500, message: 'Erro interno no servidor' }
const ERROR_INVALID_ID =                 { status: false, status_code: 400, message: 'O ID informado não é válido ou não foi encaminhado' }
const ERROR_NOT_FOUND =                  { status: false, status_code: 404, message: 'Nenhum registro foi encontrado' }
const ERROR_INVALID_LOGIN =              { status: false, status_code: 401, message: 'Usuário ou senha inválidos' }
const ERROR_DUPLICATE_EMAIL =            { status: false, status_code: 409, message: 'E-mail já cadastrado' }

/************************* MENSAGENS DE SUCESSO **************************/

const SUCCESS_CREATED_ITEM = { status: true, status_code: 201, message: 'Item criado com sucesso' }
const SUCCESS_DELETED_ITEM = { status: true, status_code: 200, message: 'Item excluído com sucesso' }
const SUCCESS_UPDATED_ITEM = { status: true, status_code: 200, message: 'Item atualizado com sucesso' }
const SUCCESS_REQUEST =      { status: true, status_code: 200, message: 'Requisição bem-sucedida' }

module.exports = {
    ERROR_REQUIRED_FIELDS,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_CONTENT_TYPE,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_DB,
    ERROR_INTERNAL_SERVER,
    ERROR_INVALID_ID,
    ERROR_INVALID_LOGIN,
    ERROR_DUPLICATE_EMAIL,
    SUCCESS_CREATED_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_REQUEST
}