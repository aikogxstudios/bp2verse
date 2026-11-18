# Investigación técnica: Verse de Epic Games

**Fecha de consulta:** 2026-11-19  
**Alcance:** documentación pública oficial de Epic Games, la referencia Book of Verse enlazada por Epic y referencias oficiales de Unreal Engine. No se ejecutó código ni se instalaron herramientas.

## Resumen ejecutivo

- Verse es un lenguaje de Epic para programar gameplay; hoy su entorno público de autoría y compilación documentado es UEFN/Fortnite.
- Desde UEFN 32.00 (2024-11-01), Verse Language Version 1 es la línea estabilizada. Esto no congela la Verse API ni convierte en estables todas las funciones nuevas.
- Scene Graph es un sistema nativo de Verse basado en entidades y componentes, pero la documentación de UEFN aún lo etiqueta **Beta** y advierte cautela al publicar.
- El roadmap oficial sitúa Unreal Engine 6 (UE6) en desarrollo; declara Early Access hacia finales de 2027. A la fecha de este informe no es un producto disponible para autoría general.
- En UEFN se edita principalmente con VS Code y la extensión que acompaña a UEFN; compilar, cocinar y probar siguen ligados al editor/proyecto UEFN.
- No se encontró documentación oficial que ofrezca un compilador Verse independiente, un playground público general o ejecución de código Verse fuera de Unreal/UEFN.
- La sintaxis distingue valores inmutables, `var` y `set`; los tipos se infieren con `:=`, excepto que `var` necesita tipo declarado.
- El modelo de fallo es parte del lenguaje: expresiones failable y `<decides>` se integran con `if`, `for`, `option` y rollback transaccional.
- Las funciones declaran efectos. `transacts`, `decides`, `computes`, `allocates` y `suspends` no son decoraciones intercambiables: afectan qué operaciones pueden llamar y cómo se manejan.
- El Book of Verse es la referencia detallada mejor organizada, pero Epic advierte que sigue la rama principal de desarrollo y puede describir capacidades no publicadas.

## 1. Qué es Verse y estado actual

Epic define Verse como un lenguaje desarrollado para crear gameplay en Unreal Editor for Fortnite (UEFN), personalizar dispositivos y construir lógica de juego. No es solamente un lenguaje de scripting de dispositivos: su referencia describe un lenguaje general con módulos, tipos, genéricos, efectos, fallo y concurrencia.

### UEFN frente a UE6

| Contexto | Estado a 2026-11-19 | Qué se puede afirmar |
|---|---|---|
| **UEFN / Fortnite** | Flujo público y soportado | Epic documenta crear archivos `.verse`, editarlos con VS Code, compilar desde UEFN, añadir Verse-authored devices/componentes y probarlos en una sesión de Fortnite. La Verse API pública aquí es específica de la versión de Fortnite/UEFN. |
| **Verse Language Version 1** | Lenguaje estabilizado en UEFN desde 32.00, 2024-11-01 | Epic conserva cambios incompatibles para una actualización explícita del proyecto y advierte/depreca código al guardar. “Version 1” no significa que Verse API, herramientas y funciones experimentales sean inmutables. |
| **Scene Graph en UEFN** | **Beta** en las páginas consultadas | Epic invita a usarlo con cautela al publicar. También hay funciones y APIs marcadas Experimental, con cambios y limitaciones entre releases. |
| **UE6** | En desarrollo; no disponible todavía para uso general | “The road to UE 6” presenta Scene Graph como el nuevo marco de gameplay basado en Verse y prevé Early Access hacia finales de 2027. La publicación dice que la implementación de Verse visible en el stream de UE6 no está destinada a adopción general por ahora. |
| **Unreal Engine 5.8** | Hay documentación de API C++ relacionada con VerseCompiler | Que exista un módulo `VerseCompiler` en la referencia C++ de UE 5.8 no demuestra que UE 5.8 ofrezca un entorno público equivalente a UEFN para escribir y ejecutar gameplay Verse. **[NO VERIFICADO]** No se localizó un flujo público de autoría Verse/Scene Graph en UE 5.8. |

