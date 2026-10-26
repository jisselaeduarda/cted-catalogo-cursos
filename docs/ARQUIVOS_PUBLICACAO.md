# Arquivos de Publicação

## Objetivo

Registrar como gerar o pacote de publicação da aplicação CTED — Catálogo de Cursos e quais arquivos fazem parte do artefato final.

## Gerar o publish

Na raiz do repositório:

```bash
dotnet publish backend/CTED.CatalogoCursos.csproj \
  --configuration Release \
  --output ./publish \
  /p:UseAppHost=false
```

O projeto do backend copia automaticamente o conteúdo de `frontend/` para `publish/wwwroot/`.

## Conteúdo esperado

O diretório `publish/` contém, entre outros arquivos gerados pelo .NET:

```text
publish/
├── CTED.CatalogoCursos.dll
├── CTED.CatalogoCursos.deps.json
├── CTED.CatalogoCursos.runtimeconfig.json
├── appsettings.json
├── *.dll                       # dependências da aplicação
└── wwwroot/
    ├── index.html
    ├── curso.html
    ├── assets/
    │   └── images/
    ├── css/
    │   ├── styles.css
    │   └── catalog.css
    └── js/
        ├── api.js
        ├── ui.js
        ├── catalogo.js
        └── curso.js
```

A lista exata de DLLs é determinada pelo `dotnet publish` e pelas dependências do projeto.

## Gerar ZIP manualmente

Linux/macOS:

```bash
cd publish
zip -r ../cted-catalogo-cursos-publish.zip .
cd ..
```

Windows PowerShell:

```powershell
Compress-Archive -Path .\publish\* -DestinationPath .\cted-catalogo-cursos-publish.zip -Force
```

## ZIP gerado pela CI

O workflow do GitHub Actions também gera o arquivo:

```text
cted-catalogo-cursos-publish.zip
```

Ele é disponibilizado como artifact da execução da CI com o nome:

```text
cted-catalogo-cursos-publish
```

## Arquivos que não devem entrar no pacote

Não devem ser adicionados manualmente ao ZIP:

- `.git/`;
- `.github/`;
- `bin/`;
- `obj/`;
- banco SQLite local (`*.db`, `*.db-shm`, `*.db-wal`);
- `.env`;
- secrets;
- arquivos de backup;
- arquivos temporários de editor.

## Banco em ambiente publicado

O arquivo SQLite não é versionado nem incluído no ZIP. Na primeira inicialização, a aplicação aplica as migrations e cria/popula a base conforme a connection string configurada.

Em uma hospedagem pública é necessário verificar se o filesystem é persistente. Caso a plataforma use armazenamento efêmero, o banco poderá ser recriado após reinícios/deploys. Essa limitação deve ser considerada na escolha da hospedagem.

## Validação

Antes de entregar o ZIP:

1. execute `dotnet publish`;
2. execute a aplicação a partir do publish, quando possível;
3. confirme que `wwwroot/` está presente;
4. confirme que nenhum secret ou banco local foi incluído;
5. gere o ZIP;
6. valide que o arquivo pode ser extraído normalmente.
