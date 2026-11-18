# 02 — Inventario Conceptual y Técnico de Blueprints Visual Scripting (Unreal Engine 5.8)

> **Proyecto:** `bp2verse`  
> **Fecha de consulta y redacción:** 2026-11-19  
> **Versión de referencia:** Unreal Engine 5.8 (Documentación Oficial de Epic Games)  
> **Propósito:** Mapear con exactitud el modelo mental, vocabulario oficial, arquitectura de nodos, flujo de ejecución, patrones de diseño cotidianos y límites técnicos de un desarrollador de **Blueprints** para fundamentar su traducción pedagógica a **Verse** (UE6 / UEFN).

---

## 1. Resumen Ejecutivo

El sistema **Blueprint Visual Scripting** (coloquialmente **Blueprints**) en Unreal Engine 5.8 es un sistema completo de scripting visual basado en grafos de nodos e hilos (**Wires**) para crear clases orientadas a objetos (**OO**) y mecánicas de juego desde el **Unreal Editor** sin escribir código C++.

Desde el punto de vista arquitectónico y mental, un desarrollador de Blueprints piensa en torno a cinco pilares que deben ser reencuadrados al aprender **Verse**:

1. **Separación entre Flujo de Ejecución y Flujo de Datos:** La lógica avanza de izquierda a derecha a través de **Execution Pins** blancos (triángulos) conectados por hilos de ejecución. Los datos viajan por **Data Pins** coloreados según su tipo. Los nodos con pines de ejecución (**Impure Nodes**) se ejecutan cuando reciben un pulso y cachean sus salidas; los nodos sin pines de ejecución (**Pure Nodes**) se evalúan hacia atrás (*pull evaluation*, de derecha a izquierda) una vez por cada nodo impuro que consuma su salida.
2. **Arquitectura Orientada a Objetos y Composición de Actores:** Un **Blueprint Class** compila en una clase real del motor (`UBlueprintGeneratedClass`, equivalente a un `UClass` en C++). Cuando hereda de `Actor`, combina una jerarquía de **Components** (`SceneComponent`, `StaticMeshComponent`, `BoxComponent`, `MovementComponent`, etc.), propiedades con valores por defecto (**Class Defaults** / **CDO**), un grafo de inicialización en tiempo de diseño/instanciación (**Construction Script**) y uno o varios grafos reactivos en tiempo de juego (**EventGraph**).
3. **Programación Guiada por Eventos y Acciones Latentes:** Todo comportamiento en el **EventGraph** nace en un nodo **Event** (sin pin de ejecución de entrada), un **Custom Event** o un evento de **Enhanced Input**. A diferencia de las **Functions** (que se ejecutan en un único frame con un solo punto de entrada y salida), el **EventGraph** y las **Macros** admiten **Latent Actions** (`Delay`, `Timeline`, `Move Component To`, `Async Load Asset`, `Async Save Game to Slot`) que suspenden y reanudan el flujo de ejecución a través de múltiples frames.
4. **Cuatro Paradigmas de Comunicación entre Blueprints:** El desarrollador domina cuatro mecanismos oficiales según el acoplamiento: **Direct Blueprint Communication** (1 a 1 mediante una variable de referencia `Object Reference`), **Blueprint Casting** (`Cast To <Class>` para verificar subclase y acceder a miembros específicos, cargando la clase destino en memoria), **Blueprint Interfaces** (llamadas polimórficas mediante **Interface Message Nodes** sin acoplamiento de tipos) y **Event Dispatchers** (delegados multicast 1 a N con operaciones `Call`, `Bind`, `Unbind` y `Assign`).
5. **Compilación a Bytecode de Máquina Virtual y Frontera con C++:** Durante la compilación (`FKismetCompilerContext`), todos los **EventGraphs** se fusionan en un único **Ubergraph**, las **Macros** se expanden *in-line* y los grafos se traducen a **Bytecode** ejecutado en la máquina virtual de Blueprints en el hilo principal (**Game Thread**). Por esta sobrecarga por nodo, la ausencia de multihilo en el EventGraph y el formato binario `.uasset`, los sistemas de alta frecuencia (`Event Tick` masivo, bucles intensivos, algoritmos complejos o acceso a APIs nativas de bajo nivel) requieren pasar a C++.

---

## 2. Glosario Oficial (Término EN → Definición Oficial → Equivalente en Español)

| Término Oficial (EN) | Definición Oficial (Epic Games UE 5.8) | Equivalente / Traducción en Español |
| :--- | :--- | :--- |
| **Blueprint Visual Scripting** | Complete gameplay scripting system based on a node-based interface to define object-oriented classes or objects from within Unreal Editor. | Sistema de scripting visual Blueprint |
| **Blueprint Class** | An asset that defines a new class or type of Object/Actor (`UBlueprintGeneratedClass`) with components, variables, and graphs, which can be placed or spawned as instances. | Clase Blueprint |
| **Data-Only Blueprint** | A Blueprint Class that contains only the code, variables, and components inherited from its parent, allowing designers to tweak default properties in a compact editor without adding new logic. | Blueprint de solo datos (Arquetipo) |
| **Level Blueprint** | A specialized Blueprint that acts as a level-wide global event graph attached to a specific map, used for level streaming, Sequencer cinematics, and events bound to specific Actor instances in that level. | Blueprint de nivel |
| **Blueprint Interface (BPI)** | A collection of one or more function declarations (name and signature only, no implementation, no variables, no components) that can be added to other Blueprints as a common contract. | Interfaz de Blueprint |
| **Blueprint Macro Library** | A container asset that holds a collection of self-contained Macros that can be placed as nodes in other Blueprints without needing independent compilation. | Librería de macros de Blueprint |
| **Blueprint Function Library** | A collection of static functions that provide utility functionality not tied to a particular instance, accessible from any Blueprint in the project. | Librería de funciones de Blueprint |
| **Animation Blueprint (AnimBP)** | A specialized Blueprint that controls the animation of a Skeletal Mesh by combining an `EventGraph` (data updates) and an `AnimGraph` (frame-by-frame pose evaluation). | Blueprint de animación |
| **Widget Blueprint (UMG)** | A Blueprint extending `UUserWidget` in Unreal Motion Graphics (UMG) that combines a `Designer` tab for visual UI layout and a `Graph` tab for UI logic. | Blueprint de widget / Interfaz UMG |
| **Editor Utility Blueprint / Widget** | An editor-only Blueprint (`EditorUtilityActor`, `EditorUtilityWidget`) used to automate editor actions, manipulate assets in the Content Browser, or extend the Unreal Editor UI. | Blueprint de utilidad del editor |
| **Node** | A visual block in a graph representing an object or operation such as an event, function call, flow control operation, macro, or variable access. | Nodo |
| **Pin** | A connection point on the left (Input Pin) or right (Output Pin) of a node, divided into Execution Pins and Data Pins. | Pin / Conector |
| **Execution Pin (Exec Pin)** | A white triangle pin used to connect nodes together to define the order and flow of execution. Displayed as an outline when unwired and solid when wired. | Pin de ejecución |
| **Data Pin** | A color-coded pin used for taking typed data into a node or outputting typed data from a node. | Pin de datos |
| **Pose Pin** | A specialized pin in the `AnimGraph` (represented by a human figure icon) through which skeletal animation poses flow and are evaluated every frame. | Pin de pose |
| **Delegate Pin** | A red square pin used to connect an Event or Custom Event as a callback reference to nodes such as `Set Timer by Event` or `Bind Event to...`. | Pin de delegado |
| **Wire** | A visual line connecting two compatible pins (an execution wire in white or a data wire colored by variable type). | Cable / Hilo de conexión |
| **Reroute Node** | A helper node created by double-clicking a wire to organize and redirect connections cleanly across a graph. | Nodo de reencaminamiento |
| **Pure Node / Pure Function** | A node without execution pins (`BlueprintPure`) that promises not to modify state and is automatically re-evaluated by tracing data wires backwards each time a connected impure node executes. | Nodo puro / Función pura |
| **Impure Node** | A node with execution pins (`BlueprintCallable`) that performs actions, can modify state, and caches the values of its output data pins when executed. | Nodo impuro |
| **EventGraph** | A node graph that uses events and function calls to perform actions in response to gameplay events. All EventGraphs in a Blueprint compile into a single `Ubergraph`. | Grafo de eventos |
| **Construction Script** | A graph in a Blueprint Class (`UserConstructionScript`) that runs after the Components list when an Actor instance is created or updated in the editor/world to perform initialization operations. | Script de construcción |
| **Simple Construction Script (SCS)** | The internal graph (`USimpleConstructionScript`) representing the hierarchy of Component templates instanced automatically when a Blueprint Actor is created. | Script de construcción simple |
| **Function** | A node graph belonging to a Blueprint with a single entry point and single execution exit call that executes synchronously and can be called from other Blueprints or overridden in child classes. | Función |
| **Macro** | A collapsed network of nodes designated by entry and exit tunnel nodes that can have multiple execution pins and latent nodes, auto-expanded (copy-pasted) into the calling graph at compile time. | Macro |
| **Collapsed Graph** | A sub-graph created purely for visual organization within a graph, delimited by `Inputs` and `Outputs` tunnel nodes. | Grafo colapsado |
| **Event** | An entry-point node with only an output execution pin (and optional output data pins) triggered by gameplay code when something happens in the engine. | Evento |
| **Custom Event** | A user-defined event node created in an EventGraph that can be called from anywhere in the Blueprint (or externally) and supports latent nodes and replication settings. | Evento personalizado |
| **Event Dispatcher** | A Blueprint multicast delegate property that enables one Actor to broadcast an event (`Call`) to multiple listening Blueprints that have subscribed (`Bind` / `Assign`) to it. | Despachador de eventos (Delegado) |
| **Cast / Casting** | An operation (`Cast To <Class>`) that takes an Object/Actor reference and checks at runtime if it is of a specific subclass, outputting the typed reference on success or firing `Cast Failed`. | Conversión de tipo / Moldeo (Cast) |
| **Auto-Casting (Conversion Node)** | Automatic creation of a pure conversion node when dragging a wire between two different but compatible data pins (e.g., `Float` to `String`). | Conversión automática |
| **Promote to Variable** | Context action on any input or output data pin that automatically creates a properly typed class/local variable and wires a `Get` or `Set` node to that pin. | Promover a variable |
| **Instance Editable (Public)** | Variable property (open eye icon) that exposes the variable in the Level Editor's `Details` panel so designers can override its value per placed Actor instance. | Editable por instancia (Pública) |
| **Expose on Spawn** | Variable property that adds an input data pin for that variable directly onto the `Spawn Actor from Class` node, triggering a `Deferred Spawn` before the Construction Script runs. | Exponer al generar (al hacer spawn) |
| **Latent Action / Latent Node** | An asynchronous node (marked with a clock icon, e.g., `Delay`, `Timeline`) that can only be placed in an EventGraph or Macro and pauses/resumes execution across multiple frames. | Acción latente / Nodo latente |
| **Timeline** | A time-based interpolation component (`UTimelineComponent`) and node with internal tracks (Float, Vector, Linear Color, Event) that outputs updated values on its `Update` pin over time and fires `Finished` upon completion. | Línea de tiempo (Timeline) |
| **Class Default Object (CDO)** | The master template instance of a compiled Unreal/Blueprint class that holds the default values defined in `Class Defaults`. | Objeto por defecto de la clase (CDO) |
| **Blackboard** | An AI data asset that acts as the memory ("brain") of an AI agent, storing key-value pairs (`Blackboard Keys`) used by a Behavior Tree to make decisions. | Pizarra (Blackboard) |
| **Behavior Tree** | A visual hierarchical graph asset used to control AI decision-making via `Composite`, `Decorator`, `Service`, and `Task` nodes executing from left to right and top to bottom. | Árbol de comportamiento |
| **Material Instance Dynamic (MID)** | An instanced Material created at runtime (`Create Dynamic Material Instance`) whose scalar, vector, and texture parameters can be modified during gameplay via Blueprints. | Instancia de material dinámica |
| **Material Parameter Collection (MPC)** | A global asset storing up to 1,024 scalar and 1,024 vector parameters that can be modified from Blueprints and propagate simultaneously to all Materials referencing it. | Colección de parámetros de material |

---

## 3. Modelo Mental de Blueprints (UE 5.8)

### 3.1. Del Activo Visual a la Clase Compilada (`UBlueprint` → `UBlueprintGeneratedClass`)
Cuando un desarrollador crea un **Blueprint Class** en el **Content Browser**, está creando una clase real dentro del sistema de reflexión de Unreal Engine. La equivalencia oficial documentada por Epic Games entre C++ y Blueprints es directa:

| Concepto Orientado a Objetos | En C++ (UE 5.8) | En Blueprints (UE 5.8) |
| :--- | :--- | :--- |
| Definición de archivo | Archivos `.h` / `.cpp` | Activo `.uasset` (**Blueprint Asset**) |
| Tipo de Clase en Reflexión | `UClass` | `UBlueprintGeneratedClass` |
| Herencia | `: public AParentClass` | **Parent Class** (configurable en **Class Settings → Reparent Blueprint**) |
| Propiedades miembro | `UPROPERTY()` | **Variables** en el panel **My Blueprint** |
| Métodos miembro | `UFUNCTION()` | **Function Graphs** y **Events** en el **EventGraph** |
| Valores por defecto | Constructor nativo de C++ | Panel **Class Defaults** (almacenados en el **CDO**) |
| Subobjetos / Composición | `CreateDefaultSubobject<T>()` | Jerarquía de **Components** en la ventana **Components** (`USimpleConstructionScript`) |

