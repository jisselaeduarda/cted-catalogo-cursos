using CTED.CatalogoCursos.Data;
using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;

namespace CTED.CatalogoCursos.Services;

public class CursoService
{
    private readonly CursoDbContext _context;

    public CursoService(CursoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Curso>> ListarTodosAsync(
        string? busca,
        string? categoria,
        string? modalidade,
        string? status)
    {
        var consulta = CriarConsultaCompleta();

        if (!string.IsNullOrWhiteSpace(categoria))
        {
            consulta = consulta.Where(c => c.Categoria == categoria);
        }

        if (!string.IsNullOrWhiteSpace(modalidade))
        {
            consulta = consulta.Where(c => c.Modalidade == modalidade);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            consulta = consulta.Where(c => c.Status == status);
        }

        var cursos = await consulta.ToListAsync();

        if (!string.IsNullOrWhiteSpace(busca))
        {
            var termoBusca = RemoverAcentos(busca.Trim());

            cursos = cursos.Where(c =>
                RemoverAcentos(c.NomeCompleto)
                    .Contains(termoBusca, StringComparison.OrdinalIgnoreCase) ||
                RemoverAcentos(c.NomeResumido)
                    .Contains(termoBusca, StringComparison.OrdinalIgnoreCase)
            ).ToList();
        }

        OrdenarConteudo(cursos);

        return cursos;
    }

    public async Task<Curso?> ObterPorIdAsync(int id)
    {
        var curso = await CriarConsultaCompleta()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (curso is not null)
        {
            OrdenarConteudo(new[] { curso });
        }

        return curso;
    }

    private IQueryable<Curso> CriarConsultaCompleta()
    {
        return _context.Cursos
            .AsNoTracking()
            .Include(curso => curso.Modulos)
                .ThenInclude(modulo => modulo.Aulas);
    }

    private static void OrdenarConteudo(IEnumerable<Curso> cursos)
    {
        foreach (var curso in cursos)
        {
            curso.Modulos = curso.Modulos
                .OrderBy(modulo => modulo.Ordem)
                .ToList();

            foreach (var modulo in curso.Modulos)
            {
                modulo.Aulas = modulo.Aulas
                    .OrderBy(aula => aula.Ordem)
                    .ToList();
            }
        }
    }

    private static string RemoverAcentos(string texto)
    {
        var normalizado = texto.Normalize(NormalizationForm.FormD);

        var resultado = string.Concat(
            normalizado.Where(caractere =>
                CharUnicodeInfo.GetUnicodeCategory(caractere)
                != UnicodeCategory.NonSpacingMark)
        );

        return resultado.Normalize(NormalizationForm.FormC);
    }
}