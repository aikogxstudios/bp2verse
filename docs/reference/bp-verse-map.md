# Mapa de equivalencias Blueprint → Verse

> **Versión de referencia:** Blueprints (Unreal Engine 5.8) → Verse (UEFN / Verse Language Version 1; *Scene Graph* en estado **Beta**).  
> **Fecha de verificación:** 2026-11-19.  
> **Nota de lectura:** Las expresiones y funciones que pueden fallar (`<decides>`) se invocan en Verse con **corchetes** (`MiFunc[X]`), nunca con paréntesis (`MiFunc(X)`). Los apartados marcados como **`NO VERIFICADO`** indican patrones sin equivalente nativo directo o sin fuente pública oficial de Epic en UEFN/UE6.

---

## 1. Eventos y ciclo de vida

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Event BeginPlay` | `OnBegin<override>()<suspends>:void` (en `creative_device`) o `OnBeginSimulation<override>():void` / `OnSimulate<override>()<suspends>:void` (*Scene Graph* `component`) | `docs` | En dispositivos `OnBegin` ya permite `<suspends>`, mientras que en *Scene Graph* `OnBeginSimulation` es síncrono y las esperas van en `OnSimulate`. |
| `Event Tick` | `loop:` con `Sleep(0.0)` dentro de `<suspends>` (dispositivos/corrutinas) o `TickEvents` en *Scene Graph* (`Beta`) | `docs` | Un `loop:` sin `Sleep(0.0)` no cede el control al siguiente frame y bloquea la ejecución hasta abortarse. |
| `Event EndPlay` / `Event Destroyed` | `OnEndSimulation<override>():void` / `OnRemovingFromScene<override>():void` (*Scene Graph* `component`; sin callback equivalente en `creative_device` clásico) | `docs` | Fuera de *Scene Graph*, un `creative_device` no expone un evento `OnEndPlay` propio al finalizar la partida. |
| `Construction Script` (`UserConstructionScript`) | Sin ejecución en viewport de editor al arrastrar; inicialización declarativa de campos o `OnAddedToScene<override>():void` en *runtime* (*falta equivalente de editor en Verse*) | `NO VERIFICADO` | `@editable` solo expone propiedades en `Details`, no ejecuta un grafo procedural cada vez que mueves la instancia en el nivel. |
| `Event ActorBeginOverlap` | Suscripción a `listenable` de dispositivos, p. ej. `Trigger.TriggeredEvent.Subscribe(OnTriggered)` o `Volume.AgentEntersEvent.Subscribe(OnEnter)` | `docs` | No conectas un pin de ejecución libre: debes pasar una función manejadora cuya firma coincida exactamente con el payload del evento. |

**Fuentes oficiales (Categoría 1):**
- Blueprints: [Events in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/events-in-unreal-engine?application_version=5.8), [Unreal Engine Actor Lifecycle](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-actor-lifecycle?application_version=5.8), [Construction Script](https://dev.epicgames.com/documentation/en-us/unreal-engine/construction-script-in-unreal-engine?application_version=5.8).
- Verse: [creative_device API](https://dev.epicgames.com/documentation/en-us/fortnite/verse-api/fortnitedotcom/devices/creative_device), [Sleep API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/versedotorg/simulation/sleep), [Scene Graph in UEFN](https://dev.epicgames.com/documentation/en-us/uefn/scene-graph-in-unreal-editor-for-fortnite), [Creating Your Own Component](https://dev.epicgames.com/documentation/fortnite/creating-your-own-component-using-verse-in-unreal-editor-for-fortnite), [Coding Device Interactions](https://dev.epicgames.com/documentation/en-us/uefn/coding-device-interactions-in-verse), [listenable API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/versedotorg/verse/listenable).

---

## 2. Variables y tipos

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Boolean` (`bool`) | `logic` (`true` / `false`), p. ej. `IsOpen : logic = false` | `docs` | En un `if` no basta poner una variable `logic` suelta si buscas comprobar verdad: usa `if (IsOpen?):`. |
| `Integer` / `Integer64` | `int`, p. ej. `Score : int = 0` (división entera failable con `Quotient[A, B]`) | `docs` | El operador `/` sobre dos `int` produce un `rational` en contexto de fallo en lugar de truncar a entero como en Blueprints. |
| `Float` (`double` en UE5) | `float`, p. ej. `Speed : float = 100.0` | `docs` | Verse no promociona `int` a `float` automáticamente; mezclar `100` con `1.5` provoca error de compilación. |
| `String` / `Text` / `Name` | `string` (`"Puntos: {Score}"`) y `message` con `<localizes>` para UI; no existe tipo `FName` nativo | `docs` | Los widgets de texto en Verse exigen tipo `message` localizado, no un `string` sin formato. |
| `Vector` (`FVector`) | `vector3{X := 0.0, Y := 0.0, Z := 0.0}` (módulo `SpatialMath`) | `docs` | Existen dos módulos `SpatialMath` distintos (`UnrealEngine.com/Temporary/SpatialMath` y `Verse.org/SpatialMath`), y mezclar sus tipos falla al compilar. |
| `Rotator` (`FRotator`) | `rotation` (opaco), construido con `MakeRotation(Axis, AngleRadians)` o `MakeRotationFromYawPitchRollDegrees(Yaw, Pitch, Roll)` | `docs` | No puedes leer o modificar `.Yaw` o `.Pitch` directamente como campos públicos de un struct como en Blueprints. |
| `Enum` (`Blueprint Enumeration`) | `damage_type := enum{Physical, Fire}` | `docs` | Un `enum` de Verse no se convierte implícitamente en `byte` ni en `int` numérico. |
| `Struct` (`Make` / `Break` / `Set Members`) | `stats := struct{Health : int = 100}` e instanciación `stats{Health := 80}` | `docs` | Un `struct` es tipo de valor inmutable por defecto; para cambiar un campo debes guardarlo en `var` y usar `set`. |
| `Variable Get / Set` + `Instance Editable` | Inmutable `MaxHP := 100`; mutable `var HP : int = 100` + `set HP = 80`; `@editable` para `Details` | `docs` | Declarar `var` sin tipo explícito usando `:=` no está soportado, y reasignar sin `set` se interpreta como comparación `=`. |
| `Object Reference` / `Is Valid` | Tipo opcional `?t` (`option{Val}` / `false`), extraído con `if (V := Opt?):` | `docs` | No existe `null` suelto: el compilador te impide usar el valor hasta desenvolver `?` dentro de un contexto de fallo. |

