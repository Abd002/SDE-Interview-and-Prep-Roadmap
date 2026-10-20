# Rustlings: 06_move_semantics

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/06_move_semantics> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Move Semantics

These exercises are adapted from [pnkfelix](https://github.com/pnkfelix)'s [Rust Tutorial](https://pnkfelix.github.io/rust-examples-icfp2014/) -- Thank you Felix!!!

## Further information

For this section, the book links are especially important.

- [Ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)
- [Reference and borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)


## move_semantics1

```rust
// TODO: Fix the compiler error in this function.
fn fill_vec(vec: Vec<i32>) -> Vec<i32> {
    let vec = vec;

    vec.push(88);

    vec
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn move_semantics1() {
        let vec0 = vec![22, 44, 66];
        let vec1 = fill_vec(vec0);
        assert_eq!(vec1, vec![22, 44, 66, 88]);
    }
}
```

<details><summary>Official hint</summary>

So you've got the "cannot borrow `vec` as mutable, as it is not declared as
mutable" error on the line where we push an element to the vector, right?

The fix for this is going to be adding one keyword, and the addition is NOT on
the line where we push to the vector (where the error is).

Try accessing `vec0` after having called `fill_vec()`. See what happens!

</details>

<details><summary>Official solution</summary>

```rust
fn fill_vec(vec: Vec<i32>) -> Vec<i32> {
    let mut vec = vec;
    //  ^^^ added

    vec.push(88);

    vec
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn move_semantics1() {
        let vec0 = vec![22, 44, 66];
        let vec1 = fill_vec(vec0);
        // `vec0` can't be accessed anymore because it is moved to `fill_vec`.
        assert_eq!(vec1, vec![22, 44, 66, 88]);
    }
}
```

</details>

## move_semantics2

```rust
fn fill_vec(vec: Vec<i32>) -> Vec<i32> {
    let mut vec = vec;

    vec.push(88);

    vec
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: Make both vectors `vec0` and `vec1` accessible at the same time to
    // fix the compiler error in the test.
    #[test]
    fn move_semantics2() {
        let vec0 = vec![22, 44, 66];

        let vec1 = fill_vec(vec0);

        assert_eq!(vec0, [22, 44, 66]);
        assert_eq!(vec1, [22, 44, 66, 88]);
    }
}
```

<details><summary>Official hint</summary>

When running this exercise for the first time, you'll notice an error about
"borrow of moved value". In Rust, when an argument is passed to a function and
it's not explicitly returned, you can't use the original variable anymore.
We call this "moving" a variable. When we pass `vec0` into `fill_vec`, it's
being "moved" into `vec1`, meaning we can't access `vec0` anymore.

You could make another, separate version of the data that's in `vec0` and
pass it to `fill_vec` instead. This is called cloning in Rust.

</details>

<details><summary>Official solution</summary>

```rust
fn fill_vec(vec: Vec<i32>) -> Vec<i32> {
    let mut vec = vec;

    vec.push(88);

    vec
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn move_semantics2() {
        let vec0 = vec![22, 44, 66];

        // Cloning `vec0` so that the clone is moved into `fill_vec`, not `vec0`
        // itself.
        let vec1 = fill_vec(vec0.clone());

        assert_eq!(vec0, [22, 44, 66]);
        assert_eq!(vec1, [22, 44, 66, 88]);
    }
}
```

</details>

## move_semantics3

```rust
// TODO: Fix the compiler error in the function without adding any new line.
fn fill_vec(vec: Vec<i32>) -> Vec<i32> {
    vec.push(88);

    vec
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn move_semantics3() {
        let vec0 = vec![22, 44, 66];
        let vec1 = fill_vec(vec0);
        assert_eq!(vec1, [22, 44, 66, 88]);
    }
}
```

<details><summary>Official hint</summary>

The difference between this one and the previous ones is that the first line
of `fn fill_vec` that had `let mut vec = vec;` is no longer there. You can,
instead of adding that line back, add `mut` in one place that will change
an existing binding to be a mutable binding instead of an immutable one :)

</details>

<details><summary>Official solution</summary>

```rust
fn fill_vec(mut vec: Vec<i32>) -> Vec<i32> {
    //      ^^^ added
    vec.push(88);

    vec
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn move_semantics3() {
        let vec0 = vec![22, 44, 66];
        let vec1 = fill_vec(vec0);
        assert_eq!(vec1, [22, 44, 66, 88]);
    }
}
```

</details>

## move_semantics4

```rust
fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    // TODO: Fix the compiler errors only by reordering the lines in the test.
    // Don't add, change or remove any line.
    #[test]
    fn move_semantics4() {
        let mut x = Vec::new();
        let y = &mut x;
        let z = &mut x;
        y.push(42);
        z.push(13);
        assert_eq!(x, [42, 13]);
    }
}
```

<details><summary>Official hint</summary>

Carefully reason about the range in which each mutable reference is in
scope. Does it help to update the value of `x` immediately after
the mutable reference is taken?
Read more about 'Mutable References' in the book's section 'References and
Borrowing':
https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#mutable-references.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn move_semantics4() {
        let mut x = Vec::new();
        let y = &mut x;
        // `y` used here.
        y.push(42);
        // The mutable reference `y` is not used anymore,
        // therefore a new reference can be created.
        let z = &mut x;
        z.push(13);
        assert_eq!(x, [42, 13]);
    }
}
```

</details>

## move_semantics5

```rust
#![allow(clippy::ptr_arg)]

// TODO: Fix the compiler errors without changing anything except adding or
// removing references (the character `&`).

// Shouldn't take ownership
fn get_char(data: String) -> char {
    data.chars().last().unwrap()
}

// Should take ownership
fn string_uppercase(mut data: &String) {
    data = data.to_uppercase();

    println!("{data}");
}

fn main() {
    let data = "Rust is great!".to_string();

    get_char(data);

    string_uppercase(&data);
}
```

<details><summary>Official hint</summary>

To find the answer, you can consult the book section "References and Borrowing":
https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html

The first problem is that `get_char` is taking ownership of the string. So
`data` is moved and can't be used for `string_uppercase`. `data` is moved to
`get_char` first, meaning that `string_uppercase` can't manipulate the data.

Once you've fixed that, `string_uppercase`'s function signature will also need
to be adjusted.

</details>

<details><summary>Official solution</summary>

```rust
#![allow(clippy::ptr_arg)]

// Borrows instead of taking ownership.
// It is recommended to use `&str` instead of `&String` here. But this is
// enough for now because we didn't handle strings yet.
fn get_char(data: &String) -> char {
    data.chars().last().unwrap()
}

// Takes ownership instead of borrowing.
fn string_uppercase(mut data: String) {
    data = data.to_uppercase();

    println!("{data}");
}

fn main() {
    let data = "Rust is great!".to_string();

    get_char(&data);

    string_uppercase(data);
}
```

</details>
