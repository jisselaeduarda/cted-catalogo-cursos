using CTED.CatalogoCursos.Data;
using CTED.CatalogoCursos.Endpoints;
using CTED.CatalogoCursos.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuração da documentação da API.
builder.Services.AddOpenApi();

// Configuração do banco SQLite.
builder.Services.AddDbContext<CursoDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("ConexaoCursos")));

// Registro dos serviços.
builder.Services.AddScoped<CursoService>();

var app = builder.Build();

// Aplica as migrações e cadastra os cursos iniciais.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CursoDbContext>();

    db.Database.Migrate();

    await CursoDadosIniciais.InserirCursosAsync(db);
    await CursoConteudoInicial.InserirConteudoAsync(db);
}

// Disponibiliza a documentação no ambiente de desenvolvimento.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Disponibiliza os arquivos do frontend em wwwroot.
app.UseDefaultFiles();
app.UseStaticFiles();

// Registra as rotas da API em um arquivo separado.
app.MapCursoEndpoints();

app.Run();