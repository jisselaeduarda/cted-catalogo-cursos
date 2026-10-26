using CTED.CatalogoCursos.Services;

namespace CTED.CatalogoCursos.Endpoints;

public static class CursoEndpoints
{
    public static IEndpointRouteBuilder MapCursoEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var grupo = endpoints.MapGroup("/api/cursos");

        grupo.MapGet("/", async (
            CursoService service,
            string? busca,
            string? categoria,
            string? modalidade,
            string? status) =>
        {
            var cursos = await service.ListarAsync(busca, categoria, modalidade, status);
            return Results.Ok(cursos);
        });

        grupo.MapGet("/{id:int}", async (CursoService service, int id) =>
        {
            var curso = await service.ObterPorIdAsync(id);

            return curso is null
                ? Results.NotFound()
                : Results.Ok(curso);
        });

        return endpoints;
    }
}
