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

### Resultado
- backend movido para `backend/`;
- frontend movido para `frontend/`;
- Dockerfile e projeto de testes ajustados;
- frontend incluído no resultado de `dotnet publish`;
- CI criada.

### Validações
Workflow CI #1: **sucesso** em restore, build, testes, publish, JavaScript, inicialização, API e Docker.

---

## Fases 2 a 5 — Backend, consultas, modelos e seed

### Objetivo
Deixar o backend simples, previsível e proporcional ao case.

### Decisões
- arquitetura mantida em `Endpoint → Service → DbContext → SQLite`;
- DTOs simples apenas para separar listagem e detalhe;
- listagem sem `Include` de módulos/aulas;
- detalhe carrega módulos/aulas;
- seed consolidado em uma única fonte explícita;
- `Models/Cursos.cs` renomeado para `Models/Curso.cs`;
- Repository, CQRS, MediatR e AutoMapper não foram adicionados.

### Resultado
- seis cursos preservados;
- três categorias, duas modalidades e três situações preservadas;
- diferentes cargas horárias e públicos-alvo;
- módulos e descrições de aulas;
- datas de disponibilidade quando aplicáveis;
- imagens apontando para assets reais;
- teste vazio substituído por testes reais com SQLite em memória.

### Validações
Workflow CI #2: **sucesso** em restore, build, testes, publish, execução, API e Docker.

---

## Fases 6 a 17 — Frontend, contrato, detalhes, estados, responsividade e acessibilidade

### Objetivo
Eliminar duplicação e hotfixes, conectar a interface aos requisitos obrigatórios e usar a API como fonte de verdade.

### Decisões
- imagens consolidadas em `frontend/assets/images/`;
- cópia `frontend/images/` removida;
- `frontend/style.css` duplicado removido;
- `styles.css` preservado para reduzir risco de regressão visual;
- `catalog.css` contém apenas os novos controles do catálogo;
- JavaScript dividido em `api.js`, `ui.js`, `catalogo.js` e `curso.js`;
- contrato camelCase único;
- modal duplicado removido;
- `sessionStorage` removido do fluxo de detalhes;
- cards tornados links reais;
- detalhe usa `GET /api/cursos/{id}`;
- pesquisa e filtros são enviados à API.

### Funcionalidades implementadas
- pesquisa por nome;
- filtro por categoria;
- filtro por modalidade;
- filtro por status;
- combinação dos quatro critérios;
- contador de resultados;
- limpar filtros;
- loading, vazio e erro;
- retry em falha da listagem;
- detalhe direto por ID;
- curso não encontrado;
- módulos e aulas;
- labels, foco, skip-link, `aria-live` e menu mobile preservados/organizados;
- `prefers-reduced-motion` preservado.

### Validações
Workflow CI #3: **sucesso** em:
- restore;
- build;
- testes;
- publish;
- sintaxe de `api.js`, `ui.js`, `catalogo.js` e `curso.js`;
- inicialização real da aplicação;
- home;
- página `curso.html?id=1`;
- `GET /api/cursos`;
- `GET /api/cursos/1`;
- busca + categoria + modalidade + status combinados;
- imagem de curso;
- CSS;
- JavaScript publicado;
- Docker build.

### Resultado
Fases técnicas de frontend concluídas sem regressão detectada pela CI.

### Limites da validação
A CI não substitui revisão visual manual em navegadores, comparação pixel a pixel com o Figma ou teste com leitor de tela.

---

## Fases 18 a 20 — Documentação, IA e entrega técnica

### Objetivo
Fazer a documentação refletir exatamente o código final e preparar uma entrega reproduzível.

### Arquivos
- `README.md` atualizado;
- `USO_DE_IA.md` atualizado;
- `docs/ARQUIVOS_PUBLICACAO.md` criado;
- `docs/APRESENTACAO_TECNICA.md` criado;
- `.gitignore` e `.dockerignore` limpos;
- CI atualizada para gerar ZIP do `dotnet publish` e disponibilizá-lo como artifact.

### Validação
Aguardar CI final deste commit para confirmar também a geração do ZIP.

---

# Matriz de aderência ao case

