namespace CTED.CatalogoCursos.DTOs;

public sealed record CursoResumoResponse(
    int Id,
    string NomeCompleto,
    string NomeResumido,
    string Descricao,
    string Categoria,
    string Modalidade,
    int CargaHoraria,
    string PublicoAlvo,
    string Status,
    string ImagemUrl,
    DateTime? DataDisponibilidade);

public sealed record CursoDetalheResponse(
    int Id,
    string NomeCompleto,
    string NomeResumido,
    string Descricao,
    string Categoria,
    string Modalidade,
    int CargaHoraria,
    string PublicoAlvo,
    string Status,
    string ImagemUrl,
    DateTime? DataDisponibilidade,
    IReadOnlyList<ModuloResponse> Modulos);

public sealed record ModuloResponse(
    int Id,
    string Titulo,
    int Ordem,
    IReadOnlyList<AulaResponse> Aulas);

public sealed record AulaResponse(
    int Id,
    string Titulo,
    string Descricao,
    int Ordem);
