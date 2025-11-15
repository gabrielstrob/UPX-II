-- =================================================================================
-- Script de Inserção de Dados de Exemplo (Seed Data)
-- Banco de Dados: PostgreSQL
-- Pressupõe que o script 'water_system_schema.sql' já foi executado.
-- =================================================================================

-- 1. Inserção de Dados na Tabela PERFIS
-- (Assumindo que estes já foram inseridos no script de schema, mas repetindo por segurança)
INSERT INTO PERFIS (id, nome_perfil) VALUES
(1, 'Administrador'),
(2, 'Usuario_Padrao'),
(3, 'Tecnico_Suporte')
ON CONFLICT (id) DO UPDATE SET nome_perfil = EXCLUDED.nome_perfil;

-- Resetar a sequência do SERIAL para PERFIS
SELECT setval('perfis_id_seq', (SELECT MAX(id) FROM PERFIS));

-- 2. Inserção de Dados na Tabela USUARIOS
INSERT INTO USUARIOS (nome, email, senha_hash, telefone) VALUES
('Alice Silva', 'alice.silva@exemplo.com', 'hash_alice_123', '11987654321'), -- ID 1
('Bruno Costa', 'bruno.costa@exemplo.com', 'hash_bruno_456', '21998765432'); -- ID 2

-- 3. Inserção de Dados na Tabela USUARIO_PERFIS
-- Alice (ID 1) é Administrador (ID 1) e Usuário Padrão (ID 2)
INSERT INTO USUARIO_PERFIS (usuario_id, perfil_id) VALUES
(1, 1),
(1, 2);
-- Bruno (ID 2) é Usuário Padrão (ID 2)
INSERT INTO USUARIO_PERFIS (usuario_id, perfil_id) VALUES
(2, 2);

-- 4. Inserção de Dados na Tabela LOCAIS
INSERT INTO LOCAIS (usuario_id, nome_local, endereco, cep) VALUES
(1, 'Casa Principal', 'Rua das Flores, 100, Centro', '01000-000'), -- ID 1 (Propriedade de Alice)
(1, 'Apartamento Praia', 'Av. Atlântica, 500, Bloco B', '22000-000'), -- ID 2 (Propriedade de Alice)
(2, 'Escritório', 'Rua da Programação, 404, Sala 10', '30000-000'); -- ID 3 (Propriedade de Bruno)

-- 5. Inserção de Dados na Tabela MEDIDORES
INSERT INTO MEDIDORES (local_id, codigo_medidor, modelo, data_instalacao) VALUES
(1, 'MDR-K1001', 'K-100', '2022-01-15'), -- ID 1 (Casa Principal)
(2, 'MDR-L2002', 'L-200', '2023-05-20'), -- ID 2 (Apartamento Praia)
(3, 'MDR-K1003', 'K-100', '2021-11-01'); -- ID 3 (Escritório)

-- 6. Inserção de Dados na Tabela LEITURAS
-- Leituras para Medidor 1 (Casa Principal - Consumo Normal)
INSERT INTO LEITURAS (medidor_id, data_leitura, valor_leitura) VALUES
(1, NOW() - INTERVAL '30 days', 500.000),
(1, NOW() - INTERVAL '15 days', 550.500),
(1, NOW(), 600.900); -- Consumo de 50.400 m³ no último mês

-- Leituras para Medidor 2 (Apartamento Praia - Consumo Baixo)
INSERT INTO LEITURAS (medidor_id, data_leitura, valor_leitura) VALUES
(2, NOW() - INTERVAL '60 days', 100.000),
(2, NOW() - INTERVAL '30 days', 105.000),
(2, NOW(), 110.000);

-- Leituras para Medidor 3 (Escritório - Consumo com Pico, para gerar Alerta)
INSERT INTO LEITURAS (medidor_id, data_leitura, valor_leitura) VALUES
(3, NOW() - INTERVAL '30 days', 200.000),
(3, NOW(), 350.000); -- Grande salto de 150 m³ em um mês

-- 7. Inserção de Dados na Tabela ALERTAS
-- Alerta gerado pelo Medidor 3 (Consumo Alto)
INSERT INTO ALERTAS (medidor_id, tipo_alerta, descricao, data_alerta, status) VALUES
(3, 'CONSUMO_ALTO', 'Consumo de 150 m³ no último período, 3x acima da média histórica.', NOW(), 'PENDENTE');

-- Alerta gerado pelo Medidor 1 (Leitura Atrasada - Exemplo)
INSERT INTO ALERTAS (medidor_id, tipo_alerta, descricao, data_alerta, status) VALUES
(1, 'LEITURA_ATRASADA', 'Nenhuma leitura registrada nos últimos 35 dias.', NOW() - INTERVAL '5 days', 'RESOLVIDO');
