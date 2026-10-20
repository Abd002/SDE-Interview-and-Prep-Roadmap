# Rustlings: 18_iterators

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/18_iterators> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Iterators

This section will teach you about Iterators.

## Further information

- [Iterator](https://doc.rust-lang.org/book/ch13-02-iterators.html)
- [Iterator documentation](https://doc.rust-lang.org/stable/std/iter/)


## iterators1

```rust
// When performing operations on elements within a collection, iterators are
// essential. This module helps you get familiar with the structure of using an
// iterator and how to go through elements within an iterable collection.

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn iterators() {
        let my_fav_fruits = &["banana", "custard apple", "avocado", "peach", "raspberry"];

        // TODO: Create an iterator over the slice.
        let mut fav_fruits_iterator = todo!();

        assert_eq!(fav_fruits_iterator.next(), Some(&"banana"));
        assert_eq!(fav_fruits_iterator.next(), todo!()); // TODO: Replace `todo!()`
        assert_eq!(fav_fruits_iterator.next(), Some(&"avocado"));
        assert_eq!(fav_fruits_iterator.next(), todo!()); // TODO: Replace `todo!()`
        assert_eq!(fav_fruits_iterator.next(), Some(&"raspberry"));
        assert_eq!(fav_fruits_iterator.next(), todo!()); // TODO: Replace `todo!()`
    }
}
```

<details><summary>Official hint</summary>

An iterator goes through all elements in a collection, but what if we've run
out of elements? What should we expect here? If you're stuck, take a look at
https://doc.rust-lang.org/std/iter/trait.Iterator.html

</details>

<details><summary>Official solution</summary>

```rust
// When performing operations on elements within a collection, iterators are
// essential. This module helps you get familiar with the structure of using an
// iterator and how to go through elements within an iterable collection.

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn iterators() {
        let my_fav_fruits = &["banana", "custard apple", "avocado", "peach", "raspberry"];

        // Create an iterator over the slice.
        let mut fav_fruits_iterator = my_fav_fruits.iter();

        assert_eq!(fav_fruits_iterator.next(), Some(&"banana"));
        assert_eq!(fav_fruits_iterator.next(), Some(&"custard apple"));
        assert_eq!(fav_fruits_iterator.next(), Some(&"avocado"));
        assert_eq!(fav_fruits_iterator.next(), Some(&"peach"));
        assert_eq!(fav_fruits_iterator.next(), Some(&"raspberry"));
        assert_eq!(fav_fruits_iterator.next(), None);
        //                                     ^^^^ reached the end
    }
}
```

</details>

## iterators2

```rust
// In this exercise, you'll learn some of the unique advantages that iterators
// can offer.

// TODO: Complete the `capitalize_first` function.
// "hello" -> "Hello"
fn capitalize_first(input: &str) -> String {
    let mut chars = input.chars();
    match chars.next() {
        None => String::new(),
        Some(first) => todo!(),
    }
}

// TODO: Apply the `capitalize_first` function to a slice of string slices.
// Return a vector of strings.
// ["hello", "world"] -> ["Hello", "World"]
fn capitalize_words_vector(words: &[&str]) -> Vec<String> {
    // ???
}

// TODO: Apply the `capitalize_first` function again to a slice of string
// slices. Return a single string.
// ["hello", " ", "world"] -> "Hello World"
fn capitalize_words_string(words: &[&str]) -> String {
    // ???
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_success() {
        assert_eq!(capitalize_first("hello"), "Hello");
    }

    #[test]
    fn test_empty() {
        assert_eq!(capitalize_first(""), "");
    }

    #[test]
    fn test_iterate_string_vec() {
        let words = vec!["hello", "world"];
        assert_eq!(capitalize_words_vector(&words), ["Hello", "World"]);
    }

    #[test]
    fn test_iterate_into_string() {
        let words = vec!["hello", " ", "world"];
        assert_eq!(capitalize_words_string(&words), "Hello World");
    }
}
```

<details><summary>Official hint</summary>

`capitalize_first`:

The variable `first` is a `char`. It needs to be capitalized and added to the
remaining characters in `chars` in order to return the correct `String`.

The remaining characters in `chars` can be viewed as a string slice using the
`as_str` method.

The documentation for `char` contains many useful methods.
https://doc.rust-lang.org/std/primitive.char.html

Use `char::to_uppercase`. It returns an iterator that can be converted to a
`String`.

`capitalize_words_vector`:

Create an iterator from the slice. Transform the iterated values by applying
the `capitalize_first` function. Remember to `collect` the iterator.

`capitalize_words_string`:

This is surprisingly similar to the previous solution. `collect` is very
powerful and very general. Rust just needs to know the desired type.

</details>

<details><summary>Official solution</summary>

```rust
// In this exercise, you'll learn some of the unique advantages that iterators
// can offer.

// "hello" -> "Hello"
fn capitalize_first(input: &str) -> String {
    let mut chars = input.chars();
    match chars.next() {
        None => String::new(),
        Some(first) => first.to_uppercase().to_string() + chars.as_str(),
    }
}

// Apply the `capitalize_first` function to a slice of string slices.
// Return a vector of strings.
// ["hello", "world"] -> ["Hello", "World"]
fn capitalize_words_vector(words: &[&str]) -> Vec<String> {
    words.iter().map(|word| capitalize_first(word)).collect()
}

// Apply the `capitalize_first` function again to a slice of string
// slices. Return a single string.
// ["hello", " ", "world"] -> "Hello World"
fn capitalize_words_string(words: &[&str]) -> String {
    words.iter().map(|word| capitalize_first(word)).collect()
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_success() {
        assert_eq!(capitalize_first("hello"), "Hello");
    }

    #[test]
    fn test_empty() {
        assert_eq!(capitalize_first(""), "");
    }

    #[test]
    fn test_iterate_string_vec() {
        let words = vec!["hello", "world"];
        assert_eq!(capitalize_words_vector(&words), ["Hello", "World"]);
    }

    #[test]
    fn test_iterate_into_string() {
        let words = vec!["hello", " ", "world"];
        assert_eq!(capitalize_words_string(&words), "Hello World");
    }
}
```

</details>

## iterators3

```rust
#[derive(Debug, PartialEq, Eq)]
enum DivisionError {
    // Example: 42 / 0
    DivideByZero,
    // Only case for `i64`: `i64::MIN / -1` because the result is `i64::MAX + 1`
    IntegerOverflow,
    // Example: 5 / 2 = 2.5
    NotDivisible,
}

// TODO: Calculate `a` divided by `b` if `a` is evenly divisible by `b`.
// Otherwise, return a suitable error.
fn divide(a: i64, b: i64) -> Result<i64, DivisionError> {
    todo!();
}

// TODO: Add the correct return type and complete the function body.
// Desired output: `Ok([1, 11, 1426, 3])`
fn result_with_list() {
    let numbers = [27, 297, 38502, 81];
    let division_results = numbers.into_iter().map(|n| divide(n, 27));
}

// TODO: Add the correct return type and complete the function body.
// Desired output: `[Ok(1), Ok(11), Ok(1426), Ok(3)]`
fn list_of_results() {
    let numbers = [27, 297, 38502, 81];
    let division_results = numbers.into_iter().map(|n| divide(n, 27));
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_success() {
        assert_eq!(divide(81, 9), Ok(9));
        assert_eq!(divide(81, -1), Ok(-81));
        assert_eq!(divide(i64::MIN, i64::MIN), Ok(1));
    }

    #[test]
    fn test_divide_by_0() {
        assert_eq!(divide(81, 0), Err(DivisionError::DivideByZero));
    }

    #[test]
    fn test_integer_overflow() {
        assert_eq!(divide(i64::MIN, -1), Err(DivisionError::IntegerOverflow));
    }

    #[test]
    fn test_not_divisible() {
        assert_eq!(divide(81, 6), Err(DivisionError::NotDivisible));
    }

    #[test]
    fn test_divide_0_by_something() {
        assert_eq!(divide(0, 81), Ok(0));
    }

    #[test]
    fn test_result_with_list() {
        assert_eq!(result_with_list().unwrap(), [1, 11, 1426, 3]);
    }

    #[test]
    fn test_list_of_results() {
        assert_eq!(list_of_results(), [Ok(1), Ok(11), Ok(1426), Ok(3)]);
    }
}
```

<details><summary>Official hint</summary>

The `divide` function needs to return the correct error when the divisor is 0 or
when even division is not possible.

The `division_results` variable needs to be collected into a collection type.

The `result_with_list` function needs to return a single `Result` where the
success case is a vector of integers and the failure case is a `DivisionError`.

The `list_of_results` function needs to return a vector of results.

See https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.collect for
how the `FromIterator` trait is used in `collect()`. This trait is REALLY
powerful! It can make the solution to this exercise much easier.

</details>

<details><summary>Official solution</summary>

```rust
#[derive(Debug, PartialEq, Eq)]
enum DivisionError {
    // Example: 42 / 0
    DivideByZero,
    // Only case for `i64`: `i64::MIN / -1` because the result is `i64::MAX + 1`
    IntegerOverflow,
    // Example: 5 / 2 = 2.5
    NotDivisible,
}

fn divide(a: i64, b: i64) -> Result<i64, DivisionError> {
    if b == 0 {
        return Err(DivisionError::DivideByZero);
    }

    if a == i64::MIN && b == -1 {
        return Err(DivisionError::IntegerOverflow);
    }

    if a % b != 0 {
        return Err(DivisionError::NotDivisible);
    }

    Ok(a / b)
}

fn result_with_list() -> Result<Vec<i64>, DivisionError> {
    //                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    let numbers = [27, 297, 38502, 81];
    let division_results = numbers.into_iter().map(|n| divide(n, 27));
    // Collects to the expected return type. Returns the first error in the
    // division results (if one exists).
    division_results.collect()
}

fn list_of_results() -> Vec<Result<i64, DivisionError>> {
    //               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    let numbers = [27, 297, 38502, 81];
    let division_results = numbers.into_iter().map(|n| divide(n, 27));
    // Collects to the expected return type.
    division_results.collect()
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_success() {
        assert_eq!(divide(81, 9), Ok(9));
        assert_eq!(divide(81, -1), Ok(-81));
        assert_eq!(divide(i64::MIN, i64::MIN), Ok(1));
    }

    #[test]
    fn test_divide_by_0() {
        assert_eq!(divide(81, 0), Err(DivisionError::DivideByZero));
    }

    #[test]
    fn test_integer_overflow() {
        assert_eq!(divide(i64::MIN, -1), Err(DivisionError::IntegerOverflow));
    }

    #[test]
    fn test_not_divisible() {
        assert_eq!(divide(81, 6), Err(DivisionError::NotDivisible));
    }

    #[test]
    fn test_divide_0_by_something() {
        assert_eq!(divide(0, 81), Ok(0));
    }

    #[test]
    fn test_result_with_list() {
        assert_eq!(result_with_list().unwrap(), [1, 11, 1426, 3]);
    }

    #[test]
    fn test_list_of_results() {
        assert_eq!(list_of_results(), [Ok(1), Ok(11), Ok(1426), Ok(3)]);
    }
}
```

</details>

## iterators4

```rust
fn factorial(num: u64) -> u64 {
    // TODO: Complete this function to return the factorial of `num` which is
    // defined as `1 * 2 * 3 * … * num`.
    // https://en.wikipedia.org/wiki/Factorial
    //
    // Do not use:
    // - early returns (using the `return` keyword explicitly)
    // Try not to use:
    // - imperative style loops (for/while)
    // - additional variables
    // For an extra challenge, don't use:
    // - recursion
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn factorial_of_0() {
        assert_eq!(factorial(0), 1);
    }

    #[test]
    fn factorial_of_1() {
        assert_eq!(factorial(1), 1);
    }
    #[test]
    fn factorial_of_2() {
        assert_eq!(factorial(2), 2);
    }

    #[test]
    fn factorial_of_4() {
        assert_eq!(factorial(4), 24);
    }
}
```

<details><summary>Official hint</summary>

In an imperative language, you might write a `for` loop that updates a mutable
variable. Or, you might write code utilizing recursion and a match clause. In
Rust, you can take another functional approach, computing the factorial
elegantly with ranges and iterators.

Check out the `fold` and `rfold` methods!

</details>

<details><summary>Official solution</summary>

```rust
// 3 possible solutions are presented.

// With `for` loop and a mutable variable.
fn factorial_for(num: u64) -> u64 {
    let mut result = 1;

    for x in 2..=num {
        result *= x;
    }

    result
}

// Equivalent to `factorial_for` but shorter and without a `for` loop and
// mutable variables.
fn factorial_fold(num: u64) -> u64 {
    // Case num==0: The iterator 2..=0 is empty
    //              -> The initial value of `fold` is returned which is 1.
    // Case num==1: The iterator 2..=1 is also empty
    //              -> The initial value 1 is returned.
    // Case num==2: The iterator 2..=2 contains one element
    //              -> The initial value 1 is multiplied by 2 and the result
    //                 is returned.
    // Case num==3: The iterator 2..=3 contains 2 elements
    //              -> 1 * 2 is calculated, then the result 2 is multiplied by
    //                 the second element 3 so the result 6 is returned.
    // And so on…
    #[allow(clippy::unnecessary_fold)]
    (2..=num).fold(1, |acc, x| acc * x)
}

// Equivalent to `factorial_fold` but with a built-in method that is suggested
// by Clippy.
fn factorial_product(num: u64) -> u64 {
    (2..=num).product()
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn factorial_of_0() {
        assert_eq!(factorial_for(0), 1);
        assert_eq!(factorial_fold(0), 1);
        assert_eq!(factorial_product(0), 1);
    }

    #[test]
    fn factorial_of_1() {
        assert_eq!(factorial_for(1), 1);
        assert_eq!(factorial_fold(1), 1);
        assert_eq!(factorial_product(1), 1);
    }
    #[test]
    fn factorial_of_2() {
        assert_eq!(factorial_for(2), 2);
        assert_eq!(factorial_fold(2), 2);
        assert_eq!(factorial_product(2), 2);
    }

    #[test]
    fn factorial_of_4() {
        assert_eq!(factorial_for(4), 24);
        assert_eq!(factorial_fold(4), 24);
        assert_eq!(factorial_product(4), 24);
    }
}
```

</details>

## iterators5

```rust
// Let's define a simple model to track Rustlings' exercise progress. Progress
// will be modelled using a hash map. The name of the exercise is the key and
// the progress is the value. Two counting functions were created to count the
// number of exercises with a given progress. Recreate this counting
// functionality using iterators. Try to not use imperative loops (for/while).

use std::collections::HashMap;

#[derive(Clone, Copy, PartialEq, Eq)]
enum Progress {
    None,
    Some,
    Complete,
}

fn count_for(map: &HashMap<String, Progress>, value: Progress) -> usize {
    let mut count = 0;
    for val in map.values() {
        if *val == value {
            count += 1;
        }
    }
    count
}

// TODO: Implement the functionality of `count_for` but with an iterator instead
// of a `for` loop.
fn count_iterator(map: &HashMap<String, Progress>, value: Progress) -> usize {
    // `map` is a hash map with `String` keys and `Progress` values.
    // map = { "variables1": Complete, "conversions3": None, … }
}

fn count_collection_for(collection: &[HashMap<String, Progress>], value: Progress) -> usize {
    let mut count = 0;
    for map in collection {
        for val in map.values() {
            if *val == value {
                count += 1;
            }
        }
    }
    count
}

// TODO: Implement the functionality of `count_collection_for` but with an
// iterator instead of a `for` loop.
fn count_collection_iterator(collection: &[HashMap<String, Progress>], value: Progress) -> usize {
    // `collection` is a slice of hash maps.
    // collection = [{ "variables1": Complete, "conversions3": None, … },
    //               { "variables2": Complete, … }, … ]
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_map() -> HashMap<String, Progress> {
        use Progress::*;

        let mut map = HashMap::new();
        map.insert(String::from("variables1"), Complete);
        map.insert(String::from("functions1"), Complete);
        map.insert(String::from("hashmaps1"), Complete);
        map.insert(String::from("smart_pointers3"), Some);
        map.insert(String::from("conversions5"), None);
        map.insert(String::from("conversions3"), None);

        map
    }

    fn get_vec_map() -> Vec<HashMap<String, Progress>> {
        use Progress::*;

        let map = get_map();

        let mut other = HashMap::new();
        other.insert(String::from("variables2"), Complete);
        other.insert(String::from("functions2"), Complete);
        other.insert(String::from("if1"), Complete);
        other.insert(String::from("conversions2"), None);
        other.insert(String::from("conversions4"), None);

        vec![map, other]
    }

    #[test]
    fn count_complete() {
        let map = get_map();
        assert_eq!(count_iterator(&map, Progress::Complete), 3);
    }

    #[test]
    fn count_some() {
        let map = get_map();
        assert_eq!(count_iterator(&map, Progress::Some), 1);
    }

    #[test]
    fn count_none() {
        let map = get_map();
        assert_eq!(count_iterator(&map, Progress::None), 2);
    }

    #[test]
    fn count_complete_equals_for() {
        let map = get_map();
        let progress_states = [Progress::Complete, Progress::Some, Progress::None];
        for progress_state in progress_states {
            assert_eq!(
                count_for(&map, progress_state),
                count_iterator(&map, progress_state),
            );
        }
    }

    #[test]
    fn count_collection_complete() {
        let collection = get_vec_map();
        assert_eq!(
            count_collection_iterator(&collection, Progress::Complete),
            6,
        );
    }

    #[test]
    fn count_collection_some() {
        let collection = get_vec_map();
        assert_eq!(count_collection_iterator(&collection, Progress::Some), 1);
    }

    #[test]
    fn count_collection_none() {
        let collection = get_vec_map();
        assert_eq!(count_collection_iterator(&collection, Progress::None), 4);
    }

    #[test]
    fn count_collection_equals_for() {
        let collection = get_vec_map();
        let progress_states = [Progress::Complete, Progress::Some, Progress::None];

        for progress_state in progress_states {
            assert_eq!(
                count_collection_for(&collection, progress_state),
                count_collection_iterator(&collection, progress_state),
            );
        }
    }
}
```

<details><summary>Official hint</summary>

The documentation for the `std::iter::Iterator` trait contains numerous methods
that would be helpful here.

The `collection` variable in `count_collection_iterator` is a slice of
`HashMap`s. It needs to be converted into an iterator in order to use the
iterator methods.

The `fold` method can be useful in the `count_collection_iterator` function.

For a further challenge, consult the documentation for `Iterator` to find
a different method that could make your code more compact than using `fold`.

</details>

<details><summary>Official solution</summary>

```rust
// Let's define a simple model to track Rustlings' exercise progress. Progress
// will be modelled using a hash map. The name of the exercise is the key and
// the progress is the value. Two counting functions were created to count the
// number of exercises with a given progress. Recreate this counting
// functionality using iterators. Try to not use imperative loops (for/while).

use std::collections::HashMap;

#[derive(Clone, Copy, PartialEq, Eq)]
enum Progress {
    None,
    Some,
    Complete,
}

fn count_for(map: &HashMap<String, Progress>, value: Progress) -> usize {
    let mut count = 0;
    for val in map.values() {
        if *val == value {
            count += 1;
        }
    }
    count
}

fn count_iterator(map: &HashMap<String, Progress>, value: Progress) -> usize {
    // `map` is a hash map with `String` keys and `Progress` values.
    // map = { "variables1": Complete, "conversions3": None, … }
    map.values().filter(|val| **val == value).count()
}

fn count_collection_for(collection: &[HashMap<String, Progress>], value: Progress) -> usize {
    let mut count = 0;
    for map in collection {
        count += count_for(map, value);
    }
    count
}

fn count_collection_iterator(collection: &[HashMap<String, Progress>], value: Progress) -> usize {
    // `collection` is a slice of hash maps.
    // collection = [{ "variables1": Complete, "conversions3": None, … },
    //               { "variables2": Complete, … }, … ]
    collection
        .iter()
        .map(|map| count_iterator(map, value))
        .sum()
}

// Equivalent to `count_collection_iterator` and `count_iterator`, iterating as
// if the collection was a single container instead of a container of containers
// (and more accurately, a single iterator instead of an iterator of iterators).
fn count_collection_iterator_flat(
    collection: &[HashMap<String, Progress>],
    value: Progress,
) -> usize {
    // `collection` is a slice of hash maps.
    // collection = [{ "variables1": Complete, "conversions3": None, … },
    //               { "variables2": Complete, … }, … ]
    collection
        .iter()
        .flat_map(HashMap::values) // or just `.flatten()` when wanting the default iterator (`HashMap::iter`)
        .filter(|val| **val == value)
        .count()
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;
    use Progress::*;

    fn get_map() -> HashMap<String, Progress> {
        let mut map = HashMap::new();
        map.insert(String::from("variables1"), Complete);
        map.insert(String::from("functions1"), Complete);
        map.insert(String::from("hashmaps1"), Complete);
        map.insert(String::from("smart_pointers3"), Some);
        map.insert(String::from("conversions5"), None);
        map.insert(String::from("conversions3"), None);

        map
    }

    fn get_vec_map() -> Vec<HashMap<String, Progress>> {
        let map = get_map();

        let mut other = HashMap::new();
        other.insert(String::from("variables2"), Complete);
        other.insert(String::from("functions2"), Complete);
        other.insert(String::from("if1"), Complete);
        other.insert(String::from("conversions2"), None);
        other.insert(String::from("conversions4"), None);

        vec![map, other]
    }

    #[test]
    fn count_complete() {
        let map = get_map();
        assert_eq!(count_iterator(&map, Complete), 3);
    }

    #[test]
    fn count_some() {
        let map = get_map();
        assert_eq!(count_iterator(&map, Some), 1);
    }

    #[test]
    fn count_none() {
        let map = get_map();
        assert_eq!(count_iterator(&map, None), 2);
    }

    #[test]
    fn count_complete_equals_for() {
        let map = get_map();
        let progress_states = [Complete, Some, None];
        for progress_state in progress_states {
            assert_eq!(
                count_for(&map, progress_state),
                count_iterator(&map, progress_state),
            );
        }
    }

    #[test]
    fn count_collection_complete() {
        let collection = get_vec_map();
        assert_eq!(count_collection_iterator(&collection, Complete), 6);
        assert_eq!(count_collection_iterator_flat(&collection, Complete), 6);
    }

    #[test]
    fn count_collection_some() {
        let collection = get_vec_map();
        assert_eq!(count_collection_iterator(&collection, Some), 1);
        assert_eq!(count_collection_iterator_flat(&collection, Some), 1);
    }

    #[test]
    fn count_collection_none() {
        let collection = get_vec_map();
        assert_eq!(count_collection_iterator(&collection, None), 4);
        assert_eq!(count_collection_iterator_flat(&collection, None), 4);
    }

    #[test]
    fn count_collection_equals_for() {
        let collection = get_vec_map();
        let progress_states = [Complete, Some, None];

        for progress_state in progress_states {
            assert_eq!(
                count_collection_for(&collection, progress_state),
                count_collection_iterator(&collection, progress_state),
            );
            assert_eq!(
                count_collection_for(&collection, progress_state),
                count_collection_iterator_flat(&collection, progress_state),
            );
        }
    }
}
```

</details>