| Requisito oficial | Status | Evidência no projeto |
|---|---|---|
| Frontend baseado na referência visual | PARCIAL | identidade visual existente preservada; comparação manual final com Figma pendente |
| Responsividade | PARCIAL | breakpoints existentes e filtros responsivos; validação manual em 320/375/768/1024/1440 pendente |
| Acessibilidade | PARCIAL | semântica, labels, foco, skip-link, links reais, aria-live e reduced-motion; leitor de tela pendente |
| Backend C#/.NET | ATENDIDO | `backend/` com ASP.NET Core .NET 10 |
| API de consulta | ATENDIDO | `GET /api/cursos` e `GET /api/cursos/{id}` |
| Banco open source | ATENDIDO | SQLite |
| Integração frontend/API/banco | ATENDIDO | ES Modules → API → Service → EF Core → SQLite |
| 6 cursos | ATENDIDO | `backend/Data/Seed/CursoSeed.cs` |
| 3 categorias | ATENDIDO | Tecnologia, Segurança, Gestão |
| 2 modalidades | ATENDIDO | Online e Presencial |
| 3 status | ATENDIDO | Disponível, Em breve e Encerrado |
| Diferentes cargas horárias | ATENDIDO | seed |
| Diferentes públicos-alvo | ATENDIDO | seed |
| Módulos e descrições de aulas | ATENDIDO | modelo, seed e endpoint de detalhe |
| Imagem de apresentação | ATENDIDO | assets individuais por curso |
| Data de disponibilização quando aplicável | ATENDIDO | cursos “Em breve” no seed |
| Pesquisa por nome | ATENDIDO | API + `catalogo.js` |
| Filtro categoria | ATENDIDO | API + interface |
| Filtro modalidade | ATENDIDO | API + interface |
| Filtro status | ATENDIDO | API + interface |
| Combinação busca + filtros | ATENDIDO | query string + smoke test CI |
| Quantidade de resultados | ATENDIDO | `result-count` |
| Limpar filtros | ATENDIDO | `clear-filters` |
| Detalhes do curso | ATENDIDO | `curso.html?id=` + endpoint por ID |
| Estado sem resultados | ATENDIDO | empty state |
| Loading | ATENDIDO | catálogo e detalhe |
| Erro | ATENDIDO | estado de erro e retry na listagem |
| CRUD administrativo | NÃO APLICÁVEL | não exigido pelo case |
| Integração Moodle | NÃO APLICÁVEL | opcional; registrada como evolução futura |
| README obrigatório | ATENDIDO | `README.md` |
| USO_DE_IA.md | ATENDIDO | ferramenta, objetivo, prompts, decisões, validação e inadequação documentados |
| Relação de arquivos de publicação | ATENDIDO | `docs/ARQUIVOS_PUBLICACAO.md` |
| ZIP de publicação | PARCIAL | CI final configurada para gerar artifact; confirmar execução final |
| Publicação gratuita | NÃO ATENDIDO | hospedagem externa ainda não configurada |
| Limitações conhecidas | ATENDIDO | README |

> O projeto não deve ser considerado entrega externa 100% concluída enquanto a publicação gratuita e a revisão visual final não forem realizadas.

---

# Checklist final técnico

- [x] arquitetura organizada
- [x] frontend separado
- [x] backend separado
- [x] build aprovado
- [x] testes aprovados
- [x] API aprovada
- [x] pesquisa aprovada
- [x] filtros aprovados
- [x] combinação de filtros aprovada
- [x] detalhes aprovados
- [x] módulos aprovados
- [x] aulas aprovadas
- [x] assets críticos validados pela CI
- [x] Docker validado
- [x] README atualizado
- [x] USO_DE_IA atualizado
- [ ] validação visual final do Figma
- [ ] teste manual completo de responsividade
- [ ] auditoria manual com leitor de tela
- [ ] publicação gratuita
- [ ] URL pública no README

## Conclusão técnica

A refatoração de código e arquitetura foi concluída de forma incremental e validada por CI. As pendências restantes são de validação visual/manual e publicação externa, não de organização estrutural ou funcionalidades obrigatórias de consulta.
