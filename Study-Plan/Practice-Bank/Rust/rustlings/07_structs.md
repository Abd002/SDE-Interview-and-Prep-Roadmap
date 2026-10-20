# Rustlings: 07_structs

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/07_structs> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Structs

Rust has three struct types: a classic C struct, a tuple struct, and a unit struct.

## Further information

- [Structures](https://doc.rust-lang.org/book/ch05-01-defining-structs.html)
- [Method Syntax](https://doc.rust-lang.org/book/ch05-03-method-syntax.html)


## structs1

```rust
struct ColorRegularStruct {
    // TODO: Add the fields that the test `regular_structs` expects.
    // What types should the fields have? What are the minimum and maximum values for RGB colors?
}

struct ColorTupleStruct(/* TODO: Add the fields that the test `tuple_structs` expects */);

#[derive(Debug)]
struct UnitStruct;

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn regular_structs() {
        // TODO: Instantiate a regular struct.
        // let green =

        assert_eq!(green.red, 0);
        assert_eq!(green.green, 255);
        assert_eq!(green.blue, 0);
    }

    #[test]
    fn tuple_structs() {
        // TODO: Instantiate a tuple struct.
        // let green =

        assert_eq!(green.0, 0);
        assert_eq!(green.1, 255);
        assert_eq!(green.2, 0);
    }

    #[test]
    fn unit_structs() {
        // TODO: Instantiate a unit struct.
        // let unit_struct =
        let message = format!("{unit_struct:?}s are fun!");

        assert_eq!(message, "UnitStructs are fun!");
    }
}
```

<details><summary>Official hint</summary>

Rust has more than one type of struct. Three actually, all variants are used to
package related data together.

There are regular structs. These are named collections of related data stored in
fields.

Tuple structs are basically just named tuples.

Finally, unit structs. These don't have any fields and are useful for generics.

In this exercise, you need to complete and implement one of each kind.
Read more about structs in The Book:
https://doc.rust-lang.org/book/ch05-01-defining-structs.html

</details>

<details><summary>Official solution</summary>

```rust
struct ColorRegularStruct {
    red: u8,
    green: u8,
    blue: u8,
}

struct ColorTupleStruct(u8, u8, u8);

#[derive(Debug)]
struct UnitStruct;

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn regular_structs() {
        let green = ColorRegularStruct {
            red: 0,
            green: 255,
            blue: 0,
        };

        assert_eq!(green.red, 0);
        assert_eq!(green.green, 255);
        assert_eq!(green.blue, 0);
    }

    #[test]
    fn tuple_structs() {
        let green = ColorTupleStruct(0, 255, 0);

        assert_eq!(green.0, 0);
        assert_eq!(green.1, 255);
        assert_eq!(green.2, 0);
    }

    #[test]
    fn unit_structs() {
        let unit_struct = UnitStruct;
        let message = format!("{unit_struct:?}s are fun!");

        assert_eq!(message, "UnitStructs are fun!");
    }
}
```

</details>

## structs2

```rust
#[derive(Debug)]
struct Order {
    name: String,
    year: u32,
    made_by_phone: bool,
    made_by_mobile: bool,
    made_by_email: bool,
    item_number: u32,
    count: u32,
}

fn create_order_template() -> Order {
    Order {
        name: String::from("Bob"),
        year: 2019,
        made_by_phone: false,
        made_by_mobile: false,
        made_by_email: true,
        item_number: 123,
        count: 0,
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn your_order() {
        let order_template = create_order_template();

        // TODO: Create your own order using the update syntax and template above!
        // let your_order =

        assert_eq!(your_order.name, "Hacker in Rust");
        assert_eq!(your_order.year, order_template.year);
        assert_eq!(your_order.made_by_phone, order_template.made_by_phone);
        assert_eq!(your_order.made_by_mobile, order_template.made_by_mobile);
        assert_eq!(your_order.made_by_email, order_template.made_by_email);
        assert_eq!(your_order.item_number, order_template.item_number);
        assert_eq!(your_order.count, 1);
    }
}
```

<details><summary>Official hint</summary>

Creating instances of structs is easy, all you need to do is assign some values
to its fields.

There are however some shortcuts that can be taken when instantiating structs.
Have a look in The Book to find out more:
https://doc.rust-lang.org/book/ch05-01-defining-structs.html#creating-instances-from-other-instances-with-struct-update-syntax

</details>

<details><summary>Official solution</summary>

```rust
#[derive(Debug)]
struct Order {
    name: String,
    year: u32,
    made_by_phone: bool,
    made_by_mobile: bool,
    made_by_email: bool,
    item_number: u32,
    count: u32,
}

fn create_order_template() -> Order {
    Order {
        name: String::from("Bob"),
        year: 2019,
        made_by_phone: false,
        made_by_mobile: false,
        made_by_email: true,
        item_number: 123,
        count: 0,
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn your_order() {
        let order_template = create_order_template();

        let your_order = Order {
            name: String::from("Hacker in Rust"),
            count: 1,
            // Struct update syntax
            ..order_template
        };

        assert_eq!(your_order.name, "Hacker in Rust");
        assert_eq!(your_order.year, order_template.year);
        assert_eq!(your_order.made_by_phone, order_template.made_by_phone);
        assert_eq!(your_order.made_by_mobile, order_template.made_by_mobile);
        assert_eq!(your_order.made_by_email, order_template.made_by_email);
        assert_eq!(your_order.item_number, order_template.item_number);
        assert_eq!(your_order.count, 1);
    }
}
```

</details>

## structs3

```rust
// Structs contain data, but can also have logic. In this exercise, we have
// defined the `Fireworks` struct and a couple of functions that work with it.
// Turn these free-standing functions into methods and associated functions
// to express that relationship more clearly in the code.

#![deny(clippy::use_self)] // practice using the `Self` type

#[derive(Debug)]
struct Fireworks {
    rockets: usize,
}

// TODO: Turn this function into an associated function on `Fireworks`.
fn new_fireworks() -> Fireworks {
    Fireworks { rockets: 0 }
}

// TODO: Turn this function into a method on `Fireworks`.
fn add_rockets(fireworks: &mut Fireworks, rockets: usize) {
    fireworks.rockets += rockets
}

// TODO: Turn this function into a method on `Fireworks`.
fn start(fireworks: Fireworks) -> String {
    "🚀".repeat(fireworks.rockets)
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn start_some_fireworks() {
        let f = Fireworks::new();
        assert_eq!(f.start(), "");

        let mut f = Fireworks::new();
        f.add_rockets(3);
        assert_eq!(f.start(), "🚀🚀🚀");

        let mut f = Fireworks::new();
        f.add_rockets(7);
        // We don't use method syntax in the last test to ensure the `start`
        // function takes ownership of the fireworks.
        assert_eq!(Fireworks::start(f), "🚀🚀🚀🚀🚀🚀🚀");
    }
}
```

<details><summary>Official hint</summary>

Methods and associated functions are both declared in an `impl MyType {}`
block. Methods have a `self`, `&self` or `&mut self` parameter, where `self`
implicitly has the type of the impl block. Associated functions do not have
a `self` parameter.

Have a look in The Book to find out more about method implementations:
https://doc.rust-lang.org/book/ch05-03-method-syntax.html

</details>

<details><summary>Official solution</summary>

```rust
#![deny(clippy::use_self)] // practice using the `Self` type

#[derive(Debug)]
struct Fireworks {
    rockets: usize,
}

impl Fireworks {
    fn new() -> Self {
        Self { rockets: 0 }
    }

    fn add_rockets(&mut self, rockets: usize) {
        self.rockets += rockets
    }

    fn start(self) -> String {
        "🚀".repeat(self.rockets)
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn start_some_fireworks() {
        let f = Fireworks::new();
        assert_eq!(f.start(), "");

        let mut f = Fireworks::new();
        f.add_rockets(3);
        assert_eq!(f.start(), "🚀🚀🚀");

        let mut f = Fireworks::new();
        f.add_rockets(7);
        // We don't use method syntax in the last test to ensure the `start`
        // function takes ownership of the fireworks.
        assert_eq!(Fireworks::start(f), "🚀🚀🚀🚀🚀🚀🚀");
    }
}
```

</details>
