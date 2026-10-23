
using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Data;

public static class CursoDadosIniciais
{
    public static async Task InserirCursosAsync(CursoDbContext db)
    {
        if (await db.Cursos.AnyAsync())
        {
            return;
        }

        var cursos = new List<Curso>
        {
            new()
            {
                NomeCompleto = "Introdução à Indústria 4.0",
                NomeResumido = "Indústria 4.0",
                Descricao = "Conheça as tecnologias da transformação digital na indústria.",
                Categoria = "Tecnologia",
                Modalidade = "Online",
                CargaHoraria = 20,
                PublicoAlvo = "Iniciantes",
                Status = "Disponível",
                ImagemUrl = "/images/industria-4-0.jpg"
            },
            new()
            {
                NomeCompleto = "Fundamentos de Segurança do Trabalho",
                NomeResumido = "Segurança do Trabalho",
                Descricao = "Aprenda princípios básicos de prevenção de acidentes.",
                Categoria = "Segurança",
                Modalidade = "Presencial",
                CargaHoraria = 16,
                PublicoAlvo = "Trabalhadores da indústria",
                Status = "Disponível",
                ImagemUrl = "/images/seguranca.jpg"
            },
            new()
            {
                NomeCompleto = "Excel Aplicado à Produção",
                NomeResumido = "Excel na Produção",
                Descricao = "Utilize planilhas para organizar dados e indicadores.",
                Categoria = "Gestão",
                Modalidade = "Online",
                CargaHoraria = 12,
                PublicoAlvo = "Profissionais administrativos",
                Status = "Em breve",
                ImagemUrl = "/images/excel-producao.jpg"
            },
            new()
            {
                NomeCompleto = "Automação de Processos Industriais",
                NomeResumido = "Automação Industrial",
                Descricao = "Explore conceitos de sensores, controle e automação.",
                Categoria = "Tecnologia",
                Modalidade = "Presencial",
                CargaHoraria = 40,
                PublicoAlvo = "Técnicos e estudantes",
                Status = "Disponível",
                ImagemUrl = "/images/automacao.jpg"
            },
            new()
            {
                NomeCompleto = "Gestão da Qualidade Industrial",
                NomeResumido = "Qualidade Industrial",
                Descricao = "Conheça ferramentas para melhorar processos e resultados.",
                Categoria = "Gestão",
                Modalidade = "Online",
                CargaHoraria = 24,
                PublicoAlvo = "Líderes e equipes de produção",
                Status = "Encerrado",
                ImagemUrl = "/images/qualidade.jpg"
            },
            new()
            {
                NomeCompleto = "Boas Práticas de Manutenção",
                NomeResumido = "Manutenção Industrial",
                Descricao = "Aprenda conceitos de manutenção preventiva de equipamentos.",
                Categoria = "Segurança",
                Modalidade = "Presencial",
                CargaHoraria = 32,
                PublicoAlvo = "Profissionais de manutenção",
                Status = "Em breve",
                ImagemUrl = "/images/manutencao.jpg"
            }
        };

        db.Cursos.AddRange(cursos);
        await db.SaveChangesAsync();
    }
}
