# Apresentação Técnica — roteiro de aproximadamente 3 minutos

## 1. Visão geral

“Eu desenvolvi um catálogo de cursos para o contexto do SESI + Indústria. A aplicação possui um frontend em HTML, CSS e JavaScript e um backend em ASP.NET Core com Entity Framework Core e SQLite.”

## 2. Organização da solução

“Eu separei fisicamente o projeto em `frontend` e `backend` para deixar as responsabilidades mais claras, mas mantive um único deploy. O ASP.NET Core continua sendo o host da aplicação: ele serve o frontend estático e também disponibiliza a API no mesmo domínio.”

## 3. Fluxo backend

“O fluxo do backend é simples: Endpoint, Service, DbContext e SQLite. Eu mantive Minimal API porque ela atende bem ao tamanho do projeto e evita criar camadas sem necessidade.”

“Na listagem, a API retorna somente os dados necessários para os cards. Quando o usuário abre um curso específico, o endpoint de detalhe carrega também os módulos e as aulas. Isso evita trazer um volume maior de dados em todas as consultas.”

## 4. Pesquisa e filtros

“A home possui pesquisa por nome e filtros por categoria, modalidade e status. Esses critérios podem ser combinados e são enviados como query parameters para `GET /api/cursos`. A regra continua no backend, em vez de carregar tudo e repetir os filtros no navegador.”

“A pesquisa por nome também aceita diferenças de acentuação, por exemplo pesquisar ‘industria’ e encontrar ‘Indústria’.”

## 5. Detalhes

“Cada card é um link para `curso.html?id=...`. A página chama diretamente `GET /api/cursos/{id}`. Antes da refatoração, o frontend baixava todos os cursos e procurava o selecionado em JavaScript; eu simplifiquei isso para usar o endpoint que já existia.”

## 6. Modelo de dados

“O modelo possui Curso, Módulo e Aula. Um curso possui vários módulos e um módulo possui várias aulas. As relações são mapeadas no Entity Framework Core e persistidas no SQLite.”

## 7. Clean Code e escolhas

“No frontend eu separei o JavaScript em quatro responsabilidades: comunicação com a API, utilitários de interface, catálogo e página de detalhes. Também removi o modal duplicado, aliases excessivos de propriedades, uso de `sessionStorage` no detalhe e duplicações de assets.”

“No backend eu não adicionei Repository, CQRS ou MediatR porque seriam complexidade sem benefício real para este case. A prioridade foi manter o código correto, simples e fácil de explicar.”

## 8. Qualidade e validação

“Criei testes usando SQLite em memória e uma CI no GitHub Actions. Ela executa restore, build, testes, publish, validação de sintaxe JavaScript, inicia a aplicação, testa os endpoints e os arquivos estáticos e também executa o Docker build.”

## 9. Limitações

“A publicação pública ainda precisa ser configurada em uma hospedagem gratuita e a fidelidade visual final deve ser comparada manualmente com o Figma. A integração real com Moodle e a matrícula online não foram implementadas porque não são requisitos obrigatórios desta versão.”

---

## Perguntas que podem aparecer

### Por que não usar React ou Angular?
Porque o frontend já estava construído em HTML/CSS/JavaScript e migrar de framework aumentaria escopo e risco sem atender melhor aos requisitos do case.

### Por que usar DTO?
Para separar o que a API devolve na listagem do que devolve no detalhe. Assim a listagem não precisa enviar módulos e aulas.

### Por que SQLite?
É open source, simples para um case pequeno e funciona bem com Entity Framework Core e migrations.

### Por que não usar Repository Pattern?
Porque o `DbContext` do Entity Framework Core já fornece uma abstração adequada para persistência neste tamanho de solução. Criar um repository apenas para repassar chamadas aumentaria código sem ganho proporcional.

### O que você melhoraria com mais tempo?
Faria a comparação visual final em todos os breakpoints, uma auditoria manual mais completa de acessibilidade, publicaria a aplicação e, se o produto evoluísse, avaliaria testes de interface automatizados.
