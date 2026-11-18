# 03 — Investigación: hosting, playground de Verse y progreso del usuario

**Proyecto:** bp2verse — web educativa de Verse para desarrolladores que ya conocen Blueprints
**Fecha de la investigación:** 2026-11-19
**Autor:** agente de investigación de arquitectura web
**Alcance:** repositorio público en GitHub; lecciones + comparaciones nodo BP ↔ Verse + "terminal/playground" de Verse; objetivo 0–1000 usuarios/mes al lanzar.

---

## 1. Resumen ejecutivo

1. **Contexto que cambia el juego:** en la State of Unreal de junio de 2026 Epic anunció **UE6**, que reemplazará Blueprints y C++ de gameplay por **Verse** (con Scene Graph en lugar de Actors). UE6 ya es **visible en GitHub** (`EpicGames/UnrealEngine`, rama `ue6-main`), pero su **Early Access está prevista para finales de 2027**. Mientras tanto, Verse solo se puede compilar **dentro de UEFN**. Esto significa que bp2verse llega en el momento exacto de la transición BP→Verse: la demanda existe y no hay herramienta oficial en navegador.
2. **No existe playground oficial de Verse en la web.** Epic no publica compilador WASM, ni API, ni playground de Verse (verificado con múltiples búsquedas; la documentación oficial vive en `dev.epicgames.com` y la ejecución real exige UEFN). La comunidad tiene **dos** proyectos serios: `verse-js` (runtime + IDE embebible en TypeScript, MIT, julio 2026) y `johanfortus/Verse-Online-Editor` (parser PEG + Monaco, MIT). Ambos son jóvenes y de bajo alcance; **ninguno garantiza paridad con el compilador de Epic**.
3. **Hosting:** para un sitio 100 % estático con CI desde GitHub Actions y posible API pequeña después, **Cloudflare Pages (o Workers con Static Assets) es la opción con mejor plan gratuito**: peticiones y ancho de banda de estáticos **sin límite**, 500 builds/mes, y una vía de crecimento nativa hacia una API (Workers). GitHub Pages es válido pero con límite blando de 100 GB/mes y sin historia de API; Vercel Hobby **prohíbe uso comercial**; Netlify Free está en sistema de créditos (~15 GB equivalentes/mes para cuentas nuevas).
4. **Playground (recomendación):** **Monaco + `verse-js`** (opci�ón (a) de la lista, acelerada por la opción comunitaria existente), con **disclaimer explícito** de "semántica simulada, no es el compilador de Epic", y ejercicios con validación estática como capa de progreso. Evitamos WebContainers (peso, COOP/COEP, licencias) y servicios remotos (coste, privacidad, qué compilar — Verse no tiene toolchain standalone).
5. **Progreso del usuario:** **localStorage** (con export/import JSON) en la v1. Cuentas solo si hay demanda demostrable; si llega ese día, **Supabase** (50.000 MAU gratis, RLS, Cloudflare-friendly vía fetch) o un endpoint OAuth de GitHub dentro de un Worker. Riesgo a vigilar: Supabase **pausa** proyectos Free tras 1 semana de inactividad.
6. **Analítica:** **Cloudflare Web Analytics** (gratis, sin cookies) ahora; **Plausible** ($9/mes, o self-host) si se necesitan embudos/objetivos.
7. **Coste estimado a 0–1000 usuarios/mes: $0/mes** (más el dominio, ~$10–12/año si se compra en Cloudflare Registrar).

---

## 2. Comparativa de hosting

### 2.1 Tabla resumen (planes gratuitos, datos de nov. 2026)

