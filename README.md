# CTED — Catálogo de Cursos

Aplicação web de catálogo de cursos de qualificação profissional para a indústria, desenvolvida como parte de um case técnico para Desenvolvedor de Sistemas I.

> Os cursos e conteúdos deste projeto são fictícios e existem apenas para demonstração técnica.

## Tecnologias

**Frontend**
- HTML5
- CSS3
- JavaScript Vanilla com ES Modules

**Backend**
- C# / .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core
- SQLite

**Qualidade e entrega**
- xUnit
- Docker
- GitHub Actions

## Arquitetura

A solução mantém frontend e backend separados no repositório, mas utiliza **um único deploy**. O ASP.NET Core serve os arquivos estáticos do frontend e também expõe a API no mesmo domínio.

```text
Navegador
   ↓
frontend/ (HTML + CSS + JavaScript)
   ↓ HTTP
/api/cursos
   ↓
Endpoints
   ↓
CursoService
   ↓
Entity Framework Core
   ↓
SQLite
```

A arquitetura do backend foi mantida intencionalmente simples:

```text
Endpoint → Service → DbContext → SQLite
```

Não foram adicionados Repository Pattern, CQRS, MediatR, AutoMapper ou múltiplos projetos de domínio porque não agregariam valor proporcional ao escopo deste case.

## Estrutura de pastas

```text
cted-catalogo-cursos/
├── frontend/
│   ├── assets/
│   │   └── images/
│   ├── css/
│   │   ├── styles.css
│   │   └── catalog.css
│   ├── js/
│   │   ├── api.js
│   │   ├── ui.js
│   │   ├── catalogo.js
│   │   └── curso.js
│   ├── index.html
│   └── curso.html
├── backend/
│   ├── Data/
│   │   └── Seed/
│   ├── DTOs/
│   ├── Endpoints/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   ├── appsettings.json
│   └── CTED.CatalogoCursos.csproj
├── tests/
│   └── CTED.CatalogoCursos.Tests/
├── docs/
│   ├── REFACTOR_LOG.md
│   ├── ARQUIVOS_PUBLICACAO.md
│   └── APRESENTACAO_TECNICA.md
├── .github/workflows/ci.yml
├── Dockerfile
├── README.md
└── USO_DE_IA.md
```

## Funcionalidades

- listagem de cursos pela API;
- pesquisa por nome completo ou resumido;
- pesquisa tolerante a acentos;
- filtro por categoria;
- filtro por modalidade;
- filtro por status;
- combinação de pesquisa e filtros;
- contagem de resultados;
- limpar filtros;
- estados de loading, vazio e erro;
- página dedicada de detalhes;
- módulos e descrições de aulas;
- estado de curso não encontrado;
- layout responsivo;
- navegação por teclado e foco visível.

Não existe CRUD administrativo porque o case é de consulta de catálogo.

## Dados do catálogo

O seed possui 6 cursos fictícios com:

- 3 categorias: Tecnologia, Segurança e Gestão;
- 2 modalidades: Online e Presencial;
- 3 status: Disponível, Em breve e Encerrado;
- diferentes cargas horárias;
- diferentes públicos-alvo;
- imagens de apresentação;
- módulos e aulas com descrições;
- data de disponibilização nos cursos em que ela é aplicável.

## Como executar localmente

### Pré-requisitos

- .NET SDK 10
- Git

### 1. Clonar

```bash
git clone https://github.com/anamsilva1981/cted-catalogo-cursos.git
cd cted-catalogo-cursos
git checkout refactor/arquitetura-clean-code
```

### 2. Restaurar e compilar

```bash
dotnet restore backend/CTED.CatalogoCursos.csproj
dotnet build backend/CTED.CatalogoCursos.csproj
```

### 3. Executar testes

```bash
dotnet test tests/CTED.CatalogoCursos.Tests/CTED.CatalogoCursos.Tests.csproj
```

### 4. Executar aplicação

```bash
dotnet run --project backend/CTED.CatalogoCursos.csproj --urls http://localhost:5046
```

Acesse:

- aplicação: `http://localhost:5046`
- API: `http://localhost:5046/api/cursos`
- detalhe: `http://localhost:5046/curso.html?id=1`

## Banco e migrations

O banco utilizado é SQLite. A connection string está em `backend/appsettings.json` e utiliza `Data Source=cursos.db`.

Na execução local o arquivo é resolvido a partir do diretório de conteúdo do backend. O banco local é ignorado pelo Git.

As migrations existentes são aplicadas automaticamente na inicialização por `Database.Migrate()`.

Se precisar aplicar manualmente:

