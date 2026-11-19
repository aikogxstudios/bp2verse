---
name: bp2verse-web
description: >-
  Convenciones técnicas de la web bp2verse: Astro 7, i18n ES/EN en src/i18n/ui.ts,
  CSS puro con tokens, accesibilidad WCAG 2.2 AA, scripts npm y CI. Usar al
  editar componentes, layouts, páginas, estilos o configuración web.
---

# Convenciones web de `bp2verse` (`bp2verse-web`)

## Stack y enrutado i18n

- **Framework:** Astro 7 (`"astro": "^7.4.13"` en `package.json`), TypeScript, salida estática (GitHub Pages o Cloudflare Pages; decisión pendiente).
- **i18n (`astro.config.mjs`):** `defaultLocale: 'es'`, `locales: ['es', 'en']`, `routing: { prefixDefaultLocale: false }`.
  - Español (canónico) vive en `/` sin prefijo `/es/` (p. ej. `/`, `/playground`).
  - Inglés vive bajo `/en/` (p. ej. `/en/`, `/en/playground`).
- **Diccionarios (`src/i18n/ui.ts` y `src/i18n/utils.ts`):**
  - Toda cadena visible en UI va en `es` y `en` dentro de `src/i18n/ui.ts` con **paridad obligatoria** de claves (`const en: typeof es`, 0 claves huérfanas).
  - No traduzcas sintaxis, keywords ni especificadores de Verse (`var`, `set`, `<decides>`, `<transacts>`, `<suspends>`).
  - En `BaseLayout.astro`, mantén `<html lang={lang}>`, `<link rel="canonical">` y `<link rel="alternate" hreflang="es|en|x-default">`.

## CSS puro y design tokens

- Sin frameworks CSS ni utilidades externas; estilos centralizados en `src/styles/global.css`.
- Respeta los tokens de `:root`:
  - `--bg: #07080b`, `--surface: #0e1117`, `--surface-2: #12161f`, `--line: #1c2230`
  - `--text: #e9edf5`, `--muted: #98a2b3`
  - `--bp: #f0a02a` (ámbar Blueprint)
  - `--verse: #45d6ff` (cian Verse)

## Accesibilidad (a11y)

- **Landmarks y skip link:** `<a class="skip-link" href="#main">` al inicio de `<body>`, `<header>`, `<nav aria-label={...}>`, `<main id="main">` y `<footer>`.
- **Foco visible:** conserva `:focus-visible { outline: 2px solid var(--verse); ... }` en todos los controles interactivos.
- **Componentes de código y grafos:** grafos Blueprint con `role="img"` y `aria-label` descriptivo; bloques `<pre>` navegables con `tabindex="0" role="region" aria-label={...}`.
- **Regiones dinámicas (`aria-live`):** en el playground, consola de salida con `role="log" aria-live="polite"` y lista de errores con `aria-live="assertive"`.

## Comandos y CI

- `npm run dev` — servidor de desarrollo Astro (`astro dev`).
- `npm run build` — build estático a `dist/`.
- `npm run preview` — previsualización del build en `dist/`.
- `npm run test:verse` — smoke test de snippets en `verse-js` (disponible en ramas con `scripts/smoke-verse.mjs`).
- **CI (GitHub Actions, Node 22):** ejecuta `npm ci`, `npm run test:verse` y `npm run build` en `push` y `pull_request`.
