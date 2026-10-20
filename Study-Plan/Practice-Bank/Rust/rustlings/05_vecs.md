# Rustlings: 05_vecs

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/05_vecs> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Vectors

Vectors are one of the most-used Rust data structures. In other programming
languages, they'd simply be called Arrays, but since Rust operates on a
bit of a lower level, an array in Rust is stored on the stack (meaning it
can't grow or shrink, and the size needs to be known at compile time),
and a Vector is stored in the heap (where these restrictions do not apply).

Vectors are a bit of a later chapter in the book, but we think that they're
useful enough to talk about them a bit earlier. We shall be talking about
the other useful data structure, hash maps, later.

## Further information

- [Storing Lists of Values with Vectors](https://doc.rust-lang.org/book/ch08-01-vectors.html)
- [`iter_mut`](https://doc.rust-lang.org/std/primitive.slice.html#method.iter_mut)
- [`map`](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.map)


## vecs1

```rust
fn elems_to_vec(a: i32, b: i32, c: i32) -> Vec<i32> {
    // TODO: Return a vector containing the elements a, b and c (in this order).
    // Use the "vec!" macro.
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_elems_to_vec() {
        let (a, b, c) = (2, 7, 12);
        let v = elems_to_vec(a, b, c);
        assert_eq!(v[0], a);
        assert_eq!(v[1], b);
        assert_eq!(v[2], c);
    }
}
```

<details><summary>Official hint</summary>

In Rust, there are two basic ways to define a Vector.
1. One way is to use the `Vec::new()` function to create a new vector
   and fill it with the `push()` method.
2. The second way is to use the `vec![]` macro and define your elements
   inside the square brackets. This way is simpler when you exactly know
   the initial values.

Check this chapter: https://doc.rust-lang.org/book/ch08-01-vectors.html
of the Rust book to learn more.

</details>

<details><summary>Official solution</summary>

```rust
fn elems_to_vec(a: i32, b: i32, c: i32) -> Vec<i32> {
    vec![a, b, c]
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_elems_to_vec() {
        let (a, b, c) = (2, 7, 12);
        let v = elems_to_vec(a, b, c);
        assert_eq!(v[0], a);
        assert_eq!(v[1], b);
        assert_eq!(v[2], c);
    }
}
```

</details>

## vecs2

```rust
fn vec_loop(input: &[i32]) -> Vec<i32> {
    let mut output = Vec::new();

    for element in input {
        // TODO: Multiply each element in the `input` slice by 2 and push it to
        // the `output` vector.
    }

    output
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vec_loop() {
        let input = [2, 4, 6, 8, 10];
        let ans = vec_loop(&input);
        assert_eq!(ans, [4, 8, 12, 16, 20]);
    }
}
```

<details><summary>Official hint</summary>

Use the `.push()` method on the vector to push new elements to it.

</details>

<details><summary>Official solution</summary>

```rust
fn vec_loop(input: &[i32]) -> Vec<i32> {
    let mut output = Vec::new();

    for element in input {
        output.push(2 * element);
    }

    output
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vec_loop() {
        let input = [2, 4, 6, 8, 10];
        let ans = vec_loop(&input);
        assert_eq!(ans, [4, 8, 12, 16, 20]);
    }
}
```

</details>