```bash
dotnet ef database update --project backend/CTED.CatalogoCursos.csproj
```

## API

### `GET /api/cursos`

Parâmetros opcionais:

| Parâmetro | Função |
|---|---|
| `busca` | pesquisa por nome completo ou resumido |
| `categoria` | filtra categoria |
| `modalidade` | filtra modalidade |
| `status` | filtra status |

Exemplo combinado:

```text
/api/cursos?busca=industria&categoria=Tecnologia&modalidade=Online&status=Disponível
```

A listagem retorna apenas os dados necessários para o catálogo. Módulos e aulas não são carregados nessa consulta.

### `GET /api/cursos/{id}`

Retorna o curso completo, incluindo módulos e aulas ordenados.

Exemplo:

```text
/api/cursos/1
```

Quando o identificador não existe, a API retorna `404 Not Found`.

## Modelo de dados

```text
Curso 1 ── N Modulo 1 ── N Aula
```

`Curso` contém os dados gerais da formação. `Modulo` organiza o conteúdo programático e `Aula` contém título, descrição e ordem.

DTOs simples separam o contrato da listagem do contrato de detalhes, evitando enviar módulos e aulas quando a tela não precisa deles.

## Frontend

O JavaScript foi dividido por responsabilidade:

- `api.js`: comunicação HTTP;
- `ui.js`: utilitários compartilhados de interface;
- `catalogo.js`: pesquisa, filtros, listagem e carrosséis;
- `curso.js`: carregamento e renderização da página de detalhes.

A página de detalhes utiliza diretamente `GET /api/cursos/{id}`. Não depende de `sessionStorage` nem carrega todos os cursos para localizar um item.

## Responsividade

O CSS existente possui breakpoints para desktop, tablet e dispositivos móveis. Os novos controles de catálogo também se reorganizam em telas menores.

A validação automatizada confirma que os recursos são publicados e servidos corretamente. A revisão visual manual nos tamanhos 320, 375, 768, 1024 e 1440 px deve ser feita antes da entrega definitiva para confirmar fidelidade ao Figma.

## Acessibilidade

Foram preservados ou implementados:

- HTML semântico;
- skip link;
- labels associados aos campos;
- foco visível;
- links reais para os cards de curso;
- `aria-live` para contador/estados dinâmicos;
- textos alternativos;
- menu mobile com `aria-expanded`;
- suporte a `prefers-reduced-motion` no stylesheet existente.

Uma auditoria manual com teclado e, idealmente, leitor de tela continua recomendada antes da entrega final.

## Testes e CI

A branch `refactor/arquitetura-clean-code` possui GitHub Actions que executa:

- `dotnet restore`;
- `dotnet build`;
- testes xUnit com SQLite em memória;
- `dotnet publish`;
- `node --check` nos módulos JavaScript;
- inicialização real da aplicação;
- smoke test da home e da página de detalhes;
- smoke tests dos endpoints;
- teste de pesquisa + filtros combinados;
- verificação de assets estáticos;
- `docker build .`.

As três etapas principais da refatoração foram validadas com a CI verde antes do avanço para a fase seguinte.

## Docker

Para gerar a imagem:

```bash
docker build -t cted-catalogo-cursos .
```

Para executar:

```bash
docker run --rm -p 10000:10000 cted-catalogo-cursos
```

Depois acesse `http://localhost:10000`.

## Publicação

O projeto está preparado para publicação como uma única aplicação ASP.NET Core/Docker. O frontend é copiado para o `wwwroot` do resultado de `dotnet publish`.

A relação dos arquivos de publicação e a geração do ZIP estão documentadas em `docs/ARQUIVOS_PUBLICACAO.md`.

**URL pública:** pendente de publicação em plataforma gratuita.

## Limitações conhecidas e itens não concluídos

- publicação pública ainda não realizada;
- URL pública ainda não disponível;
- comparação visual final, lado a lado, com o Figma ainda precisa de validação manual;
- matrícula online não foi implementada, pois não faz parte do escopo obrigatório;
- integração real com Moodle não foi implementada e é tratada como evolução futura;
- revisão manual completa de acessibilidade com leitor de tela não foi executada.

## Uso de IA

O uso de inteligência artificial está documentado em `USO_DE_IA.md`, incluindo objetivos, decisões aceitas/rejeitadas, validações e limitações.

## Documentação complementar

- `docs/REFACTOR_LOG.md`: memória técnica da refatoração e matriz de aderência;
- `docs/ARQUIVOS_PUBLICACAO.md`: publicação e ZIP;
- `docs/APRESENTACAO_TECNICA.md`: roteiro curto para apresentação da solução.
