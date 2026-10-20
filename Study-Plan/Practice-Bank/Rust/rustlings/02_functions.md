# Rustlings: 02_functions

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/02_functions> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Functions

Here, you'll learn how to write functions and how the Rust compiler can help you debug errors even
in more complex code.

## Further information

- [How Functions Work](https://doc.rust-lang.org/book/ch03-03-how-functions-work.html)


## functions1

```rust
// TODO: Add some function with the name `call_me` without arguments or a return value.

fn main() {
    call_me(); // Don't change this line
}
```

<details><summary>Official hint</summary>

This `main` function is calling a function that it expects to exist, but the
function doesn't exist. It expects this function to have the name `call_me`.
It also expects this function to not take any arguments and not return a value.
Sounds a lot like `main`, doesn't it?

</details>

<details><summary>Official solution</summary>

```rust
// Some function with the name `call_me` without arguments or a return value.
fn call_me() {
    println!("Hello world!");
}

fn main() {
    call_me();
}
```

</details>

## functions2

```rust
// TODO: Add the missing type of the argument `num` after the colon `:`.
fn call_me(num:) {
    for i in 0..num {
        println!("Ring! Call number {}", i + 1);
    }
}

fn main() {
    call_me(3);
}
```

<details><summary>Official hint</summary>

Rust requires that all parts of a function's signature have type annotations,
but `call_me` is missing the type annotation of `num`.

</details>

<details><summary>Official solution</summary>

```rust
// The type of function arguments must be annotated.
// Added the type annotation `u64`.
fn call_me(num: u64) {
    for i in 0..num {
        println!("Ring! Call number {}", i + 1);
    }
}

fn main() {
    call_me(3);
}
```

</details>

## functions3

```rust
fn call_me(num: u8) {
    for i in 0..num {
        println!("Ring! Call number {}", i + 1);
    }
}

fn main() {
    // TODO: Fix the function call.
    call_me();
}
```

<details><summary>Official hint</summary>

This time, the function *declaration* is okay, but there's something wrong
with the place where we are calling the function.

</details>

<details><summary>Official solution</summary>

```rust
fn call_me(num: u8) {
    for i in 0..num {
        println!("Ring! Call number {}", i + 1);
    }
}

fn main() {
    // `call_me` expects an argument.
    call_me(5);
}
```

</details>

## functions4

```rust
// This store is having a sale where if the price is an even number, you get 10
// Rustbucks off, but if it's an odd number, it's 3 Rustbucks off.
// Don't worry about the function bodies themselves, we are only interested in
// the signatures for now.

fn is_even(num: i64) -> bool {
    num % 2 == 0
}

// TODO: Fix the function signature.
fn sale_price(price: i64) -> {
    if is_even(price) {
        price - 10
    } else {
        price - 3
    }
}

fn main() {
    let original_price = 51;
    println!("Your sale price is {}", sale_price(original_price));
}
```

<details><summary>Official hint</summary>

The error message points to the function `sale_price` and says it expects a type
after `->`. This is where the function's return type should be.
Take a look at the `is_even` function for an example!

</details>

<details><summary>Official solution</summary>

```rust
fn is_even(num: i64) -> bool {
    num % 2 == 0
}

// The return type must always be annotated.
fn sale_price(price: i64) -> i64 {
    if is_even(price) {
        price - 10
    } else {
        price - 3
    }
}

fn main() {
    let original_price = 51;
    println!("Your sale price is {}", sale_price(original_price));
}
```

</details>

## functions5

```rust
// TODO: Fix the function body without changing the signature.
fn square(num: i32) -> i32 {
    num * num;
}

fn main() {
    let answer = square(3);
    println!("The square of 3 is {answer}");
}
```

<details><summary>Official hint</summary>

This is a really common error that can be fixed by removing one character.
It happens because Rust distinguishes between expressions and statements:
Expressions return a value based on their operand(s), and statements simply
return a `()` type which behaves just like `void` in C/C++.

We want to return a value with the type `i32` from the `square` function, but
it is returning the type `()`.

There are two solutions:
1. Add the `return` keyword before `num * num;`
2. Remove the semicolon `;` after `num * num`

</details>

<details><summary>Official solution</summary>

```rust
fn square(num: i32) -> i32 {
    // Removed the semicolon `;` at the end of the line below to implicitly return the result.
    num * num
}

fn main() {
    let answer = square(3);
    println!("The square of 3 is {answer}");
}
```

</details>