| Criterio | GitHub Pages | Cloudflare Pages | Cloudflare Workers (+ Static Assets) | Netlify (Free) | Vercel (Hobby) |
|---|---|---|---|---|---|
| Precio | $0 | $0 | $0 | $0 | $0 |
| Ancho de banda estático | 100 GB/mes (blando) | **Sin límite** (peticiones de estáticos gratis e ilimitadas) | **Sin límite** | Sistema de créditos: 300 créditos/mes ≈ 15 GB (20 créd./GB); cuentas pre-sep-2025: 100 GB/mes | 100 GB/mes (blando) |
| Builds/CI | Con Actions: **gratis e ilimitado en repos públicos**; pipeline Jekyll propio: 10 builds/hora, deploy máx. 10 min | **500 builds/mes**, 1 concurrente, timeout 20 min | Builds vía Git o `wrangler deploy` desde Actions (minutos de Actions: gratis en público) | ~15 créditos por deploy de producción | 6000 build-min/mes aprox. (proyectos frugal) |
| Dominios custom | Sí, con HTTPS (Enforce HTTPS) | Sí, incluidos HTTPS y `*.workers.dev` | Sí, HTTPS automático | Sí | Sí |
| Previews por PR | No nativas (deploy por branch posible, URL distinta) | **Sí** (preview alias por PR) | Sí (preview URLs con Workers Builds) | **Sí** | **Sí** |
| Vite/Astro (export) | Sí (subes `dist/`) | Sí, soporte nativo | Sí | Sí | Sí |
| Next.js | Solo export estático | Posible pero no idóneo | Idéntico | Buen soporte pero **factura sorpresa** conocida con Next en plan free | Soporte de referencia |
| API pequeña después | **No** (habría que sumar otro servicio) | **Sí**: Pages Functions / Worker a un clic | **Sí** (es un Worker) | Sí (Functions, 125k invoc.) | Sí (Functions) |
| Uso comercial en free | Sí | Sí | Sí | Sí | **No: "personal, non-commercial" explícito** |
| Riesgo de sorpresa | Bajo (soft limits, avisan por email) | Bajo | Bajo (CPU 10 ms por request en free) | Medio (créditos se agotan y el sitio se detiene) | Medio (limites + ToS) |

**Notas y fuentes:**
- GitHub Pages: límites oficiales — sitio máx. 1 GB, ancho de banda blando 100 GB/mes, 10 builds/hora, deploys con timeout de 10 min (docs.github.com, citado 2026-11-19). GitHub Actions es **gratis e ilimitado para repositorios públicos** en todos los planes (docs.github.com, citado 2026-11-19) — clave para nosotros porque el repo es público y el CI lo ejecutaríamos con Actions.
- Cloudflare Pages: "On both free and paid plans, requests to static assets are free and unlimited" (developers.cloudflare.com/pages/functions/pricing, citado 2026-11-19); 500 builds/mes free, 1 concurrente, timeout 20 min, 20.000 archivos, 25 MiB por archivo (developers.cloudflare.com/pages/platform/limits, citado 2026-11-19). Las Pages Functions se facturan como Workers: 100.000 requests/día gratis, 10 ms de CPU por request.
- Cloudflare está **empujando a proyectos nuevos hacia Workers + Static Assets** (workers/static-assets): estáticos igual de gratis e ilimitados, y el mismo proyecto crece a API sin migración. Para un sitio nuevo en 2026 es la apuesta "a futuro" de Cloudflare; Pages sigue totalmente soportada.
- Netlify: plan Free siempre gratis con límites duros y **permite proyectos comerciales**; cuentas creadas desde el 4-sep-2025 usan créditos (300/mes; ancho de banda 20 créd./GB ≈ 15 GB; deploy de producción 15 créditos) (netlify.com/pricing; convika.com y figment.so, citados 2026-11-19).
- Vercel Hobby: generoso pero **"personal, non-commercial only"** (northflank.com, freewebhostingreport.com, citados 2026-11-19). Un sitio educativo sin ánimo de lucro encaja hoy, pero si mañana monetizamos (cursos, patrocinios) estaríamos violando el ToS.

### 2.2 ¿Qué pasa si necesitamos una API pequeña?

