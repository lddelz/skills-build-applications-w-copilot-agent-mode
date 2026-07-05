const getCodespaceName = () => import.meta.env.VITE_CODESPACE_NAME?.trim();

export function getApiBaseUrl() {
  const codespaceName = getCodespaceName();
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}

export function getApiUrl(resource) {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/api/${resource}/`;
}
