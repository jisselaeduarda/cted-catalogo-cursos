namespace CTED.CatalogoCursos.Models;

public class Modulo
{
    public int Id { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public int Ordem { get; set; }

    public int CursoId { get; set; }

    public List<Aula> Aulas { get; set; } = new();
}