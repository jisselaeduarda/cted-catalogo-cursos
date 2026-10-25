# CTED — Catálogo de Cursos

Aplicação web de catálogo de cursos de qualificação profissional para a indústria, desenvolvida como parte do processo seletivo para Desenvolvedor de Sistemas I.

**Repositório:** https://github.com/jisselaeduarda/cted-catalogo-cursos

## Tecnologias utilizadas

- C# e ASP.NET Core com .NET 10.
- Entity Framework Core.
- SQLite para persistência dos dados.
- HTML, CSS e JavaScript no frontend.
- Git e GitHub para controle de versão.
- Docker para empacotamento e publicação em ambiente compatível.

## Funcionalidades

- Listagem dos cursos cadastrados.
- Pesquisa de cursos por nome.
- Filtros por categoria, modalidade e status.
- Combinação de critérios de pesquisa.
- Cartões de cursos em carrossel.
- Página de detalhes com descrição, carga horária, modalidade e público-alvo.
- Apresentação dos módulos e das aulas cadastradas.
- Mensagens para carregamento, falha de consulta e ausência de resultados.
- Layout responsivo e controles básicos de acessibilidade.

A aplicação utiliza dados fornecidos pela API. Os filtros disponíveis na interface são aplicados aos cursos carregados pelo frontend.

## Estrutura do projeto

- `Program.cs`: configuração da aplicação e dos endpoints.
- `Data/`: contexto do Entity Framework Core e dados iniciais.
- `Models/`: entidades utilizadas no catálogo.
- `wwwroot/index.html`: página inicial e catálogo.
- `wwwroot/curso.html`: página de detalhes do curso.
- `wwwroot/css/styles.css`: estilos principais do frontend.
- `wwwroot/js/app.js`: carregamento dos cursos, carrossel e filtros.
- `wwwroot/js/curso.js`: carregamento e apresentação dos detalhes.
- `wwwroot/assets/images/`: imagens e ícones utilizados pela interface.
- `Dockerfile`: configuração para construção da imagem da aplicação.
- `USO_DE_IA.md`: documentação do apoio de inteligência artificial.

## Requisitos para execução

- SDK do .NET 10.
- Git, caso o projeto seja clonado do repositório.

## Como executar localmente

Clone o repositório:

```bash
git clone https://github.com/jisselaeduarda/cted-catalogo-cursos.git
cd cted-catalogo-cursos/CTED.CatalogoCursos
```

Restaure as dependências:

```bash
dotnet restore
```

Compile a aplicação:

```bash
dotnet build
```

Execute localmente:

```bash
dotnet run --urls http://localhost:5046
```

Acesse no navegador:

- Aplicação: http://localhost:5046
- Listagem da API: http://localhost:5046/api/cursos
- Detalhes de um curso: http://localhost:5046/api/cursos/1

A base SQLite e os dados iniciais são gerenciados pela aplicação conforme sua configuração. Para conferir os dados efetivamente utilizados, execute a aplicação e consulte os endpoints.

## API

### `GET /api/cursos`

Retorna a lista de cursos. A API aceita os parâmetros de pesquisa e filtragem implementados no backend:

- `busca`: pesquisa textual.
- `categoria`: filtra por categoria.
- `modalidade`: filtra por modalidade.
- `status`: filtra por status.

Exemplo:

```text
/api/cursos?categoria=Tecnologia&modalidade=Online
```

### `GET /api/cursos/{id}`

Retorna os dados de um curso específico, incluindo os módulos e as aulas cadastradas, quando disponíveis.

## Modelo de dados

O catálogo utiliza entidades para cursos, módulos e aulas. Cada curso pode possuir módulos, e cada módulo pode possuir aulas. O relacionamento permite organizar o conteúdo programático na página de detalhes.

Os cursos e conteúdos iniciais são destinados à demonstração do funcionamento da aplicação. As informações não devem ser interpretadas como oferta oficial de cursos do SESI.

## Acessibilidade e responsividade

O frontend utiliza HTML semântico, links de navegação, identificação de botões, controles de teclado e estilos adaptáveis a diferentes tamanhos de tela. A validação visual final deve considerar desktop e dispositivos móveis.

## Uso de inteligência artificial

O arquivo `USO_DE_IA.md` registra como o ChatGPT foi utilizado como ferramenta de apoio, com exemplos de solicitações, ajustes e limitações identificadas durante o desenvolvimento.

## Testes e validações

Na revisão realizada em 25/10/2026, foram confirmados:

- Compilação do projeto com `dotnet build`.
- Verificação de sintaxe dos arquivos JavaScript com `node --check`.
- Verificação das alterações com `git diff --check`.
- Consulta aos cursos pela API.
- Abertura local da home e dos detalhes dos cursos.
- Teste dos botões de busca e filtragem no navegador.

Esses testes não substituem uma validação completa de todos os cenários, navegadores e tamanhos de tela.

## Limitações conhecidas

- A matrícula online não está integrada.
- O contato exibido na interface é demonstrativo e não envia mensagens.
- As imagens compartilhadas são ilustrativas e não representam necessariamente cada curso.
- O conteúdo programático inicial precisa ser validado antes de ser apresentado como conteúdo oficial.
- A publicação pública e a URL definitiva de acesso precisam ser confirmadas.

## Publicação

O projeto inclui um `Dockerfile` baseado no .NET 10, configurado para executar a aplicação na porta `10000`. A publicação depende de uma plataforma compatível, da configuração do ambiente e da validação da persistência SQLite no ambiente hospedado.

**Status:** execução local validada; publicação pública ainda pendente de confirmação.
