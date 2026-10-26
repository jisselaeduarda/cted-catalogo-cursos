using CTED.CatalogoCursos.Data;
using CTED.CatalogoCursos.Models;
using CTED.CatalogoCursos.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Tests;

public class CursoServiceTests
{
    [Fact]
    public async Task ListarAsync_AplicaBuscaSemAcentoEFiltros()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<CursoDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var context = new CursoDbContext(options);
        await context.Database.EnsureCreatedAsync();

        context.Cursos.AddRange(
            new Curso
            {
                NomeCompleto = "Introdução à Indústria 4.0",
                NomeResumido = "Indústria 4.0",
                Descricao = "Curso teste",
                Categoria = "Tecnologia",
                Modalidade = "Online",
                CargaHoraria = 20,
                PublicoAlvo = "Iniciantes",
                Status = "Disponível",
                ImagemUrl = "/assets/images/industria-4-0.jpg"
            },
            new Curso
            {
                NomeCompleto = "Gestão da Qualidade Industrial",
                NomeResumido = "Qualidade Industrial",
                Descricao = "Curso teste",
                Categoria = "Gestão",
                Modalidade = "Online",
                CargaHoraria = 24,
                PublicoAlvo = "Líderes",
                Status = "Encerrado",
                ImagemUrl = "/assets/images/qualidade.jpg"
            });
        await context.SaveChangesAsync();

        var service = new CursoService(context);
        var resultado = await service.ListarAsync(
            "industria",
            "Tecnologia",
            "Online",
            "Disponível");

        var curso = Assert.Single(resultado);
        Assert.Equal("Introdução à Indústria 4.0", curso.NomeCompleto);
    }

    [Fact]
    public async Task ObterPorIdAsync_RetornaModulosEAulasOrdenados()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<CursoDbContext>()
            .UseSqlite(connection)
            .Options;

        await using var context = new CursoDbContext(options);
        await context.Database.EnsureCreatedAsync();

        var curso = new Curso
        {
            NomeCompleto = "Curso de teste",
            NomeResumido = "Teste",
            Descricao = "Curso teste",
            Categoria = "Tecnologia",
            Modalidade = "Online",
            CargaHoraria = 10,
            PublicoAlvo = "Teste",
            Status = "Disponível",
            ImagemUrl = "/assets/images/hero-image.png",
            Modulos =
            [
                new Modulo
                {
                    Ordem = 1,
                    Titulo = "Módulo 1",
                    Aulas =
                    [
                        new Aula { Ordem = 2, Titulo = "Aula 2", Descricao = "Segunda" },
                        new Aula { Ordem = 1, Titulo = "Aula 1", Descricao = "Primeira" }
                    ]
                }
            ]
        };

        context.Cursos.Add(curso);
        await context.SaveChangesAsync();

        var service = new CursoService(context);
        var resultado = await service.ObterPorIdAsync(curso.Id);

        Assert.NotNull(resultado);
        var modulo = Assert.Single(resultado.Modulos);
        Assert.Equal("Aula 1", modulo.Aulas[0].Titulo);
        Assert.Equal("Aula 2", modulo.Aulas[1].Titulo);
    }
}