| Escenario | GitHub Pages | Cloudflare | Netlify/Vercel |
|---|---|---|---|
| API de progreso (guardar puntuaciones) | No soportado: habría que añadir Supabase/otro | **Worker + KV/D1 en la misma cuenta**: 100k req/día gratis, KV 100k lecturas/día gratis | Functions (Netlify 125k invoc./mes según plan; Vercel Hobby con límites de compute) |
| Coste de "sorpresa" | n/a | Bajo: hay que hacer *opt-in* al plan de pago | Medio-alto (histórico de facturas sorpresa en Vercel) |
| Migración | Requiere infra extra | Cero migración | Baja |

Conclusión parcial: **Cloudflare gana el escenario "estático hoy, API mañana"** sin cambiar de proveedor ni de repo.

---

## 3. ¿Se puede ejecutar Verse en el navegador?

### 3.1 El requisito y el estado oficial (verificado 2026-11-19)

**Respuesta corta: oficialmente, no.** Evidencia:

- Epic no publica ningún **playground web, compilador WASM ni API pública** de Verse. La documentación oficial (referencia del lenguaje, módulos `/Verse.org`, `/Fortnite.com`) vive en `dev.epicgames.com/documentation/en-us/uefn/verse-language-reference` y está pensada para usarse **dentro de UEFN**.
- Tras el anuncio de UE6 (junio 2026), la recomendación oficial de Epic a los desarrolladores fue "**try Verse and Scene Graph in UEFN first**" (Takayuki Kawasaki, keynote; InvenGlobal y gamesindustry.biz, citados 2026-11-19). Es decir: la única forma oficial de ejecutar Verse hoy sigue siendo UEFN (editor gratuito pero de escritorio, ~50 GB, con cuenta de Epic y proyecto de Fortnite).
- UE6: Epic abrió el **código fuente** de `ue6-main` en GitHub en la State of Unreal de junio de 2026 (unrealengine.com/news/the-road-to-ue-6; github.com/EpicGames/UnrealEngine/tree/ue6-main, citados 2026-11-19). El compilador de Verse y partes de VerseVM están ahí **en fuente**, pero: (a) exige compilarse uno mismo el motor, (b) la rama es inestable ("the current ue6 branch is extremely unstable, at least when it comes to the verse stuff", r/unrealengine, 2026), y (c) **no existe target WASM/navegador**. Early Access de UE6: **finales de 2027**.
- El proyecto `verse-js` documenta que sigue la **fuente pública de Epic** (`ReservedSymbols.inl` / `Effects.h` del stream `ue6-main`) — señal de que la comunidad ya está aprovechando esa apertura, pero también de que **no hay binario oficial reutilizable**.

**Consecuencia para bp2verse:** cualquier "terminal de Verse" será, durante 2026–2027, una **simulación educativa**, no el compilador real. Esto hay que comunicarlo honestamente en la web (y es una ventaja competitiva: somos los primeros en intentarloy con buen criterio).

### 3.2 Alternativas evaluadas

#### (a) Monaco + intérprete/simulador propio de un subconjunto de Verse en TypeScript ✅ **RECOMENDADA (apoyada en `verse-js`)**

