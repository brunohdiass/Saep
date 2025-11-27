# Guia de Teste - PUT Produto

## Pré-requisitos

Você precisa ter:
1. **Produto criado** (com ID conhecido)
2. **Categoria existente** (ID da categoria)
3. **Fabricante existente** (ID do fabricante)

---

## 1. Buscar Produto Existente

Primeiro, obtenha o ID do produto que deseja atualizar:

```bash
curl -X GET http://localhost:8080/api/produtos/1
```

**Resposta esperada (200):**
```json
{
  "status": true,
  "status_code": 200,
  "message": "Requisição bem-sucedida",
  "produto": {
    "produto_id": 1,
    "nome": "Monitor 24 polegadas",
    "codigo": "MON-24-001",
    "descricao": "Monitor Full HD 1920x1080",
    "categoria_id": 1,
    "fabricante_id": 1,
    "categoria_nome": "Eletrônicos",
    "fabricante_nome": "Samsung"
  }
}
```

---

## 2. Atualizar Produto - Sucesso

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor 24 polegadas Full HD",
    "codigo": "MON-24-001",
    "descricao": "Monitor Full HD 1920x1080 com suporte VESA",
    "categoria_id": 1,
    "fabricante_id": 1
  }'
```

**Resposta esperada (200):**
```json
{
  "status": true,
  "status_code": 200,
  "message": "Item atualizado com sucesso",
  "produto": {
    "produto_id": 1,
    "nome": "Monitor 24 polegadas Full HD",
    "codigo": "MON-24-001",
    "descricao": "Monitor Full HD 1920x1080 com suporte VESA",
    "categoria_id": 1,
    "fabricante_id": 1,
    "categoria_nome": "Eletrônicos",
    "fabricante_nome": "Samsung"
  }
}
```

---

## 3. Testes de Validação

### 3.1 PUT sem ID na URL

```bash
curl -X PUT http://localhost:8080/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor",
    "codigo": "MON",
    "categoria_id": 1,
    "fabricante_id": 1
  }'
```

**Resposta esperada (400):**
```json
{
  "status": false,
  "status_code": 400,
  "message": "ID do produto não fornecido. Use PUT /api/produtos/{id}"
}
```

### 3.2 PUT com ID inválido

```bash
curl -X PUT http://localhost:8080/api/produtos/abc \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor",
    "codigo": "MON",
    "categoria_id": 1,
    "fabricante_id": 1
  }'
```

**Resposta esperada (400):**
```json
{
  "status": false,
  "status_code": 400,
  "message": "O ID informado não é válido ou não foi encaminhado"
}
```

### 3.3 PUT com ID que não existe

```bash
curl -X PUT http://localhost:8080/api/produtos/999 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor",
    "codigo": "MON",
    "categoria_id": 1,
    "fabricante_id": 1
  }'
```

**Resposta esperada (404):**
```json
{
  "status": false,
  "status_code": 404,
  "message": "Nenhum registro foi encontrado"
}
```

### 3.4 PUT sem Content-Type

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -d '{
    "nome": "Monitor",
    "codigo": "MON",
    "categoria_id": 1,
    "fabricante_id": 1
  }'
```

**Resposta esperada (415):**
```json
{
  "status": false,
  "status_code": 415,
  "message": "O tipo de dados enviado não foi aceito. Envie apenas JSON"
}
```

### 3.5 PUT sem campos obrigatórios

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor"
  }'
```

**Resposta esperada (400):**
```json
{
  "status": false,
  "status_code": 400,
  "message": "Existem campos obrigatórios que não foram encontrados"
}
```

**Campos obrigatórios:**
- `nome` ✅
- `codigo` ✅
- `categoria_id` ✅
- `fabricante_id` ✅

### 3.6 PUT com categoria inválida

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor",
    "codigo": "MON",
    "categoria_id": 999,
    "fabricante_id": 1
  }'
```

**Resposta esperada (500 ou erro do BD):**
```json
{
  "status": false,
  "status_code": 500,
  "message": "Erro interno no servidor de banco de dados"
}
```

### 3.7 PUT com fabricante inválido

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor",
    "codigo": "MON",
    "categoria_id": 1,
    "fabricante_id": 999
  }'
```

**Resposta esperada (500 ou erro do BD):**
```json
{
  "status": false,
  "status_code": 500,
  "message": "Erro interno no servidor de banco de dados"
}
```

---

## 4. Casos de Uso Comuns

### 4.1 Atualizar apenas o nome

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor 27 polegadas",
    "codigo": "MON-24-001",
    "categoria_id": 1,
    "fabricante_id": 1
  }'
```

### 4.2 Atualizar apenas a descrição

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor 24 polegadas Full HD",
    "codigo": "MON-24-001",
    "descricao": "Monitor Full HD com tecnologia IPS",
    "categoria_id": 1,
    "fabricante_id": 1
  }'
```

### 4.3 Atualizar categoria

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor 24 polegadas Full HD",
    "codigo": "MON-24-001",
    "descricao": "Monitor Full HD 1920x1080",
    "categoria_id": 2,
    "fabricante_id": 1
  }'
```

### 4.4 Atualizar fabricante

```bash
curl -X PUT http://localhost:8080/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Monitor 24 polegadas Full HD",
    "codigo": "MON-24-001",
    "descricao": "Monitor Full HD 1920x1080",
    "categoria_id": 1,
    "fabricante_id": 2
  }'
```

---

## 📋 Checklist de Testes

| Teste | Status | Observação |
|-------|--------|-----------|
| PUT com todos os campos | ⏳ | Deve retornar 200 |
| PUT sem ID | ⏳ | Deve retornar 400 |
| PUT com ID inválido | ⏳ | Deve retornar 400 |
| PUT com ID inexistente | ⏳ | Deve retornar 404 |
| PUT sem Content-Type | ⏳ | Deve retornar 415 |
| PUT sem campos obrigatórios | ⏳ | Deve retornar 400 |
| PUT com categoria inválida | ⏳ | Deve retornar 500 |
| PUT com fabricante inválido | ⏳ | Deve retornar 500 |
| PUT atualizar nome | ⏳ | Deve retornar 200 |
| PUT atualizar descrição | ⏳ | Deve retornar 200 |
| PUT atualizar categoria | ⏳ | Deve retornar 200 |
| PUT atualizar fabricante | ⏳ | Deve retornar 200 |

---

## ✅ Quando Tudo Funcionar

Você terá:
- ✅ Produtos atualizados com sucesso
- ✅ Validações funcionando corretamente
- ✅ Mensagens de erro apropriadas
- ✅ Dados retornados corretamente

