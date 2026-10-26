# Uso de Inteligência Artificial — CTED

## 1. Ferramenta utilizada

Foi utilizado o ChatGPT como ferramenta de apoio à revisão e refatoração do case CTED — Catálogo de Cursos.

A IA foi utilizada como apoio técnico. As decisões foram comparadas com o código real, com o enunciado do case e com as validações executadas no GitHub Actions.

## 2. Objetivos do uso de IA

A ferramenta foi utilizada para:

- diagnosticar a estrutura existente;
- propor uma arquitetura simples e explicável;
- separar frontend e backend sem criar dois deploys;
- revisar o fluxo da API e do Entity Framework Core;
- reduzir payload da listagem;
- consolidar o seed;
- remover duplicações e código morto do frontend;
- conectar pesquisa e filtros à API;
- simplificar a página de detalhes;
- preparar testes, CI e documentação;
- revisar aderência aos requisitos do case.

## 3. Prompt principal

O trabalho foi orientado por um prompt de revisão arquitetural que estabeleceu, entre outros pontos:

- não alterar diretamente a `main`;
- criar memória da refatoração;
- evitar overengineering;
- manter Minimal API + Service + EF Core;
- separar `frontend/` e `backend/`;
- manter um único deploy;
- validar cada fase antes de avançar;
- remover duplicações e hotfixes;
- garantir pesquisa, filtros e detalhes;
- atualizar README e documentação de IA;
- não declarar sucesso sem validação real.

## 4. Sugestões aproveitadas

Foram aproveitadas sugestões para:

- manter a arquitetura `Endpoint → Service → DbContext → SQLite`;
- separar fisicamente frontend e backend;
- manter ASP.NET Core como host do frontend e da API;
- criar DTOs simples para diferenciar listagem e detalhe;
- carregar módulos e aulas somente no endpoint de detalhe;
- consolidar o seed em `Data/Seed/CursoSeed.cs`;
- renomear `Models/Cursos.cs` para `Models/Curso.cs`;
- modularizar JavaScript em `api.js`, `ui.js`, `catalogo.js` e `curso.js`;
- utilizar diretamente o contrato camelCase da API;
- remover o modal duplicado e o uso de `sessionStorage` no detalhe;
- implementar busca e filtros através da própria API;
- criar testes com SQLite em memória;
- criar uma esteira de CI com build, testes, execução, smoke tests e Docker.

## 5. Sugestões rejeitadas ou ajustadas

### Arquitetura excessiva

Foram consideradas possíveis abstrações adicionais, como Repository Pattern e interfaces apenas por convenção. Elas foram descartadas porque o Entity Framework Core já fornece a abstração necessária de persistência e o escopo do case não justifica camadas extras.

### Reescrever todo o CSS principal

Durante a revisão, uma possibilidade considerada foi reescrever o stylesheet principal para remover de uma vez todas as regras antigas. A abordagem foi considerada inadequada neste momento porque aumentaria o risco de regressão visual sem uma comparação automatizada com o Figma.

A correção foi preservar `styles.css`, remover as cópias físicas duplicadas e isolar apenas os estilos dos novos controles de catálogo em `catalog.css`.

### Frontend tolerante a vários formatos de API

A implementação anterior aceitava diferentes aliases para o mesmo campo, como `nomeCompleto`, `NomeCompleto`, `nome`, `titulo` e `title`.

Essa estratégia foi removida porque o frontend e o backend pertencem à mesma solução e possuem um contrato conhecido. O código passou a utilizar um único contrato camelCase.

## 6. Como as sugestões foram validadas

A refatoração não foi considerada correta apenas porque foi gerada pela IA.

Após cada bloco de alterações, o GitHub Actions executou:

- `dotnet restore`;
- `dotnet build`;
- testes xUnit;
- `dotnet publish`;
- verificação de sintaxe dos módulos JavaScript;
- inicialização real da aplicação;
- smoke tests da home, detalhes e API;
- pesquisa e filtros combinados;
- verificação de arquivos estáticos;
- `docker build`.

As alterações estruturais, de backend e de frontend tiveram CI verde antes do avanço para a etapa seguinte.

## 7. Exemplo de inadequação da IA e correção

Uma abordagem inicialmente considerada durante a revisão foi substituir integralmente o CSS existente por um stylesheet reestruturado. Embora isso produzisse um arquivo mais limpo, a alteração teria uma superfície visual grande demais para o momento do case e poderia prejudicar a fidelidade ao protótipo.

A decisão humana foi reduzir o escopo: manter as regras visuais existentes que já funcionavam, eliminar apenas arquivos duplicados e adicionar os estilos dos novos filtros separadamente. Essa escolha priorizou segurança da entrega e facilidade de explicação.

## 8. Participação humana

A participação humana permanece necessária para:

- confirmar a fidelidade visual final ao Figma;
- revisar comportamento em navegadores e dispositivos reais;
- realizar auditoria manual de acessibilidade;
- escolher e configurar a hospedagem gratuita;
- apresentar e justificar as decisões técnicas na entrevista.

## 9. Limitações do uso de IA

A IA pode sugerir abstrações, caminhos de arquivos ou mudanças maiores do que o necessário. Por isso, cada proposta precisa ser comparada com o estado real do repositório e com os requisitos do case.

Neste projeto, a prioridade adotada foi: requisito obrigatório, funcionamento, fidelidade visual, clareza do código e somente depois melhorias opcionais.
