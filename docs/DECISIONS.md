# Decisiones (ADR)

Decisiones de arquitectura del proyecto. Una entrada por decisión, con fecha,
estado y contexto. Toda dependencia nueva requiere una entrada aquí (regla 3
de AGENTS.md).

---

## ADR-001 — Runtime de Verse: `verse-js` 0.1.1 (versión fijada)

- **Fecha:** 2026-11-19
- **Estado:** aceptada

### Decisión

El playground usa [`verse-js`](https://www.npmjs.com/package/verse-js)
**exactamente `0.1.1`**, declarada en `package.json` sin `^` ni `~`
(dependencia fijada; las subidas son manuales).

### Motivo

- Es el único runtime libre conocido que implementa un subconjunto real de
  Verse (lexer, parser, checker de tipos/efectos y ejecución con fallo
  transaccional) y funciona embebido en el navegador sin backend ni UEFN.
- API pública documentada y estable en 0.1.x: `createHost`, `host.compile` /
  `host.run` / `host.execute`, módulos UEFN opcionales
  (`verse-js/extras/uefn`) y adaptadores de persistencia
  (`verse-js/adapters`).
- Licencia MIT, compatible con la licencia de código del proyecto.

### Fidelidad y límites

- Es un **simulador de un subconjunto de Verse, no el compilador de Epic**.
  La web lo declara en el disclaimer del playground y en la sección
  "Un simulador, no el compilador de Epic".
- Los ejemplos siguen la referencia oficial de Verse. En concreto, una
  función `<decides>` de nivel de módulo que se evalúa sobre datos mutables
  necesita `<decides><transacts>` (verificado con verse-js 0.1.1; el ejemplo
  `ValidateAge` del playground lo declara).
- **Limitación verificada en 0.1.1:** `Sleep` existe pero exige
  `using { /Verse.org/Simulation }` (sin el import falla con
  "Unknown identifier 'Sleep'"); el ejemplo "Sleep y timeout" del playground
  lo incluye. Con ejecuciones que se suspenden, la cancelación funciona:
  Reiniciar (`run.stop()`) y el timeout de 5 s cortan la ejecución durante
  el `Sleep` y no llega salida posterior (verificado: `Sleep(5.0)` + stop a
  los 300 ms ⇒ `done` rechaza con `VerseTaskCancelled`, salida solo
  `["start"]`). Un `loop:` síncrono sin suspensión, en cambio, bloquea el
  hilo del navegador y no puede interrumpirse (el timeout no puede dispararse
  con el hilo ocupado; la opción `loopBudget` de la API se almacena pero no
  se aplica en la ruta rápida de ejecución). Se documenta como límite del
  simulador y del runtime, no como bug de la web.

### Riesgos

- Proyecto joven (0.1.x): API inestable entre versiones y riesgo de
  abandono. Por eso la versión está **fijada**: ninguna actualización es
  automática y cada subida requiere pasar `npm run test:verse` y revisar el
  playground a mano.
- Coste transitivo alto: el paquete declara dependencias de su IDE
  (`next`, `react`, `monaco-editor`, …), ≈54 paquetes instalados aunque el
  playground solo importa la librería (`verse-js`, `verse-js/extras/uefn`,
  `verse-js/adapters`). El bundle del navegador solo incluye lo importado;
  el coste es de instalación, no de payload.
- `Sleep` y la suspensión viven en `/Verse.org/Simulation` (núcleo del
  runtime, no del shim UEFN): los ejemplos que suspenden deben llevar el
  `using` explícito.

### Política de dependencias

1. Versiones **fijadas** (sin rangos) para todo lo que ejecute o analice
   Verse; el resto de dependencias se actualiza con precaución y tras
   `npm run test:verse` + `npm run build`.
2. Sin CDNs: todas las dependencias se instalan por npm y se empaquetan con
   Vite/Astro.
3. Toda dependencia nueva justifica aquí: motivo, versión, licencia, riesgo
   y coste transitivo.
4. Licencias aceptadas: MIT, Apache-2.0, BSD, ISC.
