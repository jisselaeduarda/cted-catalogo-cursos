(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const root = $('#course-detail-root');
  const params = new URLSearchParams(location.search);
  let toastTimer;

  const get = (obj, ...keys) => {
    if (!obj) return '';
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return obj[key];
      }
      const found = Object.keys(obj).find(
        k => k.toLowerCase() === key.toLowerCase()
      );
      if (found && obj[found] !== undefined &&
          obj[found] !== null && obj[found] !== '') return obj[found];
    }
    return '';
  };

  const field = (c, key) => {
    const keys = {
      id: ['id', 'cursoId', 'codigo', 'identificador'],
      name: ['nomeCompleto', 'nome', 'titulo', 'title', 'nomeResumido'],
      description: ['descricao', 'description'],
      category: ['categoria', 'category'],
      modality: ['modalidade', 'modality'],
      hours: ['cargaHoraria', 'carga_horaria', 'horas'],
      audience: ['publicoAlvo', 'publico', 'audience'],
      status: ['status'],
      image: ['imagemUrl', 'imagem', 'imageUrl', 'image'],
      date: ['dataDisponibilidade', 'disponibilidade'],
      modules: ['modulos', 'modules'],
      lessons: ['aulas', 'lessons'],
      evaluations: ['avaliacoes', 'evaluations'],
      faqs: ['duvidasFrequentes', 'perguntasFrequentes', 'faqs']
    };
    return get(c, ...(keys[key] || [key]));
  };

  const text = (v, fallback = '') => String(v ?? fallback).trim();

  const escape = v => text(v).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[ch]);

  const array = value => Array.isArray(value) ? value : [];

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function imageFor(course) {
    let image = text(field(course, 'image'));
    if (!image) return '/assets/images/video-thumb.png';
    image = image.replace(/^~\//, '/').replace(/^wwwroot\//i, '/');
    if (/^https?:\/\//i.test(image) || image.startsWith('/')) return image;
    return `/${image.replace(/^\/+/, '')}`;
  }

  function formatDate(raw) {
    const value = text(raw);
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat('pt-BR').format(date);
  }

  function renderModules(course) {
    const modules = array(field(course, 'modules'));

    if (!modules.length) {
      return '<p class="detail-description">Os módulos detalhados ainda não foram cadastrados para este curso.</p>';
    }

    return modules.map((module, index) => {
      const title = text(
        get(module, 'titulo', 'nome', 'title'),
        `Módulo ${index + 1}`
      );
      const lessons = array(field(module, 'lessons'));

      const lessonHtml = lessons.length
        ? `<ol class="lesson-list">${lessons.map((lesson, i) => `
            <li>
              <span class="lesson-mark" aria-hidden="true">▶</span>
              <div>
                <strong>${escape(get(lesson, 'titulo', 'nome', 'title') || `Aula ${i + 1}`)}</strong>
                ${text(get(lesson, 'descricao', 'description'))
                  ? `<p>${escape(get(lesson, 'descricao', 'description'))}</p>`
                  : ''}
              </div>
            </li>`).join('')}</ol>`
        : '<p class="module-empty">As aulas ainda não foram detalhadas.</p>';

      return `
        <details class="course-accordion module-card">
          <summary>
            <span class="module-number">${String(index + 1).padStart(2, '0')}</span>
            <span class="module-summary-title">${escape(title)}</span>
            <span class="module-count">${lessons.length} ${lessons.length === 1 ? 'aula' : 'aulas'}</span>
          </summary>
          ${lessonHtml}
        </details>`;
    }).join('');
  }

  function renderItems(items, message) {
    const list = array(items);
    if (!list.length) return `<p class="detail-description">${escape(message)}</p>`;

    return `<ul class="detail-simple-list">${list.map((item, index) => {
      const title = typeof item === 'string'
        ? item
        : get(item, 'titulo', 'nome', 'title') || `Item ${index + 1}`;
      const description = typeof item === 'string'
        ? ''
        : get(item, 'descricao', 'description', 'resposta', 'answer');

      return `<li><strong>${escape(title)}</strong>
        ${description ? `<p>${escape(description)}</p>` : ''}</li>`;
    }).join('')}</ul>`;
  }

  function renderFaqs(faqs, modality, hours) {
    const list = array(faqs);

    if (list.length) {
      return list.map((item, index) => `
        <details class="course-accordion">
          <summary>${escape(get(item, 'pergunta', 'question', 'titulo', 'title') || `Dúvida ${index + 1}`)}</summary>
          <p>${escape(get(item, 'resposta', 'answer', 'descricao', 'description') || 'Consulte os canais responsáveis para obter esta informação.')}</p>
        </details>`).join('');
    }

    return `
      <details class="course-accordion">
        <summary>Qual é a modalidade?</summary>
        <p>${escape(modality)}.</p>
      </details>
      <details class="course-accordion">
        <summary>Qual é a carga horária?</summary>
        <p>${hours ? `${escape(hours)} horas.` : 'Consulte os dados do curso.'}</p>
      </details>
      <details class="course-accordion">
        <summary>Como posso me matricular?</summary>
        <p>A matrícula online ainda não está integrada a este protótipo.</p>
      </details>`;
  }

  function renderTestimonials() {
    const reviews = [
      ['Lucas Pereira', 'Aluno', 'A experiência do curso foi incrível! As aulas foram muito bem estruturadas e o cronograma cuidadosamente planejado.'],
      ['Mariana Costa', 'Aluna', 'Concluir o curso foi uma jornada enriquecedora. As aulas eram dinâmicas e o horário facilitou os estudos.'],
      ['Thiago Almeida', 'Aluno', 'O curso superou minhas expectativas! As aulas ajudaram a manter o foco e a produtividade.'],
      ['Fernanda Silva', 'Aluna', 'Finalizar o curso foi uma experiência motivadora. O conteúdo foi muito bem preparado.'],
      ['Gabriel Santos', 'Aluno', 'Aprendi conhecimentos que vou usar no trabalho. Uma experiência muito gratificante.']
    ];

    return reviews.map(([name, role, quote]) => `
      <article class="review-card">
        <p>“${escape(quote)}”</p>
        <div class="review-person">
          <strong>${escape(name)}</strong>
          <span>${escape(role)}</span>
          <span class="stars" aria-label="5 de 5 estrelas">★★★★★</span>
        </div>
      </article>`).join('');
  }

  function renderCourse(course) {
    const name = text(field(course, 'name'), 'Detalhes do curso');
    const category = text(field(course, 'category'), 'Indústria');
    const modality = text(field(course, 'modality'), 'Consulte a modalidade');
    const hours = text(field(course, 'hours'));
    const status = text(field(course, 'status'), 'Consulte a disponibilidade');
    const audience = text(field(course, 'audience'));
    const date = formatDate(field(course, 'date'));
    const image = imageFor(course);

    const description = /matemática para a precisão|medidas e escalas na metalurgia/i.test(name)
      ? 'Explore nosso curso de Matemática para a Precisão: Medidas e Escalas na Metalurgia, perfeito para quem deseja se destacar nesse campo! Este programa abrangente foi desenvolvido para capacitar profissionais com as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.'
      : text(field(course, 'description'), 'Consulte as informações disponíveis para este curso.');

    const modules = field(course, 'modules');
    const evaluations = field(course, 'evaluations');
    const faqs = field(course, 'faqs');

    root.innerHTML = `
      <div class="detail-brandline">
        <span class="detail-brand-label">SESI <b>+</b> INDÚSTRIA</span>
        <a class="detail-back" href="/index.html#cursos">← Voltar ao catálogo</a>
      </div>

      <section class="detail-main-grid" aria-labelledby="course-title">
        <div class="detail-intro">
          <span class="detail-status">${escape(status)}</span>
          <p class="detail-category">${escape(category)}</p>
          <h1 id="course-title">${escape(name)}</h1>

          <div class="detail-meta-grid">
            <span class="detail-meta-item">
              <span class="detail-meta-icon" aria-hidden="true">◷</span>
              <span><small>Carga horária</small><strong>${hours ? `${escape(hours)} horas` : 'Consulte'}</strong></span>
            </span>
            <span class="detail-meta-item">
              <span class="detail-meta-icon" aria-hidden="true">▣</span>
              <span><small>Modalidade</small><strong>${escape(modality)}</strong></span>
            </span>
            <span class="detail-meta-item">
              <span class="detail-meta-icon" aria-hidden="true">✓</span>
              <span><small>Certificação</small><strong>Consulte as condições</strong></span>
            </span>
          </div>

          ${date ? `<p class="detail-availability">Disponibilidade a partir de <strong>${escape(date)}</strong></p>` : ''}
          ${audience ? `<p class="detail-audience"><strong>Público-alvo:</strong> ${escape(audience)}</p>` : ''}
          <button class="button button-red detail-enroll" type="button" data-enroll>Tenho interesse →</button>
        </div>

        <div class="detail-video-wrap">
          <div class="detail-video">
            <img src="${escape(image)}" alt="Imagem ilustrativa do curso ${escape(name)}" onerror="this.onerror=null;this.src='/assets/images/video-thumb.png'">
            <span class="video-label">SESI + INDÚSTRIA</span>
          </div>
          <p class="video-caption">Conheça os detalhes desta formação</p>
        </div>
      </section>

      <section class="detail-feature-strip" aria-label="Diferenciais da plataforma">
        <article>
          <img class="feature-icon-image" src="/assets/images/01-certificacao-bege.svg" alt="">
          <div><strong>Certificação SESI</strong><small>Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.</small></div>
        </article>
        <article>
          <img class="feature-icon-image" src="/assets/images/02-professores-bege.svg" alt="">
          <div><strong>Professores especialistas</strong><small>Professores reconhecidos por sua excelência no mercado.</small></div>
        </article>
        <article>
          <img class="feature-icon-image" src="/assets/images/03-suporte-bege.svg" alt="">
          <div><strong>Suporte contínuo</strong><small>Acompanhamento online durante o curso.</small></div>
        </article>
        <article>
          <img class="feature-icon-image" src="/assets/images/04-flexibilidade-bege.svg" alt="">
          <div><strong>Flexibilidade</strong><small>Horários que buscam se adaptar à sua rotina.</small></div>
        </article>
      </section>

      <div class="course-detail-columns">
        <section class="detail-section course-about">
          <div class="detail-section-heading">
            <p class="eyebrow">SOBRE A FORMAÇÃO</p>
            <h2>Sobre o curso</h2>
          </div>
          <p class="detail-description">${escape(description)}</p>
          <div class="detail-pills">
            <span>${escape(modality)}</span>
            ${hours ? `<span>${escape(hours)} horas</span>` : ''}
            <span>${escape(status)}</span>
          </div>
        </section>

        <div class="course-accordion-column">
          <section class="detail-section">
            <div class="detail-section-heading">
              <p class="eyebrow">CONTEÚDO PROGRAMÁTICO</p>
              <h2>Módulos</h2>
            </div>
            ${renderModules(course)}
          </section>

          <section class="detail-section">
            <div class="detail-section-heading">
              <p class="eyebrow">SUA FORMAÇÃO</p>
              <h2>Aulas online e avaliações</h2>
            </div>
            ${renderItems(evaluations, 'As informações específicas sobre aulas online e avaliações ainda não foram cadastradas para este curso.')}
          </section>

          <section class="detail-section">
            <div class="detail-section-heading">
              <p class="eyebrow">PRECISA DE AJUDA?</p>
              <h2>Dúvidas frequentes</h2>
            </div>
            ${renderFaqs(faqs, modality, hours)}
          </section>
        </div>
      </div>

      <section class="course-testimonials">
        <div class="course-testimonials-heading">
          <div>
            <p class="eyebrow">DEPOIMENTOS</p>
            <h2>Quem fez recomenda</h2>
          </div>
          <div class="rail-controls">
            <button class="icon-button" type="button" data-review-prev aria-label="Depoimentos anteriores">←</button>
            <button class="icon-button" type="button" data-review-next aria-label="Próximos depoimentos">→</button>
          </div>
        </div>
        <div class="course-review-rail" id="course-review-rail">
          ${renderTestimonials()}
        </div>
      </section>

      <section class="course-contact-cta">
        <p class="eyebrow eyebrow-light">PRECISA DE AJUDA PARA DECIDIR?</p>
        <h2>Fale com a gente</h2>
        <button class="button button-light" type="button" data-contact>Mandar uma mensagem →</button>
      </section>

      <div class="sticky-enroll-bar" role="region" aria-label="Matrícula do curso">
        <strong>${escape(name)}</strong>
        <button class="button button-light" type="button" data-enroll>Matricule-se →</button>
      </div>
    `;

    root.setAttribute('aria-busy', 'false');
    document.title = `${name} | SESI + Indústria`;
  }

  async function loadCourse() {
    let saved = null;

    try {
      const raw = sessionStorage.getItem('ctedCursoSelecionado');
      if (raw) saved = JSON.parse(raw);
    } catch (error) {
      console.warn('Não foi possível recuperar o curso salvo.', error);
    }

    try {
      const response = await fetch('/api/cursos', {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error(`A API respondeu com status ${response.status}.`);

      const payload = await response.json();
      const courses = Array.isArray(payload) ? payload :
        get(payload, 'cursos', 'items', 'data', 'resultados');

      if (!Array.isArray(courses)) throw new Error('Formato de resposta inesperado.');

      const id = params.get('id');
      const requestedName = params.get('nome');

      const match = courses.find(course => {
        if (id !== null) return String(field(course, 'id')) === id;
        if (requestedName) {
          return text(field(course, 'name')).toLocaleLowerCase('pt-BR') ===
            requestedName.toLocaleLowerCase('pt-BR');
        }
        return saved && String(field(course, 'id')) === String(field(saved, 'id'));
      });

      const course = match || saved;
      if (!course) throw new Error('Curso não encontrado. Volte ao catálogo e selecione um curso.');

      renderCourse(course);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      root.innerHTML = `
        <div class="detail-error">
          <p class="eyebrow">SESI + INDÚSTRIA</p>
          <h1>Não foi possível carregar este curso</h1>
          <p>${escape(error.message)}</p>
          <a class="button button-red" href="/index.html#cursos">Voltar ao catálogo</a>
        </div>`;
      root.setAttribute('aria-busy', 'false');
    }
  }

  root.addEventListener('click', event => {
    if (event.target.closest('[data-enroll]')) {
      showToast('A matrícula online ainda não está integrada neste protótipo.');
      return;
    }

    if (event.target.closest('[data-contact]')) {
      showToast('O canal de contato ainda não está integrado neste protótipo.');
      return;
    }

    const rail = $('#course-review-rail', root);
    if (!rail) return;

    if (event.target.closest('[data-review-prev]')) {
      rail.scrollBy({ left: -rail.clientWidth * 0.8, behavior: 'smooth' });
    }

    if (event.target.closest('[data-review-next]')) {
      rail.scrollBy({ left: rail.clientWidth * 0.8, behavior: 'smooth' });
    }
  });

  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const menu = $('#menu-toggle');
  const nav = $('#main-nav');

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      menu.textContent = open ? '☰' : '×';
      nav.classList.toggle('open', !open);
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.textContent = '☰';
    }));
  }

  loadCourse();
})();