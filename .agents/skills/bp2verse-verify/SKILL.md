---
name: bp2verse-verify
description: >-
  Protocolo de verificación real antes de cerrar tareas en bp2verse:
  test:verse, build, inspección de dist/ y Playwright con Chromium local.
  Usar antes de reportar cambios web, de playground o de snippets como listos.
---

# Verificación real (`bp2verse-verify`)

No des por buena ninguna funcionalidad por lectura estática o suposición: ejecuta las comprobaciones y reporta solo resultados observados tras el último cambio.

## 1. Runtime Verse (`npm run test:verse`)

- Cuando el repo/rama incluya el script `test:verse` (`scripts/smoke-verse.mjs`), ejecútalo tras editar snippets o integración de `verse-js`.
- Comprueba que todos los casos terminan con exit code `0`, `errors` vacío y salida exacta esperada.

## 2. Build estático e inspección de `dist/`

- Ejecuta `npm run build` y verifica exit code `0`.
- Revisa `dist/` para confirmar que existen las rutas ES (`dist/index.html`, etc.) y EN (`dist/en/index.html`, etc.), sin enlaces internos rotos, con `<html lang="es">` / `<html lang="en">` y etiquetas `hreflang` coherentes.

## 3. Navegador real con Playwright (Chromium cacheado)

- Sirve el build generado (p. ej. `npm run preview` o servidor estático local sobre `dist/`) y abre la URL real en Playwright apuntando al binario ya cacheado en local:
  `~/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`
- Comprueba en cada página afectada (`/` y `/en/`):
  - **Consola limpia:** 0 `console.error` y 0 `pageerror` (incluyendo carga de islas/Web Workers).
  - **Salida esperada:** interactúa con los controles reales (p. ej. selector de ejemplos, botón Run del playground, selector de idioma) y verifica el texto renderizado en el DOM.
  - **A11y básica:** foco por teclado (`Tab`) visible y landmarks sin errores obvios.

## 4. Cuándo marcar `[NO VERIFICADO]`

Marca explícitamente `[NO VERIFICADO]` (indicando el motivo exacto) cuando:

- Un snippet o API sea `uefn-only` o de UE6/Scene Graph y no pueda compilarse en UEFN ni ejecutarse en `verse-js`.
- Falte un script/dependencia en la rama actual (p. ej. `test:verse` no existe aún en esa rama) o no se haya podido levantar navegador real.
- Una afirmación de documentación oficial no se haya podido contrastar en fuente primaria.
