# Rustlings: 22_clippy

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/22_clippy> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Clippy

The Clippy tool is a collection of lints to analyze your code so you can catch common mistakes and improve your Rust code.

If you used the installation script for Rustlings, Clippy should be already installed.
If not you can install it manually via `rustup component add clippy`.

## Further information

- [GitHub Repository](https://github.com/rust-lang/rust-clippy).


## clippy1

```rust
// The Clippy tool is a collection of lints to analyze your code so you can
// catch common mistakes and improve your Rust code.
//
// For these exercises, the code will fail to compile when there are Clippy
// warnings. Check Clippy's suggestions from the output to solve the exercise.

fn main() {
    // TODO: Fix the Clippy lint in this line.
    let pi = 3.14;
    let radius: f32 = 5.0;

    let area = pi * radius.powi(2);

    println!("The area of a circle with radius {radius:.2} is {area:.5}");
}
```

<details><summary>Official hint</summary>

Rust stores the highest precision version of some long or infinite precision
mathematical constants in the Rust standard library:
https://doc.rust-lang.org/stable/std/f32/consts/index.html

We may be tempted to use our own approximations for certain mathematical
constants, but clippy recognizes those imprecise mathematical constants as a
source of potential error.

See the suggestions of the Clippy warning in the compile output and use the
appropriate replacement constant from `std::f32::consts`.

</details>

<details><summary>Official solution</summary>

```rust
// The Clippy tool is a collection of lints to analyze your code so you can
// catch common mistakes and improve your Rust code.
//
// For these exercises, the code will fail to compile when there are Clippy
// warnings. Check Clippy's suggestions from the output to solve the exercise.

use std::f32::consts::PI;

fn main() {
    // Use the more accurate `PI` constant.
    let pi = PI;
    let radius: f32 = 5.0;

    let area = pi * radius.powi(2);

    println!("The area of a circle with radius {radius:.2} is {area:.5}");
}
```

</details>

## clippy2

```rust
fn main() {
    let mut res = 42;
    let option = Some(12);
    // TODO: Fix the Clippy lint.
    for x in option {
        res += x;
    }

    println!("{res}");
}
```

<details><summary>Official hint</summary>

`for` loops over `Option` values are more clearly expressed as an `if-let`
statement.

Not required to solve this exercise, but if you are interested in when iterating
over `Option` can be useful, read the following section in the documentation:
https://doc.rust-lang.org/std/option/#iterating-over-option

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    let mut res = 42;
    let option = Some(12);
    // Use `if-let` instead of iteration.
    if let Some(x) = option {
        res += x;
    }

    println!("{res}");
}
```

</details>

## clippy3

```rust
// Here are some more easy Clippy fixes so you can see its utility.
// TODO: Fix all the Clippy lints.

#[allow(unused_variables, unused_assignments)]
fn main() {
    let my_option: Option<&str> = None;
    // Assume that you don't know the value of `my_option`.
    // In the case of `Some`, we want to print its value.
    if my_option.is_none() {
        println!("{}", my_option.unwrap());
    }

    #[rustfmt::skip]
    let my_arr = &[
        -1, -2, -3
        -4, -5, -6
    ];
    println!("My array! Here it is: {my_arr:?}");

    let mut my_vec = vec![1, 2, 3, 4, 5];
    my_vec.resize(0, 5);
    println!("This Vec is empty, see? {my_vec:?}");

    let mut value_a = 45;
    let mut value_b = 66;
    // Let's swap these two!
    value_a = value_b;
    value_b = value_a;
    println!("value a: {value_a}; value b: {value_b}");
}
```

<details><summary>Official hint</summary>

No hints this time!

</details>

<details><summary>Official solution</summary>

```rust
use std::mem;

#[allow(unused_variables, unused_assignments)]
fn main() {
    let my_option: Option<&str> = None;
    // `unwrap` of an `Option` after checking if it is `None` will panic.
    // Use `if-let` instead.
    if let Some(value) = my_option {
        println!("{value}");
    }

    // A comma was missing.
    #[rustfmt::skip]
    let my_arr = &[
        -1, -2, -3,
        -4, -5, -6,
    ];
    println!("My array! Here it is: {my_arr:?}");

    let mut my_vec = vec![1, 2, 3, 4, 5];
    // `resize` mutates a vector instead of returning a new one.
    // `resize(0, …)` clears a vector, so it is better to use `clear`.
    my_vec.clear();
    println!("This Vec is empty, see? {my_vec:?}");

    let mut value_a = 45;
    let mut value_b = 66;
    // Use `mem::swap` to correctly swap two values.
    mem::swap(&mut value_a, &mut value_b);
    println!("value a: {value_a}; value b: {value_b}");
}
```

</details>
