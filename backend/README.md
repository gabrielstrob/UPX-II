# Water System API

Backend em Spring Boot para gerenciamento de usuários, locais, medidores, leituras e alertas baseado no schema `database/water_system_schema.sql`.

## Pré-requisitos

- Java 17+
- Maven 3.9+
- PostgreSQL 13+

## Configuração rápida

1. Crie o banco de dados e execute os scripts em `../database/water_system_schema.sql` e, opcionalmente, `../database/water_system_example_data.sql`.
2. Ajuste `src/main/resources/application.properties` com as credenciais do seu ambiente.

## Executando

```powershell
cd backend
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

## Principais endpoints

| Recurso | Métodos | Caminhos principais |
|---------|---------|---------------------|
| Usuários | GET, POST, PUT, DELETE | `/api/usuarios`, `/api/usuarios/{id}` |
| Locais | GET, POST, PUT, DELETE | `/api/locais`, `/api/locais/{id}`, `/api/locais/usuario/{usuarioId}` |
| Medidores | GET, POST, PUT, DELETE | `/api/medidores`, `/api/medidores/{id}`, `/api/medidores/local/{localId}` |
| Leituras | GET, POST, DELETE | `/api/leituras/medidor/{medidorId}`, `/api/leituras` |
| Alertas | GET, POST, PUT, DELETE | `/api/alertas/medidor/{medidorId}`, `/api/alertas/{id}` |

Todos os endpoints aceitam e retornam DTOs declarados no pacote `com.upxii.watersystem.dto` e possuem validação via Bean Validation.

## Autenticação

- A API agora utiliza **HTTP Basic** através do Spring Security. Todas as rotas exigem autenticação, exceto `POST /api/usuarios` (para registrar o primeiro usuário) e `GET /actuator/health`/`/actuator/info`.
- Cadastre pelo menos um usuário (via endpoint ou direto no banco) com senha em texto plano; ela será salva como hash BCrypt automaticamente.
- Para acessar demais rotas, informe `email` e `senha` do usuário:

```powershell
curl -u usuario@example.com:MinhaSenhaSegura http://localhost:8080/api/usuarios
```

Em ferramentas como Postman, selecione "Authorization > Basic Auth" e preencha os mesmos valores. Remova a permissão pública de `POST /api/usuarios` assim que terminar o processo de onboarding inicial, se desejar.
