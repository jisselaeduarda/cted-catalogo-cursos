using CTED.CatalogoCursos.Services;

namespace CTED.CatalogoCursos.Endpoints;

public static class CursoEndpoints
{
    public static IEndpointRouteBuilder MapCursoEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/cursos", async (
            CursoService service,
            string? busca,
            string? categoria,
            string? modalidade,
            string? status) =>
        {
            var cursos = await service.ListarTodosAsync(
                busca,
                categoria,
                modalidade,
                status);

            return Results.Ok(cursos);
        });

        endpoints.MapGet("/api/cursos/{id:int}", async (
            CursoService service,
            int id) =>
        {
            var curso = await service.ObterPorIdAsync(id);

            return curso is null
                ? Results.NotFound()
                : Results.Ok(curso);
        });

        return endpoints;
    }
}