- **Qué es:** editor Monaco (el de VS Code, con la gramática TextMate oficial de Verse ya vendorizada por `Verse-Online-Editor`) + un runtime propio que compile el AST a closures JS. La gran noticia: **`verse-js` (npm, MIT, v0.1.1, publicada ~julio 2026) ya hace exactamente esto** y es embebible como librería (`createHost`, `host.compile/run/execute`, servicios de IDE: diagnósticos, hover, go-to-definition, completions en Web Worker).
- **Cobertura de `verse-js`** (según su README, citado 2026-11-19): lexer/parser a mano, checker de tipos y efectos (8 efectos fundamentales), compilación a closures con **semántica transaccional de fallo** (journal + rollback, modelado sobre VerseVM), concurrencia estructurada (`spawn`, `race`, `sync`, `branch`), clases/interfaces/structs, genéricos, options, `weak_map` persistente, debugger con breakpoints. Shim opcional de `/Fortnite.com/Devices` (solo `creative_device`, `player` — **no** incluye las APIs de dispositivos de UEFN).
- **Deviations documentados:** `int` = número JS (pierde precisión > 2^53); sintaxis reservada futura (`await`, `upon`, `generator`) parseada pero rechazada.
- **Pros:** esfuerzo mínimo (embebemos librería en vez de escribirla); experiencia de terminal real; MIT; funciona 100 % en cliente (cero backend, cero coste por uso); diagnóstico en vivo durante la escritura (oro pedagógico).
- **Contras/riesgos:** proyecto **muy joven** (2 versiones, ~9 descargas/semana en npm, sin comunidad) → riesgo de abandono; desviaciones semánticas frente al compilador real de Epic (sobre todo en APIs de UEFN, que no existen ahí); hay que **pinnear/forkar** y escribir tests de conformance propios con ejemplos verificados en UEFN.
- **Esfuerzo:** 2–4 semanas para integrarlo (playground standalone con lecciones enlazadas); el runtime en sí ya existe.
- **Riesgo:** medio-bajo (mitigable con fork + disclaimer).

#### (b) Transpilador Verse → JavaScript ✅ (es, de facto, lo que `verse-js` hace internamente)

- Un transpilador puro (sin runtime de semántica de fallos) es más pequeño pero **pierde lo que hace distintivo a Verse**: fallos especulativos con rollback, efectos (`<decides>`, `<suspends>`, `<transacts>`), concurrencia estructurada. Enseñar Verse sin su modelo de fallos es enseñar "JavaScript con sintaxis de Verse" — pedagógicamente dañino para el objetivo (preparar para UE6).
- **Veredicto:** solo como ruta de escape si `verse-js` resulta insostenible; en ese caso, transpilar un subconjunto *sin efectos* y limitar el terminal a "lecciones 1–5".

#### (c) Servicios remotos (compilar en un backend)

- **Descartada por tres motivos:** (1) **no hay toolchain standalone de Verse** para invocar en un servidor (solo UEFN o compilarse `ue6-main` a mano, sin CLI estable); (2) coste/ops para 0–1000 usuarios: cada sandbox necesita aislamiento (contenedor por ejecución), lo que convierte un sitio gratis en un mini-SaaS; (3) privacidad/GDPR: enviar código de usuario a un backend añade superficie legal innecesaria para una web educativa.
- Una vía híbrida a futuro (cuando UE6 EA exista y Epic saque toolchain, si la saca) sería un Worker que invoque un binario WASM oficial. **Hoy no existe; monitorizar.**

#### (d) Solo ejercicios con validación estática (regex/AST) ✅ como **complemento**, no como sustituto

- Validar por estructura (¿declara `creative_device`? ¿usa `<decides>`? ¿hay `Print`?) con las reglas de cada lección. Es **barato, determinista y funciona con el runtime de `verse-js`** (usamos su AST/checker en vez de regex crudas).
- **Veredicto:** lo usamos como **modo de corrección de ejercicios** ("comprueba tu solución") dentro del playground, no como reemplazo del terminal.

#### (e) WebContainers / StackBlitz ❌

- WebContainers arranca un Node.js entero en el navegador: necesita **SharedArrayBuffer → cabeceras COOP/COEP** en todo el sitio (rompe embeds de terceros), es **pesado** para un sitio educativo ligero, los navegadores no-Chromium tienen soporte limitado, y el uso **comercial en producción puede requerir licencia** de StackBlitz (battleships.dev/webcontainers; stackblitz.com/pricing, citados 2026-11-19). Además no aporta nada específico para Verse: dentro del contenedor seguiríamos corriendo `verse-js`… que ya funciona sin contenedor.
- **Veredicto:** innecesario. Sería meter un Node.js para ejecutar código que compila a JS puro.

