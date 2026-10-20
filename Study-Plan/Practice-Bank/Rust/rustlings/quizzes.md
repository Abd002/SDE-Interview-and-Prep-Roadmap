# Rustlings: quizzes

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/quizzes> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Quizzes

After every couple of sections, there will be a quiz in this directory that'll test your knowledge on a bunch of sections at once.


## quiz1

```rust
// This is a quiz for the following sections:
// - Variables
// - Functions
// - If
//
// Mary is buying apples. The price of an apple is calculated as follows:
// - An apple costs 2 rustbucks.
// - However, if Mary buys more than 40 apples, the price of each apple in the
// entire order is reduced to only 1 rustbuck!

// TODO: Write a function that calculates the price of an order of apples given
// the quantity bought.
// fn calculate_price_of_apples(???) -> ??? { ??? }

fn main() {
    // You can optionally experiment here.
}

// Don't change the tests!
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn verify_test() {
        assert_eq!(calculate_price_of_apples(35), 70);
        assert_eq!(calculate_price_of_apples(40), 80);
        assert_eq!(calculate_price_of_apples(41), 41);
        assert_eq!(calculate_price_of_apples(65), 65);
    }
}
```

<details><summary>Official hint</summary>

No hints this time ;)

</details>

<details><summary>Official solution</summary>

```rust
// Mary is buying apples. The price of an apple is calculated as follows:
// - An apple costs 2 rustbucks.
// - However, if Mary buys more than 40 apples, the price of each apple in the
// entire order is reduced to only 1 rustbuck!

fn calculate_price_of_apples(n_apples: u64) -> u64 {
    if n_apples > 40 {
        n_apples
    } else {
        2 * n_apples
    }
}

fn main() {
    // You can optionally experiment here.
}

// Don't change the tests!
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn verify_test() {
        assert_eq!(calculate_price_of_apples(35), 70);
        assert_eq!(calculate_price_of_apples(40), 80);
        assert_eq!(calculate_price_of_apples(41), 41);
        assert_eq!(calculate_price_of_apples(65), 65);
    }
}
```

</details>

## quiz2

```rust
// This is a quiz for the following sections:
// - Strings
// - Vecs
// - Move semantics
// - Modules
// - Enums
//
// Let's build a little machine in the form of a function. As input, we're going
// to give a list of strings and commands. These commands determine what action
// is going to be applied to the string. It can either be:
// - Uppercase the string
// - Trim the string
// - Append "bar" to the string a specified amount of times
//
// The exact form of this will be:
// - The input is going to be a Vector of 2-length tuples,
//   the first element is the string, the second one is the command.
// - The output element is going to be a vector of strings.

enum Command {
    Uppercase,
    Trim,
    Append(usize),
}

mod my_module {
    use super::Command;

    // TODO: Complete the function as described above.
    // pub fn transformer(input: ???) -> ??? { ??? }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    // TODO: What do we need to import to have `transformer` in scope?
    // use ???;
    use super::Command;

    #[test]
    fn it_works() {
        let input = vec![
            ("hello".to_string(), Command::Uppercase),
            (" all roads lead to rome! ".to_string(), Command::Trim),
            ("foo".to_string(), Command::Append(1)),
            ("bar".to_string(), Command::Append(5)),
        ];
        let output = transformer(input);

        assert_eq!(
            output,
            [
                "HELLO",
                "all roads lead to rome!",
                "foobar",
                "barbarbarbarbarbar",
            ]
        );
    }
}
```

<details><summary>Official hint</summary>

The `+` operator can concatenate a `String` with a `&str`.

</details>

<details><summary>Official solution</summary>

