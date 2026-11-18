# 04 — Investigación de referentes y propuesta de currículo para bp2verse

**Fecha de investigación:** 2026-11-19
**Idioma del documento:** español
**Alcance:** recursos existentes que enseñan Verse, técnicas para enseñar un lenguaje a quien ya domina otro paradigma, patrones UX de sitios de aprendizaje de código, propuesta de currículo, accesibilidad e i18n.

> **Nota metodológica.** La integración de búsqueda web del entorno devolvió resultados vacíos durante la investigación. Por ello se verificaron las fuentes con peticiones HTTP directas (`webfetch`) y con la API pública de GitHub. Los documentos de Epic son páginas Angular renderizadas en cliente y no exponen su contenido al.fetching simple: para esas URL se confirma la existencia y redirect canónico, y el enfoque/profundidad se infiere de los índices comunitarios y de los espejos legibles (`verselang/book`). Se marca `[V]` lo verificado por fetch, `[G]` lo verificado vía API de GitHub y `[C]` lo citado a partir de listas curadas / conocimiento establecido. No se ha instalado nada ni se ha tocado ningún archivo fuera de `bp2verse`.

---

## 1. Resumen ejecutivo

1. **Hay documentación, pero no hay un curso para desarrolladores de Blueprints.** Epic cubre muy bien la *referencia* (Book of Verse, Language Reference, API Reference, snippets) y el *onboarding* (Getting Started), y la comunidad tiene un libro abierto (Versus) e índices (awesome-verse, UnrealVerse). Ningún recurso enseña Verse **comparado lado a lado con Blueprints**, con ejercicios cortos y feedback, en español. Ese es el hueco de bp2verse. `[V][G][C]`
2. **El referente técnico más útil hoy no es la web de Epic, sino `verselang/book`.** Es un Book of Verse en Markdown (MkDocs Material), CC0, con ~348 estrellas, 42 forks, última actualización 2026-11-13, 19 capítulos y un índice de conceptos. Advertencia incluida: documenta la rama de desarrollo, puede incluir funcionalidades no liberadas. `[V][G]`
3. **Verse es un lenguaje de fallo y efectos, no "Blueprints con puntos y comas".** La diferencia conceptual que más rompe la intuición de quien viene de Blueprints es que el fallo es flujo de control (`<decides>`, `?`, `and/or/not`), que las mutaciones en contextos de fallo se revierten (`<transacts>`) y que los efectos (`<computes>`, `<reads>`, `<writes>`, `<suspends>`) son permisos comprobados por el compilador. Un curso que solo traduzca sintaxis fracasará; hay que traducir **modelos mentales**. `[V]`
4. **La técnica de enseñanza con más respaldo para este público es la comparación contrastiva + el cambio progresivo.** Los propios documentos de TypeScript ofrecen entradas separadas ("TS for JS Programmers", "TS for Java/C# Programmers", "TS for Functional Programmers"): el punto de partida del alumno determina la explicación. Aplicado aquí: cada lección parte de un nodo Blueprint, muestra el mismo programa en Verse, señala el error típico del migrante y termina con un micro-ejercicio. `[V][C]`
5. **La lección de 5–10 minutos que funciona es una sola idea, un solo archivo y una ejecución.** Patrón recomendado: enganche (30 s) → concepto con analogía (90 s) → lado a lado (90 s) → trampa del migrante (60 s) → micro-ejercicio con feedback inmediato (2 min) → solución comentada (90 s) → checkpoint (30 s). `[V][C]`
6. **El playground es la palanca de retención, pero no puede prometer más de lo que es.** Hoy Verse solo se compila dentro de UEFN; no existe compilador standalone oficial. El playground debe ser un *simulador didáctico* con feedback de conceptos y errores guiados, enlazando a UEFN para la ejecución real, y etiquetando claramente los ejecutables de "no soportado" cuando corresponda (`spawn`, APIs de Fortnite). `[V][C]`
7. **Propuesta: 11 módulos, 48 lecciones, 11 mini-proyectos y 1 proyecto final**, en español primero e inglés después, con código siempre en inglés. Ruta exprés para perfiles avanzados: M0 → M2 → M3 → M6 → M9.

### Decisiones de producto recomendadas

- **D1 — Contrato editorial:** toda lección incluye obligatoriamente (a) comparación lado a lado Blueprint↔Verse, (b) una "trampa del migrante" y (c) un micro-ejercicio con feedback en el playground. Sin los tres, no se publica.
- **D2 — Idioma y alcance:** español por defecto, inglés como segunda capa; el código y los identificadores siempre en inglés; los documentos de Epic se enlazan como "profundizar", nunca se compiten con ellos.
- **D3 — Motor de progreso:** currículo por mini-proyectos con pruebas `.versetest` como feedback verificable y un glosario vivo BP→Verse que reutilice la same-program table en todas las lecciones.

---

## 2. Referentes: quién enseña Verse hoy

Leyenda de profundidad: **baja** = divulgativo / lista de enlaces; **media** = tutoriales guiados; **alta** = cobertura sistemática del lenguaje; **muy alta** = referencia técnica completa.