**Fuentes oficiales (Categoría 2):**
- Blueprints: [Blueprint Variables](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-variables-in-unreal-engine?application_version=5.8), [Blueprint Struct Variables](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-struct-variables-in-unreal-engine?application_version=5.8).
- Verse: [Verse Language Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference), [Verse Glossary](https://dev.epicgames.com/documentation/en-us/fortnite/verse-glossary), [Specifiers and Attributes](https://dev.epicgames.com/documentation/en-us/uefn/specifiers-and-attributes-in-verse), [vector3 API](https://dev.epicgames.com/documentation/en-us/fortnite/verse-api/unrealenginedotcom/temporary/spatialmath/vector3), [MakeRotation API](https://dev.epicgames.com/documentation/en-us/fortnite/verse-api/unrealenginedotcom/temporary/spatialmath/makerotation), [In-Game User Interfaces](https://dev.epicgames.com/documentation/en-us/uefn/in-game-user-interfaces-in-unreal-editor-for-fortnite).

---

## 3. Funciones y macros

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Function` (`BlueprintCallable`) | `TakeDamage(Amount : int) : void = ...` (con `<transacts>` si muta estado transaccional) | `docs` | La última expresión del cuerpo es el valor devuelto; solo necesitas `return` explícito para salidas anticipadas. |
| `Pure Function` (`BlueprintPure` / `Const`) | `CalcDouble(X : int)<computes> : int = X * 2` (o `<reads>` si solo lee estado) | `docs` | A diferencia de los nodos puros de Blueprint que se reevalúan por cada pin conectado, `<computes>` es verificado estáticamente por el compilador. |
| Función con validación / fallo | `ValidateAge(Age : int)<decides><transacts> : int = ...`, invocada con `ValidateAge[42]` | `docs` | Llamar a una función `<decides>` con paréntesis `()` o fuera de un contexto de fallo produce error de compilación. |
| `Macro` / `Blueprint Macro Library` | Sin sistema de macros de múltiples pines en Verse; se sustituye por funciones `<suspends>`, genéricos (`where t:type`) o extension methods (*falta sistema de macros en Verse*) | `NO VERIFICADO` | No puedes crear nodos expandidos *in-line* con múltiples pines de ejecución de salida; devuelve un `enum`, `?t` o usa `<decides>`. |

**Fuentes oficiales (Categoría 3):**
- Blueprints: [Functions in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/functions-in-unreal-engine?application_version=5.8), [Macros in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/macros-in-unreal-engine?application_version=5.8).
- Verse: [Functions in Verse](https://dev.epicgames.com/documentation/en-us/uefn/function-verse), [Failure and Control Flow](https://dev.epicgames.com/documentation/en-us/uefn/basics-of-writing-code-9-failure-and-control-flow-in-verse), [Specifiers and Attributes](https://dev.epicgames.com/documentation/en-us/uefn/specifiers-and-attributes-in-verse), [Spawning a Grid of Platforms](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite).

---

## 4. Flujo de ejecución

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Branch` | `if (Condicion): ... else: ...` (o expresión inline `if (Cond) then A else B`) | `docs` | La cabecera del `if` es un contexto de fallo: si cualquier expresión de la condición falla, se revierten mutaciones `<transacts>` hechas en ella. |
| `Sequence` | Expresiones consecutivas línea a línea o agrupadas en `block:` | `docs` | No confundas `Sequence` síncrono con `sync:`, porque `sync:` solo sirve para esperar varias expresiones `<suspends>` concurrentes. |
| `Switch on <Type>` (`Int`, `String`, `Enum`) | `case (Valor): OptA => ...; _ => ...` | `docs` | En Verse cada rama del `case` es excluyente (sin *fall-through*) y suele requerir cobertura exhaustiva o caso `_ =>`. |
| `ForLoop` / `For Each Loop` | `for (Index := 0..Max - 1): ...` y `for (Index -> Item : Items, Item > 0): ...` | `docs` | Los rangos `0..N` son inclusivos en ambos extremos y `for` filtra con fallos en la cabecera en lugar de usar `break` interno. |
| `WhileLoop` | `loop:` con `if (not Cond): break` | `docs` | Un `loop:` sin `break`, `return` o `Sleep(...)` bloquea la ejecución igual que un *Infinite Loop* en Blueprints. |
| `DoOnce` / `DoN` | Sin constructo nativo; `var DidRun : logic = false` + `if (not DidRun?): set DidRun = true; ...` (*falta nodo nativo equivalente*) | `NO VERIFICADO` | El estado de bloqueo ya no vive oculto dentro de un nodo visual, sino en una variable `var` que debes reiniciar manualmente. |
| `Gate` / `FlipFlop` | Sin constructo nativo; `var IsOpen : logic = true` (`Gate`) o alternar `var IsA : logic = true` (`FlipFlop`) (*falta nodo nativo equivalente*) | `NO VERIFICADO` | Las entradas `Open`/`Close`/`Toggle` se traducen a métodos o asignaciones `set` explícitas sobre el campo `var`. |

**Fuentes oficiales (Categoría 4):**
- Blueprints: [Flow Control in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/flow-control-in-unreal-engine?application_version=5.8).
- Verse: [Failure and Control Flow](https://dev.epicgames.com/documentation/en-us/uefn/basics-of-writing-code-9-failure-and-control-flow-in-verse), [Expressions in Verse](https://dev.epicgames.com/documentation/en-us/uefn/expressions-in-verse), [Verse Language Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference).

---

## 5. Colecciones

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Array`: creación, `Get` y `Length` | `Items : []int = array{10, 20}`, acceso failable `Items[Index]`, tamaño `Items.Length` | `docs` | Leer `Items[Index]` fuera de rango no devuelve un valor por defecto sino que falla, por lo que exige un contexto como `if`. |
| `Array`: `Add`, `Remove`, `Find` | `set Items += array{30}`, `Items.RemoveElement[Index]`, `Items.RemoveFirstElement[Val]`, `Items.Find[Val]` | `docs` | Tanto la búsqueda como la eliminación fallan si el índice o elemento no existe y devuelven un array nuevo que debes reasignar con `set`. |
| `Map` (`Add`, `Find`, `Remove`) | `var Scores : [string]int = map{"A" => 10}`, lectura `Scores["A"]`, inserción `if (set Scores["B"] = 20) {}` | `docs` | Buscar una clave inexistente `Scores[Key]` falla en lugar de devolver un booleano más un valor por defecto `0`. |
| `Set` (colección de únicos) | Sin contenedor `Set` nativo en Verse; patrón habitual con `map` (p. ej. `[string]logic`) o comprobación previa en `[]t` (*falta tipo `Set` nativo en docs*) | `NO VERIFICADO` | La palabra clave `set` en Verse sirve para mutar variables `var`, no para declarar conjuntos de elementos únicos. |

**Fuentes oficiales (Categoría 5):**
- Blueprints: [Blueprint Variables](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-variables-in-unreal-engine?application_version=5.8).
- Verse: [Verse Language Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference), [Verse Glossary](https://dev.epicgames.com/documentation/en-us/fortnite/verse-glossary), [Spawning a Grid of Platforms](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite), [Debugging and Troubleshooting](https://dev.epicgames.com/documentation/en-us/uefn/debugging-and-troubleshooting-in-verse).

---

## 6. Clases, herencia, interfaces y casting

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Blueprint Class` (`Parent Class`) | `enemy := class(base_unit): ...` (herencia simple de clase) | `docs` | Verse instancia clases mediante sintaxis arquetipo `enemy{Health := 100}`, no con funciones constructoras tradicionales. |
| `Override` + `Add Call to Parent Function` | `Method<override>():void = (super:)Method()` | `docs` | El especificador de sobrescritura lleva picoparéntesis `<override>` (no `@override`) y la llamada al padre usa `(super:)`. |
| `Components Window` / `Add Component` | Composición con `entity` + `component` en *Scene Graph* (`Entity.GetComponent[my_comp]`) o `@editable` hacia dispositivos | `docs` | En un `creative_device` clásico no añades subcomponentes visuales dinámicos; esa composición vive en *Scene Graph* (`Beta`). |
| `Blueprint Interface (BPI)` | `interactable := interface: Interact():void` e implementación `door := class(interactable): Interact<override>():void = ...` | `docs` | Al implementar un método de una interfaz en tu clase, debes escribir `<override>` en la firma aunque la interfaz no tenga cuerpo. |
| `Access Specifiers` (`Public` / `Private` / `Protected`) | `<public>`, `<private>`, `<protected>`, `<internal>` | `docs` | Todo miembro sin especificador explícito en Verse es `<internal>` al módulo, mientras que en Blueprints muchas variables suelen quedar expuestas por defecto. |

**Fuentes oficiales (Categoría 6):**
- Blueprints: [Components Window](https://dev.epicgames.com/documentation/en-us/unreal-engine/components-window-in-unreal-engine?application_version=5.8), [Implementing Blueprint Interfaces](https://dev.epicgames.com/documentation/en-us/unreal-engine/implementing-blueprint-interfaces-in-unreal-engine?application_version=5.8).
- Verse: [Specifiers and Attributes](https://dev.epicgames.com/documentation/en-us/uefn/specifiers-and-attributes-in-verse), [Verse Language Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference), [Creating Your Own Component](https://dev.epicgames.com/documentation/fortnite/creating-your-own-component-using-verse-in-unreal-editor-for-fortnite), [Scene Graph in UEFN](https://dev.epicgames.com/documentation/en-us/uefn/scene-graph-in-unreal-editor-for-fortnite).

---

## 7. Comunicación

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Direct Blueprint Communication` | Referencia `@editable TargetBtn : button_device = button_device{}` y llamada `TargetBtn.Enable()` | `docs` | Un campo `@editable` no puede quedar sin valor inicial en su definición; usa una instancia vacía o un opcional `?button_device = false`. |
| `Cast To <Class>` | `if (Light := customizable_light_device[Obj]): Light.TurnOn()` (requiere `<castable>` en tipos propios) | `docs` | El cast en Verse usa corchetes `[]` dentro de un contexto de fallo y falla en tiempo de compilación en clases propias que no declaraste con `<castable>`. |
| `Interface Message Node` (`(Message)`) | Cast failable a la interfaz: `if (Inter := interactable[Obj]): Inter.Interact()` | `docs` | No existe un nodo de mensaje silencioso automático sin comprobar tipo; primero conviertes la referencia a la interfaz con `[]`. |
| `Event Dispatcher` (`Call` / `Bind` / `Assign`) | `listenable` en dispositivos (`Event.Subscribe(Handler)`) o `event(t)` propio con `.Signal(Val)` y `.Await()` | `docs` | `event(t)` nativo usa sincronización `Signal`/`Await` dentro de `<suspends>`, mientras que cancelar una suscripción `Subscribe` requiere guardar su `cancelable`. |
| `Get All Actors of Class` / `Actor Tags` | `for (Obj : FindCreativeObjectsWithTag(my_tag{})): ...` (o `FindDescendantEntitiesWithComponent` en *Scene Graph*) | `docs` | `FindCreativeObjectsWithTag` devuelve un generador de `creative_object_interface`, así que debes iterar y castear cada elemento con `[]`. |

**Fuentes oficiales (Categoría 7):**
- Blueprints: [Blueprint Communications](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-communications-in-unreal-engine?application_version=5.8), [Implementing Blueprint Interfaces](https://dev.epicgames.com/documentation/en-us/unreal-engine/implementing-blueprint-interfaces-in-unreal-engine?application_version=5.8), [Calling Event Dispatchers](https://dev.epicgames.com/documentation/en-us/unreal-engine/calling-event-dispatchers-in-unreal-engine?application_version=5.8).
- Verse: [Coding Device Interactions](https://dev.epicgames.com/documentation/en-us/uefn/coding-device-interactions-in-verse), [Verse Tags in Fortnite](https://dev.epicgames.com/documentation/en-us/uefn/verse-tags-in-fortnite), [listenable API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/versedotorg/verse/listenable), [Creating Your Own Component](https://dev.epicgames.com/documentation/fortnite/creating-your-own-component-using-verse-in-unreal-editor-for-fortnite).

---

## 8. Tiempo y asincronía

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Delay` | `Sleep(2.0)` dentro de una función `<suspends>` | `docs` | El efecto `<suspends>` se propaga hacia arriba: no puedes llamar a `Sleep` desde una función síncrona ni combinar `<suspends>` con `<decides>`. |
| `Retriggerable Delay` | Sin nodo nativo; patrón combinando `loop` y `race` entre `Sleep(Seconds)` y un `event()` de reinicio (*falta función nativa equivalente*) | `NO VERIFICADO` | Lanzar un nuevo `spawn{Sleep(...)}` en cada evento acumula esperas paralelas en lugar de reiniciar la cuenta atrás única. |
| `Set Timer by Event` / `Clear Timer by Handle` | `TimerTask := spawn{RunTimer()}` con `loop` + `Sleep(Interval)` y cancelación con `TimerTask.Cancel()` (o `race` con parada) | `docs` | A diferencia de `branch`, un `spawn` sobrevive al ámbito donde se creó y no tiene pausa nativa directa equivalente a `Pause Timer by Handle`. |
| `Timeline` (`UTimelineComponent`) | Sin componente de curvas visual equivalente en Verse; interpolación manual con `loop` + `Sleep(0.0)` o dispositivos externos (*falta API de Timeline*) | `NO VERIFICADO` | No existen pistas editables de *Float/Vector* ni pines `Update`/`Finished` dentro de un archivo `.verse`. |
| `Latent Actions` paralelas | Concurrencia estructurada: `sync:` (espera todas), `race:` (gana la primera y cancela el resto), `rush:` (gana la primera sin cancelar) | `docs` | Un `return` dentro de un brazo de `sync` o `race` sale de toda la función contenedora, y está prohibido dentro de `branch` y `spawn`. |

**Fuentes oficiales (Categoría 8):**
- Blueprints: [Gameplay Timers](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-timers-in-unreal-engine?application_version=5.8), [Timelines in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/timelines-in-unreal-engine?application_version=5.8).
- Verse: [Concurrency Overview](https://dev.epicgames.com/documentation/en-us/uefn/concurrency-overview-in-verse), [Sleep API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/versedotorg/simulation/sleep).

---

## 9. Input

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `EnhancedInputAction` (`Started` / `Completed`) | `@editable InputTrigger : input_trigger_device` con `PressedEvent.Subscribe(...)` y `ReleasedEvent.Subscribe(...)` | `docs` | En UEFN Verse el evento entrega un `agent` (que debes convertir con `player[InAgent]`), no pines separados `Triggered`/`Ongoing`/`Canceled` de *Enhanced Input*. |
| `Enhanced Input` — ejes continuos (`Axis1D` / `Axis2D` / `Axis3D`) | Sin lectura directa de ejes analógicos ni `Action Value` continuo en la API pública de UEFN (*falta API pública de ejes en Verse*) | `NO VERIFICADO` | `input_trigger_device` solo notifica pulsaciones y liberaciones discretas, no el desplazamiento continuo del stick o ratón cada frame. |
| `Add Mapping Context` / `Remove Mapping Context` | En UEFN se habilita por jugador en el dispositivo (`InputTrigger.Register(Player)` / `Unregister(Player)`); sin gestor `IMC_` con prioridades (*falta API de Mapping Context*) | `NO VERIFICADO` | No puedes apilar contextos `InputMappingContext` por prioridad desde Verse como en `UEnhancedInputLocalPlayerSubsystem`. |

**Fuentes oficiales (Categoría 9):**
- Blueprints: [Enhanced Input in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine?application_version=5.8).
- Verse: [input_trigger_device API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/fortnitedotcom/devices/input_trigger_device).

---

## 10. UI (UMG)

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Create Widget` + `Add to Viewport` / `Remove from Parent` | `if (PlayerUI := GetPlayerUI[Player]): PlayerUI.AddWidget(MyWidget)` y `PlayerUI.RemoveWidget(MyWidget)` | `docs` | `GetPlayerUI[Player]` es una llamada failable por jugador y debes almacenar la referencia del widget añadido para poder retirarlo luego. |
| `Widget Blueprint` (`Canvas Panel`, `Text`, `Button`) | Jerarquía en código (`/UnrealEngine.com/Temporary/UI` y `/Fortnite.com/UI`): `canvas`, `canvas_slot`, `text_block`, `button_loud` + `.OnClick().Subscribe(...)` | `docs` | La UI creada puramente en Verse se construye como structs en código sin editor visual *Designer*, y pertenece a módulos `Temporary`. |
| `Property Binding` / `Set Text` | `MyTextBlock.SetText(Msg)` (empuje con tipo `message`) o **UMG Viewmodels** (`View Bindings` en UEFN) | `docs` | `SetText` rechaza `string` directo y exige `message` con `<localizes>` para admitir traducción. |
| `Set Input Mode UI Only` / `Game Only` + Cursor | `PlayerUI.AddWidget(Widget, player_ui_slot{InputMode := ui_input_mode.All})` (`All` captura input/cursor; `None` pasa al juego) | `docs` | En lugar de llamar a nodos globales del `PlayerController`, el bloqueo de entrada y cursor va ligado al `player_ui_slot` del widget activo. |

**Fuentes oficiales (Categoría 10):**
- Blueprints: [Creating Widgets](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-widgets-in-unreal-engine?application_version=5.8).
- Verse: [In-Game User Interfaces](https://dev.epicgames.com/documentation/en-us/uefn/in-game-user-interfaces-in-unreal-editor-for-fortnite), [Using the Viewmodel in UMG](https://dev.epicgames.com/documentation/en-us/uefn/using-the-viewmodel-in-umg-in-unreal-editor-for-fortnite), [player_ui API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/unrealenginedotcom/temporary/ui/player_ui).

---

## 11. Spawn y destrucción de actores

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `Spawn Actor from Class` | `SpawnProp(PropAsset, Pos, Rot)` (UEFN) o `Prefab := my_prefab{}; Entity.AddEntities(array{Prefab})` (*Scene Graph*) | `docs` | `SpawnProp` devuelve una tupla `(?creative_prop, spawn_prop_result)` y debes comprobar su primer campo `(0)?` dentro de un `if`. |
| `Destroy Actor` | `if (MyProp.IsValid[]): MyProp.Dispose()` (props) o `MyEntity.RemoveFromParent()` (*Scene Graph*) | `docs` | Llamar a `Dispose()` sin verificar `IsValid[]` puede fallar en objetos ya eliminados, y los dispositivos estáticos del nivel no se destruyen así. |
| `Deferred Spawn` (`Expose on Spawn`) | Sin equivalente de `SpawnActorDeferred` ni pines `Expose on Spawn` en `SpawnProp`; en *Scene Graph* se configuran campos antes de `AddEntities` (*falta API de Deferred Spawn*) | `NO VERIFICADO` | No puedes pasar argumentos de inicialización por clase directamente en la llamada a `SpawnProp` como en `Spawn Actor from Class`. |

**Fuentes oficiales (Categoría 11):**
- Blueprints: [Spawning and Destroying Actors](https://dev.epicgames.com/documentation/en-us/unreal-engine/spawning-and-destroying-unreal-engine-actors?application_version=5.8).
- Verse: [SpawnProp API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/fortnitedotcom/devices/spawnprop), [Spawning a Grid of Platforms](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite), [Scene Graph in UEFN](https://dev.epicgames.com/documentation/en-us/uefn/scene-graph-in-unreal-editor-for-fortnite).

---

## 12. Save/Load y depuración

| Blueprint (nombre oficial EN) | Verse (sintaxis/patrón) | Estado (docs / NO VERIFICADO) | Trampa del migrante (una frase) |
| :--- | :--- | :--- | :--- |
| `SaveGame` (`Save Game to Slot` / `Load Game from Slot`) | Variable `weak_map(player, player_data)` a nivel de módulo con datos `<persistable>` | `docs` | Un `weak_map` persistente no permite iteración ni `.Length`, solo acepta claves `player` (o `session` temporal) y tiene límite máximo por módulo. |
| `Print String` / `Output Log` | `Print("Valor: {X}")` (`Diagnostics`) o `Logger := log{Channel := my_channel}` + `Logger.Print(...)`; `profile("Tag"): ...` para medir tiempos | `docs` | Olvidar `using { /UnrealEngine.com/Temporary/Diagnostics }` impide usar `Print`, y los logs filtrables exigen crear una subclase de `log_channel`. |
| `Blueprint Debugger` (`Breakpoints` / `Watches`) | Sin debugger visual interactivo paso a paso equivalente documentado para código Verse en UEFN; se depura con `Print`, `log`, `profile` y errores del compilador (*falta debugger paso a paso en UEFN docs*) | `NO VERIFICADO` | No puedes colocar puntos de interrupción rojos ni inspeccionar cables en vivo dentro de UEFN como en el grafo de Blueprints. |

**Fuentes oficiales (Categoría 12):**
- Blueprints: [Blueprint Variables](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-variables-in-unreal-engine?application_version=5.8) (`SaveGame` flag), [Blueprint Best Practices](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-best-practices-in-unreal-engine?application_version=5.8).
- Verse: [Using Persistable Data in Verse](https://dev.epicgames.com/documentation/en-us/uefn/using-persistable-data-in-verse), [43.00 Release Notes](https://dev.epicgames.com/documentation/fortnite/43-00-fortnite-ecosystem-updates-and-release-notes), [Debugging and Troubleshooting in Verse](https://dev.epicgames.com/documentation/en-us/uefn/debugging-and-troubleshooting-in-verse), [Modify and Run Your First Verse Program](https://dev.epicgames.com/documentation/en-us/fortnite/modify-and-run-your-first-verse-program-in-unreal-editor-for-fortnite).
