# AGENTS.md — bp2verse

Reglas para agentes que trabajen en este repositorio.

## Contexto

- Raíz de proyectos: `~/Documentos/Trabajos/nexus/`. Este proyecto vive en `nexus/bp2verse/`.
- La web enseña **Verse** (Epic Games, UE6/UEFN) a devs que ya saben **Blueprints**.
- Todo el contenido técnico debe estar respaldado por documentación oficial. Si algo no se puede verificar, se marca como `[NO VERIFICADO]`.

## Estructura

- `src/` — código de la web. Nada suelto en la raíz del proyecto.
- `assets/` — imágenes, iconos, fuentes.
- `docs/` — plan, arquitectura, decisiones (ADR) y notas.
- `docs/research/` — informes de investigación. No se editan a mano sin citar la fuente.

## Reglas

1. No inventar sintaxis de Verse. Cada snippet debe salir de la documentación oficial o estar probado.
2. Código, identificadores y nombres de archivo en inglés. Texto de la web en español (i18n después).
3. No añadir dependencias sin justificarlo en `docs/DECISIONS.md`.
4. Commits pequeños y con mensaje en imperativo (`add lesson: variables`).
5. No mover ni renombrar carpetas del proyecto sin confirmar con el usuario.
6. No tocar otros proyectos de `nexus/`.

## Comandos

Requiere Node 22+.

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # build estático a dist/
npm run preview # previsualizar el build
```
