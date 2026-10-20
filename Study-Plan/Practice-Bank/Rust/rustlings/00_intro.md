# Rustlings: 00_intro

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/00_intro> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Intro

Rust uses the `print!` and `println!` macros to print text to the console.

## Further information

- [Hello World](https://doc.rust-lang.org/rust-by-example/hello.html)
- [Formatted print](https://doc.rust-lang.org/rust-by-example/hello/print.html)


## intro1

```rust
// TODO: We sometimes encourage you to keep trying things on a given exercise
// even after you already figured it out. If you got everything working and feel
// ready for the next exercise, enter `n` in the terminal.
//
// The exercise file will be reloaded when you change one of the lines below!
// Try adding a new `println!` and check the updated output in the terminal.

fn main() {
    println!(r#"       Welcome to...                      "#);
    println!(r#"                 _   _ _                  "#);
    println!(r#"  _ __ _   _ ___| |_| (_)_ __   __ _ ___  "#);
    println!(r#" | '__| | | / __| __| | | '_ \ / _` / __| "#);
    println!(r#" | |  | |_| \__ \ |_| | | | | | (_| \__ \ "#);
    println!(r#" |_|   \__,_|___/\__|_|_|_| |_|\__, |___/ "#);
    println!(r#"                               |___/      "#);
    println!();
    println!("This exercise compiles successfully. The remaining exercises contain a compiler");
    println!("or logic error. The central concept behind Rustlings is to fix these errors and");
    println!("solve the exercises. Good luck!");
    println!();
    println!("The file of this exercise is `exercises/00_intro/intro1.rs`. Have a look!");
    println!("The current exercise path will be always shown under the progress bar.");
    println!("You can click on the path to open the exercise file in your editor.");
}
```

<details><summary>Official hint</summary>

Enter `n` to move on to the next exercise.
You might need to press ENTER after typing `n`.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // Congratulations, you finished the first exercise 🎉
    // As an introduction to Rustlings, the first exercise only required
    // entering `n` in the terminal to go to the next exercise.
}
```

</details>

## intro2

```rust
fn main() {
    // TODO: Fix the code to print "Hello world!".
    printline!("Hello world!");
}
```

<details><summary>Official hint</summary>

The compiler is informing us that we've got the name of the print macro wrong.
It also suggests an alternative.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // `println!` instead of `printline!`.
    println!("Hello world!");
}
```

</details>
