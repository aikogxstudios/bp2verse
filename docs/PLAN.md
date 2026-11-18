# Plan de bp2verse

> Versión 0.1 — 2026-11-19. Pendiente de aprobación del usuario.
> Basado en `docs/FACTS.md` y en los informes de `docs/research/`.

## 1. Posicionamiento

**La migración ya tiene fecha.** En Unreal Fest Tokyo (3 nov 2026) Epic confirmó que UE6 **elimina Blueprints, Actors y el C++ Gameplay Framework**; el gameplay se escribe en **Verse** sobre **Scene Graph**. La Early Access llega a finales de 2027.

Miles de devs de UE5 saben construir gameplay con nodos y no tienen un puente claro a texto. bp2verse es ese puente:

> **"Lo que ya sabes de Blueprints, ahora en Verse. Lado a lado, ejecutable en el navegador."**

No competimos con la documentación de Epic ni con el Book of Verse. Competimos con **empezar de cero**.

### Diferencias que importan

1. **Traducción, no introducción.** Cada lección parte de un patrón de Blueprint y muestra su equivalente en Verse.
2. **Se ejecuta.** El código de cada lección corre en el navegador. Nada de capturas muertas.
3. **Honestidad.** El playground simula un subconjunto de Verse; lo que solo funciona en UEFN se marca como tal.
4. **Abierto y corregible.** Markdown + PRs. Si Epic cambia la sintaxis, se arregla en un commit.

## 2. Público y recorrido

- **Perfil A (principal):** dev de UE5, 1-5 años de Blueprints, nunca ha escrito un lenguaje de gameplay "de verdad".
- **Perfil B:** artista técnico que evita C++ pero necesita lógica compleja.
- **Perfil C:** usuario de UEFN que ya copia snippets de Verse sin entenderlos.

Recorrido de 15 minutos que queremos que funcione el primer día:

1. Llega por un enlace a "Tu Blueprint de abrir puerta, en Verse".
2. Ve el grafo a la izquierda y el código a la derecha.
3. Pulsa **Run** y ve el resultado.
4. Cambia un valor, rompe el código, lee el error del checker.
5. Se apunta al módulo 0.

## 3. Producto v1 (alcance)

| Pieza | Qué es | Prioridad |
|---|---|---|
| **Lecciones** | 11 módulos / ~48 lecciones de 5-10 min | Alta |
| **Comparador BP ↔ Verse** | Componente lado a lado: grafo/nodos ↔ código con anotaciones | Alta |
| **Playground** | Monaco + `verse-js`: escribir, ejecutar, ver errores, depurar | Alta |
| **Ejercicios** | Validación con el checker + tests de comportamiento | Alta |
| **Progreso** | localStorage + export/import JSON | Media |
| **Referencia rápida** | Buscador "quiero hacer X en Verse" (cast, dispatcher, timeline…) | Media |
| **Glosario** | Término oficial EN → explicación ES → equivalente BP | Media |
| **i18n** | ES canónico, EN después | Baja (v1.1) |
| **Cuentas** | Solo si las métricas lo justifican | No en v1 |

### Qué NO es v1

- Un curso de programación desde cero.
- Un emulador de UEFN (no hay APIs reales de dispositivos).
- Un editor de proyectos de Unreal.
- Un sustituto del compilador de Epic.

## 4. Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Pages (estático, gratis, previews por PR)   │
│                                                         │
│  Astro 5 + TypeScript                                   │
│   ├── /                     landing + promesa           │
│   ├── /lecciones/[slug]     MDX + <CompareBP/>          │
│   ├── /playground           isla: Monaco + verse-js     │
│   ├── /referencia           tabla BP → Verse            │
│   └── /glosario             términos                    │
│                                                         │
│  verse-js (pineado, MIT) ── Web Worker ── Monaco        │
│  Progreso: localStorage                                 │
└─────────────────────────────────────────────────────────┘
        ▲                                   ▲
        │ git push                          │ PR preview
   GitHub (público) ──── GitHub Actions (lint, test, build)
