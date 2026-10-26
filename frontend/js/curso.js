import { obterCurso } from './api.js';
import { configurarNavegacao, escapeHtml, formatarData, mostrarToast } from './ui.js';

const root = document.querySelector('#course-detail-root');
const id = Number(new URLSearchParams(window.location.search).get('id'));

function renderizarAulas(aulas) {
  if (!aulas?.length) {
    return '<p class="module-empty">As aulas deste módulo ainda não foram detalhadas.</p>';
  }

  return `<ol class="lesson-list">${aulas.map(aula => `
    <li>
      <span class="lesson-mark" aria-hidden="true">▶</span>
      <div>
        <strong>${escapeHtml(aula.titulo)}</strong>
        <p>${escapeHtml(aula.descricao)}</p>
      </div>
    </li>`).join('')}</ol>`;
}

function renderizarModulos(modulos) {
  if (!modulos?.length) {
    return '<p class="detail-description">Os módulos deste curso ainda não foram detalhados.</p>';
  }

  return `<div class="module-list">${modulos.map((modulo, index) => `
    <details class="course-accordion module-card" ${index === 0 ? 'open' : ''}>
      <summary class="module-title-row">
        <span class="module-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="module-summary-title">${escapeHtml(modulo.titulo)}</span>
        <span class="module-count">${modulo.aulas.length} ${modulo.aulas.length === 1 ? 'aula' : 'aulas'}</span>
      </summary>
      ${renderizarAulas(modulo.aulas)}
    </details>`).join('')}</div>`;
}

function renderizarCurso(curso) {
  const dataDisponibilidade = formatarData(curso.dataDisponibilidade);
  const imagem = curso.imagemUrl || '/assets/images/video-thumb.png';

  root.innerHTML = `
    <div class="detail-brandline">
      <span class="detail-brand-label">SESI <b>+</b> INDÚSTRIA</span>
      <a class="detail-back" href="/index.html#cursos">← Voltar ao catálogo</a>
    </div>

    <section class="detail-main-grid" aria-labelledby="course-title">
      <div class="detail-intro">
        <span class="detail-status">${escapeHtml(curso.status)}</span>
        <p class="detail-category">${escapeHtml(curso.categoria)}</p>
        <h1 id="course-title">${escapeHtml(curso.nomeCompleto)}</h1>

        <div class="detail-meta-grid">
          <span class="detail-meta-item">
            <span class="detail-meta-icon" aria-hidden="true">◷</span>
            <span><small>Carga horária</small><strong>${curso.cargaHoraria} horas</strong></span>
          </span>
          <span class="detail-meta-item">
            <span class="detail-meta-icon" aria-hidden="true">▣</span>
            <span><small>Modalidade</small><strong>${escapeHtml(curso.modalidade)}</strong></span>
          </span>
        </div>

        ${dataDisponibilidade ? `<p class="detail-availability">Disponibilidade a partir de <strong>${escapeHtml(dataDisponibilidade)}</strong></p>` : ''}
        <p class="detail-audience"><strong>Público-alvo:</strong> ${escapeHtml(curso.publicoAlvo)}</p>
        <button class="button button-red detail-enroll" type="button" data-interest>Tenho interesse <span aria-hidden="true">→</span></button>
      </div>

      <div class="detail-video-wrap">
        <div class="detail-video">
          <img src="${escapeHtml(imagem)}" alt="Imagem de apresentação do curso ${escapeHtml(curso.nomeCompleto)}">
          <span class="video-label">SESI + INDÚSTRIA</span>
        </div>
        <p class="video-caption">Imagem de apresentação do curso</p>
      </div>
    </section>

    <section class="detail-feature-strip" aria-label="Diferenciais da plataforma">
      <article><img class="feature-icon-image" src="/assets/images/01-certificacao-bege.svg" alt=""><div><strong>Certificação SESI</strong><small>Consulte as condições da formação</small></div></article>
      <article><img class="feature-icon-image" src="/assets/images/02-professores-bege.svg" alt=""><div><strong>Conteúdo especializado</strong><small>Formação voltada ao contexto industrial</small></div></article>
      <article><img class="feature-icon-image" src="/assets/images/03-suporte-bege.svg" alt=""><div><strong>Aprendizado organizado</strong><small>Módulos e aulas em uma jornada clara</small></div></article>
      <article><img class="feature-icon-image" src="/assets/images/04-flexibilidade-bege.svg" alt=""><div><strong>Modalidade definida</strong><small>${escapeHtml(curso.modalidade)}</small></div></article>
    </section>

    <section class="detail-section">
      <div class="detail-section-heading">
        <p class="eyebrow">SOBRE A FORMAÇÃO</p>
        <h2>Sobre o curso</h2>
      </div>
      <p class="detail-description">${escapeHtml(curso.descricao)}</p>
      <div class="detail-pills">
        <span>${escapeHtml(curso.modalidade)}</span>
        <span>${curso.cargaHoraria} horas</span>
        <span>${escapeHtml(curso.status)}</span>
      </div>
    </section>

    <section class="detail-section">
      <div class="detail-section-heading">
        <p class="eyebrow">CONTEÚDO PROGRAMÁTICO</p>
        <h2>Módulos e aulas</h2>
      </div>
      ${renderizarModulos(curso.modulos)}
    </section>

    <section class="detail-bottom-cta">
      <div>
        <p class="eyebrow eyebrow-light">SESI + INDÚSTRIA</p>
        <h3>Pronto para dar o próximo passo?</h3>
        <p>A matrícula online não faz parte deste case. Consulte os canais responsáveis para conhecer os procedimentos.</p>
      </div>
      <button class="button button-light" type="button" data-interest>Tenho interesse <span aria-hidden="true">→</span></button>
    </section>`;

  root.setAttribute('aria-busy', 'false');
  document.title = `${curso.nomeCompleto} | SESI + Indústria`;

  root.querySelectorAll('[data-interest]').forEach(button => {
    button.addEventListener('click', () => {
      mostrarToast('A matrícula online não está integrada nesta versão do catálogo.');
    });
  });
}

function renderizarErro(titulo, mensagem) {
  root.innerHTML = `<div class="detail-error" role="alert">
    <p class="eyebrow">CATÁLOGO DE CURSOS</p>
    <h1>${escapeHtml(titulo)}</h1>
    <p>${escapeHtml(mensagem)}</p>
    <a class="button button-red" href="/index.html#cursos">Voltar ao catálogo</a>
  </div>`;
  root.setAttribute('aria-busy', 'false');
}

async function carregarCurso() {
  if (!Number.isInteger(id) || id <= 0) {
    renderizarErro('Curso não encontrado', 'O endereço informado não possui um identificador de curso válido.');
    return;
  }

  try {
    const curso = await obterCurso(id);

    if (!curso) {
      renderizarErro('Curso não encontrado', 'Não encontramos um curso com esse identificador.');
      return;
    }

    renderizarCurso(curso);
  } catch (error) {
    console.error('Falha ao carregar os detalhes do curso:', error);
    renderizarErro('Não foi possível carregar o curso', 'Tente novamente em alguns instantes.');
  }
}

configurarNavegacao();
carregarCurso();
