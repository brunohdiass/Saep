# Correção: DAO de Estoque

## Problemas Encontrados

### 1. Uso de `database.query()` em vez de `database.execute()`
**Problema:**
- O DAO usava `database.query()` e `database.getConnection()`
- Mas `database.js` só exporta um pool de conexão (não tem esses métodos)
- Isso causava erro 500

**Solução:**
- Mudado para `database.execute()` (que é o método correto do pool)
- Removido `getConnection()` e transações (não necessárias para este caso)

### 2. Lançamento de Exceções em vez de Retornar Objetos de Erro
**Problema:**
```javascript
// ERRADO
if (quantidadeAtual < movimentacao.quantidade) {
    throw new Error('Quantidade em estoque insuficiente');
}
```

**Solução:**
```javascript
// CORRETO
if (quantidadeAtual < movimentacao.quantidade) {
    return {
        erro: true,
        mensagem: 'Quantidade em estoque insuficiente'
    };
}
```

### 3. Falta de Tratamento de Erros na Controller
**Problema:**
- A controller não diferenciava entre tipos de erro
- Retornava sempre `ERROR_INTERNAL_SERVER_DB`

**Solução:**
- Adicionada verificação específica para "Quantidade em estoque insuficiente"
- Retorna status 400 com mensagem apropriada

## Mudanças Realizadas

### DAO (`estoque.js`)

#### `consultarEstoque()`
```javascript
// Antes
const [estoque] = await database.query(...);
throw error;

// Depois
const [estoque] = await database.execute(...);
return null;
```

#### `registrarMovimentacao()`
```javascript
// Antes
const connection = await database.getConnection();
await connection.beginTransaction();
throw new Error('...');

// Depois
await database.execute(...);
return { erro: true, mensagem: '...' };
```

#### `listarHistoricoMovimentacoes()`
```javascript
// Antes
const [movimentacoes] = await database.query(...);
throw error;

// Depois
const [movimentacoes] = await database.execute(...);
return [];
```

#### `listarProdutosComEstoque()`
```javascript
// Antes
const [produtos] = await database.query(...);
throw error;

// Depois
const [produtos] = await database.execute(...);
return [];
```

### Controller (`controllerEstoque.js`)

```javascript
// Tratamento específico para quantidade insuficiente
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
```

## Respostas Agora Corretas

### Sucesso (201)
```json
{
  "status": true,
  "status_code": 201,
  "message": "Item criado com sucesso",
  "movimentacao": {
    "movimentacao_id": 1,
    "produto_id": 1,
    "usuario_id": 11,
    "tipo": "saida",
    "quantidade": 10,
    "motivo": "Venda para cliente",
    "data_movimentacao": "2025-11-27T18:54:00.000Z"
  }
}
```

### Quantidade Insuficiente (400)
```json
{
  "status": false,
  "status_code": 400,
  "message": "Quantidade em estoque insuficiente para esta operação"
}
```

### Erro Interno (500)
```json
{
  "status": false,
  "status_code": 500,
  "message": "Erro interno no servidor de banco de dados"
}
```

## Status

✅ **DAO DE ESTOQUE CORRIGIDO!**

Agora as operações de entrada e saída de estoque funcionam corretamente.

