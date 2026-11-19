export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

const es = {
  'meta.title': 'bp2verse — De Blueprints a Verse',
  'meta.description':
    'Aprende Verse viniendo de Blueprints: lecciones lado a lado, un playground real en el navegador y un camino claro hacia Unreal Engine 6.',

  'nav.playground': 'Playground',
  'nav.demo': 'Demo',
  'nav.lessons': 'Temario',
  'nav.how': 'Cómo funciona',
  'nav.github': 'GitHub',
  'nav.lang': 'English',

  'a11y.skip': 'Saltar al contenido',
  'a11y.nav': 'Navegación principal',
  'a11y.lang': 'Idioma',
  'a11y.code': 'Ejemplo de código Verse del archivo enemy.verse',
  'a11y.graph': 'Grafo de Blueprint: Event TakeDamage resta Damage a Health y, si Health es menor o igual que 0, imprime "Guard down".',

  'hero.badge': 'UE6 elimina Blueprints · Early Access a finales de 2027',
  'hero.title': 'Lo que ya sabes de Blueprints, ahora en Verse.',
  'hero.subtitle':
    'La misma lógica, otro idioma. Lecciones lado a lado, un playground que ejecuta Verse de verdad en tu navegador y un camino sin saltos de nodos a código.',
  'hero.cta': 'Empezar por el puente',
  'hero.cta2': 'Ver el temario',
  'hero.note': 'Gratis · Sin cuenta · Sin instalar Unreal',

  'demo.title': 'Demo en vivo',
  'demo.bp': 'Blueprint',
  'demo.bpSub': 'Event Graph',
  'demo.verse': 'Verse',
  'demo.verseSub': 'enemy.verse',
  'demo.output': 'Salida',
  'demo.caption':
    'El mismo comportamiento, escrito dos veces. Cada lección conecta un patrón que ya conoces con su forma en Verse.',

  'why.title': 'Por qué esta web, y por qué ahora',
  'why.subtitle':
    'No es un curso de programación más. Es el puente entre lo que la gente ya sabe hacer y lo que UE6 va a exigir.',

  'why.1.title': 'Blueprints desaparece',
  'why.1.body':
    'Epic confirmó en Unreal Fest Tokyo (noviembre de 2026) que UE6 elimina Blueprints, Actors y el C++ de gameplay. La Early Access llega a finales de 2027.',

  'why.2.title': 'Verse se aprende tocando',
  'why.2.body':
    'El playground compila y ejecuta un subconjunto real de Verse en tu navegador: tipos, fallo transaccional, clases y concurrencia. Sin descargar 50 GB.',

  'why.3.title': 'Honesto por diseño',
  'why.3.body':
    'Cada lección enlaza la documentación oficial y marca lo que solo funciona dentro de UEFN. Si algo no está verificado, lo decimos.',

  'modules.title': 'El camino',
  'modules.subtitle':
    'Once módulos, cuarenta y ocho lecciones y un proyecto final. Se empieza por lo que ya sabes.',
  'modules.total': '11 módulos · 48 lecciones · ~20 h',

  'modules.m0.kicker': 'Módulo 00',
  'modules.m0.title': 'El puente',
  'modules.m0.body':
    'De nodos a texto: eventos, pines, variables y el primer programa que ejecuta de verdad.',
  'modules.m0.count': '4 lecciones',

  'modules.m1.kicker': 'Módulo 01',
  'modules.m1.title': 'Fundamentos',
  'modules.m1.body':
    'Todo es una expresión. Valores, funciones, bloques y control de flujo sin pines de ejecución.',
  'modules.m1.count': '5 lecciones',

  'modules.m2.kicker': 'Módulo 02',
  'modules.m2.title': 'Fallo y opcionalidad',
  'modules.m2.body':
    'Lo que en Blueprints es un branch, en Verse es un tipo: option, <decides> y rollback transaccional.',
  'modules.m2.count': '5 lecciones',

  'modules.m3.kicker': 'Módulo 03',
  'modules.m3.title': 'Efectos',
  'modules.m3.body':
    'Qué puede hacer una función y qué no. El sistema de efectos, explicado desde la lógica que ya escribes.',
  'modules.m3.count': '4 lecciones',

  'honest.title': 'Un simulador, no el compilador de Epic',
  'honest.body':
    'Epic no ha publicado un compilador de Verse fuera de Unreal. El playground usa un runtime libre que implementa el núcleo del lenguaje y lo marca claramente. Para ejecutar Verse real hoy: UEFN.',
  'honest.link': 'Leer por qué',

  'pg.meta.title': 'Playground de Verse — bp2verse',
  'pg.meta.description':
    'Escribe y ejecuta Verse en tu navegador: un simulador del núcleo del lenguaje con ejemplos listos para correr.',
  'pg.title': 'Playground de Verse',
  'pg.subtitle':
    'Escribe Verse y ejecútalo aquí mismo. Un simulador del núcleo del lenguaje: expresiones, clases, fallo transaccional y opcionalidad.',
  'pg.disclaimer':
    'Simulador de un subconjunto de Verse. No es el compilador de Epic. Para Verse real: UEFN.',
  'pg.examples': 'Ejemplos',
  'pg.example.hello': 'Hola Mundo',
  'pg.example.class': 'Clase con estado',
  'pg.example.decides': 'Fallo y <decides>',
  'pg.example.sleep': 'Sleep y timeout',
  'pg.run': 'Ejecutar',
  'pg.reset': 'Reiniciar',
  'pg.editor': 'Editor de código Verse',
  'pg.output': 'Salida',
  'pg.console.tag': 'consola',
  'pg.error': 'Errores',
  'pg.output.none': '(sin salida)',
  'pg.loading': 'Cargando el runtime de Verse…',
  'pg.runtime.error':
    'No se pudo cargar el runtime de Verse (verse-js). Comprueba tu conexión y vuelve a intentarlo.',
  'pg.run.timeout':
    'Ejecución detenida tras 5 s: demasiado tiempo o posible bucle infinito.',
  'pg.console.empty': 'Ejecuta el programa para ver la salida aquí.',

  'footer.tagline': 'De Blueprints a Verse, sin empezar de cero.',
  'footer.disclaimer':
    'Proyecto no afiliado a Epic Games. Verse, Unreal Engine y Blueprints son marcas de Epic Games, Inc.',
  'footer.license.code': 'Código MIT',
  'footer.license.content': 'Contenido CC BY-SA 4.0',
};

