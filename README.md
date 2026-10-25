cat >> README.md <<'EOF'

## Validação atualizada — 25/10/2026

Verificações confirmadas nesta etapa:

- `dotnet build`: compilação concluída com sucesso.
- `GET /api/cursos`: resposta HTTP 200 com os seis cursos.
- `GET /api/cursos/1`: resposta HTTP 200 com os dados do curso.
- `GET /api/cursos/6`: resposta correta para Boas Práticas de Manutenção.
- Status do sexto curso corrigido para `Em breve` no banco existente.
- Página inicial e página de detalhes abertas normalmente no navegador.
- Migração de módulos e aulas aplicada ao SQLite.

Pendências conhecidas:

- Os módulos e as aulas ainda não estão cadastrados nos cursos.
- O conteúdo programático precisa ser validado antes de ser apresentado como oficial.
- A publicação da aplicação na internet e a revisão final dos requisitos de entrega ainda precisam ser verificadas.
EOF