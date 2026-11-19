# Módulo 0 (borrador completo): El puente / The Bridge

> **Estado:** Borrador listo para convertir a páginas MDX (ES / EN).  
> **Público:** Desarrolladores de UE5 con dominio de Blueprints que nunca han escrito Verse.  
> **Fecha de verificación:** 2026-11-19 (`verse-js` 0.1.1 + documentación oficial UE 5.8 / UEFN Verse 1).  
> **Nota de simulador (ADR-005):** Todos los snippets ejecutables con `run: browser` se han verificado en `verse-js` 0.1.1 (simulador de un subconjunto de Verse, no el compilador de Epic). Donde el comportamiento de UEFN exige contexto adicional (p. ej. colocar un dispositivo en el nivel o incluir llamadas dentro de `OnBegin`), se indica explícitamente.

---

## Lección M0-L01 — De nodos a texto / From Nodes to Text

### 1. Metadatos

```yaml
id: M0-L01
slug:
  es: de-nodos-a-texto
  en: from-nodes-to-text
title:
  es: "De nodos a texto"
  en: "From Nodes to Text"
duration: "8 min"
run: browser
verseVersion: "1 (UEFN 43.x / verse-js 0.1.1)"
verifiedAt: "2026-11-19"
```

---

### Versión ES (completa)

#### Lo que ya haces en Blueprints

Cuando abres el **Event Graph** de un **Blueprint Class** (por ejemplo, un `Actor`), arrancas desde un nodo rojo de evento —como **`Event BeginPlay`**— y tiras un cable blanco desde su **Execution Pin** (`exec`) hasta un nodo **`Print String`** o hasta una función propia como **`GreetPlayer`** que recibe un pin de datos **`String`**.

- **Patrón Blueprint:** `Event BeginPlay` (`exec` out) → `Print String` (`In String`: `"BeginPlay -> OnBegin"`) → `Call Function: GreetPlayer` (`In Player Name`: `"Alex"`) → dentro de `GreetPlayer`, `Print String` (`In String`: `"Welcome, Alex!"`).
- **Nombres oficiales de nodos (EN):** `Event BeginPlay`, `Execution Pin` (`exec`), `Print String`, `Custom Event` / `Function` (`Call Function`).

#### Equivalente en Verse

En Verse no dibujas cables: **un evento es una función** que sobrescribes, **un cable blanco de ejecución es una línea debajo de otra** con la misma indentación, y **un pin de datos es un parámetro tipado** entre paréntesis.

```verse
using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")

    GreetPlayer(PlayerName : string) : void =
        Print("Welcome, {PlayerName}!")
```

**Salida exacta (`verse-js` 0.1.1):**

```text
BeginPlay -> OnBegin
Welcome, Alex!
```

**Anotación línea a línea:**

| Línea | Qué hace | Equivalente en Blueprints |
|---|---|---|
| `1` | `using { /Fortnite.com/Devices }` importa `creative_device`. | Elegir clase padre (`Parent Class`) al crear el Blueprint. |
| `2` | `using { /UnrealEngine.com/Temporary/Diagnostics }` habilita `Print` en UEFN. | Acceso global a nodos de depuración (`Print String`). |
| `4` | `hello_bridge_device := class(creative_device):` define tu clase hija de dispositivo. | Crear un `Blueprint Class` que hereda de una clase base. |
| `5` | `OnBegin<override>()<suspends> : void =` declara el punto de entrada al empezar el juego. | Nodo `Event BeginPlay`. |
| `6` | `Print("BeginPlay -> OnBegin")` ejecuta la primera acción dentro del evento. | Primer nodo `Print String` conectado al pin `exec` de `Event BeginPlay`. |
| `7` | `GreetPlayer("Alex")` llama a tu función pasándole el texto `"Alex"`. | Cable blanco hacia el nodo `GreetPlayer` + pin de entrada `String`. |
| `9` | `GreetPlayer(PlayerName : string) : void =` define la función con un parámetro de entrada y sin retorno (`void`). | Pestaña `My Blueprint → Functions` con un `Input` de tipo `String`. |
| `10` | `Print("Welcome, {PlayerName}!")` imprime el saludo usando el parámetro recibido. | `Print String` dentro del grafo de la función leyendo el pin de entrada. |

> **Nota de simulador (`run: browser`):** `verse-js` incluye un shim de `creative_device` que ejecuta `OnBegin` automáticamente. En **UEFN** además debes compilar el código y arrastrar el dispositivo generado al viewport del nivel para que se ejecute al iniciar la sesión. Si además usas `Sleep(...)` dentro de `<suspends>` (como el nodo `Delay`), necesitas `using { /Verse.org/Simulation }`.

#### Trampa del migrante

En Blueprints los eventos vienen puestos y los cables blancos definen qué pertenece al flujo; en Verse `OnBegin` sobrescribe al padre y **exige `<override>` (con `<>`, nunca `@override`)**, además de **indentación** para saber qué líneas cuelgan del evento. Si olvidas `<override>`, el compilador rechaza el código (`'OnBegin' overrides an inherited member and must be marked <override>`), y si desalineas una línea de su bloque, queda fuera del flujo.

#### Micro-ejercicio

- **Enunciado:** Partiendo del snippet de `hello_bridge_device`, añade una segunda llamada a `GreetPlayer` dentro de `OnBegin` pasándole `"Sam"`, y cambia el texto de `Print` dentro de `GreetPlayer` para que imprima `"Player joined: {PlayerName}"`.
- **Pista:** Coloca `GreetPlayer("Sam")` justo debajo de `GreetPlayer("Alex")` con exactamente la misma indentación (8 espacios), y actualiza el literal dentro de `Print("...")` en la última línea.
- **Solución esperada:**

```verse
using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")
        GreetPlayer("Sam")

    GreetPlayer(PlayerName : string) : void =
        Print("Player joined: {PlayerName}")
```

- **Salida esperada (`verse-js` 0.1.1):**

```text
BeginPlay -> OnBegin
Player joined: Alex
Player joined: Sam
```

---

### EN Version (complete)

#### What You Already Do in Blueprints

When you open the **Event Graph** of a **Blueprint Class** (for example, an `Actor`), you start from a red event node—such as **`Event BeginPlay`**—and drag a white wire from its **Execution Pin** (`exec`) to a **`Print String`** node, then into a custom function like **`GreetPlayer`** with a **`String`** data input pin.

