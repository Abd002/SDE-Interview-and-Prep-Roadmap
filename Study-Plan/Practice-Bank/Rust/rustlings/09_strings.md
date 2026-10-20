# Rustlings: 09_strings

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/09_strings> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Strings

Rust has two string types: a string slice (`&str`) and an owned string (`String`).
We're not going to dictate when you should use which one, but we'll show you how
to identify and create them, as well as use them.

## Further information

- [Strings (Rust Book)](https://doc.rust-lang.org/book/ch08-02-strings.html)
- [`str` methods](https://doc.rust-lang.org/std/primitive.str.html)
- [`String` methods](https://doc.rust-lang.org/std/string/struct.String.html)


## strings1

```rust
// TODO: Fix the compiler error without changing the function signature.
fn current_favorite_color() -> String {
    "blue"
}

fn main() {
    let answer = current_favorite_color();
    println!("My current favorite color is {answer}");
}
```

<details><summary>Official hint</summary>

The `current_favorite_color` function is currently returning a string slice
with the `'static` lifetime. We know this because the data of the string lives
in our code itself -- it doesn't come from a file or user input or another
program -- so it will live as long as our program lives.

But it is still a string slice. There's one way to create a `String` by
converting a string slice covered in the Strings chapter of the book, and
another way that uses the `From` trait.

</details>

<details><summary>Official solution</summary>

```rust
fn current_favorite_color() -> String {
    // Equivalent to `String::from("blue")`
    "blue".to_string()
}

fn main() {
    let answer = current_favorite_color();
    println!("My current favorite color is {answer}");
}
```

</details>

## strings2

```rust
// TODO: Fix the compiler error in the `main` function without changing this function.
fn is_a_color_word(attempt: &str) -> bool {
    attempt == "green" || attempt == "blue" || attempt == "red"
}

fn main() {
    let word = String::from("green"); // Don't change this line.

    if is_a_color_word(word) {
        println!("That is a color word I know!");
    } else {
        println!("That is not a color word I know.");
    }
}
```

<details><summary>Official hint</summary>

Yes, it would be really easy to fix this by just changing the value bound to
`word` to be a string slice instead of a `String`, wouldn't it? There is a way
to add one character to the `if` statement, though, that will coerce the
`String` into a string slice.

Side note: If you're interested in learning about how this kind of reference
conversion works, you can jump ahead in the book and read this part in the
smart pointers chapter:
https://doc.rust-lang.org/book/ch15-02-deref.html#implicit-deref-coercions-with-functions-and-methods

</details>

<details><summary>Official solution</summary>

```rust
fn is_a_color_word(attempt: &str) -> bool {
    attempt == "green" || attempt == "blue" || attempt == "red"
}

fn main() {
    let word = String::from("green");

    if is_a_color_word(&word) {
        //             ^ added to have `&String` which is automatically
        //               coerced to `&str` by the compiler.
        println!("That is a color word I know!");
    } else {
        println!("That is not a color word I know.");
    }
}
```

</details>

## strings3

```rust
fn trim_me(input: &str) -> &str {
    // TODO: Remove whitespace from both ends of a string.
}

fn compose_me(input: &str) -> String {
    // TODO: Add " world!" to the string! There are multiple ways to do this.
}

fn replace_me(input: &str) -> String {
    // TODO: Replace "cars" in the string with "balloons".
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trim_a_string() {
        assert_eq!(trim_me("Hello!     "), "Hello!");
        assert_eq!(trim_me("  What's up!"), "What's up!");
        assert_eq!(trim_me("   Hola!  "), "Hola!");
        assert_eq!(trim_me("Hi!"), "Hi!");
    }

    #[test]
    fn compose_a_string() {
        assert_eq!(compose_me("Hello"), "Hello world!");
        assert_eq!(compose_me("Goodbye"), "Goodbye world!");
    }

    #[test]
    fn replace_a_string() {
        assert_eq!(
            replace_me("I think cars are cool"),
            "I think balloons are cool",
        );
        assert_eq!(
            replace_me("I love to look at cars"),
            "I love to look at balloons",
        );
    }
}
```

<details><summary>Official hint</summary>

There are many useful standard library functions for strings. Let's try and use
some of them:
https://doc.rust-lang.org/std/string/struct.String.html#method.trim

For the `compose_me` method: You can either use the `format!` macro, or convert
the string slice into an owned string, which you can then freely extend.

For the `replace_me` method, you can check out the `replace` method:
https://doc.rust-lang.org/std/string/struct.String.html#method.replace

</details>

<details><summary>Official solution</summary>

```rust
fn trim_me(input: &str) -> &str {
    input.trim()
}

fn compose_me(input: &str) -> String {
    // The macro `format!` has the same syntax as `println!`, but it returns a
    // string instead of printing it to the terminal.
    // Equivalent to `input.to_string() + " world!"`
    format!("{input} world!")
}

fn replace_me(input: &str) -> String {
    input.replace("cars", "balloons")
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trim_a_string() {
        assert_eq!(trim_me("Hello!     "), "Hello!");
        assert_eq!(trim_me("  What's up!"), "What's up!");
        assert_eq!(trim_me("   Hola!  "), "Hola!");
        assert_eq!(trim_me("Hi!"), "Hi!");
    }

    #[test]
    fn compose_a_string() {
        assert_eq!(compose_me("Hello"), "Hello world!");
        assert_eq!(compose_me("Goodbye"), "Goodbye world!");
    }

    #[test]
    fn replace_a_string() {
        assert_eq!(
            replace_me("I think cars are cool"),
            "I think balloons are cool",
        );
        assert_eq!(
            replace_me("I love to look at cars"),
            "I love to look at balloons",
        );
    }
}
```

</details>

## strings4

```rust
// Calls of this function should be replaced with calls of `string_slice` or `string`.
fn placeholder() {}

fn string_slice(arg: &str) {
    println!("{arg}");
}

fn string(arg: String) {
    println!("{arg}");
}

// TODO: Here are a bunch of values - some are `String`, some are `&str`.
// Your task is to replace `placeholder(…)` with either `string_slice(…)`
// or `string(…)` depending on what you think each value is.
fn main() {
    placeholder("blue");

    placeholder("red".to_string());

    placeholder(String::from("hi"));

    placeholder("rust is fun!".to_owned());

    placeholder(format!("Interpolation {}", "Station"));

    // WARNING: This is byte indexing, not character indexing.
    // Character indexing can be done using `s.chars().nth(INDEX)`.
    placeholder(&String::from("abc")[0..1]);

    placeholder("  hello there ".trim());

    placeholder("Happy Monday!".replace("Mon", "Tues"));

    placeholder("mY sHiFt KeY iS sTiCkY".to_lowercase());
}
```

<details><summary>Official hint</summary>

Replace `placeholder` with either `string` or `string_slice` in the `main`
function.

Example:
`placeholder("blue");`
should become
`string_slice("blue");`
because "blue" is `&str`, not `String`.

</details>

<details><summary>Official solution</summary>

```rust
fn string_slice(arg: &str) {
    println!("{arg}");
}

fn string(arg: String) {
    println!("{arg}");
}

fn main() {
    string_slice("blue");

    string("red".to_string());

    string(String::from("hi"));

    string("rust is fun!".to_owned());

    string(format!("Interpolation {}", "Station"));

    // WARNING: This is byte indexing, not character indexing.
    // Character indexing can be done using `s.chars().nth(INDEX)`.
    string_slice(&String::from("abc")[0..1]);

    string_slice("  hello there ".trim());

    string("Happy Monday!".replace("Mon", "Tues"));

    string("mY sHiFt KeY iS sTiCkY".to_lowercase());
}
```

</details>
