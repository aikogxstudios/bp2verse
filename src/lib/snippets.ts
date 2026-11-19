/**
 * Snippets Verse verificados (verse-js 0.1.1, 2026-11-19).
 *
 * Viven en TypeScript —fuera del pipeline markdown/MDX— porque MDX dedenta
 * los template literals multilínea dentro de JSX y alteraría la indentación
 * (parte de la sintaxis de Verse). El texto debe ser byte a byte el que pasa
 * `npm run test:verse` (ADR-006).
 */

/** M0-L04 · snippet principal. Salida esperada: ["Guard down"]. */
export const m0l04Main = `using { /UnrealEngine.com/Temporary/Diagnostics }

enemy := class:
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
        if (Health = 0):
            Print("Guard down")

E := enemy{}
E.TakeDamage(30)
E.TakeDamage(90)`;

/** M0-L04 · solución del micro-ejercicio. Salida esperada: ["Enemy HP: 65", "Guard down"]. */
export const m0l04Solution = `using { /UnrealEngine.com/Temporary/Diagnostics }

enemy := class:
    MaxHealth : int = 100
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
        if (Health = 0):
            Print("Guard down")

    Heal(Amount : int) : void =
        set Health = Min(MaxHealth, Health + Amount)
        Print("Enemy HP: {Health}")

E := enemy{}
E.TakeDamage(60)
E.Heal(25)
E.TakeDamage(70)`;

/** M0-L04 · salida del snippet principal (verse-js 0.1.1). */
export const m0l04MainOutput = `Guard down`;

/** M0-L04 · salida de la solución (verse-js 0.1.1). */
export const m0l04SolutionOutput = `Enemy HP: 65
Guard down`;