El proceso de compilación (**Compile** en la barra de herramientas, ejecutado por `FKismetCompilerContext`) sigue 9 pasos exactos:
1. **Clean the Class:** Limpia la instancia `UBlueprintGeneratedClass` en el sitio (*in-place*) moviendo propiedades y funciones antiguas a una clase temporal para no invalidar punteros.
2. **Create Class Properties:** Itera sobre las variables del Blueprint y del Construction Script para crear los `FProperty`/`UProperty` en el ámbito de la clase.
3. **Create Function List:** Procesa todos los **EventGraphs** fusionándolos mediante `CreateAndProcessUberGraph()` en un único grafo maestro (**Ubergraph**), expande las **Macros** y nodos compuestos, y precompila las **Functions** regulares (`ProcessOneFunctionGraph()`).
4. **Bind and Link the Class:** Vincula referencias y propiedades de la clase.
5. **Compile Functions:** Traduce los nodos a sentencias intermedias (`FKismetCompiledStatement`) y términos de datos (`FKismetTerm`).
6. **Finish Compiling Class:** Finaliza las banderas de clase y metadatos.
7. **Backend Emits Generated Code:** El backend emite el **Bytecode** de la máquina virtual de Blueprints para cada función y para el Ubergraph.
8. **Copy Class Default Object Properties:** Copia los valores por defecto del antiguo **CDO** al nuevo **CDO**.
9. **Reinstance:** Reinstancia todos los objetos de esa clase que ya estén vivos en el nivel o editor para que reflejen la nueva definición inmediatamente.

### 3.2. Jerarquía del Gameplay Framework: `Object`, `Actor`, `Pawn`, `Character` y `Component`
El desarrollador de Blueprints elige siempre una **Parent Class** al crear un Blueprint Class:
* **`Object` (`UObject`):** Clase base de todos los objetos gestionados por el motor y su recolector de basura (**Garbage Collection**). No tiene transformación 3D, no puede colocarse en un nivel ni tener componentes visuales. Ejemplos: `SaveGame`, `UserWidget`.
* **`Actor` (`AActor`):** Cualquier objeto que puede colocarse o generarse (**Spawn**) en un nivel. Soporta transformación 3D (traslación, rotación y escala) y replicación de red. **Regla crucial del modelo mental:** Un `Actor` no almacena directamente su `Transform`; utiliza la transformación de su **Root Component** (`USceneComponent`). Si no tiene uno, el editor asigna un `DefaultSceneRoot`.
* **`Pawn` (`APawn`):** Subclase de `Actor` que puede ser poseída (**Possess**) y controlada por un `Controller` (`PlayerController` o `AIController`) y recibir entrada del jugador.
* **`Character` (`ACharacter`):** Subclase especializada de `Pawn` para personajes bípedos o humanoides que incluye de serie un `CapsuleComponent` (raíz de colisión), un `SkeletalMeshComponent` (malla animada), un `ArrowComponent` y un `CharacterMovementComponent` (locomoción con gravedad, salto, vuelo, natación y replicación).
* **`Component` (`UActorComponent` / `USceneComponent`):** Pieza modular de funcionalidad que **no puede existir por sí sola en el nivel**, sino que debe adjuntarse a un `Actor`. Se divide en:
  * `ActorComponent`: Funcionalidad pura sin posición 3D (p. ej., `CharacterMovementComponent`, `RotatingMovementComponent`, o un componente de salud/inventario personalizado).
  * `SceneComponent`: Tiene un `Transform` 3D relativo y permite anidamiento jerárquico padre-hijo.
  * `PrimitiveComponent`: Subclase de `SceneComponent` que además tiene representación geométrica renderizable y/o colisión física (p. ej., `StaticMeshComponent`, `SkeletalMeshComponent`, `BoxComponent`, `SphereComponent`, `CapsuleComponent`, `NiagaraComponent`).

### 3.3. La Interfaz del Blueprint Editor
Cuando un desarrollador abre un Blueprint Class completo, trabaja con cinco paneles fundamentales:
1. **Viewport:** Vista 3D para posicionar, rotar y escalar visualmente la jerarquía de **Components** del Actor.
2. **Components Panel:** Árbol jerárquico de componentes. Los componentes heredados de la clase padre aparecen con icono azul oscuro; los añadidos en este Blueprint aparecen en azul claro. Todos aparecen automáticamente como variables de referencia en el panel **My Blueprint**.
3. **My Blueprint Panel:** El índice declarativo de la clase. Contiene las secciones **Graphs** (`ConstructionScript`, `EventGraph`), **Functions**, **Macros**, **Variables** (y **Local Variables** cuando se está dentro de una función) y **Event Dispatchers**.
4. **Graph Editor:** El lienzo central con pestañas y migas de pan (**Breadcrumbs**) donde se colocan y cablean los nodos (`Right-Click + Drag` para desplazar, rueda para zoom, `Right-Click` para abrir el menú contextual sensible al contexto, `F` para encuadrar selección, `Alt + Click` para romper un cable, doble clic en un cable para crear un **Reroute Node**).
5. **Details Panel & Class Defaults / Class Settings:** Muestra las propiedades del nodo, variable o componente seleccionado. Al pulsar **Class Defaults** en la barra superior, edita los valores iniciales del Blueprint; al pulsar **Class Settings**, configura la **Parent Class**, las **Blueprint Interfaces** implementadas y las opciones de tick/actor.

### 3.4. Modelo de Ejecución: Execution Flow vs. Data Flow, Impure vs. Pure Nodes
Este es uno de los puntos donde más errores cometen los desarrolladores al pasar de Blueprints a un lenguaje textual como Verse:

* **Flujo Impulso-Ejecución (Izquierda a Derecha):** La ejecución siempre empieza en un nodo **Event** (color rojo) y viaja de izquierda a derecha a través de los **Execution Pins** blancos. Un nodo con pines de ejecución (**Impure Node**, habitualmente con cabecera azul para funciones `BlueprintCallable` o gris para control de flujo) **solo se ejecuta si un hilo de ejecución llega a su pin de entrada**. Si sus pines de datos están conectados pero su pin de ejecución está desconectado, el nodo jamás se ejecuta.
* **Evaluación de Datos por Demanda (Derecha a Izquierda):** Cuando un **Impure Node** va a ejecutarse, el motor necesita resolver el valor de todos sus **Input Data Pins**. Para ello, rastrea los cables de datos hacia atrás (de derecha a izquierda).
* **Diferencia Crítica de Caché entre Impure y Pure Nodes:**
  * **Impure Nodes (con pines de ejecución):** Cuando se ejecutan, **almacenan (cachean) el valor calculado en sus Output Data Pins**. Cualquier nodo posterior en la cadena de ejecución que lea de esos pines de salida leerá el mismo valor almacenado en ese momento.
  * **Pure Nodes (sin pines de ejecución, cabecera verde o nodo compacto):** No tienen estado de ejecución ni almacenan sus salidas. **Se reevalúan desde cero cada vez que un nodo impuro conectado a su salida se ejecuta**. Si un nodo puro (`Random Integer in Range` o un cálculo costoso) está conectado a 3 nodos impuros distintos en una secuencia, el nodo puro se ejecutará **3 veces** (produciendo 3 números aleatorios distintos o triplicando el coste de CPU).

### 3.5. Tipos de Blueprints y Cuándo se Usa Cada Uno

| Tipo de Blueprint | Rol y Ámbito | Diferencias Clave en el Modelo Mental |
| :--- | :--- | :--- |
| **Blueprint Class** | Define clases reutilizables (`Actor`, `Pawn`, `Character`, `ActorComponent`, `Object`). | Tiene **Components**, **Construction Script**, **EventGraph**, **Functions**, **Macros**, **Variables** y **Event Dispatchers**. Se puede instanciar infinitas veces en cualquier nivel. |
| **Data-Only Blueprint** | Subclase de un Blueprint Class que solo modifica propiedades heredadas. | Se abre en un editor compacto de propiedades (reemplazo moderno de *Archetypes*). Si se le añade un nodo o variable, se convierte en un Blueprint Class completo. |
| **Level Blueprint** | Grafo global único asociado a un archivo de nivel (`.umap`). | **No tiene Construction Script ni Components**. Permite referenciar directamente instancias concretas de Actores seleccionados en el **Level Viewport**. Ideal para eventos exclusivos de ese mapa, *Level Streaming* o cinemáticas de **Sequencer**, pero no es reutilizable entre niveles. |
| **Blueprint Interface (BPI)** | Contrato de firmas de funciones sin estado ni implementación. | **No puede contener Variables, ni Components, ni lógica en grafos**. Solo define nombres de funciones con sus pines de entrada y salida. |
| **Blueprint Macro Library** | Contenedor global de Macros compartidas para una clase base dada. | No requiere compilación propia porque sus macros se expanden *in-line* dentro de los Blueprints que las usan cuando estos se compilan. |
| **Blueprint Function Library** | Contenedor global de funciones estáticas de utilidad. | Sus funciones aparecen en el menú contextual de cualquier Blueprint del proyecto sin necesidad de tener una referencia a un objeto (`Target`). |
| **Animation Blueprint (AnimBP)** | Controlador visual de esqueletos (`SkeletalMesh`). | Tiene dos grafos acoplados: el **EventGraph** (lee velocidad, estado de caída o variables del `Pawn` propietario) y el **AnimGraph** (evalúa cada frame el árbol de **Pose Pins**, **State Machines** de animación y **Blend Spaces**). Epic recomienda en UE 5.8 minimizar el uso del EventGraph del AnimBP (que corre en el *Game Thread*) y usar **Property Access** y funciones *thread-safe* para aprovechar el multihilo en el AnimGraph. |
| **Widget Blueprint (UMG)** | Definición de pantallas y elementos de interfaz de usuario (`UUserWidget`). | Tiene dos modos en la esquina superior derecha: **Designer** (jerarquía visual de paneles, textos, barras y animaciones de UI) y **Graph** (EventGraph, funciones y bindings de propiedades de la interfaz). |

---

## 4. Inventario de Conceptos con Definición Oficial por Categorías

### Categoría A: Variables, Tipos de Pin y Contenedores de Datos

#### 1. Variables (`Blueprint Variables`)
* **Definición Oficial:** Propiedades que almacenan un valor o referencian un `Object`, `Actor` o `Class` en el mundo. Pueden ser internas al Blueprint o expuestas externamente para ser modificadas por instancia en el nivel.
* **Ámbitos (`Class Variables` vs. `Local Variables`):**
  * **Class Variables:** Declaradas a nivel de Blueprint; persisten durante toda la vida de la instancia y son accesibles desde cualquier grafo del Blueprint (y desde fuera si son públicas).
  * **Local Variables:** Declaradas exclusivamente dentro de una **Function**. Solo existen mientras la función se está ejecutando (actúan como bloc de notas temporal o *scratch pad*) y se destruyen al terminar la función.
* **Nodos de Acceso:**
  * **Get Node (Getter):** Nodo puro que entrega el valor actual de la variable (`Ctrl + Drag` desde *My Blueprint*).
  * **Set Node (Setter):** Nodo impuro (requiere pin de ejecución) que modifica el valor de la variable y además expone un pin de salida con el nuevo valor para encadenar lecturas (`Alt + Drag` desde *My Blueprint*).
* **Propiedades Clave de una Variable en el Panel Details:**
  * **Instance Editable (Public / Eye Icon):** Si el ojo está abierto, la variable se expone en el panel **Details** del Level Editor para cada instancia colocada en el mapa. Si además tiene un **Tooltip**, el ojo pasa de amarillo a verde.
  * **Private:** Impide que la variable sea leída o modificada desde otros Blueprints externos o desde clases hijas derivadas.
  * **Expose on Spawn:** Añade la variable como un pin de entrada directo en el nodo `Spawn Actor from Class` cuando se instancia esta clase.
  * **Expose to Cinematics:** Permite que pistas de **Sequencer** animen el valor de la variable en tiempo real.
  * **Replication:** Configura la sincronización por red (`None`, `Replicated`, `RepNotify`). Si se elige `RepNotify`, Unreal crea automáticamente una función `OnRep_<VariableName>` que se ejecuta automáticamente tanto en servidor como en clientes cada vez que el valor replicado cambia.
  * **SaveGame:** Marca la propiedad para ser serializada en sistemas de guardado basados en archivo.
  * **Config Variable / Transient / Deprecated:** Lee el valor inicial de archivos `.ini`, evita su serialización en disco o emite advertencias de compilación si se usa.

#### 2. Tabla Oficial de Tipos de Pin (`Data Pin Types`) y Código de Colores
En Blueprints, cada tipo de dato se identifica visualmente por el color de su pin y de su cable:

