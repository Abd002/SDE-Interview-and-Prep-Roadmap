# Rustlings: 14_generics

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/14_generics> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Generics

Generics is the topic of generalizing types and functionalities to broader cases.
This is extremely useful for reducing code duplication in many ways, but can call for some rather involved syntax.
Namely, being generic requires taking great care to specify over which types a generic type is actually considered valid.
The simplest and most common use of generics is for type parameters.

## Further information

- [Generic Data Types](https://doc.rust-lang.org/book/ch10-01-syntax.html)
- [Bounds](https://doc.rust-lang.org/rust-by-example/generics/bounds.html)


## generics1

```rust
// `Vec<T>` is generic over the type `T`. In most cases, the compiler is able to
// infer `T`, for example after pushing a value with a concrete type to the vector.
// But in this exercise, the compiler needs some help through a type annotation.

fn main() {
    // TODO: Fix the compiler error by annotating the type of the vector
    // `Vec<T>`. Choose `T` as some integer type that can be created from
    // `u8` and `i8`.
    let mut numbers = Vec::new();

    // Don't change the lines below.
    let n1: u8 = 42;
    numbers.push(n1.into());
    let n2: i8 = -1;
    numbers.push(n2.into());

    println!("{numbers:?}");
}
```

<details><summary>Official hint</summary>

Vectors in Rust make use of generics to create dynamically sized arrays of any
type.
If the vector `numbers` has the type `Vec<T>`, then we can only push values of
type `T` to it. By using `into()` before pushing, we ask the compiler to convert
`n1` and `n2` to `T`. But the compiler doesn't know what `T` is yet and needs a
type annotation.

`u8` and `i8` can both be converted to `i16`, `i32` and `i64`. Choose one for
the generic of the vector.

</details>

<details><summary>Official solution</summary>

```rust
// `Vec<T>` is generic over the type `T`. In most cases, the compiler is able to
// infer `T`, for example after pushing a value with a concrete type to the vector.
// But in this exercise, the compiler needs some help through a type annotation.

fn main() {
    // `u8` and `i8` can both be converted to `i16`.
    let mut numbers: Vec<i16> = Vec::new();
    //             ^^^^^^^^^^ added

    // Don't change the lines below.
    let n1: u8 = 42;
    numbers.push(n1.into());
    let n2: i8 = -1;
    numbers.push(n2.into());

    println!("{numbers:?}");
}
```

</details>

## generics2

```rust
// This powerful wrapper provides the ability to store a positive integer value.
// TODO: Rewrite it using a generic so that it supports wrapping ANY type.
struct Wrapper {
    value: u32,
}

// TODO: Adapt the struct's implementation to be generic over the wrapped value.
impl Wrapper {
    fn new(value: u32) -> Self {
        Wrapper { value }
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn store_u32_in_wrapper() {
        assert_eq!(Wrapper::new(42).value, 42);
    }

    #[test]
    fn store_str_in_wrapper() {
        assert_eq!(Wrapper::new("Foo").value, "Foo");
    }
}
```

<details><summary>Official hint</summary>

Related section in The Book:
https://doc.rust-lang.org/book/ch10-01-syntax.html#in-method-definitions

</details>

<details><summary>Official solution</summary>

```rust
struct Wrapper<T> {
    value: T,
}

impl<T> Wrapper<T> {
    fn new(value: T) -> Self {
        Wrapper { value }
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn store_u32_in_wrapper() {
        assert_eq!(Wrapper::new(42).value, 42);
    }

    #[test]
    fn store_str_in_wrapper() {
        assert_eq!(Wrapper::new("Foo").value, "Foo");
    }
}
```

</details>
