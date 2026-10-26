import { listarCursos } from './api.js';
import { configurarCabecalho, configurarNavegacao, escapeHtml } from './ui.js';

const form = document.querySelector('#catalog-form');
const searchInput = document.querySelector('#busca');
const categorySelect = document.querySelector('#categoria');
const modalitySelect = document.querySelector('#modalidade');
const statusSelect = document.querySelector('#status');
const clearButton = document.querySelector('#clear-filters');
const rail = document.querySelector('#course-rail');
const resultCount = document.querySelector('#result-count');

let searchTimer;

function filtrosAtuais() {
  return {
    busca: searchInput?.value ?? '',
    categoria: categorySelect?.value ?? '',
    modalidade: modalitySelect?.value ?? '',
    status: statusSelect?.value ?? ''
  };
}

function cardCurso(curso) {
  const imagem = curso.imagemUrl || '/assets/images/video-thumb.png';
  const nome = curso.nomeCompleto || curso.nomeResumido || 'Curso';

  return `<a class="course-card" href="/curso.html?id=${curso.id}"
      style="--card-image:url('${escapeHtml(imagem)}')"
      aria-label="Ver detalhes de ${escapeHtml(nome)}">
      <span class="course-tag">${escapeHtml(curso.categoria)}</span>
      <h3 class="course-title">${escapeHtml(nome)}</h3>
      <p class="course-description">${escapeHtml(curso.descricao)}</p>
      <span class="course-card-meta">${escapeHtml(curso.modalidade)} · ${curso.cargaHoraria}h · ${escapeHtml(curso.status)}</span>
    </a>`;
}

function atualizarContagem(total) {
  if (!resultCount) return;
  resultCount.textContent = total === 1
    ? '1 curso encontrado'
    : `${total} cursos encontrados`;
}

function renderizarCursos(cursos) {
  atualizarContagem(cursos.length);

  if (!cursos.length) {
    rail.innerHTML = `<div class="empty-state">
      <div class="empty-icon" aria-hidden="true">⌕</div>
      <h3>Nenhum curso encontrado</h3>
      <p>Tente alterar a pesquisa ou os filtros selecionados.</p>
      <button class="button button-red" id="empty-clear" type="button">Limpar filtros</button>
    </div>`;
    document.querySelector('#empty-clear')?.addEventListener('click', limparFiltros);
    return;
  }

  rail.innerHTML = cursos.map(cardCurso).join('');
}

async function carregarCursos() {
  rail.setAttribute('aria-busy', 'true');
  rail.innerHTML = '<div class="state-message" role="status">Carregando cursos...</div>';

  try {
    const cursos = await listarCursos(filtrosAtuais());
    renderizarCursos(Array.isArray(cursos) ? cursos : []);
  } catch (error) {
    console.error('Falha ao carregar o catálogo:', error);
    atualizarContagem(0);
    rail.innerHTML = `<div class="empty-state" role="alert">
      <h3>Não foi possível carregar os cursos</h3>
      <p>Tente novamente em alguns instantes.</p>
      <button class="button button-red" id="retry-load" type="button">Tentar novamente</button>
    </div>`;
    document.querySelector('#retry-load')?.addEventListener('click', carregarCursos);
  } finally {
    rail.setAttribute('aria-busy', 'false');
  }
}

function limparFiltros() {
  form?.reset();
  carregarCursos();
  searchInput?.focus();
}

function configurarFiltros() {
  form?.addEventListener('submit', event => {
    event.preventDefault();
    carregarCursos();
  });

  searchInput?.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(carregarCursos, 300);
  });

  [categorySelect, modalitySelect, statusSelect].forEach(select => {
    select?.addEventListener('change', carregarCursos);
  });

  clearButton?.addEventListener('click', limparFiltros);
}

function configurarCarrosseis() {
  document.querySelector('#course-prev')?.addEventListener('click', () => {
    rail.scrollBy({ left: -rail.clientWidth * 0.8, behavior: 'smooth' });
  });

  document.querySelector('#course-next')?.addEventListener('click', () => {
    rail.scrollBy({ left: rail.clientWidth * 0.8, behavior: 'smooth' });
  });

  const reviews = document.querySelector('#reviews-rail');
  document.querySelector('#review-prev')?.addEventListener('click', () => {
    reviews?.scrollBy({ left: -280, behavior: 'smooth' });
  });
  document.querySelector('#review-next')?.addEventListener('click', () => {
    reviews?.scrollBy({ left: 280, behavior: 'smooth' });
  });
}

configurarNavegacao();
configurarCabecalho();
configurarFiltros();
configurarCarrosseis();
carregarCursos();
