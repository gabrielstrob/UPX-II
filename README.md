# Water System - Sistema de Gerenciamento de Água

Sistema completo para monitoramento e gerenciamento de consumo de água através de medidores conectados.

## 🏗️ Arquitetura do Projeto

```
UPX-II/
├── backend/               # API REST em Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/     # Código-fonte Java
│   │       └── resources/ # Configurações
│   └── pom.xml           # Dependências Maven
│
├── frontend/             # Interface Web em React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── contexts/    # Contextos React (Auth)
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── services/    # Serviços de API
│   │   ├── styles/      # Estilos CSS
│   │   └── types/       # Tipos TypeScript
│   └── package.json     # Dependências npm
│
├── database/            # Scripts SQL
│   ├── water_system_schema.sql
│   └── water_system_example_data.sql
│
└── INSTALLATION.md      # Guia de instalação
```

## 🚀 Tecnologias

### Backend
- **Java 17** - Linguagem de programação
- **Spring Boot 3.2** - Framework backend
- **Spring Security** - Autenticação HTTP Basic
- **PostgreSQL** - Banco de dados
- **Maven** - Gerenciador de dependências
- **JPA/Hibernate** - ORM

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Superset do JavaScript
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos
- **Lucide React** - Ícones

## ✨ Funcionalidades

### 👤 Gerenciamento de Usuários
- Cadastro e autenticação de usuários
- Perfis de usuário
- Controle de acesso

### 📍 Gerenciamento de Locais
- Cadastro de locais (residências, empresas, etc.)
- Endereços e CEPs
- Vinculação com usuários

### 📊 Gerenciamento de Medidores
- Cadastro de medidores de água
- Status (Ativo, Inativo, Manutenção)
- Modelos e códigos
- Vinculação com locais

### 📈 Leituras
- Registro de leituras de consumo
- Histórico completo
- Suporte a fotos das leituras
- Filtros por medidor
- Visualização em tabela

### 🔔 Alertas
- Alertas de consumo alto
- Detecção de vazamentos
- Medidores inativos
- Status de resolução
- Filtros por status

### 📱 Dashboard
- Visão geral do sistema
- Estatísticas de consumo
- Gráficos de histórico
- Alertas pendentes
- Cards informativos

## 🔐 Segurança

- **Autenticação:** HTTP Basic Authentication
- **Criptografia:** Senhas com BCrypt
- **Autorização:** Controle de acesso baseado em perfis
- **CORS:** Configurado para desenvolvimento local

## 🎨 Interface

A interface foi desenvolvida com foco em:
- **Usabilidade:** Interface intuitiva e responsiva
- **Design Moderno:** Cards, modais e componentes elegantes
- **Acessibilidade:** Cores e contrastes adequados
- **Responsividade:** Funciona em desktop, tablet e mobile

## 📦 Instalação Rápida

### 1. Clonar o repositório
```powershell
git clone <repository-url>
cd UPX-II
```

### 2. Configurar banco de dados
```powershell
# Criar banco e executar scripts em database/
```

### 3. Iniciar backend
```powershell
cd backend
mvn spring-boot:run
```

### 4. Iniciar frontend
```powershell
cd frontend
npm install
npm run dev
```

### 5. Acessar aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 📚 Documentação

- **[INSTALLATION.md](INSTALLATION.md)** - Guia completo de instalação
- **[backend/API Example.md](backend/API%20Example.md)** - Exemplos de uso da API
- **[backend/README.md](backend/README.md)** - Documentação do backend
- **[frontend/README.md](frontend/README.md)** - Documentação do frontend

## 🔄 Fluxo de Dados

1. **Usuário** se autentica no sistema
2. **Locais** são cadastrados pelo usuário
3. **Medidores** são vinculados aos locais
4. **Leituras** são registradas pelos medidores
5. **Alertas** são gerados automaticamente ou manualmente
6. **Dashboard** exibe todas as informações consolidadas

## 🌐 Endpoints da API

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/{id}` - Atualizar usuário
- `DELETE /api/usuarios/{id}` - Excluir usuário

### Locais
- `GET /api/locais` - Listar locais
- `GET /api/locais/usuario/{usuarioId}` - Locais por usuário
- `POST /api/locais` - Criar local
- `PUT /api/locais/{id}` - Atualizar local
- `DELETE /api/locais/{id}` - Excluir local

### Medidores
- `GET /api/medidores` - Listar medidores
- `GET /api/medidores/local/{localId}` - Medidores por local
- `POST /api/medidores` - Criar medidor
- `PUT /api/medidores/{id}` - Atualizar medidor
- `DELETE /api/medidores/{id}` - Excluir medidor

### Leituras
- `GET /api/leituras/medidor/{medidorId}` - Leituras por medidor
- `POST /api/leituras` - Registrar leitura
- `DELETE /api/leituras/{id}` - Excluir leitura

### Alertas
- `GET /api/alertas/medidor/{medidorId}` - Alertas por medidor
- `POST /api/alertas` - Criar alerta
- `PUT /api/alertas/{id}` - Atualizar alerta
- `DELETE /api/alertas/{id}` - Excluir alerta

## 🧪 Testes

### Backend
```powershell
cd backend
mvn test
```

### Frontend
```powershell
cd frontend
npm run lint
```

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

## 👥 Equipe

Projeto desenvolvido como parte do UPX-II.

---

**💧 Water System - Gerenciamento Inteligente de Água**