### 3.3 Panorama de herramientas comunitarias (inventario, 2026-11-19)

| Herramienta | Qué es | Licencia | Estado | Utilidad para bp2verse |
|---|---|---|---|---|
| `verse-js` (npm) | Runtime + IDE embebible: lexer/parser/checker/compilador a closures, diagnósticos, debugger | MIT | v0.1.1 (jul-2026), joven, 2 versiones | **Base del playground** (embebida como librería, pineada) |
| `johanfortus/Verse-Online-Editor` | Playground web React+Monaco con parser PEG (Peggy), subconjunto del lenguaje, sin structs/enums | MIT | WIP, 10★, 132 commits | Referencia para la gramática TextMate de Monaco y UX; alternativa si `verse-js` se abandona |
| `verselang.github.io/book` ("Book of Verse") | Documentación de comunidad del lenguaje | — | Activo | Referencia pedagógica para comparaciones BP↔Verse |
| Visual Verse (comunidad, 2026) | App standalone junto a UEFN que convierte lógica visual en Verse | — | Anunciado recientemente | No aplica (no web, no ejecuta), pero valida la demanda |

---

## 4. ¿Dónde vive el progreso del usuario? (sitio estático)

| Opción | Coste (0–1000 usuarios/mes) | Complejidad | Encaje con Cloudflare | Veredicto |
|---|---|---|---|---|
| **Nada** (sin progreso) | $0 | Nula | Perfecto | Insuficiente: el progreso es el gancho de retención de un curso |
| **localStorage + export/import JSON** | $0 | Muy baja (unas horas) | Perfecto (todo en cliente) | **v1. Sin GDPR real (no hay datos personales transmitidos), sin backend, sin cuentas.** Riesgo: borra si el usuario limpia el navegador → export JSON como copia de seguridad |
| **IndexedDB** (misma idea, más robusto) | $0 | Baja | Perfecto | Complemento de localStorage si guardamos snapshots del editor; opcional |
| **Cuentas Supabase (Auth + Postgres)** | $0 hasta 50.000 MAU; Pro $25/mes | Media (RLS, cookies, flujo de login) | Buena (todo por HTTP fetch desde el cliente o desde un Worker) | v2 si hay demanda. **Ojo: proyectos Free se pausan tras 1 semana de inactividad** (supabase.com/docs/guides/platform/free-project-pausing, citado 2026-11-19) → con 1000 usuarios con actividad intermitente podría pausarse; mitigable con un ping cron (Cloudflare Cron Trigger gratis) o aceptándolo. Free: 2 proyectos activos, 500 MB BD, 5 GB egress, 50.000 MAU (supabase.com/pricing) |
| **Clerk** | $0 hasta 50.000 usuarios retenidos/mes (MRU; plan Hobby desde feb-2026); Pro $20–25/mes | Media (widget completo, DX alta) | Buena (JS SDK cliente; funciona con Pages/Workers) | Buena DX pero nos obliga a su ecosistema; para solo "guardar mi progreso" es un martillo para una mosca |
| **Auth0** | $0 hasta 25.000 MAU (plan free, B2C); Pro desde $25–150/mes según add-ons | Media-alta (config de tenants, reglas) | Buena | Más pesado en config que Clerk/Supabase; orientado a empresa |
| **GitHub OAuth "hazlo tú"** | $0 (el token exchange cabe en un Worker gratis: 100k req/día) | Media (flujo OAuth + endpoint Worker) | **Excelente**: mismo proveedor que el repo; audiencia (desarrolladores) ya tiene GitHub | Elegante si en v2 queremos "guardar en tu GitHub Gist" o login developer-first; requiere manejar secretos (Client Secret) en el Worker |
| **Export a archivo / compartir por URL** | $0 | Nula | Perfecto | Complemento del localStorage: "comparte tu solución" vía hash en la URL |

