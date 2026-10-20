# Rustlings: 04_primitive_types

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/04_primitive_types> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Primitive Types

Rust has a couple of basic types that are directly implemented into the
compiler. In this section, we'll go through the most important ones.

## Further information

- [Data Types](https://doc.rust-lang.org/book/ch03-02-data-types.html)
- [The Slice Type](https://doc.rust-lang.org/book/ch04-03-slices.html)


## primitive_types1

```rust
// Booleans (`bool`)

fn main() {
    let is_morning = true;
    if is_morning {
        println!("Good morning!");
    }

    // TODO: Define a boolean variable with the name `is_evening` before the `if` statement below.
    // The value of the variable should be the negation (opposite) of `is_morning`.
    // let …
    if is_evening {
        println!("Good evening!");
    }
}
```

<details><summary>Official hint</summary>

In Rust, a boolean can be negated using the operator `!` before it.
Example: `!true == false`
This also works with boolean variables.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    let is_morning = true;
    if is_morning {
        println!("Good morning!");
    }

    let is_evening = !is_morning;
    if is_evening {
        println!("Good evening!");
    }
}
```

</details>

## primitive_types2

```rust
// Characters (`char`)

fn main() {
    // Note the _single_ quotes, these are different from the double quotes
    // you've been seeing around.
    let my_first_initial = 'C';
    if my_first_initial.is_alphabetic() {
        println!("Alphabetical!");
    } else if my_first_initial.is_numeric() {
        println!("Numerical!");
    } else {
        println!("Neither alphabetic nor numeric!");
    }

    // TODO: Analogous to the example before, declare a variable called `your_character`
    // below with your favorite character.
    // Try a letter, try a digit (in single quotes), try a special character, try a character
    // from a different language than your own, try an emoji 😉
    // let your_character = '';

    if your_character.is_alphabetic() {
        println!("Alphabetical!");
    } else if your_character.is_numeric() {
        println!("Numerical!");
    } else {
        println!("Neither alphabetic nor numeric!");
    }
}
```

<details><summary>Official hint</summary>

No hints this time ;)

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    let my_first_initial = 'C';
    if my_first_initial.is_alphabetic() {
        println!("Alphabetical!");
    } else if my_first_initial.is_numeric() {
        println!("Numerical!");
    } else {
        println!("Neither alphabetic nor numeric!");
    }

    // Example with an emoji.
    let your_character = '🦀';

    if your_character.is_alphabetic() {
        println!("Alphabetical!");
    } else if your_character.is_numeric() {
        println!("Numerical!");
    } else {
        println!("Neither alphabetic nor numeric!");
    }
}
```

</details>

## primitive_types3

```rust
fn main() {
    // TODO: Create an array called `a` with at least 100 elements in it.
    // let a = ???

    if a.len() >= 100 {
        println!("Wow, that's a big array!");
    } else {
        println!("Meh, I eat arrays like that for breakfast.");
        panic!("Array not big enough, more elements needed");
    }
}
```

<details><summary>Official hint</summary>

There's a shorthand to initialize arrays with a certain size that doesn't
require you to type in 100 items (but you certainly can if you want!).

For example, you can do:
```
let array = ["Are we there yet?"; 100];
```

Bonus: what are some other things you could have that would return `true`
for `a.len() >= 100`?

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // An array with 100 elements of the value 42.
    let a = [42; 100];

    if a.len() >= 100 {
        println!("Wow, that's a big array!");
    } else {
        println!("Meh, I eat arrays like that for breakfast.");
        panic!("Array not big enough, more elements needed");
    }
}
```

</details>

## primitive_types4

```rust
fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn slice_out_of_array() {
        let a = [1, 2, 3, 4, 5];

        // TODO: Get a slice called `nice_slice` out of the array `a` so that the test passes.
        // let nice_slice = ???

        assert_eq!([2, 3, 4], nice_slice);
    }
}
```

<details><summary>Official hint</summary>

Take a look at the 'Understanding Ownership -> The Slice Type -> Other Slices'
section of the book: https://doc.rust-lang.org/book/ch04-03-slices.html and use
the starting and ending (plus one) indices of the items in the array that you
want to end up in the slice.

If you're curious why the first argument of `assert_eq!` does not have an
ampersand for a reference since the second argument is a reference, take a look
at the coercion chapter of the nomicon:
https://doc.rust-lang.org/nomicon/coercions.html

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn slice_out_of_array() {
        let a = [1, 2, 3, 4, 5];
        //       0  1  2  3  4  <- indices
        //          -------
        //             |
        //             +--- slice

        // Note that the upper index 4 is excluded.
        let nice_slice = &a[1..4];
        assert_eq!([2, 3, 4], nice_slice);

        // The upper index can be included by using the syntax `..=` (with `=` sign)
        let nice_slice = &a[1..=3];
        assert_eq!([2, 3, 4], nice_slice);
    }
}
```

</details>

## primitive_types5

```rust
fn main() {
    let cat = ("Furry McFurson", 3.5);

    // TODO: Destructure the `cat` tuple in one statement so that the println works.
    // let /* your pattern here */ = cat;

    println!("{name} is {age} years old");
}
```

<details><summary>Official hint</summary>

Take a look at the 'Data Types -> The Tuple Type' section of the book:
https://doc.rust-lang.org/book/ch03-02-data-types.html#the-tuple-type
Particularly the part about destructuring (second to last example in the
section).

You'll need to make a pattern to bind `name` and `age` to the appropriate parts
of the tuple.

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    let cat = ("Furry McFurson", 3.5);

    // Destructuring the tuple.
    let (name, age) = cat;

    println!("{name} is {age} years old");
}
```

</details>

## primitive_types6

```rust
fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn indexing_tuple() {
        let numbers = (1, 2, 3);

        // TODO: Use a tuple index to access the second element of `numbers`
        // and assign it to a variable called `second`.
        // let second = ???;

        assert_eq!(second, 2, "This is not the 2nd number in the tuple!");
    }
}
```

<details><summary>Official hint</summary>

While you could use a destructuring `let` for the tuple here, try
indexing into it instead, as explained in the last example of the
'Data Types -> The Tuple Type' section of the book:
https://doc.rust-lang.org/book/ch03-02-data-types.html#the-tuple-type
Now, you have another tool in your toolbox!

</details>

<details><summary>Official solution</summary>

```rust
fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn indexing_tuple() {
        let numbers = (1, 2, 3);

        // Tuple indexing syntax.
        let second = numbers.1;

        assert_eq!(second, 2, "This is not the 2nd number in the tuple!");
    }
}
```

</details>
