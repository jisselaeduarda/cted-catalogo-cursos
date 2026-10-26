using System.Globalization;
using System.Text;
using CTED.CatalogoCursos.Data;
using CTED.CatalogoCursos.DTOs;
using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Services;

public class CursoService
{
    private readonly CursoDbContext _context;

    public CursoService(CursoDbContext context)
    {
        _context = context;
    }

    public async Task<List<CursoResumoResponse>> ListarAsync(
        string? busca,
        string? categoria,
        string? modalidade,
        string? status)
    {
        var consulta = _context.Cursos.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(categoria))
        {
            consulta = consulta.Where(curso => curso.Categoria == categoria);
        }

        if (!string.IsNullOrWhiteSpace(modalidade))
        {
            consulta = consulta.Where(curso => curso.Modalidade == modalidade);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            consulta = consulta.Where(curso => curso.Status == status);
        }

        var cursos = await consulta
            .OrderBy(curso => curso.Id)
            .Select(curso => new CursoResumoResponse(
                curso.Id,
                curso.NomeCompleto,
                curso.NomeResumido,
                curso.Descricao,
                curso.Categoria,
                curso.Modalidade,
                curso.CargaHoraria,
                curso.PublicoAlvo,
                curso.Status,
                curso.ImagemUrl,
                curso.DataDisponibilidade))
            .ToListAsync();

        if (string.IsNullOrWhiteSpace(busca))
        {
            return cursos;
        }

        var termo = RemoverAcentos(busca.Trim());

        return cursos
            .Where(curso =>
                RemoverAcentos(curso.NomeCompleto)
                    .Contains(termo, StringComparison.OrdinalIgnoreCase) ||
                RemoverAcentos(curso.NomeResumido)
                    .Contains(termo, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<CursoDetalheResponse?> ObterPorIdAsync(int id)
    {
        var curso = await _context.Cursos
            .AsNoTracking()
            .Include(item => item.Modulos)
                .ThenInclude(modulo => modulo.Aulas)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (curso is null)
        {
            return null;
        }

        var modulos = curso.Modulos
            .OrderBy(modulo => modulo.Ordem)
            .Select(modulo => new ModuloResponse(
                modulo.Id,
                modulo.Titulo,
                modulo.Ordem,
                modulo.Aulas
                    .OrderBy(aula => aula.Ordem)
                    .Select(aula => new AulaResponse(
                        aula.Id,
                        aula.Titulo,
                        aula.Descricao,
                        aula.Ordem))
                    .ToList()))
            .ToList();

        return new CursoDetalheResponse(
            curso.Id,
            curso.NomeCompleto,
            curso.NomeResumido,
            curso.Descricao,
            curso.Categoria,
            curso.Modalidade,
            curso.CargaHoraria,
            curso.PublicoAlvo,
            curso.Status,
            curso.ImagemUrl,
            curso.DataDisponibilidade,
            modulos);
    }

    private static string RemoverAcentos(string texto)
    {
        var normalizado = texto.Normalize(NormalizationForm.FormD);
        var caracteres = normalizado.Where(caractere =>
            CharUnicodeInfo.GetUnicodeCategory(caractere) != UnicodeCategory.NonSpacingMark);

        return string.Concat(caracteres).Normalize(NormalizationForm.FormC);
    }
}