**Recomendación:** localStorage (+ export/import JSON y compartir por URL) en v1; reevaluar cuentas en v2 con métricas reales (si analítica muestra retorno semanal, activar Supabase). Si v2, orden de preferencia: **Supabase > GitHub OAuth en Worker > Clerk > Auth0**.

---

## 5. Analítica sin cookies

| Herramienta | Precio | Notas |
|---|---|---|
| **Cloudflare Web Analytics** ✅ v1 | $0 | Sin cookies, sin banner, 1 línea de script; solo tráfico (sin embudos ni eventos). Perfecta para empezar (devhunt.org, humblytics.com, citados 2026-11-19) |
| Plausible | $9/mes (10k pageviews); self-host gratis (AGPL) | Embudos, objetivos, EU-friendly. Para v2 si necesitamos medir lecciones |
| Umami Cloud | Free tier: 100k eventos, 1 sitio; self-host gratis (MIT) | Alternativa a Plausible con plan free real |
| Fathom | $15/mes | Más caro, similar a Plausible |

---

## 6. Recomendación final: arquitectura concreta

**Stack:** Astro 5 (o Vite + vanilla/TS) en modo estático, contenido de lecciones en MDX con componentes `<CompareBP node="..." verse="..."/>` para las comparaciones lado a lado. TypeScript en todo. Sin frameworks de SSR.

**Hosting:** **Cloudflare Pages** conectado al repo de GitHub (build: `astro build`, output `dist/`). *(Alternativa equivalente a futuro: Workers + Static Assets, la vía que Cloudflare recomienda a proyectos nuevos; no es bloqueante, Pages sigue soportada y se migra cuando la API nos lo pida.)*

**CI/CD:** doble vía intencional:
1. **Preview:** PR → Cloudflare Pages genera URL de preview automáticamente (integración Git).
2. **CI en GitHub Actions** (gratis e ilimitado en repos públicos): lint + build + tests de conformance del playground (ejemplos de Verse verificados contra `verse-js`) en cada push; opcionalmente `wrangler deploy` manual o con OIDC hacia Pages/Workers para desacoplar de la integración Git.

**Dominio:** `bp2verse.dev` (o `.io`) comprado en Cloudflare Registrar a precio de coste (~$10–12/año), DNS+HTTPS automático en Pages. Dominio gratis de reserva: `bp2verse.pages.dev`.

**Playground ("terminal"):** página `/playground` con Monaco + **`verse-js`** (versión pineada, forkeada a la org de bp2verse), Web Worker para diagnósticos, disclaimer fijo: "Este simulador implementa un subconjunto de Verse con semántica fiel donde es posible; **no es el compilador de Epic**. Para ejecutar Verse de verdad: UEFN." Cada lección enlaza con su ejercicio pre-cargado (`?lesson=03`). Ejercicios validados con el checker de `verse-js` (no regex).

**Progreso:** localStorage + export/import JSON + "compartir solución" por URL (hash). Sin cuentas en v1.

**Analítica:** Cloudflare Web Analytics. Sin cookies ⇒ sin banner de consentimiento.

### Tabla de coste estimado (0–1000 usuarios/mes)

| Concepto | 0 usuarios | 100 usuarios | 1000 usuarios | Notas |
|---|---|---|---|---|
| Hosting (Cloudflare Pages free) | $0 | $0 | $0 | Estáticos ilimitados; 500 builds/mes >> nuestros ~30–60/mes |
| CI (GitHub Actions, repo público) | $0 | $0 | $0 | Gratis e ilimitado en públicos |
| Dominio | ~$12/año | ~$12/año | ~$12/año | Cloudflare Registrar |
| Analítica (Cloudflare WA) | $0 | $0 | $0 | — |
| Playground (todo cliente) | $0 | $0 | $0 | El coste es CPU del navegador del usuario |
| Progreso (localStorage) | $0 | $0 | $0 | — |
| **Total** | **~$1/mes** | **~$1/mes** | **~$1/mes** | Solo el dominio |
| *(v2 con cuentas: Supabase Pro)* | — | — | +$25/mes | Solo si activamos cuentas |

