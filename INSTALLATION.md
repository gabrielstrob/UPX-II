# 🚀 Guia de Instalação e Execução - Water System

Este guia irá ajudá-lo a configurar e executar o projeto Water System completo (Backend + Frontend).

## 📋 Pré-requisitos

### Backend
- Java 17 ou superior
- Maven 3.9+
- PostgreSQL 13+

### Frontend
- Node.js 18+
- npm ou yarn

## 🗄️ 1. Configurar o Banco de Dados

### 1.1. Criar o banco de dados PostgreSQL

```sql
CREATE DATABASE water_system;
```

### 1.2. Executar os scripts SQL

No diretório `database/`, execute os seguintes arquivos na ordem:

1. `water_system_schema.sql` - Cria as tabelas
2. `water_system_example_data.sql` - (Opcional) Dados de exemplo

```powershell
# No terminal PostgreSQL ou usando psql
psql -U postgres -d water_system -f database/water_system_schema.sql
psql -U postgres -d water_system -f database/water_system_example_data.sql
```

## ⚙️ 2. Configurar o Backend

### 2.1. Configurar as credenciais do banco

Edite o arquivo `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/water_system
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

### 2.2. Compilar e executar o backend

```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

### 2.3. Testar a API

```powershell
# Verificar health da aplicação
curl http://localhost:8080/actuator/health
```

## 🎨 3. Configurar o Frontend

### 3.1. Instalar as dependências

```powershell
cd frontend
npm install
```

### 3.2. Executar o frontend em modo de desenvolvimento

```powershell
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

## 🔐 4. Primeiro Acesso

### 4.1. Criar um usuário (se não usou dados de exemplo)

Faça uma requisição POST para criar o primeiro usuário:

```powershell
curl -X POST http://localhost:8080/api/usuarios `
  -H "Content-Type: application/json" `
  -d '{
    "nome": "Administrador",
    "email": "admin@watersystem.com",
    "senha": "admin123",
    "telefone": "11999999999",
    "perfis": ["Usuario_Padrao"]
  }'
```

### 4.2. Fazer login no frontend

1. Acesse: http://localhost:3000
2. Use as credenciais criadas:
   - **Email:** admin@watersystem.com
   - **Senha:** admin123

## 📱 5. Usando a Aplicação

### 5.1. Fluxo recomendado

1. **Login** - Autentique-se no sistema
2. **Locais** - Cadastre os locais onde os medidores estão instalados
3. **Medidores** - Adicione os medidores de água em cada local
4. **Leituras** - Registre as leituras dos medidores
5. **Alertas** - Gerencie alertas de consumo e problemas
6. **Dashboard** - Visualize estatísticas e gráficos

## 🛠️ 6. Comandos Úteis

### Backend

```powershell
# Compilar sem executar testes
mvn clean install -DskipTests

# Executar apenas os testes
mvn test

# Gerar JAR para produção
mvn clean package
```

### Frontend

```powershell
# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Verificar erros de lint
npm run lint
```

## 🐛 7. Solução de Problemas

### Backend não inicia

1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no `application.properties`
3. Verifique se a porta 8080 está disponível

### Frontend não conecta na API

1. Verifique se o backend está rodando em http://localhost:8080
2. Limpe o cache do navegador
3. Verifique o console do navegador para erros

### Erro de CORS

O backend já está configurado para aceitar requisições do frontend. Se ainda tiver problemas:
1. Verifique se ambos estão rodando nas portas corretas
2. Limpe o cache e cookies do navegador

## 📊 8. Dados de Teste

Se você executou o `water_system_example_data.sql`, pode usar:

**Usuário de Teste:**
- Email: maria@example.com
- Senha: senhaSegura123

Este usuário já possui:
- 1 Local cadastrado
- 1 Medidor ativo
- Várias leituras registradas
- Alertas de exemplo

## 🚀 9. Deploy em Produção

### Backend

```powershell
# Gerar JAR
mvn clean package -DskipTests

# Executar o JAR
java -jar target/water-system-0.0.1-SNAPSHOT.jar
```

### Frontend

```powershell
# Build de produção
npm run build

# Os arquivos estarão em: frontend/dist/
# Configure um servidor web (nginx, Apache, etc.) para servir esses arquivos
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do backend: `backend/logs/`
2. Verifique o console do navegador para erros do frontend
3. Consulte a documentação da API em: `backend/API Example.md`

---

**Desenvolvido com ❤️ para gerenciamento inteligente de água**