| Tipo de Pin / Variable (`EN`) | Color Oficial (Documentación Epic) | Tipo Subyacente C++ | Representación y Uso en Blueprints |
| :--- | :--- | :--- | :--- |
| **Execution (`exec`)** | Blanco (*White triangle*) | Flujo de bytecode | Controla el orden de ejecución entre nodos impuros. |
| **Boolean** | Granate / Rojo oscuro (*Maroon*) | `bool` | Valor lógico `true` o `false`. |
| **Byte** | Azul petróleo (*Sherpa blue*) | `uint8` (`unsigned char`) | Número entero sin signo entre `0` y `255`, o valores de un `Enum`. |
| **Integer** | Verde mar / Cian (*Sea green*) | `int32` (`int`) | Número entero con signo de 32 bits (`-2,147,483,648` a `2,147,483,647`). |
| **Integer64** | Verde musgo (*Moss green*) | `int64` (`long`) | Número entero con signo de 64 bits. |
| **Float** | Verde amarillento (*Yellow green*) | `double` / `float` | Número en coma flotante con decimales (en UE5 los floats de Blueprint operan internamente con precisión `double` de 64 bits, aunque el pin mantiene el nombre **Float**). |
| **Name** | Malva / Violeta claro (*Mauve*) | `FName` | Identificador de texto ligero e inmutable (insensible a mayúsculas/minúsculas, indexado en tabla hash) usado para nombres de huesos, sockets, tags y parámetros. |
| **String** | Magenta (*Magenta*) | `FString` | Cadena de caracteres alfanuméricos mutable y manipulable (`Append`, `Parse`, `Print String`). |
| **Text** | Rosa (*Pink*) | `FText` | Texto destinado a mostrarse al usuario en la interfaz (UMG); soporta localización y tablas de traducción. |
| **Vector** | Dorado / Amarillo (*Gold*) | `FVector` | Estructura de 3 números (`X`, `Y`, `Z`) para coordenadas 3D, direcciones o datos RGB. |
| **Rotator** | Azul aciano / Lila (*Cornflower blue*) | `FRotator` | Rotación en espacio 3D definida por tres ángulos de Euler en grados: `Roll (X)`, `Pitch (Y)`, `Yaw (Z)`. |
| **Transform** | Naranja (*Orange*) | `FTransform` | Estructura anidada que combina `Location` (`Vector`), `Rotation` (`Rotator`) y `Scale` (`Vector`). |
| **Struct** | Azul oscuro (*Dark blue*) | `USTRUCT()` | Colección de datos relacionados agrupados (p. ej., `HitResult`, `LinearColor` o structs de usuario). |
| **Object Reference** | Azul (*Blue*) | `UObject*` / `TObjectPtr<T>` | Referencia directa en memoria a una instancia viva de un `Actor`, `Component` u `Object`. |
| **Class Reference** | Púrpura (*Purple*) | `UClass*` / `TSubclassOf<T>` | Referencia a una clase o activo Blueprint (no a una instancia viva), usada para hacer `Spawn Actor from Class` o `Create Widget`. |
| **Soft Object Reference** | Cian claro (*Light Cyan*) | `TSoftObjectPtr<T>` | Ruta simbólica a un activo en disco que no está cargado en memoria hasta que se solicita con `Async Load Asset`. |
| **Soft Class Reference** | Rojo rosado / Coral (*Light Red*) | `TSoftClassPtr<T>` | Ruta simbólica a una clase Blueprint en disco que permite cargarla de forma asíncrona sin crear referencias duras en memoria. |
| **Interface** | Amarillo pálido (*Pale Yellow*) | `TScriptInterface<T>` | Referencia a cualquier objeto que implemente una `Blueprint Interface` específica. |
| **Delegate** | Rojo intenso (*Red Square*) | `FScriptDelegate` | Pin cuadrado que transporta la firma de un `Event` o `Custom Event` para vincularlo a un Timer o Event Dispatcher. |

#### 3. Contenedores de Datos (`Containers`) y Estructuras (`Structs`)
El icono situado junto al tipo de variable en el panel **Details** permite elegir entre cuatro formas de almacenamiento:
1. **Single Variable (Icono de píldora):** Almacena un único valor del tipo seleccionado.
2. **Array (Icono de cuadrícula 3x3):** Colección indexada (basada en 0) de elementos del mismo tipo. Nodos clave: `Add`, `Add Unique`, `Insert`, `Remove Index`, `Remove Item`, `Get (a copy / a ref)`, `Set Array Elem`, `Find`, `Contains`, `Length`, `Last Index`, `Clear`, y los macros de iteración `For Each Loop` y `For Each Loop with Break`.
3. **Set (Icono `{}`):** Contenedor asociativo de elementos únicos sin duplicados, con búsqueda rápida por hash ($O(1)$). Nodos clave: `Add`, `Add Items`, `Remove`, `Contains`, `Length`, `To Array`, `Union`, `Intersection`, `Difference`.
4. **Map (Icono de clave → valor):** Diccionario asociativo que empareja una clave única (`Key`) con un valor (`Value`). Nodos clave: `Add`, `Find`, `Contains`, `Remove`, `Keys`, `Values`, `Length`, `Clear`.
5. **Structs (`Blueprint Struct Variables`):** Agrupaciones de variables heterogéneas creadas en el Content Browser (**Blueprints → Structure**). Se manipulan en los grafos mediante tres mecanismos:
   * Nodo **`Make <StructName>`:** Recibe pines individuales y construye el struct.
   * Nodo **`Break <StructName>`:** Descompone el struct en pines de salida individuales.
   * Nodo **`Set Members in <StructName>`:** Modifica únicamente los campos seleccionados (activados como pines en el panel *Details*) manteniendo intactos los demás campos de la estructura.
   * **Split Struct Pin:** Haciendo clic derecho sobre cualquier pin de tipo Struct (como un `Transform` o `Vector`) y eligiendo **Split Struct Pin**, el pin se divide directamente en el propio nodo sin necesidad de colocar un nodo `Make` o `Break`.

---

### Categoría B: Modularidad, Flujo de Ejecución y Abstracción

#### 1. Functions (`Funciones`) vs. Macros (`Macros`) vs. Collapsed Graphs (`Grafos Colapsados`)
La guía oficial **Blueprint Best Practices** de UE 5.8 establece las diferencias técnicas exactas entre estos tres mecanismos de reutilización:

| Característica | **Function** | **Macro** | **Collapsed Graph** |
| :--- | :--- | :--- | :--- |
| **Cómo se compila** | Se compila como una función real (`UFunction`) que es invocada en tiempo de ejecución. | Se expande (*copy-paste* automático de sus nodos) dentro del grafo que la llama en tiempo de compilación. | Solo agrupa visualmente nodos dentro del mismo grafo; se expande al compilar. |
| **Pines de Ejecución** | **Exactamente 1 pin de entrada** y **1 pin de salida** (aunque puede tener múltiples nodos `Return Node`, solo un flujo sale de la llamada). | **Cualquier número** de pines de ejecución de entrada y de salida (o ninguno si solo manipula datos). | Cualquier número de pines de ejecución de entrada y de salida en sus túneles. |
| **Soporte de Latent Nodes (`Delay`, `Timeline`)** | **NO.** No se pueden colocar acciones latentes ni Timelines dentro de una Function. | **SÍ.** Soporta cualquier nodo latente (`Delay`, etc.) cuando se usa dentro de un EventGraph. | **SÍ** (si el grafo padre es un EventGraph). |
| **Variables Locales** | **SÍ.** Tiene sección formal de **Local Variables** con nombre en *My Blueprint*. | Solo soporta nodos **`Local <Type>`** anónimos (sin nombre formal en *My Blueprint*). | No tiene ámbito propio; usa las variables del grafo que lo contiene. |
| **Llamada desde otros Blueprints** | **SÍ** (si su *Access Specifier* es `Public`). Tiene pin `Target`. | **NO** como llamada a objeto externo; solo se comparte si vive en una **Blueprint Macro Library** de una clase ancestro común. | **NO.** Es privado al grafo exacto donde se colapsó. |
| **Herencia y Polimorfismo (`Override`)** | **SÍ.** Las clases hijas pueden sobrescribir (**Override**) la función y llamar a `Parent: <FunctionName>`. | **NO.** Las macros no participan en herencia ni polimorfismo. | **NO.** |
| **Modificadores (`Pure`, `Const`, `Access Specifier`)** | Soporta **Pure**, **Const** (no permite modificar estado de la clase) y especificadores **Public / Protected / Private**. | No tiene especificadores de acceso ni versión virtual. | No aplica. |
| **Replicación por Red (RPC)** | No directamente en el nodo de entrada de función BP (los RPCs en BP se definen en **Custom Events**). | No soporta RPCs propios. | No aplica. |

#### 2. Nodos de Control de Flujo (`Flow Control Nodes`)
Documentados oficialmente en la página **Flow Control** de UE 5.8:
* **`Branch`:** Equivalente a `if / else`. Recibe un `Condition` (`Boolean`) y bifurca el pulso por el pin `True` o `False`. Atajo de teclado en el grafo: `B + Left-Click`.
* **`Sequence`:** Recibe un único pulso de ejecución y dispara secuencialmente sus pines de salida (`Then 0`, `Then 1`, `Then 2`...) de arriba abajo **en el mismo frame**, sin ningún retardo entre ellos. Atajo: `S + Left-Click`.
* **`Switch on <Type>` (`Int`, `String`, `Name`, `Enum`):** Evalúa un dato de entrada y desvía la ejecución por el pin de salida que coincida con el valor (o por el pin `Default`). En `Switch on Enum`, los pines de salida se generan automáticamente a partir de los valores del enumerado.
* **`ForLoop` y `ForLoopWithBreak`:** Iteran desde `First Index` hasta `Last Index` (ambos inclusives), disparando `Loop Body` y entregando el `Index` actual en cada iteración, y finalmente disparan `Completed`. **Nota oficial:** Todas las iteraciones ocurren dentro del mismo frame (entre frames de renderizado), por lo que bucles muy grandes penalizan el rendimiento.
* **`WhileLoop`:** Evalúa `Condition` (`Boolean`) antes de cada iteración; mientras sea `true`, ejecuta `Loop Body`; cuando pasa a `false`, dispara `Completed`. Si la condición no cambia dentro del cuerpo en ese mismo frame, provoca un error de *Infinite Loop Detected* y detiene la ejecución.
* **`For Each Loop` y `For Each Loop with Break`:** Macros estándar del motor que recorren un `Array`, entregando `Array Element` y `Array Index` en cada paso del `Loop Body` y disparando `Completed` al terminar.
* **`DoOnce`:** Deja pasar el pulso de ejecución por `Completed` únicamente la primera vez que entra, quedando bloqueado hasta que reciba un pulso en su pin `Reset`. (Atajo: `O + Left-Click`).
* **`DoN`:** Igual que `DoOnce`, pero deja pasar el pulso $N$ veces (exponiendo el contador `Counter`) antes de bloquearse hasta recibir `Reset`. (Atajo: `N + Left-Click`).
* **`FlipFlop`:** Alterna su salida en cada pulso recibido: la primera vez (y llamadas impares) sale por `A`; la segunda vez (y llamadas pares) sale por `B`. Expone además el booleano `Is A`.
* **`Gate`:** Compuerta con estado interno (`Open` o `Closed`, configurable con `Start Closed`). Los pulsos que llegan a `Enter` solo salen por `Exit` si la compuerta está abierta. Sus pines de ejecución `Open`, `Close` y `Toggle` cambian su estado en cualquier momento. (Atajo: `G + Left-Click`).
* **`MultiGate`:** Encamina un pulso de entrada hacia múltiples salidas (`Out 0`, `Out 1`...) de forma secuencial o aleatoria (`Is Random`), con opción de repetir en bucle (`Loop`) y pin `Reset`. (Atajo: `M + Left-Click`).

---

### Categoría C: Eventos, Comunicación, Herencia y Ciclo de Vida del Actor

#### 1. Events y Custom Events (`Eventos`)
* **Definición Oficial:** Nodos llamados desde el código del juego para iniciar la ejecución de una red individual dentro del **EventGraph**. Solo puede existir una instancia de cada evento nativo por Blueprint (si se necesita dividir la ejecución, se conecta a un `Sequence`).
* **Eventos Nativos Fundamentales (`Events`):**
  * `Event BeginPlay`: Se ejecuta cuando comienza la partida para los Actores ya presentes en el nivel, o inmediatamente después de finalizar el spawn para los Actores generados en tiempo de ejecución.
  * `Event Tick`: Se ejecuta en cada frame de juego. Entrega el pin `Delta Seconds` (`Float`), que indica el tiempo transcurrido desde el frame anterior para hacer cálculos independientes del *framerate*.
  * `Event EndPlay`: Se ejecuta cuando el Actor deja de existir en el mundo, entregando `End Play Reason` (`Destroyed`, `LevelTransition`, `EndPlayInEditor`, `RemovedFromWorld`, `Quit`). Reemplaza al evento legado `Event Destroyed` (marcado oficialmente para deprecación en favor de `EndPlay`).
  * `Event ActorBeginOverlap` / `Event ActorEndOverlap`: Se disparan cuando las colisiones de dos Actores comienzan o dejan de solaparse (requiere que ambos tengan `Generate Overlap Events = true` y respuestas de colisión en `Overlap`). Entregan `Other Actor`.
  * `Event Hit`: Se dispara ante una colisión física bloqueante (`Block`) cuando `Simulation Generates Hit Events = true` o durante un movimiento con `Sweep`. Entrega `My Comp`, `Other`, `Other Comp`, `Self Moved`, `Hit Location`, `Hit Normal`, `Normal Impulse` y el struct `Hit` (`HitResult`).
  * `Event AnyDamage`, `Event PointDamage`, `Event RadialDamage`: Eventos de recepción de daño que **se ejecutan únicamente en el servidor** (en un jugador, el cliente local actúa como servidor).
* **`Custom Event`:** Evento creado por el usuario en el EventGraph (`Add Custom Event...`). Puede tener parámetros de entrada, puede invocarse desde cualquier grafo mediante un nodo de llamada con su nombre, soporta **Latent Nodes**, puede marcarse como **Call In Editor** (lo que genera un botón ejecutable en el panel *Details* del nivel sin arrancar el juego si no tiene parámetros) y es el punto donde se configura la replicación de llamadas de red (**Replicates:** `Not Replicated`, `Multicast`, `Run on Server`, `Run on Owning Client`).

#### 2. Los 4 Métodos de Comunicación entre Blueprints (`Blueprint Communication`)
1. **Direct Blueprint Communication (`Comunicación Directa`):**
   * Relación **1 a 1**. El Actor emisor tiene una variable de referencia del tipo exacto del Actor receptor (p. ej., `BP_Door Object Reference`).
   * Si ambos Actores están colocados en el nivel, la variable se marca como **Instance Editable** y se asigna la instancia destino usando el cuentagotas en el panel **Details** del nivel.