| # | Recurso | URL | Origen / tipo | Enfoque | Profundidad | Idioma | ¿Asume experiencia previa? | Estado |
|---|---------|-----|---------------|---------|-------------|--------|----------------------------|--------|
| 1 | Create in Fortnite — Verse (Getting Started) | https://dev.epicgames.com/community/fortnite/getting-started/verse | Oficial / onboarding | " Primer script en UEFN", project-first | Media | EN (+ locales) | Sí: UEFN y editor | [C] |
| 2 | Learn programming with Verse in UEFN | https://dev.epicgames.com/documentation/en-us/uefn/learn-programming-with-verse-in-unreal-editor-for-fortnite | Oficial / tutorial | Introducción guiada al lenguaje dentro del editor | Media | EN / es | Sí: nociones de programación | [C] |
| 3 | Book of Verse (docs Epic) | https://dev.epicgames.com/documentation/en-us/uefn/book-of-verse (redirect → `/documentation/fortnite/book-of-verse?lang=en-US`) | Oficial / libro | Filosofía + conceptos del lenguaje | Alta | EN / es, fr, de, ja, ko, zh… | Sí: sabe programar | [V] |
| 4 | Book of Verse (espejo `verselang/book`) | https://verselang.github.io/book/ · https://github.com/verselang/book | Comunidad / MkDocs, CC0, 348★ | 19 capítulos: expresiones, primitivos, contenedores, operadores, mutabilidad, funciones, control, fallo, structs/enums, clases/interfaces, tipos, acceso, efectos, concurrencia, live vars, módulos, persistencia, evolución, Runtime API + índice | Muy alta | EN | Sí: nivel medio-avanzado; advierte de features no liberadas | [V][G] |
| 5 | Verse Language Reference | https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference | Oficial / referencia | Sintaxis y reglas formales del lenguaje | Muy alta | EN / es | Sí | [C] |
| 6 | Verse Language Quick Reference | https://dev.epicgames.com/documentation/en-us/uefn/verse-language-quick-reference | Oficial / cheat sheet | Tablas rápidas de sintaxis | Baja | EN / es | Sí | [C] |
| 7 | Verse API Reference | https://dev.epicgames.com/documentation/en-us/uefn/verse-api | Oficial / referencia API | API de Verse/UEFN/Fortnite | Muy alta | EN / es | Sí: Verse previo | [C] |
| 8 | Code Snippet Repository | https://dev.epicgames.com/community/fortnite/snippets | Oficial / ejemplos | Snippets clasificados (building block, learning example…) | Media | EN | Parcial | [V] |
| 9 | Versus — community Verse book | https://verse-book.netlify.app · https://github.com/glinesbdev/versus | Comunidad / Honkit, MIT, 23★ | "Learn Verse from scratch or deepen existing knowledge"; con UEFN essentials | Media | EN | No (pero muy desactualizado: último push 2023-04) | [V][G] |
| 10 | BookOfVerse (traducción EN/ZH) | https://github.com/60994859/BookOfVerse | Comunidad / MkDocs, CC0, 2026-06 | Espejo traducido del Book of Verse **con batería de tests `.versetest`** y lexer Pygments | Alta | ZH / EN | Sí | [V][G] |
| 11 | UnrealVerse | https://github.com/VerseMetaVerse/UnrealVerse | Comunidad / índice curado, MIT, 134★ | Rutas de aprendizaje por documentos y vídeos; Verse, Visual Verse, Blueprints, C++ | Baja-media | EN | No | [V][G] |
| 12 | awesome-verse | https://github.com/spilth/awesome-verse | Comunidad / lista curada, 83★ | Oficial, código, Discord, Reddit, YouTube, fundamentos | Baja | EN | No | [V][G] |
| 13 | VerseReferenceExplorer | https://github.com/cronofear-dev/VerseReferenceExplorer | Comunidad / extensión VS Code, 21★ | Explorador visual de la referencia Verse | Baja (herramienta) | EN | Sí | [V][G] |
| 14 | verse-mcp | https://github.com/BurgersJackson/verse-mcp | Comunidad / servidor MCP, 4★, 2026-03 | Docs y API reference de Verse para agentes | Baja (herramienta) | EN | Sí | [V][G] |
| 15 | Fortnite Sensei · Wahlbeck Warforge · Pi Equals Three · Unreal Engine | https://www.youtube.com/@fortnite_sensei · https://www.youtube.com/@WarforgeXP · https://www.youtube.com/@piequalsthree3200 · https://www.youtube.com/@UnrealEngine | Comunidad / vídeo | Tutoriales de islas y código Verse | Baja-media | EN | No | [V][G] |
| 16 | Simon Peyton Jones — charlas y paper | https://www.youtube.com/watch?v=OJv8rFap0Nw · https://www.youtube.com/watch?v=832JF1o7Ck8 · https://simon.peytonjones.org/assets/pdfs/verse-March23.pdf | Oficial/académico | "Beyond functional programming: a taste of Verse"; Verse Calculus | Muy alta (teoría) | EN | Sí: fondo funcional/lógica | [V][G] |
| 17 | Discord / Reddit | https://discord.gg/fortnitecreative · https://discord.gg/thelabfn · https://www.reddit.com/r/FortniteCreative/ · https://www.reddit.com/r/uefn/ | Comunidad | Resolución de dudas, bugs, añadidos | Variable | EN | No | [V][C] |
| 18 | `kbfngg/uefn` digests | https://github.com/kbfngg/uefn | Comunidad / diff de API | `Verse.digest.verse`, `UnrealEngine.digest.verse`, `Fortnite.digest.verse` | Muy alta | EN | Sí: avanzado | [V][G] |

### Análisis de huecos (la oportunidad de bp2verse)

| Necesidad del alumno BP | Qué existe hoy | Hueco |
|---|---|---|
| "¿Dónde está mi nodo Branch en Verse?" | Referencia de sintaxis y charlas | **Ninguna tabla sistemática BP→Verse** con ejemplos ejecutables |
| Aprender en español | Book of Verse tiene traducciones parciales | No hay **curso** en español con progresión y práctica |
| Práctica con feedback | Snippets y tests del mirror chino | No hay **ejercicios cortos** con corrección automática orientados a migrantes |
| Entender fallo/efectos/Concurrencia | Capítulos excelentes pero densos | Falta la **versión de 5–10 min** con analogías de Blueprints |
| Ruta ordenada | Listas de enlaces y vídeos desordenados | Falta un **roadmap con proyectos y criterios de aceptación** |

