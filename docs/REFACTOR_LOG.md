# Memória da Refatoração — CTED Catálogo de Cursos

Este arquivo registra o diagnóstico, as decisões, as validações e as pendências da refatoração da branch `refactor/arquitetura-clean-code`.

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
- projeto de testes existe, mas o teste inicial não valida comportamento real;
- README e `USO_DE_IA.md` precisam ser sincronizados com o código real.

### Decisão
Preservar ASP.NET Core Minimal API + Service + EF Core + SQLite e refatorar sem arquitetura enterprise.

### Motivo
O escopo é de um case júnior e deve permanecer fácil de entender, manter e explicar.

### Validações
- inventário da branch realizado;
- endpoints, service, modelos, seed, frontend, README, IA, Docker e testes revisados.

### Resultado
Baseline registrado.

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
- `.github/workflows/ci.yml` criado;
- `backend/wwwroot/.gitkeep` criado para manter um web root físico válido durante o desenvolvimento.

### Validações
Workflow CI #1 executado com sucesso:
- `dotnet restore`;
- `dotnet build`;
- `dotnet test`;
- `dotnet publish`;
- `node --check` nos scripts existentes;
- aplicação iniciada de verdade;
- smoke test `GET /api/cursos`;
- smoke test `GET /api/cursos/1`;
- `docker build .`.

### Resultado
Fase 1 concluída sem regressão detectada pela CI.

---

## Fases 2 a 5 — Backend, consultas, modelos e seed

### Objetivo
Deixar o backend simples, previsível e proporcional ao case.

### Problemas encontrados
- listagem carregava módulos e aulas de todos os cursos;
- entidades eram retornadas diretamente como contrato da API;
- `Models/Cursos.cs` tinha nome de arquivo no plural;
- seed estava dividido entre cursos e conteúdo;
- módulos/aulas eram representados no seed por arrays posicionais;
- `DataDisponibilidade` não era preenchida;
- imagens do seed usavam um caminho diferente dos assets que serão consolidados;
- teste existente não validava comportamento.

### Decisão
Manter a arquitetura:

```text
Endpoint → Service → DbContext → SQLite
```

Foram adicionados DTOs simples apenas para separar o payload de listagem do payload de detalhes.

### Motivo
A listagem precisa apenas dos dados dos cards. Módulos e aulas são carregados somente ao consultar um curso específico. Os DTOs evitam acoplamento direto entre persistência e contrato HTTP sem introduzir AutoMapper ou camadas extras.

### Arquivos alterados
- `backend/DTOs/CursoResponses.cs` criado;
- `backend/Services/CursoService.cs` refatorado;
- `backend/Endpoints/CursoEndpoints.cs` simplificado;
- `backend/Models/Cursos.cs` renomeado para `backend/Models/Curso.cs`;
- `backend/Data/CursoDadosIniciais.cs` e `backend/Data/CursoConteudoInicial.cs` substituídos por `backend/Data/Seed/CursoSeed.cs`;
- `backend/Program.cs` atualizado para usar o seed consolidado;
- teste vazio substituído por testes reais de filtros/busca e detalhe com módulos/aulas.

### Validações esperadas
A CI do commit desta fase deve confirmar build, testes, publish, execução, API e Docker antes do avanço para o frontend.

### Resultado
Aguardar CI.

### Pendências
- limpeza física de assets e CSS duplicados;
- modularização do JavaScript;
- filtros obrigatórios na home;
- detalhe via endpoint por ID;
- documentação final;
- validação visual com Figma;
- publicação pública.