A 1000 usuarios/mes con ~10 páginas vistas cada uno (~10k PV/mes, ~50 MB de tráfico) estamos a ~5 GB/mes: ni GitHub Pages (100 GB) ni Cloudflare (∞) se inmutan.

### Plan de despliegue paso a paso

1. **Repo:** crear `bp2verse` (ya existe) público; añadir `.gitignore`, licencia **MIT** para código y **CC BY-SA 4.0** para lecciones; aviso de marca: "Verse es una marca de Epic Games; proyecto no afiliado".
2. **Scaffold:** Astro 5 + TypeScript + Tailwind (opcional); estructura `src/content/lessons/` (MDX), `src/components/CompareBP.astro`, `src/pages/playground.astro` (islas client-side).
3. **Playground:** `pnpm add verse-js` pineado; Monaco vía bundle; worker de análisis; tests de conformance (los 10 ejemplos de `verse-js` + nuestros casos de lección) en Vitest.
4. **Cloudflare:** crear cuenta (usar una nueva bajo la org del proyecto), conectar el repo en Pages (build `astro build`, output `dist`), activar preview por PR.
5. **Dominio:** comprar `bp2verse.dev` en Cloudflare Registrar, asignarlo al proyecto Pages, forzar HTTPS.
6. **CI (Actions):** workflow `ci.yml` — `pnpm lint && pnpm test && pnpm build` en cada push y PR; guardar el build como artefacto. Opcional: job de deploy con `wrangler pages deploy` protegido por OIDC.
7. **Analítica:** activar Cloudflare Web Analytics ( beacon sin cookies), verificar que no hay cookies ⇒ sin banner.
8. **Lanzamiento:** 3–5 lecciones + 5 comparaciones BP↔Verse + playground; anunciar en r/unrealengine, foros de Epic Dev Community y r/FortniteCreative (ahí vive la audiencia BP→UE6).
9. **v2 (señales, no fechas):** si retorno semanal > 30 %, activar Supabase (progreso en la nube); si `verse-js` se abandona, fork activo o port a `Verse-Online-Editor`-style parser; si Epic anuncia toolchain/SDK web de Verse, migrar el terminal al compilador real.

---

## 7. Riesgos principales

1. **Abandono/contracción de `verse-js`** (proyecto de 2 versiones y ~9 descargas/semana): mitigar pineando, forkeando y manteniendo tests de conformance propios.
2. **Fidelidad semántica:** el simulador divergirá del compilador de Epic (efectos, APIs de UEFN, precisión de `int`) → disclaimer visible y contenido verificado a mano contra UEFN.
3. **Riesgo de marca/susceptibilidad:** "Verse" es marca de Epic → no afiliación, disclaimers, y no copiar literalmente la documentación de Epic (contenido propio, citando fuentes).
4. **Cambio de dirección de Cloudflare (Pages → Workers):** Cloudflare empuja a proyectos nuevos a Workers + Static Assets; usar patrones portátiles (build estático + wrangler) para poder cambiar con una línea de config.
5. **Volatilidad del panorama Verse/UE6:** Epic puede cambiar el lenguaje entre hoy y la EA de 2027 (la rama `ue6-main` es inestable por diseño) → arquitectura de contenido por-lección con metadatos de "versión de referencia", y mantener el simulador desacoplado del contenido.

---

## 8. Bibliografía (URLs consultadas, con fecha de consulta 2026-11-19)

