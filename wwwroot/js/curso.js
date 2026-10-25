(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const root = $('#course-detail-root');
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const requestedName = params.get('nome');
  let toastTimer;

  const get = (obj, ...names) => {
    for (const name of names) {
      if (!obj || obj[name] === undefined || obj[name] === null || obj[name] === '') continue;
      return obj[name];
    }
    if (obj && typeof obj === 'object') {
      for (const name of names) {
        const key = Object.keys(obj).find(candidate => candidate.toLowerCase() === name.toLowerCase());
        if (key && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
      }
    }
    return '';
  };
  const value = (course, key) => {
    const keys = {
      id: ['id', 'cursoId', 'codigo', 'identificador'],
      name: ['nomeCompleto', 'nome', 'titulo', 'title', 'nomeResumido', 'nomeCurto'],
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
      evaluations: ['avaliacoes', 'avaliações', 'evaluations'],
      faqs: ['duvidasFrequentes', 'perguntasFrequentes', 'faqs']
    };
    return get(course, ...(keys[key] || [key]));
  };
  const text = (value, fallback = '') => String(value ?? fallback).trim();
  const escapeHtml = value => text(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const safeUrl = raw => {
    let url = text(raw);
    if (!url) return '/assets/images/video-thumb.png';
    url = url.replace(/^~\//, '/').replace(/^wwwroot\//i, '/');
    if (/^https?:\/\//i.test(url) || /^\//.test(url)) return url;
    if (/^(assets|images)\//i.test(url)) return `/${url}`;
    if (url.includes('/')) return `/${url.replace(/^\/+/, '')}`;
    return `/images/${url}`;
  };
  const normalize = payload => {
    if (Array.isArray(payload)) return payload;
    for (const key of ['cursos', 'items', 'data', 'resultados']) {
      const list = get(payload, key);
      if (Array.isArray(list)) return list;
    }
    return [];
  };
  const dateText = raw => {
    const value = text(raw);
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };
  const showToast = message => {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  };
  const propertyArray = value => Array.isArray(value) ? value : [];

  function renderModules(course) {
    const modules = propertyArray(value(course, 'modules'));
    if (!modules.length) {
      return '<p class="detail-description">Os módulos detalhados ainda não foram cadastrados na API para este curso.</p>';
    }
    return `<div class="module-list">${modules.map((module, index) => {
      const title = text(get(module, 'titulo', 'nome', 'title'), `Módulo ${index + 1}`);
      const lessons = propertyArray(value(module, 'lessons'));
      const lessonMarkup = lessons.length
        ? `<ol class="lesson-list">${lessons.map((lesson, lessonIndex) => `<li><span class="lesson-mark" aria-hidden="true">▶</span><div><strong>${escapeHtml(get(lesson, 'titulo', 'nome', 'title') || `Aula ${lessonIndex + 1}`)}</strong>${text(get(lesson, 'descricao', 'description')) ? `<p>${escapeHtml(get(lesson, 'descricao', 'description'))}</p>` : ''}</div></li>`).join('')}</ol>`
        : '<p class="module-empty">As aulas deste módulo ainda não foram detalhadas.</p>';
      return `<details class="course-accordion module-card"><summary class="module-title-row"><span class="module-number">${String(index + 1).padStart(2, '0')}</span><span class="module-summary-title">${escapeHtml(title)}</span><span class="module-count">${lessons.length ? `${lessons.length} ${lessons.length === 1 ? 'aula' : 'aulas'}` : 'Ver módulo'}</span></summary>${lessonMarkup}</details>`;
    }).join('')}</div>`;
  }

  function renderSimpleItems(items, emptyText, titleKeys = ['titulo', 'nome', 'title']) {
    const list = propertyArray(items);
    if (!list.length) return `<p class="detail-description">${escapeHtml(emptyText)}</p>`;
    return `<ul class="detail-simple-list">${list.map((item, index) => {
      const title = typeof item === 'string' ? item : get(item, ...titleKeys) || `Item ${index + 1}`;
      const description = typeof item === 'string' ? '' : get(item, 'descricao', 'description', 'resposta', 'answer');
      return `<li><strong>${escapeHtml(title)}</strong>${description ? `<p>${escapeHtml(description)}</p>` : ''}</li>`;
    }).join('')}</ul>`;
  }

  function renderCourse(course) {
    const name = text(value(course, 'name'), 'Detalhes do curso');
    const category = text(value(course, 'category'), 'Indústria');
    const modality = text(value(course, 'modality'), 'Consulte a modalidade');
    const hours = text(value(course, 'hours'));
    const status = text(value(course, 'status'), 'Consulte a disponibilidade');
    const audience = text(value(course, 'audience'));
    const date = dateText(value(course, 'date'));
    const apiDescription = text(value(course, 'description'));
    // Descrição completa do curso apresentada na referência do PDF.
    // Para os demais cursos, a descrição continua vindo normalmente da API.
    const detailedDescriptions = [
      {
        matches: /matemática para a precisão|medidas e escalas na metalurgia/i,
        description: 'Explore nosso curso de Matemática para a Precisão: Medidas e Escalas na Metalurgia, perfeito para quem deseja se destacar nesse campo! Este programa abrangente foi desenvolvido para capacitar profissionais com as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.'
      }
    ];
    const detailedDescription = detailedDescriptions.find(item => item.matches.test(name))?.description;
    const description = detailedDescription || apiDescription || 'Consulte as informações disponíveis para este curso.';
    const image = safeUrl(value(course, 'image'));
    const modules = value(course, 'modules');
    const evaluations = value(course, 'evaluations');
    const faqs = value(course, 'faqs');

    root.innerHTML = `<div class="detail-brandline">
        <span class="detail-brand-label">SESI <b>+</b> INDÚSTRIA</span>
        <a class="detail-back" href="/index.html#cursos">← Voltar ao catálogo</a>
      </div>
      <section class="detail-main-grid" aria-labelledby="course-title">
        <div class="detail-intro">
          <span class="detail-status">${escapeHtml(status)}</span>
          <p class="detail-category">${escapeHtml(category)}</p>
          <h1 id="course-title">${escapeHtml(name)}</h1>
          <div class="detail-meta-grid">
            <span class="detail-meta-item"><span class="detail-meta-icon" aria-hidden="true">◷</span><span><small>Carga horária</small><strong>${hours ? `${escapeHtml(hours)} horas` : 'Consulte'}</strong></span></span>
            <span class="detail-meta-item"><span class="detail-meta-icon" aria-hidden="true">▣</span><span><small>Modalidade</small><strong>${escapeHtml(modality)}</strong></span></span>
            <span class="detail-meta-item"><span class="detail-meta-icon" aria-hidden="true">✓</span><span><small>Certificação</small><strong>Consulte as condições</strong></span></span>
          </div>
          ${date ? `<p class="detail-availability">Disponibilidade a partir de <strong>${escapeHtml(date)}</strong></p>` : ''}
          ${audience ? `<p class="detail-audience"><strong>Público-alvo:</strong> ${escapeHtml(audience)}</p>` : ''}
          <button class="button button-red detail-enroll" type="button" data-enroll>Tenho interesse <span aria-hidden="true">→</span></button>
        </div>
        <div class="detail-video-wrap">
          <div class="detail-video">
            <img src="${escapeHtml(image)}" alt="Imagem ilustrativa do curso ${escapeHtml(name)}" onerror="this.onerror=null;this.src='/assets/images/video-thumb.png'">
            <span class="video-label">SESI + INDÚSTRIA</span>
          </div>
          <p class="video-caption">Conheça os detalhes desta formação</p>
        </div>
      </section>
      <section class="detail-feature-strip" aria-label="Diferenciais da plataforma">
        <article><img class="feature-icon-image" src="/assets/images/01-certificacao-bege.svg" alt=""><div><strong>Certificação SESI</strong><small>Consulte as condições de certificação</small></div></article>
        <article><img class="feature-icon-image" src="/assets/images/02-professores-bege.svg" alt=""><div><strong>Professores especialistas</strong><small>Conteúdo preparado para aprender</small></div></article>
        <article><img class="feature-icon-image" src="/assets/images/03-suporte-bege.svg" alt=""><div><strong>Suporte contínuo</strong><small>Orientação ao longo da jornada</small></div></article>
        <article><img class="feature-icon-image" src="/assets/images/04-flexibilidade-bege.svg" alt=""><div><strong>Flexibilidade</strong><small>Estude de acordo com sua rotina</small></div></article>
      </section>
      <section class="detail-section">
        <div class="detail-section-heading"><p class="eyebrow">SOBRE A FORMAÇÃO</p><h2>Sobre o curso</h2></div>
        <p class="detail-description">${escapeHtml(description)}</p>
        <div class="detail-pills"><span>${escapeHtml(modality)}</span>${hours ? `<span>${escapeHtml(hours)} horas</span>` : ''}<span>${escapeHtml(status)}</span></div>
      </section>
      <section class="detail-section">
        <div class="detail-section-heading"><p class="eyebrow">CONTEÚDO PROGRAMÁTICO</p><h2>Módulos</h2></div>
        ${renderModules(course)}
      </section>
      <section class="detail-section">
        <div class="detail-section-heading"><p class="eyebrow">SUA EXPERIÊNCIA DE APRENDIZAGEM</p><h2>Aulas online e avaliações</h2></div>
        ${renderSimpleItems(evaluations, 'As informações específicas sobre aulas online e avaliações ainda não foram cadastradas para este curso.')}
      </section>
      <section class="detail-section detail-faq-section">
        <div class="detail-section-heading"><p class="eyebrow">PRECISA DE AJUDA?</p><h2>Dúvidas frequentes</h2></div>
        ${propertyArray(faqs).length ? renderFaqs(faqs) : `<div class="faq-list">
          <details class="course-accordion"><summary>Qual é a modalidade deste curso?</summary><p>${escapeHtml(modality)}.</p></details>
          <details class="course-accordion"><summary>Qual é a carga horária?</summary><p>${hours ? `${escapeHtml(hours)} horas.` : 'A carga horária não foi informada no cadastro deste curso.'}</p></details>
          <details class="course-accordion"><summary>Como posso me matricular?</summary><p>A matrícula online não está integrada nesta versão do catálogo. Consulte os canais oficiais responsáveis para confirmar os procedimentos e a disponibilidade.</p></details>
        </div>`}
      </section>
      <section class="detail-bottom-cta">
        <div><p class="eyebrow eyebrow-light">SESI + INDÚSTRIA</p><h2>Pronto para dar o próximo passo?</h2><p>Confira as informações do curso e consulte os canais responsáveis para saber sobre matrícula.</p></div>
        <button class="button button-light" type="button" data-enroll>Tenho interesse <span aria-hidden="true">→</span></button>
      </section>`;
    root.setAttribute('aria-busy', 'false');
    document.title = `${name} | SESI + Indústria`;
  }

  function renderFaqs(faqs) {
    return `<div class="faq-list">${propertyArray(faqs).map((faq, index) => {
      const question = text(get(faq, 'pergunta', 'question', 'titulo', 'title'), `Dúvida ${index + 1}`);
      const answer = text(get(faq, 'resposta', 'answer', 'descricao', 'description'), 'Consulte os canais oficiais para obter esta informação.');
      return `<details class="course-accordion"><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`;
    }).join('')}</div>`;
  }

  async function loadCourse() {
    let savedCourse = null;
    try {
      const saved = sessionStorage.getItem('ctedCursoSelecionado');
      if (saved) savedCourse = JSON.parse(saved);
    } catch (error) {
      console.warn('Não foi possível recuperar o curso selecionado:', error);
    }

    try {
      const response = await fetch('/api/cursos', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`A API respondeu com status ${response.status}.`);
      const courses = normalize(await response.json());
      const matchingCourse = courses.find(course => {
        if (requestedId !== null) return String(value(course, 'id')) === requestedId;
        if (requestedName) return text(value(course, 'name')).toLocaleLowerCase('pt-BR') === requestedName.toLocaleLowerCase('pt-BR');
        return savedCourse && String(value(course, 'id')) === String(value(savedCourse, 'id'));
      });
      const course = matchingCourse || savedCourse;
      if (!course) throw new Error('Não encontrei o curso selecionado. Volte ao catálogo e escolha um curso novamente.');
      renderCourse(course);
    } catch (error) {
      console.error('Falha ao carregar os detalhes do curso:', error);
      const fallback = savedCourse;
      if (fallback) {
        renderCourse(fallback);
        showToast('Mostrando os dados que foram carregados ao selecionar o curso.');
        return;
      }
      root.innerHTML = `<div class="detail-error"><p class="eyebrow">SESI + INDÚSTRIA</p><h1>Não foi possível carregar este curso</h1><p>${escapeHtml(error.message)}</p><a class="button button-red" href="/index.html#cursos">Voltar ao catálogo</a></div>`;
      root.setAttribute('aria-busy', 'false');
    }
  }

  root.addEventListener('click', event => {
    if (event.target.closest('[data-enroll]')) {
      showToast('A matrícula online ainda não está integrada neste protótipo.');
    }
  });
  $('#current-year').textContent = String(new Date().getFullYear());
  const menuToggle = $('#menu-toggle');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.textContent = expanded ? '☰' : '×';
    $('#main-nav').classList.toggle('open', !expanded);
  });
  $('#main-nav').querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    $('#main-nav').classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
  loadCourse();
})();
/* Ajusta a chamada final ao layout de referência do curso */
(() => {
  const root = document.querySelector('#course-detail-root');
  if (!root) return;

  function adjustFinalCta() {
    const oldCta = root.querySelector('.course-contact-cta');
    if (!oldCta) return false;

    oldCta.className = 'course-final-cta';
    oldCta.innerHTML = `
      <div class="course-final-content">
        <p class="eyebrow eyebrow-light">SESI + INDÚSTRIA</p>
        <h2>Pronto para transformar sua carreira?</h2>
        <p>
          Junte-se a profissionais que estão desenvolvendo novas habilidades
          para a indústria. Invista no seu futuro hoje mesmo!
        </p>
        <button class="button button-light" type="button" data-enroll>
          Matricule-se <span aria-hidden="true">→</span>
        </button>
      </div>
      <div class="course-final-media">
        <img
          src="/assets/images/video-thumb.png"
          alt="Profissionais em ambiente industrial"
          loading="lazy"
        >
        <button class="course-final-play" type="button"
          data-preview aria-label="Ver prévia do vídeo">
          <span aria-hidden="true">▶</span>
        </button>
      </div>
    `;
    return true;
  }

  if (!adjustFinalCta()) {
    const observer = new MutationObserver(() => {
      if (adjustFinalCta()) observer.disconnect();
    });

    observer.observe(root, { childList: true, subtree: true });
  }

  root.addEventListener('click', event => {
    if (event.target.closest('[data-preview]')) {
      const toast = document.querySelector('#toast');
      if (!toast) return;

      toast.textContent =
        'A reprodução de vídeo ainda não está integrada neste protótipo.';
      toast.classList.add('show');

      window.setTimeout(() => toast.classList.remove('show'), 2800);
    }
  });
})();
// Usa banner-ava.png como imagem de apresentação quando o curso não tem imagem própria.
(() => {
  const root = document.querySelector('#course-detail-root');
  if (!root) return;

  function updateCourseImage() {
    const image = root.querySelector('.detail-video img');

    if (image && image.getAttribute('src')?.includes('video-thumb.png')) {
      image.src = '/assets/images/banner-ava.png';
    }
  }

  updateCourseImage();

  new MutationObserver(updateCourseImage).observe(root, {
    childList: true,
    subtree: true
  });
})();