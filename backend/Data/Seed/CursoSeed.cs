using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Data.Seed;

public static class CursoSeed
{
    public static async Task InserirAsync(CursoDbContext db)
    {
        var definicoes = CriarCursos();
        var existentes = await db.Cursos
            .Include(curso => curso.Modulos)
                .ThenInclude(modulo => modulo.Aulas)
            .ToListAsync();

        foreach (var definicao in definicoes)
        {
            var existente = existentes.FirstOrDefault(curso =>
                curso.NomeCompleto == definicao.NomeCompleto);

            if (existente is null)
            {
                db.Cursos.Add(definicao);
                continue;
            }

            existente.NomeResumido = definicao.NomeResumido;
            existente.Descricao = definicao.Descricao;
            existente.Categoria = definicao.Categoria;
            existente.Modalidade = definicao.Modalidade;
            existente.CargaHoraria = definicao.CargaHoraria;
            existente.PublicoAlvo = definicao.PublicoAlvo;
            existente.Status = definicao.Status;
            existente.ImagemUrl = definicao.ImagemUrl;
            existente.DataDisponibilidade = definicao.DataDisponibilidade;

            if (existente.Modulos.Count == 0)
            {
                existente.Modulos = ClonarModulos(definicao.Modulos);
            }
        }

        await db.SaveChangesAsync();
    }