- **Blueprint pattern:** `Event BeginPlay` (`exec` out) → `Print String` (`In String`: `"BeginPlay -> OnBegin"`) → `Call Function: GreetPlayer` (`In Player Name`: `"Alex"`) → inside `GreetPlayer`, `Print String` (`In String`: `"Welcome, Alex!"`).
- **Official node names (EN):** `Event BeginPlay`, `Execution Pin` (`exec`), `Print String`, `Custom Event` / `Function` (`Call Function`).

#### The Verse Equivalent

In Verse you do not wire nodes together: **an event is an overridden method**, **a white execution wire is one line following another** at the same indentation level, and **a data pin is a typed parameter** inside parentheses.

```verse
using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")

    GreetPlayer(PlayerName : string) : void =
        Print("Welcome, {PlayerName}!")
```

**Exact output (`verse-js` 0.1.1):**

```text
BeginPlay -> OnBegin
Welcome, Alex!
```

**Line-by-line annotation:**

| Line | What it does | Blueprint equivalent |
|---|---|---|
| `1` | `using { /Fortnite.com/Devices }` imports `creative_device`. | Picking the `Parent Class` when creating a Blueprint. |
| `2` | `using { /UnrealEngine.com/Temporary/Diagnostics }` brings `Print` into scope in UEFN. | Built-in access to debug nodes (`Print String`). |
| `4` | `hello_bridge_device := class(creative_device):` defines your device subclass. | Creating a `Blueprint Class` that inherits from a base class. |
| `5` | `OnBegin<override>()<suspends> : void =` declares the entry point when the experience starts. | The `Event BeginPlay` node. |
| `6` | `Print("BeginPlay -> OnBegin")` runs the first action inside the event. | First `Print String` wired to `Event BeginPlay`'s `exec` pin. |
| `7` | `GreetPlayer("Alex")` calls your function and passes `"Alex"` as its argument. | White `exec` wire into `GreetPlayer` plus the `String` input pin. |
| `9` | `GreetPlayer(PlayerName : string) : void =` defines the function with one input parameter and no return value (`void`). | A function under `My Blueprint → Functions` with a `String` input. |
| `10` | `Print("Welcome, {PlayerName}!")` prints the greeting using the incoming parameter. | `Print String` inside the function graph wired to the input pin. |

> **Simulator note (`run: browser`):** `verse-js` provides a `creative_device` shim that automatically runs `OnBegin`. In **UEFN**, you also compile your Verse code and place the resulting device in the level viewport for it to run during play. If you add `Sleep(...)` inside `<suspends>` (like a `Delay` node), you also need `using { /Verse.org/Simulation }`.

#### Migrant Trap

In Blueprints, events sit ready on the graph and white wires decide what belongs to them; in Verse, `OnBegin` overrides a parent method and **requires `<override>` (in angle brackets, never `@override`)**, while **indentation acts as the execution wire**. Omit `<override>` and the compiler rejects it (`'OnBegin' overrides an inherited member and must be marked <override>`); misalign a line and it no longer belongs to that block.

#### Micro-Exercise

- **Prompt:** Starting from `hello_bridge_device`, add a second call to `GreetPlayer` inside `OnBegin` passing `"Sam"`, and update `GreetPlayer` so it prints `"Player joined: {PlayerName}"`.
- **Hint:** Place `GreetPlayer("Sam")` directly below `GreetPlayer("Alex")` at the exact same indentation (8 spaces), then change the string inside `Print("...")` on the last line.
- **Expected solution:**

```verse
using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")
        GreetPlayer("Sam")

    GreetPlayer(PlayerName : string) : void =
        Print("Player joined: {PlayerName}")
```

- **Expected output (`verse-js` 0.1.1):**

```text
BeginPlay -> OnBegin
Player joined: Alex
Player joined: Sam
```

#### Fuentes oficiales / Official Sources (verificado / verified: 2026-11-19)

