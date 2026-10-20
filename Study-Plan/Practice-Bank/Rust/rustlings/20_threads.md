# Rustlings: 20_threads

> Copied from <https://github.com/rust-lang/rustlings/tree/main/exercises/20_threads> (MIT, by the Rustlings contributors). Questions and answers are the source's own; nothing was answered or rewritten here.


# Threads

In most current operating systems, an executed program's code is run in a process, and the operating system manages multiple processes at once.
Within your program, you can also have independent parts that run simultaneously. The features that run these independent parts are called threads.

## Further information

- [Dining Philosophers example](https://doc.rust-lang.org/1.4.0/book/dining-philosophers.html)
- [Using Threads to Run Code Simultaneously](https://doc.rust-lang.org/book/ch16-01-threads.html)
- [Using Message Passing to Transfer Data Between Threads](https://doc.rust-lang.org/book/ch16-02-message-passing.html)


## threads1

```rust
// This program spawns multiple threads that each runs for at least 250ms, and
// each thread returns how much time it took to complete. The program should
// wait until all the spawned threads have finished and should collect their
// return values into a vector.

use std::{
    thread,
    time::{Duration, Instant},
};

fn main() {
    let mut handles = Vec::new();
    for i in 0..10 {
        let handle = thread::spawn(move || {
            let start = Instant::now();
            thread::sleep(Duration::from_millis(250));
            println!("Thread {i} done");
            start.elapsed().as_millis()
        });
        handles.push(handle);
    }

    let mut results = Vec::new();
    for handle in handles {
        // TODO: Collect the results of all threads into the `results` vector.
        // Use the `JoinHandle` struct which is returned by `thread::spawn`.
    }

    if results.len() != 10 {
        panic!("Oh no! Some thread isn't done yet!");
    }

    println!();
    for (i, result) in results.into_iter().enumerate() {
        println!("Thread {i} took {result}ms");
    }
}
```

<details><summary>Official hint</summary>

`JoinHandle` is a struct that is returned from a spawned thread:
https://doc.rust-lang.org/std/thread/fn.spawn.html

A challenge with multi-threaded applications is that the main thread can
finish before the spawned threads are done.
https://doc.rust-lang.org/book/ch16-01-threads.html#waiting-for-all-threads-to-finish-using-join-handles

Use the `JoinHandle`s to wait for each thread to finish and collect their
results.

https://doc.rust-lang.org/std/thread/struct.JoinHandle.html

</details>

<details><summary>Official solution</summary>

```rust
// This program spawns multiple threads that each runs for at least 250ms, and
// each thread returns how much time it took to complete. The program should
// wait until all the spawned threads have finished and should collect their
// return values into a vector.

use std::{
    thread,
    time::{Duration, Instant},
};

fn main() {
    let mut handles = Vec::new();
    for i in 0..10 {
        let handle = thread::spawn(move || {
            let start = Instant::now();
            thread::sleep(Duration::from_millis(250));
            println!("Thread {i} done");
            start.elapsed().as_millis()
        });
        handles.push(handle);
    }

    let mut results = Vec::new();
    for handle in handles {
        // Collect the results of all threads into the `results` vector.
        results.push(handle.join().unwrap());
    }

    if results.len() != 10 {
        panic!("Oh no! Some thread isn't done yet!");
    }

    println!();
    for (i, result) in results.into_iter().enumerate() {
        println!("Thread {i} took {result}ms");
    }
}
```

</details>

## threads2

```rust
// Building on the last exercise, we want all of the threads to complete their
// work. But this time, the spawned threads need to be in charge of updating a
// shared value: `JobStatus.jobs_done`

use std::{sync::Arc, thread, time::Duration};

struct JobStatus {
    jobs_done: u32,
}

fn main() {
    // TODO: `Arc` isn't enough if you want a **mutable** shared state.
    let status = Arc::new(JobStatus { jobs_done: 0 });

    let mut handles = Vec::new();
    for _ in 0..10 {
        let status_shared = Arc::clone(&status);
        let handle = thread::spawn(move || {
            thread::sleep(Duration::from_millis(250));

            // TODO: You must take an action before you update a shared value.
            status_shared.jobs_done += 1;
        });
        handles.push(handle);
    }

    // Waiting for all jobs to complete.
    for handle in handles {
        handle.join().unwrap();
    }

    // TODO: Print the value of `JobStatus.jobs_done`.
    println!("Jobs done: {}", todo!());
}
```

<details><summary>Official hint</summary>

`Arc` is an Atomic Reference Counted pointer that allows safe, shared access
to **immutable** data. But we want to *change* the number of `jobs_done` so
we'll need to also use another type that will only allow one thread to mutate
the data at a time. Take a look at this section of the book:
https://doc.rust-lang.org/book/ch16-03-shared-state.html#atomic-reference-counting-with-arct

Keep reading if you'd like more hints :)

Do you now have an `Arc<Mutex<JobStatus>>` at the beginning of `main`? Like:
```
let status = Arc::new(Mutex::new(JobStatus { jobs_done: 0 }));
```

Similar to the code in the following example in The Book:
https://doc.rust-lang.org/book/ch16-03-shared-state.html#sharing-a-mutext-between-multiple-threads

</details>

<details><summary>Official solution</summary>

```rust
// Building on the last exercise, we want all of the threads to complete their
// work. But this time, the spawned threads need to be in charge of updating a
// shared value: `JobStatus.jobs_done`

use std::{
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};

struct JobStatus {
    jobs_done: u32,
}

fn main() {
    // `Arc` isn't enough if you want a **mutable** shared state.
    // We need to wrap the value with a `Mutex`.
    let status = Arc::new(Mutex::new(JobStatus { jobs_done: 0 }));
    //                    ^^^^^^^^^^^                          ^

    let mut handles = Vec::new();
    for _ in 0..10 {
        let status_shared = Arc::clone(&status);
        let handle = thread::spawn(move || {
            thread::sleep(Duration::from_millis(250));

            // Lock before you update a shared value.
            status_shared.lock().unwrap().jobs_done += 1;
            //           ^^^^^^^^^^^^^^^^
        });
        handles.push(handle);
    }

    // Waiting for all jobs to complete.
    for handle in handles {
        handle.join().unwrap();
    }

    println!("Jobs done: {}", status.lock().unwrap().jobs_done);
    //                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
}
```

</details>

## threads3

```rust
use std::{sync::mpsc, thread, time::Duration};

struct Queue {
    first_half: Vec<u32>,
    second_half: Vec<u32>,
}

impl Queue {
    fn new() -> Self {
        Self {
            first_half: vec![1, 2, 3, 4, 5],
            second_half: vec![6, 7, 8, 9, 10],
        }
    }
}

fn send_tx(q: Queue, tx: mpsc::Sender<u32>) {
    // TODO: We want to send `tx` to both threads. But currently, it is moved
    // into the first thread. How could you solve this problem?
    thread::spawn(move || {
        for val in q.first_half {
            println!("Sending {val:?}");
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(250));
        }
    });

    thread::spawn(move || {
        for val in q.second_half {
            println!("Sending {val:?}");
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(250));
        }
    });
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn threads3() {
        let (tx, rx) = mpsc::channel();
        let queue = Queue::new();

        send_tx(queue, tx);

        let mut received = Vec::with_capacity(10);
        for value in rx {
            received.push(value);
        }

        received.sort();
        assert_eq!(received, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
}
```

<details><summary>Official hint</summary>

An alternate way to handle concurrency between threads is to use an `mpsc`
(multiple producer, single consumer) channel to communicate.

With both a sending end and a receiving end, it's possible to send values in
one thread and receive them in another.

Multiple producers are possible by using `clone()` to create a duplicate of the
original sending end.

Related section in The Book:
https://doc.rust-lang.org/book/ch16-02-message-passing.html

</details>

<details><summary>Official solution</summary>

```rust
use std::{sync::mpsc, thread, time::Duration};

struct Queue {
    first_half: Vec<u32>,
    second_half: Vec<u32>,
}

impl Queue {
    fn new() -> Self {
        Self {
            first_half: vec![1, 2, 3, 4, 5],
            second_half: vec![6, 7, 8, 9, 10],
        }
    }
}

fn send_tx(q: Queue, tx: mpsc::Sender<u32>) {
    // Clone the sender `tx` first.
    let tx_clone = tx.clone();
    thread::spawn(move || {
        for val in q.first_half {
            println!("Sending {val:?}");
            // Then use the clone in the first thread. This means that
            // `tx_clone` is moved to the first thread and `tx` to the second.
            tx_clone.send(val).unwrap();
            thread::sleep(Duration::from_millis(250));
        }
    });

    thread::spawn(move || {
        for val in q.second_half {
            println!("Sending {val:?}");
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(250));
        }
    });
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn threads3() {
        let (tx, rx) = mpsc::channel();
        let queue = Queue::new();

        send_tx(queue, tx);

        let mut received = Vec::with_capacity(10);
        for value in rx {
            received.push(value);
        }

        received.sort();
        assert_eq!(received, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
}
```

</details>
