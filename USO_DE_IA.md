
# Uso de Inteligência Artificial — CTED

## 1. Ferramenta utilizada

Foi utilizado o ChatGPT como ferramenta de apoio ao desenvolvimento do projeto CTED — Catálogo de Cursos.

A ferramenta auxiliou na implementação e revisão do frontend, na compreensão do backend e da API, na organização dos arquivos, na identificação de problemas e na elaboração da documentação técnica.

O desenvolvimento, a execução dos comandos e a verificação da interface foram realizados no ambiente local do projeto.

## 2. Objetivos do uso de IA

A inteligência artificial foi utilizada para:

- Apoiar a construção da interface com HTML, CSS e JavaScript.
- Implementar a consulta à API e a utilização dos filtros.
- Melhorar a responsividade e a navegação por teclado.
- Implementar a abertura dos detalhes de um curso.
- Corrigir problemas encontrados durante a execução.
- Preparar a documentação técnica do projeto.

## 3. Exemplos de prompts utilizados

Os exemplos abaixo resumem as solicitações realizadas durante o desenvolvimento.

### Frontend e responsividade

"Oriente a construção do catálogo de cursos conforme o protótipo, com filtros, cartões, responsividade e acesso aos detalhes."

**Resultado utilizado:** estrutura de consulta dos cursos, filtros e apresentação dos cartões.

### Integração com a API

"Implemente a consulta à API de cursos e permita combinar busca por nome, categoria, modalidade e status."

**Resultado utilizado:** requisições ao endpoint `/api/cursos` com os parâmetros de consulta.

### Navegação do catálogo

"Adapte os cartões para ficarem lado a lado e permita navegar pelos cursos com setas de carrossel, preservando a funcionalidade dos filtros."

**Resultado utilizado:** layout responsivo e controles de navegação do catálogo.

### Tratamento de erros

"Ajude a identificar por que as imagens não carregam e corrija os caminhos utilizando os arquivos existentes no projeto."

**Resultado utilizado:** identificação de caminhos inválidos e atualização das referências para os recursos disponíveis.

### Documentação

"Documente as tecnologias, a arquitetura, a execução local, os endpoints da API, os testes e as limitações do projeto."

**Resultado utilizado:** elaboração deste README e deste relatório de uso de IA.

## 4. Sugestões aceitas e ajustadas

Foram aproveitadas sugestões relacionadas a:

- Organização do HTML e do CSS.
- Consulta à API usando `fetch`.
- Aplicação combinada dos filtros.
- Uso de mensagens para carregamento, resultados vazios e falhas.
- Implementação do carrossel e da navegação pelos detalhes.
- Uso de atributos de acessibilidade e navegação por teclado.
- Documentação do projeto e das formas de execução local.

As sugestões foram aplicadas ao projeto e avaliadas por meio da execução local.

## 5. Sugestões rejeitadas ou corrigidas

### Botão de detalhes nos cartões

Uma primeira implementação incluía um botão "Ver detalhes" em cada cartão. Após comparar a interface com o protótipo fornecido, essa abordagem foi substituída pela abertura dos detalhes ao clicar no cartão, mantendo a navegação por teclado.

### Caminhos de imagens inexistentes

Inicialmente, o frontend tentava carregar arquivos JPG com nomes que não existiam em `wwwroot/images`, produzindo respostas HTTP 404.

A pasta foi inspecionada e os caminhos foram ajustados para utilizar arquivos existentes do material institucional, como `hero-image.png`, `banner-ava.png` e `video-thumb.png`.

Essas imagens são recursos gerais da plataforma e não imagens individuais de todos os cursos. Essa limitação foi registrada na documentação.

### Ajustes de cores

Algumas alterações de CSS modificaram cores do cabeçalho e dos cartões de maneira diferente do protótipo. As regras foram ajustadas para recuperar o fundo vermelho do cabeçalho e preservar a identidade visual escolhida.

## 6. Validação das sugestões

As sugestões não foram consideradas corretas apenas por terem sido geradas pela ferramenta. Foram verificadas durante a implementação.

Validações realizadas:

- Execução de `dotnet build`, concluída com sucesso.
- Consulta à API de cursos.
- Verificação do filtro por categoria.
- Verificação da combinação de categoria e modalidade.
- Pesquisa por nome.
- Filtro por status.
- Inspeção do layout dos cartões no navegador.
- Teste da interface em largura de celular.
- Teste da abertura dos detalhes e do retorno à lista.
- Verificação dos recursos de imagem disponíveis no projeto.

## 7. Erro identificado e correção

Um dos problemas identificados ocorreu quando o frontend tentava carregar imagens JPG que não estavam presentes na pasta pública do projeto.

O navegador retornava `404 (Not Found)` para essas URLs.

Para corrigir o problema, foi executada uma listagem dos arquivos disponíveis em `wwwroot/images` e uma busca por imagens na pasta Downloads. Depois disso, as referências do frontend foram ajustadas para utilizar os arquivos encontrados.

Essa correção permitiu exibir imagens disponíveis, embora ainda não existam imagens individuais para cada curso.

## 8. Participação humana

As sugestões foram revisadas e aplicadas durante o desenvolvimento, com execução dos comandos, inspeção dos arquivos e testes no navegador.

A comparação com o protótipo, as decisões de interface e a validação final continuam dependendo da avaliação humana.

## 9. Limitações

A IA pode sugerir código ou caminhos de arquivos que não correspondam ao estado real do projeto. Por isso, foi necessário verificar os arquivos existentes e corrigir sugestões incompatíveis.

A documentação deve ser atualizada se houver mudanças nos recursos visuais, na API, na estrutura do projeto ou no ambiente de publicação.