---

## 3. Enseñar un lenguaje a quien ya programa en otro paradigma

### 3.1 Técnicas que funcionan

| Técnica | En qué consiste | Referente | Aplicación en bp2verse |
|---|---|---|---|
| **Entradas por paradigma previo** | Guías distintas según el origen del alumno, no un único "getting started" | [TypeScript for JS Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html), [TS for Java/C#](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html), [TS for Functional](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html) | Portada con selector: "Vengo de Blueprints / de C++ / de Python"; la ruta BP es la principal |
| **Mismo programa, dos lenguajes** | Un único ejemplo funcional escrito en ambos lenguajes, con líneas alineadas | Rosetta Code, [Go by Example](https://gobyexample.com/) | Cada lección muestra el grafo BP (o pseudo-nodos) y el Verse equivalente, con anotación línea a línea |
| **Mapa de conceptos (traducción)** | Tabla deliberada de "X en tu lenguaje = Y en el nuevo" | Guías de migración de la handbook de TS | Glosario vivo BP→Verse reutilizado en todas las lecciones (ver 3.2) |
| **Contraste de errores ("gotchas")** | Mostrar explícitamente lo que el alumno escribiría por costumbre y por qué falla | [Learn Rust the Dangerous Way](https://cliffle.com/blog/learn-rust-dangerous-way/) (C→Rust) | Bloque recurrente "Trampa del migrante" con error real del compilador y su explicación |
| **Usar → Modificar → Crear** | El alumno ejecuta, luego cambia una variable, luego crea su propia variante | Lee et al., *Computational thinking and programming* (2011) | Micro-ejercicio en 3 pasos: ejecutar el snippet, cambiar un parámetro, escribir una variante |
| **Ejemplos trabajados con desvanecido** | Primero código completo y explicado; luego código con huecos; luego código desde cero | Sweller (carga cognitiva); Atkinson & Renkl (worked examples) | Lecciones 1–3: código comentado; 4–5: completar huecos; proyecto: desde cero |
| **Etiquetado de subobjetivos** | Nombrar cada bloque con una función ("validar", "calcular", "publicar") | Estudios de subgoal labeling | Los bloques Verse llevan comentarios con nombre de subobjetivo en inglés |
| **Problemas de Parsons** | Reordenar fragmentos de código en lugar de escribirlos | Parsons & Haden (2006) | Ejercicio "ordena las 5 líneas de un `<decides>`" en el playground |
| **Práctica de recuperación y espaciado** | Preguntas sin ver la respuesta, repaso en lecciones posteriores | Roediger & Karpicke (2006) | "Checkpoint" al final y "repaso relámpago" al inicio de las lecciones 3, 6, 9 |
| **Feedback inmediato** | El entorno dice si acertaste en segundos | [Rustlings](https://rustlings.cool/) (errores del compilador como profesor), [Exercism](https://exercism.org/) (análisis automático + mentoría), [LeetCode](https://leetcode.com/) (juez) | Playground con tres salidas: compila / no compila, pista gradual, solución comentada |
| **Proyectos verticales** | Cada módulo entrega algo jugable, no un ejercicio aislado | freeCodeCamp, roadmap.sh "Project Ideas" | Un mini-proyecto por módulo, reutilizado por el siguiente |

### 3.2 Tabla de traducción propuesta (Blueprints → Verse)

> **Propuesta editorial**, a validar contra la documentación oficial antes de publicar cada lección. Es el glosario vivo del producto.

| Blueprints (UE5) | Verse (UEFN / UE6) | Nota conceptual |
|---|---|---|
| `Branch` (true/false) | `if (Condición): … else: …` | En Verse la condición es un **contexto de fallo**, no un booleano suelto |
| `Sequence`, ejecución por cables blancos | Secuencia de expresiones; `sync` si son concurrentes | El orden de ejecución existe, pero `sync` cambia el modelo |
| `ForEachLoop` | `for (Item : Items): …` | Los domains pueden incluir expresiones fallables: filtran automáticamente |
| `WhileLoop` | `loop:` + `break` | Un bucle sin punto de suspensión no se puede cancelar |
| Variable Get / Set | `X := valor` / `set X = valor` | `set` solo sobre `var`; el ámbito es más estricto |
| `IsValid` + Branch | `if (Valor := Opción?):` | La comprobación y el acceso son **una sola operación** |
| `Cast To X` | `X[valor]` con `<castable>` | El cast es una operación `<decides>`: falla o devuelve el valor tipado |
| `Struct` | `struct` | Valor por copia; sin identidad |
| `Blueprint Class` (Actor/Component) | `class` | Identidad, herencia y campos privados |
| `Blueprint Interface` | `interface` | Contrato; `class` lo implementa |
| Función pura | `<computes>` | El compilador exige declarar qué puede hacer |
| Función con `Set` sobre miembros | `<reads>`, `<writes>`, `<transacts>` | Efectos = permisos; `<transacts>` da rollback si falla |
| `Delay` / `Timer` | `Sleep(s)` con `<suspends>` | El efecto se propaga por la cadena de llamadas |
| `Timeline` | `sync` / `race` / `rush` + `Sleep` | Concurrencia estructurada, no un widget de curvas |
| `Event Dispatcher` | `event(t)`, `Signal`, `Await` | Rendezvous uno a uno; sin cola |
| Widget / HUD | UI devices + Verse que actualiza texto | El buffer de pantalla no es directamente un Widget BP |
| Array | `[]t` | Indexar fuera de rango **falla**, no devuelve null |
| Map | `[Clave]Valor` | La búsqueda falla si no existe la clave |
| `Break` antes de continuar | `<decides>` + fallo | "No puedo continuar" se expresa como fallo, no como early return |

### 3.3 Errores frecuentes del migrante (contenido recurrente)

1. Escribir `if (X > 0)` esperando un booleano: en contexto de fallo la comparación **produce su lado izquierdo** y falla si es falsa.
2. Usar `?` fuera de un contexto de fallo → error de compilación.
3. Comparar `?int` con `int` directamente: compila pero **nunca sucede**; hay que desenvolver con `?`.
4. Confundir `option{1, 2}` (tupla) con `option{1; 2}` (secuencia, se queda el último valor).
5. Olvidar `set` para mutar una variable `var`.
6. Llamar a una función `<decides>` desde código normal sin `if`/`or` → fallo no manejado.
7. Esperar que un `spawn` herede el ciclo de vida como un `branch`: `spawn` sobrevive al ámbito; `branch` se cancela.
8. Poner `return` dentro de un brazo de `sync`/`race`: devuelve de la **función**, no del brazo; en `spawn`/`branch`/`defer` está prohibido.
9. Asumir que los efectos se infieren como en Blueprints: hay que declararlos.
10. Esperar depuración paso a paso idéntica a Blueprints: aquí manda `Print`, el error del compilador y los tests.

---

## 4. Patrones UX de sitios de aprendizaje de código

| Sitio | Patrón que hace bueno | Qué copiar en bp2verse | Qué **no** copiar |
|---|---|---|---|
| [roadmap.sh](https://roadmap.sh/) | Roadmap visual de una sola página, agrupado por roles/habilidades, con nodos que enlazan a recursos; changelog público; open-source en GitHub | Mapa de 11 módulos como grafo navegable; "Lesson Packs" = rutas exprés por perfil; changelog visible | Listas infinitas de enlaces sin progresión; obsesión por "roadmap de carrera" |
| [Exercism](https://exercism.org/) | 85 tracks, ~8.900 ejercicios, CLI-first **y** editor web, análisis automático + mentoría humana, favoritos | Editor en navegador + feedback automático; ejercicios reutilizables entre módulos; guardar soluciones favoritas | Mentoría humana como dependencia (coste); exigir instalación de toolchain para empezar |
| [LeetCode](https://leetcode.com/) | Juez instantáneo, filtros por dificultad, reto diario, historial de envíos, discusión por problema | Botón "Ejecutar" con resultado inmediato; dificultad por lección; "Reto del día" opcional | Competición/ranking agresiva: el público viene a migrar, no a competir |
| [Go by Example](https://gobyexample.com/) | Un concepto = un programa completo, mínimo y anotado; índice largo y lineal; empezar por "Hello World" | Formato de lección: un archivo, ≤40 líneas, comentarios explicativos, índice plano complementario al roadmap | Ejemplos sin ejecución ni verificación; prosa densa |
| [Rustlings](https://rustlings.cool/) | Ejercicios diminutos que se resuelven **leyendo el error del compilador**; se recomienda en paralelo al libro oficial | "Depurando errores reales de Verse" como columna vertebral del módulo 8 y de loscheckpoints | Asumir que el alumno ya tiene el compilador local |
| [mdBook](https://rust-lang.github.io/mdBook/) | Markdown, búsqueda integrada, resaltado sintáctico, navegación con ←/→, `S` para buscar, `?` para ayuda, versión imprimible | Base del formato de contenido: Markdown + búsqueda + navegación por teclado + "imprimir" |	forzar un stack específico; el playground será propio |
| [freeCodeCamp](https://www.freecodecamp.org/) | Gratuito, certificaciones por proyectos, editor en navegador con tests, vídeo + texto, foro enorme | Mini-proyecto por módulo con tests observables; transcripción de cada vídeo; foro/enlace a Discord | Curso demasiado largo antes de la primera victoria; curriculum monolítico |

### 4.1 Anatomía de una lección de 5–10 minutos

| Tiempo | Bloque | Regla editorial |
|---|---|---|
| 0:00–0:30 | **Enganche** | Empieza por el nodo/blueprint que el alumno ya conoce. Una frase: "Esto que haces con un Branch, en Verse es…" |
| 0:30–2:00 | **Concepto** | Una sola idea. Una analogía. Máximo 3 párrafos cortos (~150 palabras en español) |
| 2:00–3:30 | **Lado a lado** | Dos paneles: BP (pseudo-grafo o nodos) y Verse real, número de línea coincidente. Botón "copiar" |
| 3:30–4:30 | **Trampa del migrante** | El error real que cometería un desarrollador BP + mensaje del compilador + por qué |
| 4:30–6:30 | **Micro-ejercicio** | Usar→Modificar→Crear en el playground. Feedback en <2 s. Pistas en cascada (3 niveles) |
| 6:30–8:30 | **Solución y variante** | Solución comentada línea a línea + "¿qué pasa si cambias…?" |
| 8:30–10:00 | **Checkpoint** | 1 pregunta de recuperación + 1 frase de cierre + enlace "Profundizar en Book of Verse §X" |

**Restricciones duras:** 1 objetivo de aprendizaje por lección; 1 archivo de código; ≤40 líneas; 300–600 palabras en español; sin modales; sin vídeo autoplay; progreso persistente; los ejemplos de código se pueden copiar y pegar tal cual; cualquier función no liberada lleva la etiqueta `no soportado en UEFN`.

---

## 5. Currículo propuesto

**Total:** 11 módulos · 48 lecciones · 11 mini-proyectos · 1 proyecto final.
**Tiempo estimado:** ~8 h de lecciones (48 × 8–10 min) + ~12–18 h de proyectos = ~20–26 h.
**Ruta exprés (BP experimentado, ~6 h):** M0 → M2 → M3 → M6 → M9 → proyecto final.

| # | Módulo | Lecciones | Mini-proyecto |
|---|---|---|---|
| M0 | Tu primer puente: de nodos a texto | 4 | Contador de visitantes |
| M1 | Fundamentos: todo es expresión | 5 | Calculadora de daño |
| M2 | Tipos, fallo y opcionalidad | 5 | Inventario seguro |
| M3 | Funciones y efectos | 4 | Reglas puras + registro |
| M4 | Clases, structs e interfaces | 5 | Sistema de armas |
| M5 | Colecciones | 4 | Leaderboard |
| M6 | Concurrencia: Delays y Timelines en Verse | 4 | Oleadas con temporizador |
| M7 | Gameplay e interfaz en UEFN | 5 | Marcador con récord persistente |
| M8 | Depuración y calidad | 4 | Bug hunt + suite de pruebas |
| M9 | Migración avanzada: tu Blueprint, traducido | 4 | Puerta con llave portada |
| M10 | Proyecto final: La Isla | 4 (sprints) | Arena por equipos |

---

### M0 — Tu primer puente: de nodos a texto

**Objetivo:** que el alumno traduzca sus primeros tres nodos mentales a Verse y ejecute un script real en UEFN en menos de 30 minutos.
**Puente BP:** "Un Blueprint es un grafo de eventos; un script Verse es una secuencia de expresiones que devuelven valores."

**Lecciones**
- `M0-L1` Por qué Verse (y por qué ahora): UE5, UEFN y la convergencia a UE6; mismo programa, dos lenguajes.
- `M0-L2` Traduce tu primer `Branch`: de bool a contexto de fallo.
- `M0-L3` Entorno: UEFN + VS Code + dónde vive un archivo `.verse`.
- `M0-L4` `Print`, `:=` y tu primera isla.

**Ejercicio:** arrastra tres nodos sueltos (`Branch`, `Print String`, `Set Variable`) a su equivalente Verse en el playground.
**Mini-proyecto — *Contador de visitantes*:** al entrar un jugador, imprime su nombre y aumenta un contador en la consola.
**Criterio de aceptación:** el script compila en UEFN y el contador aparece en el log.

---

### M1 — Fundamentos: todo es expresión

**Objetivo:** internalizar que en Verse casi todo produce un valor y que la mutabilidad es explícita.
**Puente BP:** "En Blueprints el cable blanco manda ejecutar; en Verse la última línea de un bloque es su resultado."

**Lecciones**
- `M1-L1` Expresiones vs sentencias: el valor de un bloque y de un `if`.
- `M1-L2` Primitivos: `int`, `float`, `logic`, `string`, `void` y comentarios `#`.
- `M1-L3` Operadores y precedencia; `=` Compara, `:=` define, `set` muta.
- `M1-L4` Control de flujo: `if`/`else`, `for`, `loop`, `block`, `defer`.
- `M1-L5` Mutabilidad: `var`, ámbito y por qué no hay un "Set" global.

**Ejercicio:** cinco preguntas de predicción ("¿qué imprime este bloque?") sin ver la solución.
**Mini-proyecto — *Calculadora de daño*:** función que recibe daño base y bonificación, aplica límites y devuelve el daño final.
**Criterio de aceptación:** cuatro casos de prueba pasan, incluido el valor límite.

---

### M2 — Tipos, fallo y opcionalidad

**Objetivo:** hacer del fallo la herramienta natural de control de flujo, y dominar `?t` sin confundirlo con `null`.
**Puente BP:** "El pin de ejecución que no se dispara es un fallo; `if (X := …)` es un Branch que valida y extrae a la vez."

**Lecciones**
- `M2-L1` `struct`, `enum` y tipos con parámetros: datos sin comportamiento.
- `M2-L2` Fallo como control de flujo: `<decides>`, `?`, `and`/`or`/`not`.
- `M2-L3` Contextos de fallo y ejecución especulativa: `<transacts>` y rollback automático.
- `M2-L4` Option types: `?t`, `option{…}`, `false`, `?`, `?.`, `or` para valores por defecto.
- `M2-L5` Errores frecuentes: comparar opcional vs valor, `?` fuera de contexto, coma vs punto y coma.

**Ejercicio:** seis fragmentos que no compilan: el alumno debe explicar el error antes de ver la pista.
**Mini-proyecto — *Inventario seguro*:** buscar un objeto, validar que existe y comprar; si la validación falla, el oro no se modifica.
**Criterio de aceptación:** test de rollback: compra fallida deja `Gold` exactamente igual.

---

### M3 — Funciones y efectos

**Objetivo:** saber declarar qué puede hacer una función y por qué el compilador es un guardián, no un estorbo.
**Puente BP:** "Una función pura de Blueprint es como `<computes>`; una que escribe variables es `<writes>`; una transacción es `<transacts>`."

**Lecciones**
- `M3-L1` Funciones abiertas `F[]` y cerradas `F()`; parámetros y retorno.
- `M3-L2` Efectos como permisos: `<computes>`, `<reads>`, `<writes>`, `<transacts>`, `<suspends>`.
- `M3-L3` Pureza, composición de `<decides>` y propagación de fallo.
- `M3-L4` Módulos y rutas: organizar el código como organizas carpetas de contenido.

**Ejercicio:** anotar el efecto correcto a ocho funciones dadas (con feedback inmediato).
**Mini-proyecto — *Reglas puras + registro*:** separar el cálculo de daño (`<computes>`) del log de eventos (`<writes>`).
**Criterio de aceptación:** cambiar el logger no altera ningún resultado de las reglas.

---

### M4 — Clases, structs e interfaces

**Objetivo:** elegir el tipo correcto para cada dato y entender la identidad frente al valor.
**Puente BP:** "Un Struct BP es `struct`; un Blueprint Class es `class`; una Blueprint Interface es `interface`."

**Lecciones**
- `M4-L1` `class` vs `struct`: identidad, copia y cuándo usar cada uno.
- `M4-L2` Campos, inicialización, herencia y `<override>`.
- `M4-L3` `interface`: contratos y múltiples implementaciones.
- `M4-L4` Especificadores de acceso: `<public>`, `<protected>`, `<private>`, `<internal>`.
- `M4-L5` Casting con `<castable>` y despacho por tipo con `if (T := Type[X])`.

**Ejercicio:** decidir `struct` o `class` para seis casos (punto, jugador, hechizo, item…).
**Mini-proyecto — *Sistema de armas intercambiables*:** interfaz `weapon`, tres implementaciones y una lista polymorphic.
**Criterio de aceptación:** añadir una cuarta arma no requiere tocar el bucle que las usa.

---

### M5 — Colecciones

**Objetivo:** manejar arrays, maps y tuplas con el fallo como mecanismo de búsqueda y filtro.
**Puente BP:** "El `ForEachLoop` con un Branch dentro se convierte en un `for` con una condición fallable en el domain."

**Lecciones**
- `M5-L1` Arrays `[]t`: indexación failable, concatenación y recorrido.
- `M5-L2` Maps `[K]V`: búsqueda que falla y valores por defecto con `or`.
- `M5-L3` Tuplas y `?t` como contenedor; anidación y acceso encadenado.
- `M5-L4` Mutabilidad y copias; patrones de filtrado y `first`.

**Ejercicio:** reescribir un `ForEachLoop` + `Branch` como un solo `for` con domain fallable.
**Mini-proyecto — *Leaderboard*:** top 5 de jugadores, búsqueda por nombre y manejo de nombre ausente.
**Criterio de aceptación:** nombre inexistente produce un mensaje, nunca un crash.

---

### M6 — Concurrencia: Delays y Timelines en Verse

**Objetivo:** elegir el constructo concurrente correcto y razonar sobre cancelación.
**Puente BP:** "Un `Delay` es `Sleep`; una Timeline es `sync`/`race`; un `Set Timer by Event` es `spawn` + evento."

**Lecciones**
- `M6-L1` Inmediato vs asíncrono; `<suspends>`, ticks y propagación del efecto.
- `M6-L2` `sync` (todos), `race` (primero y cancela), `rush` (primero sin cancelar).
- `M6-L3` `branch` vs `spawn`; `task(t)`, `Await`, cancelación cooperativa y `defer`.
- `M6-L4` Eventos `event(t)`, timeouts con `race` y la trampa del `return` en brazos.

**Ejercicio:** cinco escenarios (cargar assets, timeout de input, música de fondo, guardar partida, oleadas) → elegir `sync`/`race`/`rush`/`branch`/`spawn`.
**Mini-proyecto — *Oleadas con temporizador*:** spawn de enemigos cada N segundos con cancelación limpia al terminar la ronda.
**Criterio de aceptación:** al cancelar, ninguna tarea hija sigue emitiendo logs (verificado con `defer`).

---

### M7 — Gameplay e interfaz en UEFN

**Objetivo:** conectar el código con dispositivos, jugadores y pantalla.
**Puente BP:** "Aquí el grafo se vuelve dispositivo: eventos de dispositivo → funciones Verse → HUD."

**Lecciones**
- `M7-L1` Dispositivos y eventos: suscribirse a señales del mundo.
- `M7-L2` HUD/UI: actualizar texto en pantalla desde Verse.
- `M7-L3` Estado del jugador y tipos persistibles (`persistable`).
- `M7-L4` Variables vivas (`live`) y actualización reactiva.
- `M7-L5` Interoperabilidad con Blueprints: qué exponer y qué migrar primero.

**Ejercicio:** cablear dos dispositivos (botón + popup) al manejador Verse correcto en un diagrama interactivo.
**Mini-proyecto — *Marcador con récord persistente*:** puntos en HUD y mejor puntuación guardada entre sesiones.
**Criterio de aceptación:** el récord sobrevive a recargar la isla en el editor.

---

### M8 — Depuración y calidad

**Objetivo:** convertir errores en información, y dar al alumno un método reproducible.
**Puente BP:** "En Blueprints veías el nodo rojo; aquí el compilador te dice qué efecto o contexto de fallo falta."

**Lecciones**
- `M8-L1` Leer errores del compilador Verse: efectos, contextos de fallo y sobrecargas.
- `M8-L2` `Print`, logging y trazas; por qué "no pasa nada" suele ser un fallo silencioso.
- `M8-L3` Pruebas `.versetest`: usar los tests del espejo del Book of Verse como plantilla.
- `M8-L4` Checklist de revisión del migrante y anti-patrones.

**Ejercicio — *Bug hunt*:** diez fallos sembrados en un snippet; el alumno los encuentra con pistas progresivas.
**Mini-proyecto — *Suite de pruebas del inventario*:** convertir los criterios de aceptación de M2 en pruebas ejecutables.
**Criterio de aceptación:** la suite pasa y falla a propósito al cambiar una condición.

---

### M9 — Migración avanzada: tu Blueprint, traducido

**Objetivo:** migrar un Blueprint real completo sin perder comportamiento, y decidir cuándo **no** migrar.
**Puente BP:** "Este módulo es la promesa del producto: abre tu Blueprint, cierra el editor de Blueprints, escribe Verse."

**Lecciones**
- `M9-L1` Una máquina de estados de Blueprint → Verse (estado como `enum` + transiciones `<decides>`).
- `M9-L2` Timelines y Widgets → `<suspends>` + UI devices.
- `M9-L3` Interoperabilidad BP↔Verse: límites, coste y cuándo mantener el BP.
- `M9-L4` Checklist final de migración y anti-patrones del traductor literal.

**Ejercicio:** traducir un Blueprint real de ~20 nodos con la tabla de M0 como referencia.
**Mini-proyecto — *Puerta con llave portada*:** mismo comportamiento, script Verse + un BP residual que delega.
**Criterio de aceptación:** comparación lado a lado de comportamiento (tabla de casos) sin regresiones.

---

### M10 — Proyecto final: La Isla

**Objetivo:** integrar todo en un proyecto publicable y defender las decisiones de diseño.
**Puente BP:** "El proyecto final es el Blueprint que ya habías hecho, reescrito como sistema Verse."

**Lecciones (sprints)**
- `M10-L1` Sprint 1 — Diseño: descomposición en módulos y mapa BP→Verse en una página.
- `M10-L2` Sprint 2 — Implementación: jugadores, armas, oleadas, HUD y persistencia.
- `M10-L3` Sprint 3 — Pruebas, depuración y pulido (usa la suite de M8).
- `M10-L4` Sprint 4 — Publicación: README, capturas y presentación de 3 minutos.

**Ejercicio:** definir el alcance en una página (qué se migró, qué se dejó en Blueprints y por qué).
**Proyecto final — *Arena por equipos*:** jugadores con armas intercambiables, oleadas concurrentes con temporizador, marcador persistente en HUD, inventario con rollback y suite de pruebas.
**Rúbrica (100 pts):** corrección 30 · uso idiomático de fallo/efectos 25 · concurrencia y cancelación 15 · pruebas 15 · accesibilidad del README y claridad de la presentación 15.

---

## 6. Accesibilidad e i18n

### 6.1 Política de idiomas

- **Español primero**: `/es/` (o `/` como raíz en español) es la ruta canónica; `/en/` se publica después, con paridad de lecciones antes de anunciar el inglés.
- **Español neutro**: evitar modismos de España o LatAm en explicaciones; tratar "tú" de forma informal y consistente; glosario único de términos (`fallo`, `opción`, `efecto`, `dispositivo`, `oleada`).
- **Código siempre en inglés**: identificadores, nombres de archivos, mensajes de `Print` en ejemplos y comentarios de código van en inglés. Se traduce la prosa, nunca el snippet. El.glosario es bilingüe: `Branch → if (failure context)`, option → `?t`.
- **Nombres propios intactos**: `Verse`, `Blueprints`, `Unreal Engine`, `UEFN`, `Fortnite`, `Epic Games`. "Blueprint" en singular se escribe con mayúscula cuando es el tipo; "blueprint" en minúscula solo en usos genéricos deliberados (evitar).
- **Etiquetas de features**: `no liberado / unreleased` cuando el Book of Verse lo marca; el alumno debe saber si puede ejecutarlo en UEFN.

### 6.2 Naming del producto

- Nombre canónico: **`bp2verse`**, siempre en minúsculas, sin espacios ni guiones en el identificador (slug de URL, repo, paquete). Nunca `BP2Verse`, `Bp2Verse` ni `bp2verse.dev` si no es el dominio elegido.
- Tagline: **"Lo que ya sabes de Blueprints, ahora en Verse."** En inglés: "Everything you know from Blueprints, now in Verse."
- Identificadores de contenido: `M02-L04` (módulo-lección), carpetas `modules/m02-failure/l04-option-types/`, bloques `m2-l4-trampa`.
- Componentes de UI (código en inglés): `LessonHeader`, `SideBySide`, `MigrationTrap`, `PlaygroundPanel`, `Checkpoint`. El texto visible se localiza; el nombre del componente no.
- Idioma del `lang` HTML: `es` por defecto, `en` en la ruta inglesa; bloques de código con `lang="verse"` y `aria-label` localizado ("Ejemplo en Verse").

### 6.3 Accesibilidad (objetivo WCAG 2.2 AA)

- **Comparación lado a lado accesible**: usar una tabla semantics con `th` ("Blueprints", "Verse") o dos regiones con encabezados; en móvil y con zoom al 200 % se apilan verticalmente. Nunca depender de columnas visuales sin estructura.
- **No solo color**: los resaltados de sintaxis y los errores llevan también icono y texto ("error", "advertencia", "no liberado"). Contraste ≥ 4.5:1 en texto normal.
- **Teclado**: toda la navegación, el playground y los controles de pista funcionan con Tab/Enter/Esc; atajos documentados en `?` (siguiendo mdBook: ←/→ para lecciones, `S` para buscar); foco visible; skip link.
- **Sin autoplay**: los vídeos arrancan con play explícito e incluyen subtítulos y transcripción en español e inglés. Sin animaciones que superen `prefers-reduced-motion`.
- **Playground**: no puede ser el único medio de resolver un ejercicio; ofrecer salida textual y solución accesible con `aria-live="polite"` para el feedback.
- **Contenido**: `alt` descriptivo en los grafos de Blueprints (o texto equivalente con la lista de nodos); encabezados jerárquicos; `aria-label` en los botones de copiar; tamaño de fuente ajustable sin pérdida de layout.

### 6.4 Operación i18n

- Un único archivo de contenido por lección con campos localizados (`title`, `body`, `trap`, `feedback`) y un único bloque de código por idioma (compartido).
- Pseudolocalización en CI para detectar strings sin traducir y desbordes de layout.
- Los enlaces a documentación de Epic llevan `lang` explícito y `hreflang`; se actualizan con fecha de revisión visible ("verificado 2026-11-19").

---

## 7. Bibliografía

Todas las fuentes se consultaron el **2026-11-19**. `[V]` = verificado por fetch directo; `[G]` = verificado por API de GitHub; `[C]` = citado desde índices curados /documentación establecida.

### Oficial / Epic

1. Epic Games. *Create in Fortnite — Verse (Getting Started)*. https://dev.epicgames.com/community/fortnite/getting-started/verse [C]
2. Epic Games. *Learn programming with Verse in Unreal Editor for Fortnite*. https://dev.epicgames.com/documentation/en-us/uefn/learn-programming-with-verse-in-unreal-editor-for-fortnite [C]
3. Epic Games. *Book of Verse*. https://dev.epicgames.com/documentation/en-us/uefn/book-of-verse — redirect observado a https://dev.epicgames.com/documentation/fortnite/book-of-verse?lang=en-US [V]
4. Epic Games. *Verse Language Reference*. https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference [C]
5. Epic Games. *Verse Language Quick Reference*. https://dev.epicgames.com/documentation/en-us/uefn/verse-language-quick-reference [C]
6. Epic Games. *Verse API Reference*. https://dev.epicgames.com/documentation/en-us/uefn/verse-api [C]
7. Epic Games. *Code Snippet Repository*. https://dev.epicgames.com/community/fortnite/snippets [V]
8. Epic Games. *What's New in Unreal Editor for Fortnite*. https://dev.epicgames.com/documentation/en-us/uefn/whats-new-in-unreal-editor-for-fortnite [V]
9. Peyton Jones, S. *Beyond functional programming: a taste of Verse* (Lambda Days 2023). https://www.youtube.com/watch?v=OJv8rFap0Nw [V][G]
10. Peyton Jones, S. *Beyond Functional Programming: The Verse Programming Language*. https://www.youtube.com/watch?v=832JF1o7Ck8 [V][G]
11. Peyton Jones, S. *The Verse Calculus: a Core Calculus for Functional Logic Programming* (2023). https://simon.peytonjones.org/assets/pdfs/verse-March23.pdf [V][G]

### Comunidad / espejos

12. `verselang/book`. *Book of Verse (MkDocs Material, CC0)*. https://verselang.github.io/book/ · https://github.com/verselang/book — 348★, 42 forks, push 2026-11-13; capítulos `08_failure/` y `14_concurrency/` consultados en detalle [V][G]
13. `spilth/awesome-verse`. *A curated list of awesome resources for Verse*. https://github.com/spilth/awesome-verse — 83★ [V][G]
14. `VerseMetaVerse/UnrealVerse`. *The UNREAL Universe*. https://github.com/VerseMetaVerse/UnrealVerse — 134★ [V][G]
15. `glinesbdev/versus`. *Community driven book to learn Verse*. https://verse-book.netlify.app/ · https://github.com/glinesbdev/versus — MIT, 23★, último push 2023-04 [V][G]
16. `60994859/BookOfVerse`. *Traducción EN/ZH del Book of Verse con tests `.versetest`*. https://github.com/60994859/BookOfVerse — CC0, creado 2026-06-30 [V][G]
17. `cronofear-dev/VerseReferenceExplorer`. https://github.com/cronofear-dev/VerseReferenceExplorer [V][G]
18. `BurgersJackson/verse-mcp`. https://github.com/BurgersJackson/verse-mcp — servidor MCP de docs y API de Verse [V][G]
19. `kbfngg/uefn`. https://github.com/kbfngg/uefn — digests de `Verse`, `UnrealEngine` y `Fortnite` [V][G]
20. Fortnite Sensei https://www.youtube.com/@fortnite_sensei · Wahlbeck Warforge https://www.youtube.com/@WarforgeXP · Pi Equals Three https://www.youtube.com/@piequalsthree3200 · Unreal Engine https://www.youtube.com/@UnrealEngine [V][G]
21. *Fortnite Create Official* https://discord.gg/fortnitecreative · *The Lab* https://discord.gg/thelabfn · r/FortniteCreative https://www.reddit.com/r/FortniteCreative/ · r/uefn https://www.reddit.com/r/uefn/ [V][C]

### Pedagogía y UX del aprendizaje de código

22. Microsoft. *TypeScript for JavaScript Programmers*. https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html — actualizado 2026-11-17; misma handbook ofrece variantes para Java/C# y funcional [V]
23. Microsoft. *Migrating from JavaScript*. https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html [V]
24. Biffle, C. *Learn Rust the Dangerous Way* (C → Rust). https://cliffle.com/blog/learn-rust-dangerous-way/ [C]
25. Lee, V. et al. *Computational thinking and programming: Automation, motivation, and constructionism* (Use–Modify–Create). https://dl.acm.org/doi/10.1145/1958865.1958869 [C]
26. Parsons, D. & Haden, P. *Parson's programming puzzles: a fun and effective learning tool* (2006). https://dl.acm.org/doi/10.1145/1979742.1979614 [C]
27. Sweller, J. *Cognitive load theory, learning difficulty, and instructional design* (1994). https://doi.org/10.1016/0959-4752(94)90003-5 [C]
28. Roediger, H. & Karpicke, J. *Test-enhanced learning: Taking memory tests improves long-term retention* (2006). https://doi.org/10.1037/0002-9605.116.2.249 [C]
29. roadmap.sh. https://roadmap.sh/ — 372K★ en GitHub, roadmaps por rol/habilidad, changelog público [V]
30. Exercism. https://exercism.org/ — 85 tracks, ~8.953 ejercicios, análisis automático + mentoría [V]
31. LeetCode. https://leetcode.com/ [C]
32. Go by Example. https://gobyexample.com/ · código: https://github.com/mmcgrana/gobyexample [V]
33. Rustlings. https://rustlings.cool/ · https://github.com/rust-lang/rustlings [V]
34. mdBook Documentation. https://rust-lang.github.io/mdBook/ [V]
35. freeCodeCamp. https://www.freecodecamp.org/ [C]

---

**Última actualización del documento:** 2026-11-19.
