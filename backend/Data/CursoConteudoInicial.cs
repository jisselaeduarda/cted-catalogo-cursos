using System.Collections.Generic;
using System.Linq;
using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Data;

public static class CursoConteudoInicial
{
    public static async Task InserirConteudoAsync(CursoDbContext db)
    {
        var cursos = await db.Cursos
            .Include(curso => curso.Modulos)
            .ToListAsync();

        var conteudos = new Dictionary<string, string[][]>
        {
            ["Introdução à Indústria 4.0"] = new[]
            {
                new[] { "Fundamentos da Indústria 4.0", "Evolução industrial", "Transformação digital" },
                new[] { "Tecnologias habilitadoras", "Internet das Coisas", "Inteligência artificial e dados" },
                new[] { "Aplicações industriais", "Fábricas inteligentes", "Desafios da transformação" }
            },
            ["Fundamentos de Segurança do Trabalho"] = new[]
            {
                new[] { "Introdução à segurança", "Conceitos básicos", "Perigos e riscos" },
                new[] { "Prevenção de acidentes", "Equipamentos de proteção", "Sinalização de segurança" },
                new[] { "Conduta segura", "Organização do ambiente", "Resposta a emergências" }
            },
            ["Excel Aplicado à Produção"] = new[]
            {
                new[] { "Organização de planilhas", "Pastas, planilhas e células", "Organização de dados" },
                new[] { "Fórmulas e recursos", "Fórmulas essenciais", "Filtros e classificação" },
                new[] { "Indicadores de produção", "Gráficos e relatórios", "Análise de resultados" }
            },
            ["Automação de Processos Industriais"] = new[]
            {
                new[] { "Fundamentos da automação", "Conceitos e aplicações", "Componentes de sistemas" },
                new[] { "Sensores e controle", "Sensores industriais", "Controladores e atuadores" },
                new[] { "Aplicações industriais", "Fluxos de operação", "Monitoramento e segurança" }
            },
            ["Gestão da Qualidade Industrial"] = new[]
            {
                new[] { "Fundamentos da qualidade", "Qualidade nos processos", "Requisitos e padrões" },
                new[] { "Ferramentas da qualidade", "Diagrama de causa e efeito", "Folha de verificação" },
                new[] { "Melhoria contínua", "Não conformidades", "Planos de ação" }
            },
            ["Boas Práticas de Manutenção"] = new[]
            {
                new[] { "Fundamentos da manutenção", "Tipos de manutenção", "Planejamento de atividades" },
                new[] { "Inspeção e prevenção", "Inspeções de rotina", "Registros de manutenção" },
                new[] { "Execução segura", "Preparação do equipamento", "Verificação após o serviço" }
            }
        };

        foreach (var curso in cursos)
        {
            if (curso.Modulos.Count > 0)
                continue;

            if (!conteudos.TryGetValue(curso.NomeCompleto, out var modulos))
                continue;

            for (int i = 0; i < modulos.Length; i++)
            {
                var dados = modulos[i];

                curso.Modulos.Add(new Modulo
                {
                    Ordem = i + 1,
                    Titulo = dados[0],
                    Aulas = new List<Aula>
                    {
                        new()
                        {
                            Ordem = 1,
                            Titulo = dados[1],
                            Descricao = $"Conheça os conceitos de {dados[1]} e sua aplicação no contexto do curso."
                        },
                        new()
                        {
                            Ordem = 2,
                            Titulo = dados[2],
                            Descricao = $"Explore exemplos práticos de {dados[2]} e sua importância para a formação."
                        }
                    }
                });
            }
        }

        await db.SaveChangesAsync();
    }
}