```rust
// Let's build a little machine in the form of a function. As input, we're going
// to give a list of strings and commands. These commands determine what action
// is going to be applied to the string. It can either be:
// - Uppercase the string
// - Trim the string
// - Append "bar" to the string a specified amount of times
//
// The exact form of this will be:
// - The input is going to be a vector of 2-length tuples,
//   the first element is the string, the second one is the command.
// - The output element is going to be a vector of strings.

enum Command {
    Uppercase,
    Trim,
    Append(usize),
}

mod my_module {
    use super::Command;

    // The solution with a loop. Check out `transformer_iter` for a version
    // with iterators.
    pub fn transformer(input: Vec<(String, Command)>) -> Vec<String> {
        let mut output = Vec::new();

        for (string, command) in input {
            // Create the new string.
            let new_string = match command {
                Command::Uppercase => string.to_uppercase(),
                Command::Trim => string.trim().to_string(),
                Command::Append(n) => string + &"bar".repeat(n),
            };

            // Push the new string to the output vector.
            output.push(new_string);
        }

        output
    }

    // Equivalent to `transform` but uses an iterator instead of a loop for
    // comparison. Don't worry, we will practice iterators later ;)
    pub fn transformer_iter(input: Vec<(String, Command)>) -> Vec<String> {
        input
            .into_iter()
            .map(|(string, command)| match command {
                Command::Uppercase => string.to_uppercase(),
                Command::Trim => string.trim().to_string(),
                Command::Append(n) => string + &"bar".repeat(n),
            })
            .collect()
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    // Import `transformer`.
    use super::my_module::transformer;

    use super::Command;
    use super::my_module::transformer_iter;

    #[test]
    fn it_works() {
        for transformer in [transformer, transformer_iter] {
            let input = vec![
                ("hello".to_string(), Command::Uppercase),
                (" all roads lead to rome! ".to_string(), Command::Trim),
                ("foo".to_string(), Command::Append(1)),
                ("bar".to_string(), Command::Append(5)),
            ];
            let output = transformer(input);

            assert_eq!(
                output,
                [
                    "HELLO",
                    "all roads lead to rome!",
                    "foobar",
                    "barbarbarbarbarbar",
                ]
            );
        }
    }
}
```

</details>

## quiz3

```rust
// This quiz tests:
// - Generics
// - Traits
//
// An imaginary magical school has a new report card generation system written
// in Rust! Currently, the system only supports creating report cards where the
// student's grade is represented numerically (e.g. 1.0 -> 5.5). However, the
// school also issues alphabetical grades (A+ -> F-) and needs to be able to
// print both types of report card!
//
// Make the necessary code changes in the struct `ReportCard` and the impl
// block to support alphabetical report cards in addition to numerical ones.

// TODO: Adjust the struct as described above.
struct ReportCard {
    grade: f32,
    student_name: String,
    student_age: u8,
}

// TODO: Adjust the impl block as described above.
impl ReportCard {
    fn print(&self) -> String {
        format!(
            "{} ({}) - achieved a grade of {}",
            self.student_name, self.student_age, self.grade,
        )
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generate_numeric_report_card() {
        let report_card = ReportCard {
            grade: 2.1,
            student_name: "Tom Wriggle".to_string(),
            student_age: 12,
        };
        assert_eq!(
            report_card.print(),
            "Tom Wriggle (12) - achieved a grade of 2.1",
        );
    }

    #[test]
    fn generate_alphabetic_report_card() {
        let report_card = ReportCard {
            grade: "A+",
            student_name: "Gary Plotter".to_string(),
            student_age: 11,
        };
        assert_eq!(
            report_card.print(),
            "Gary Plotter (11) - achieved a grade of A+",
        );
    }
}
```

<details><summary>Official hint</summary>

To find the best solution to this challenge, you need to recall your knowledge
of traits, specifically "Trait Bound Syntax":
https://doc.rust-lang.org/book/ch10-02-traits.html#trait-bound-syntax

Here is how to specify a trait bound for an implementation block:
`impl<T: Trait1 + Trait2 + …> for Foo<T> { … }`

You may need this:
`use std::fmt::Display;`

</details>

<details><summary>Official solution</summary>

```rust
// An imaginary magical school has a new report card generation system written
// in Rust! Currently, the system only supports creating report cards where the
// student's grade is represented numerically (e.g. 1.0 -> 5.5). However, the
// school also issues alphabetical grades (A+ -> F-) and needs to be able to
// print both types of report card!
//
// Make the necessary code changes in the struct `ReportCard` and the impl
// block to support alphabetical report cards in addition to numerical ones.

use std::fmt::Display;

// Make the struct generic over `T`.
struct ReportCard<T> {
    //           ^^^
    grade: T,
    //     ^
    student_name: String,
    student_age: u8,
}

// To be able to print the grade, it has to implement the `Display` trait.
impl<T: Display> ReportCard<T> {
    //  ^^^^^^^ require that `T` implements `Display`.
    fn print(&self) -> String {
        format!(
            "{} ({}) - achieved a grade of {}",
            self.student_name, self.student_age, self.grade,
        )
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generate_numeric_report_card() {
        let report_card = ReportCard {
            grade: 2.1,
            student_name: "Tom Wriggle".to_string(),
            student_age: 12,
        };
        assert_eq!(
            report_card.print(),
            "Tom Wriggle (12) - achieved a grade of 2.1",
        );
    }

    #[test]
    fn generate_alphabetic_report_card() {
        let report_card = ReportCard {
            grade: "A+",
            student_name: "Gary Plotter".to_string(),
            student_age: 11,
        };
        assert_eq!(
            report_card.print(),
            "Gary Plotter (11) - achieved a grade of A+",
        );
    }
}
```

</details>
