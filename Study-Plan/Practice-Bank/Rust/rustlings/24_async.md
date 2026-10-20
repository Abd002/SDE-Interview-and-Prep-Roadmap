# Rustlings: 24_async

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/24_async> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Async

Asynchronous programming is a model where tasks are delegated to a runtime that executes them concurrently.
It is particularly efficient for applications where many independent IO-operations are performed, e.g. web servers.

Rust provides the necessary primitives to do asynchronous programming in the language.
However, Rust's standard library does not include a runtime.
For these exercises, we will use the mainstream runtime called `tokio`.

## Further information

- [Fundamentals of Asynchronous Programming](https://doc.rust-lang.org/book/ch17-00-async-await.html)
- [Tokio documentation](https://docs.rs/tokio/latest/tokio/)


## async1

```rust
// Alice is an elementary school teacher who needs to calculate the mean test
// score for three classes she teaches. Instead of calculating them one after
// the other, she decides to ask her friends Bob and Catherine for help. Working
// together, they can finish the job much faster.
//
// Let's simulate this using asynchronous programming. Each person is
// represented as an asynchronous task, which can be executed concurrently.

// Async tasks need to be executed by a "runtime", which is not provided by
// Rust's standard library. Here, we use the mainstream runtime `tokio`.
// The macro `tokio::main` wraps the entire main function in a runtime.
#[tokio::main]
async fn main() {
    let mean_score_a = tokio::spawn(calculate_mean_score("scores_class_a.txt"));
    let mean_score_b = tokio::spawn(calculate_mean_score("scores_class_b.txt"));
    let mean_score_c = tokio::spawn(calculate_mean_score("scores_class_c.txt"));

    // TODO: Await the spawned tasks to check their results.
    assert_eq!(mean_score_a, 84); // alice
    assert_eq!(mean_score_b, 89); // bob
    assert_eq!(mean_score_c, 76); // catherine
}

// TODO: Fix the compiler errors by making the spawned function async.
fn calculate_mean_score(scores_file: &str) -> usize {
    // Read the file asynchronously
    let file = tokio::fs::read_to_string(scores_file).await.unwrap();

    // Initialize the sum and the number of scores
    let mut sum = 0;
    let mut n = 0;
    for line in file.lines() {
        // Parse every line as a score
        let score = line.parse::<usize>().unwrap();
        sum += score;
        n += 1;
    }

    sum / n
}
```

<details><summary>Official hint</summary>

Asynchronous runtimes like tokio can only spawn tasks that are defined as async
functions, not regular ones. Add the "async" keyword before the "fn" keyword of
the functions "tim", "carl" and "nick".

An async task can wait for another one to complete by "awaiting" it. Add
".await" after the three "task_name" variables in the "block_on" call.

</details>

<details><summary>Official solution</summary>

```rust
// Alice is an elementary school teacher who needs to calculate the mean test
// score for three classes she teaches. Instead of calculating them one after
// the other, she decides to ask her friends Bob and Catherine for help. Working
// together, they can finish the job much faster.
//
// Let's simulate this using asynchronous programming. Each person is
// represented as an asynchronous task, which can be executed concurrently.

// Async tasks need to be executed by a "runtime", which is not provided by
// Rust's standard library. Here, we use the mainstream runtime `tokio`.
// The macro `tokio::main` wraps the entire main function in a runtime.
#[tokio::main]
async fn main() {
    let mean_score_a = tokio::spawn(calculate_mean_score("scores_class_a.txt"));
    let mean_score_b = tokio::spawn(calculate_mean_score("scores_class_b.txt"));
    let mean_score_c = tokio::spawn(calculate_mean_score("scores_class_c.txt"));

    assert_eq!(mean_score_a.await.unwrap(), 84); // alice
    assert_eq!(mean_score_b.await.unwrap(), 89); // bob
    assert_eq!(mean_score_c.await.unwrap(), 76); // catherine
}

async fn calculate_mean_score(scores_file: &str) -> usize {
    // Read the file asynchronously
    let file = tokio::fs::read_to_string(scores_file).await.unwrap();

    // Initialize the sum and the number of scores
    let mut sum = 0;
    let mut n = 0;
    for line in file.lines() {
        // Parse every line as a score
        let score = line.parse::<usize>().unwrap();
        sum += score;
        n += 1;
    }

    sum / n
}
```

</details>
