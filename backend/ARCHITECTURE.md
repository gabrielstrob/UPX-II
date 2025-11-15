# Water System API – Guia de Arquitetura

Este documento descreve o funcionamento da API e como o código está organizado para que você possa navegar e evoluir o projeto com segurança.

## 1. Visão geral
- **Objetivo:** monitorar consumo de água por usuário, local, medidor, leituras e alertas.
- **Stack principal:** Spring Boot 3.3, Spring Web/Data JPA/Validation, PostgreSQL, Maven, Lombok.
- **Estilo arquitetural:** REST stateless em camadas (Controller → Service → Repository) com DTOs para transporte e mapeadores para conversão.

```
┌────────────┐   HTTP    ┌──────────────┐   Domínio   ┌──────────────┐   JPA   ┌──────────────┐
│   Client    │ ───────▶ │ Controller   │ ──────────▶ │ Service/Impl │ ─────▶ │ Repository   │
└────────────┘           └──────────────┘             └──────────────┘        └──────────────┘
                                                                │                         │
                                                                ▼                         ▼
                                                          DTO ↔ Mapper ↔ Entity   ↔   PostgreSQL
```

## 2. Domínio & banco de dados
O schema em `database/water_system_schema.sql` usa `BIGSERIAL/BIGINT` nos IDs para alinhar com as entidades Java (`Long`). Principais tabelas e relações:

| Tabela | Responsabilidade | Relacionamentos |
|--------|------------------|-----------------|
| `usuarios` | usuários do sistema | 1:N com `locais`; N:N com `perfis` via `usuario_perfis` |
| `perfis` | perfis como `Administrador`, `Usuario_Padrao` | N:N com `usuarios` |
| `locais` | unidades monitoradas (casa, empresa) | N:1 com `usuarios`; 1:N com `medidores` |
| `medidores` | hidrômetros instalados | N:1 com `locais`; 1:N com `leituras` e `alertas` |
| `leituras` | registros de consumo | N:1 com `medidores` |
| `alertas` | eventos como consumo alto | N:1 com `medidores` |

Scripts de seed: `database/water_system_example_data.sql`. Para subir um PostgreSQL local rapidamente use `database/docker.md` (ex.: `docker run --name upx-postgres ...`).

## 3. Organização de pacotes
```
com.upxii.watersystem
├── config            # Beans utilitários (ex.: PasswordEncoder)
├── controller        # REST controllers (Usuário, Local, Medidor, Leitura, Alerta)
├── dto               # Records de request/response + validações Bean Validation
├── entity            # Modelos JPA + relacionamentos mapeados
├── exception         # Exceptions de domínio + handler global
├── mapper            # Conversões Entity ↔ DTO
├── repository        # Interfaces Spring Data JPA
├── service           # Interfaces de casos de uso
└── service.impl      # Implementações transacionais dos serviços
```

## 4. Fluxo de requisição
1. **Controller** valida input (`@Valid`) e delega para o serviço.
2. **Service** aplica regras (ex.: verificar e-mail único, resolver perfis, vincular local ao usuário) e usa repositórios.
3. **Repository** emite consultas JPA; entidades carregam relacionamentos necessários.
4. **Mapper** converte entidades em DTOs para evitar expor modelo interno.
5. **Exception**: `BusinessException` (400) e `ResourceNotFoundException` (404) são interceptadas por `GlobalExceptionHandler`, retornando `ErrorResponse` consistente.

## 5. Endpoints principais
Todos expõem JSON em `/api/...`:
- `UsuarioController` – CRUD completo, com perfis e locais agregados em `UsuarioResponse`.
- `LocalController` – CRUD + listagem por usuário (`/api/locais/usuario/{usuarioId}`).
- `MedidorController` – CRUD + consulta por local.
- `LeituraController` – criação e listagem por medidor.
- `AlertaController` – CRUD + listagem por medidor.

### Exemplo de fluxo
```
POST /api/usuarios
└─ UsuarioServiceImpl cria usuário, codifica senha (PasswordEncoder), resolve perfis via PerfilRepository, salva e retorna DTO.
```
```
GET /api/medidores/local/{localId}
└─ MedidorServiceImpl valida existência do local e busca pela FK via MedidorRepository.
```

## 6. Camadas em detalhe
### Config
- `PasswordConfig` expõe `BCryptPasswordEncoder` usado em `UsuarioServiceImpl` para armazenar `senha_hash` compatível com a coluna `VARCHAR(255)`.

### Entidades
- Estados e relacionamentos refletem o schema: por exemplo `Usuario` tem `@ManyToMany` para `Perfil` e `@OneToMany` para `Local`.
- `@Builder` + `@Getter/@Setter` vêm do Lombok, reduzindo boilerplate.

### DTOs & Validation
- Requests (ex.: `UsuarioRequest`, `MedidorRequest`) usam anotações `@NotBlank`, `@Email`, `@Positive`, etc.
- Responses (ex.: `MedidorResponse`) aninham outros DTOs para retornar a visão consolidada.

### Services
- Interfaces em `service/` facilitam testes/mocks.
- Implementações em `service.impl` são anotadas com `@Service` + `@Transactional`.
- Responsabilidades principais: garantir integridade (e.g., evitar códigos de medidor duplicados), encapsular lógica de negócio e orquestrar mapeamentos.

### Repositórios
- São interfaces `JpaRepository`, habilitando métodos derivados (`findByEmail`, `findByUsuarioId`, etc.) sem SQL explícito.

### Exception Handling
- `GlobalExceptionHandler` centraliza respostas com timestamp e detalhes de validação (422) quando `MethodArgumentNotValidException` ocorre.

## 7. Persistência & migração
- `spring.jpa.hibernate.ddl-auto=validate` impede alterações acidentais no schema; qualquer divergência (como tipos errados) trava o boot, garantindo aderência ao SQL oficial.
- Para evoluções, ajuste o SQL em `database/` e reexecute (há comandos prontos no README e em `docker.md`). Considere adicionar Flyway/Liquibase se quiser versionamento automático.

## 8. Execução & ambiente local
1. Suba PostgreSQL (Docker recomendado).
2. Execute scripts de schema + seed.
3. Ajuste `src/main/resources/application.properties` com credenciais (por padrão `postgres/mysecretpassword`).
4. Rode a aplicação:
   ```powershell
   cd backend
   mvn spring-boot:run
   ```
5. Teste com qualquer client REST (ex.: `curl`, Postman) nos endpoints listados.

## 9. Como estender
- **Novas regras**: adicione métodos nos serviços, mantendo validações no nível de serviço e evitando lógica nos controllers.
- **Novas entidades**: crie tabela SQL + `Entity` + `Repository` + `DTOs/Mapper` + `Service/Controller` seguindo o padrão existente.
- **Autenticação real**: substitua o uso de `spring-security-crypto` por Spring Security completo quando precisar de login/autorização.
- **Observabilidade**: habilite logs estruturados ou métricas usando Actuator.

## 10. Checklist rápido
- ✅ API sobe? `mvn spring-boot:run`
- ✅ DB alinhado? `ddl-auto=validate` garante.
- ✅ Postgres via Docker? `docker run --name upx-postgres ...`
- ✅ Endpoints testados? Use tabela do README e scripts seed para dados de exemplo.

Com este panorama, fica mais fácil localizar onde implementar correções ou novas features e entender o caminho percorrido por cada requisição até o banco de dados.
