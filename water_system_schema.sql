-- =================================================================================
-- Banco de Dados: PostgreSQL
-- =================================================================================

-- 1. Tabela USUARIOS
-- Armazena as informações dos usuários que acessarão o sistema.
CREATE TABLE USUARIOS (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL, -- Armazenar o hash da senha
    telefone VARCHAR(20),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela PERFIS
-- Define os níveis de acesso (Ex: Administrador, Usuário Padrão).
CREATE TABLE PERFIS (
    id SERIAL PRIMARY KEY,
    nome_perfil VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Tabela USUARIO_PERFIS (Tabela de Ligação N:N)
-- Associa um usuário a um ou mais perfis de permissão.
CREATE TABLE USUARIO_PERFIS (
    usuario_id INTEGER NOT NULL,
    perfil_id INTEGER NOT NULL,
    PRIMARY KEY (usuario_id, perfil_id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id) ON DELETE CASCADE,
    FOREIGN KEY (perfil_id) REFERENCES PERFIS(id) ON DELETE CASCADE
);

-- 4. Tabela LOCAIS
-- Representa os locais onde o consumo de água é medido (ex: Casa, Escritório).
CREATE TABLE LOCAIS (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    nome_local VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    cep VARCHAR(10),
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id) ON DELETE RESTRICT
);

-- 5. Tabela MEDIDORES
-- Identifica cada hidrômetro (medidor de água) instalado em um local.
CREATE TABLE MEDIDORES (
    id SERIAL PRIMARY KEY,
    local_id INTEGER NOT NULL,
    codigo_medidor VARCHAR(50) UNIQUE NOT NULL,
    modelo VARCHAR(50),
    data_instalacao DATE,
    FOREIGN KEY (local_id) REFERENCES LOCAIS(id) ON DELETE RESTRICT
);

-- 6. Tabela LEITURAS
-- Registra cada leitura de consumo feita no medidor.
CREATE TABLE LEITURAS (
    id SERIAL PRIMARY KEY,
    medidor_id INTEGER NOT NULL,
    data_leitura TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valor_leitura NUMERIC(10, 3) NOT NULL, -- Valor absoluto (Ex: 1234.567 m³)
    foto_leitura VARCHAR(255), -- Caminho/URL da foto da leitura (opcional)
    FOREIGN KEY (medidor_id) REFERENCES MEDIDORES(id) ON DELETE CASCADE
);

-- 7. Tabela ALERTAS
-- Guarda os alertas gerados (ex: consumo elevado, suspeita de vazamento).
CREATE TABLE ALERTAS (
    id SERIAL PRIMARY KEY,
    medidor_id INTEGER NOT NULL,
    tipo_alerta VARCHAR(50) NOT NULL, -- Ex: 'CONSUMO_ALTO', 'VAZAMENTO', 'FALHA_LEITURA'
    descricao TEXT,
    data_alerta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20), -- Ex: 'PENDENTE', 'EM_ANALISE', 'RESOLVIDO'
    FOREIGN KEY (medidor_id) REFERENCES MEDIDORES(id) ON DELETE CASCADE
);


INSERT INTO PERFIS (nome_perfil) VALUES
('Administrador'),
('Usuario_Padrao'),
('Tecnico_Suporte');
