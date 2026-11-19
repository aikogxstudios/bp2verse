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

export function localizedPath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const localized =
    lang === defaultLang ? clean : clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
  return withBase(localized);
}

export function stripLangFromPath(pathname: string): string {
  const stripped = withoutBase(pathname).replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}
