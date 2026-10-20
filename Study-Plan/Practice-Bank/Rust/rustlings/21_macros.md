# Rustlings: 21_macros

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/21_macros> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Macros

Rust's macro system is very powerful, but also kind of difficult to wrap your
head around. We're not going to teach you how to write your own fully-featured
macros. Instead, we'll show you how to use and create them.

If you'd like to learn more about writing your own macros, the
[macrokata](https://github.com/tfpk/macrokata) project has a similar style
of exercises to Rustlings, but is all about learning to write Macros.

## Further information

- [The Rust Book - Macros](https://doc.rust-lang.org/book/ch20-05-macros.html)
- [The Little Book of Rust Macros](https://veykril.github.io/tlborm/)
- [Rust by Example - macro_rules!](https://doc.rust-lang.org/rust-by-example/macros.html)


## macros1

```rust
macro_rules! my_macro {
    () => {
        println!("Check out my macro!");
    };
}

fn main() {
    // TODO: Fix the macro call.
    my_macro();
}
```

<details><summary>Official hint</summary>

When you call a macro, you need to add something special compared to a regular
function call.

</details>

<details><summary>Official solution</summary>

```rust
macro_rules! my_macro {
    () => {
        println!("Check out my macro!");
    };
}

fn main() {
    my_macro!();
    //      ^
}
```

</details>

## macros2

```rust
fn main() {
    my_macro!();
}

// TODO: Fix the compiler error by moving the whole definition of this macro.
macro_rules! my_macro {
    () => {
        println!("Check out my macro!");
    };
}
```

<details><summary>Official hint</summary>

Macros don't quite play by the same rules as the rest of Rust, in terms of
what's available where.

Unlike other things in Rust, the order of "where you define a macro" versus
"where you use it" actually matters.

</details>

<details><summary>Official solution</summary>

```rust
// Moved the macro definition to be before its call.
macro_rules! my_macro {
    () => {
        println!("Check out my macro!");
    };
}

fn main() {
    my_macro!();
}
```

</details>

## macros3

```rust
// TODO: Fix the compiler error without taking the macro definition out of this
// module.
mod macros {
    macro_rules! my_macro {
        () => {
            println!("Check out my macro!");
        };
    }
}

fn main() {
    my_macro!();
}
```

<details><summary>Official hint</summary>

In order to use a macro outside of its module, you need to do something
special to the module to lift the macro out into its parent.

</details>

<details><summary>Official solution</summary>

```rust
// Added the `macro_use` attribute.
#[macro_use]
mod macros {
    macro_rules! my_macro {
        () => {
            println!("Check out my macro!");
        };
    }
}

fn main() {
    my_macro!();
}
```

</details>

## macros4

```rust
// TODO: Fix the compiler error by adding one or two characters.
#[rustfmt::skip]
macro_rules! my_macro {
    () => {
        println!("Check out my macro!");
    }
    ($val:expr) => {
        println!("Look at this other macro: {}", $val);
    }
}

fn main() {
    my_macro!();
    my_macro!(7777);
}
```

<details><summary>Official hint</summary>

You only need to add a single character to make this compile.

The way macros are written, it wants to see something between each "macro arm",
so it can separate them.

That's all the macro exercises we have in here, but it's barely even scratching
the surface of what you can do with Rust's macros. For a more thorough
introduction, you can have a read through 'The Little Book of Rust Macros':
https://veykril.github.io/tlborm/

</details>

<details><summary>Official solution</summary>

```rust
// Added semicolons to separate the macro arms.
#[rustfmt::skip]
macro_rules! my_macro {
    () => {
        println!("Check out my macro!");
    };
    ($val:expr) => {
        println!("Look at this other macro: {}", $val);
    };
}

fn main() {
    my_macro!();
    my_macro!(7777);
}
```

</details>
