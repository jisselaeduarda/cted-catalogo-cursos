using CTED.CatalogoCursos.Data;
using CTED.CatalogoCursos.Endpoints;
using CTED.CatalogoCursos.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var configuredConnection = builder.Configuration.GetConnectionString("ConexaoCursos")
    ?? "Data Source=cursos.db";
var connectionBuilder = new SqliteConnectionStringBuilder(configuredConnection);

if (!Path.IsPathRooted(connectionBuilder.DataSource))
{
    connectionBuilder.DataSource = Path.GetFullPath(
        Path.Combine(builder.Environment.ContentRootPath, connectionBuilder.DataSource));
}

builder.Services.AddDbContext<CursoDbContext>(options =>
    options.UseSqlite(connectionBuilder.ToString()));

builder.Services.AddScoped<CursoService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CursoDbContext>();
    db.Database.Migrate();
    await CursoDadosIniciais.InserirCursosAsync(db);
    await CursoConteudoInicial.InserirConteudoAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var developmentFrontendPath = Path.GetFullPath(
    Path.Combine(app.Environment.ContentRootPath, "..", "frontend"));
var frontendPath = Directory.Exists(developmentFrontendPath)
    ? developmentFrontendPath
    : app.Environment.WebRootPath;

if (string.IsNullOrWhiteSpace(frontendPath) || !Directory.Exists(frontendPath))
{
    throw new DirectoryNotFoundException("Não foi possível localizar os arquivos do frontend.");
}

var frontendProvider = new PhysicalFileProvider(frontendPath);
app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = frontendProvider });
app.UseStaticFiles(new StaticFileOptions { FileProvider = frontendProvider });

app.MapCursoEndpoints();

app.Run();
