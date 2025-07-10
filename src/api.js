// src/api.js
/**
 * apiFetch envía solicitudes al backend usando la URL base
 * que definas en variables de entorno:
 *   • VITE_API_URL  (frontend/.env)      →  "http://localhost:3000/api"   en local
 *                                            "/api"                       en Azure (reverse-proxy)
 *
 * Se comporta igual que window.fetch pero antepone la base automáticamente.
 */
const BASE = import.meta.env.VITE_API_URL || "/api";

export function apiFetch(path, options = {}) {
  const url = path.startsWith("http")
    ? path                 // permite URLs absolutas si las pasas
    : `${BASE}${path}`;    // concatena con la base

  return fetch(url, options);
}