2. **Blueprint Casting (`Cast To <Class>`):**
   * Se usa cuando se recibe una referencia genérica (como `Other Actor` de un overlap, o el retorno de `Get Player Character` / `Get Player Pawn` / `Get Game Mode`) y se necesita verificar si esa instancia es de una subclase específica (`Cast To BP_MyCharacter`) para acceder a sus variables, componentes o funciones exclusivas.
   * El nodo tiene dos salidas de ejecución: el pin superior de éxito (junto con el pin de datos tipado `As <ClassName>`) y el pin inferior **`Cast Failed`**.
   * **Implicación técnica crítica:** Colocar un nodo `Cast To BP_HeavyClass` crea una **referencia dura (Hard Reference)** en el activo Blueprint, obligando a cargar `BP_HeavyClass` y todas sus dependencias en memoria en cuanto se carga el Blueprint que contiene el Cast.
3. **Blueprint Interfaces (`BPI`):**
   * Relación polimórfica **1 a 1 (o 1 a elementos heterogéneos)**. Define un contrato de funciones sin implementación.
   * Cualquier Blueprint puede añadir la interfaz en **Class Settings → Interfaces → Implemented Interfaces**.
   * Si una función de la interfaz **no tiene pines de salida**, se implementa en el receptor como un **Event** rojo en el EventGraph. Si **tiene pines de salida**, aparece en la sección **Interfaces** de *My Blueprint* y se implementa como un grafo de **Function**.
   * El emisor llama a la función usando un **Interface Message Node** (identificado con un icono de sobre/carta amarilla y la etiqueta `(Message)`). Si el `Target` implementa la interfaz, ejecuta su lógica; si no la implementa, **falla silenciosamente sin error ni necesidad de hacer Cast**, evitando además referencias duras en memoria.
4. **Event Dispatchers (`Delegados Multicast`):**
   * Relación **1 a N (Patrón Observador / Pub-Sub)**. El Actor emisor declara un **Event Dispatcher** en *My Blueprint* (opcionalmente con parámetros de entrada) y ejecuta el nodo **`Call <DispatcherName>`** cuando ocurre el suceso, sin saber quién está escuchando.
   * Los Actores oyentes obtienen una referencia al emisor y ejecutan **`Bind Event to <DispatcherName>`** (o el atajo **`Assign <DispatcherName>`**, que crea el nodo `Bind` y el `Custom Event` con la firma exacta ya conectada al pin cuadrado rojo **Delegate**).
   * Para dejar de escuchar, utilizan `Unbind Event from <DispatcherName>` o `Unbind All Events from <DispatcherName>`. Es además la vía oficial recomendada para que un Actor de clase se comunique hacia el **Level Blueprint**.

#### 3. Herencia (`Inheritance`) y Ciclo de Vida del Actor (`Actor Lifecycle`)
* **Herencia:** Un Blueprint Class puede crearse como hijo de una clase C++ o de otro Blueprint Class (**Right-click en Content Browser → Create Child Blueprint Class**). El hijo hereda todos los **Components**, **Variables**, **Functions**, **Event Dispatchers** e **Interfaces** del padre.
* **Sobrescritura (`Override`) y Llamada al Padre (`Parent Call`):** En el hijo, cualquier evento del EventGraph (`BeginPlay`, `Tick`) o función del padre puede sobrescribirse desde el menú **Functions → Override**. Para conservar el comportamiento de la clase base, el desarrollador hace clic derecho sobre el nodo de entrada del evento o función y selecciona **Add Call to Parent Function**, lo que inserta el nodo naranja **`Parent: <Name>`**.
* **Ciclo de Vida Exacto de un Actor (`Actor Lifecycle` en UE 5.8):**
  * **Ruta 1 — Actor cargado desde el Nivel (`Load from Disk` / `Play in Editor`):**
    1. Carga de paquetes o duplicación del mundo en PIE (`PostLoad` / `PostDuplicate`).
    2. `InitializeActorsForPlay` → `PreInitializeComponents` → `InitializeComponent` (en cada componente) → `PostInitializeComponents`.
    3. **`Event BeginPlay`** se dispara cuando comienza el nivel.
  * **Ruta 2 — Actor generado en tiempo de ejecución (`SpawnActor`):**
    1. Se llama a `SpawnActorFromClass` (`UWorld::SpawnActor`).
    2. `PostSpawnInitialize` → `PostActorCreated`.
    3. `ExecuteConstruction` → **`OnConstruction` (ejecuta el `SimpleConstructionScript` creando los Components y acto seguido ejecuta el grafo del `Construction Script` del Blueprint)**.
    4. `PostActorConstruction` → `PreInitializeComponents` → `InitializeComponent` → `PostInitializeComponents`.
    5. `OnActorSpawned` se emite en `UWorld`.
    6. **`Event BeginPlay`** se ejecuta inmediatamente en el nuevo Actor.
  * **Ruta 3 — `Deferred Spawn` (cuando el Blueprint tiene variables con `Expose on Spawn`):**
    1. `SpawnActorDeferred` crea la instancia (`PostActorCreated`).
    2. Se inyectan los valores pasados a los pines **Expose on Spawn** antes de construir el Actor.
    3. `FinishSpawning` ejecuta el **`Construction Script`**, inicializa componentes y dispara **`Event BeginPlay`**.
  * **Fin del Ciclo de Vida (`Destruction`):**
    1. Al llamar a **`Destroy Actor`** (o al expirar `Initial Life Span`, o al descargar el nivel), se ejecuta **`Event EndPlay`** (y `Event Destroyed`).
    2. El Actor se retira del array de actores del nivel y se marca como pendiente de eliminación (`PendingKill` / *Garbage*), de modo que **`Is Valid`** devuelve `false` inmediatamente, aunque su memoria física se libera en el siguiente ciclo del **Garbage Collector**.

#### 4. Construction Script (`UserConstructionScript`)
* **Definición Oficial:** Grafo de nodos que se ejecuta inmediatamente después de instanciar la lista de componentes cuando se crea una instancia de un Blueprint Class.
* **Comportamiento en Editor vs. Runtime:** En el Level Editor, el **Construction Script** se ejecuta cada vez que el diseñador arrastra el Actor al nivel, lo mueve/rota/escala (si `Run Construction Script on Drag` está activo) o modifica cualquiera de sus variables `Instance Editable` en el panel **Details**. En runtime, se ejecuta una vez durante el `SpawnActor` antes de `BeginPlay`.
* **Casos de uso típicos:** Generación procedural en tiempo de diseño (vallas o muros que instancian mallas con `Add Static Mesh Component` dentro de un `ForLoop` según una variable de longitud), creación y asignación de un **Material Instance Dynamic (MID)** inicial, o trazado de rayos hacia el suelo para adaptar la malla al terreno.
* **Restricciones:** Solo existe en **Blueprint Classes** (no en el Level Blueprint). No puede contener **Latent Nodes** (`Delay`, `Timeline`) ni lógica que dependa de objetos de sesión de juego como `PlayerController` o `HUD` si se ejecuta en tiempo de edición.

---

### Categoría D: Tiempo, Asincronía y Animación por Curvas

#### 1. Event Tick (`Tick`)
* Se ejecuta cada frame en el hilo principal (**Game Thread**).
* En **Class Defaults → Actor Tick**, el desarrollador controla `Start with Tick Enabled` (si empieza activo o apagado) y `Tick Interval (secs)` (0.0 = cada frame; un valor como `0.2` hace que tickee solo 5 veces por segundo). En runtime se activa/desactiva con `Set Actor Tick Enabled`.
* **Regla de oro oficial (*Blueprint Best Practices* y *Blueprint vs. C++*):** Evitar `Event Tick` para lógica que no necesite actualizarse todos los frames; sustituirlo siempre que sea posible por **Eventos**, **Timers** o **Timelines**.

#### 2. Gameplay Timers (`Timers`)
* **Definición Oficial:** Constructos gestionados por el `FTimerManager` global (en `UWorld` o `UGameInstance`) que programan acciones para ejecutarse tras un retardo o repetidamente a intervalos fijos (`Looping`). Si el Actor objetivo se destruye antes de que venza el temporizador, el Timer se cancela automáticamente de forma segura.
* **Nodos Principales en Blueprints:**
  * `Set Timer by Event`: Recibe un pin cuadrado rojo `Event` (conectado a un `Custom Event`), `Time` (`Float`, en segundos) y `Looping` (`Boolean`). Devuelve un struct **`Timer Handle`** (`FTimerHandle`).
  * `Set Timer by Function Name`: Igual que el anterior, pero recibe un `Object` y el `Function Name` como `String`.
  * `Set Timer for Next Tick by Event / Function Name`: Programa la ejecución para el siguiente frame exactamente.
  * Control por **`Timer Handle`**: `Clear and Invalidate Timer by Handle` (detiene y limpia el timer), `Pause Timer by Handle`, `Unpause Timer by Handle`, `Is Timer Active by Handle`, `Get Timer Elapsed Time by Handle`, `Get Timer Remaining Time by Handle`.

#### 3. Latent Actions (`Acciones Latentes`)
* **Definición Oficial:** Nodos asíncronos identificados por un **icono de reloj en la esquina superior derecha** cuya ejecución abarca múltiples frames sin bloquear el hilo principal del motor.
* **Dónde pueden vivir:** Exclusivamente en un **EventGraph** (o dentro de una **Macro** que se expanda en un EventGraph). **No pueden usarse dentro de una Function**.
* **Comportamiento de `Delay` vs. `Retriggerable Delay`:**
  * **`Delay`:** Cuando recibe un pulso de ejecución, inicia una cuenta atrás de `Duration` segundos. **Si recibe nuevos pulsos mientras la cuenta atrás sigue activa, los ignora por completo.** Al llegar a 0, dispara su pin `Completed`.
  * **`Retriggerable Delay`:** Cuando recibe un pulso de ejecución, inicia la cuenta atrás de `Duration` segundos. **Si recibe un nuevo pulso antes de terminar, reinicia la cuenta atrás desde cero** a `Duration` segundos y solo dispara `Completed` cuando transcurre el tiempo completo sin nuevas interrupciones.
* **Otras Latent Actions frecuentes:** `Move Component To` (interpola posición y rotación relativas de un `SceneComponent` en un tiempo dado con curvas *Ease In / Ease Out*), `Async Load Asset`, `Async Load Class Asset`, `Async Save Game to Slot`, `Async Load Game from Slot`, `Play Montage`.

#### 4. Timelines (`UTimelineComponent`)
* **Definición Oficial:** Componentes de animación basada en tiempo (`UTimelineComponent`) integrados como nodos especiales en el EventGraph que interpolan valores (`Float`, `Vector`, `Linear Color`) o disparan eventos entre fotogramas clave (**Keyframes**) a lo largo de una duración definida, pensados para tareas no cinemáticas como abrir puertas, mover plataformas o pulsar luces.
* **Anatomía del Nodo `Timeline`:**
  * **Pines de Ejecución de Entrada:**
    * `Play`: Reproduce desde la posición actual hacia delante.
    * `Play from Start`: Reinicia al segundo `0.0` y reproduce hacia delante.
    * `Stop`: Detiene la reproducción en la posición actual.
    * `Reverse`: Reproduce hacia atrás desde la posición actual hasta `0.0`.
    * `Reverse from End`: Salta al final de la línea de tiempo y reproduce hacia atrás hasta `0.0`.
    * `Set New Time`: Salta instantáneamente al segundo indicado en el pin de datos `New Time` (`Float`).
  * **Pines de Ejecución de Salida:**
    * `Update`: Se dispara en cada frame mientras la Timeline está activa.
    * `Finished`: Se dispara cuando la Timeline llega al final (en `Play`) o al principio (en `Reverse`), pero **no** cuando se detiene con `Stop`.
    * Pines adicionales por cada **Event Track** creada dentro del editor de la Timeline.
  * **Pines de Datos de Salida:**
    * `Direction` (`ETimelineDirection` enum: `Forward` o `Backward`).
    * Un pin de datos (`Float`, `Vector` o `Linear Color`) por cada pista (**Track**) creada al hacer doble clic en el nodo Timeline.
  * **Variable de Componente:** Cada Timeline crea automáticamente una referencia a su `UTimelineComponent` en *My Blueprint*, permitiendo llamar a nodos como `Set Play Rate`, `Get Playback Position` o `Set Timeline Length`.

---

### Categoría E: Sistemas del Motor (SaveGame, Input, UMG, Spawn, Físicas, AI, VFX/Materiales)

#### 1. Save Game (`USaveGame` / `ULocalPlayerSaveGame`)
* **Flujo Oficial:**
  1. Se crea un Blueprint Class cuya clase padre sea **`SaveGame`** (o `LocalPlayerSaveGame`) y se le añaden las variables que se desean persistir (p. ej., `PlayerScore`, `InventoryItems`, `CheckpointTransform`).
  2. **Para Guardar:** Se comprueba si existe partida con `Does Save Game Exist` (`Slot Name`, `User Index`) → si existe se carga con `Load Game from Slot` (o si no, se instancia un objeto en memoria con **`Create Save Game Object`** seleccionando la clase `BP_MySaveGame`) → se modifican sus variables mediante nodos `Set` → se escribe en disco con **`Save Game to Slot`** (síncrono) o **`Async Save Game to Slot`** (nodo latente con pin `Completed`).
  3. **Para Cargar:** Se verifica `Does Save Game Exist` → se llama a **`Load Game from Slot`** (o **`Async Load Game from Slot`**) → el `Return Value` (`SaveGame Object Reference`) se pasa por un **`Cast To BP_MySaveGame`** → se leen sus variables y se aplican al jugador o al mundo.

