// Smoke test del runtime verse-js 0.1.1 en Node.
// Ejecuta los 4 snippets del playground y falla si la salida no coincide.
// El caso 'sleep' comprueba además que la ejecución tarda ~2 s (suspensión real).
import { createHost } from 'verse-js';
import { uefnModules } from 'verse-js/extras/uefn';
import { MemoryStorageAdapter } from 'verse-js/adapters';

const cases = [
  {
    name: 'hello',
    source: `Print("Hello from Verse")`,
    expected: ['Hello from Verse'],
  },
  {
    name: 'class',
    source: `enemy := class:
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
        if (Health = 0):
            Print("Guard down")

E := enemy{}
E.TakeDamage(30)
E.TakeDamage(90)`,
    expected: ['Guard down'],
  },
  {
    name: 'decides',
    source: `ValidateAge(Age : int)<decides><transacts> : int =
    Age >= 0
    Age <= 150
    Age

if (A := ValidateAge[42]):
    Print("ok {A}")
if (B := ValidateAge[200]):
    Print("bad {B}")
else:
    Print("rejected")`,
    expected: ['ok 42', 'rejected'],
  },
  {
    name: 'sleep',
    source: `using { /Verse.org/Simulation }

Print("start")
Sleep(2.0)
Print("done")`,
    expected: ['start', 'done'],
    minMs: 1500,
    maxMs: 4000,
  },
];

let failed = 0;

for (const c of cases) {
  const host = createHost({ modules: uefnModules, persistence: new MemoryStorageAdapter() });
  const t0 = Date.now();
  const result = await host.execute(c.source);
  const elapsed = Date.now() - t0;

  const outputOk = JSON.stringify(result.output) === JSON.stringify(c.expected);
  const noErrors = result.errors.length === 0;
  const timingOk =
    c.minMs === undefined || (elapsed >= c.minMs && elapsed <= c.maxMs);

  if (outputOk && noErrors && timingOk) {
    console.log(`ok    ${c.name} (${elapsed} ms)`);
  } else {
    failed += 1;
    console.error(`FAIL  ${c.name} (${elapsed} ms)`);
    console.error(`  expected: ${JSON.stringify(c.expected)}`);
    console.error(`  output:   ${JSON.stringify(result.output)}`);
    if (result.errors.length > 0) {
      console.error(`  errors:   ${JSON.stringify(result.errors)}`);
    }
    if (!timingOk && c.minMs !== undefined) {
      console.error(`  timing:   ${elapsed} ms fuera de [${c.minMs}, ${c.maxMs}] ms`);
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} de ${cases.length} snippets fallaron`);
  process.exit(1);
}

console.log(`\n${cases.length} snippets OK`);
