---
name: bp2verse-lessons
description: >-
  Contrato editorial y Definition of Done de las lecciones de bp2verse (M0-M10).
  Usar al redactar, traducir o revisar lecciones contrastivas Blueprints a Verse.
---

# Contrato editorial de lecciones (`bp2verse-lessons`)

## Cuándo usarla

- Al crear o editar una lección MDX para cualquier módulo (`M0`–`M10`) definido en `docs/research/04-curriculum.md`.
- Al traducir conceptos de `docs/reference/bp-verse-map.md` a contenido didáctico.
- Al revisar en PR si una lección cumple los 6 puntos del Definition of Done de `docs/PLAN.md`.

## Estructura obligatoria de una lección

1. **Patrón Blueprint reconocible:** abre con un patrón concreto de UE5 ("esto ya lo has hecho en Blueprints": evento, pines, variables, `Branch`, `Cast`, etc.). Nunca empieces como curso genérico de programación.
2. **Equivalente Verse anotado:** muestra el código Verse lado a lado con comentarios claros línea a línea. Identificadores y código siempre en inglés; explicaciones en el idioma de la lección.
3. **Trampa del migrante:** incluye una sección explícita explicando qué hábito de Blueprints falla o cambia en Verse (p. ej. `Cast` vs `<decides>` con `[]`, `var` sin tipo, división de `int`, `weak_map`).
4. **Micro-ejercicio (< 2 min):** define estado inicial, objetivo concreto, criterio de validación automática o estructural (feedback objetivo `< 2 s`) y solución comentada.
5. **Metadato `run` honesto:** etiqueta cada bloque ejecutable como `run: "browser"` (si ejecuta en `verse-js`) o `run: "uefn-only"` (si depende de dispositivos Fortnite, jugador o Scene Graph). Si es `browser`, muestra el aviso de simulador (ADR-005).
6. **Trazabilidad oficial:** incluye enlace a fuente primaria (UEFN Language/API Reference o Book of Verse), fecha de verificación y `verseVersion` cuando aplique. Si algo no se pudo comprobar en fuente oficial ni ejecutar, márcalo `[NO VERIFICADO]`.

## Definition of Done (6 puntos — `docs/PLAN.md`)

- [ ] Parte de un patrón reconocible de Blueprints ("esto ya lo has hecho").
- [ ] Incluye su equivalente en Verse anotado línea a línea.
- [ ] Contiene al menos una "trampa del migrante" explícita.
- [ ] Incluye un micro-ejercicio con feedback en `< 2 s`.
- [ ] Metadato `run` honesto (`"browser"` vs `"uefn-only"`); todo snippet `"browser"` ejecutado en `verse-js` (objetivo CI: 0 rotos).
- [ ] Fuente oficial enlazada y fecha de verificación actualizada (y `[NO VERIFICADO]` donde falte confirmación primaria).