const en: typeof es = {
  'meta.title': 'bp2verse — From Blueprints to Verse',
  'meta.description':
    'Learn Verse coming from Blueprints: side-by-side lessons, a real browser playground, and a clear path to Unreal Engine 6.',

  'nav.playground': 'Playground',
  'nav.demo': 'Demo',
  'nav.lessons': 'Curriculum',
  'nav.how': 'How it works',
  'nav.github': 'GitHub',
  'nav.lang': 'Español',

  'a11y.skip': 'Skip to content',
  'a11y.nav': 'Main navigation',
  'a11y.lang': 'Language',
  'a11y.code': 'Verse code sample from the enemy.verse file',
  'a11y.graph': 'Blueprint graph: Event TakeDamage subtracts Damage from Health and, if Health is less than or equal to 0, prints "Guard down".',

  'hero.badge': 'UE6 removes Blueprints · Early Access late 2027',
  'hero.title': 'What you already know in Blueprints, now in Verse.',
  'hero.subtitle':
    'Same logic, different language. Side-by-side lessons, a playground that actually runs Verse in your browser, and a path with no gap between nodes and code.',
  'hero.cta': 'Start with the bridge',
  'hero.cta2': 'See the curriculum',
  'hero.note': 'Free · No account · No Unreal install',

  'demo.title': 'Live demo',
  'demo.bp': 'Blueprint',
  'demo.bpSub': 'Event Graph',
  'demo.verse': 'Verse',
  'demo.verseSub': 'enemy.verse',
  'demo.output': 'Output',
  'demo.caption':
    'The same behaviour, written twice. Every lesson connects a pattern you already know with its Verse shape.',

  'why.title': 'Why this site, and why now',
  'why.subtitle':
    'This is not another programming course. It is the bridge between what people already know how to do and what UE6 will require.',

  'why.1.title': 'Blueprints is going away',
  'why.1.body':
    'Epic confirmed at Unreal Fest Tokyo (November 2026) that UE6 removes Blueprints, Actors and gameplay C++. Early Access lands in late 2027.',

  'why.2.title': 'Verse is learned by doing',
  'why.2.body':
    'The playground compiles and runs a real subset of Verse in your browser: types, transactional failure, classes and concurrency. No 50 GB download.',

  'why.3.title': 'Honest by design',
  'why.3.body':
    'Every lesson links to the official documentation and flags what only works inside UEFN. If something is unverified, we say so.',

  'modules.title': 'The path',
  'modules.subtitle':
    'Eleven modules, forty-eight lessons and a final project. It starts with what you already know.',
  'modules.total': '11 modules · 48 lessons · ~20 h',

  'modules.m0.kicker': 'Module 00',
  'modules.m0.title': 'The bridge',
  'modules.m0.body':
    'From nodes to text: events, pins, variables and the first program that actually runs.',
  'modules.m0.count': '4 lessons',

  'modules.m1.kicker': 'Module 01',
  'modules.m1.title': 'Fundamentals',
  'modules.m1.body':
    'Everything is an expression. Values, functions, blocks and control flow without execution pins.',
  'modules.m1.count': '5 lessons',

  'modules.m2.kicker': 'Module 02',
  'modules.m2.title': 'Failure and options',
  'modules.m2.body':
    'What is a branch in Blueprints is a type in Verse: option, <decides> and transactional rollback.',
  'modules.m2.count': '5 lessons',

  'modules.m3.kicker': 'Module 03',
  'modules.m3.title': 'Effects',
  'modules.m3.body':
    'What a function may do and what it may not. The effect system, explained from the logic you already write.',
  'modules.m3.count': '4 lessons',

  'honest.title': 'A simulator, not Epic’s compiler',
  'honest.body':
    'Epic has not released a Verse compiler outside Unreal. The playground uses a free runtime that implements the core language, and says so clearly. To run real Verse today: UEFN.',
  'honest.link': 'Read why',

  'pg.meta.title': 'Verse Playground — bp2verse',
  'pg.meta.description':
    'Write and run Verse in your browser: a simulator of the language core with ready-to-run examples.',
  'pg.title': 'Verse Playground',
  'pg.subtitle':
    'Write Verse and run it right here. A simulator of the language core: expressions, classes, transactional failure and optionality.',
  'pg.disclaimer':
    'Simulator of a subset of Verse. Not Epic’s compiler. For real Verse: UEFN.',
  'pg.examples': 'Examples',
  'pg.example.hello': 'Hello World',
  'pg.example.class': 'Class with state',
  'pg.example.decides': 'Failure and <decides>',
  'pg.example.sleep': 'Sleep and timeout',
  'pg.run': 'Run',
  'pg.reset': 'Reset',
  'pg.editor': 'Verse code editor',
  'pg.output': 'Output',
  'pg.console.tag': 'console',
  'pg.error': 'Errors',
  'pg.output.none': '(no output)',
  'pg.loading': 'Loading the Verse runtime…',
  'pg.runtime.error':
    'The Verse runtime (verse-js) could not be loaded. Check your connection and try again.',
  'pg.run.timeout':
    'Execution stopped after 5 s: too long or a possible infinite loop.',
  'pg.console.empty': 'Run the program to see its output here.',

  'footer.tagline': 'From Blueprints to Verse, without starting over.',
  'footer.disclaimer':
    'Not affiliated with Epic Games. Verse, Unreal Engine and Blueprints are trademarks of Epic Games, Inc.',
  'footer.license.code': 'Code MIT',
  'footer.license.content': 'Content CC BY-SA 4.0',
};

export const ui = { es, en };
export type UIKey = keyof typeof es;

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
