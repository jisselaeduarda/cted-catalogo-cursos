# Memória da Refatoração — CTED Catálogo de Cursos

Este arquivo registra o diagnóstico, as decisões, as validações e as pendências da refatoração solicitada para a branch `refactor/arquitetura-clean-code`.

## Fase 0 — Diagnóstico

### Objetivo
Entender o estado real da aplicação antes de modificar estrutura ou comportamento.

### Problemas encontrados
- frontend e backend misturados na raiz e em `wwwroot`;
- `app.js` e `curso.js` concentram responsabilidades demais;
- fluxo de detalhe duplicado entre modal e página dedicada;
- página de detalhe busca todos os cursos em vez de usar `GET /api/cursos/{id}`;
- contrato do frontend aceita muitos aliases de propriedades;
- existe JavaScript após `</html>`;
- há duplicação entre `wwwroot/assets/images` e `wwwroot/images`;
- há `wwwroot/style.css` e `wwwroot/css/styles.css`;
- filtros obrigatórios existem na API, mas não estão expostos na interface atual;
- a listagem do backend carrega módulos e aulas desnecessariamente;
- seed dividido em dois arquivos e com estrutura posicional para módulos/aulas;
- `Models/Cursos.cs` usa nome de arquivo no plural para classe singular;
- projeto de testes existe, mas o teste inicial ainda não valida comportamento real;
- README e `USO_DE_IA.md` contêm pontos que precisam ser sincronizados com o código real.

### Decisão
Preservar ASP.NET Core Minimal API + Service + EF Core + SQLite e refatorar sem introduzir arquitetura enterprise.

### Motivo
O escopo é de um case júnior e deve permanecer fácil de entender, manter e explicar.

### Validações
- inventário da branch realizado;
- endpoints, service, modelos, seed, frontend, README, IA, Docker e estrutura de testes revisados.

### Resultado
Baseline registrado antes da reorganização.

### Pendências
Executar a separação física e validar build/deploy.

---

## Fase 1 — Reorganização física

### Objetivo
Separar claramente frontend e backend sem criar dois deploys.

### Decisão
Criar `frontend/` e `backend/`, mantendo o ASP.NET Core como host final da aplicação.

### Motivo
Melhora a leitura do repositório e a separação de responsabilidades sem introduzir CORS, duas hospedagens ou duas pipelines.

### Arquivos alterados
- projeto .NET movido para `backend/`;
- frontend movido para `frontend/`;
- `Dockerfile` ajustado;
- projeto de testes ajustado para o novo caminho do backend;
- workflow `.github/workflows/ci.yml` criado;
- `backend/wwwroot/.gitkeep` criado apenas para manter um web root físico válido durante o desenvolvimento.

### Validações
A CI desta fase deverá executar:
- `dotnet restore`;
- `dotnet build`;
- `dotnet test`;
- `dotnet publish`;
- `node --check` no JavaScript atual;
- inicialização real da aplicação;
- smoke test da API;
- `docker build`.

### Resultado
Aguardar CI antes de considerar esta fase concluída.

### Pendências
- refatoração interna do backend;
- consolidação de seed;
- limpeza de assets/CSS;
- modularização do frontend;
- pesquisa/filtros obrigatórios;
- documentação final;
- comparação visual com Figma;
- publicação pública.