**Conclusión sobre estabilidad:** la sintaxis y semántica de Verse 1 constituyen la base más segura para código UEFN; los módulos de API, clases disponibles, atributos de editor, funciones `Temporary`, Scene Graph y features experimentales deben comprobarse contra la versión concreta de UEFN. La referencia API consultada declara **Verse API version 43.10**; las release notes de UEFN 43.00 son del 1 de noviembre de 2026.

Fuentes: [Verse Language Version 1 Updates and Deprecations](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-version-updates-and-deprecations-in-verse), [Verse API Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-api), [Scene Graph](https://dev.epicgames.com/documentation/en-us/uefn/scene-graph-in-unreal-editor-for-fortnite), [43.00 Release Notes](https://dev.epicgames.com/documentation/fortnite/43-00-fortnite-ecosystem-updates-and-release-notes), [The road to Unreal Engine 6](https://www.unrealengine.com/news/the-road-to-ue-6).

## 2. Herramientas, compilación y ejecución

El flujo oficial descrito por Epic:

1. Se crea o abre un proyecto en UEFN y se crea el archivo con Verse Explorer.
2. El archivo `.verse` se abre en Visual Studio Code.
3. La extensión Verse que acompaña a UEFN proporciona syntax highlighting, error checking, `Build Verse Changes` y `Push Verse Changes`.
4. `Verse > Build Verse Code` compila los archivos Verse del proyecto; el editor presenta errores de compilación.
5. Se incorpora un Verse device o componente a la escena/proyecto y se usa `Launch Session` para probarlo.

Epic indica que la extensión incluida con UEFN es la **única extensión de lenguaje Verse oficialmente soportada**; si se quita, se reinstala al volver a abrir UEFN. VS Code es el editor, no evidencia de un compilador autónomo.

### ¿Hay compilador standalone o playground?

**[NO VERIFICADO] No se pudo confirmar que exista un compilador Verse standalone o un playground público general oficialmente soportado.** La documentación pública de Epic describe el build asociado a UEFN y no presenta un comando de compilador independiente ni una distribución autónoma del runtime. En sentido estricto, la falta de una página pública no prueba que no exista internamente algún componente o herramienta privada.

La referencia de Unreal Engine 5.8 sí contiene símbolos del módulo C++ `VerseCompiler` (por ejemplo, gramática/parser y nodos de AST). Son APIs de implementación del motor; por sí solos no constituyen un compilador CLI, una experiencia de desarrollo soportada o un runtime de usuario independiente. De igual modo, que el roadmap diga que la implementación puede verse en el stream de UE6 no equivale a soporte para uso general.

**¿Puede correr Verse fuera de Unreal?** **[NO VERIFICADO]** La documentación de usuario consultada no documenta un runtime/target general no-Unreal. Las APIs de gameplay son específicas de Fortnite/UEFN y las llamadas del Book de Verse se vinculan a runtimes/VMs del ecosistema de Epic. Por tanto, no debe prometerse portabilidad a una app, servidor o motor externo sin una fuente primaria específica.

Fuentes: [Modify and Run Your First Verse Program](https://dev.epicgames.com/documentation/en-us/fortnite/modify-and-run-your-first-verse-program-in-unreal-editor-for-fortnite), [Verse Language Get Started](https://dev.epicgames.com/documentation/en-us/fortnite/verse-language-get-started-in-unreal-editor-for-fortnite), [UE 5.8 VerseCompiler API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/VerseCompiler), [UE 5.8 Package API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/VerseCompiler/Package), [The road to Unreal Engine 6](https://www.unrealengine.com/news/the-road-to-ue-6).

## 3. Sintaxis y semántica esencial

### Módulos, archivos y `using`

- Un módulo agrupa definiciones y controla visibilidad; las rutas suelen ser jerárquicas, por ejemplo `/Fortnite.com/Devices`.
- En proyectos UEFN, los archivos `.verse` del proyecto se agrupan por el sistema de módulos/proyecto. Los archivos se crean con Verse Explorer; los `using` importan módulos de API o módulos propios.
- Las dependencias externas se escriben normalmente como `using { /Verse.org/Simulation }`. Los imports son de ámbito de archivo o módulo, no una instrucción de ejecución.
- La referencia Book of Verse explica que los módulos y rutas son parte del mecanismo de organización/evolución. Para nombres y accesos reales debe consultarse el manifest/API generado por la versión del proyecto.

### Constantes, variables e inferencia

- Una definición ordinaria (`Name : type = value`) no se reasigna; `:=` deja que el compilador infiera el tipo, por ejemplo `Answer := 42`.
- `var` declara un binding mutable y `set` lo modifica: `var Score : int = 0` seguido de `set Score += 1`.
- La declaración mutable tiene tipo explícito; usar `:=` para inferir una variable `var` no es el patrón válido documentado por el Book of Verse.
- Arrays, maps, tuples y structs son tipos de valor; una asignación/actualización puede reemplazar el valor. Las clases tienen identidad/referencia según sus especificadores y semántica de clase.

### Tipos

| Categoría | Tipos / forma | Observaciones |
|---|---|---|
| Primitivos | `int`, `float`, `rational`, `logic`, `char`, `char32`, `string` | `logic` contiene `true`/`false`. La división entera puede fallar y producir `rational`; no asumir conversiones implícitas de números como en otros lenguajes. |
| Especiales | `void`, `any`, `type` | `any` es supertipo de todos; ofrece pocas operaciones útiles sin restringir/castear. `void` representa resultado sin valor significativo. |
| Opcionales | `?T` | Contienen un valor `T` o están vacíos; `false` representa la ausencia, `option{value}` empaqueta uno y `Optional?` intenta extraerlo en un contexto failable. |
| Tuplas | `tuple(T1, T2, ...)`; valor `(a, b)` | Agrupan cantidad fija de valores, potencialmente heterogéneos. |
| Arrays | `[]T`; literal `array{...}` | Colección homogénea indexada desde cero. Indexación es failable si el índice no es válido. |
| Maps | `[K]V`; literal `map{key => value}` | Asociaciones clave/valor; búsqueda puede fallar. La key debe ser comparable según restricciones de la versión. |
| `weak_map` | `weak_map(K, V)` | No permite iteración ni recorrido global; es clave para persistence. |
| Compuestos | `class`, `struct`, `interface`, `enum` | Classes tienen métodos/herencia simple; interfaces expresan contratos, pueden combinarse; structs agrupan datos; enums nombran un conjunto de valores. |

La inferencia se usa sobre todo para valores inmutables y resultados: `Value := Expression`. En parámetros, campos exportados y muchos contextos de módulo la anotación explícita mejora la legibilidad y puede ser requerida por el contexto. Las funciones genéricas parametrizan tipos, por ejemplo `where t:type`; no reemplazar automáticamente genéricos tipados por `any`.

### Funciones y efectos

Forma común: `FunctionName(Param:type):ReturnType = expression`. Los parámetros se nombran y las llamadas pueden usar `[]` cuando una función/expresión es failable. Las funciones pueden devolver el valor de la última expresión del cuerpo; los efectos forman parte de su firma.

| Efecto | Significado práctico |
|---|---|
| `<computes>` | Cómputo puro: no lee/escribe estado mutable observable; misma entrada produce mismo resultado. |
| `<transacts>` | Permite operaciones transaccionales sobre estado. Es necesario para que mutaciones puedan participar en rollback. |
| `<decides>` | La función puede fallar; se consume desde un failure context, normalmente mediante `[]`. En la referencia UEFN, una función `decides` debe tener también `transacts`. |
| `<allocates>` | Permite la asignación de identidad/memoria mutable de acuerdo con las restricciones de tipo. |
| `<suspends>` | Puede suspender y reanudarse en ticks futuros; necesario para concurrencia/esperas. No se combina en una firma con `<decides>`. |
| `<reads>`, `<writes>` | Efectos más específicos de acceso a estado, presentes en la taxonomía más amplia del Book of Verse; comprobar compatibilidad con el lenguaje/API destino. |
| `no_rollback` | Efecto por defecto/no reversible descrito por la documentación; no permite usar esa operación dentro de contextos que necesitan rollback. |

**Fallo no es una excepción ni un valor `null`:** es una vía normal de control. En un failure context, si un paso falla, el resto de esa vía no se ejecuta. Los cambios transaccionales especulativos se deshacen al fallar. En cambio, `?T` es un tipo que almacena éxito/ausencia como dato y puede convertirse en/de fallo.

### Control de flujo y expresiones

- Verse enfatiza que expresiones como `if`, `case`, `for` y bloques producen valores; el valor de un bloque es la última expresión evaluada.
- `if` suele evaluar una condición failable. Puede encadenar filtros y bindings; los bindings de condición están disponibles en la rama de éxito.
- `for` puede iterar arrays/maps/rangos, filtrar por fallo y producir un array de resultados. El rango `A..B` es inclusivo.
- `case` sirve para alternativas discretas y enums; la exhaustividad depende del tipo de enum y del contexto. `loop` repite hasta un `break` válido.
- Operadores de éxito/fallo (`and`, `or`, `not`, `?`) son parte del modelo lógico, no simples sinónimos de boolean branching.

### Concurrencia

Las funciones que pueden esperar usan `<suspends>`. Epic documenta concurrencia estructurada como preferible cuando es posible:

- `sync`: ejecuta varias expresiones async y espera a todas; devuelve resultados agrupados.
- `race`: la primera rama que termina gana y las demás se cancelan.
- `rush`: primera que termina devuelve resultado, pero las demás continúan.
- `branch`: inicia trabajo async dentro del scope actual; se cancela al salir de ese scope.
- `spawn`: única forma de concurrencia no estructurada; puede continuar fuera del scope que la originó. Úsese con cautela.

La semántica concreta de disponibilidad de algunas operaciones relacionadas con `task` puede variar: el Book of Verse marca expresamente ciertas funciones/features como unreleased. Para código UEFN, preferir los constructos de concurrencia que estén aceptados por el compilador de la versión objetivo y consultar el quick reference oficial.

### `weak_map` y persistence

`weak_map` no es un `map` general reemplazable sin consecuencias: no se puede iterar ni leer su longitud. El patrón documentado es usar una variable `weak_map` a nivel de módulo con valores persistables; típicamente `player` como key para datos persistentes de jugador, o `session` para estado de sesión. Actualizar una entrada se hace individualmente y puede formar parte de una transacción.

En UEFN 43.00 Epic elevó de 4 a 6 el máximo de variables `weak_map` por módulo de proyecto. Este límite es un detalle de plataforma/versionado y debe validarse de nuevo al actualizar UEFN.

### Attributes, specifiers y override

- **Attributes** usan `@`, e.g. `@editable`, que expone propiedades al editor para configurar instancias; hay atributos más específicos para controles/metadata.
- **Specifiers** aparecen entre `<...>` y tienen semántica del lenguaje/API: `<public>`, `<private>`, `<protected>`, `<override>`, `<final>`, `<abstract>`, `<unique>`, `<persistable>`, `<concrete>`, `<allocates>`.
- Corrección terminológica: la forma documentada es **`<override>`**, no `@override`; `@editable` sí es un attribute.
- `<public>` publica el miembro; lo no-public tiene acceso interno por defecto. `<private>` y `<protected>` limitan visibilidad. La disponibilidad exacta de algunos class specifiers depende del tipo y contexto.
- En clases, `<override>` implementa/reemplaza un miembro heredado con firma compatible. En Scene Graph, métodos de ciclo de vida como `OnSimulate` se suelen declarar `OnSimulate<override>()<suspends>:void`.
- `@editable` es común en Verse devices y Scene Graph components para exponer referencias y valores a la persona que edita el nivel.

## 4. Scene Graph y gameplay API actual

### Modelo

Scene Graph describe una jerarquía dinámica de **entities**. Una entity contiene o tiene como padre otras entities; el comportamiento y los datos se añaden mediante **components**. El editor permite empaquetar jerarquías en **prefabs** reutilizables. Un prefab se expone a Verse como clase en assets/digest generado; se crea una instancia y se añade a la jerarquía para introducirla en la escena.

El módulo de API consultado reúne tipos de `SceneGraph`, spatial math, perception, input, simulation, assets, etc. Las APIs de gameplay específicas de Fortnite se documentan aparte bajo `Fortnite.com`, incluyendo `Devices`, `Characters`, `AI`, `Game`, `Playspaces`, `Teams` y otros módulos. El API Reference indica la versión que cubre; no es una API universal e independiente del runtime.

### Ciclo de vida y operaciones documentadas

- Componentes tienen ciclo de vida: inicialización, añadir a escena, comenzar/terminar simulación, retirar de escena y desinicializar. `OnSimulate` puede suspender; el framework cancela la tarea al terminar el componente/juego.
- Desde Verse se pueden consultar componentes/ancestros/descendientes, añadir/quitar componentes y entidades, buscar tags, y hacer overlap/sweep queries.
- La documentación advierte que las búsquedas repetidas por jerarquías pueden ser costosas y acoplan la lógica a la estructura de entities.
- La guía y la referencia API aún señalan Scene Graph como Beta. No confundir documentación accesible con garantía de estabilidad para publicar.

### Muestra API en la versión consultada

La referencia generada presenta, por ejemplo, una función de gameplay device con firma:

```verse
TeleportTo<public>(Transform:transform)<transacts><decides>:void
```

Es un ejemplo literal de firma API (la página concreta es para `creative_object`), no un método de Scene Graph ni garantía de que el objeto caller sea siempre válido.

Las release notes 43.00 señalan que el código Verse aún no corre en el cliente para ciertas funciones de Scene Graph camera; las cámaras con custom modifiers ejecutan en server y replican estado. Por ello, no asumir que un component o callback se ejecuta localmente en cliente sin confirmarlo para cada API.

Fuentes: [Scene Graph](https://dev.epicgames.com/documentation/en-us/uefn/scene-graph-in-unreal-editor-for-fortnite), [SceneGraph module API](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/unrealenginedotcom/temporary/scenegraph), [Creating Your Own Component](https://dev.epicgames.com/documentation/fortnite/creating-your-own-component-using-verse-in-unreal-editor-for-fortnite), [Spawning a Grid of Platforms](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite), [Verse API: TeleportTo](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/fortnitedotcom/devices/creative_object/teleportto-1), [43.00 Release Notes](https://dev.epicgames.com/documentation/fortnite/43-00-fortnite-ecosystem-updates-and-release-notes).

## 5. Ejemplos breves copiados de documentación oficial

Los fragmentos siguientes son extractos literales; cuando se omite el contexto alrededor, son **fragmentos** y no necesariamente archivos completos compilables. La sintaxis del Book of Verse corresponde a la rama principal de esa documentación; confirmar cada característica con UEFN antes de usarla. Se conservan las formas originales en inglés.

### 1. Interpolación y llamada simple

```verse
Print("2 + 2 = {2 + 2}")
```

Fuente: [Modify and Run Your First Verse Program](https://dev.epicgames.com/documentation/en-us/fortnite/modify-and-run-your-first-verse-program-in-unreal-editor-for-fortnite).

### 2. Mutación con `var` y `set`

```verse
var C :int= (-MyInt + MyHugeInt - 2) * 3
set C += 1
```

Fuente: [Book of Verse — Primitive Types](https://verselang.github.io/book/02_primitives/).

### 3. Optional con valor o vacío

```verse
A:?int = option{42}
var B:?int = false
```

Fuente: [Book of Verse — Container Types](https://verselang.github.io/book/03_containers/).

### 4. Array e indexación failable en `if`

```verse
ExampleArray : []int = array{10, 20, 30}
for (Index := 0..ExampleArray.Length - 1):
    if (Element := ExampleArray[Index]):
        Print("{Element} in ExampleArray at index {Index}")
```

Fuente: [Book of Verse — Container Types](https://verselang.github.io/book/03_containers/).

### 5. Map y lectura por key

```verse
var Weights:[string]float = map{
    "ant" => 0.0001,
    "elephant" => 500.0
}
```

Fuente: [Book of Verse — Container Types](https://verselang.github.io/book/03_containers/).

### 6. `weak_map` persistente por player

```verse
var PlayerSaveData:weak_map(player, player_data) = map{}
```

Fuente: [Book of Verse — Modules and Paths](https://verselang.github.io/book/16_modules/). Consultar la documentación UEFN actual para las restricciones de persistencia de los tipos.

### 7. Módulos y `using`

```verse
using { /Verse.org/Random }
using { /Fortnite.com/Devices }
```

Fuente: [Book of Verse — Modules and Paths](https://verselang.github.io/book/16_modules/).

### 8. Struct, enum y fields

```verse
damage_type := enum:
    Physical
    Fire
```

Fuente: [Book of Verse — Structs & Enums](https://verselang.github.io/book/09_structs_enums/).

### 9. Class con campo mutable y método

```verse
character := class:
    var Health : int = 100
    TakeDamage(Amount : int) : void =
        set Health = Max(0, Health - Amount)
```

Fuente: [Book of Verse — Classes & Interfaces](https://verselang.github.io/book/10_classes_interfaces/).

### 10. Función que puede fallar

```verse
ValidateAge(Age:int)<decides>:int =
    Age >= 0
    Age <= 150
    Age
```

Fuente: [Book of Verse — Failure](https://verselang.github.io/book/08_failure/).

### 11. Binding failable en `if`

```verse
if (Value := Array[Index]):
    Process(Value)
```

Fuente: [Book of Verse — Failure](https://verselang.github.io/book/08_failure/).

### 12. Binding de componente en Scene Graph

```verse
if:
    LightComponent := Entity.GetComponent[light_component]
then:
```

Fuente: [Creating Your Own Component using Verse](https://dev.epicgames.com/documentation/fortnite/creating-your-own-component-using-verse-in-unreal-editor-for-fortnite).

### 13. `sync` concurrente

```verse
sync:
    FetchTextures()
    FetchSounds()
    FetchModels()
```

Fuente: [Book of Verse — Concurrency](https://verselang.github.io/book/14_concurrency/).

### 14. `race` con resultado identificable

```verse
race:
    block:
        SlowOperation()
        1
    block:
        FastOperation()
        2
```

Fuente: [Book of Verse — Concurrency](https://verselang.github.io/book/14_concurrency/).

### 15. Array extension method genérico documentado en tutorial UEFN

```verse
(Input:[]t where t:subtype(comparable)).ChooseOne()<decides><transacts>:tuple(t, []t)=
    ChosenElement := Input[GetRandomInt(0, Input.Length - 1)]
    NotChosenElements := Input.RemoveFirstElement[ChosenElement]
    (ChosenElement, NotChosenElements)
```

Fuente: [Spawning a Grid of Platforms with Scene Graph](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite).

### 16. Component Verse con override

```verse
OnSimulate<override>()<suspends>:void=
    ParticleSystemEntities := Entity.FindDescendantEntitiesWithComponent(particle_system_component)
```

Fuente: [Creating Your Own Component using Verse](https://dev.epicgames.com/documentation/fortnite/creating-your-own-component-using-verse-in-unreal-editor-for-fortnite).

### 17. `spawn` y handle de tarea

```verse
BackgroundTask:task(int) = spawn{LongRunningTask()}
```

Fuente: [Book of Verse — Concurrency](https://verselang.github.io/book/14_concurrency/).

### 18. Propiedad editable en component Scene Graph

```verse
@editable_vector_number(int):
    ToolTip := GridSizeTip
    MinComponentValue := option{0}
GridSize:vector2i = vector2i{X := 3, Y := 10}
```

Fuente: [Spawning a Grid of Platforms with Scene Graph](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite).

### 19. Añadir una entidad prefab a la escena

```verse
ChooseOnePlatform := choose_one_platform_prefab{}
Entity.AddEntities(array{ChooseOnePlatform})
```

Fuente: [Spawning a Grid of Platforms with Scene Graph](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite).

## 6. Tabla: qué existe / qué no existe (o no se ha confirmado)

| Capacidad | Estado | Evidencia / matiz |
|---|---|---|
| Verse usable para gameplay UEFN | **Existe, documentado y soportado** | Guías oficiales de crear, compilar y probar Verse device/component. |
| Verse Language Version 1 | **Existe; estabilizado en UEFN desde 32.00** | Hay guía oficial de upgrades/deprecations. No implica API congelada. |
| VS Code para editar | **Existe** | Flujo oficial con extensión Verse distribuida con UEFN. |
| Compilación de código Verse desde UEFN | **Existe** | `Build Verse Code`, errores de compilación y push a sesión. |
| Scene Graph entity/component/prefab API en UEFN | **Existe, pero Beta según docs consultadas** | No presentar como API estable para shipping sin advertencia. |
| Verse API de Fortnite/UEFN | **Existe y versiona** | API Reference generada declara API version 43.10; módulos varían por versión. |
| Book of Verse oficial enlazado por Epic | **Existe** | Repositorio público `verselang/book`; su cabeza puede incluir features no lanzadas. |
| UE 5.8 documentación relacionada con Verse | **Existe como referencias C++ de VerseCompiler** | No equivale a herramientas públicas de autoría/ejecución Verse en UE 5.8. **[NO VERIFICADO]** No se localizó una guía de autoría Verse/Scene Graph pública de UE 5.8. |
| UE6 Scene Graph y gameplay sobre Verse | **Anunciado** | Roadmap; lanzamiento aún futuro a fecha de consulta. |
| Compilador Verse standalone oficialmente soportado | **[NO VERIFICADO] No localizado** | Las guías consultadas prescriben UEFN; módulos C++ VerseCompiler no acreditan CLI utilizable. |
| Playground público general de Verse | **[NO VERIFICADO] No localizado** | No se encontró enlace oficial equivalente a un playground ejecutable. |
| Ejecutar código Verse fuera de Unreal/UEFN | **[NO VERIFICADO] No documentado** | No afirmar que sea imposible internamente; no hay target externo público documentado aquí. |
| Uso general público de la implementación Verse del stream UE6 | **No recomendado por Epic por ahora** | La página de roadmap advierte que no está destinada a adopción general. |
| Blueprint eliminado ya de UE5 o de Fortnite | **No** | Roadmap a futuro no debe interpretarse como estado actual de UEFN/UE5. |
| Todas las funciones del Book de Verse disponibles en UEFN | **No** | Epic y el Book advierten que la rama principal puede adelantarse a features liberadas. |

## 7. Incertidumbres y verificaciones pendientes

1. **UE6 y roadmap:** la fecha de Early Access de finales de 2027 es una previsión publicada por Epic, no disponibilidad actual ni garantía de fecha.
2. **Versión puntual de UEFN:** la página Verse API indicaba `43.10`; las release notes oficiales recuperadas fueron 43.00, con fecha 2026-11-01. Conviene confirmar la release instalada y sus release notes exactas antes de cada implementación.
3. **Standalone/playground:** no hallé documentación oficial de una descarga/CLI pública o playground. Esta conclusión es “no documentado en las fuentes consultadas”, no una demostración absoluta de inexistencia.
4. **UE 5.8:** existe la API C++ `VerseCompiler` en la referencia de UE 5.8, pero **[NO VERIFICADO]** no se confirmó un flujo público para autoría o ejecución de gameplay Verse en proyectos UE5.8 estándar.
5. **Scene Graph:** está marcado Beta. La ubicación de módulos e imports ha evolucionado (por ejemplo, rutas `/Verse.org/...` y `/UnrealEngine.com/Temporary/...` en diferentes referencias/tutoriales); usar el digest y ejemplos del UEFN de destino.
6. **Ejecución cliente/servidor:** release notes 43.00 mencionan que Verse no se ejecuta en cliente para el caso de custom camera modifiers y replicación desde servidor. No generalizar esto a cada API sin consultar su documentación/version.
7. **Book of Verse:** Epic lo recomienda como deep dive, pero el propio texto advierte que sigue el head de la rama de desarrollo y que puede contener features no lanzadas o internas. Validar todo API/especificador avanzado con la Verse Language Reference/Quick Reference de UEFN.
8. **Rutas requeridas:** las URLs `.../en-us/uefn/verse-language-reference` y `.../verse-language-quick-reference` devolvieron sólo encabezados/TOC al lector usado en esta investigación. Se contrastó con resultados indexados de Epic, otras páginas oficiales de lenguaje y Book of Verse; para una actualización futura conviene abrirlas manualmente en navegador.
9. **Efectos y atributos avanzados:** **[NO VERIFICADO]** la disponibilidad UEFN de cada capacidad más nueva que aparece en el Book (p. ej. algunas variantes de efectos, atributos o constructos concurrentes) debe comprobarse en el compilador UEFN. No usar ejemplos del Book como prueba suficiente de soporte en la release instalada.
10. **API `Temporary`:** el propio nombre indica provisionalidad en módulos tales como `UnrealEngine.com/Temporary`; no asumir compatibilidad hacia delante.

## Bibliografía (consulta: 2026-11-19)

### Documentación oficial indicada y referencias principales

- [Verse Language Reference — UEFN](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference)
- [Verse Language Quick Reference — UEFN](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-quick-reference)
- [Verse Language Get Started — Fortnite](https://dev.epicgames.com/documentation/en-us/fortnite/verse-language-get-started-in-unreal-editor-for-fortnite)
- [Verse Language Reference: Book of Verse — Epic](https://dev.epicgames.com/documentation/fortnite/verse-language-book-of-verse-reference)
- [Book of Verse — web reference](https://verselang.github.io/book/)
- [Book of Verse — source repository](https://github.com/verselang/book)
- [Verse API Reference](https://dev.epicgames.com/documentation/en-us/uefn/verse-api)
- [The road to Unreal Engine 6 — Epic Games](https://www.unrealengine.com/news/the-road-to-ue-6)

### Referencias Epic adicionales consultadas

- [Verse Language Version 1 Updates and Deprecations](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-version-updates-and-deprecations-in-verse)
- [Modify and Run Your First Verse Program](https://dev.epicgames.com/documentation/en-us/fortnite/modify-and-run-your-first-verse-program-in-unreal-editor-for-fortnite)
- [Specifiers and Attributes in Verse](https://dev.epicgames.com/documentation/en-us/uefn/specifiers-and-attributes-in-verse)
- [Scene Graph in UEFN](https://dev.epicgames.com/documentation/en-us/uefn/scene-graph-in-unreal-editor-for-fortnite)
- [Creating Your Own Component using Verse](https://dev.epicgames.com/documentation/fortnite/creating-your-own-component-using-verse-in-unreal-editor-for-fortnite)
- [Spawning a Grid of Platforms with Scene Graph](https://dev.epicgames.com/documentation/en-us/uefn/spawning-a-grid-of-platforms-with-scene-graph-in-unreal-editor-for-fortnite)
- [Concurrency Overview in Verse](https://dev.epicgames.com/documentation/en-us/uefn/concurrency-overview-in-verse)
- [43.00 Fortnite Ecosystem Updates and Release Notes](https://dev.epicgames.com/documentation/fortnite/43-00-fortnite-ecosystem-updates-and-release-notes)
- [Verse API SceneGraph module](https://dev.epicgames.com/documentation/en-us/uefn/verse-api/unrealenginedotcom/temporary/scenegraph)
- [UE 5.8 VerseCompiler API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/VerseCompiler)
- [UE 5.8 VerseCompiler Package API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/VerseCompiler/Package)

### Secciones del Book of Verse usadas para los ejemplos y conceptos

- [Primitive Types](https://verselang.github.io/book/02_primitives/)
- [Container Types](https://verselang.github.io/book/03_containers/)
- [Mutability](https://verselang.github.io/book/05_mutability/)
- [Functions](https://verselang.github.io/book/06_functions/)
- [Control Flow](https://verselang.github.io/book/07_control/)
- [Failure](https://verselang.github.io/book/08_failure/)
- [Structs & Enums](https://verselang.github.io/book/09_structs_enums/)
- [Classes & Interfaces](https://verselang.github.io/book/10_classes_interfaces/)
- [Effects](https://verselang.github.io/book/13_effects/)
- [Concurrency](https://verselang.github.io/book/14_concurrency/)
- [Modules and Paths](https://verselang.github.io/book/16_modules/)
