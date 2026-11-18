# Brief del producto

> Documento vivo. Recoge lo que el usuario ha pedido, tal cual, y las decisiones pendientes.
> Última actualización: 2026-11-19.

## La idea en una frase

Una web pública que permite a alguien que ya sabe Blueprints **entender y escribir Verse** sintiéndose como en casa: mismo comportamiento, distinta sintaxis.

## Motivación

- Epic ha anunciado que **UE6** se apoya en **Verse** y en el nuevo **Scene Graph**.
- La comunidad de UE5 está cómoda con **Blueprints** (grafo visual, pines, eventos).
- El salto a Verse se percibe como "empezar de cero" y frena la adopción.
- No hay una referencia clara que traduzca *concepto de Blueprint → concepto de Verse* con ejemplos ejecutables.

## Promesa

"Cada cosa que ya haces en Blueprints tiene un equivalente en Verse. Te lo enseñamos lado a lado, y lo pruebas aquí mismo."

## Público

1. Devs de UE5 con Blueprints como herramienta principal.
2. Artistas técnicos / diseñadores que evitan el código.
3. Usuarios de UEFN que ya tocan Verse pero sin base formal.

## Requisitos funcionales (v1)

- [ ] Lecciones con comparación lado a lado: nodo/grafo de BP ↔ código Verse.
- [ ] Playground/terminal en el navegador para escribir Verse y "ejecutarlo".
- [ ] Ejercicios cortos con comprobación (al menos estructural).
- [ ] Progreso local (sin cuenta obligatoria).
- [ ] Búsqueda por concepto ("cast", "event dispatcher", "option").
- [ ] Referencia rápida Blueprint → Verse.
- [ ] Contenido en español; estructura preparada para inglés.

## Requisitos técnicos

- Repo público en GitHub.
- Despliegue estático y gratuito si es posible (GitHub Pages o Cloudflare).
- Sin backend en v1, salvo que el playground lo exija.
- CI para build y previews.

## Restricciones y realidades a confirmar

- **Verse no es un lenguaje de código abierto**: hay que confirmar si existe compilador/playground oficial fuera del editor. Si no existe, el "terminal" será un subconjunto simulado, no Verse real. Esto hay que decírselo al usuario en la UI con honestidad.
- La documentación pública de Verse hoy es principalmente de **UEFN**; la de UE6/Scene Graph está en evolución. Hay que fechar cada afirmación.
- El contenido debe ser **corregible**: si Epic cambia la sintaxis, las lecciones deben actualizarse fácilmente.

## Decisiones abiertas

| # | Decisión | Estado |
|---|----------|--------|
| 1 | Nombre definitivo del proyecto (`bp2verse` es provisional) | Abierta |
| 2 | Stack: Astro / Vite+React / HTML+JS | Pendiente de investigación |
| 3 | Hosting: GitHub Pages vs Cloudflare Pages | Pendiente de investigación |
| 4 | Playground: simulador propio vs ejercicios estáticos | Pendiente de investigación |
| 5 | Cuentas de usuario en v1 o solo localStorage | Pendiente |
| 6 | Idioma del contenido: ES primero, ¿EN en v1? | Abierta |
| 7 | Licencia del contenido | Abierta |

## No objetivos (por ahora)

- Sustituir la documentación oficial de Epic.
- Enseñar C++ de Unreal.
- Enseñar modelado, materiales o animación.
- Ser un curso de programación desde cero.