#### 2. Input (`Enhanced Input` en UE 5.8)
En Unreal Engine 5.8, el sistema antiguo de *Action/Axis Mappings* de Project Settings está deprecado en favor de **Enhanced Input** (activo por defecto), que se basa en cuatro activos y conceptos:
1. **`Input Action` (`IA_`):** Activo de datos que representa una acción abstracta del jugador (p. ej., `IA_Jump`, `IA_Move`, `IA_Interact`) con un `Value Type`: `Digital (bool)`, `Axis1D (float)`, `Axis2D (Vector2D)` o `Axis3D (Vector)`.
2. **`Input Mapping Context` (`IMC_`):** Activo que mapea teclas, botones o ejes físicos a los `Input Actions`, aplicando listas opcionales de **Input Modifiers** y **Input Triggers**.
3. **`Input Modifiers`:** Transforman el valor bruto de entrada (p. ej., `Dead Zone`, `Negate`, `Swizzle Input Axis Values` para convertir `W/S` en el eje Y de un `Vector2D`, `Scalar`).
4. **`Input Triggers`:** Determinan la condición de activación (`Down`, `Pressed`, `Released`, `Hold`, `Tap`, `Chorded Action`).
* **Uso en el Grafo de Blueprints:**
  * En `Event BeginPlay` del `Character` o `PlayerController`: se obtiene el `PlayerController` → **`Get Enhanced Input Local Player Subsystem`** → **`Add Mapping Context`** (pasando el activo `IMC_Default` y su `Priority`). Los contextos se pueden añadir o quitar dinámicamente en runtime (`Remove Mapping Context`).
  * En el `EventGraph`, se coloca el nodo de evento **`EnhancedInputAction IA_<Name>`**, el cual expone cinco pines de ejecución según el estado del trigger: **`Triggered`** (se dispara cada frame mientras el trigger se cumple), **`Started`** (empieza la evaluación del trigger), **`Ongoing`** (el trigger se está procesando pero aún no culmina, p. ej., durante un `Hold`), **`Canceled`** (el hold o acorde se abortó) y **`Completed`** (la acción finalizó al soltar), además del pin de datos tipado **`Action Value`** y los tiempos `Elapsed Seconds` / `Triggered Seconds`.

#### 3. UI — Unreal Motion Graphics (`UMG` / `UUserWidget`)
* Un **Widget Blueprint** combina la pestaña **Designer** (donde se anidan contenedores como `Canvas Panel`, `Overlay`, `Horizontal Box`, `Vertical Box`, `Scroll Box`, `Size Box` y controles como `Text`, `Button`, `Image`, `Progress Bar`) con la pestaña **Graph**.
* **Ciclo de Vida y Visualización de un Widget:**
  * Se instancia con **`Create Widget`** (especificando `Class` y `Owning Player`) → se guarda su `Return Value` en una variable → se muestra en pantalla con **`Add to Viewport`** (o `Add to Player Screen` en pantalla dividida, o `Add Child` para insertarlo dentro de un panel de otro widget) → se retira de la pantalla con **`Remove from Parent`**.
* **Control de Ratón y Modo de Entrada:**
  * Desde el `PlayerController`, se llama a **`Set Input Mode Game Only`** (gameplay normal), **`Set Input Mode Game and UI`** (gameplay + clic en widgets) o **`Set Input Mode UI Only`** (menús que bloquean el control del personaje), combinado con **`Set Show Mouse Cursor`** (`true` / `false`).
* **Actualización de Datos en UI:**
  * **Property Binding (Pull):** Vincular una propiedad del widget (como el `Percent` de una `Progress Bar`) a una función pura en el Graph del widget que se evalúa cada frame.
  * **Event-Driven UI (Push — Recomendado por Epic para rendimiento):** Marcar los sub-widgets como **`Is Variable`** en el Designer y actualizarlos únicamente cuando cambia el dato (llamando a una función del Widget o suscribiendo el Widget en su `Event Construct` a un **Event Dispatcher** del personaje/componente).

#### 4. Spawning y Destrucción de Actores (`SpawnActor` / `DestroyActor`)
* **`Spawn Actor from Class`:** Nodo que instancia un nuevo `Actor` en el mundo. Recibe:
  * `Class` (`Actor Class Reference`).
  * `Spawn Transform` (`Transform` con posición, rotación y escala en el mundo).
  * `Collision Handling Override` (`ESpawnActorCollisionHandlingMethod`: `Default`, `Always Spawn, Ignore Collisions`, `Try To Adjust Location, But Always Spawn`, `Try To Adjust Location, Don't Spawn If Still Colliding`, `Do Not Spawn`).
  * `Owner` (`Actor Object Reference` opcional, relevante para red y visibilidad) e `Instigator` (`Pawn Object Reference` responsable del daño o acción).
  * Cualquier pin adicional generado automáticamente por variables de esa clase marcadas con **`Expose on Spawn`**.
* **`Destroy Actor`:** Marca el Actor objetivo para destrucción, disparando su `Event EndPlay` y eliminándolo de la escena. También puede configurarse de forma declarativa mediante la propiedad **`Initial Life Span`** (en segundos) en *Class Defaults* o con el nodo `Set Life Span`.

#### 5. Line Traces (Raycasts) y Overlaps (`Físicas y Colisiones`)
* **Modelo de Colisiones de Unreal:** Cada `PrimitiveComponent` tiene un **`Object Type`** (`WorldStatic`, `WorldDynamic`, `Pawn`, `PhysicsBody`, `Vehicle`, `Destructible` o canales personalizados) y configura su matriz de respuesta frente a cada **Trace Channel** (`Visibility`, `Camera`) y **Object Channel** con tres estados posibles: **`Ignore`** (ignora por completo), **`Overlap`** (permite atravesar y genera eventos de solapamiento si ambos tienen `Generate Overlap Events = true`) o **`Block`** (detiene el movimiento físico y genera `Event Hit` si `Simulation Generates Hit Events = true`).
* **Nodos de Trazado (`Traces` / Raycasts):**
  * Formas geométricas: **`Line Trace`** (segmento de línea entre `Start` y `End`), **`Sphere Trace`**, **`Box Trace`** y **`Capsule Trace`** (*Shape Traces* que barren un volumen entre `Start` y `End`).
  * Modos de filtro: **`...By Channel`** (consulta contra un canal como `Visibility` o `Camera`), **`...For Objects`** (recibe un array de `Object Types` a detectar) o **`...By Profile`** (usa un perfil de colisión predefinido).
  * Cantidad de impactos: **Single** (p. ej., `Line Trace By Channel`, devuelve `Return Value` booleano y el primer impacto bloqueante en `Out Hit`) o **Multi** (p. ej., `Multi Line Trace By Channel`, devuelve un `Array` de `HitResult` con todos los overlaps previos hasta el primer bloqueo).
* **Estructura `Hit Result` (`Break Hit Result`):** Contiene `Blocking Hit` (`Boolean`), `Initial Overlap` (`Boolean`), `Time` (`0.0` a `1.0`), `Distance` (`Float`), `Location` (`Vector`), `Impact Point` (`Vector`), `Normal` (`Vector`), `Impact Normal` (`Vector`), `Phys Mat` (`PhysicalMaterial`), `Hit Actor` (`Actor`), `Hit Component` (`PrimitiveComponent`), `Hit Bone Name` (`Name`), `Face Index` (`Integer`), `Trace Start` y `Trace End`.

#### 6. Inteligencia Artificial: AI Controller, Blackboard y Behavior Trees
En UE 5.8, la IA clásica con Blueprints se divide en cuatro piezas acopladas:
1. **`AIController` (`AAIController`):** El "cerebro controlador" no físico que posee (`Possess`) al `Pawn` o `Character` de la IA. En su evento `Event On Possess`, suele iniciar el árbol llamando al nodo **`Run Behavior Tree`** y configurar la percepción con un **`AIPerceptionComponent`** (evento `On Target Perception Updated`).
2. **`Blackboard` (`BB_`):** Activo de memoria que almacena variables tipadas llamadas **`Blackboard Keys`** (p. ej., `TargetActor` de tipo `Object`, `HasLineOfSight` de tipo `Bool`, `PatrolLocation` de tipo `Vector`). Desde Blueprints se leen y escriben obteniendo el componente con `Get Blackboard` y llamando a `Set Value as Object`, `Set Value as Vector`, `Set Value as Bool`, `Clear Value`, etc.
3. **`Behavior Tree` (`BT_`):** Grafo jerárquico de decisiones que se evalúa de **izquierda a derecha y de arriba abajo** (el orden numérico aparece en la esquina superior derecha de cada nodo). Sus nodos se dividen en:
   * **Root:** Punto de inicio asociado a un activo `Blackboard`.
   * **Composite Nodes:** Controlan el flujo de las ramas:
     * **`Selector`:** Ejecuta sus hijos de izquierda a derecha hasta que **uno tenga éxito** (`Success`), momento en que el Selector termina con éxito (actúa como un `OR` / *fallback* de prioridades: p. ej., 1º Atacar, 2º Perseguir, 3º Patrullar).
     * **`Sequence`:** Ejecuta sus hijos de izquierda a derecha mientras **todos tengan éxito**; si uno falla (`Failure`), toda la secuencia se aborta y falla (actúa como un `AND` de pasos: p. ej., Seleccionar punto → Moverse al punto → Esperar 2s).
     * **`Simple Parallel`:** Ejecuta una tarea principal junto con un subárbol secundario en paralelo.
   * **Decorators (Nodos azules adheridos a un Composite o Task):** Condicionales que validan si una rama puede ejecutarse (p. ej., `Blackboard Based Condition` que comprueba si `TargetActor Is Set`) y pueden abortar ramas en curso (`Observer Aborts`: `Self`, `Lower Priority`, `Both`). Se pueden programar en Blueprint heredando de `BTDecorator_BlueprintBase` (`PerformConditionCheckAI`).
   * **Services (Nodos verdes adheridos a un Composite):** Se ejecutan periódicamente a una frecuencia definida mientras su rama está activa para hacer comprobaciones y actualizar el `Blackboard`. Se programan en Blueprint heredando de `BTService_BlueprintBase` (`Event Receive Tick AI`, `Event Receive Activation AI`).
   * **Tasks (Nodos púrpura hoja):** Las acciones concretas que ejecuta la IA (como los nativos `Move To` y `Wait`, o tareas personalizadas creadas en Blueprint heredando de `BTTask_BlueprintBase` que implementan **`Event Receive Execute AI`** y están obligadas a cerrar su ejecución llamando al nodo **`Finish Execute`** con `Success = true` o `false`).
4. **Navegación (`NavMesh`):** Requiere un **`NavMeshBoundsVolume`** en el nivel para que nodos como `AI MoveTo` (nodo latente en Blueprints con salidas `On Success` y `On Fail`) o la tarea `Move To` del Behavior Tree puedan calcular caminos.

#### 7. Parámetros de Materiales y Efectos Niagara desde Blueprints
* **Material Instance Dynamic (`MID`):**
  1. En el Material base se exponen expresiones parametrizadas (`ScalarParameter`, `VectorParameter`, `TextureSampleParameter2D`).
  2. En el `Construction Script` o `Event BeginPlay` del Blueprint, se toma el componente de malla (`StaticMeshComponent` / `SkeletalMeshComponent`) y se llama a **`Create Dynamic Material Instance`** (indicando el `Element Index` y el `Source Material`), guardando su retorno en una variable de tipo `Material Instance Dynamic Object Reference`.
  3. En runtime (p. ej., dentro de una `Timeline` o al recibir daño), se llama sobre esa variable a **`Set Scalar Parameter Value`**, **`Set Vector Parameter Value`** o **`Set Texture Parameter Value`** indicando el `Parameter Name` (`Name`).
* **Material Parameter Collection (`MPC`):**
  * Para cambios globales que afectan a decenas de materiales a la vez (nivel de nieve, humedad, desaturación global o posición del jugador en el foliage), el Blueprint llama directamente a **`Set Scalar Parameter Value`** o **`Set Vector Parameter Value`** seleccionando el activo **`Collection`** (`UMaterialParameterCollection`) sin necesidad de referencias a mallas ni MIDs.
* **Niagara VFX (`UNiagaraComponent`):**
  * **Instanciación puntual (Fire-and-forget):** Nodos **`Spawn System at Location`** o **`Spawn System Attached`** (seleccionando el activo `Niagara System`).
  * **Componente persistente:** Se añade un `NiagaraComponent` al Actor y se controla con `Activate`, `Deactivate` o `Reset System`.
  * **Paso de parámetros de gameplay a partículas:** En el sistema Niagara se crean variables en el namespace **`User.`** (p. ej., `User.SpawnRate`, `User.BeamEnd`, `User.EffectColor`) y desde Blueprints se modifican en tiempo real con **`Set Niagara Variable (Float)`**, **`Set Niagara Variable (Vector3)`**, **`Set Niagara Variable (LinearColor)`** o **`Set Variable Float / Vec3 / Bool`** sobre el componente Niagara.

---

## 5. Los 15 Patrones Frecuentes que un Desarrollador de Blueprints Sabe de Memoria

A continuación se documentan paso a paso los 15 patrones que forman la memoria muscular de un desarrollador de Blueprints en UE 5.8, detallando la arquitectura, el flujo de ejecución y los nodos exactos implicados.

---

