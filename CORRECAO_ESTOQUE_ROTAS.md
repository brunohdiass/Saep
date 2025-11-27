# Correção: Rotas de Estoque (Entrada/Saída)

## Problemas Encontrados

### 1. Variável Incorreta na Rota de Entrada
**Linha 265:**
```javascript
// ERRADO
quantidade: parseInt(quantity),  // quantity não existe!
```

**Correto:**
```javascript
// CORRETO
quantidade: parseInt(quantidade),
```

### 2. Content-Type Não Era Passado para Controller
**Antes:**
```javascript
const result = await estoqueController.registrarMovimentacao(movimentacao);

res.status(201).json({
    status: 'success',
    status_code: 201,
    message: 'Entrada de estoque registrada com sucesso',
    data: result  // Retornava erro de content-type aqui!
});
```

**Depois:**
```javascript
const result = await estoqueController.registrarMovimentacao(movimentacao, req.headers['content-type']);

res.status(result.status_code).json(result);  // Retorna resposta correta da controller
```

## Por Que Isso Causava o Erro

1. O `content-type` não era passado para a controller
2. A controller validava o `content-type` e retornava erro 415
3. A rota retornava esse erro dentro de `data`
4. Resultado: resposta com status 201 mas com erro 415 dentro

## Solução Aplicada

### Rota de Entrada (`/entrada`)
- ✅ Corrigido `parseInt(quantity)` → `parseInt(quantidade)`
- ✅ Passando `req.headers['content-type']` para controller
- ✅ Retornando `result.status_code` e `result` diretamente

### Rota de Saída (`/saida`)
- ✅ Passando `req.headers['content-type']` para controller
- ✅ Retornando `result.status_code` e `result` diretamente

## Resposta Agora Correta

**Antes (ERRADO):**
```json
{
    "status": "success",
    "status_code": 201,
    "message": "Saída de estoque registrada com sucesso",
    "data": {
        "status": false,
        "status_code": 415,
        "message": "O tipo de dados enviado não foi aceito. Envie apenas JSON"
    }
}
```

**Depois (CORRETO):**
```json
{
    "status": true,
    "status_code": 201,
    "message": "Saída de estoque registrada com sucesso",
    "movimentacao": {
        "movimentacao_id": 1,
        "produto_id": 1,
        "usuario_id": 1,
        "tipo": "saida",
        "quantidade": 10,
        "motivo": "Venda para cliente",
        "data_movimentacao": "2025-11-27T18:54:00.000Z"
    }
}
```

## Status

✅ **ROTAS DE ESTOQUE CORRIGIDAS!**

Agora as rotas de entrada e saída funcionam corretamente.

