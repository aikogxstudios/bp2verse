import type { CollectionEntry } from 'astro:content';

/**
 * Slug público de una lección: nombre de archivo sin extensión ni carpeta de
 * idioma (p. ej. `es/m0-l04.mdx` -> `m0-l04`). ES y EN comparten los mismos
 * slugs por diseño.
 */
export function slugFromEntry(entry: CollectionEntry<'lessons'>): string {
  const file = entry.filePath ?? entry.id;
  const base = file.split('/').pop() ?? entry.id;
  return base.replace(/\.(mdx|md)$/i, '');
}

/** Orden canónico de las lecciones: módulo asc, luego `order` asc. */
export function sortLessons(
  lessons: CollectionEntry<'lessons'>[],
): CollectionEntry<'lessons'>[] {
  return [...lessons].sort(
    (a, b) =>
      a.data.module.localeCompare(b.data.module) || a.data.order - b.data.order,
  );
}