### Patrón 1: Abrir y Cerrar Puerta Suavemente al Interactuar (Blueprint Interface + Timeline + Lerp)
* **Objetivo:** Cuando el jugador mira a una puerta y pulsa la tecla de interacción (`E`), la puerta gira 90° suavemente hacia abrirse o cerrarse sin hacer `Cast` a la clase concreta de la puerta.
* **Activos implicados:** `BPI_Interactable` (Blueprint Interface con función `Interact`), `BP_PlayerCharacter` y `BP_Door` (Actor con `DefaultSceneRoot` y `DoorMesh` con pivote en la bisagra).
* **Nodos Implicados:** `EnhancedInputAction IA_Interact`, `Line Trace By Channel`, `Break Hit Result`, `Interact (Message)`, `Event Interact`, `FlipFlop`, `Timeline`, `Lerp (Rotator)`, `Set Relative Rotation`.
* **Pasos del Grafo:**
  1. En `BPI_Interactable`, declarar la función `Interact` (sin salidas). Añadir `BPI_Interactable` en **Class Settings → Implemented Interfaces** de `BP_Door`.
  2. En `BP_PlayerCharacter`, desde el pin `Started` de `EnhancedInputAction IA_Interact`, ejecutar un `Line Trace By Channel` desde la cámara hacia delante (p. ej., 300 cm).
  3. Si `Return Value` del trace es `true` (en un `Branch`), hacer `Break Hit Result` en `Out Hit`, tomar `Hit Actor` y llamar directamente al nodo **`Interact (Message)`**.
  4. En el `EventGraph` de `BP_Door`, colocar **`Event Interact`** y conectarlo a un nodo **`FlipFlop`**.
  5. Crear un nodo **`Timeline`** (`TL_DoorAnim`, duración `1.0s`) con una pista Float llamada `Alpha` que tenga dos keyframes: `(0.0s, 0.0)` y `(1.0s, 1.0)` con interpolación *Auto/Ease*.
  6. Conectar la salida `A` del `FlipFlop` al pin **`Play`** de la Timeline, y la salida `B` al pin **`Reverse`**.
  7. Desde el pin **`Update`** de la Timeline, llamar a **`Set Relative Rotation`** sobre el componente `DoorMesh`.
  8. Para el pin `New Rotation`, colocar un nodo puro **`Lerp (Rotator)`** con `A = (0, 0, 0)`, `B = (0, 0, 90)` y su pin `Alpha` conectado al pin de salida `Alpha` de la Timeline.

---

### Patrón 2: Disparar Arma Hitscan y Aplicar Daño (Line Trace + Apply Point Damage + VFX)
* **Objetivo:** Al disparar un arma, trazar un rayo desde el centro de la cámara, detectar impacto, generar partículas/sonido en el punto de impacto y aplicar daño al Actor golpeado.
* **Nodos Implicados:** `EnhancedInputAction IA_Fire`, `Get World Location`, `Get World Rotation`, `Get Forward Vector`, `Multiply (Vector * Float)`, `Add (Vector + Vector)`, `Line Trace By Channel`, `Branch`, `Break Hit Result`, `Spawn System at Location`, `Play Sound at Location`, `Apply Point Damage`, `Event PointDamage` / `Event AnyDamage`.
* **Pasos del Grafo:**
  1. En `BP_PlayerCharacter`, disparar la cadena desde `Started` de `EnhancedInputAction IA_Fire`.
  2. Obtener el componente `FirstPersonCamera` (`Get`): leer `Get World Location` (este valor va al pin `Start` del trace).
  3. Del mismo `FirstPersonCamera`, leer `Get World Rotation` → `Get Forward Vector` → multiplicar por `WeaponRange` (p. ej., `5000.0`) → sumar (`+`) con `Get World Location`. El resultado va al pin `End` de **`Line Trace By Channel`** (canal `Visibility`).
  4. Conectar el `Return Value` (`Boolean`) del trace a un **`Branch`**.
  5. Por la salida `True`, romper el `Out Hit` con **`Break Hit Result`**.
  6. Conectar a **`Spawn System at Location`** (pasando `Impact Point` como ubicación y convirtiendo `Impact Normal` con `Make Rot from X` como rotación) y a **`Play Sound at Location`**.
  7. A continuación, ejecutar **`Apply Point Damage`**: conectar `Hit Actor` a `Damaged Actor`, `BaseDamage` (`25.0`), `Forward Vector` a `Hit From Direction`, `Out Hit` a `Hit Info`, `Get Controller` a `Event Instigator` y `Self` a `Damage Causer`.
  8. En el Actor enemigo o destructible receptor, el motor dispara automáticamente **`Event PointDamage`** (y **`Event AnyDamage`**), donde se resta la vida.

---

### Patrón 3: Recoger Objeto del Suelo y Sumar al Inventario (Overlap + Array/Map + Destroy Actor)
* **Objetivo:** Cuando el jugador camina sobre un objeto recolectable (`BP_PickupItem`), el objeto se añade al inventario del jugador, reproduce un sonido y desaparece del nivel.
* **Nodos Implicados:** `On Component Begin Overlap (SphereCollision)`, `Cast To BP_PlayerCharacter` (o `BPI_Inventory`), `Find (Map)` / `Add (Map)` / `Add (Array)`, `Play Sound 2D`, `Destroy Actor`.
* **Pasos del Grafo:**
  1. En `BP_PickupItem`, configurar una malla estática con colisión `NoCollision` y un `SphereComponent` con colisión `OverlapOnlyPawn`, y crear dos variables **`Instance Editable`**: `ItemID` (`Name`) y `Quantity` (`Integer = 1`).
  2. Seleccionar `SphereComponent` y añadir el evento **`On Component Begin Overlap`**.
  3. Tomar el pin `Other Actor` y pasarlo por **`Cast To BP_PlayerCharacter`** (o llamar a un mensaje de interfaz `AddInventoryItem`).
  4. En la función `AddItem(ItemID, Quantity)` de `BP_PlayerCharacter` (que tiene una variable `Inventory` de tipo `Map<Name, Integer>`): usar **`Find`** sobre el `Map` con `ItemID` → sumar (`+`) el valor encontrado (que es `0` si no existía) con `Quantity` → llamar a **`Add`** sobre el `Map` con la clave `ItemID` y la nueva suma.
  5. De vuelta en `BP_PickupItem`, tras confirmar la recogida, llamar a **`Play Sound at Location`** (con `Get Actor Location`) y terminar con **`Destroy Actor`** (`Target = Self`).

---

### Patrón 4: HUD con Barra de Vida Reactiva (UMG + Event Dispatcher)
* **Objetivo:** Mostrar una barra de salud en pantalla (`WBP_HUD`) que se actualice instantáneamente solo cuando cambia la vida del personaje, sin evaluar bindings todos los frames.
* **Nodos Implicados:** `Create Widget`, `Add to Viewport`, `Event AnyDamage`, `Clamp (Float)`, `Call OnHealthChanged`, `Event Construct`, `Get Owning Player Pawn`, `Bind Event to OnHealthChanged`, `Set Percent (ProgressBar)`.
* **Pasos del Grafo:**
  1. En `BP_PlayerCharacter`, crear las variables `CurrentHealth` (`Float = 100.0`), `MaxHealth` (`Float = 100.0`) y un **Event Dispatcher** llamado **`OnHealthChanged`** con un parámetro de entrada `HealthRatio` (`Float`).
  2. En **`Event AnyDamage`** del personaje: calcular `CurrentHealth - Damage` → pasar por **`Clamp (Float)`** (`Min = 0.0`, `Max = MaxHealth`) → hacer **`Set CurrentHealth`** → dividir `CurrentHealth / MaxHealth` y llamar a **`Call OnHealthChanged`** pasando ese cociente.
  3. En `WBP_HUD`, añadir un `ProgressBar` en la pestaña *Designer* y marcar **`Is Variable = true`** (`HealthProgressBar`).
  4. En la pestaña *Graph* de `WBP_HUD`, desde **`Event Construct`**, llamar a `Get Owning Player Pawn` → `Cast To BP_PlayerCharacter` → arrastrar del pin `As BP_PlayerCharacter` y elegir **`Assign OnHealthChanged`** (lo que crea `Bind Event to OnHealthChanged` y el evento `OnHealthChanged_Event(HealthRatio)`).
  5. En ese `OnHealthChanged_Event`, tomar la variable `HealthProgressBar` y llamar a **`Set Percent`** conectando `HealthRatio`.
  6. En `Event BeginPlay` del `PlayerController` (o del `Character`), llamar a **`Create Widget`** (`Class = WBP_HUD`) → guardar la referencia en variable → llamar a **`Add to Viewport`**.

---

### Patrón 5: Spawner de Enemigos u Objetos con Timer y Límite (Set Timer by Event + Array Length)
* **Objetivo:** Generar un enemigo cada $X$ segundos en puntos de aparición hasta alcanzar un máximo de enemigos vivos simultáneamente, y detener el spawner cuando se desee.
* **Nodos Implicados:** `Event BeginPlay`, `Set Timer by Event`, `Custom Event`, `Length (Array)`, `Branch`, `Spawn Actor from Class`, `Add (Array)`, `Assign OnDestroyed`, `Remove Item (Array)`, `Clear and Invalidate Timer by Handle`.
* **Pasos del Grafo:**
  1. En `BP_EnemySpawner`, crear variables `EnemyClass` (`Actor Class Reference`, *Instance Editable*), `SpawnInterval` (`Float = 3.0`), `MaxActiveEnemies` (`Integer = 5`), `ActiveEnemies` (`Array` de `Actor Object Reference`) y `SpawnTimerHandle` (`Timer Handle`).
  2. En **`Event BeginPlay`**, colocar **`Set Timer by Event`** con `Time = SpawnInterval` y `Looping = true`. Promover el `Return Value` a la variable `SpawnTimerHandle`.
  3. Conectar el pin cuadrado rojo `Event` a un **`Custom Event`** llamado `TrySpawnEnemy`.
  4. Desde `TrySpawnEnemy`, consultar **`Length`** del array `ActiveEnemies`, comparar si es `< MaxActiveEnemies` y conectar a un **`Branch`**.
  5. Si es `True`, ejecutar **`Spawn Actor from Class`** (`Class = EnemyClass`, `Spawn Transform = Get Actor Transform`, `Collision Handling Override = Try To Adjust Location, But Always Spawn`).
  6. Añadir el `Return Value` al array `ActiveEnemies` con **`Add`**, y además arrastrar desde el `Return Value` para elegir **`Assign OnDestroyed`**: en el evento `OnDestroyed_Event(DestroyedActor)`, llamar a **`Remove Item`** sobre el array `ActiveEnemies` pasando `DestroyedActor`.
  7. Si el spawner debe apagarse por completo, llamar a **`Clear and Invalidate Timer by Handle`** pasando `SpawnTimerHandle`.

---

### Patrón 6: Máquina de Estados Simple con Enum (Enum + Switch on Enum)
* **Objetivo:** Gestionar el estado de un Actor (p. ej., una torreta o jefe con estados `Idle`, `Alert`, `Attacking`, `Disabled`) de forma limpia y explícita.
* **Nodos Implicados:** `Blueprint Enumeration`, `Set <EnumVariable>`, `Switch on <EnumName>`, `Custom Event / Function`.
* **Pasos del Grafo:**
  1. En el Content Browser, crear un **Blueprint Enumeration** (`Right-Click → Blueprints → Enumeration`) llamado `E_TurretState` con los valores `Idle`, `Alert`, `Attacking`, `Disabled`.
  2. En `BP_Turret`, crear una variable `CurrentState` de tipo `E_TurretState` (valor por defecto `Idle`).
  3. Crear una función `SetTurretState(NewState : E_TurretState)`:
     * Comparar con `!= (Enum)` si `NewState != CurrentState` y usar un **`Branch`** para ignorar transiciones redundantes al mismo estado.
     * Hacer **`Set CurrentState = NewState`**.
     * Conectar a un nodo **`Switch on E_TurretState`** conectado a `CurrentState`.
  4. El nodo `Switch on E_TurretState` genera automáticamente cuatro pines de ejecución de salida (`Idle`, `Alert`, `Attacking`, `Disabled`), desde los cuales se dispara la lógica de entrada a cada estado (cambiar color del indicador luminoso, activar/pausar timers de disparo o reproducir sonido).

---

### Patrón 7: Guardar y Cargar Partida en Disco (SaveGame Object + Slot Serialization)
* **Objetivo:** Guardar la puntuación, salud y posición del jugador en un slot persistente en disco y restaurarlos al iniciar el nivel o pulsar "Cargar".
* **Nodos Implicados:** `Does Save Game Exist`, `Branch`, `Load Game from Slot`, `Create Save Game Object`, `Cast To BP_SaveGame`, `Save Game to Slot` / `Async Save Game to Slot`.
* **Pasos del Grafo:**
  1. Crear un Blueprint Class hijo de **`SaveGame`** llamado `BP_MySaveGame` y declarar las variables `SavedHealth` (`Float`), `SavedScore` (`Integer`) y `SavedTransform` (`Transform`).
  2. **Función / Evento `SaveGameData`:**
     * Llamar a **`Does Save Game Exist`** (`Slot Name = "SaveSlot_01"`, `User Index = 0`) y conectar a un **`Branch`**.
     * Si es `True`: llamar a **`Load Game from Slot`** y hacer **`Cast To BP_MySaveGame`**.
     * Si es `False`: llamar a **`Create Save Game Object`** (`Save Game Class = BP_MySaveGame`).
     * En la instancia obtenida de `BP_MySaveGame`, usar nodos **`Set`** para asignar `SavedHealth`, `SavedScore` y `SavedTransform` (`Get Actor Transform` del jugador).
     * Llamar a **`Save Game to Slot`** (o **`Async Save Game to Slot`**) pasando el objeto, `Slot Name = "SaveSlot_01"` y `User Index = 0`.
  3. **Función / Evento `LoadGameData`:**
     * Llamar a **`Does Save Game Exist`** (`"SaveSlot_01"`, `0`) → **`Branch`**.
     * Por `True`, llamar a **`Load Game from Slot`** (`"SaveSlot_01"`, `0`) → **`Cast To BP_MySaveGame`**.
     * Leer `SavedHealth`, `SavedScore` y llamar a **`Set Actor Transform`** en el personaje del jugador con `SavedTransform`.

