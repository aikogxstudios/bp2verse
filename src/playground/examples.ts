/**
 * Snippets del playground. Ejecutan con `verse-js` 0.1.1 tal cual
 * (verificados en scripts/smoke-verse.mjs). La sintaxis sale de la
 * documentación oficial de Verse; nada inventado.
 */

export interface VerseExample {
  id: string;
  code: string;
}

export const DEFAULT_EXAMPLE_ID = 'hello';

export const STORAGE_KEYS = {
  code: 'bp2verse:playground:code',
  example: 'bp2verse:playground:example',
} as const;

export const EXAMPLES: VerseExample[] = [
  {
    id: 'hello',
    code: `Print("Hello from Verse")`,
  },
  {
    id: 'class',
    code: `enemy := class:
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
        if (Health = 0):
            Print("Guard down")

E := enemy{}
E.TakeDamage(30)
E.TakeDamage(90)`,
  },
  {
    id: 'decides',
    code: `ValidateAge(Age : int)<decides><transacts> : int =
    Age >= 0
    Age <= 150
    Age

if (A := ValidateAge[42]):
    Print("ok {A}")
if (B := ValidateAge[200]):
    Print("bad {B}")
else:
    Print("rejected")`,
  },
  {
    id: 'sleep',
    code: `using { /Verse.org/Simulation }

Print("start")
Sleep(2.0)
Print("done")`,
  },
];
