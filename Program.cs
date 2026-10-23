using CTED.CatalogoCursos.Services;
using CTED.CatalogoCursos.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<CursoDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("ConexaoCursos")));

builder.Services.AddScoped<CursoService>();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CursoDbContext>();
    db.Database.Migrate();

    await CursoDadosIniciais.InserirCursosAsync(db);
}
// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/cursos", async (
    [Microsoft.AspNetCore.Mvc.FromServices] CursoService service,
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



var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}