---

### Patrón 8: Trampa de Daño por Tiempo — DoT (Overlap + Timer Pause/Unpause + Apply Damage)
* **Objetivo:** Aplicar daño al jugador inmediatamente al entrar en una zona de fuego o veneno y repetir ese daño cada segundo mientras permanezca dentro, deteniéndolo al salir (patrón documentado en *Designer 07: Traps and Damage* de UE 5.8).
* **Nodos Implicados:** `Event BeginPlay`, `Set Timer by Event`, `Pause Timer by Handle`, `On Component Begin Overlap`, `On Component End Overlap`, `Unpause Timer by Handle`, `Apply Damage`.
* **Pasos del Grafo:**
  1. En `BP_DamageTrap`, añadir un `BoxComponent` (`TrapTrigger`) y las variables `DamageAmount` (`Float = 10.0`), `DamageInterval` (`Float = 1.0`), `TargetActor` (`Actor Object Reference`) y `DamageTimerHandle` (`Timer Handle`).
  2. En **`Event BeginPlay`**: ejecutar **`Set Timer by Event`** (`Time = DamageInterval`, `Looping = true`), guardar el retorno en `DamageTimerHandle` e inmediatamente llamar a **`Pause Timer by Handle`** para que el timer empiece en pausa.
  3. El `Custom Event` conectado al Timer (`DealTrapDamage`) llama a **`Apply Damage`** con `Damaged Actor = TargetActor` y `Base Damage = DamageAmount`.
  4. En **`On Component Begin Overlap (TrapTrigger)`**: guardar `Other Actor` en **`Set TargetActor`**, llamar una vez a `DealTrapDamage` (daño inicial inmediato) y llamar a **`Unpause Timer by Handle`** (`DamageTimerHandle`).
  5. En **`On Component End Overlap (TrapTrigger)`**: comprobar si `Other Actor == TargetActor` (`Branch`) y por `True` llamar a **`Pause Timer by Handle`** (`DamageTimerHandle`) y limpiar `TargetActor`.

---

### Patrón 9: muerte de Jefe y Notificación a Múltiples Actores (Event Dispatcher 1 a N)
* **Objetivo:** Cuando un Boss muere, una puerta bloqueada se abre, varios efectos de explosión del escenario se activan y la UI muestra un mensaje de victoria sin que el Boss tenga referencias a la puerta, las explosiones ni el HUD (patrón del *Event Dispatchers Quick Start Guide*).
* **Nodos Implicados:** `Event Dispatcher (OnBossDied)`, `Call OnBossDied`, `Bind Event to OnBossDied` / `Assign OnBossDied`, `Custom Event`.
* **Pasos del Grafo:**
  1. En `BP_Boss`, crear un **Event Dispatcher** en *My Blueprint* llamado **`OnBossDied`**.
  2. En la lógica de daño de `BP_Boss`, cuando `Health <= 0.0`, arrastrar `OnBossDied` al grafo y elegir **`Call OnBossDied`**.
  3. En `BP_BossDoor` y en `BP_ExplosionEffect`, crear una variable `BossReference` de tipo `BP_Boss Object Reference` y marcarla como **`Instance Editable`** (ojo abierto).
  4. En el **`Event BeginPlay`** de `BP_BossDoor`: comprobar **`Is Valid`** sobre `BossReference` → arrastrar desde `BossReference` y seleccionar **`Assign OnBossDied`**.
  5. Conectar el **`OnBossDied_Event`** generado al `Play` de la Timeline que abre la puerta (y en `BP_ExplosionEffect`, conectarlo al nodo `Activate` de sus componentes de partículas y audio).
  6. En el Level Editor, seleccionar la puerta y las explosiones y asignar en su panel *Details* la instancia de `BP_Boss` del nivel.

---

### Patrón 10: Locomoción y Cámara con Enhanced Input (Input Mapping Context + Add Movement Input)
* **Objetivo:** Configurar el movimiento 2D (`WASD` / Stick izquierdo) y giro de cámara (`Mouse XY` / Stick derecho) en un personaje de tercera o primera persona en UE 5.8.
* **Nodos Implicados:** `Get Controller`, `Cast To PlayerController`, `Get Enhanced Input Local Player Subsystem`, `Add Mapping Context`, `EnhancedInputAction IA_Move`, `EnhancedInputAction IA_Look`, `Get Control Rotation`, `Break Rotator`, `Make Rotator`, `Get Forward Vector`, `Get Right Vector`, `Add Movement Input`, `Add Controller Yaw Input`, `Add Controller Pitch Input`.
* **Pasos del Grafo:**
  1. En **`Event BeginPlay`** de `BP_Character`: `Get Controller` → `Cast To PlayerController` → **`Get Enhanced Input Local Player Subsystem`** → **`Add Mapping Context`** (`Mapping Context = IMC_Default`, `Priority = 0`).
  2. Colocar el evento **`EnhancedInputAction IA_Move`** (cuyo `Value Type` es `Axis2D (Vector2D)`). Hacer *Split Struct Pin* en `Action Value` para obtener `Action Value X` (derecha/izquierda) y `Action Value Y` (adelante/atrás).
  3. Obtener **`Get Control Rotation`**, hacer *Split Struct Pin* para quedarse únicamente con el ángulo **`Z (Yaw)`** y pasarlo a un **`Make Rotator`** (`Roll = 0`, `Pitch = 0`, `Yaw = Z`).
  4. De ese `Make Rotator`, sacar **`Get Forward Vector`** y **`Get Right Vector`**.
  5. Desde el pin **`Triggered`** de `IA_Move`, encadenar dos nodos **`Add Movement Input`**: el primero con `World Direction = Forward Vector` y `Scale Value = Action Value Y`; el segundo con `World Direction = Right Vector` y `Scale Value = Action Value X`.
  6. Colocar **`EnhancedInputAction IA_Look`** (`Axis2D`): desde su pin `Triggered`, llamar a **`Add Controller Yaw Input`** (`Val = Action Value X`) y **`Add Controller Pitch Input`** (`Val = Action Value Y`).

---

### Patrón 11: Flash Visual de Impacto o Cambio de Color en Runtime (Material Instance Dynamic — MID)
* **Objetivo:** Hacer que la malla de un enemigo o botón cambie de color o brille en rojo brevemente cuando recibe un impacto.
* **Nodos Implicados:** `Create Dynamic Material Instance`, `Set Vector Parameter Value`, `Set Scalar Parameter Value`, `Timeline` / `Retriggerable Delay`.
* **Pasos del Grafo:**
  1. En el Material del enemigo, crear un `ScalarParameter` llamado `HitFlashAlpha` (`0.0` por defecto) que interpola (`Lerp`) el color base hacia rojo emisivo.
  2. En el **`Construction Script`** (o `Event BeginPlay`) de `BP_Enemy`, tomar el componente de malla (`Mesh`) y llamar a **`Create Dynamic Material Instance`** (`Element Index = 0`). Promover el `Return Value` a una variable **`DynamicMat`** (`Material Instance Dynamic Object Reference`).
  3. Cuando el enemigo recibe daño (`Event AnyDamage`), tomar `DynamicMat` y llamar a **`Set Scalar Parameter Value`** (`Parameter Name = "HitFlashAlpha"`, `Value = 1.0`).
  4. Conectar a un **`Retriggerable Delay`** (`Duration = 0.15` segundos) —o a una `Timeline` corta que baje de `1.0` a `0.0`— y en su salida `Completed` volver a llamar a **`Set Scalar Parameter Value`** (`Parameter Name = "HitFlashAlpha"`, `Value = 0.0`).

---

### Patrón 12: Generación Procedural en Editor con Construction Script (ForLoop + Add Static Mesh Component)
* **Objetivo:** Crear un Blueprint (`BP_ProceduralFence`) que genere automáticamente una fila de $N$ postes o paneles de valla espaciados uniformemente en el propio Level Viewport mientras el diseñador ajusta una variable en el panel *Details* (patrón oficial del mapa *Blueprints_Advanced — Automatic Wall Example*).
* **Nodos Implicados:** `Construction Script`, `ForLoop`, `Multiply (Integer * Float)`, `Make Transform`, `Add Static Mesh Component`, `Set Static Mesh`.
* **Pasos del Grafo:**
  1. En `BP_ProceduralFence`, crear variables **`Instance Editable`**: `NumSegments` (`Integer = 5`), `Spacing` (`Float = 200.0`) y `SegmentMesh` (`Static Mesh Object Reference`).
  2. Abrir la pestaña **`Construction Script`**.
  3. Conectar el nodo de entrada `Construction Script` a un **`ForLoop`** con `First Index = 0` y `Last Index = NumSegments - 1`.
  4. Desde el pin **`Loop Body`**, multiplicar `Index * Spacing` para obtener el desplazamiento en `X`, construir un `Vector (X, 0, 0)` y pasarlo al pin `Location` de un **`Make Transform`**.
  5. Conectar el pulso de `Loop Body` a **`Add Static Mesh Component`** con `Manual Attachment = false` y `Relative Transform` conectado al `Make Transform`.
  6. Sobre el `Return Value` del componente recién creado, llamar a **`Set Static Mesh`** pasando la variable `SegmentMesh`.

---

### Patrón 13: Disparo de Proyectil Físico con Parámetros en Spawn (Expose on Spawn + ProjectileMovementComponent)
* **Objetivo:** Instanciar un proyectil (`BP_Projectile`) desde el cañón del arma pasando su daño e impulso inicial directamente en el nodo `Spawn Actor from Class`.
* **Nodos Implicados:** `ProjectileMovementComponent`, `Expose on Spawn`, `Get Socket Transform`, `Spawn Actor from Class`, `On Component Hit`, `Apply Damage`, `Destroy Actor`.
* **Pasos del Grafo:**
  1. En `BP_Projectile`, añadir un `SphereComponent` (Root), un `StaticMeshComponent` y un **`ProjectileMovementComponent`** (`Initial Speed = 3000`, `Max Speed = 3000`).
  2. Crear en `BP_Projectile` una variable `ProjectileDamage` (`Float = 20.0`) y activar en su panel *Details* tanto **`Instance Editable`** como **`Expose on Spawn`**.
  3. En `BP_Projectile`, añadir **`On Component Hit (SphereComponent)`** → comprobar que `Other Actor != Get Owner` → llamar a **`Apply Damage`** (`Damaged Actor = Other Actor`, `Base Damage = ProjectileDamage`) → **`Destroy Actor`**.
  4. En `BP_Weapon` (o `BP_Character`), al disparar: tomar `WeaponMesh` → **`Get Socket Transform`** (`Socket Name = "Muzzle"`).
  5. Llamar a **`Spawn Actor from Class`** seleccionando `Class = BP_Projectile`. Al seleccionar la clase, aparece automáticamente el pin de entrada **`Projectile Damage`** en el nodo `Spawn Actor from Class`. Conectar el transform del socket a `Spawn Transform`, `Self` a `Owner`/`Instigator` y el valor de daño calculado a `Projectile Damage`.

---

### Patrón 14: Menú de Pausa que Alterna Estado, Cursor y Modo de Entrada (FlipFlop + Set Game Paused + UMG)
* **Objetivo:** Al pulsar `Escape` o `P`, pausar el juego, mostrar el widget de pausa y habilitar el ratón; al volver a pulsar la misma tecla, ocultar el menú, ocultar el ratón y reanudar la partida.
* **Nodos Implicados:** `EnhancedInputAction IA_Pause`, `FlipFlop`, `Is Valid`, `Create Widget`, `Add to Viewport`, `Set Game Paused`, `Set Input Mode Game and UI`, `Set Input Mode Game Only`, `Set Show Mouse Cursor`, `Remove from Parent`.
* **Pasos del Grafo:**
  1. En `BP_PlayerController`, seleccionar el nodo `EnhancedInputAction IA_Pause` y en su panel *Details* activar **`Execute when Paused = true`** (imprescindible para que el input siga funcionando mientras el juego está en pausa).
  2. Conectar el pin `Started` de `IA_Pause` a un nodo **`FlipFlop`**.
  3. **Rama `A` (Pausar):**
     * Llamar a **`Create Widget`** (`Class = WBP_PauseMenu`), promover a variable `PauseMenuWidget` y llamar a **`Add to Viewport`**.
     * Llamar a **`Set Game Paused`** (`Paused = true`).
     * Llamar a **`Set Input Mode Game and UI`** (`In Widget to Focus = PauseMenuWidget`) y **`Set Show Mouse Cursor`** (`bShowMouseCursor = true`).
  4. **Rama `B` (Reanudar):**
     * Comprobar **`Is Valid`** sobre `PauseMenuWidget` y llamar a **`Remove from Parent`**.
     * Llamar a **`Set Game Paused`** (`Paused = false`).
     * Llamar a **`Set Input Mode Game Only`** y **`Set Show Mouse Cursor`** (`bShowMouseCursor = false`).

---

