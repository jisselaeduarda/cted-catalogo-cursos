namespace CTED.CatalogoCursos.Models;

public class Curso
{
    public int Id { get; set; }

    public string NomeCompleto { get; set; } = string.Empty;

    public string NomeResumido { get; set; } = string.Empty;

    public string Descricao { get; set; } = string.Empty;

    public string Categoria { get; set; } = string.Empty;

    public string Modalidade { get; set; } = string.Empty;

    public int CargaHoraria { get; set; }

    public string PublicoAlvo { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string ImagemUrl { get; set; } = string.Empty;

    public DateTime? DataDisponibilidade { get; set; }
}