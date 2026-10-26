const JSON_HEADERS = { Accept: 'application/json' };

async function parseJson(response) {
  if (response.status === 204) return null;
  return response.json();
}

export async function listarCursos({ busca = '', categoria = '', modalidade = '', status = '' } = {}) {
  const params = new URLSearchParams();

  if (busca.trim()) params.set('busca', busca.trim());
  if (categoria) params.set('categoria', categoria);
  if (modalidade) params.set('modalidade', modalidade);
  if (status) params.set('status', status);

  const query = params.toString();
  const response = await fetch(`/api/cursos${query ? `?${query}` : ''}`, {
    headers: JSON_HEADERS
  });

  if (!response.ok) {
    throw new Error('Não foi possível consultar os cursos.');
  }

  return parseJson(response);
}

export async function obterCurso(id) {
  const response = await fetch(`/api/cursos/${encodeURIComponent(id)}`, {
    headers: JSON_HEADERS
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error('Não foi possível consultar os detalhes do curso.');
  }

  return parseJson(response);
}
