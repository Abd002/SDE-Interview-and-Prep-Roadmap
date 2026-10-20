# Rustlings: 10_modules

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/10_modules> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Modules

In this section we'll give you an introduction to Rust's module system.

## Further information

- [The Module System](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html)


## modules1

```rust
// TODO: Fix the compiler error about calling a private function.
mod sausage_factory {
    // Don't let anybody outside of this module see this!
    fn get_secret_recipe() -> String {
        String::from("Ginger")
    }

    fn make_sausage() {
        get_secret_recipe();
        println!("sausage!");
    }
}

fn main() {
    sausage_factory::make_sausage();
}
```

<details><summary>Official hint</summary>

Everything is private in Rust by default. But there's a keyword we can use
to make something public!

</details>

<details><summary>Official solution</summary>

```rust
mod sausage_factory {
    fn get_secret_recipe() -> String {
        String::from("Ginger")
    }

    // Added `pub` before `fn` to make the function accessible outside the module.
    pub fn make_sausage() {
        get_secret_recipe();
        println!("sausage!");
    }
}

fn main() {
    sausage_factory::make_sausage();
}
```

</details>

## modules2

```rust
// You can bring module paths into scopes and provide new names for them with
// the `use` and `as` keywords.

mod delicious_snacks {
    // TODO: Add the following two `use` statements after fixing them.
    // use self::fruits::PEAR as ???;
    // use self::veggies::CUCUMBER as ???;

    mod fruits {
        pub const PEAR: &str = "Pear";
        pub const APPLE: &str = "Apple";
    }

    mod veggies {
        pub const CUCUMBER: &str = "Cucumber";
        pub const CARROT: &str = "Carrot";
    }
}

fn main() {
    println!(
        "favorite snacks: {} and {}",
        delicious_snacks::FRUIT,
        delicious_snacks::VEGGIE,
    );
}
```

<details><summary>Official hint</summary>

The `delicious_snacks` module is trying to present an external interface that
is different than its internal structure (the `fruits` and `veggies` modules
and associated constants). Complete the `use` statements to fit the uses in
`main` and find the one keyword missing for both constants.

Learn more in The Book:
https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#re-exporting-names-with-pub-use

</details>

<details><summary>Official solution</summary>

```rust
mod delicious_snacks {
    // Added `pub` and used the expected alias after `as`.
    pub use self::fruits::PEAR as FRUIT;
    pub use self::veggies::CUCUMBER as VEGGIE;

    mod fruits {
        pub const PEAR: &str = "Pear";
        pub const APPLE: &str = "Apple";
    }

    mod veggies {
        pub const CUCUMBER: &str = "Cucumber";
        pub const CARROT: &str = "Carrot";
    }
}

fn main() {
    println!(
        "favorite snacks: {} and {}",
        delicious_snacks::FRUIT,
        delicious_snacks::VEGGIE,
    );
}
```

</details>

## modules3

```rust
// You can use the `use` keyword to bring module paths from modules from
// anywhere and especially from the standard library into your scope.

// TODO: Bring `SystemTime` and `UNIX_EPOCH` from the `std::time` module into
// your scope. Bonus style points if you can do it with one line!
// use ???;

fn main() {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => println!("1970-01-01 00:00:00 UTC was {} seconds ago!", n.as_secs()),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    }
}
```

<details><summary>Official hint</summary>

`UNIX_EPOCH` and `SystemTime` are declared in the `std::time` module. Add a
`use` statement for these two to bring them into scope. You can use nested
paths to bring these two in using only one line.

</details>

<details><summary>Official solution</summary>

```rust
use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => println!("1970-01-01 00:00:00 UTC was {} seconds ago!", n.as_secs()),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    }
}
```

</details>
