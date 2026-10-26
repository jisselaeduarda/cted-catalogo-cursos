namespace CTED.CatalogoCursos.Models;

public class Aula
{
    public int Id { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public string Descricao { get; set; } = string.Empty;

    public int Ordem { get; set; }

    public int ModuloId { get; set; }
}