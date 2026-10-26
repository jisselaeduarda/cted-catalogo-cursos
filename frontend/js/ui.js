export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

export function formatarData(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function configurarNavegacao() {
  const menuButton = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#main-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
  }

  const currentYear = document.querySelector('#current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
}

export function configurarCabecalho() {
  const header = document.querySelector('.site-header');
  const logo = document.querySelector('.site-header .brand img');

  if (!header || !logo || document.body.classList.contains('course-detail-body')) return;

  const update = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('header-scrolled', scrolled);
    logo.src = scrolled
      ? '/assets/images/logo-sesi-industria-primary.svg'
      : '/assets/images/logo-sesi-industria-white.svg';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

export function mostrarToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}
