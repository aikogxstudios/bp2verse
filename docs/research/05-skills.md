# 05 — Investigación de Agent Skills, Extensiones y MCP para `bp2verse`

> **Fecha de consulta y redacción:** 2026-11-19  
> **Alcance:** ecosistema oficial y comunitario de Agent Skills (`SKILL.md`), capacidades reales de la flota local (`Pi`, `Codex CLI`, `Antigravity`, `OpenCode`), inventario de skills locales existentes, evaluación individual de candidatas para `bp2verse`, plan de instalación y diseño de 3 skills propias.  
> **Regla de verificación:** solo se afirma lo comprobado en las herramientas locales (`--help`, archivos de configuración y documentación integrada), API/archivos raw de GitHub y búsqueda web a fecha **2026-11-19**. No se instaló, clonó ni ejecutó código de terceros. Lo no confirmable en fuente primaria se marca como `[NO VERIFICADO]`.

---

## 1. Resumen ejecutivo

1. **El formato converge en `SKILL.md` y la ruta compartida `.agents/skills/`.** El estándar abierto [Agent Skills](https://agentskills.io) (`agentskills/agentskills`, Apache-2.0) es soportado hoy de forma nativa por **los cuatro agentes de la flota**: Pi (`1.5.2`), Codex CLI (`0.169.0`), Antigravity (`agy 1.5.11`) y OpenCode (`v2.2.6`). Instalar skills de proyecto en `.agents/skills/<id>/SKILL.md` evita mantener cuatro copias distintas en el repositorio.
2. **Las 14 skills locales actuales en `~/.config/opencode/skills/` no cubren ninguna necesidad de `bp2verse`.** Trece pertenecen al dominio de videojuegos en Godot/shaders (`godot-*`, `card-game`, `roguelike`, `shader-programming`) y una (`orquesta`) coordina terminales Herdr (`hc`). En `~/.codex/skills/.system/` ya vienen integradas `review-agent`, `skill-creator`, `skill-installer`, `imagegen` y `openai-docs`, pero faltan capacidades web/Astro/WCAG/Playwright/SEO/i18n/Verse.
3. **Para Astro (`^7.4.13` en `package.json`), el oficial Astro Docs MCP vale más que cualquier skill comunitaria.** Las skills de Astro en GitHub tienen poca tracción (13–48 estrellas) y quedan desfasadas rápido; en cambio, `https://mcp.docs.astro.build/mcp` es el servidor MCP oficial mantenido sobre `withastro/docs` (MIT, Streamable HTTP, gratuito y de solo lectura).
4. **Instalación recomendada inmediata (5 piezas de bajo riesgo y alto impacto en `bp2verse`):**
   - **Astro Docs MCP** (`https://mcp.docs.astro.build/mcp`) para evitar alucinaciones de APIs de Astro.
   - **`addyosmani/web-quality-skills`** (subconjunto puro Markdown: `accessibility`, `performance`, `seo`, `core-web-vitals`) para proteger WCAG 2.2 AA, SEO técnico y el objetivo **Lighthouse ≥ 95** con isla Monaco + `verse-js`.
   - **`pbakaus/impeccable`** (`impeccable`, Apache-2.0) para diseño editorial y pulido visual del comparador BP↔Verse sin caer en plantillas genéricas.
   - **`microsoft/playwright-cli`** (`playwright-cli`, Apache-2.0) para tests E2E y smoke checks del playground en navegador con bajo consumo de tokens.
   - **`obra/superpowers`** (subconjunto `requesting-code-review`, MIT) para estandarizar revisiones por rango de SHA en Pi, OpenCode y Antigravity (complementando `review-agent` de Codex).
5. **Tres huecos clave que ninguna skill externa cubre y debemos escribir nosotros:**
   - `bp2verse-lesson-author` (contrato editorial de `PLAN.md`: patrón BP + equivalente Verse + trampa del migrante + micro-ejercicio + metadato `run`).
   - `bp2verse-i18n-sync` (paridad ES/EN para `astro.config.mjs` con `prefixDefaultLocale: false` y `src/i18n/ui.ts` sin traducir sintaxis ni palabras clave de Verse).
   - `bp2verse-verse-snippet-verify` (verificación obligatoria contra docs de Epic / `verselang/book` y ejecución real en `verse-js`).

---

## 2. Ecosistema oficial y estándar `SKILL.md`

### 2.1 El estándar abierto Agent Skills (`agentskills.io`)

Originalmente impulsado por Anthropic y publicado como especificación abierta en [`agentskills/agentskills`](https://github.com/agentskills/agentskills) (Apache-2.0, último push verificado `2026-11-04`, ~27 435 estrellas), define una unidad autocontenida basada en carpeta:

```text
<skill-name>/
├── SKILL.md          # Obligatorio: frontmatter YAML + instrucciones Markdown
├── scripts/          # Opcional: scripts ejecutables
├── references/       # Opcional: documentación de consulta bajo demanda
└── assets/           # Opcional: plantillas y recursos estáticos
```

El frontmatter YAML de `SKILL.md` exige como mínimo `name` (≤ 64 caracteres, minúsculas, números y guiones) y `description` (≤ 1024 caracteres, describe *qué* hace y *cuándo* activarla), con campos opcionales `license`, `compatibility`, `metadata` y `allowed-tools`.

Su principio clave es la **revelación progresiva (*progressive disclosure*)**: al iniciar sesión, el agente solo inyecta `name` y `description` (y ruta) en el contexto; el cuerpo completo de `SKILL.md` y los archivos de `references/` solo se leen si la tarea coincide.

### 2.2 Repositorio de referencia y catálogos

| Recurso | URL | Naturaleza | Licencia verificada | Último push | Valor para `bp2verse` |
|---|---|---|---|---|---|
| **Anthropic Skills** | https://github.com/anthropics/skills | Repo oficial de referencia | Mixta: ejemplos como `frontend-design` y `webapp-testing` tienen `LICENSE.txt` **Apache-2.0**; skills de documentos (`docx`, `pdf`, `pptx`, `xlsx`) son propietarios / *source-available* | 2026-11-16 | Referencia del formato y fuente de `frontend-design` (alternativa ligera a `impeccable`) |
| **Agent Skills Spec** | https://github.com/agentskills/agentskills | Especificación oficial (`agentskills.io`) | **Apache-2.0** | 2026-11-04 | Referencia normativa para redactar nuestras propias skills |
| **skills.sh / `vercel-labs/skills`** | https://skills.sh / https://github.com/vercel-labs/skills | Directorio público + CLI (`npx skills`) | **MIT** (CLI `vercel-labs/skills`); cada skill conserva su licencia de origen | 2026-11-17 | Herramienta práctica de descubrimiento e instalación multi-agente (`npx skills find` / `add`) |
| **OpenAI Plugins** *(reemplaza a `openai/skills`)* | https://github.com/openai/plugins | Catálogo oficial de plugins/skills de Codex | Sin archivo `LICENSE` raíz en API (`None`) `[NO VERIFICADO]` | 2026-11-18 | Nota crítica: `openai/skills` (último push `2026-10-28`) marca explícitamente en su `README.md` que está **deprecado** en favor de `openai/plugins` |
| **Awesome Claude Skills (Composio)** | https://github.com/ComposioHQ/awesome-claude-skills | Lista curada + ejemplos empaquetados | **Apache-2.0** declarada en `README.md` (`lic=None` en API GitHub; skills enlazados o portados conservan términos propios, algunos propietarios) | 2026-09-18 | Índice amplio, pero requiere auditar cada enlace por separado |
| **Awesome Claude Skills (travisvn)** | https://github.com/travisvn/awesome-claude-skills | Lista curada de enlaces | Sin licencia única de repo (`lic=None` en API); cada skill enlazada mantiene su licencia original | 2026-04-28 | Referencia secundaria para descubrir repositorios |
| **claudeskills.directory** | https://claudeskills.directory | Agregador comunitario web | `[NO VERIFICADO]` para la plataforma web; registros equivalentes declaran MIT para la infra y licencia original por skill | `[NO VERIFICADO]` | Útil solo como buscador; conviene instalar siempre desde el repo GitHub fuente original |

---

## 3. Soporte real de la flota (verificado a 2026-11-19)

Verificado ejecutando `--help` sobre los binarios instalados en esta máquina y contrastando con su documentación oficial y configuraciones locales.

| Capacidad | **Pi** (`pi 1.5.2`) | **Codex CLI** (`codex-cli 0.169.0`) | **Antigravity** (`agy 1.5.11`) | **OpenCode** (`opencode v2.2.6`) |
|---|---|---|---|---|
| **Skills de proyecto (`SKILL.md`)** | `.agents/skills/` (walk-up hasta raíz git) y `.pi/skills/` | `.agents/skills/` (walk-up) | `.agents/skills/` (también `.agent/`, `_agents/`, `_agent/`) o `.agents/skills.json` | `.agents/skills/`, `.opencode/skills/`, `.claude/skills/` |
| **Skills globales (`SKILL.md`)** | `~/.agents/skills/` y `~/.pi/agent/skills/` | `~/.agents/skills/` y `~/.codex/skills/` (incluye `.system/`) | `~/.gemini/config/skills/` | `~/.config/opencode/skills/` y `~/.claude/skills/` |
| **Instrucciones persistentes** | `AGENTS.md` / `CLAUDE.md` (jerárquico + `~/.pi/agent/AGENTS.md`) | `AGENTS.md` y `AGENTS.override.md` (jerárquico) | `AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md` (24 KB/archivo; presupuesto 20k tokens) | `AGENTS.md` (raíz + `~/.config/opencode/AGENTS.md`, fallback `CLAUDE.md`) |
| **MCP nativo** | **Sí** (`pi mcp add/list/login`), `~/.pi/agent/mcp.json` y `.pi/mcp.json` | **Sí** (`codex mcp add/list`), `~/.codex/config.toml` y `.codex/config.toml` | **Sí** (`agy mcp add`), `~/.gemini/config/mcp_config.json` (Stdio y Streamable HTTP; no SSE legado) | **Sí** (`opencode mcp add/list`), `~/.config/opencode/opencode.json` |
| **Plugins / Extensiones** | `pi install <npm:\|git:\|path> [-l]` y extensiones TS en `.pi/extensions/` / `~/.pi/agent/extensions/` | `codex plugin add/marketplace` (`plugin.json` + `skills/` + `mcp.json`; sin hooks automáticos) | `agy plugin install/enable` (`.agents/plugins/*/plugin.json`, incluye `hooks.json` y `mcp_config.json`) | `opencode plugin add/list/update/remove` (ej. `opencode-supabase`) |
| **Particularidades / Deprecaciones** | `--skill <path>` y `/skill:name`; proyectos locales requieren `--approve` o confianza | `openai/skills` está **deprecado**; usar `openai/plugins` o `.agents/skills/` | Legacy `.agents/workflows/` **deprecado** en favor de skills (`/migrate-workflows`) | Configuración global actual usa JSON (`mcp.servers` + `plugins`) |

### Fuentes oficiales consultadas para la flota
- **Pi:** `badlogic/pi-mono` — [`packages/coding-agent/docs/skills.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md), [`extensions.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md), [`packages.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md), [`mcp.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/mcp.md) y `pi --help` local (`1.5.2`).
- **Codex CLI:** [OpenAI Codex Docs — Skills / AGENTS.md / Plugins](https://developers.openai.com/codex/skills), [`openai/plugins`](https://github.com/openai/plugins) y `codex --help` local (`0.169.0`).
- **Antigravity:** Documentación integrada local (`agy-customizations/docs/{skills,rules,plugins,mcp_servers,json_configs,hooks}.md`), [antigravity.google/docs/skills](https://antigravity.google/docs/skills), [`rules-workflows`](https://antigravity.google/docs/rules-workflows), [`mcp`](https://antigravity.google/docs/mcp) y `agy --help` local (`1.5.11`).
- **OpenCode:** [opencode.ai/docs/skills](https://opencode.ai/docs/skills), [`vercel-labs/skills/docs/agents.md`](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) y `opencode --help` local (`v2.2.6`).

> **Conclusión operativa para `bp2verse`:** cualquier skill compartida por el equipo debe vivir en **`.agents/skills/<id>/SKILL.md`** (versionada en Git). Pi, Codex, Antigravity y OpenCode la detectan automáticamente desde ahí.

---

## 4. Auditoría de skills locales existentes (evitar duplicados)

### 4.1 `~/.config/opencode/skills/` (14 skills inspeccionadas)

| Skill local | Dominio real | ¿Cubre algo de `bp2verse`? | Acción |
|---|---|---|---|
| `card-game` | Diseño de juegos de cartas / deckbuilders | No | Mantener fuera de `bp2verse` |
| `godot-3d-essentials` | Escenas 3D, cámaras, luces y GridMap en Godot 4.7 | No | Ignorar |
| `godot-combat-system` | Hitbox/hurtbox, `DamageData`, máquinas de combate en Godot | No | Ignorar |
| `godot-export` | Exportación desktop/Web/Android en Godot 4.7 | No | Ignorar |
| `godot-gdscript` | Sintaxis GDScript 2.0 y corrutinas en Godot 4.7 | No | Ignorar |
| `godot-gdscript-headless-testing` | Tests headless de GDScript en CI | No | Ignorar |
| `godot-mobile` | Proyecto `ascuas` (roguelike 3D Android en Godot) | No | Ignorar |
| `godot-nodes-scenes` | Árbol de escenas `.tscn` y `uid` en Godot 4.7 | No | Ignorar |
| `godot-particles` | `GPUParticles2D/3D` y VFX en Godot | No | Ignorar |
| `godot-shaders` | `.gdshader` y `ShaderMaterial` en Godot 4.7 | No | Ignorar |
| `godot-ui-control` | Nodos `Control` y HUD en Godot 4.7 | No | Ignorar |
| `roguelike` | Estructura de runs, permadeath y FOV en roguelikes | No | Ignorar |
| `shader-programming` | Matemáticas de shaders GLSL/HLSL | No | Ignorar |
| `orquesta` | Orquestación de terminales Herdr (`hc`) entre Pi, Codex, Antigravity y OpenCode | **Sí (transversal)** — solo coordinación multi-terminal | Conservar; no duplicar |

### 4.2 `~/.codex/skills/.system/` (5 skills preinstaladas en Codex)

`imagegen`, `openai-docs`, `review-agent`, `skill-creator` y `skill-installer`.
- **Implicación:** en Codex ya existe `review-agent` (solo lectura, *defect-first*) y `skill-creator`, por lo que **no debemos instalar un creador de skills redundante**. Sin embargo, como `review-agent` solo existe en Codex, sigue siendo útil añadir un protocolo ligero de code review en `.agents/skills/` para Pi, OpenCode y Antigravity.

---

## 5. Evaluación individual de candidatas para `bp2verse`

El contexto real de `bp2verse` (verificado en `package.json`, `astro.config.mjs`, `docs/PLAN.md` y `docs/research/04-curriculum.md`):
- **Stack:** Astro (`^7.4.13`), TypeScript, sitio estático en Cloudflare Pages, i18n configurada (`defaultLocale: 'es'`, `locales: ['es', 'en']`, `prefixDefaultLocale: false`), isla pesada futura con **Monaco Editor + `verse-js` en Web Worker**.
- **Contenido:** 11 módulos / ~48 lecciones MDX contrastivas (Blueprints ↔ Verse), glosario, referencia rápida y requisito CI de ejecución de snippets.
- **Metas de calidad:** Lighthouse ≥ 95 en F5, accesibilidad teclado/lector de pantalla en comparador e isla del playground, 0 snippets rotos.

### 5.1 Astro y desarrollo web frontend

1. **Astro Docs MCP (`Astro docs`)**
   - **URL:** `https://mcp.docs.astro.build/mcp` (documentado en [`withastro/docs`](https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/build-with-ai.mdx))
   - **Autor / Licencia:** Astro (`withastro/docs`, repo **MIT**; servidor remoto indexado con kapa.ai)
   - **Último push (`withastro/docs`):** `2026-11-18`
   - **Formato:** MCP (Streamable HTTP; compatible con stdio bridge `mcp-remote` si hiciera falta)
   - **Qué aporta a `bp2verse`:** expone `search_astro_docs` con la documentación actual de Astro (`^7.4.13` en `package.json`), Content Collections, i18n routing y directivas `client:*` para aislar Monaco/`verse-js`.
   - **Riesgo de supply-chain:** **Bajo** — servidor oficial de solo lectura, sin código ejecutado en tu máquina.
   - **Veredicto:** **Sí, instalar YA.**

2. **`delineas/astro-framework-agents`**
   - **URL:** https://github.com/delineas/astro-framework-agents
   - **Autor / Licencia:** `delineas` / **MIT**
   - **Último push / Estrellas:** `2026-04-01` / 48 stars
   - **Formato:** `SKILL.md` (Agent Skills)
   - **Qué aporta a `bp2verse`:** guías para Islands Architecture, Content Collections y View Transitions.
   - **Riesgo de supply-chain:** **Bajo** (Markdown estático), aunque menor comunidad y sin actualizaciones desde abril 2026 (riesgo de consejos obsoletos frente a Astro 7).
   - **Veredicto:** **Opcional / No prioritaria** — mejor combinar Astro Docs MCP + reglas en `AGENTS.md`.

3. **`astrolicious/agent-skills` (`astro`)**
   - **URL:** https://github.com/astrolicious/agent-skills
   - **Autor / Licencia:** `astrolicious` (declara `license: MIT` en `SKILL.md`, `lic=None` en API GitHub)
   - **Último push / Estrellas:** `2026-03-20` / 13 stars
   - **Formato:** `SKILL.md`
   - **Qué aporta a `bp2verse`:** cobertura genérica de Astro incluyendo adapters SSR (que `bp2verse` no usa por ser SSG puro en Cloudflare Pages).
   - **Riesgo de supply-chain:** **Bajo** (Markdown), pero baja adopción y algo desactualizada (`v0.0.1`).
   - **Veredicto:** **No merece la pena.**

### 5.2 Accesibilidad (WCAG), Performance y SEO

4. **`addyosmani/web-quality-skills` (`accessibility`, `performance`, `core-web-vitals`, `seo`, `web-quality-audit`)**
   - **URL:** https://github.com/addyosmani/web-quality-skills
   - **Autor / Licencia:** Addy Osmani / **MIT**
   - **Último push / Estrellas:** `2026-08-24` / 3 107 stars
   - **Formato:** `SKILL.md` + `references/` (nota: `web-quality-audit` incluye carpeta `scripts/`, mientras `accessibility`, `performance`, `core-web-vitals` y `seo` son **solo Markdown + `references/`**)
   - **Qué aporta a `bp2verse`:**
     - `accessibility`: auditoría WCAG 2.2 AA para el comparador lado a lado Blueprint↔Verse, navegación por teclado y lector de pantalla en el playground Monaco.
     - `performance` + `core-web-vitals`: diagnóstico de LCP/INP/CLS para cumplir **Lighthouse ≥ 95** cargando Monaco + `verse-js` Web Worker solo en las páginas que lo usan.
     - `seo`: validación de `robots.txt`, sitemap, canonicals y JSON-LD para guías educativas.
     - Diseñada explícitamente como *stack-agnostic* (menciona Astro) y con soporte para Chrome DevTools MCP (`lighthouse_audit`).
   - **Riesgo de supply-chain:** **Muy bajo** si se instalan únicamente `accessibility`, `performance`, `core-web-vitals` y `seo` (sin `scripts/`); **Bajo-Medio** en `web-quality-audit` si se dejan scripts sin revisar.
   - **Veredicto:** **Sí, instalar YA** (las 4 skills puras en Markdown).

5. **`ChromeDevTools/chrome-devtools-mcp`**
   - **URL:** https://github.com/ChromeDevTools/chrome-devtools-mcp
   - **Autor / Licencia:** Chrome DevTools Team / **Apache-2.0**
   - **Último push / Estrellas:** `2026-11-18` / ~58 209 stars
   - **Formato:** MCP (stdio)
   - **Qué aporta a `bp2verse`:** habilita `lighthouse_audit` y trazas reales de rendimiento para las skills de Addy Osmani en F5.
   - **Riesgo de supply-chain:** **Bajo** (paquete oficial de Chrome DevTools), aunque abre un proceso de navegador local y consume contexto si está siempre activo.
   - **Veredicto:** **Opcional (fase F5 de pulido)** — no hace falta activarlo el día 1.

6. **`Community-Access/accessibility-agents`**
   - **URL:** https://github.com/Community-Access/accessibility-agents
   - **Autor / Licencia:** Community Access / **MIT**
   - **Último push / Estrellas:** `2026-11-16` / 449 stars
   - **Formato:** Plugin multi-agente (`.claude-plugin`, `.codex-plugin`, skills + hooks bloqueantes)
   - **Qué aporta a `bp2verse`:** auditoría profunda WCAG 2.2 AA con hooks que bloquean ediciones de UI hasta revisión.
   - **Riesgo de supply-chain:** **Medio** — introduce hooks que interceptan ediciones y además Codex ya no ejecuta hooks de plugin automáticamente, rompiendo la paridad entre agentes.
   - **Veredicto:** **No prioritaria** — `addyosmani/web-quality-skills` (`accessibility`) ofrece WCAG 2.2 sin fricción de hooks.

7. **`84emllc/claude-wcag-skill`**
   - **URL:** https://github.com/84emllc/claude-wcag-skill
   - **Autor / Licencia:** 84emllc / `NOASSERTION` en API GitHub
   - **Último push / Estrellas:** `2026-08-05` / 1 star
   - **Formato:** `SKILL.md` + `references/`
   - **Riesgo de supply-chain:** **Medio** (licencia ambigua, 1 estrella, sin auditoría comunitaria).
   - **Veredicto:** **Descartar.**

8. **`coreyhaines31/marketingskills` (`seo-audit`)**
   - **URL:** https://github.com/coreyhaines31/marketingskills
   - **Autor / Licencia:** Corey Haines / **MIT**
   - **Último push / Estrellas:** `2026-11-18` / ~61 255 stars
   - **Formato:** `SKILL.md` + `references/` + `evals/`
   - **Qué aporta a `bp2verse`:** checklist sólido de `hreflang`, canonicals y redirecciones (útil cuando se active `/en/` junto a `/` por defecto en `prefixDefaultLocale: false`), aunque el repo completo arrastra sesgo SaaS/CRO.
   - **Riesgo de supply-chain:** **Bajo** si se copia solo `skills/seo-audit/` (Markdown).
   - **Veredicto:** **Opcional (fase F6 lanzamiento EN)** — para F0–F5 basta `seo` de `addyosmani/web-quality-skills`.

### 5.3 Diseño / UI

9. **`pbakaus/impeccable`**
   - **URL:** https://github.com/pbakaus/impeccable
   - **Autor / Licencia:** Paul Bakaus / **Apache-2.0**
   - **Último push / Estrellas:** `2026-11-18` / ~112 895 stars
   - **Formato:** `SKILL.md` (`.agents/skills/impeccable/SKILL.md`) + CLI opcional `npx impeccable`
   - **Qué aporta a `bp2verse`:** vocabulario de dirección de arte (`critique`, `audit`, `polish`, `bolder`) y detector de clichés visuales ("AI slop"). Clave para que el comparador visual BP↔Verse, la landing de migración UE6 y el playground tengan jerarquía editorial y tipografía técnica limpia en lugar de tarjetas SaaS genéricas. Soporta explícitamente Pi, Codex, OpenCode y Antigravity.
   - **Riesgo de supply-chain:** **Bajo** si se instala solo la carpeta `SKILL.md` vía `npx skills` o copia manual; **Medio** si se ejecuta su CLI propio sin auditar el paquete npm.
   - **Veredicto:** **Sí, instalar YA** (solo la skill `impeccable`).

10. **`anthropics/skills` (`frontend-design`)**
    - **URL:** https://github.com/anthropics/skills/tree/main/skills/frontend-design
    - **Autor / Licencia:** Anthropic / **Apache-2.0** (`LICENSE.txt` verificado dentro de la carpeta)
    - **Último push / Estrellas:** `2026-11-16` / ~197 204 stars (repo)
    - **Formato:** `SKILL.md` (puro Markdown, sin scripts)
    - **Qué aporta a `bp2verse`:** directrices breves para diseño UI intencional sin bloat en el prompt.
    - **Riesgo de supply-chain:** **Muy bajo.**
    - **Veredicto:** **Alternativa ligera válida** si `impeccable` resulta demasiado verbosa para modelos pequeños como `GLM-5.3-Flash` en Pi. (Se recomienda empezar por `impeccable` o elegir `frontend-design` para Pi si se busca mínimo consumo de contexto).

11. **`vercel-labs/agent-skills` (`web-design-guidelines`)**
    - **URL:** https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
    - **Autor / Licencia:** Vercel Labs / sin archivo `LICENSE` en raíz de `vercel-labs/agent-skills` (`lic=None` `[NO VERIFICADO]`; el repo fuente de reglas `vercel-labs/web-interface-guidelines` sí declara **MIT**)
    - **Último push / Estrellas:** `2026-11-12` / ~34 484 stars
    - **Formato:** `SKILL.md`
    - **Qué aporta a `bp2verse`:** revisión rápida `file:line` de más de 100 reglas UI/a11y/i18n (`Intl`).
    - **Riesgo de supply-chain:** **Medio-Alto (inyección indirecta)** — verificado en su `SKILL.md`: obliga al agente a descargar en tiempo de ejecución `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` en cada auditoría. Un cambio en la rama `main` externa entra directo al contexto del agente.
    - **Veredicto:** **No instalar** — sustituida con ventaja por `addyosmani/web-quality-skills` + `impeccable`.

12. **`nextlevelbuilder/ui-ux-pro-max-skill`**
    - **URL:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
    - **Autor / Licencia:** nextlevelbuilder / **MIT**
    - **Último push / Estrellas:** `2026-11-18` / ~151 344 stars
    - **Formato:** `SKILL.md` + scripts/CLI + bases de datos locales de paletas y dashboards
    - **Qué aporta a `bp2verse`:** generador de paletas/dashboards SaaS; poco alineado con un sitio educativo de documentación y playground de código.
    - **Riesgo de supply-chain:** **Medio** (ejecución de scripts locales).
    - **Veredicto:** **No merece la pena.**

### 5.4 Technical writing bilingüe y documentación

13. **`riekelt/technical-writer` (`technical-writing`, `reviewing-technical-prose`)**
    - **URL:** https://github.com/riekelt/technical-writer
    - **Autor / Licencia:** `riekelt` / **MIT**
    - **Último push / Estrellas:** `2026-09-13` / 38 stars
    - **Formato:** `SKILL.md` + `references/` (`style.md`, `truth.md`, solo Markdown)
    - **Qué aporta a `bp2verse`:** disciplina estricta de "conclusión primero, cada afirmación trazable a fuente, un dato en un único sitio y detección de prosa artificial", explícitamente agnóstica de idioma. Encaja con `FACTS.md` y la redacción de lecciones sin relleno.
    - **Riesgo de supply-chain:** **Bajo** (solo Markdown, aunque con 38 estrellas exige lectura previa del archivo antes de adoptarlo).
    - **Veredicto:** **Útil como referencia o instalación selectiva opcional**; para el contrato específico ES/EN de lecciones con `verse-js` es mejor crear nuestras skills propias (§7).

14. **`anthropics/skills` (`doc-coauthoring`)**
    - **URL:** https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring
    - **Autor / Licencia:** Anthropic / `[NO VERIFICADO]` (no incluye `LICENSE.txt` dentro de `skills/doc-coauthoring/` ni campo `license:` en su `SKILL.md`, aunque el `README.md` raíz indica que la mayoría de skills de ejemplo son Apache-2.0)
    - **Último push:** `2026-11-16`
    - **Formato:** `SKILL.md`
    - **Qué aporta a `bp2verse`:** flujo interactivo de coautoría para PRDs/RFCs internos, poco útil para lecciones MDX bilingües ni auditoría técnica.
    - **Riesgo de supply-chain:** **Bajo.**
    - **Veredicto:** **No merece la pena.**

15. **`upstash/context7` (Context7 MCP)**
    - **URL:** https://github.com/upstash/context7
    - **Autor / Licencia:** Upstash / **MIT**
    - **Último push / Estrellas:** `2026-11-18` / ~65 085 stars
    - **Formato:** MCP (HTTP remoto o stdio)
    - **Qué aporta a `bp2verse`:** consulta documentación actualizada de librerías npm/JS como `monaco-editor`, `playwright` o integraciones de Astro. **Importante:** no cubre la documentación oficial de Epic/Verse (páginas Angular JS-rendered, ya documentado en `04-curriculum.md`).
    - **Riesgo de supply-chain:** **Bajo** (consulta de docs).
    - **Veredicto:** **Opcional en fase F1** (cuando se integre Monaco + Web Worker).

### 5.5 Code review

16. **`obra/superpowers` (`requesting-code-review`, `receiving-code-review`)**
    - **URL:** https://github.com/obra/superpowers
    - **Autor / Licencia:** Jesse Vincent (`obra`) / **MIT**
    - **Último push / Estrellas:** `2026-11-03` / ~321 307 stars
    - **Formato:** `SKILL.md` (compatible con los 4 agentes; incluye plugin)
    - **Qué aporta a `bp2verse`:** protocolo riguroso para revisar diffs entre `BASE_SHA` y `HEAD_SHA` antes de integrar ramas/worktrees (`feat/*` → `main`) y exigir verificación técnica antes de aplicar comentarios de revisión. Imprescindible en Pi, OpenCode y Antigravity para igualar el nivel del `review-agent` nativo de Codex.
    - **Riesgo de supply-chain:** **Bajo** si se instala únicamente la carpeta `skills/requesting-code-review/` (Markdown + template `code-reviewer.md`).
    - **Veredicto:** **Sí, instalar YA** (subconjunto `requesting-code-review`).

### 5.6 Testing E2E (Playwright)

17. **`microsoft/playwright-cli` (`skills/playwright-cli`)**
    - **URL:** https://github.com/microsoft/playwright-cli
    - **Autor / Licencia:** Microsoft / **Apache-2.0**
    - **Último push / Estrellas:** `2026-11-18` / ~15 291 stars
    - **Formato:** CLI (`playwright-cli`) + `SKILL.md` (`allowed-tools: Bash(playwright-cli:*) Bash(npx playwright:*)`)
    - **Qué aporta a `bp2verse`:** automatiza navegador desde terminal con snapshots compactos en lugar de inyectar árboles de accesibilidad completos en el contexto del LLM. Ideal para probar la interacción real con Monaco, el botón Run de `verse-js`, el selector ES/EN (`/es` vs `/en/`) y enlaces rotos en CI/local sin quemar la ventana de contexto de `GLM-5.3-Flash` o `DeepSeek`.
    - **Riesgo de supply-chain:** **Bajo** (repositorio oficial de Microsoft bajo Apache-2.0).
    - **Veredicto:** **Sí, instalar YA.**

18. **`currents-dev/playwright-best-practices-skill`**
    - **URL:** https://github.com/currents-dev/playwright-best-practices-skill
    - **Autor / Licencia:** Currents (`currents.dev`) / **MIT**
    - **Último push / Estrellas:** `2026-11-08` / 435 stars
    - **Formato:** `SKILL.md` + `references/` (solo guías Markdown)
    - **Qué aporta a `bp2verse`:** patrones TypeScript anti-*flakiness*, locators centrados en usuario y testing de i18n/a11y con Playwright Test. Útil cuando arranque la suite E2E estable en F1/F2.
    - **Riesgo de supply-chain:** **Muy bajo.**
    - **Veredicto:** **Recomendada para fase F1/F2** (cuando existan tests Playwright en el repo).

19. **`microsoft/playwright-mcp` (`@playwright/mcp`)**
    - **URL:** https://github.com/microsoft/playwright-mcp
    - **Autor / Licencia:** Microsoft / **Apache-2.0**
    - **Último push / Estrellas:** `2026-11-18` / ~39 863 stars
    - **Formato:** MCP (stdio)
    - **Qué aporta a `bp2verse`:** equivalente MCP de Playwright; el propio `README` de Microsoft en `playwright-cli` indica que para coding agents el enfoque CLI + `SKILL.md` es superior por eficiencia de tokens.
    - **Riesgo de supply-chain:** **Bajo.**
    - **Veredicto:** **No prioritaria** frente a `microsoft/playwright-cli`.

20. **`anthropics/skills` (`webapp-testing`)**
    - **URL:** https://github.com/anthropics/skills/tree/main/skills/webapp-testing
    - **Autor / Licencia:** Anthropic / **Apache-2.0** (`LICENSE.txt` dentro de la carpeta)
    - **Último push:** `2026-11-16`
    - **Formato:** `SKILL.md` + `scripts/with_server.py` (Python)
    - **Qué aporta a `bp2verse`:** asume Playwright en Python, cuando el stack de `bp2verse` es Node 22 + TypeScript.
    - **Riesgo de supply-chain:** **Bajo.**
    - **Veredicto:** **No merece la pena** frente a `microsoft/playwright-cli`.

### 5.7 i18n

21. **`daymade/claude-code-skills` (`i18n-expert`)**
    - **URL:** https://github.com/daymade/claude-code-skills/tree/main/i18n-expert
    - **Autor / Licencia:** `daymade` / **MIT**
    - **Último push / Estrellas:** `2026-11-18` / 1 539 stars
    - **Formato:** `SKILL.md`
    - **Qué aporta a `bp2verse`:** muy poco — está orientada a React/Next.js/Vue con `i18next` y cobertura `en-US`/`zh-CN`. Desconoce `astro:i18n`, `prefixDefaultLocale: false` y el patrón `src/i18n/ui.ts` ya existente en `bp2verse`.
    - **Riesgo de supply-chain:** **Bajo** (Markdown).
    - **Veredicto:** **No instalar** — cubrir con skill propia `bp2verse-i18n-sync` (§7.2).

### 5.8 Extensiones específicas de Pi (`pi install`)

22. **`nicobailon/pi-mcp-adapter`**
    - **URL:** https://github.com/nicobailon/pi-mcp-adapter
    - **Autor / Licencia:** Nico Bailon / **MIT**
    - **Último push / Estrellas:** `2026-11-18` / 1 663 stars
    - **Formato:** Extensión/paquete Pi (`pi install npm:pi-mcp-adapter`)
    - **Qué aporta a `bp2verse`:** puente MCP ligero. Sin embargo, **`pi 1.5.2` ya trae soporte MCP nativo** (`pi mcp add` con `--exposure codemode|deferred|direct`).
    - **Riesgo de supply-chain:** **Medio** (ejecuta código TS dentro del proceso de Pi).
    - **Veredicto:** **No necesaria** gracias a `pi mcp` nativo.

23. **`nicobailon/pi-subagents`**
    - **URL:** https://github.com/nicobailon/pi-subagents
    - **Autor / Licencia:** `[NO VERIFICADO]` (no consultada la API de ese repo concreto; se cita desde búsqueda web)
    - **Último push:** `[NO VERIFICADO]`
    - **Formato:** Extensión Pi (`pi install npm:pi-subagents`)
    - **Qué aporta a `bp2verse`:** habilita subagentes asíncronos dentro de Pi (por ejemplo para lanzar `requesting-code-review` en paralelo sin contaminar la sesión principal).
    - **Riesgo de supply-chain:** **Medio** (extensión TS en proceso).
    - **Veredicto:** **Opcional solo para Pi** si se usa Pi como ejecutor autónomo de code review.

---

### 5.9 Tabla comparativa consolidada

| Candidata | Categoría | Formato | Licencia | Último push | Riesgo supply-chain | Recomendación `bp2verse` |
|---|---|---|---|---|---|---|
| **Astro Docs MCP** (`mcp.docs.astro.build/mcp`) | Astro | MCP (HTTP) | MIT (`withastro/docs`) | 2026-11-18 | Bajo (remoto oficial, solo lectura) | **Instalar YA** |
| **`addyosmani/web-quality-skills`** (4 skills Markdown) | WCAG / Perf / SEO | `SKILL.md` + refs | MIT | 2026-08-24 | Muy bajo (sin scripts) | **Instalar YA** |
| **`pbakaus/impeccable`** (`impeccable`) | Diseño / UI | `SKILL.md` | Apache-2.0 | 2026-11-18 | Bajo (solo `SKILL.md`) / Medio (CLI) | **Instalar YA** |
| **`microsoft/playwright-cli`** | E2E Playwright | CLI + `SKILL.md` | Apache-2.0 | 2026-11-18 | Bajo (Microsoft oficial) | **Instalar YA** |
| **`obra/superpowers`** (`requesting-code-review`) | Code Review | `SKILL.md` | MIT | 2026-11-03 | Bajo (solo `SKILL.md`) | **Instalar YA** |
| `anthropics/skills` (`frontend-design`) | Diseño / UI | `SKILL.md` | Apache-2.0 | 2026-11-16 | Muy bajo | Alternativa ligera a `impeccable` |
| `currents-dev/playwright-best-practices-skill` | E2E Playwright | `SKILL.md` + refs | MIT | 2026-11-08 | Muy bajo | Instalar en F1/F2 |
| `ChromeDevTools/chrome-devtools-mcp` | Perf / WCAG | MCP (stdio) | Apache-2.0 | 2026-11-18 | Bajo | Instalar en F5 |
| `upstash/context7` | Docs librerías JS | MCP | MIT | 2026-11-18 | Bajo | Opcional en F1 |
| `coreyhaines31/marketingskills` (`seo-audit`) | SEO / hreflang | `SKILL.md` + refs | MIT | 2026-11-18 | Bajo (solo `seo-audit`) | Opcional en F6 (EN) |
| `riekelt/technical-writer` | Technical writing | `SKILL.md` + refs | MIT | 2026-09-13 | Bajo (auditar por pocas stars) | Referencia para skills propias |
| `delineas/astro-framework-agents` | Astro | `SKILL.md` | MIT | 2026-04-01 | Bajo | Opcional (cubierto por MCP) |
| `Community-Access/accessibility-agents` | WCAG | Plugin + hooks | MIT | 2026-11-16 | Medio (hooks bloqueantes) | Descartar (excesiva fricción) |
| `vercel-labs/agent-skills` (`web-design-guidelines`) | UI / a11y | `SKILL.md` | `[NO VERIFICADO]` en repo | 2026-11-12 | **Medio-Alto** (fetch remoto dinámico) | **No instalar** |
| `daymade/claude-code-skills` (`i18n-expert`) | i18n | `SKILL.md` | MIT | 2026-11-18 | Bajo | **No instalar** (React/Next) |
| `nextlevelbuilder/ui-ux-pro-max-skill` | UI / SaaS | `SKILL.md` + scripts | MIT | 2026-11-18 | Medio (scripts) | No merece la pena |
| `anthropics/skills` (`webapp-testing`) | E2E Python | `SKILL.md` + `.py` | Apache-2.0 | 2026-11-16 | Bajo | No merece la pena (Python) |
| `astrolicious/agent-skills` (`astro`) | Astro | `SKILL.md` | MIT (`SKILL.md`) / `None` API | 2026-03-20 | Bajo | No merece la pena |
| `84emllc/claude-wcag-skill` | WCAG | `SKILL.md` | `NOASSERTION` | 2026-08-05 | Medio | Descartar |

---

## 6. Recomendación de instalación inmediata (5 piezas para instalar YA)

> **Criterio de seguridad:** todas las skills recomendadas deben instalarse a nivel de proyecto en **`.agents/skills/`** (o configurarse como MCP oficial remoto/local) **inspeccionando su `SKILL.md` antes de hacer commit**, y evitando ejecutar instaladores con scripts post-install arbitrarios. Los comandos siguientes están verificados contra `--help` de los binarios instalados (`pi 1.5.2`, `codex-cli 0.169.0`, `agy 1.5.11`, `opencode v2.2.6`).

### 6.1 Cuatro skills `SKILL.md` en el repo compartido (`.agents/skills/`)

Al instalar en `.agents/skills/`, **los cuatro agentes** las leen desde la misma ruta:
- **Pi:** `.agents/skills/<nombre>/SKILL.md` (y global opcional `~/.agents/skills/`)
- **Codex CLI:** `.agents/skills/<nombre>/SKILL.md` (y global opcional `~/.agents/skills/`)
- **Antigravity (`agy`):** `.agents/skills/<nombre>/SKILL.md` (y global opcional `~/.gemini/config/skills/`)
- **OpenCode:** `.agents/skills/<nombre>/SKILL.md` (y global opcional `~/.config/opencode/skills/`)

Comandos exactos desde la raíz del repositorio `bp2verse`:

1. **Calidad web: WCAG 2.2 + Performance/CWV + SEO (`addyosmani/web-quality-skills`)**
   - Ruta destino compartida: `.agents/skills/{accessibility,performance,core-web-vitals,seo}/SKILL.md`
   - Vía `npx skills` para los 4 agentes (solo esas 4 skills sin `scripts/`):
     ```bash
     npx skills add addyosmani/web-quality-skills \
       --skill accessibility performance core-web-vitals seo \
       -a pi -a codex -a antigravity -a opencode
     ```
   - Alternativa Codex nativa (`$skill-installer` dentro de Codex, escribe en `~/.codex/skills/`):
     ```text
     $skill-installer install https://github.com/addyosmani/web-quality-skills/tree/main/skills/accessibility
     ```

2. **Diseño editorial y anti-slop UI (`pbakaus/impeccable`)**
   - Ruta destino compartida: `.agents/skills/impeccable/SKILL.md`
   - Vía `npx skills` (evitando `npx impeccable` para instalar solo el Markdown de la skill):
     ```bash
     npx skills add pbakaus/impeccable --skill impeccable \
       -a pi -a codex -a antigravity -a opencode
     ```

3. **Testing E2E eficiente en tokens (`microsoft/playwright-cli`)**
   - Ruta destino compartida: `.agents/skills/playwright-cli/SKILL.md`
   - Instalación de la skill y del binario CLI requerido:
     ```bash
     npx skills add microsoft/playwright-cli --skill playwright-cli \
       -a pi -a codex -a antigravity -a opencode
     npm install -g @playwright/cli@latest   # o como devDependency en package.json cuando arranque F1
     ```
     *(Nota: en `bp2verse` recuerda justificar cualquier dependencia en `package.json` dentro de `docs/DECISIONS.md`, regla 3 de `AGENTS.md`).*

4. **Revisión de diffs por SHA (`obra/superpowers` — solo `requesting-code-review`)**
   - Ruta destino compartida: `.agents/skills/requesting-code-review/SKILL.md`
   - Comando exacto:
     ```bash
     npx skills add obra/superpowers --skill requesting-code-review \
       -a pi -a codex -a antigravity -a opencode
     ```
   - *(En Codex CLI también puede invocarse directamente la skill de sistema preinstalada `~/.codex/skills/.system/review-agent`).*

> **Nota para OpenCode global (`~/.config/opencode/skills/`):** si por preferencia personal quieres además que OpenCode las tenga disponibles globalmente en `~/.config/opencode/skills/<id>/SKILL.md`, añade `-g -a opencode` a `npx skills add` o crea enlaces simbólicos hacia `.agents/skills/<id>`. Si las dejas en `.agents/skills/`, quedan versionadas para toda la flota sin duplicación.

### 6.2 Un MCP oficial de proyecto/usuario: Astro Docs (`https://mcp.docs.astro.build/mcp`)

Comandos exactos verificados con `--help` de cada CLI instalado:

| Agente | Comando exacto | Archivo donde escribe |
|---|---|---|
| **Pi (`1.5.2`)** | `pi mcp add -l astro-docs --url https://mcp.docs.astro.build/mcp` | `.pi/mcp.json` (con `-l`) o `~/.pi/agent/mcp.json` (sin `-l`) |
| **Codex CLI (`0.169.0`)** | `codex mcp add astro-docs --url https://mcp.docs.astro.build/mcp` | `~/.codex/config.toml` |
| **Antigravity (`agy 1.5.11`)** | `agy mcp add --type http astro-docs https://mcp.docs.astro.build/mcp` | `~/.gemini/config/mcp_config.json` |
| **OpenCode (`v2.2.6`)** | `opencode mcp add astro-docs --url https://mcp.docs.astro.build/mcp` *(o `--global`)* | `opencode.json` del proyecto o `~/.config/opencode/opencode.json` |

---

## 7. Tres skills propias que debemos escribir para `bp2verse`

Ninguna skill del ecosistema conoce el contrato pedagógico de `bp2verse`, la política de sinceridad sobre `verse-js` vs UEFN, ni nuestra configuración concreta de `astro:i18n`. Deben guardarse en **`.agents/skills/<nombre>/SKILL.md`**.

### 7.1 `bp2verse-lesson-author`

```markdown
---
name: bp2verse-lesson-author
description: >-
  Redacta o revisa lecciones MDX de bp2verse (M0-M10) traduciendo patrones de
  Blueprints a Verse. Usar al crear, editar o revisar archivos bajo src/content/
  o al convertir temas de docs/research/04-curriculum.md en lecciones publicables.
---

# Autor de Lecciones bp2verse

## Cuándo usarla
- Al crear una nueva lección MDX para cualquier módulo M0–M10.
- Al actualizar una lección tras un cambio de versión de UEFN / UE6 / `verse-js`.
- Al revisar en PR si una lección cumple el Definition of Done de `docs/PLAN.md`.

## Pasos
1. Consulta el objetivo del módulo en `docs/research/04-curriculum.md` y el mapa en `docs/reference/bp-verse-map.md`.
2. Define el patrón de Blueprint de partida ("esto ya lo has hecho en UE5"): evento, pines, variables o cast concreto.
3. Redacta el equivalente en Verse con comentarios línea a línea (código e identificadores siempre en inglés; prosa en el idioma de la lección).
4. Incluye obligatoriamente la sección **"Trampa del migrante"** (error típico al pensar en nodos BP: p. ej. `Cast` que falla vs `<decides>` con `[ ]` y rollback transaccional, o `var` sin tipo).
5. Diseña un micro-ejercicio resolvible en < 2 min con estado inicial, criterio de validación y solución comentada.
6. Etiqueta el bloque ejecutable en frontmatter/metadatos con `run: "browser"` (si corre en `verse-js`) o `run: "uefn-only"` (si usa APIs de dispositivos/Scene Graph no simulables).
7. Verifica los snippets ejecutándolos con la skill `bp2verse-verse-snippet-verify` y añade `verseVersion` + fecha + enlace oficial de Epic / `verselang/book`.

## Checklist (Definition of Done)
- [ ] Parte de un patrón reconocible de Blueprints (no introducción genérica de programación).
- [ ] Incluye comparación lado a lado Blueprint ↔ código Verse anotado.
- [ ] Contiene al menos una "trampa del migrante" explícita.
- [ ] Incluye micro-ejercicio con validación automática o estructural.
- [ ] Metadato `run` honesto (`"browser"` vs `"uefn-only"`); si es `"browser"`, probado en `verse-js`.
- [ ] Fuente oficial enlazada y fecha de verificación actualizada; lo no comprobado marcado `[NO VERIFICADO]`.
```

### 7.2 `bp2verse-i18n-sync`

```markdown
---
name: bp2verse-i18n-sync
description: >-
  Mantiene paridad bilingüe ES/EN en bp2verse respetando astro.config.mjs
  (prefixDefaultLocale: false, ES en /, EN en /en/) y src/i18n/ui.ts.
  Usar al añadir cadenas UI, rutas, metadatos SEO/hreflang o traducir lecciones.
---

# Sincronización i18n de bp2verse (ES / EN)

## Cuándo usarla
- Al modificar o añadir textos visibles en componentes `.astro` o páginas en `src/pages/`.
- Al añadir claves en `src/i18n/ui.ts` o helpers en `src/i18n/utils.ts`.
- Al traducir o revisar lecciones, glosario o landing entre `/` (ES canónico) y `/en/` (EN).

## Pasos
1. Lee `astro.config.mjs`, `src/i18n/ui.ts` y `src/i18n/utils.ts` antes de editar rutas o textos.
2. Asegúrate de que el idioma por defecto (`es`) vive sin prefijo (`/`, `/lecciones/...`) y el inglés bajo `/en/` (`/en/...`).
3. Añade toda cadena UI nueva simultáneamente en los diccionarios `es` y `en` de `src/i18n/ui.ts` (evita texto hardcodeado en componentes compartidos como `Header.astro` o `Footer.astro`).
4. Mantén **sin traducir**: identificadores de código, palabras clave y especificadores de Verse (`var`, `set`, `<decides>`, `<transacts>`, `<suspends>`), y nombres propios de nodos Blueprint cuando actúen como término técnico de UE5 (añade aclaración en ES si aporta valor).
5. Verifica enlaces alternativos (`hreflang="es"`, `hreflang="en"`, `x-default`) y `<html lang>` en `BaseLayout.astro`.
6. Ejecuta `npm run build` y comprueba rutas generadas en `dist/`.

## Checklist
- [ ] Claves idénticas en `es` y `en` dentro de `src/i18n/ui.ts` (0 claves huérfanas).
- [ ] Ningún snippet Verse ni identificador de código traducido al español.
- [ ] Rutas ES sin prefijo `/es/` y rutas EN bajo `/en/` coherentes con `prefixDefaultLocale: false`.
- [ ] `<html lang>` y etiquetas `<link rel="alternate" hreflang="...">` correctas en cada página.
- [ ] `npm run build` finaliza con exit code 0 sin enlaces rotos entre idiomas.
```

### 7.3 `bp2verse-verse-snippet-verify`

```markdown
---
name: bp2verse-verse-snippet-verify
description: >-
  Verifica la validez sintáctica y semántica de snippets Verse en bp2verse
  frente a documentación oficial de Epic / verselang/book y los ejecuta en
  verse-js cuando aplican al navegador. Usar antes de publicar o modificar código Verse.
---

# Verificador de Snippets Verse

## Cuándo usarla
- Siempre que se añada o edite un bloque de código Verse en `src/`, `docs/` o lecciones.
- Al revisar PRs que modifiquen ejemplos del playground o ejercicios interactivos.

## Pasos
1. Clasifica el snippet según su alcance:
   - **Subconjunto ejecutable (`run: "browser"`):** lógica pura, tipos, `option`, fallo `<decides>` con `[ ]`, rollback `<transacts>`, `class`/`struct`/`interface`, `spawn`/`race`/`sync`.
   - **Dependiente de motor (`run: "uefn-only"`):** APIs de dispositivos Fortnite (`creative_device`, `player`) o **Scene Graph** (marcado Beta en UEFN / UE6).
2. Para snippets `run: "browser"`, ejecútalos contra el runtime `verse-js` del proyecto (`createHost().execute()`) y comprueba la salida esperada y el manejo de fallos (`[ ]` vs `( )`).
3. Para snippets `run: "uefn-only"` o características no cubiertas por `verse-js`, contrasta cada firma, efecto (`<decides>`, `<transacts>`, `<computes>`, `<suspends>`) y tipo contra la documentación oficial de Epic UEFN o el espejo `verselang/book` anotando versión y fecha.
4. Si una sintaxis o API de UE6 / Scene Graph no puede confirmarse ni ejecutarse en `verse-js`, **no la inventes**: márcala explícitamente con `[NO VERIFICADO]` y documenta la limitación (regla 1 de `AGENTS.md`).
5. Confirma que la UI del snippet o lección muestra el aviso de simulador cuando corresponda (ADR-005).

## Checklist
- [ ] Cero sintaxis de Verse inventada o inferida de otros lenguajes (recordar: llamadas `<decides>` usan `[ ]`, `var` requiere tipo explícito).
- [ ] Todo snippet `run: "browser"` ejecutado en `verse-js` con resultado verificado.
- [ ] Todo snippet `run: "uefn-only"` citado con URL oficial y fecha de verificación.
- [ ] Divergencias conocidas de `verse-js` (`int` como `number` JS > 2^53) advertidas si aplican al ejemplo.
- [ ] Etiqueta `[NO VERIFICADO]` presente donde falte confirmación primaria.
```

---

## 8. Bibliografía y fuentes verificadas

Todas las URLs y metadatos fueron verificados el **2026-11-19**:

1. **Agent Skills Specification (`agentskills/agentskills`):** https://agentskills.io — https://github.com/agentskills/agentskills (Apache-2.0, último push `2026-11-04`).
2. **Anthropic Skills (`anthropics/skills`):** https://github.com/anthropics/skills (ejemplos Apache-2.0 y skills documentales propietarios; último push `2026-11-16`).
3. **Vercel Skills CLI (`skills.sh` / `vercel-labs/skills`):** https://skills.sh — https://github.com/vercel-labs/skills (MIT, último push `2026-11-17`) y matriz de agentes [`docs/agents.md`](https://github.com/vercel-labs/skills/blob/main/docs/agents.md).
4. **Vercel Agent Skills (`vercel-labs/agent-skills`):** https://github.com/vercel-labs/agent-skills (último push `2026-11-12`) y [`vercel-labs/web-interface-guidelines`](https://github.com/vercel-labs/web-interface-guidelines) (MIT, último push `2026-10-05`).
5. **OpenAI Codex Docs / Plugins:** https://developers.openai.com/codex/skills — https://github.com/openai/plugins (último push `2026-11-18`) — https://github.com/openai/skills (**deprecado**, último push `2026-10-28`).
6. **Pi (`badlogic/pi-mono`):** https://pi.dev — https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/docs (verificado también con `pi --help` v`1.5.2`).
7. **Google Antigravity:** https://antigravity.google/docs/skills — https://antigravity.google/docs/rules-workflows — https://antigravity.google/docs/mcp — https://antigravity.google/docs/plugins (verificado también con `agy --help` v`1.5.11` y docs integradas locales).
8. **OpenCode:** https://opencode.ai/docs/skills (verificado también con `opencode --help` v`2.2.6`).
9. **Astro Docs MCP (`withastro/docs`):** https://docs.astro.build/en/guides/build-with-ai/ — endpoint `https://mcp.docs.astro.build/mcp` (`withastro/docs`, MIT, último push `2026-11-18`).
10. **Addy Osmani Web Quality Skills:** https://github.com/addyosmani/web-quality-skills (MIT, último push `2026-08-24`).
11. **Impeccable (`pbakaus/impeccable`):** https://github.com/pbakaus/impeccable (Apache-2.0, último push `2026-11-18`).
12. **Microsoft Playwright CLI & MCP:** https://github.com/microsoft/playwright-cli (Apache-2.0, último push `2026-11-18`) — https://github.com/microsoft/playwright-mcp (Apache-2.0, último push `2026-11-18`).
13. **Currents Playwright Best Practices:** https://github.com/currents-dev/playwright-best-practices-skill (MIT, último push `2026-11-08`).
14. **Superpowers (`obra/superpowers`):** https://github.com/obra/superpowers (MIT, último push `2026-11-03`).
15. **Chrome DevTools MCP:** https://github.com/ChromeDevTools/chrome-devtools-mcp (Apache-2.0, último push `2026-11-18`).
16. **Context7 MCP (`upstash/context7`):** https://github.com/upstash/context7 (MIT, último push `2026-11-18`).
17. **Marketing Skills (`coreyhaines31/marketingskills`):** https://github.com/coreyhaines31/marketingskills (MIT, último push `2026-11-18`).
18. **Technical Writer (`riekelt/technical-writer`):** https://github.com/riekelt/technical-writer (MIT, último push `2026-09-13`).
19. **Community Access (`Community-Access/accessibility-agents`):** https://github.com/Community-Access/accessibility-agents (MIT, último push `2026-11-16`).
20. **Catálogos e índices adicionales:** https://github.com/ComposioHQ/awesome-claude-skills (Apache-2.0 en README, último push `2026-09-18`) — https://github.com/travisvn/awesome-claude-skills (último push `2026-04-28`) — https://claudeskills.directory — https://github.com/daymade/claude-code-skills (MIT, último push `2026-11-18`) — https://github.com/delineas/astro-framework-agents (MIT, último push `2026-04-01`) — https://github.com/astrolicious/agent-skills (último push `2026-03-20`) — https://github.com/nicobailon/pi-mcp-adapter (MIT, último push `2026-11-18`).