    private static List<Curso> CriarCursos() =>
    [
        new Curso
        {
            NomeCompleto = "Introdução à Indústria 4.0",
            NomeResumido = "Indústria 4.0",
            Descricao = "Conheça as tecnologias da transformação digital na indústria.",
            Categoria = "Tecnologia",
            Modalidade = "Online",
            CargaHoraria = 20,
            PublicoAlvo = "Iniciantes",
            Status = "Disponível",
            ImagemUrl = "/assets/images/industria-4-0.jpg",
            Modulos =
            [
                CriarModulo(1, "Fundamentos da Indústria 4.0",
                    ("Evolução industrial", "Entenda a evolução dos modelos industriais até a Indústria 4.0."),
                    ("Transformação digital", "Conheça como tecnologias digitais modificam processos produtivos.")),
                CriarModulo(2, "Tecnologias habilitadoras",
                    ("Internet das Coisas", "Veja como sensores e dispositivos conectados apoiam a indústria."),
                    ("Inteligência artificial e dados", "Conheça aplicações de dados e IA no contexto industrial.")),
                CriarModulo(3, "Aplicações industriais",
                    ("Fábricas inteligentes", "Explore exemplos de integração entre pessoas, máquinas e sistemas."),
                    ("Desafios da transformação", "Identifique cuidados e desafios da adoção de novas tecnologias."))
            ]
        },
        new Curso
        {
            NomeCompleto = "Fundamentos de Segurança do Trabalho",
            NomeResumido = "Segurança do Trabalho",
            Descricao = "Aprenda princípios básicos de prevenção de acidentes.",
            Categoria = "Segurança",
            Modalidade = "Presencial",
            CargaHoraria = 16,
            PublicoAlvo = "Trabalhadores da indústria",
            Status = "Disponível",
            ImagemUrl = "/assets/images/seguranca.jpg",
            Modulos =
            [
                CriarModulo(1, "Introdução à segurança",
                    ("Conceitos básicos", "Conheça os principais conceitos usados em segurança do trabalho."),
                    ("Perigos e riscos", "Aprenda a diferenciar perigos, riscos e medidas preventivas.")),
                CriarModulo(2, "Prevenção de acidentes",
                    ("Equipamentos de proteção", "Entenda o papel dos equipamentos de proteção no ambiente industrial."),
                    ("Sinalização de segurança", "Reconheça sinalizações e orientações comuns de segurança.")),
                CriarModulo(3, "Conduta segura",
                    ("Organização do ambiente", "Veja práticas que ajudam a manter o ambiente de trabalho seguro."),
                    ("Resposta a emergências", "Conheça princípios básicos de atuação diante de emergências."))
            ]
        },
        new Curso
        {
            NomeCompleto = "Excel Aplicado à Produção",
            NomeResumido = "Excel na Produção",
            Descricao = "Utilize planilhas para organizar dados e indicadores.",
            Categoria = "Gestão",
            Modalidade = "Online",
            CargaHoraria = 12,
            PublicoAlvo = "Profissionais administrativos",
            Status = "Em breve",
            ImagemUrl = "/assets/images/excel-producao.jpg",
            DataDisponibilidade = new DateTime(2026, 11, 10, 0, 0, 0, DateTimeKind.Utc),
            Modulos =
            [
                CriarModulo(1, "Organização de planilhas",
                    ("Pastas, planilhas e células", "Revise a estrutura básica usada para organizar informações no Excel."),
                    ("Organização de dados", "Aprenda práticas simples para estruturar dados de produção.")),
                CriarModulo(2, "Fórmulas e recursos",
                    ("Fórmulas essenciais", "Utilize fórmulas básicas para automatizar cálculos do dia a dia."),
                    ("Filtros e classificação", "Organize listas usando filtros e ordenação.")),
                CriarModulo(3, "Indicadores de produção",
                    ("Gráficos e relatórios", "Transforme dados em visualizações simples para acompanhamento."),
                    ("Análise de resultados", "Interprete indicadores básicos para apoiar decisões."))
            ]
        },
        new Curso
        {
            NomeCompleto = "Automação de Processos Industriais",
            NomeResumido = "Automação Industrial",
            Descricao = "Explore conceitos de sensores, controle e automação.",
            Categoria = "Tecnologia",
            Modalidade = "Presencial",
            CargaHoraria = 40,
            PublicoAlvo = "Técnicos e estudantes",
            Status = "Disponível",
            ImagemUrl = "/assets/images/automacao.jpg",
            Modulos =
            [
                CriarModulo(1, "Fundamentos da automação",
                    ("Conceitos e aplicações", "Conheça os objetivos e aplicações da automação industrial."),
                    ("Componentes de sistemas", "Identifique componentes comuns em sistemas automatizados.")),
                CriarModulo(2, "Sensores e controle",
                    ("Sensores industriais", "Entenda como sensores coletam informações de processos."),
                    ("Controladores e atuadores", "Conheça a função de controladores e atuadores.")),
                CriarModulo(3, "Aplicações industriais",
                    ("Fluxos de operação", "Observe como elementos automatizados se integram em um processo."),
                    ("Monitoramento e segurança", "Veja cuidados de monitoramento e operação segura."))
            ]
        },
        new Curso
        {
            NomeCompleto = "Gestão da Qualidade Industrial",
            NomeResumido = "Qualidade Industrial",
            Descricao = "Conheça ferramentas para melhorar processos e resultados.",
            Categoria = "Gestão",
            Modalidade = "Online",
            CargaHoraria = 24,
            PublicoAlvo = "Líderes e equipes de produção",
            Status = "Encerrado",
            ImagemUrl = "/assets/images/qualidade.jpg",
            Modulos =
            [
                CriarModulo(1, "Fundamentos da qualidade",
                    ("Qualidade nos processos", "Entenda a importância da qualidade ao longo do processo produtivo."),
                    ("Requisitos e padrões", "Conheça a função de requisitos e padrões organizacionais.")),
                CriarModulo(2, "Ferramentas da qualidade",
                    ("Diagrama de causa e efeito", "Use a ferramenta para organizar possíveis causas de problemas."),
                    ("Folha de verificação", "Aprenda a registrar ocorrências de forma estruturada.")),
                CriarModulo(3, "Melhoria contínua",
                    ("Não conformidades", "Identifique e registre desvios de processo."),
                    ("Planos de ação", "Estruture ações simples para tratar problemas identificados."))
            ]
        },
        new Curso
        {
            NomeCompleto = "Boas Práticas de Manutenção",
            NomeResumido = "Manutenção Industrial",
            Descricao = "Aprenda conceitos de manutenção preventiva de equipamentos.",
            Categoria = "Segurança",
            Modalidade = "Presencial",
            CargaHoraria = 32,
            PublicoAlvo = "Profissionais de manutenção",
            Status = "Em breve",
            ImagemUrl = "/assets/images/manutencao.jpg",
            DataDisponibilidade = new DateTime(2026, 12, 1, 0, 0, 0, DateTimeKind.Utc),
            Modulos =
            [
                CriarModulo(1, "Fundamentos da manutenção",
                    ("Tipos de manutenção", "Conheça diferenças entre manutenção corretiva, preventiva e preditiva."),
                    ("Planejamento de atividades", "Veja como organizar intervenções de manutenção.")),
                CriarModulo(2, "Inspeção e prevenção",
                    ("Inspeções de rotina", "Aprenda o papel das inspeções periódicas na prevenção de falhas."),
                    ("Registros de manutenção", "Entenda a importância de registrar intervenções e ocorrências.")),
                CriarModulo(3, "Execução segura",
                    ("Preparação do equipamento", "Conheça cuidados básicos antes de iniciar uma intervenção."),
                    ("Verificação após o serviço", "Revise passos para conferir o equipamento antes da liberação."))
            ]
        }
    ];

    private static Modulo CriarModulo(
        int ordem,
        string titulo,
        params (string Titulo, string Descricao)[] aulas)
    {
        return new Modulo
        {
            Ordem = ordem,
            Titulo = titulo,
            Aulas = aulas
                .Select((aula, indice) => new Aula
                {
                    Ordem = indice + 1,
                    Titulo = aula.Titulo,
                    Descricao = aula.Descricao
                })
                .ToList()
        };
    }

    private static List<Modulo> ClonarModulos(IEnumerable<Modulo> modulos)
    {
        return modulos
            .Select(modulo => new Modulo
            {
                Ordem = modulo.Ordem,
                Titulo = modulo.Titulo,
                Aulas = modulo.Aulas
                    .Select(aula => new Aula
                    {
                        Ordem = aula.Ordem,
                        Titulo = aula.Titulo,
                        Descricao = aula.Descricao
                    })
                    .ToList()
            })
            .ToList();
    }
}
