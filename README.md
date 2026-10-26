# CTED — Catálogo de Cursos

Aplicação web desenvolvida para o case técnico de Desenvolvedor de Sistemas I. O projeto apresenta um catálogo de cursos fictícios, com API REST, persistência em banco de dados e interface responsiva.

## Tecnologias

- **Backend:** C#, ASP.NET Core Minimal API e .NET 10
- **Persistência:** Entity Framework Core e SQLite
- **Frontend:** HTML5, CSS3 e JavaScript ES Modules
- **Testes:** xUnit
- **Execução e entrega:** Docker e GitHub Actions

## Arquitetura

O frontend e o backend fazem parte da mesma aplicação, permitindo disponibilizar a interface e a API em um único deploy.

```text
Navegador
    |
    v
Frontend (HTML, CSS e JavaScript)
    |
    v
API REST — ASP.NET Core Minimal API
    |
    v
CursoEndpoints
    |
    v
CursoService
    |
    v
CursoDbContext — Entity Framework Core
    |
    v
SQLite
```

A separação entre endpoints, serviços, modelos e DTOs mantém as responsabilidades organizadas sem adicionar camadas desnecessárias ao escopo do projeto.

## Funcionalidades

- Exibição do catálogo de cursos.
- Pesquisa de cursos pela interface.
- Página de detalhes de cada curso.
- Organização dos cursos em módulos e aulas.
- Tratamento de estados de carregamento, ausência de resultados e erros.
- Interface responsiva para diferentes tamanhos de tela.
- Persistência dos dados com SQLite.
- Dados fictícios para demonstração e testes.

O projeto utiliza cursos fictícios para fins de demonstração, sem representar uma oferta real de cursos.

## Estrutura do projeto

```text
CTED.CatalogoCursos/
├── backend/
│   ├── Data/
│   │   └── Seed/
│   ├── DTOs/
│   ├── Endpoints/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   └── Program.cs
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   │   ├── api.js
│   │   ├── catalogo.js
│   │   ├── curso.js
│   │   └── ui.js
│   ├── curso.html
│   └── index.html
├── tests/
├── docs/
├── Dockerfile
├── README.md
└── USO_DE_IA.md
```

## Como executar localmente

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/jisselaeduarda/cted-catalogo-cursos.git
cd cted-catalogo-cursos
git checkout feat/refactor
```

### 2. Restaurar as dependências

```bash
dotnet restore backend/CTED.CatalogoCursos.csproj
```

### 3. Compilar o projeto

```bash
dotnet build backend/CTED.CatalogoCursos.csproj
```

### 4. Executar os testes

```bash
dotnet test tests/CTED.CatalogoCursos.Tests/CTED.CatalogoCursos.Tests.csproj
```

### 5. Iniciar a aplicação

```bash
dotnet run --project backend/CTED.CatalogoCursos.csproj --urls http://localhost:5046
```

Acesse a aplicação em:

- Catálogo: http://localhost:5046
- API de cursos: http://localhost:5046/api/cursos
- Detalhes de um curso: http://localhost:5046/curso.html?id=1

## API REST

### Listar cursos

`GET /api/cursos`

Retorna os cursos disponíveis na API.

### Consultar detalhes de um curso

`GET /api/cursos/{id}`

Retorna os detalhes do curso solicitado, incluindo seus módulos e aulas. Um identificador inexistente deve retornar uma resposta HTTP 404.

## Modelo de dados

A estrutura relacional utiliza três entidades principais:

- **Curso:** informações gerais do curso.
- **Módulo:** unidades que organizam o conteúdo de um curso.
- **Aula:** conteúdos pertencentes a cada módulo.

Relacionamento:

```text
Curso 1 ─── N Módulo 1 ─── N Aula
```

Os DTOs permitem separar os dados retornados na listagem dos dados detalhados de um curso.

## Banco de dados e migrations

O projeto utiliza SQLite com Entity Framework Core. As migrations versionam as alterações do modelo de dados, enquanto o seed disponibiliza dados fictícios para a demonstração.

A configuração da conexão está nos arquivos de configuração do backend. Em execução local, verifique a connection string antes de iniciar a aplicação.

## Docker

Para construir a imagem:

```bash
docker build -t cted-catalogo-cursos .
```

Para executar o container:

```bash
docker run --rm -p 10000:10000 cted-catalogo-cursos
```

A disponibilidade do container depende de a imagem ser construída e executada com sucesso no ambiente utilizado.

## Testes e validação

A suíte automatizada utiliza xUnit.

Validação executada durante a preparação desta entrega:

- `dotnet test`: **2 testes aprovados, 0 falhas**.

A validação local não substitui a conferência do pipeline de CI, da publicação ou do comportamento visual nos navegadores.

## Uso de inteligência artificial

O ChatGPT foi utilizado como ferramenta de apoio à análise, revisão, refatoração e documentação do projeto.

As decisões técnicas foram avaliadas considerando o código existente, os requisitos do case e as validações realizadas. A documentação detalhada está em [`USO_DE_IA.md`](USO_DE_IA.md).

## Documentação adicional

Consulte a pasta [`docs/`](docs/) para os documentos técnicos e registros complementares disponíveis no repositório.

## Status da entrega

Projeto em preparação para entrega do case técnico. A publicação e a validação visual final devem ser conferidas separadamente antes de serem consideradas concluídas.
