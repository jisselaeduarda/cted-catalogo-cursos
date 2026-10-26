# Memória da Refatoração — CTED Catálogo de Cursos

Este arquivo registra o diagnóstico, as decisões, as validações e as pendências da refatoração da branch `refactor/arquitetura-clean-code`.

## Fase 0 — Diagnóstico

### Objetivo
Entender o estado real da aplicação antes de modificar estrutura ou comportamento.

### Problemas encontrados
- frontend e backend misturados na raiz e em `wwwroot`;
- JavaScript com responsabilidades acumuladas e contrato defensivo demais;
- fluxo de detalhe duplicado entre modal e página dedicada;
- detalhe consultando todos os cursos em vez do endpoint por ID;
- JavaScript depois de `</html>`;
- assets e CSS duplicados;
- filtros obrigatórios disponíveis no backend, mas ausentes na interface;
- listagem do backend carregando módulos e aulas sem necessidade;
- seed dividido e pouco explícito;
- teste inicial vazio;
- documentação desalinhada com o código real.

### Decisão
Preservar ASP.NET Core Minimal API + Service + EF Core + SQLite e aplicar apenas abstrações proporcionais ao case.

### Resultado
Baseline registrado antes da refatoração.

---

## Fase 1 — Reorganização física

### Objetivo
Separar frontend e backend sem criar dois deploys.

### Decisão
Criar `frontend/` e `backend/`, mantendo o ASP.NET Core como host final da aplicação e da API.

### Arquivos alterados
- backend movido para `backend/`;
- frontend movido para `frontend/`;
- `Dockerfile` ajustado;
- referência do projeto de testes ajustada;
- workflow de CI criado;
- `backend/wwwroot/.gitkeep` criado para garantir um web root físico válido.

### Validações
Workflow CI #1 concluído com sucesso:
- restore;
- build;
- testes;
- publish;
- sintaxe JavaScript;
- inicialização real;
- smoke tests da API;
- Docker build.

### Resultado
Fase concluída sem regressão detectada.

---

## Fases 2 a 5 — Backend, consultas, modelos e seed

### Objetivo
Deixar o backend simples, previsível e proporcional ao case.

### Decisões
- manter `Endpoint → Service → DbContext → SQLite`;
- usar DTOs simples apenas para diferenciar listagem e detalhe;
- não criar Repository, CQRS, MediatR, AutoMapper ou camadas adicionais;
- carregar módulos/aulas apenas no detalhe;
- consolidar o seed em uma fonte de verdade explícita.

### Arquivos alterados
- `backend/DTOs/CursoResponses.cs`;
- `backend/Services/CursoService.cs`;
- `backend/Endpoints/CursoEndpoints.cs`;
- `backend/Models/Curso.cs`;
- `backend/Data/Seed/CursoSeed.cs`;
- `backend/Program.cs`;
- `tests/CTED.CatalogoCursos.Tests/CursoServiceTests.cs`.

### Resultado
- listagem ficou menor e sem `Include` de módulos/aulas;
- detalhe mantém módulos e aulas ordenados;
- seis cursos, três categorias, duas modalidades e três status preservados;
- módulos e descrições de aulas preservados;
- `DataDisponibilidade` preenchida onde aplicável;
- testes reais substituíram o teste vazio.

### Validações
Workflow CI #2 concluído com sucesso:
- restore;
- build;
- testes unitários/integração com SQLite em memória;
- publish;
- aplicação iniciada;
- API validada;
- Docker build.

### Resultado
Fases 2 a 5 concluídas.

---

## Fases 6 a 17 — Frontend, contrato, detalhes, estados, responsividade e acessibilidade

### Objetivo
Eliminar duplicação e hotfixes, conectar a interface aos requisitos obrigatórios e usar a API como fonte de verdade.

### Problemas tratados
- imagens duplicadas em dois diretórios;
- `style.css` duplicado em relação ao stylesheet principal;
- `app.js` e `curso.js` com aliases e responsabilidades excessivas;
- modal de detalhe duplicado;
- `sessionStorage` usado como apoio para detalhe;
- página de detalhes carregando todos os cursos;
- ausência de pesquisa/filtros na home;
- script inline após `</html>`.

### Decisões
- consolidar imagens em `frontend/assets/images/`;
- manter `styles.css` como stylesheet visual principal e usar `catalog.css` apenas para os controles novos do catálogo, sem duplicar regras existentes;
- separar JavaScript em `api.js`, `ui.js`, `catalogo.js` e `curso.js`;
- assumir o contrato camelCase real da própria API;
- fazer `curso.html?id=...` consultar diretamente `GET /api/cursos/{id}`;
- remover modal e `sessionStorage` do fluxo de detalhe;
- usar links reais nos cards para acessibilidade nativa;
- enviar pesquisa e filtros para a API, em vez de reproduzir a regra no navegador.

### Funcionalidades implementadas
- pesquisa por nome;
- categoria;
- modalidade;
- status;
- combinação dos quatro critérios;
- contador de resultados;
- limpar filtros;
- loading;
- vazio;
- erro com tentar novamente;
- detalhe por ID;
- curso não encontrado;
- módulos e aulas;
- navegação mobile e foco preservados;
- `prefers-reduced-motion` preservado no CSS existente.

### Validação
Aguardar o workflow CI do commit desta fase antes de considerá-la concluída.

### Pendências
- documentação final;
- matriz de aderência final;
- ZIP de publicação;
- comparação visual manual com o Figma;
- publicação gratuita e URL pública.
