
# CTED — Catálogo de Cursos

Aplicação web para consulta e exploração de cursos de qualificação profissional voltados à indústria, desenvolvida para o desafio SESI Developer Systems I.

## Objetivo

Disponibilizar um catálogo de cursos que permita ao usuário pesquisar, filtrar e consultar informações sobre as formações oferecidas.

## Tecnologias utilizadas

### Frontend
- HTML5.
- CSS3.
- JavaScript.
- Layout responsivo.
- Recursos de acessibilidade, incluindo rótulos nos campos, navegação por teclado e mensagens de atualização de resultados.

### Backend
- C#.
- ASP.NET Core.
- API REST.
- Entity Framework Core.

### Banco de dados
- SQLite.
- Migrations do Entity Framework Core para criação e atualização da estrutura do banco.
- Dados iniciais para demonstração.

## Arquitetura do projeto

A aplicação está organizada em camadas para separar as responsabilidades:

- **Models:** representação dos dados dos cursos.
- **Data:** contexto do banco de dados e dados iniciais.
- **Services:** lógica relacionada à consulta dos cursos.
- **Program.cs:** configuração da aplicação, serviços, banco de dados e endpoints.
- **wwwroot:** arquivos estáticos do frontend.
- **Migrations:** histórico de alterações na estrutura do banco de dados.

## Estrutura de pastas

```text
CTED.CatalogoCursos/
├── Data/
│   ├── CursoDbContext.cs
│   └── CursoDadosIniciais.cs
├── Models/
│   └── Cursos.cs
├── Services/
│   └── CursoService.cs
├── Migrations/
├── wwwroot/
│   ├── images/
│   ├── index.html
│   └── style.css
├── Program.cs
├── appsettings.json
├── README.md
├── USO_DE_IA.md
└── cursos.db
```

A estrutura pode conter outros arquivos auxiliares gerados pelo .NET e pelo Entity Framework Core.

## Funcionalidades implementadas

- Listagem de cursos.
- Pesquisa por nome.
- Filtro por categoria.
- Filtro por modalidade.
- Filtro por status.
- Combinação dos filtros.
- Exibição da quantidade de resultados.
- Limpeza dos filtros.
- Exibição dos detalhes de cada curso.
- Navegação pelo catálogo com setas de carrossel.
- Mensagem quando nenhum curso é encontrado.
- Tratamento de falha na consulta à API.
- Interface adaptável a computadores, tablets e celulares.

## Dados dos cursos

O catálogo utiliza seis cursos fictícios distribuídos entre três categorias, duas modalidades e três status.

As informações apresentadas incluem nome completo, nome resumido, descrição, categoria, modalidade, carga horária, público-alvo e status.

Os cursos e seus dados iniciais são utilizados exclusivamente para demonstrar o funcionamento da aplicação.

## Como executar localmente

### Pré-requisitos

- .NET SDK compatível com o projeto (.NET 10).
- Terminal ou Visual Studio Code.
- Entity Framework Core Tools, caso seja necessário executar migrations manualmente.

### 1. Abrir a pasta do projeto

Entre no diretório `CTED.CatalogoCursos`.

### 2. Restaurar as dependências

```bash
dotnet restore
```

### 3. Compilar o projeto

```bash
dotnet build
```

### 4. Executar a aplicação

```bash
dotnet run --urls http://localhost:5046
```

Abra no navegador:

http://localhost:5046

A aplicação utiliza SQLite. Confira a connection string em `appsettings.json` para verificar onde o arquivo do banco de dados será criado.

A inicialização da aplicação está configurada para aplicar as migrations e preparar os dados iniciais.

## API

### Listar cursos

```http
GET /api/cursos
```

Exemplo:

```http
GET /api/cursos?categoria=Tecnologia
```

### Parâmetros de consulta

| Parâmetro | Finalidade |
|---|---|
| `busca` | Pesquisa por nome do curso |
| `categoria` | Filtra por categoria |
| `modalidade` | Filtra por modalidade |
| `status` | Filtra por status |

Os parâmetros podem ser combinados na mesma requisição.

Exemplo:

```http
GET /api/cursos?categoria=Tecnologia&modalidade=Online
```

A API retorna os cursos que correspondem aos filtros informados.

## Banco de dados

O projeto utiliza SQLite por meio do Entity Framework Core.

As migrations registram as alterações estruturais do banco. Os dados iniciais são preparados pela rotina de inicialização da aplicação.

Para consultar as migrations disponíveis:

```bash
dotnet ef migrations list
```

Para aplicar migrations manualmente, quando necessário:

```bash
dotnet ef database update
```

Execute esses comandos na pasta que contém o arquivo do projeto `.csproj`.

## Responsividade e acessibilidade

A interface adapta a quantidade de cartões exibidos conforme a largura da tela.

Os campos possuem rótulos associados, os cartões podem ser acessados pelo teclado e as mensagens de resultado utilizam regiões de atualização acessíveis.

## Imagens

Os recursos visuais utilizados são os arquivos existentes no material disponibilizado para o projeto.

Como não foram identificadas imagens individuais para todos os cursos, imagens gerais do material institucional são reutilizadas por categoria. Elas não devem ser interpretadas como fotografias específicas de cada formação.

## Testes realizados

- Compilação com `dotnet build`: concluída com sucesso.
- Consulta da lista de cursos pela API.
- Teste de filtro por categoria.
- Teste de filtros combinados.
- Teste de pesquisa por nome.
- Teste de filtro por status.
- Verificação da disposição dos cartões em três colunas no computador.
- Teste dos filtros e da interface em viewport de celular.
- Teste de abertura dos detalhes e retorno ao catálogo.

## Limitações conhecidas

- As imagens individuais de cada curso não estão disponíveis no material identificado; são usadas imagens institucionais genéricas.
- A publicação em um ambiente acessível pela internet ainda precisa ser configurada e validada.
- O CRUD administrativo não faz parte do escopo implementado.
- A disponibilidade de cada curso é apresentada pelo status cadastrado; datas específicas devem ser informadas quando aplicáveis.

## Publicação

**Repositório GitHub:** preencher após confirmar a URL do repositório.

**Aplicação publicada:** preencher após realizar e testar a publicação.

## Uso de inteligência artificial

As ferramentas, sugestões aproveitadas, correções e validações realizadas com auxílio de inteligência artificial estão documentadas em [`USO_DE_IA.md`](USO_DE_IA.md).