- Blueprints (UE 5.8): [Event Graph](https://dev.epicgames.com/documentation/en-us/unreal-engine/event-graph-in-unreal-engine?application_version=5.8) · [Events in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/events-in-unreal-engine?application_version=5.8) · [Functions in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/functions-in-unreal-engine?application_version=5.8)
- Verse (UEFN): [creative_device API](https://dev.epicgames.com/documentation/en-us/fortnite/verse-api/fortnitedotcom/devices/creative_device) · [Functions in Verse](https://dev.epicgames.com/documentation/en-us/uefn/function-verse) · [Specifiers and Attributes in Verse](https://dev.epicgames.com/documentation/en-us/uefn/specifiers-and-attributes-in-verse)

---

## Lección M0-L02 — Tu primer programa / Your First Program

### 1. Metadatos

```yaml
id: M0-L02
slug:
  es: tu-primer-programa
  en: your-first-program
title:
  es: "Tu primer programa"
  en: "Your First Program"
duration: "6 min"
run: browser
verseVersion: "1 (UEFN 43.x / verse-js 0.1.1)"
verifiedAt: "2026-11-19"
```

---

### Versión ES (completa)

#### Lo que ya haces en Blueprints

Para comprobar valores rápido en el **Event Graph**, sacas un nodo **`Print String`**. Si quieres combinar texto y números (por ejemplo, el nombre del héroe y su puntuación), añades un nodo **`Append`** (`String`), conectas pines de entrada `A`, `B`, `C` y dejas que Unreal inserte pequeños nodos de conversión automática **`To String (Integer)`** antes de llegar a **`In String`**.

- **Patrón Blueprint:** `Event BeginPlay` → `Append` (`"Total: "` + `To String (Integer)` de `BaseScore + Bonus`) → `Print String` (`In String`).
- **Nombres oficiales de nodos (EN):** `Print String` (`In String`), `Append` (`String`), `To String (Integer)`, `Add` (`Integer + Integer`).

#### Equivalente en Verse

En Verse no necesitas encadenar nodos `Append` ni cajas de conversión: **interpolas valores y cálculos directamente dentro de las comillas** usando llaves `{...}` y se los pasas a `Print("...")`.

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

HeroName : string = "Kai"
BaseScore : int = 50
Bonus : int = 25

Print("Hero: {HeroName}")
Print("Base: {BaseScore}, Bonus: {Bonus}")
Print("Total: {BaseScore + Bonus}")
```

**Salida exacta (`verse-js` 0.1.1):**

```text
Hero: Kai
Base: 50, Bonus: 25
Total: 75
```

**Anotación línea a línea:**

| Línea | Qué hace | Equivalente en Blueprints |
|---|---|---|
| `1` | `using { /UnrealEngine.com/Temporary/Diagnostics }` importa `Print`. | Acceso integrado al nodo `Print String`. |
| `3` | `HeroName : string = "Kai"` define un texto inmutable (`string`). | Variable `String` con valor por defecto `"Kai"`. |
| `4` | `BaseScore : int = 50` define un entero inmutable (`int`). | Variable `Integer` con valor `50`. |
| `5` | `Bonus : int = 25` define otro entero inmutable (`int`). | Variable `Integer` con valor `25`. |
| `7` | `Print("Hero: {HeroName}")` sustituye `{HeroName}` por `"Kai"` e imprime la línea. | `Append` (`"Hero: "`, `HeroName`) → `Print String`. |
| `8` | `Print("Base: {BaseScore}, Bonus: {Bonus}")` inserta dos enteros en un solo string sin nodos de conversión visibles. | `Append` con 4 pines y dos `To String (Integer)` → `Print String`. |
| `9` | `Print("Total: {BaseScore + Bonus}")` evalúa la suma `50 + 25` dentro de `{...}` e imprime `Total: 75`. | `Add (Integer)` → `To String (Integer)` → `Append` → `Print String`. |

> **Nota de simulador (`run: browser`):** El simulador `verse-js` permite ejecutar `Print(...)` directamente en el nivel superior del archivo para probar rápido. En **UEFN**, el código ejecutable debe ir dentro de una función como `OnBegin` en tu `creative_device` (M0-L01). Además, en UEFN `Print` admite argumentos opcionales como `?Duration` o `?Color`; `verse-js` solo implementa `Print("...")`.

#### Trampa del migrante

En Blueprints puedes arrastrar un pin verde de `Integer` directo al pin magenta `In String` de `Print String` porque el editor inserta un `To String` invisible; en Verse **`Print(BaseScore)` no compila** (`Argument 1 expects string, got int`). Siempre debes envolverlo en comillas con `{...}` (`Print("{BaseScore}")`) y, en UEFN, acordarte de importar `/UnrealEngine.com/Temporary/Diagnostics`.

#### Micro-ejercicio

- **Enunciado:** Declara dos constantes `Stage : int = 2` y `Coins : int = 15`, y usa una sola llamada a `Print` con interpolación `{...}` para imprimir exactamente `"Stage 2 | Coins: 15 | Double: 30"`.
- **Pista:** Puedes poner operaciones aritméticas dentro de las llaves, por ejemplo `{Coins * 2}`, todo dentro de una única cadena entre comillas dobles.
- **Solución esperada:**

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

Stage : int = 2
Coins : int = 15

Print("Stage {Stage} | Coins: {Coins} | Double: {Coins * 2}")
```

- **Salida esperada (`verse-js` 0.1.1):**

```text
Stage 2 | Coins: 15 | Double: 30
```

---

### EN Version (complete)

#### What You Already Do in Blueprints

To quickly inspect values in the **Event Graph**, you drop a **`Print String`** node. Whenever you need to combine text and numbers—say, a hero's name and score—you wire an **`Append`** (`String`) node with `A`, `B`, `C` pins and let Unreal auto-insert **`To String (Integer)`** conversion nodes on the way into **`In String`**.

- **Blueprint pattern:** `Event BeginPlay` → `Append` (`"Total: "` + `To String (Integer)` from `BaseScore + Bonus`) → `Print String` (`In String`).
- **Official node names (EN):** `Print String` (`In String`), `Append` (`String`), `To String (Integer)`, `Add` (`Integer + Integer`).

#### The Verse Equivalent

In Verse there is no `Append` node chain or conversion clutter: **you interpolate values and expressions directly inside quotes** using `{...}` and pass the resulting `string` to `Print("...")`.

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

HeroName : string = "Kai"
BaseScore : int = 50
Bonus : int = 25

Print("Hero: {HeroName}")
Print("Base: {BaseScore}, Bonus: {Bonus}")
Print("Total: {BaseScore + Bonus}")
```

**Exact output (`verse-js` 0.1.1):**

```text
Hero: Kai
Base: 50, Bonus: 25
Total: 75
```

**Line-by-line annotation:**

| Line | What it does | Blueprint equivalent |
|---|---|---|
| `1` | `using { /UnrealEngine.com/Temporary/Diagnostics }` imports `Print`. | Built-in access to the `Print String` node. |
| `3` | `HeroName : string = "Kai"` defines an immutable `string`. | A `String` variable initialized to `"Kai"`. |
| `4` | `BaseScore : int = 50` defines an immutable integer (`int`). | An `Integer` variable set to `50`. |
| `5` | `Bonus : int = 25` defines another immutable integer (`int`). | An `Integer` variable set to `25`. |
| `7` | `Print("Hero: {HeroName}")` replaces `{HeroName}` with `"Kai"` and prints the line. | `Append` (`"Hero: "`, `HeroName`) → `Print String`. |
| `8` | `Print("Base: {BaseScore}, Bonus: {Bonus}")` embeds two integers in one string with no explicit converter nodes. | `Append` with 4 pins and two `To String (Integer)` nodes → `Print String`. |
| `9` | `Print("Total: {BaseScore + Bonus}")` evaluates `50 + 25` inside `{...}` and prints `Total: 75`. | `Add (Integer)` → `To String (Integer)` → `Append` → `Print String`. |

> **Simulator note (`run: browser`):** The `verse-js` playground lets you run `Print(...)` at the top level of a file for quick iteration. In **UEFN**, executable statements live inside a function such as `OnBegin` on your `creative_device` (M0-L01). Also, UEFN's `Print` accepts optional named arguments like `?Duration` and `?Color`, whereas `verse-js` only implements `Print("...")`.

#### Migrant Trap

In Blueprints, dragging a green `Integer` pin onto `Print String`'s magenta `In String` pin silently creates a `To String` node; in Verse, **`Print(BaseScore)` fails to compile** (`Argument 1 expects string, got int`). Always wrap values in quotes with `{...}` (`Print("{BaseScore}")`), and in UEFN remember to include `using { /UnrealEngine.com/Temporary/Diagnostics }`.

#### Micro-Exercise

- **Prompt:** Declare two constants `Stage : int = 2` and `Coins : int = 15`, then use a single `Print` call with `{...}` interpolation to output `"Stage 2 | Coins: 15 | Double: 30"`.
- **Hint:** You can write arithmetic directly inside braces, such as `{Coins * 2}`, all inside one double-quoted string.
- **Expected solution:**

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

Stage : int = 2
Coins : int = 15

Print("Stage {Stage} | Coins: {Coins} | Double: {Coins * 2}")
```

- **Expected output (`verse-js` 0.1.1):**

```text
Stage 2 | Coins: 15 | Double: 30
```

#### Fuentes oficiales / Official Sources (verificado / verified: 2026-11-19)

- Blueprints (UE 5.8): [Basic Scripting with Blueprints](https://dev.epicgames.com/documentation/en-us/unreal-engine/basic-scripting-with-blueprints-in-unreal-engine?application_version=5.8) · [Event Graph](https://dev.epicgames.com/documentation/en-us/unreal-engine/event-graph-in-unreal-engine?application_version=5.8)
- Verse (UEFN): [Modify and Run Your First Verse Program](https://dev.epicgames.com/documentation/en-us/fortnite/modify-and-run-your-first-verse-program-in-unreal-editor-for-fortnite) · [Debugging and Troubleshooting in Verse](https://dev.epicgames.com/documentation/en-us/uefn/debugging-and-troubleshooting-in-verse) · [Book of Verse — Primitive Types](https://verselang.github.io/book/02_primitives/)

---

## Lección M0-L03 — Variables y estado / Variables and State

### 1. Metadatos

```yaml
id: M0-L03
slug:
  es: variables-y-estado
  en: variables-and-state
title:
  es: "Variables y estado"
  en: "Variables and State"
duration: "9 min"
run: browser
verseVersion: "1 (UEFN 43.x / verse-js 0.1.1)"
verifiedAt: "2026-11-19"
```

---

### Versión ES (completa)

#### Lo que ya haces en Blueprints

En el panel **My Blueprint** pulsas `+ Variable`, eliges el tipo por su color de pin (**`Integer`** verde mar, **`Float`** verde amarillento, **`Boolean`** granate, **`String`** magenta) y arrastras nodos **`Get`** (`Ctrl + Drag`) para leer o **`Set`** (`Alt + Drag`) para sobrescribir su valor en cualquier momento, seguido por ejemplo de un **`Branch`** para decidir según un `Boolean`.

- **Patrón Blueprint:** Variables `MaxShield` (`Integer`, `50`), `Health` (`Integer`, `100`), `MoveSpeed` (`Float`, `450.0`), `IsAlerted` (`Boolean`, `false`) → `Set Health` (`Health - 25`) → `Set MoveSpeed` (`600.0`) → `Set IsAlerted` (`true`) → `Branch` (`Condition`: `IsAlerted`) → `Print String`.
- **Nombres oficiales de nodos (EN):** `Get` (Variable Getter), `Set` (Variable Setter), `Branch`, `Subtract` (`Integer - Integer`), `Print String`.

| Blueprint (UE 5.8) | Color de pin | Verse | Ejemplo |
|---|---|---|---|
| `Integer` (`int32`) | Verde mar | `int` | `var Health : int = 100` |
| `Float` (`double`) | Verde amarillento | `float` | `var MoveSpeed : float = 450.0` |
| `Boolean` (`bool`) | Granate | `logic` (`true` / `false`) | `var IsAlerted : logic = false` |
| `String` (`FString`) | Magenta | `string` | `HeroName : string = "Kai"` |
| `Get` / lectura fija | Pin de datos | `Nombre : tipo = valor` (o `:=`) | `MaxShield : int = 50` (inmutable) |
| `Set` (pin `exec`) | Nodo impuro | `var` + `set Nombre = valor` | `set Health = Health - 25` |

#### Equivalente en Verse

En Verse todo dato es **inmutable por defecto** (una constante). Solo puedes modificar lo que declaras explícitamente con `var`, y cada reasignación debe llevar la palabra clave `set`.

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

MaxShield : int = 50
var Health : int = 100
var MoveSpeed : float = 450.0
var IsAlerted : logic = false

Print("Start -> HP: {Health}, Speed: {MoveSpeed}")
set Health = Health - 25
set MoveSpeed = 600.0
set IsAlerted = true
if (IsAlerted?):
    Print("Alert! HP: {Health}, MaxShield: {MaxShield}, Speed: {MoveSpeed}")
```

**Salida exacta (`verse-js` 0.1.1):**

```text
Start -> HP: 100, Speed: 450.0
Alert! HP: 75, MaxShield: 50, Speed: 600.0
```

**Anotación línea a línea:**

| Línea | Qué hace | Equivalente en Blueprints |
|---|---|---|
| `1` | `using { /UnrealEngine.com/Temporary/Diagnostics }` habilita `Print`. | Acceso a `Print String`. |
| `3` | `MaxShield : int = 50` crea una constante (`int`) que no puede reasignarse. | Variable `Integer` que solo lees con `Get` y nunca cambias con `Set`. |
| `4` | `var Health : int = 100` declara una variable mutable de tipo `int` (en UEFN `var` exige tipo explícito). | Variable `Integer` con valor por defecto `100`. |
| `5` | `var MoveSpeed : float = 450.0` declara una variable decimal (`float`). | Variable `Float` con valor por defecto `450.0`. |
| `6` | `var IsAlerted : logic = false` declara una variable booleana (`logic`). | Variable `Boolean` desmarcada (`false`). |
| `8` | `Print(...)` imprime los valores iniciales antes de mutarlos. | `Print String` leyendo los nodos `Get` iniciales. |
| `9` | `set Health = Health - 25` muta `Health` de `100` a `75`. | Nodo `Set Health` conectado a `Get Health - 25`. |
| `10` | `set MoveSpeed = 600.0` actualiza `MoveSpeed` con un literal `float` (`.0`). | Nodo `Set MoveSpeed` a `600.0`. |
| `11` | `set IsAlerted = true` cambia el estado lógico a verdadero. | Nodo `Set IsAlerted` marcado (`true`). |
| `12` | `if (IsAlerted?):` comprueba si `IsAlerted` es `true` usando `?`. | Nodo `Branch` con `Get IsAlerted` conectado a `Condition`. |
| `13` | `Print(...)` se ejecuta solo si la condición de la línea 12 tuvo éxito. | `Print String` conectado al pin `True` del `Branch`. |

#### Trampa del migrante

Si escribes `Health = 75` olvidando `set`, Verse **no asigna nada**: interpreta `=` como una comparación de igualdad y falla al compilar (`This expression can fail; it must occur in a failure context`). Además, `var` exige tipo explícito en UEFN (`var Health : int = 100`, no `var Health := 100`), Verse nunca mezcla `int` y `float` automáticamente (`450.0 + 10` da error), y una variable `logic` en un `if` se comprueba con `?` (`if (IsAlerted?):`).

#### Micro-ejercicio

- **Enunciado:** Declara una constante `MaxAmmo : int = 30`, una variable mutable `var Ammo : int = 30` y una variable `var Reloading : logic = false`. Resta `12` a `Ammo` usando `set`, pon `Reloading` en `true` y, dentro de un `if (Reloading?):`, imprime exactamente `"Reloading... 18/30 left"`.
- **Pista:** Usa `set Ammo = Ammo - 12`, luego `set Reloading = true` y finalmente `if (Reloading?):` con `Print("Reloading... {Ammo}/{MaxAmmo} left")` indentado debajo.
- **Solución esperada:**

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

MaxAmmo : int = 30
var Ammo : int = 30
var Reloading : logic = false

set Ammo = Ammo - 12
set Reloading = true
if (Reloading?):
    Print("Reloading... {Ammo}/{MaxAmmo} left")
```

- **Salida esperada (`verse-js` 0.1.1):**

```text
Reloading... 18/30 left
```

---

### EN Version (complete)

#### What You Already Do in Blueprints

In the **My Blueprint** panel you click `+ Variable`, pick a pin type by color (**`Integer`** sea green, **`Float`** yellow-green, **`Boolean`** maroon, **`String`** magenta), and drag **`Get`** (`Ctrl + Drag`) to read or **`Set`** (`Alt + Drag`) to overwrite its value—often followed by a **`Branch`** checking a `Boolean`.

- **Blueprint pattern:** Variables `MaxShield` (`Integer`, `50`), `Health` (`Integer`, `100`), `MoveSpeed` (`Float`, `450.0`), `IsAlerted` (`Boolean`, `false`) → `Set Health` (`Health - 25`) → `Set MoveSpeed` (`600.0`) → `Set IsAlerted` (`true`) → `Branch` (`Condition`: `IsAlerted`) → `Print String`.
- **Official node names (EN):** `Get` (Variable Getter), `Set` (Variable Setter), `Branch`, `Subtract` (`Integer - Integer`), `Print String`.

| Blueprint (UE 5.8) | Pin Color | Verse | Example |
|---|---|---|---|
| `Integer` (`int32`) | Sea green | `int` | `var Health : int = 100` |
| `Float` (`double`) | Yellow-green | `float` | `var MoveSpeed : float = 450.0` |
| `Boolean` (`bool`) | Maroon | `logic` (`true` / `false`) | `var IsAlerted : logic = false` |
| `String` (`FString`) | Magenta | `string` | `HeroName : string = "Kai"` |
| `Get` / read-only | Data pin | `Name : type = value` (or `:=`) | `MaxShield : int = 50` (immutable) |
| `Set` (`exec` pin) | Impure node | `var` + `set Name = value` | `set Health = Health - 25` |

#### The Verse Equivalent

In Verse every binding is **immutable by default** (a constant). You can only reassign values explicitly declared with `var`, and every reassignment must use the `set` keyword.

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

MaxShield : int = 50
var Health : int = 100
var MoveSpeed : float = 450.0
var IsAlerted : logic = false

Print("Start -> HP: {Health}, Speed: {MoveSpeed}")
set Health = Health - 25
set MoveSpeed = 600.0
set IsAlerted = true
if (IsAlerted?):
    Print("Alert! HP: {Health}, MaxShield: {MaxShield}, Speed: {MoveSpeed}")
```

**Exact output (`verse-js` 0.1.1):**

```text
Start -> HP: 100, Speed: 450.0
Alert! HP: 75, MaxShield: 50, Speed: 600.0
```

**Line-by-line annotation:**

| Line | What it does | Blueprint equivalent |
|---|---|---|
| `1` | `using { /UnrealEngine.com/Temporary/Diagnostics }` brings `Print` into scope. | Access to `Print String`. |
| `3` | `MaxShield : int = 50` creates an immutable `int` constant. | An `Integer` variable you only read with `Get` and never `Set`. |
| `4` | `var Health : int = 100` declares a mutable `int` (in UEFN, `var` requires an explicit type). | An `Integer` variable defaulting to `100`. |
| `5` | `var MoveSpeed : float = 450.0` declares a mutable `float`. | A `Float` variable defaulting to `450.0`. |
| `6` | `var IsAlerted : logic = false` declares a mutable `logic` flag. | A `Boolean` variable defaulting to `false`. |
| `8` | `Print(...)` logs the initial state before any mutation. | `Print String` reading the initial `Get` nodes. |
| `9` | `set Health = Health - 25` mutates `Health` from `100` to `75`. | `Set Health` wired to `Get Health - 25`. |
| `10` | `set MoveSpeed = 600.0` updates `MoveSpeed` using a `float` literal (`.0`). | `Set MoveSpeed` set to `600.0`. |
| `11` | `set IsAlerted = true` flips the `logic` variable to true. | `Set IsAlerted` checked (`true`). |
| `12` | `if (IsAlerted?):` tests whether `IsAlerted` is `true` with `?`. | `Branch` node with `Get IsAlerted` wired into `Condition`. |
| `13` | `Print(...)` runs only when line 12 succeeds. | `Print String` wired to the `True` pin of `Branch`. |

#### Migrant Trap

Writing `Health = 75` without `set` **does not assign anything**—Verse reads `=` as an equality check (`This expression can fail; it must occur in a failure context`). Also keep three rules in mind: UEFN requires an explicit type on `var` (`var Health : int = 100`, not `var Health := 100`), Verse never mixes `int` and `float` implicitly (`450.0 + 10` fails to compile), and testing a `logic` variable in `if` uses `?` (`if (IsAlerted?):`).

#### Micro-Exercise

- **Prompt:** Declare an immutable `MaxAmmo : int = 30`, a mutable `var Ammo : int = 30`, and `var Reloading : logic = false`. Subtract `12` from `Ammo` with `set`, set `Reloading` to `true`, and inside `if (Reloading?):` print `"Reloading... 18/30 left"`.
- **Hint:** Use `set Ammo = Ammo - 12`, then `set Reloading = true`, and wrap `Print("Reloading... {Ammo}/{MaxAmmo} left")` inside an indented `if (Reloading?):` block.
- **Expected solution:**

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

MaxAmmo : int = 30
var Ammo : int = 30
var Reloading : logic = false

set Ammo = Ammo - 12
set Reloading = true
if (Reloading?):
    Print("Reloading... {Ammo}/{MaxAmmo} left")
```

- **Expected output (`verse-js` 0.1.1):**

```text
Reloading... 18/30 left
```

#### Fuentes oficiales / Official Sources (verificado / verified: 2026-11-19)

- Blueprints (UE 5.8): [Blueprint Variables](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-variables-in-unreal-engine?application_version=5.8) · [Flow Control in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/flow-control-in-unreal-engine?application_version=5.8)
- Verse (UEFN): [Verse Language Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference) · [Book of Verse — Primitive Types](https://verselang.github.io/book/02_primitives/) · [Book of Verse — Mutability](https://verselang.github.io/book/05_mutability/)

---

## Lección M0-L04 — Un patrón real: daño y muerte / A Real Pattern: Damage and Death

### 1. Metadatos

```yaml
id: M0-L04
slug:
  es: patron-real-dano-y-muerte
  en: real-pattern-damage-and-death
title:
  es: "Un patrón real: daño y muerte"
  en: "A Real Pattern: Damage and Death"
duration: "10 min"
run: browser
verseVersion: "1 (UEFN 43.x / verse-js 0.1.1)"
verifiedAt: "2026-11-19"
```

---

### Versión ES (completa)

#### Lo que ya haces en Blueprints

Este es el patrón clásico de un enemigo en Unreal Engine (el mismo que ves en la demo de portada de `bp2verse`): creas un **`Blueprint Class`** con la variable **`Health`** (`Integer`, por defecto `100`) y un **`Custom Event`** o **`Function`** llamado **`TakeDamage`** (`Amount` como entrada `Integer`). Al dispararse, calcula `Max(0, Health - Amount)` para no bajar de cero, guarda el resultado con **`Set Health`**, y pasa por un **`Branch`** (`Health <= 0` o `Health == 0`) cuyo pin **`True`** llama a **`Print String`** con `"Guard down"`.

- **Patrón Blueprint:** `Blueprint Class` (`Health = 100`) → `Event TakeDamage` (`Amount`) → `Set Health` (`Max (Integer)` de `0` y `Health - Amount`) → `Branch` (`Equal (Integer)` `Health == 0`) → `True` → `Print String` (`"Guard down"`).
- **Nombres oficiales de nodos (EN):** `Blueprint Class`, `Custom Event` / `Function`, `Set` (`Health`), `Subtract` (`Integer - Integer`), `Max (Integer)`, `Equal (Integer)`, `Branch`, `Print String`.

#### Equivalente en Verse

Aquí juntas todo lo del Módulo 0 en una unidad completa: una **`class`**, una variable de estado `var Health`, un método `TakeDamage`, la función estándar `Max`, un `if` como `Branch` e instanciación arquetipo `enemy{}`.

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

enemy := class:
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
        if (Health = 0):
            Print("Guard down")

E := enemy{}
E.TakeDamage(30)
E.TakeDamage(90)
```

**Salida exacta (`verse-js` 0.1.1):**

```text
Guard down
```

**Anotación línea a línea:**

| Línea | Qué hace | Equivalente en Blueprints |
|---|---|---|
| `1` | `using { /UnrealEngine.com/Temporary/Diagnostics }` habilita `Print`. | Acceso al nodo `Print String`. |
| `3` | `enemy := class:` define una clase reutilizable llamada `enemy`. | Crear un nuevo `Blueprint Class`. |
| `4` | `var Health : int = 100` declara el campo mutable de vida con valor inicial `100`. | Variable `Health` (`Integer`) en *My Blueprint* con *Default Value* `100`. |
| `6` | `TakeDamage(Amount : int) : void =` define el método que recibe el daño. | `Custom Event` o `Function` `TakeDamage` con pin de entrada `Amount` (`Integer`). |
| `7` | `set Health = Max(0, Health - Amount)` resta `Amount` sin bajar de `0`. | `Set Health` conectado a `Max(0, Health - Amount)`. |
| `8` | `if (Health = 0):` comprueba si la vida llegó exactamente a cero. | `Branch` conectado a `Equal (Integer)` (`Health == 0`). |
| `9` | `Print("Guard down")` solo se ejecuta cuando el enemigo cae a `0`. | `Print String` (`"Guard down"`) conectado al pin `True`. |
| `11` | `E := enemy{}` crea una instancia en memoria usando sintaxis arquetipo `{}`. | Instanciar el Blueprint en el nivel (o crear un objeto en runtime). |
| `12` | `E.TakeDamage(30)` baja `Health` de `100` a `70`; `if (Health = 0)` falla, así que no imprime nada. | Primera llamada al evento `TakeDamage(30)` (sale por `False`). |
| `13` | `E.TakeDamage(90)` calcula `Max(0, 70 - 90) = 0`; `Health = 0` tiene éxito e imprime `"Guard down"`. | Segunda llamada `TakeDamage(90)` (entra por `True`). |

#### Trampa del migrante

Dos costumbres de Blueprints o C-like rompen este ejemplo al instante: primero, **`guard` es una palabra reservada** en Verse, así que escribir `guard := class:` falla en compilación (`Syntax error: Unexpected ':='`; usa `enemy`, aunque `"Guard down"` dentro de comillas sí es texto válido). Segundo, en la condición del `if` la comparación de igualdad se escribe con **un solo `=`** (`if (Health = 0):`), nunca `==` (`Syntax error: Unexpected '='`).

#### Micro-ejercicio

- **Enunciado:** Amplía la clase `enemy` con una constante `MaxHealth : int = 100` y un método `Heal(Amount : int) : void` que sume `Amount` a `Health` sin superar `MaxHealth` usando `Min(MaxHealth, Health + Amount)`, e imprima `"Enemy HP: {Health}"`. Luego instancia `E := enemy{}` y ejecuta en orden: `E.TakeDamage(60)`, `E.Heal(25)` y `E.TakeDamage(70)`.
- **Pista:** Escribe `Heal(Amount : int) : void =` al mismo nivel de indentación que `TakeDamage` (4 espacios) y usa `set Health = Min(MaxHealth, Health + Amount)` seguido de `Print("Enemy HP: {Health}")` (8 espacios).
- **Solución esperada:**

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

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
E.TakeDamage(70)
```

- **Salida esperada (`verse-js` 0.1.1):**

```text
Enemy HP: 65
Guard down
```

---

### EN Version (complete)

#### What You Already Do in Blueprints

This is the classic Unreal enemy pattern (and the exact example from the `bp2verse` landing demo): you create a **`Blueprint Class`** with a **`Health`** (`Integer`, default `100`) variable and a **`TakeDamage`** **`Custom Event`** or **`Function`** taking an **`Amount`** (`Integer`) input. On execution, it computes `Max(0, Health - Amount)` so health never goes negative, updates it with **`Set Health`**, and runs a **`Branch`** (`Health <= 0` or `Health == 0`) whose **`True`** pin triggers **`Print String`** with `"Guard down"`.

- **Blueprint pattern:** `Blueprint Class` (`Health = 100`) → `Event TakeDamage` (`Amount`) → `Set Health` (`Max (Integer)` of `0` and `Health - Amount`) → `Branch` (`Equal (Integer)` `Health == 0`) → `True` → `Print String` (`"Guard down"`).
- **Official node names (EN):** `Blueprint Class`, `Custom Event` / `Function`, `Set` (`Health`), `Subtract` (`Integer - Integer`), `Max (Integer)`, `Equal (Integer)`, `Branch`, `Print String`.

#### The Verse Equivalent

Here everything from Module 0 comes together in one working unit: a **`class`**, a mutable `var Health` field, a `TakeDamage` method, the standard `Max` function, an `if` acting as `Branch`, and archetype instantiation `enemy{}`.

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

enemy := class:
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
        if (Health = 0):
            Print("Guard down")

E := enemy{}
E.TakeDamage(30)
E.TakeDamage(90)
```

**Exact output (`verse-js` 0.1.1):**

```text
Guard down
```

**Line-by-line annotation:**

| Line | What it does | Blueprint equivalent |
|---|---|---|
| `1` | `using { /UnrealEngine.com/Temporary/Diagnostics }` imports `Print`. | Built-in access to `Print String`. |
| `3` | `enemy := class:` defines a reusable class named `enemy`. | Creating a new `Blueprint Class`. |
| `4` | `var Health : int = 100` declares the mutable `Health` field initialized to `100`. | `Health` (`Integer`) variable in *My Blueprint* with Default Value `100`. |
| `6` | `TakeDamage(Amount : int) : void =` defines the method taking damage as an `int`. | `Custom Event` or `Function` `TakeDamage` with an `Amount` (`Integer`) input pin. |
| `7` | `set Health = Max(0, Health - Amount)` subtracts `Amount` and clamps the floor at `0`. | `Set Health` fed by `Max(0, Health - Amount)`. |
| `8` | `if (Health = 0):` checks whether health has hit zero. | `Branch` wired from `Equal (Integer)` (`Health == 0`). |
| `9` | `Print("Guard down")` runs only when `Health` reaches `0`. | `Print String` (`"Guard down"`) wired to the `True` pin. |
| `11` | `E := enemy{}` creates an instance in memory using archetype `{}` syntax. | Spawning or placing the Blueprint instance. |
| `12` | `E.TakeDamage(30)` drops `Health` from `100` to `70`; `if (Health = 0)` fails, printing nothing. | First `TakeDamage(30)` call (takes the `False` branch). |
| `13` | `E.TakeDamage(90)` sets `Max(0, 70 - 90)` to `0`; `Health = 0` succeeds and prints `"Guard down"`. | Second `TakeDamage(90)` call (takes the `True` branch). |

#### Migrant Trap

Two habits break this snippet immediately: first, **`guard` is a reserved keyword** in Verse, so `guard := class:` fails to parse (`Syntax error: Unexpected ':='`; name the class `enemy`, while `"Guard down"` inside quotes is fine). Second, inside `if`, equality uses a **single `=`** (`if (Health = 0):`), never `==` (`Syntax error: Unexpected '='`).

#### Micro-Exercise

- **Prompt:** Extend `enemy` with a constant `MaxHealth : int = 100` and a `Heal(Amount : int) : void` method that adds `Amount` to `Health` without exceeding `MaxHealth` using `Min(MaxHealth, Health + Amount)`, then prints `"Enemy HP: {Health}"`. Instantiate `E := enemy{}` and call in order: `E.TakeDamage(60)`, `E.Heal(25)`, and `E.TakeDamage(70)`.
- **Hint:** Place `Heal(Amount : int) : void =` at the same indentation as `TakeDamage` (4 spaces), and indent `set Health = Min(MaxHealth, Health + Amount)` and `Print("Enemy HP: {Health}")` underneath (8 spaces).
- **Expected solution:**

```verse
using { /UnrealEngine.com/Temporary/Diagnostics }

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
E.TakeDamage(70)
```

- **Expected output (`verse-js` 0.1.1):**

```text
Enemy HP: 65
Guard down
```

#### Fuentes oficiales / Official Sources (verificado / verified: 2026-11-19)

- Blueprints (UE 5.8): [Anatomy of a Blueprint](https://dev.epicgames.com/documentation/en-us/unreal-engine/anatomy-of-a-blueprint-in-unreal-engine?application_version=5.8) · [Flow Control in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/flow-control-in-unreal-engine?application_version=5.8)
- Verse (UEFN): [Verse Language Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference) · [Failure and Control Flow in Verse](https://dev.epicgames.com/documentation/en-us/uefn/basics-of-writing-code-9-failure-and-control-flow-in-verse) · [Book of Verse — Classes & Interfaces](https://verselang.github.io/book/10_classes_interfaces/)

---

## Tabla resumen del Módulo 0 / Module 0 Summary Table

| ID | Título (ES) | Title (EN) | Duración | `run` | Conceptos clave BP → Verse |
|---|---|---|---|---|---|
| `M0-L01` | De nodos a texto | From Nodes to Text | 8 min | `browser` | `Event BeginPlay` → `OnBegin<override>()<suspends>:void`, cables `exec` → indentación secuencial, pines → parámetros |
| `M0-L02` | Tu primer programa | Your First Program | 6 min | `browser` | `Print String` + `Append` + `To String` → `Print("...")` + interpolación `{...}`, `using { .../Diagnostics }` |
| `M0-L03` | Variables y estado | Variables and State | 9 min | `browser` | `Get`/`Set`, `Integer`/`Float`/`Boolean`/`String` → constantes vs `var`/`set`, `int`/`float`/`logic`/`string`, `if (Flag?):` |
| `M0-L04` | Un patrón real: daño y muerte | A Real Pattern: Damage and Death | 10 min | `browser` | `Blueprint Class` + `TakeDamage` + `Max` + `Branch` → `class`, `var`, `Max(0, ...)`, `if (Health = 0):`, `"Guard down"` |

---

## Snippets candidatos para `test:verse` (verificados en `verse-js` 0.1.1)

Todos los snippets siguientes (4 principales + 4 soluciones de micro-ejercicios) han sido ejecutados el **2026-11-19** contra `verse-js` `0.1.1` con `uefnModules` y `MemoryStorageAdapter`, produciendo `errors: []` y la salida exacta indicada:

| Caso | Lección | Rol | Salida esperada (`result.output`) |
|---|---|---|---|
| `m0-l01-main` | `M0-L01` | Snippet principal | `["BeginPlay -> OnBegin", "Welcome, Alex!"]` |
| `m0-l01-solution` | `M0-L01` | Solución micro-ejercicio | `["BeginPlay -> OnBegin", "Player joined: Alex", "Player joined: Sam"]` |
| `m0-l02-main` | `M0-L02` | Snippet principal | `["Hero: Kai", "Base: 50, Bonus: 25", "Total: 75"]` |
| `m0-l02-solution` | `M0-L02` | Solución micro-ejercicio | `["Stage 2 | Coins: 15 | Double: 30"]` |
| `m0-l03-main` | `M0-L03` | Snippet principal | `["Start -> HP: 100, Speed: 450.0", "Alert! HP: 75, MaxShield: 50, Speed: 600.0"]` |
| `m0-l03-solution` | `M0-L03` | Solución micro-ejercicio | `["Reloading... 18/30 left"]` |
| `m0-l04-main` | `M0-L04` | Snippet principal | `["Guard down"]` |
| `m0-l04-solution` | `M0-L04` | Solución micro-ejercicio | `["Enemy HP: 65", "Guard down"]` |

### Bloques exactos para copiar en `scripts/smoke-verse.mjs`

```js
// m0-l01-main
`using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")

    GreetPlayer(PlayerName : string) : void =
        Print("Welcome, {PlayerName}!")`
// expected: ["BeginPlay -> OnBegin", "Welcome, Alex!"]

// m0-l01-solution
`using { /Fortnite.com/Devices }
using { /UnrealEngine.com/Temporary/Diagnostics }

hello_bridge_device := class(creative_device):
    OnBegin<override>()<suspends> : void =
        Print("BeginPlay -> OnBegin")
        GreetPlayer("Alex")
        GreetPlayer("Sam")

    GreetPlayer(PlayerName : string) : void =
        Print("Player joined: {PlayerName}")`
// expected: ["BeginPlay -> OnBegin", "Player joined: Alex", "Player joined: Sam"]

// m0-l02-main
`using { /UnrealEngine.com/Temporary/Diagnostics }

HeroName : string = "Kai"
BaseScore : int = 50
Bonus : int = 25

Print("Hero: {HeroName}")
Print("Base: {BaseScore}, Bonus: {Bonus}")
Print("Total: {BaseScore + Bonus}")`
// expected: ["Hero: Kai", "Base: 50, Bonus: 25", "Total: 75"]

// m0-l02-solution
`using { /UnrealEngine.com/Temporary/Diagnostics }

Stage : int = 2
Coins : int = 15

Print("Stage {Stage} | Coins: {Coins} | Double: {Coins * 2}")`
// expected: ["Stage 2 | Coins: 15 | Double: 30"]

// m0-l03-main
`using { /UnrealEngine.com/Temporary/Diagnostics }

MaxShield : int = 50
var Health : int = 100
var MoveSpeed : float = 450.0
var IsAlerted : logic = false

Print("Start -> HP: {Health}, Speed: {MoveSpeed}")
set Health = Health - 25
set MoveSpeed = 600.0
set IsAlerted = true
if (IsAlerted?):
    Print("Alert! HP: {Health}, MaxShield: {MaxShield}, Speed: {MoveSpeed}")`
// expected: ["Start -> HP: 100, Speed: 450.0", "Alert! HP: 75, MaxShield: 50, Speed: 600.0"]

// m0-l03-solution
`using { /UnrealEngine.com/Temporary/Diagnostics }

MaxAmmo : int = 30
var Ammo : int = 30
var Reloading : logic = false

set Ammo = Ammo - 12
set Reloading = true
if (Reloading?):
    Print("Reloading... {Ammo}/{MaxAmmo} left")`
// expected: ["Reloading... 18/30 left"]

// m0-l04-main
`using { /UnrealEngine.com/Temporary/Diagnostics }

enemy := class:
    var Health : int = 100

    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
        if (Health = 0):
            Print("Guard down")

E := enemy{}
E.TakeDamage(30)
E.TakeDamage(90)`
// expected: ["Guard down"]

// m0-l04-solution
`using { /UnrealEngine.com/Temporary/Diagnostics }

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
E.TakeDamage(70)`
// expected: ["Enemy HP: 65", "Guard down"]
```
