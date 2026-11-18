# Hechos verificados

> Solo entra aquí lo que hemos comprobado con una fuente primaria o ejecutando código.
> Fecha de verificación: **2026-11-19**. Revisar antes de cada release.

## 1. UE6 y el fin de Blueprints

| Hecho | Fuente |
|---|---|
| Epic anunció UE6 en Unreal Fest Chicago (junio 2026): gameplay sobre **Verse** y **Scene Graph**, Early Access a finales de **2027**. | [The road to UE6](https://www.unrealengine.com/news/the-road-to-ue-6) (22 jun 2026) |
| En Unreal Fest Tokyo (**3 nov 2026**) Epic cambió el plan: **Blueprints, Actors y el C++ Gameplay Framework se eliminan**, no se deprecan. Desaparecen desde la Early Access. | [Inven Global](https://www.invenglobal.com/articles/28098/epic-games-will-remove-blueprints-and-actors-from-unreal-engine-6), [Game Makers](https://gamemakers.jp/article/2026_11_03_149166/) |
| Tim Sweeney lo llamó "painful change" y pidió disculpas a la comunidad de Blueprints. | Inven Global (3 nov 2026) |
| Epic ofrecerá **conversión asistida por IA** de Blueprints/C++ a Verse; formato sin decidir. | Inven Global (3 nov 2026) |
| Los proyectos en producción pueden **quedarse en UE5**; UE 5.9 entra en Preview. | Inven Global / Epic |
| No hay visual scripting anunciado sobre Verse. | Inven Global |

**Implicación para bp2verse:** la web no es un capricho educativo; es la respuesta a una migración forzosa con fecha. Ese es el mensaje de portada.

## 2. Verse hoy

| Hecho | Fuente |
|---|---|
| El único entorno público documentado para escribir, compilar y ejecutar Verse es **UEFN** (con VS Code + extensión oficial). | [Verse Get Started](https://dev.epicgames.com/documentation/en-us/fortnite/verse-language-get-started-in-unreal-editor-for-fortnite) |
| **Verse Language Version 1** está estabilizado desde UEFN 32.00 (1 nov 2024); la API y las features nuevas no están congeladas. | [Version updates](https://dev.epicgames.com/documentation/en-us/fortnite/verse-language-version-updates-and-deprecations-in-verse) |
| **Scene Graph** sigue etiquetado **Beta** en la documentación de UEFN. | Docs UEFN |
| La Verse API consultada declara versión **43.10** (release notes 43.00 del 1 nov 2026). | Docs UEFN |
| **No se ha localizado** compilador standalone, playground oficial ni runtime público de Verse fuera de Unreal/UEFN. `[NO VERIFICADO]` (ausencia de documentación, no prueba de inexistencia) | Investigación 01-verse.md |
| Las llamadas a funciones `<decides>` se hacen con **corchetes**: `ValidateAge[42]`, no `ValidateAge(42)`. | Verificado ejecutando verse-js; coherente con la referencia del lenguaje |

## 3. Ejecutar Verse en el navegador

| Hecho | Evidencia |
|---|---|
| Existe **`verse-js`** (npm, MIT, v0.1.1, publicado 9 jul 2026): runtime embebible + IDE en TypeScript para un subconjunto de Verse. | `npm view verse-js`; [README](https://unpkg.com/verse-js@0.1.1/README.md) |
| **Funciona.** Probado en Node 26 con `createHost().execute()`: `Print`, arrays + indexación fallable, clases con `var`/`set`, option, funciones `<decides>` y llamada con `[]`. | Ejecución local 2026-11-19 (ver `docs/research/` y pruebas del repo) |
| Cubre: lexer/parser, checker de tipos y efectos, fallo transaccional con rollback, `spawn`/`race`/`sync`, clases/interfaces/structs, genéricos, `weak_map`, debugger, Monaco + TextMate. | README de `verse-js` |
| No cubre: APIs reales de dispositivos/jugador de UEFN (solo un shim `creative_device`/`player`), predicción de cliente, transacciones distribuidas. | README, sección *Language coverage* |
| Desviación conocida: `int` es `number` de JS (pierde precisión > 2^53). | README |
| Proyecto **muy joven**: 2 versiones, ~9 descargas/semana. Riesgo de abandono real. | npm |
| Alternativa: `johanfortus/Verse-Online-Editor` (Peggy + Monaco, MIT) — menos completo, sirve como referencia de gramática. | GitHub |

## 4. Hosting

| Hecho | Fuente |
|---|---|
| Cloudflare Pages: estáticos gratis e **ilimitados**; 500 builds/mes; previews por PR. | [Límites](https://developers.cloudflare.com/pages/platform/limits/) |
| GitHub Pages: 1 GB por sitio, 100 GB/mes de ancho de banda (blando), deploy máx. 10 min. | [Límites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |
| GitHub Actions es gratis e ilimitado en repos **públicos**. | [Billing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions) |
| Vercel Hobby prohíbe uso comercial. | ToS de Vercel |

## 5. Qué sigue sin estar claro

1. Cómo será exactamente la Verse API de UE6 (hoy solo UEFN + stream `ue6-main` inestable).
2. Si Epic publicará un compilador/playground web antes de la EA.
3. Si habrá algún tipo de visual scripting sobre Verse.
4. Qué tan fiel será `verse-js` cuando Verse cambie hacia UE6.
5. Nombre y dominio definitivos.
