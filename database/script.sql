
CREATE DATABASE IF NOT EXISTS SAEB
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

USE SAEB;-- ===============================
--  TABELA USUARIO
-- ===============================
CREATE TABLE Usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
--  TABELA CATEGORIA
-- ===============================
CREATE TABLE Categoria (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE
);

-- ===============================
--  TABELA FABRICANTE
-- ===============================
CREATE TABLE Fabricante (
    fabricante_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE
);

-- ===============================
--  TABELA PRODUTO
-- ===============================
CREATE TABLE Produto (
    produto_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

    categoria_id INT NOT NULL,
    fabricante_id INT NOT NULL,

    FOREIGN KEY (categoria_id) REFERENCES Categoria(categoria_id),
    FOREIGN KEY (fabricante_id) REFERENCES Fabricante(fabricante_id)
);

-- ===============================
--  TABELA ESPECIFICACAO (1:1)
-- ===============================
CREATE TABLE Especificacao (
    especificacao_id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL UNIQUE,

    processador VARCHAR(150),
    memoria_ram VARCHAR(50),
    armazenamento_interno VARCHAR(50),
    tela_tamanho VARCHAR(50),
    tela_resolucao VARCHAR(50),
    camera_frontal VARCHAR(50),
    camera_traseira VARCHAR(50),
    conectividade VARCHAR(150),
    sistema_operacional VARCHAR(100),
    portas VARCHAR(150),

    FOREIGN KEY (produto_id) REFERENCES Produto(produto_id) ON DELETE CASCADE
);

-- ===============================
--  TABELA VARIACAO (1:N)
-- ===============================
CREATE TABLE Variacao (
    variacao_id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,

    cor VARCHAR(50),
    armazenamento VARCHAR(50),
    modelo VARCHAR(100),
    voltagem VARCHAR(50),
    peso VARCHAR(50),

    FOREIGN KEY (produto_id) REFERENCES Produto(produto_id) ON DELETE CASCADE
);

-- ===============================
--  TABELA ESTOQUE_ATUAL (OBRIGATÓRIA)
-- ===============================
CREATE TABLE Estoque_Atual (
    produto_id INT PRIMARY KEY,
    quantidade INT NOT NULL DEFAULT 0,

    FOREIGN KEY (produto_id) REFERENCES Produto(produto_id) ON DELETE CASCADE
);

-- ===============================
--  TABELA ESTOQUE MOVIMENTACAO
-- ===============================
CREATE TABLE Estoque_Movimentacao (
    movimentacao_id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,

    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    motivo VARCHAR(255),
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    estoque_antes INT NOT NULL,
    estoque_depois INT NOT NULL,

    FOREIGN KEY (produto_id) REFERENCES Produto(produto_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
);
show tables;