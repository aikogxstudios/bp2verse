import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colección de lecciones (MDX), ES y EN.
 *
 * - Estructura: `src/content/lessons/<lang>/<slug>.mdx` (p. ej. `es/m0-l04.mdx`).
 * - El id de entrada conserva el idioma (`es/m0-l04`) para que ES y EN
 *   convivan en la misma colección; el slug público de la ruta es solo el
 *   nombre de archivo sin extensión (`m0-l04`) y se calcula en `getStaticPaths`.
 */
const lessons = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/lessons',
    generateId({ entry }) {
      // entry: 'es/m0-l04.mdx' -> 'es/m0-l04'
      return entry.replace(/\.(mdx|md)$/i, '');
    },
  }),
  schema: z.object({
    /** Identificador de la lección en el plan de estudios (p. ej. 'M0-L04'). */
    id: z.string(),
    /** Idioma de esta versión de la lección. */
    lang: z.enum(['es', 'en']),
    /** Módulo al que pertenece (p. ej. 'M0'). */
    module: z.string(),
    /** Orden dentro del módulo (1-indexed). */
    order: z.number(),
    title: z.string(),
    description: z.string(),
    duration: z.string(),
    /** 'browser': ejecutable en el simulador; 'uefn-only': requiere UEFN. */
    run: z.enum(['browser', 'uefn-only']),
    /** Fuentes primarias oficiales que respaldan el contenido. */
    sources: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      }),
    ),
    /** Fecha (ISO) de la última verificación contra fuentes oficiales y simulador. */
    verifiedAt: z.string(),
  }),
});

export const collections = { lessons };
