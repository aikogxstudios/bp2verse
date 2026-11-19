import { defaultLang, ui, type Lang } from './ui';

/** Base del despliegue (p. ej. '/bp2verse'), sin barra final. */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** Prefija una ruta con la base del sitio, sin dobles barras. */
export function withBase(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (!BASE || BASE === '/') return clean;
  return `${BASE}${clean}`;
}

/** Quita la base del despliegue de una ruta servida bajo el subpath. */
function withoutBase(pathname: string): string {
  if (BASE && BASE !== '/') {
    if (pathname === BASE) return '/';
    if (pathname.startsWith(`${BASE}/`)) return pathname.slice(BASE.length);
  }
  return pathname;
}

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = withoutBase(url.pathname).split('/');
  if (maybeLang && maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

/**
 * Segmentos de ruta que se traducen por idioma. La clave es la ruta canónica
 * (ES, sin prefijo) y afecta también a sus rutas hijas (p. ej. `/lecciones/m0-l04`).
 */
const routeAliases: Record<string, Record<Lang, string>> = {
  '/lecciones': { es: '/lecciones', en: '/lessons' },
};

/** Traduce el primer segmento de una ruta canónica al idioma dado. */
function translateRoute(path: string, lang: Lang): string {
  for (const [canonical, aliases] of Object.entries(routeAliases)) {
    if (path === canonical || path.startsWith(`${canonical}/`)) {
      return aliases[lang] + path.slice(canonical.length);
    }
  }
  return path;
}

export function localizedPath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return withBase(clean);
  const localized = translateRoute(clean, lang);
  return withBase(localized === '/' ? `/${lang}/` : `/${lang}${localized}`);
}

export function stripLangFromPath(pathname: string): string {
  const stripped = withoutBase(pathname).replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}
