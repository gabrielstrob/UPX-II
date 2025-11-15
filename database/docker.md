# Docker - Instruções para executar o banco de dados (PostgreSQL)

Este documento descreve como executar o banco de dados Postgres usando Docker (ou Docker Compose) para importar o schema (`water_system_schema.sql`) e os dados de exemplo (`water_system_example_data.sql`) presentes na pasta `database/`.

> Estas instruções foram escritas para Windows PowerShell. Ajuste se for outro shell.

---

## Pré-requisitos
- Docker ou Docker Desktop instalado
- (Opcional) `docker-compose` instalado (hoje o Docker Desktop já inclui compose)
- Arquivos SQL em: `database/water_system_schema.sql` e `database/water_system_example_data.sql`

---

## 1) Usando Docker CLI (modo rápido)
1. Baixe e execute a imagem oficial do Postgres:
```powershell
# Inicia um container com Postgres
docker run --name upx-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres:15
```
2. Crie o banco de dados `water_system` dentro do container:
```powershell
docker exec -it upx-postgres psql -U postgres -c "CREATE DATABASE water_system;"
```
3. Copie os arquivos SQL para dentro do container (substitua caminhos se necessário):
```powershell
docker cp "C:\Users\gabri\OneDrive\Projetos\UPX-II\database\water_system_schema.sql" upx-postgres:/tmp/
docker cp "C:\Users\gabri\OneDrive\Projetos\UPX-II\database\water_system_example_data.sql" upx-postgres:/tmp/
```
4. Execute o schema e depois os dados de exemplo:
```powershell
# Importa o schema
docker exec -it upx-postgres psql -U postgres -d water_system -f /tmp/water_system_schema.sql

# Importa os dados de exemplo
# Nota: usar -v ON_ERROR_STOP=1 para parar no primeiro erro e facilitar debug
docker exec -it upx-postgres psql -U postgres -d water_system -v ON_ERROR_STOP=1 -f /tmp/water_system_example_data.sql
```
5. Verifique as tabelas:
```powershell
docker exec -it upx-postgres psql -U postgres -d water_system -c "\dt"
```

---

## 2) Usando Docker Compose (recomendado para desenvolvimento)
Crie um arquivo `docker-compose.yml` (exemplo abaixo). Depois execute `docker-compose up -d`.

Exemplo de `docker-compose.yml`:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=mysecretpassword
      - POSTGRES_USER=postgres
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d # - opcional: importará scripts na inicialização
volumes:
  db_data:
```

Com o `volume ./database:/docker-entrypoint-initdb.d` o Postgres executará scripts `.sql` localizados dentro de `./database` automaticamente na primeira inicialização do container (útil para criar o schema e também para seeds idempotentes).

Para executar:
```powershell
# Inicia os serviços em background
docker-compose up -d

# Se quiser aplicar scripts manualmente após o container rodar
docker-compose exec db psql -U postgres -c "CREATE DATABASE water_system;"
docker cp "./database/water_system_schema.sql" $(docker-compose ps -q db):/tmp/
docker-compose exec db psql -U postgres -d water_system -f /tmp/water_system_schema.sql
```

---

## 3) Comandos úteis & verificações
- Parar e remover o container:
```powershell
docker stop upx-postgres; docker rm upx-postgres
```
- Mostrar logs:
```powershell
docker logs -f upx-postgres
```
- Verificar containers:
```powershell
docker ps -a
```
- Reaplicar seed sem duplicar: use `ON CONFLICT ...` em seus INSERTs (ex.: `INSERT ... ON CONFLICT (id) DO UPDATE SET ...`).

---

## 4) Dicas de troubleshoot (PowerShell)
- Use `-v ON_ERROR_STOP=1` com `psql` para que o processo pare no primeiro erro e mostre qual instrução está falhando.
- Se aparecer `relation "perfis" does not exist`, certifique-se de que executou o schema no banco correto (`water_system`) e que o script `water_system_schema.sql` foi importado com sucesso.
- Para resetar a sequência do tipo `SERIAL` ou `IDENTITY` após inserir IDs manualmente:
```sql
SELECT setval('perfis_id_seq', (SELECT COALESCE(MAX(id), 1) FROM perfis));
```
- Erros de case-sensitivity: o Postgres converte nomes não-entre aspas para minúsculas. Se seu script usa `PERFIS` ou `USUARIOS`, prefira usar `perfis` etc. ou sempre coloque nomes entre aspas.

---

## 5) Exemplo de fluxo completo (rápido)
```powershell
# Iniciar Postgres
docker run --name upx-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
# Criar DB
docker exec -it upx-postgres psql -U postgres -c "CREATE DATABASE water_system;"
# Copiar scripts
docker cp "C:\Users\gabri\OneDrive\Projetos\UPX-II\database\water_system_schema.sql" upx-postgres:/tmp/
docker cp "C:\Users\gabri\OneDrive\Projetos\UPX-II\database\water_system_example_data.sql" upx-postgres:/tmp/
# Importar e forçar stop on error
docker exec -it upx-postgres psql -U postgres -d water_system -f /tmp/water_system_schema.sql
docker exec -it upx-postgres psql -U postgres -d water_system -v ON_ERROR_STOP=1 -f /tmp/water_system_example_data.sql
# Verificar
docker exec -it upx-postgres psql -U postgres -d water_system -c "\dt"
```

---

## 6) Próximos passos
- Se quiser, posso criar um `docker-compose.yml` no repositório e um pequeno `README.md` (em PT-BR) com comandos para ligar o ambiente e importar os dados automaticamente.
- Também posso ajustar os scripts para garantir idempotência completa (rolar back on error, usar `CREATE EXTENSION IF NOT EXISTS pgcrypto`, etc.).

---

Se quiser que eu crie o `docker-compose.yml` e/ou o `README.md` com instruções em PT-BR, diga que eu gero agora mesmo.