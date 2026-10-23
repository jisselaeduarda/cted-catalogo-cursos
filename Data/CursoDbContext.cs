using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Data;

public class CursoDbContext : DbContext
{
    public CursoDbContext(DbContextOptions<CursoDbContext> options)
        : base(options)
    {
    }

    public DbSet<Curso> Cursos { get; set; }
}