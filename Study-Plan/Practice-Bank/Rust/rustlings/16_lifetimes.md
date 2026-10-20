# Rustlings: 16_lifetimes

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/16_lifetimes> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Lifetimes

Lifetimes tell the compiler how to check whether references live long
enough to be valid in any given situation. For example lifetimes say
"make sure parameter 'a' lives as long as parameter 'b' so that the return
value is valid".

They are only necessary on borrows, i.e. references,
since copied parameters or moves are owned in their scope and cannot
be referenced outside. Lifetimes mean that calling code of e.g. functions
can be checked to make sure their arguments are valid. Lifetimes are
restrictive of their callers.

If you'd like to learn more about lifetime annotations, the
[lifetimekata](https://tfpk.github.io/lifetimekata/) project
has a similar style of exercises to Rustlings, but is all about
learning to write lifetime annotations.

## Further information

- [Lifetimes (in Rust By Example)](https://doc.rust-lang.org/stable/rust-by-example/scope/lifetime.html)
- [Validating References with Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)


## lifetimes1

```rust
// The Rust compiler needs to know how to check whether supplied references are
// valid, so that it can let the programmer know if a reference is at risk of
// going out of scope before it is used. Remember, references are borrows and do
// not own their own data. What if their owner goes out of scope?

// TODO: Fix the compiler error by updating the function signature.
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_longest() {
        assert_eq!(longest("abcd", "123"), "abcd");
        assert_eq!(longest("abc", "1234"), "1234");
    }
}
```

<details><summary>Official hint</summary>

Let the compiler guide you. Also take a look at The Book if you need help:
https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html

</details>

<details><summary>Official solution</summary>

```rust
// The Rust compiler needs to know how to check whether supplied references are
// valid, so that it can let the programmer know if a reference is at risk of
// going out of scope before it is used. Remember, references are borrows and do
// not own their own data. What if their owner goes out of scope?

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    //    ^^^^     ^^          ^^          ^^
    if x.len() > y.len() { x } else { y }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_longest() {
        assert_eq!(longest("abcd", "123"), "abcd");
        assert_eq!(longest("abc", "1234"), "1234");
    }
}
```

</details>

## lifetimes2

```rust
// Don't change this function.
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    // TODO: Fix the compiler error by moving one line.

    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(&string1, &string2);
    }
    println!("The longest string is '{result}'");
}
```

<details><summary>Official hint</summary>

Remember that the generic lifetime `'a` will get the concrete lifetime that is
equal to the smaller of the lifetimes of `x` and `y`.

You can take at least two paths to achieve the desired result while keeping the
inner block:
1. Move the `string2` declaration to make it live as long as `string1` (how is
   `result` declared?)
2. Move `println!` into the inner block

</details>

<details><summary>Official solution</summary>

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let string1 = String::from("long string is long");
    // Solution 1: You can move `strings2` out of the inner block so that it is
    // not dropped before the print statement.
    let string2 = String::from("xyz");
    let result;
    {
        result = longest(&string1, &string2);
    }
    println!("The longest string is '{result}'");
    // `string2` dropped at the end of the function.

    // =========================================================================

    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(&string1, &string2);
        // Solution 2: You can move the print statement into the inner block so
        // that it is executed before `string2` is dropped.
        println!("The longest string is '{result}'");
        // `string2` dropped here (end of the inner scope).
    }
}
```

</details>

## lifetimes3

```rust
// Lifetimes are also needed when structs hold references.

// TODO: Fix the compiler errors about the struct.
struct Book {
    author: &str,
    title: &str,
}

fn main() {
    let book = Book {
        author: "George Orwell",
        title: "1984",
    };

    println!("{} by {}", book.title, book.author);
}
```

<details><summary>Official hint</summary>

Let the compiler guide you :)

</details>

<details><summary>Official solution</summary>

```rust
// Lifetimes are also needed when structs hold references.

struct Book<'a> {
    //     ^^^^ added a lifetime annotation
    author: &'a str,
    //       ^^
    title: &'a str,
    //      ^^
}

fn main() {
    let book = Book {
        author: "George Orwell",
        title: "1984",
    };

    println!("{} by {}", book.title, book.author);
}
```

</details>
