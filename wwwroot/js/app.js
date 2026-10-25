(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const state = { courses: [], toastTimer: null };
  const rail = $('#course-rail');
  const loading = $('#loading-message');
  const dialog = $('#course-dialog');
  const dialogContent = $('#course-dialog-content');

  const get = (obj, ...names) => {
    for (const name of names) {
      if (obj && obj[name] !== undefined && obj[name] !== null && obj[name] !== '') return obj[name];
      const found = obj && Object.keys(obj).find(k => k.toLowerCase() === name.toLowerCase());
      if (found && obj[found] !== undefined && obj[found] !== null && obj[found] !== '') return obj[found];
    }
    return '';
  };
  const value = (course, key) => {
    const keys = {
      name: ['nomeCompleto', 'NomeCompleto', 'nome', 'titulo', 'title'],
      short: ['nomeResumido', 'NomeResumido', 'nomeCurto'],
      description: ['descricao', 'Descricao', 'description'],
      category: ['categoria', 'Categoria', 'category'],
      modality: ['modalidade', 'Modalidade', 'modality'],
      hours: ['cargaHoraria', 'CargaHoraria', 'carga_horaria', 'horas'],
      audience: ['publicoAlvo', 'PublicoAlvo', 'publico', 'audience'],
      status: ['status', 'Status'],
      image: ['imagemUrl', 'ImagemUrl', 'imagem', 'imageUrl', 'image'],
      date: ['dataDisponibilidade', 'DataDisponibilidade', 'disponibilidade']
    };
    return get(course, ...(keys[key] || [key]));
  };
  const text = (v, fallback = '') => String(v ?? fallback).trim();
  const safeUrl = (url) => {
    let candidate = text(url);
    if (!candidate) return '';
    candidate = candidate.replace(/^~\//, '/').replace(/^wwwroot\//i, '/');
    if (/^https?:\/\//i.test(candidate)) return candidate;
    if (/^\/|^\.\/|^\.\.\//.test(candidate)) return candidate;
    if (/^assets\//i.test(candidate) || /^images\//i.test(candidate) || candidate.includes('/')) return `/${candidate.replace(/^\/+/, '')}`;
    return `/images/${candidate}`;
  };
  const escapeHtml = (v) => text(v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const showToast = (message) => {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };

  function normalizeResponse(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.cursos)) return data.cursos;
    if (data && Array.isArray(data.items)) return data.items;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.resultados)) return data.resultados;
    return [];
  }

  function imageFor(course) {
    // Prioriza a imagem original indicada por ImagemUrl na API (incluindo arquivos em /images).
    // Só usa uma imagem de apoio quando o registro realmente não tem imagem.
    return safeUrl(value(course, 'image')) || '/assets/images/video-thumb.png';
  }

  function cardMarkup(course, index) {
    const name = text(value(course, 'name'), 'Curso de qualificação profissional');
    const category = text(value(course, 'category'), 'Indústria');
    const description = text(value(course, 'description'), 'Desenvolva conhecimentos para aplicar na prática profissional.');
    const image = imageFor(course);
    return `<article class="course-card" role="button" tabindex="0" data-course-index="${index}" data-image="${escapeHtml(image)}" style="--card-image: url('${escapeHtml(image)}')" aria-label="Ver detalhes de ${escapeHtml(name)}">
      <span class="course-tag">${escapeHtml(category)}</span>
      <h3 class="course-title">${escapeHtml(name)}</h3>
      <p class="course-description">${escapeHtml(description)}</p>
    </article>`;
  }

  function renderAll() {
    if (!state.courses.length) {
      rail.innerHTML = '<div class="state-message">Nenhum curso foi retornado pela API.</div>';
      return;
    }
    rail.innerHTML = state.courses.map((course, index) => cardMarkup(course, index)).join('');
  }

  function formatDate(raw) {
    const value = text(raw);
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  function courseDetails(course, index) {
    const name = text(value(course, 'name'), 'Detalhes do curso');
    const category = text(value(course, 'category'), 'Indústria');
    const modality = text(value(course, 'modality'), 'Consulte a modalidade');
    const hours = text(value(course, 'hours'));
    const status = text(value(course, 'status'), 'Consulte a disponibilidade');
    const audience = text(value(course, 'audience'));
    const date = formatDate(value(course, 'date'));
    const description = text(value(course, 'description'), 'Consulte as informações disponíveis para este curso.');
    const image = imageFor(course);
    const modules = get(course, 'modulos', 'Modulos', 'modules');
    let moduleHtml = '';
    if (Array.isArray(modules) && modules.length) {
      moduleHtml = `<section class="detail-section"><div class="detail-section-heading"><p class="eyebrow">CONTEÚDO PROGRAMÁTICO</p><h3>O que você vai aprender</h3></div><div class="module-list">${modules.map((m, moduleIndex) => {
        const title = text(get(m, 'titulo', 'Titulo', 'nome', 'title'), `Módulo ${moduleIndex + 1}`);
        const lessons = get(m, 'aulas', 'Aulas', 'lessons');
        const lessonsHtml = Array.isArray(lessons) && lessons.length
          ? `<ol class="lesson-list">${lessons.map(l => `<li><span class="lesson-mark" aria-hidden="true">▶</span><div><strong>${escapeHtml(get(l, 'titulo', 'Titulo', 'title') || 'Aula')}</strong>${text(get(l, 'descricao', 'Descricao', 'description')) ? `<p>${escapeHtml(get(l, 'descricao', 'Descricao', 'description'))}</p>` : ''}</div></li>`).join('')}</ol>`
          : '<p class="module-empty">As aulas deste módulo serão detalhadas pela equipe responsável.</p>';
        return `<article class="module-card"><div class="module-title-row"><span class="module-number">${String(moduleIndex + 1).padStart(2, '0')}</span><h4>${escapeHtml(title)}</h4><span class="module-count">${Array.isArray(lessons) ? `${lessons.length} ${lessons.length === 1 ? 'aula' : 'aulas'}` : 'Módulo'}</span></div>${lessonsHtml}</article>`;
      }).join('')}</div></section>`;
    } else {
      moduleHtml = '<section class="detail-section detail-program-placeholder"><div class="detail-section-heading"><p class="eyebrow">CONTEÚDO PROGRAMÁTICO</p><h3>Conteúdo do curso</h3></div><p>Os módulos e as aulas detalhadas não foram disponibilizados pela API para este curso.</p></section>';
    }

    const meta = [
      `<span class="detail-meta-item"><span class="detail-meta-icon" aria-hidden="true">◷</span><span><small>Carga horária</small><strong>${hours ? `${escapeHtml(hours)} horas` : 'Consulte'}</strong></span></span>`,
      `<span class="detail-meta-item"><span class="detail-meta-icon" aria-hidden="true">▣</span><span><small>Modalidade</small><strong>${escapeHtml(modality)}</strong></span></span>`,
      `<span class="detail-meta-item"><span class="detail-meta-icon detail-cert-icon" aria-hidden="true"><img src="/assets/images/01-certificacao-bege.svg" alt=""></span><span><small>Certificação</small><strong>Consulte as condições</strong></span></span>`
    ].join('');

    dialogContent.innerHTML = `<div class="detail-page">
      <div class="detail-brandline"><span class="detail-brand-label">SESI <b>+</b> INDÚSTRIA</span><button class="detail-back" type="button" data-close-detail>← Voltar ao catálogo</button></div>
      <section class="detail-main-grid" aria-labelledby="dialog-title">
        <div class="detail-intro">
          <span class="detail-status">${escapeHtml(status)}</span>
          <p class="detail-category">${escapeHtml(category)}</p>
          <h2 id="dialog-title">${escapeHtml(name)}</h2>
          <div class="detail-meta-grid">${meta}</div>
          ${date ? `<p class="detail-availability">Disponibilidade a partir de <strong>${escapeHtml(date)}</strong></p>` : ''}
          ${audience ? `<p class="detail-audience"><strong>Público-alvo:</strong> ${escapeHtml(audience)}</p>` : ''}
          <button class="button button-red detail-enroll" type="button" data-enroll>Matricule-se <span aria-hidden="true">→</span></button>
        </div>
        <div class="detail-video-wrap">
          <div class="detail-video" style="--detail-image:url('${escapeHtml(image).replace(/'/g, '%27')}')">
            <img src="${escapeHtml(image)}" alt="Imagem ilustrativa do curso ${escapeHtml(name)}" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/video-thumb.png'">
            <button class="video-play" type="button" data-preview aria-label="Ver disponibilidade da prévia do curso"><span aria-hidden="true">▶</span></button>
            <span class="video-label">CONHEÇA O CURSO</span>
          </div>
          <p class="video-caption">Apresentação do curso</p>
        </div>
      </section>
      <section class="detail-feature-strip" aria-label="Diferenciais da plataforma">
        <article><img class="feature-icon-image" src="/assets/images/01-certificacao-bege.svg" alt=""><div><strong>Certificação SESI</strong><small>Cursos com certificação conforme a formação</small></div></article>
        <article><img class="feature-icon-image" src="/assets/images/02-professores-bege.svg" alt=""><div><strong>Professores especialistas</strong><small>Conteúdo preparado por profissionais</small></div></article>
        <article><img class="feature-icon-image" src="/assets/images/03-suporte-bege.svg" alt=""><div><strong>Suporte contínuo</strong><small>Orientação ao longo da jornada</small></div></article>
        <article><img class="feature-icon-image" src="/assets/images/04-flexibilidade-bege.svg" alt=""><div><strong>Flexibilidade</strong><small>Confira a modalidade do curso</small></div></article>
      </section>
      <div class="detail-course-bar"><div><small>CURSO SELECIONADO</small><strong>${escapeHtml(name)}</strong></div><span>${escapeHtml(category)}${hours ? ` · ${escapeHtml(hours)}h` : ''}</span></div>
      <section class="detail-section"><div class="detail-section-heading"><p class="eyebrow">SOBRE A FORMAÇÃO</p><h3>Sobre o curso</h3></div><p class="detail-description">${escapeHtml(description)}</p><div class="detail-pills"><span>${escapeHtml(modality)}</span><span>${escapeHtml(status)}</span>${hours ? `<span>${escapeHtml(hours)} horas</span>` : ''}</div></section>
      ${moduleHtml}
      <div class="detail-bottom-cta"><div><p class="eyebrow eyebrow-light">SESI + INDÚSTRIA</p><h3>Pronto para dar o próximo passo?</h3><p>Consulte a disponibilidade e os procedimentos de matrícula deste curso.</p></div><button class="button button-light" type="button" data-enroll>Tenho interesse <span aria-hidden="true">→</span></button></div>
    </div>`;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else showToast('Abra os detalhes em um navegador atualizado.');
  }

  function handleCardAction(event) {
    const card = event.target.closest('[data-course-index]');
    if (!card) return;

    const index = Number(card.dataset.courseIndex);
    const course = state.courses[index];
    if (!course) return;

    // Guarda o curso selecionado para a página de detalhes e inclui um identificador
    // na URL quando a API disponibiliza um. A página também consegue recuperar o curso
    // pelo nome quando não existe ID no modelo.
    try {
      sessionStorage.setItem('ctedCursoSelecionado', JSON.stringify(course));
    } catch (error) {
      console.warn('Não foi possível guardar temporariamente os dados do curso:', error);
    }

    const id = get(course, 'id', 'cursoId', 'codigo', 'identificador');
    const name = value(course, 'name');
    const query = id !== ''
      ? `id=${encodeURIComponent(String(id))}`
      : `nome=${encodeURIComponent(String(name || ''))}`;
    window.location.href = `/curso.html?${query}`;
  }

  async function loadCourses() {
    try {
      const response = await fetch('/api/cursos', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`A API respondeu com status ${response.status}.`);
      const payload = await response.json();
      state.courses = normalizeResponse(payload);
      if (!state.courses.length) throw new Error('A API respondeu, mas não retornou cursos no formato esperado.');
      loading?.remove();
      renderAll();
    } catch (error) {
      console.error('Falha ao carregar o catálogo:', error);
      rail.innerHTML = `<div class="state-message"><strong>Não foi possível carregar os cursos.</strong><br>${escapeHtml(error.message)}<br><button class="button button-red" id="retry-load" type="button" style="margin-top:14px">Tentar novamente</button></div>`;
      $('#retry-load')?.addEventListener('click', loadCourses);
      showToast('Não conseguimos carregar os cursos. Confira a API.');
    }
  }

  rail.addEventListener('click', handleCardAction);
  rail.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-course-index]')) {
      event.preventDefault();
      event.target.click();
    }
  });
  $('#course-prev').addEventListener('click', () => rail.scrollBy({ left: -rail.clientWidth * .8, behavior: 'smooth' }));
  $('#course-next').addEventListener('click', () => rail.scrollBy({ left: rail.clientWidth * .8, behavior: 'smooth' }));
  $('#review-prev').addEventListener('click', () => $('#reviews-rail').scrollBy({ left: -280, behavior: 'smooth' }));
  $('#review-next').addEventListener('click', () => $('#reviews-rail').scrollBy({ left: 280, behavior: 'smooth' }));
  dialogContent.addEventListener('click', event => {
    if (event.target.closest('[data-close-detail]')) {
      dialog.close();
      return;
    }
    if (event.target.closest('[data-enroll]')) {
      showToast('A matrícula online ainda não está integrada neste protótipo.');
      return;
    }
    if (event.target.closest('[data-preview]')) {
      showToast('A prévia em vídeo deste curso ainda não foi cadastrada.');
    }
  });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  $('#current-year').textContent = String(new Date().getFullYear());
  const menuToggle = $('#menu-toggle');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.textContent = expanded ? '☰' : '×';
    $('#main-nav').classList.toggle('open', !expanded);
  });
  $$('#main-nav a').forEach(link => link.addEventListener('click', () => {
    $('#main-nav').classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
  loadCourses();
})();
