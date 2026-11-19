/**
 * Snippets Verse verificados (verse-js 0.1.1, 2026-11-19).
 *
 * Viven en TypeScript —fuera del pipeline markdown/MDX— porque MDX dedenta
 * los template literals multilínea dentro de JSX y alteraría la indentación
 * (parte de la sintaxis de Verse). El texto debe ser byte a byte el que pasa
 * `npm run test:verse` (ADR-006): `lessonSmokeCases` ejecuta todos estos
 * snippets contra la salida exacta esperada.
 */

/** M0-L01 · snippet principal. */
export const m0l01Main = `using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")

    GreetPlayer(PlayerName : string) : void =
        Print("Welcome, {PlayerName}!")`;

/** M0-L01 · solución del micro-ejercicio. */
export const m0l01Solution = `using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")
        GreetPlayer("Sam")

    GreetPlayer(PlayerName : string) : void =
        Print("Player joined: {PlayerName}")`;

/** M0-L02 · snippet principal. */
export const m0l02Main = `using { /UnrealEngine.com/Temporary/Diagnostics }

HeroName : string = "Kai"
BaseScore : int = 50
Bonus : int = 25

Print("Hero: {HeroName}")
Print("Base: {BaseScore}, Bonus: {Bonus}")
Print("Total: {BaseScore + Bonus}")`;

/** M0-L02 · solución del micro-ejercicio. */
export const m0l02Solution = `using { /UnrealEngine.com/Temporary/Diagnostics }

Stage : int = 2
Coins : int = 15

Print("Stage {Stage} | Coins: {Coins} | Double: {Coins * 2}")`;

/** M0-L03 · snippet principal. */
export const m0l03Main = `using { /UnrealEngine.com/Temporary/Diagnostics }

MaxShield : int = 50
var Health : int = 100
var MoveSpeed : float = 450.0
var IsAlerted : logic = false

Print("Start -> HP: {Health}, Speed: {MoveSpeed}")
set Health = Health - 25
set MoveSpeed = 600.0
set IsAlerted = true
if (IsAlerted?):
    Print("Alert! HP: {Health}, MaxShield: {MaxShield}, Speed: {MoveSpeed}")`;

/** M0-L03 · solución del micro-ejercicio. */
export const m0l03Solution = `using { /UnrealEngine.com/Temporary/Diagnostics }

MaxAmmo : int = 30
var Ammo : int = 30
var Reloading : logic = false

set Ammo = Ammo - 12
set Reloading = true
if (Reloading?):
    Print("Reloading... {Ammo}/{MaxAmmo} left")`;

/** M0-L04 · snippet principal. */
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

/** M0-L04 · solución del micro-ejercicio. */
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

/**
 * Casos de smoke test de lecciones: snippet + salida exacta esperada
 * (verse-js 0.1.1, verificado el 2026-11-19; tabla de `docs/lessons/m0-draft.md`).
 */
export const lessonSmokeCases = [
  { name: "m0-l01-main", source: m0l01Main, expected: [
    "BeginPlay -> OnBegin",
    "Welcome, Alex!",
] },
  { name: "m0-l01-solution", source: m0l01Solution, expected: [
    "BeginPlay -> OnBegin",
    "Player joined: Alex",
    "Player joined: Sam",
] },
  { name: "m0-l02-main", source: m0l02Main, expected: [
    "Hero: Kai",
    "Base: 50, Bonus: 25",
    "Total: 75",
] },
  { name: "m0-l02-solution", source: m0l02Solution, expected: [
    "Stage 2 | Coins: 15 | Double: 30",
] },
  { name: "m0-l03-main", source: m0l03Main, expected: [
    "Start -> HP: 100, Speed: 450.0",
    "Alert! HP: 75, MaxShield: 50, Speed: 600.0",
] },
  { name: "m0-l03-solution", source: m0l03Solution, expected: [
    "Reloading... 18/30 left",
] },
  { name: "m0-l04-main", source: m0l04Main, expected: [
    "Guard down",
] },
  { name: "m0-l04-solution", source: m0l04Solution, expected: [
    "Enemy HP: 65",
    "Guard down",
] },
] as const;
