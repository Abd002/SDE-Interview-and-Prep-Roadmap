# Rustlings: 17_tests

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/17_tests> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Tests

Going out of order from the book to cover tests -- many of the following exercises will ask you to make tests pass!

## Further information

- [Writing Tests](https://doc.rust-lang.org/book/ch11-01-writing-tests.html)


## tests1

```rust
// Tests are important to ensure that your code does what you think it should
// do.

fn is_even(n: i64) -> bool {
    n % 2 == 0
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    // TODO: Import `is_even`. You can use a wildcard to import everything in
    // the outer module.

    #[test]
    fn you_can_assert() {
        // TODO: Test the function `is_even` with some values.
        assert!();
        assert!();
    }
}
```

<details><summary>Official hint</summary>

`assert!` is a macro that needs an argument. Depending on the value of the
argument, `assert!` will do nothing (in which case the test will pass) or
`assert!` will panic (in which case the test will fail).

So try giving different values to `assert!` and see which ones compile, which
ones pass, and which ones fail :)

If you want to check for `false`, you can negate the result of what you're
checking using `!`, like `assert!(!…)`.

</details>

<details><summary>Official solution</summary>

```rust
// Tests are important to ensure that your code does what you think it should
// do.

fn is_even(n: i64) -> bool {
    n % 2 == 0
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    // When writing unit tests, it is common to import everything from the outer
    // module (`super`) using a wildcard.
    use super::*;

    #[test]
    fn you_can_assert() {
        assert!(is_even(0));
        assert!(!is_even(-1));
        //      ^ You can assert `false` using the negation operator `!`.
    }
}
```

</details>

## tests2

```rust
// Calculates the power of 2 using a bit shift.
// `1 << n` is equivalent to "2 to the power of n".
fn power_of_2(n: u8) -> u64 {
    1 << n
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn you_can_assert_eq() {
        // TODO: Test the function `power_of_2` with some values.
        assert_eq!();
        assert_eq!();
        assert_eq!();
        assert_eq!();
    }
}
```

<details><summary>Official hint</summary>

`assert_eq!` is a macro that takes two arguments and compares them. Try giving
it two values that are equal! Try giving it two arguments that are different!
Try switching which argument comes first and which comes second!

</details>

<details><summary>Official solution</summary>

```rust
// Calculates the power of 2 using a bit shift.
// `1 << n` is equivalent to "2 to the power of n".
fn power_of_2(n: u8) -> u64 {
    1 << n
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn you_can_assert_eq() {
        assert_eq!(power_of_2(0), 1);
        assert_eq!(power_of_2(1), 2);
        assert_eq!(power_of_2(2), 4);
        assert_eq!(power_of_2(3), 8);
    }
}
```

</details>

## tests3

```rust
struct Rectangle {
    width: i32,
    height: i32,
}

impl Rectangle {
    // Don't change this function.
    fn new(width: i32, height: i32) -> Self {
        if width <= 0 || height <= 0 {
            // Returning a `Result` would be better here. But we want to learn
            // how to test functions that can panic.
            panic!("Rectangle width and height must be positive");
        }

        Rectangle { width, height }
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn correct_width_and_height() {
        // TODO: This test should check if the rectangle has the size that we
        // pass to its constructor.
        let rect = Rectangle::new(10, 20);
        assert_eq!(todo!(), 10); // Check width
        assert_eq!(todo!(), 20); // Check height
    }

    // TODO: This test should check if the program panics when we try to create
    // a rectangle with negative width.
    #[test]
    fn negative_width() {
        let _rect = Rectangle::new(-10, 10);
    }

    // TODO: This test should check if the program panics when we try to create
    // a rectangle with negative height.
    #[test]
    fn negative_height() {
        let _rect = Rectangle::new(10, -10);
    }
}
```

<details><summary>Official hint</summary>

We expect the method `Rectangle::new` to panic for negative values.

To handle that, you need to add a special attribute to the test function.

You can refer to the docs:
https://doc.rust-lang.org/book/ch11-01-writing-tests.html#checking-for-panics-with-should_panic

</details>

<details><summary>Official solution</summary>

```rust
struct Rectangle {
    width: i32,
    height: i32,
}

impl Rectangle {
    // Don't change this function.
    fn new(width: i32, height: i32) -> Self {
        if width <= 0 || height <= 0 {
            // Returning a `Result` would be better here. But we want to learn
            // how to test functions that can panic.
            panic!("Rectangle width and height must be positive");
        }

        Rectangle { width, height }
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn correct_width_and_height() {
        let rect = Rectangle::new(10, 20);
        assert_eq!(rect.width, 10); // Check width
        assert_eq!(rect.height, 20); // Check height
    }

    #[test]
    #[should_panic] // Added this attribute to check that the test panics.
    fn negative_width() {
        let _rect = Rectangle::new(-10, 10);
    }

    #[test]
    #[should_panic] // Added this attribute to check that the test panics.
    fn negative_height() {
        let _rect = Rectangle::new(10, -10);
    }
}
```

</details>
