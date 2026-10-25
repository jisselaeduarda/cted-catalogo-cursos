# CTED — Catálogo de Cursos

Aplicação web desenvolvida para o desafio de Desenvolvedor de Sistemas I, com foco na consulta e exploração de cursos de qualificação profissional voltados à indústria.

## Tecnologias

- C# e .NET 10.
- ASP.NET Core Minimal APIs.
- Entity Framework Core 10.
- SQLite.
- HTML5, CSS3 e JavaScript.
- Git e GitHub.

## Arquitetura

O projeto separa a aplicação em camadas:

- `Models/`: modelos de curso, módulo e aula.
- `Data/`: contexto do banco SQLite e cadastro inicial dos cursos.
- `Services/`: consultas, filtros e carregamento dos dados relacionados.
- `Endpoints/`: rotas HTTP da API.
- `Migrations/`: histórico de alterações do banco de dados.
- `wwwroot/`: frontend, páginas, estilos, scripts e recursos visuais.
- `Program.cs`: configuração e inicialização da aplicação.
- `appsettings.json`: configuração da conexão com o banco.
- `USO_DE_IA.md`: documentação sobre o uso de inteligência artificial.

## Funcionalidades

- Listagem de cursos.
- Pesquisa por nome.
- Filtros por categoria, modalidade e status.
- Combinação de filtros.
- Exibição da quantidade de resultados.
- Limpeza dos filtros.
- Página de detalhes do curso.
- Exibição de carga horária, modalidade, status e público-alvo.
- Estrutura de dados para módulos e aulas.
- Navegação por carrossel.
- Mensagens para resultados vazios e falhas de consulta.
- Interface responsiva.

## Estrutura de pastas

```text
CTED.CatalogoCursos/
├── Data/
│   ├── CursoDbContext.cs
│   └── CursoDadosIniciais.cs
├── Endpoints/
│   └── CursoEndpoints.cs
├── Migrations/
├── Models/
│   ├── Cursos.cs
│   ├── Modulo.cs
│   └── Aula.cs
├── Services/
│   └── CursoService.cs
├── Properties/
├── wwwroot/
│   ├── assets/
│   ├── css/
│   ├── images/
│   ├── js/
│   ├── index.html
│   ├── curso.html
│   └── style.css
├── Program.cs
├── CTED.CatalogoCursos.csproj
├── appsettings.json
├── cursos.db
├── README.md
└── USO_DE_IA.md
```

A listagem acima representa a estrutura principal do projeto. Alguns arquivos auxiliares podem existir conforme a configuração local.

## Como executar

### Pré-requisitos

- .NET SDK 10.
- Entity Framework Core Tools para operações manuais de migração.

### Restaurar dependências

```bash
dotnet restore
```

### Compilar

```bash
dotnet build
```

### Executar

```bash
dotnet run --urls http://localhost:5046
```

Acesse `http://localhost:5046`.

Na inicialização, a aplicação aplica as migrações pendentes e prepara os dados iniciais quando necessário.

## API

### Listar e filtrar cursos

```http
GET /api/cursos
```

Parâmetros opcionais:

| Parâmetro | Finalidade |
|---|---|
| `busca` | Pesquisa pelo nome completo ou resumido |
| `categoria` | Filtra por categoria |
| `modalidade` | Filtra por modalidade |
| `status` | Filtra por status |

Exemplo:

```http
GET /api/cursos?categoria=Tecnologia&modalidade=Online
```

### Consultar detalhes de um curso

```http
GET /api/cursos/{id}
```

Exemplo:

```http
GET /api/cursos/1
```

Retorna os dados do curso e os módulos e aulas relacionados, quando cadastrados. Se o ID não existir, a API retorna `404 Not Found`.

## Banco de dados

O projeto utiliza SQLite e Entity Framework Core.

A conexão configurada em `appsettings.json` aponta para `cursos.db`. As migrações registram as alterações na estrutura do banco.

Para consultar as migrações:

```bash
dotnet ef migrations list
```

Para aplicar migrações pendentes:

```bash
dotnet ef database update
```

Execute os comandos na pasta que contém `CTED.CatalogoCursos.csproj`.

Antes de fazer alterações no banco, mantenha uma cópia de segurança do arquivo SQLite.

## Dados e limitações

O catálogo contém seis cursos fictícios para demonstração. Os resumos cadastrados são:

- Introdução à Indústria 4.0.
- Fundamentos de Segurança do Trabalho.
- Excel Aplicado à Produção.
- Automação de Processos Industriais.
- Gestão da Qualidade Industrial.
- Boas Práticas de Manutenção.

Os dados apresentados não representam uma oferta oficial de cursos do SESI. Os módulos e as aulas devem ser preenchidos com conteúdo validado antes de serem apresentados como conteúdo programático real.

As imagens disponíveis são recursos visuais do projeto e podem ser ilustrativas, não fotografias específicas de cada curso.

A aplicação não possui painel administrativo de CRUD nem integração de matrícula online.

## Validação realizada

- `dotnet build`: concluído com sucesso.
- `GET /api/cursos`: retornou `HTTP 200` e os seis cursos.
- `GET /api/cursos/1`: retornou `HTTP 200` com os dados do curso.

A validação visual completa, a publicação e os demais requisitos devem ser conferidos antes da entrega final.

## Repositório e publicação

Repositório GitHub: https://github.com/jisselaeduarda/cted-catalogo-cursos

Endereço da aplicação publicada: pendente de configuração e validação.

## Uso de inteligência artificial

O uso de ferramentas de IA durante o desenvolvimento, incluindo exemplos de solicitações, ajustes e validações, está documentado em `USO_DE_IA.md`.