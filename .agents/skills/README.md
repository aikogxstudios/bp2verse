# Agent Skills de `bp2verse`

Paquete compartido de Agent Skills (`SKILL.md`) versionado en el repositorio.

## 1. Ruta compartida y descubrimiento multi-agente

Todas las skills del proyecto viven en **`.agents/skills/<id>/SKILL.md`**, la ruta estándar de [Agent Skills](https://agentskills.io) detectada de forma nativa por los cuatro agentes de la flota:

- **Pi:** `.agents/skills/` (walk-up hasta raíz git)
- **Codex CLI:** `.agents/skills/` (walk-up)
- **Antigravity (`agy`):** `.agents/skills/`
- **OpenCode:** `.agents/skills/`

Mantener una única carpeta versionada evita duplicar instrucciones en `.pi/`, `.codex/`, `.gemini/` o `.opencode/`.

## 2. Precedencia

1. **Skills de proyecto (`.agents/skills/`):** aplican específicamente a `bp2verse`. En caso de conflicto de convenciones (i18n, tokens CSS, contrato editorial, `verse-js`, verificación), **las reglas del repo (`AGENTS.md` y `bp2verse-*`) prevalecen** sobre skills genéricas globales o de sistema.
2. **Skills globales / de sistema:** viven fuera del repo (`~/.agents/skills/`, `~/.pi/agent/skills/`, `~/.codex/skills/`, `~/.gemini/config/skills/`, `~/.config/opencode/skills/`) y aportan capacidades transversales (p. ej. `review-agent` de Codex o `orquesta`).
3. **Revelación progresiva:** al iniciar sesión los agentes leen solo `name` y `description`; el cuerpo completo y `references/` se cargan únicamente cuando la tarea coincide.

## 3. Inventario actual (8 skills)

### Propias de `bp2verse` (4)

| Skill | Propósito | Archivo |
|---|---|---|
| `bp2verse-verse` | Reglas Verse sin inventar, trampas verificadas y snippets `verse-js` | [SKILL.md](bp2verse-verse/SKILL.md) |
| `bp2verse-lessons` | Contrato editorial y DoD de 6 puntos para lecciones M0–M10 | [SKILL.md](bp2verse-lessons/SKILL.md) |
| `bp2verse-web` | Convenciones Astro 7, i18n ES/EN, tokens CSS, a11y y CI | [SKILL.md](bp2verse-web/SKILL.md) |
| `bp2verse-verify` | Protocolo de verificación real (`test:verse`, `build`, `dist/`, Playwright) | [SKILL.md](bp2verse-verify/SKILL.md) |

### Vendorizadas de terceros (4 — MIT)

Procedentes de [`addyosmani/web-quality-skills`](https://github.com/addyosmani/web-quality-skills) (atribución y SHA en [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) y licencia en [LICENSE-web-quality-skills](LICENSE-web-quality-skills)):

| Skill | Propósito | Archivo |
|---|---|---|
| `accessibility` | Auditoría WCAG 2.2 AA, teclado, ARIA y foco | [SKILL.md](accessibility/SKILL.md) |
| `performance` | Optimización de carga, runtime y medición | [SKILL.md](performance/SKILL.md) |
| `seo` | SEO técnico, metadatos, canonicals y structured data | [SKILL.md](seo/SKILL.md) |
| `core-web-vitals` | Optimización de LCP, INP y CLS | [SKILL.md](core-web-vitals/SKILL.md) |

## 4. Cómo añadir una skill nueva

1. Crea `.agents/skills/<id>/SKILL.md` usando minúsculas, números y guiones en `<id>` (≤ 64 caracteres).
2. Incluye frontmatter YAML válido con al menos `name` (igual que `<id>`) y `description` (≤ 1024 caracteres, explicando qué hace y cuándo activarla).
3. Mantén el cuerpo conciso (`< 200` líneas), con instrucciones accionables y sin duplicar documentación extensa (usa `references/` si hace falta).
4. Verifica antes de hacer commit que el frontmatter es válido y que no existen enlaces relativos rotos.
5. Actualiza la tabla de inventario en este `README.md`.

## 5. Regla de auditoría antes de instalar skills de terceros

Nunca instales ni ejecutes un paquete externo de skills a ciegas:

1. **Licencia:** confirma una licencia permisiva compatible (MIT, Apache-2.0) y copia el texto íntegro en `.agents/skills/LICENSE-<origen>`.
2. **Inspección previa:** clona o descarga en `/tmp`, revisa todos los archivos y descarta `scripts/`, instaladores post-install o instrucciones que descarguen prompts remotos en tiempo de ejecución.
3. **Solo Markdown:** vendoriza únicamente `SKILL.md` y `references/` auditados.
4. **Trazabilidad:** registra repositorio, URL, **commit SHA exacto**, licencia y lista de archivos copiados en [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