**Hosting y límites**
- GitHub Pages limits — https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- GitHub Actions billing (gratis en repos públicos) — https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions
- GitHub Plans — https://github.com/pricing
- Cloudflare Pages Limits — https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages Pricing (estáticos gratis e ilimitados) — https://developers.cloudflare.com/pages/functions/pricing/
- Cloudflare Workers Static Assets — https://developers.cloudflare.com/workers/static-assets/
- Cloudflare Workers Pricing — https://developers.cloudflare.com/workers/platform/pricing
- Cloudflare Developer Platform plans — https://www.cloudflare.com/plans/developer-platform/
- Netlify Pricing — https://www.netlify.com/pricing/
- Netlify free plan (créditos) — https://netlify.com/blog/introducing-netlify-free-plan ; https://figment.so/blog/netlify-vs-vercel ; https://convika.com/compare/vercel-vs-netlify-free
- Vercel Hobby (no comercial) — https://northflank.com/blog/vercel-vs-netlify-choosing-the-deployment-platform-in-2026 ; https://freewebhostingreport.com/blog/github-cloudflare-netlify-pages-free
- Comparativa GH Pages / CF / Netlify / Vercel (2026) — https://devplainly.com/blog/vercel-vs-netlify-vs-cloudflare-pages ; https://theproofdesk.com/cloudflare-pages-review

**Verse y UE6 (estado oficial)**
- The Road to UE 6 (Epic) — https://www.unrealengine.com/news/the-road-to-ue-6
- UE6 fusiona UE5 y UEFN; Verse reemplaza C++/Blueprints — https://gamedeveloper.com/programming/unreal-engine-6-will-merge-ue5-and-uefn-into-a-single-unified-engine-
- UE6 elimina Blueprints y Actors (keynote) — https://invenglobal.com/articles/28098/epic-games-will-remove-blueprints-and-actors-from-unreal-engine-6
- Resumen State of Unreal 2026 — https://gamesindustry.biz/everything-you-need-to-know-from-state-of-unreal-2026-unreal-engine-6-unreal-engine-58-and-1bn-paid-to-fortnite-devs
- UE6 source público en GitHub (`ue6-main`) — https://github.com/EpicGames/UnrealEngine/tree/ue6-main ; https://reddit.com/r/unrealengine/comments/1u9rga8/unreal_engine_6_source_code_now_public
- Documentación oficial de Verse (UEFN) — https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference
- Book of Verse (comunidad) — https://verselang.github.io/book/00_overview

**Verse en navegador (comunidad)**
- `verse-js` (npm, MIT, runtime + IDE embebible) — https://npmjs.com/package/verse-js (README consultado 2026-11-19)
- `Verse-Online-Editor` (Peggy + Monaco, MIT) — https://github.com/johanfortus/Verse-Online-Editor
- WebContainers (StackBlitz) — https://stackblitz.com/pricing ; https://battleships.dev/data/providers/webcontainers.md ; https://mobilestalk.net/software/stackblitz

**Progreso del usuario / auth**
- Supabase Pricing (50k MAU, 500 MB, pausa tras 1 semana) — https://supabase.com/pricing ; https://supabase.com/docs/guides/platform/free-project-pausing ; https://jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs
- Clerk (50.000 MRU free, feb-2026) — https://clerk.com/pricing ; https://clerk.com/articles/clerk-pricing-explained
- Auth0 (25k MAU free) — https://inetgeek.com/compare/clerk-vs-auth0 ; https://skycloak.io/blog/clerk-vs-auth0/

**Analítica**
- Cloudflare Web Analytics (gratis, sin cookies) — https://devhunt.org/blog/compare-top-web-analytics-services-for-tracking-your-sites-performance
- Plausible ($9/mes, sin free plan) — https://plausible.io/ ; https://ripples.sh/blog/best-fathom-analytics-alternatives-2026
- Umami (free tier cloud 100k eventos) — https://umami.is/compare/plausible ; https://pagelens.io/blog/best-cookieless-analytics-tools