### Patrón 15: IA que Patrulla y Persigue al Jugador al Verlo (AIController + AIPerception + Blackboard + Behavior Tree)
* **Objetivo:** Un enemigo con `Behavior Tree` patrulla entre puntos aleatorios del `NavMesh`, pero en cuanto ve al jugador con su sentido de la vista (`AISense_Sight`) lo persigue hasta perderlo de vista (patrón oficial del *Behavior Tree Quick Start Guide* de UE 5.8).
* **Nodos Implicados:** `Event On Possess`, `Run Behavior Tree`, `On Target Perception Updated`, `Break AIStimulus`, `Get Blackboard`, `Set Value as Object`, `Set Value as Bool`, `Clear Value`, `GetRandomReachablePointInRadius`, `Finish Execute`.
* **Pasos del Grafo:**
  1. Crear el activo `BB_Enemy` (**Blackboard**) con tres claves: `TargetActor` (`Object`), `HasLineOfSight` (`Bool`) y `PatrolLocation` (`Vector`).
  2. En `BP_EnemyAIController`:
     * En **`Event On Possess`**: llamar a **`Run Behavior Tree`** (`BTAsset = BT_Enemy`).
     * Añadir un **`AIPerceptionComponent`** configurado con **`AI Sight config`**. Añadir su evento **`On Target Perception Updated (AIPerception)`** (entrega `Actor` y `Stimulus`).
     * Hacer **`Break AIStimulus`** sobre `Stimulus` y conectar el booleano `Successfully Sensed` a un **`Branch`**.
     * Si es `True` (acaba de ver al jugador): obtener **`Get Blackboard`** → llamar a **`Set Value as Bool`** (`Key Name = "HasLineOfSight"`, `Value = true`) y **`Set Value as Object`** (`Key Name = "TargetActor"`, `Value = Actor`).
     * Si es `False` (perdió de vista al jugador): llamar a **`Set Value as Bool`** (`"HasLineOfSight"`, `false`) y **`Clear Value`** (`"TargetActor"`).
  3. Crear una tarea Blueprint `BTT_FindRandomPatrol` (hija de `BTTask_BlueprintBase`):
     * En **`Event Receive Execute AI`** (`Owner Controller`, `Controlled Pawn`): tomar `Controlled Pawn` → `Get Actor Location` → llamar a **`GetRandomReachablePointInRadius`** (`Radius = 1500.0`).
     * Guardar el `Random Location` en el Blackboard con **`Set Blackboard Value as Vector`** (`Key = PatrolLocationKey`) y cerrar la tarea llamando a **`Finish Execute`** (`Success = true`).
  4. En el grafo del **`Behavior Tree` (`BT_Enemy`)**, conectar el `Root` a un **`Selector`** con dos ramas de izquierda a derecha:
     * **Rama Izquierda (Prioridad 1 — Perseguir):** Un `Sequence` con un **Decorator** `Blackboard Based Condition` (`HasLineOfSight Is Set` con `Observer Aborts = Lower Priority`) y la tarea nativa **`Move To`** apuntando a `TargetActor`.
     * **Rama Derecha (Prioridad 2 — Patrullar):** Un `Sequence` con las tareas `BTT_FindRandomPatrol` → **`Move To`** (`PatrolLocation`) → **`Wait`** (`2.0s`).

---

## 6. Límites de Blueprints: Qué SE PUEDE y Qué NO SE PUEDE Hacer Solo con Blueprints (y Por Qué se Pasa a C++)

Según la documentación oficial de UE 5.8 (**Coding in UE: Blueprint vs. C++**, **Blueprint Best Practices**, **Exposing C++ to Blueprints** y **Balancing Blueprint and C++**), Epic define con precisión la frontera entre ambos sistemas.

### 6.1. Qué SÍ se puede hacer 100% con Blueprints
* **Juegos completos y prototipos funcionales:** Es posible crear y empaquetar un proyecto entero de Unreal Engine usando exclusivamente Blueprints.
* **Lógica de gameplay guiada por eventos (*Event-Driven Gameplay*):** Respuesta a entradas (`Enhanced Input`), triggers de nivel, recepción de daño, recolección de objetos, diálogos, misiones, máquinas de estados simples y cinemáticas con `Sequencer`.
* **Composición de Actores y Prefabs dinámicos:** Combinar componentes visuales, físicos, de audio y de movimiento, y automatizar su configuración en el editor mediante el **Construction Script**.
* **Interfaces de Usuario completas:** Construcción y animación de menús y HUDs mediante **Widget Blueprints (UMG)**.
* **Orquestación de IA, Animación y VFX:** Conectar `Behavior Trees`, `Blackboards`, `Animation Blueprints`, `Material Instance Dynamics`, `Material Parameter Collections` y sistemas `Niagara`.
* **Herramientas de Editor:** Automatizar tareas de diseño y gestión de activos con **Editor Utility Blueprints** y **Editor Utility Widgets**.

### 6.2. Qué NO se puede hacer solo con Blueprints (Límites Técnicos Estrictos)
1. **Multihilo general (*Multi-threading*):** La documentación oficial de UE 5.8 (*Coding in UE: Blueprint vs. C++*) especifica explícitamente que **Blueprints no soporta multihilo** en su lógica de scripting general (el EventGraph se ejecuta siempre en el **Game Thread**; la única excepción parcial es la evaluación *thread-safe* restringida dentro del `AnimGraph` de un Animation Blueprint). No se pueden crear `FRunnable`, tareas asíncronas en hilos de trabajo (`AsyncTask` en *Worker Threads*) ni paralelizar bucles.
2. **Acceso a APIs del motor no expuestas a Reflexión (`UHT`):** Blueprints solo puede ver y llamar clases, funciones, propiedades y structs que hayan sido decorados explícitamente en C++ con macros del *Unreal Header Tool* (`UCLASS(BlueprintType, Blueprintable)`, `UFUNCTION(BlueprintCallable / BlueprintPure / BlueprintImplementableEvent)`, `UPROPERTY(BlueprintReadWrite / BlueprintReadOnly)`, `USTRUCT(BlueprintType)`). Subsistemas de bajo nivel del motor (renderizado RHI, física interna de Chaos a bajo nivel, sockets de red crudos, serialización binaria personalizada, `FArchive`, tipos `uint16`/`uint32`/`uint64` sin envolver) no son accesibles si no se exponen primero desde C++.
3. **Integración de librerías externas y SDKs de terceros:** Es imposible enlazar o consumir directamente librerías estáticas/dinámicas de C/C++ (`.lib`, `.dll`, `.so`), SDKs de plataformas o APIs del sistema operativo sin escribir un módulo o plugin puente en C++.
4. **Modificación de sistemas centrales o creación de módulos de motor:** Crear nuevos subsistemas de bajo nivel, modos de movimiento personalizados en `UCharacterMovementComponent` con predicción de red (`FSavedMove_Character`), o nodos personalizados de compilación Kismet (`UK2Node`) exige C++.
5. **Control de memoria de bajo nivel y estructuras de datos avanzadas:** Blueprints utiliza un modelo de memoria seguro gestionado para evitar cuelgues (*crashes*), por lo que no permite aritmética de punteros, gestión manual de memoria, plantillas genéricas (`templates`), sobrecarga de operadores ni algoritmos complejos sobre grandes volúmenes de datos contiguos en caché.

### 6.3. Por Qué los Equipos Pasan de Blueprints a C++ (Las 7 Razones Oficiales)
1. **Sobrecarga de la Máquina Virtual (Bytecode vs. Código Máquina Nativo):**
   * C++ compila directamente a código máquina ejecutado por la CPU.
   * Blueprints compila a **Bytecode** interpretado por la máquina virtual de Blueprints.
   * Como explica *Balancing Blueprint and C++*: **ejecutar cada nodo individual en Blueprint tiene un coste adicional respecto a una línea de C++, aunque una vez que la ejecución entra dentro de una función nativa de un nodo (como un Physics Trace), va igual de rápido que en C++**. Por tanto, los cuellos de botella severos en Blueprints aparecen cuando hay:
     * Muchos nodos ejecutándose en cada frame dentro de **`Event Tick`**.
     * **Bucles densos (`ForLoop` / `WhileLoop`)** o macros anidadas que se expanden a cientos de nodos.
     * Sistemas que actualizan cientos o miles de Actores simultáneamente (p. ej., un sistema de multitudes / *crowd system* de 1.000 agentes).
2. **Complejidad de Expresión y Escalabilidad Visual (*"Spaghetti Graphs"*):**
   * Las fórmulas matemáticas largas, la manipulación compleja de cadenas o estructuras de datos y las ramas condicionales profundas requieren decenas de nodos y cables cruzados que ocupan pantallas enteras, mientras que en un lenguaje textual ocupan pocas líneas legibles. Archivos grandes en texto escalan y se refactorizan mejor que grafos gigantescos.
3. **Colaboración y Control de Versiones (Binario vs. Texto):**
   * Los Blueprints se guardan como activos binarios (`.uasset`). Aunque Unreal incluye el **Unreal Diff Tool** para compararlos visualmente, **no se pueden fusionar (*merge*) automáticamente en Git/Perforce** como los archivos de texto, lo que obliga a bloquear archivos (*exclusive checkout*) para que dos desarrolladores no editen el mismo Blueprint a la vez.
4. **Diseño Explícito de APIs y Encapsulación:**
   * En C++, los ingenieros pueden ocultar la complejidad interna (`private`/`protected`) y exponer a los diseñadores únicamente una interfaz limpia y segura mediante especificadores (`BlueprintCallable`, `BlueprintReadOnly`, `BlueprintImplementableEvent`, `BlueprintNativeEvent`) y librerías estáticas (`UBlueprintFunctionLibrary`).
5. **Versionado de Datos y Guardado Avanzado:**
   * Como indica la documentación de `ULocalPlayerSaveGame`, para juegos complejos con múltiples actualizaciones se requiere heredar en C++ para implementar versionado y migración de datos serializados que Blueprint por sí solo no gestiona a bajo nivel.
6. **Herramientas de Depuración más Potentes:**
   * Aunque existe el **Blueprint Debugger** (con *Breakpoints* y *Watches* de pines), los depuradores nativos de C++ permiten inspeccionar la pila de llamadas completa del motor, registros de memoria, hilos concurrentes y volcados de crash (*crash dumps*).
7. **Flujo de Conversión en UE 5.8 (`Blueprint Header View` + `Core Redirects`):**
   * En UE 5.8, cuando un prototipo en Blueprint madura y pasa a C++, el desarrollador utiliza **Blueprint Header View** para autogenerar el archivo de cabecera `.h` con las declaraciones de variables y funciones del Blueprint, transcribe la implementación al `.cpp`, y utiliza **Core Redirects** para redirigir las referencias de activos existentes hacia la nueva clase C++ sin romper el proyecto.

---

## 7. Bibliografía Oficial (Documentación de Epic Games — UE 5.8)

Todas las fuentes listadas a continuación pertenecen a la documentación oficial de Epic Games para Unreal Engine 5.8 y han sido consultadas el **2026-11-19**:

1. **Blueprints Visual Scripting (Portal Principal UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
2. **Overview of Blueprints Visual Scripting in Unreal Engine / Blueprint Foundations (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-blueprints-visual-scripting-in-unreal-engine?application_version=5.8`  
   URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-foundations?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
3. **Anatomy of a Blueprint in Unreal Engine (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/anatomy-of-a-blueprint-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
4. **Basic Scripting with Blueprints in Unreal Engine (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/basic-scripting-with-blueprints-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
5. **Graph Editor for the Blueprints Visual Scripting Editor in Unreal Engine (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/graph-editor-for-the-blueprints-visual-scripting-editor-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
6. **Graphs in Unreal Engine (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/graphs-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
7. **Event Graph in Unreal Engine (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/event-graph-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
8. **Construction Script in Unreal Engine (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/construction-script-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
9. **Components Window in Unreal Engine (UE 5.8)**  
   URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/components-window-in-unreal-engine?application_version=5.8`  
   *Fecha de consulta:* 2026-11-19
10. **Nodes in Unreal Engine & Placing Nodes in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/nodes-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/placing-nodes-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
11. **Blueprint Variables in Unreal Engine & Blueprint Struct Variables (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-variables-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-struct-variables-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
12. **Functions in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/functions-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
13. **Macros in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/macros-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
14. **Events in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/events-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
15. **Flow Control in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/flow-control-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
16. **Blueprint Communication Usage & How To Use Blueprint Communications (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-communication-usage-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-communications-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
17. **Actor Communication & Calling Event Dispatchers in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-communication-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/calling-event-dispatchers-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
18. **Implementing Blueprint Interfaces in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/implementing-blueprint-interfaces-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
19. **Timelines, Creating Timelines & Editing Timelines in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/timelines-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-timelines-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/editing-timelines-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
20. **Unreal Engine Actor Lifecycle & Spawning Actors in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-actor-lifecycle?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/spawning-actors-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/spawning-and-destroying-unreal-engine-actors?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
21. **Gameplay Timers & Designer 07 Traps and Damage in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-timers-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-07-traps-and-damage-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
22. **Enhanced Input in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
23. **Creating Widgets & UMG UI Designer Quick Start Guide in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-widgets-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-ui-designer-quick-start-guide-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
24. **Traces in Unreal Engine - Overview & Using a Single Line Trace (Raycast) by Channel (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/traces-in-unreal-engine---overview?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/using-a-single-line-trace-raycast-by-channel-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
25. **Behavior Tree in Unreal Engine - Overview (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---overview?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
26. **Using Material Parameter Collections & Material Parameter Expressions in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/using-material-parameter-collections-in-unreal-engine?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/material-parameter-expressions-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
27. **Graphing in Animation Blueprints in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/graphing-in-animation-blueprints-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
28. **Blueprint Best Practices in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-best-practices-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
29. **Coding in Unreal Engine: Blueprint vs. C++ & Exposing C++ to Blueprints (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus?application_version=5.8`  
    URL complementaria: `https://dev.epicgames.com/documentation/en-us/unreal-engine/exposing-cplusplus-to-blueprints-visual-scripting-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
30. **Compiler Overview for Blueprints Visual Scripting in Unreal Engine (UE 5.8)**  
    URL: `https://dev.epicgames.com/documentation/en-us/unreal-engine/compiler-overview-for-blueprints-visual-scripting-in-unreal-engine?application_version=5.8`  
    *Fecha de consulta:* 2026-11-19
