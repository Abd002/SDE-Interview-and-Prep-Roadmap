# Rustlings: 01_variables

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/01_variables> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Variables

In Rust, variables are immutable by default.
When a variable is immutable, once a value is bound to a name, you can't change that value.
You can make them mutable by adding `mut` in front of the variable name.

## Further information

- [Variables and Mutability](https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html)


## variables1

```rust
fn main() {
    // TODO: Add the missing keyword.
    x = 5;

    println!("x has the value {x}");
}
```

<details><summary>Official hint</summary>

The declaration in the `main` function is missing a keyword that is needed
in Rust to create a new variable binding.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // Declaring variables requires the `let` keyword.
    let x = 5;

    println!("x has the value {x}");
}
```

</details>

## variables2

```rust
fn main() {
    // TODO: Change the line below to fix the compiler error.
    let x;

    if x == 10 {
        println!("x is ten!");
    } else {
        println!("x is not ten!");
    }
}
```

<details><summary>Official hint</summary>

The compiler message is saying that Rust can't infer the type that the
variable binding `x` has with what is given here.

What happens if you annotate the first line in the `main` function with a type
annotation?

What if you give `x` a value?

What if you do both?

What type should `x` be, anyway?

What if `x` is the same type as `10`? What if it's a different type?

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // The easiest way to fix the compiler error is to initialize the
    // variable `x`. By setting its value to an integer, Rust infers its type
    // as `i32` which is the default type for integers.
    let x = 42;

    // But we can enforce a type different from the default `i32` by adding
    // a type annotation:
    // let x: u8 = 42;

    if x == 10 {
        println!("x is ten!");
    } else {
        println!("x is not ten!");
    }
}
```

</details>

## variables3

```rust
fn main() {
    // TODO: Change the line below to fix the compiler error.
    let x: i32;

    println!("Number {x}");
}
```

<details><summary>Official hint</summary>

In this exercise, we have a variable binding that we've created in the `main`
function, and we're trying to use it in the next line, but we haven't given it
a value.

We can't print out something that isn't there; try giving `x` a value!

This is an error that can cause bugs that's very easy to make in any
programming language -- thankfully the Rust compiler has caught this for us!

</details>

<details><summary>Official solution</summary>

```rust
#![allow(clippy::needless_late_init)]

fn main() {
    // Reading uninitialized variables isn't allowed in Rust!
    // Therefore, we need to assign a value first.
    let x: i32 = 42;

    println!("Number {x}");

    // It is possible to declare a variable and initialize it later.
    // But it can't be used before initialization.
    let y: i32;
    y = 42;
    println!("Number {y}");
}
```

</details>

## variables4

```rust
// TODO: Fix the compiler error.
fn main() {
    let x = 3;
    println!("Number {x}");

    x = 5; // Don't change this line
    println!("Number {x}");
}
```

<details><summary>Official hint</summary>

In Rust, variable bindings are immutable by default. But here, we're trying
to reassign a different value to `x`! There's a keyword we can use to make
a variable binding mutable instead.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // In Rust, variables are immutable by default.
    // Adding the `mut` keyword after `let` makes the declared variable mutable.
    let mut x = 3;
    println!("Number {x}");

    x = 5;
    println!("Number {x}");
}
```

</details>

## variables5

```rust
fn main() {
    let number = "T-H-R-E-E"; // Don't change this line
    println!("Spell a number: {number}");

    // TODO: Fix the compiler error by changing the line below without renaming the variable.
    number = 3;
    println!("Number plus two is: {}", number + 2);
}
```

<details><summary>Official hint</summary>

In `variables4` we already learned how to make an immutable variable mutable
using a special keyword. Unfortunately this doesn't help us much in this
exercise because we want to assign a different typed value to an existing
variable. Sometimes you may also like to reuse existing variable names because
you are just converting values to different types like in this exercise.

Fortunately Rust has a powerful solution to this problem: 'Shadowing'!
You can read more about 'Shadowing' in the book's section 'Variables and
Mutability':
https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html#shadowing

Try to solve this exercise afterwards using this technique.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    let number = "T-H-R-E-E";
    println!("Spell a number: {number}");

    // Using variable shadowing
    // https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html#shadowing
    let number = 3;
    println!("Number plus two is: {}", number + 2);
}
```

</details>

## variables6

```rust
// TODO: Change the line below to fix the compiler error.
const NUMBER = 3;

fn main() {
    println!("Number: {NUMBER}");
}
```

<details><summary>Official hint</summary>

We know about variables and mutability, but there is another important type of
variable available: constants.

Constants are always immutable. They are declared with the keyword `const`
instead of `let`.

The type of Constants must always be annotated.

Read more about constants and the differences between variables and constants
under 'Constants' in the book's section 'Variables and Mutability':
https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html#constants

</details>

<details><summary>Official solution</summary>

```rust
// The type of constants must always be annotated.
const NUMBER: u64 = 3;

fn main() {
    println!("Number: {NUMBER}");
}
```

</details>
