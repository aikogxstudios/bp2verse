---
name: bp2verse-verse
description: >-
  Reglas y referencias verificadas para escribir o revisar código Verse en
  bp2verse sin inventar sintaxis. Usar al redactar, editar o auditar snippets
  Verse en lecciones, playground o documentación.
---

# Verse sin inventar (`bp2verse-verse`)

## Fuentes oficiales y advertencia de versión

- **UEFN Verse Language Reference:** `https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference`
- **Verse API Reference:** `https://dev.epicgames.com/documentation/en-us/uefn/verse-api`
- **Book of Verse:** `https://verselang.github.io/book/` (`https://github.com/verselang/book`)

> **Regla crítica:** la rama principal del Book of Verse puede ir por delante de UEFN e incluir sintaxis o efectos `unreleased`. Si una característica del Book no se confirma en la Language/API Reference de UEFN o en `verse-js`, márcala `[NO VERIFICADO]`.

## Trampas verificadas (errores frecuentes al migrar desde Blueprints)

1. **`guard` es palabra reservada:** no uses `guard` como nombre de variable, clase o parámetro — verificado empíricamente en `verse-js` 0.1.1 (el checker lo rechaza como identificador); usa `E`, `Enemy`, etc. (dentro de un string literal `"Guard down"` sí es válido).
2. **Llamadas `<decides>` con corchetes `[]`:** solo las **llamadas a funciones `<decides>`** usan `[]` (p. ej. `ValidateAge[42]`, nunca `()`); la indexación de arrays/maps (`Array[Index]`), las consultas `Opt?` y las comparaciones fallables no llevan esa notación (se usan dentro de un failure context).
3. **`var` exige tipo explícito:** `var Health : int = 100` (no `var Health := 100`). Para reasignar usa `set Health = ...`; sin `set`, `=` es comparación.
4. **`logic` en condiciones con `?`:** para comprobar verdad sobre una variable `logic`, usa `if (IsOpen?):` dentro del failure context.
5. **Opcionalidad `?T` con `?`:** no existe `null`. Empaqueta con `option{42}`, representa ausencia con `false` y desenvuelve con `if (V := Opt?):`.
6. **Fallo transaccional (`rollback`):** el fallo no es excepción ni `null`. Si un paso falla dentro de un failure context, las mutaciones especulativas previas de esa vía se deshacen automáticamente.
7. **Efectos en firma:** `<computes>`, `<transacts>`, `<decides>`, `<allocates>` y `<suspends>` no son intercambiables. En UEFN, `<decides>` requiere `<transacts>` y no se combina con `<suspends>`.
8. **División de `int` es failable:** `A / B` entre enteros puede fallar y produce `rational`; para división entera usa `Quotient[A, B]`.
9. **`weak_map` no itera:** `weak_map(K, V)` no permite bucle `for` ni `.Length`; solo lectura/escritura por clave individual (patrón de persistence con `player` o `session`).

## 3 snippets verificados en `verse-js` (`0.1.1`)

### 1. `hello`

```verse
Print("Hello from Verse")
```

Salida esperada: `["Hello from Verse"]`

### 2. Clase `enemy`

```verse
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

Salida esperada: `["Guard down"]`

### 3. `ValidateAge` (`<decides>`)

```verse
ValidateAge(Age : int)<decides><transacts> : int =
    Age >= 0
    Age <= 150
    Age

if (A := ValidateAge[42]):
    Print("ok {A}")
if (B := ValidateAge[200]):
    Print("bad {B}")
else:
    Print("rejected")
```

Salida esperada: `["ok 42", "rejected"]`

## Checklist antes de dar por válido un snippet

- [ ] ¿Ejecutado en `verse-js` (cuando corre en navegador) con salida exacta comprobada?
- [ ] ¿Confirmado en fuente oficial (UEFN Language Reference / API / Book of Verse)?
- [ ] ¿Marcado `run: "uefn-only"` si usa APIs de dispositivos/Scene Graph, o `[NO VERIFICADO]` si falta fuente primaria?
