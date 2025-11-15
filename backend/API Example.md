**Requisições base**

1. **Criar usuário**
   - Método: POST  
     URL: `{{baseUrl}}/api/usuarios`
   - Body (JSON):
     ```json
     {
       "nome": "Maria Water",
       "email": "maria@example.com",
       "senha": "senhaSegura123",
       "telefone": "11988887777",
       "perfis": ["Usuario_Padrao"]
     }
     ```
   - Após enviar, copie `id` da resposta e salve na variável `usuarioId`.

2. **Criar local**
   - POST `{{baseUrl}}/api/locais`
   - Body:
     ```json
     {
       "usuarioId": {{usuarioId}},
       "nomeLocal": "Casa Principal",
       "endereco": "Rua Azul, 123",
       "cep": "01234000"
     }
     ```
   - Salve o `id` retornado em `localId`.

3. **Criar medidor**
   - POST `{{baseUrl}}/api/medidores`
   - Body:
     ```json
     {
       "localId": {{localId}},
       "codigoMedidor": "MED-001",
       "modelo": "HidroX",
       "dataInstalacao": "2024-11-01"
     }
     ```
   - Guarde o `id` em `medidorId`.

4. **Registrar leitura**
   - POST `{{baseUrl}}/api/leituras`
   - Body:
     ```json
     {
       "medidorId": {{medidorId}},
       "valorLeitura": 1234.567,
       "fotoLeitura": "https://exemplo.com/fotos/leitura1.jpg"
     }
     ```
   - Armazene o `id` caso queira deletar depois.

5. **Criar alerta**
   - POST `{{baseUrl}}/api/alertas`
   - Body:
     ```json
     {
       "medidorId": {{medidorId}},
       "tipoAlerta": "CONSUMO_ALTO",
       "descricao": "Consumo 30% acima da média",
       "status": "PENDENTE"
     }
     ```
   - Salve o `id` em `alertaId`.

**4. Consultas úteis**
- `GET {{baseUrl}}/api/usuarios`
- `GET {{baseUrl}}/api/usuarios/{{usuarioId}}`
- `GET {{baseUrl}}/api/locais/usuario/{{usuarioId}}`
- `GET {{baseUrl}}/api/medidores/local/{{localId}}`
- `GET {{baseUrl}}/api/leituras/medidor/{{medidorId}}`
- `GET {{baseUrl}}/api/alertas/medidor/{{medidorId}}`

**5. Atualizar ou remover**
- PUT/DELETE nos endpoints com `/{id}` reusam as variáveis (`{{usuarioId}}`, etc.). Para alterar status de alerta, por exemplo:
  ```json
  {
    "medidorId": {{medidorId}},
    "tipoAlerta": "CONSUMO_ALTO",
    "descricao": "Investigado e resolvido",
    "status": "RESOLVIDO"
  }
  ```