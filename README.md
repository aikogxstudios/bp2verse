# bp2verse

**De Blueprints a Verse, sin empezar de cero.**

Web pública y abierta que enseña **Verse** (el lenguaje de Epic Games para Unreal Engine 6) a desarrolladores que ya piensan en **Blueprints**. La idea es simple: no aprender un lenguaje nuevo desde cero, sino **traducir** lo que ya sabes —eventos, nodos, variables, casts, interfaces— a su equivalente en Verse, con ejemplos lado a lado y un playground para probar.

> Estado: **v0.2 — landing bilingüe, mapa BP→Verse y playground funcional**. La documentación de investigación vive en `docs/research/` y el plan en `docs/PLAN.md`.

## Para quién

- Devs de UE5 que trabajan a diario con Blueprints.
- Artistas técnicos y diseñadores que quieren pasar a UE6 sin miedo al código.
- Gente de UEFN que ya escribe Verse y quiere ordenar conceptos.

## Qué queremos que pase

1. Abres una lección y ves **el mismo comportamiento en Blueprint y en Verse**.
2. Entiendes *por qué* Verse lo hace distinto (tipos, `option`, transacciones, concurrencia).
3. Lo pruebas en el navegador, sin instalar Unreal.
4. Al terminar un módulo, tienes un mini-proyecto que podrías llevar a UE6.

## Estructura

```
bp2verse/
├── src/
│   ├── components/     # Componentes Astro (Header, Footer, Demo)
│   ├── layouts/        # BaseLayout.astro
│   ├── pages/          # / (español) y /en/ (inglés)
│   ├── i18n/           # Textos es/en y helpers de rutas
│   └── styles/         # CSS global, sin frameworks
├── public/             # Estáticos servidos tal cual (favicon…)
├── assets/             # Imágenes, fuentes y estáticos
├── docs/               # Plan, arquitectura y decisiones
│   ├── reference/      # Material de referencia (mapa BP→Verse)
│   └── research/       # Investigación con fuentes oficiales
├── astro.config.mjs    # Config de Astro y enrutado i18n
├── README.md
└── AGENTS.md           # Reglas para agentes que trabajen en el repo
```

## Desarrollo

Requiere Node 22+.

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # build estático a dist/
npm run preview # previsualizar el build
```

## Principios

- **Fuentes oficiales primero.** Nada de sintaxis inventada: cada afirmación sobre Verse o Blueprints se apoya en documentación de Epic o se marca como no verificada.
- **Bilingüe desde el inicio.** Español canónico en `/` e inglés en `/en/`; el código siempre en inglés.
- **Estático y barato.** Que se pueda servir desde GitHub o Cloudflare sin servidores que mantener.
- **Sin cuentas para empezar.** El progreso se guarda en el navegador; las cuentas, si llegan, serán opcionales.
- **Abierto.** Repo público, contenido en Markdown, fácil de corregir con un PR.

## Licencia

Por decidir (probablemente MIT para el código y CC BY-SA para el contenido).