```

### Decisiones propuestas

| # | Decisión | Motivo |
|---|---|---|
| ADR-001 | **Astro 5 + TS**, contenido en MDX | Estático, islas solo donde hace falta, ideal para contenido |
| ADR-002 | **Cloudflare Pages** | Estáticos ilimitados, previews por PR, salida a Workers si hace falta API |
| ADR-003 | **`verse-js` pineado + fork de seguridad** | Es el único runtime embebible real; MIT; verificado |
| ADR-004 | **Sin backend ni cuentas en v1** | localStorage; menos GDPR, menos coste, menos fricción |
| ADR-005 | **Disclaimer de simulador siempre visible** | No somos el compilador de Epic |
| ADR-006 | **CI ejecuta cada snippet de lección** | Si el código de una lección no corre, el build falla |

**Coste:** ~12 €/año (dominio). Todo lo demás, 0 €.

### El playground, sin mentir

- Motor: `verse-js` (subconjunto real: tipos, efectos, fallo transaccional, concurrencia).
- Lo que **no** puede hacer: APIs de dispositivos/jugador de UEFN, render, predicción de cliente.
- En cada lección, el snippet lleva metadatos: `run: "browser" | "uefn-only"`.
- Badge visible: **"Simulador — no es el compilador de Epic"** con enlace a UEFN.

## 5. Contenido

Currículo completo en `docs/research/04-curriculum.md`. Resumen:

| Módulo | Tema | Lecciones | Mini-proyecto |
|---|---|---|---|
| M0 | El puente: de nodos a texto | 4 | Contador de visitantes |
| M1 | Fundamentos: todo es expresión | 5 | Calculadora de daño |
| M2 | Tipos, fallo y opcionalidad | 5 | Inventario con rollback |
| M3 | Funciones y efectos | 4 | Reglas puras + logger |
| M4 | Clases, structs e interfaces | 5 | Armas intercambiables |
| M5 | Colecciones | 4 | Leaderboard |
| M6 | Concurrencia | 4 | Oleadas con temporizador |
| M7 | Gameplay y UI en UEFN | 5 | Marcador con récord |
| M8 | Depuración y calidad | 4 | Caza de bugs |
| M9 | Migración avanzada | 4 | Puerta con llave, portada |
| M10 | Proyecto final | 4 sprints | Arena por equipos |

### Contrato de una lección (Definition of Done)

Una lección no se publica si le falta:

1. Un patrón de Blueprint reconocible ("esto ya lo has hecho").
2. Su equivalente en Verse, anotado línea a línea.
3. Una "trampa del migrante" (lo que harías en BP y en Verse está mal).
4. Un micro-ejercicio con feedback en < 2 s.
5. El snippet ejecutado por CI (`verse-js`).
6. Fuente oficial enlazada y fecha de verificación.

## 6. Roadmap

| Fase | Duración | Entregable | Criterio de salida |
|---|---|---|---|
| **F0 — Esqueleto** | 2-3 días | Astro + CI + deploy en Cloudflare + landing | URL pública con "hello world" |
| **F1 — Playground** | 1 semana | Monaco + verse-js + Run/Stop + 5 ejemplos | `Print`, clases, fallo y `race` funcionan |
| **F2 — Vertical slice** | 2 semanas | M0 + M1 (9 lecciones) + comparador + progreso | Un dev de BP completa M0 sin ayuda |
| **F3 — Núcleo** | 3 semanas | M2-M4 (14 lecciones) + ejercicios validados | 80 % de ejercicios con test automático |
| **F4 — Avanzado** | 3 semanas | M5-M7 + referencia rápida + glosario | Búsqueda cubre 50 conceptos |
| **F5 — Cierre** | 2 semanas | M8-M10 + proyecto final + pulido | Lighthouse ≥ 95, 0 snippets rotos |
| **F6 — Lanzamiento** | 1 semana | EN de M0-M2, anuncio, analítica | 100 visitas primer mes |

Total realista: **10-12 semanas** de trabajo intermitente. No hay fecha límite impuesta; la EA de UE6 (finales 2027) da margen.

## 7. Riesgos y mitigaciones

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| `verse-js` se abandona | Media | Alto | Fork propio, versión pineada, tests de conformance; plan B: parser propio |
| El simulador enseña algo incorrecto | Media | Alto | CI ejecuta snippets; revisión contra docs; badge de "simulado" |
| Verse cambia antes de la EA | Alta | Medio | Contenido con `verseVersion` por lección; lecciones desacopladas del runtime |
| Epic saca su propio playground | Media | Medio | Nuestro valor es la traducción BP→Verse y el currículo, no el editor |
| Marca "Verse" / Epic | Baja | Medio | "Proyecto no afiliado", contenido original, licencias claras |
| El proyecto se queda a medias | Media | Alto | Vertical slice primero (M0-M1) antes de escalar |

## 8. Métricas

- **Activación:** % de visitantes que pulsan Run en su primera sesión.
- **Progreso:** % que termina M0 y vuelve en 7 días.
- **Calidad:** snippets rotos en CI (objetivo: 0).
- **Descubrimiento:** tráfico desde GitHub, r/unrealengine, Epic Dev Community.

## 9. Lo que necesito decidir contigo

1. **Nombre:** ¿`bp2verse`, `blueprint-to-verse`, otro?
2. **Dominio:** ¿lo compramos (`.dev`, `.com`) o empezamos con `*.pages.dev`?
3. **Cuenta de GitHub:** ¿org propia o repo en tu cuenta?
4. **Cloudflare:** ¿conectamos el repo ya o esperamos al vertical slice?
5. **Idioma:** ¿ES solo en v1 o ES+EN desde el principio?
6. **Licencia:** MIT (código) + CC BY-SA 4.0 (contenido) — ¿ok?
