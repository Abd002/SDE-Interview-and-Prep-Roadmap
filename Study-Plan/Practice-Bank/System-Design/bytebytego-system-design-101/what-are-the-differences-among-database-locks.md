# ByteByteGo System Design 101: Database Locks Explained

> Copied from <https://github.com/ByteByteGoHq/system-design-101> (CC BY-NC-ND 4.0, by ByteByteGo). Questions and answers are the source's own; nothing was answered or rewritten here.


![](images/0022-9-types-of-database-locks.webp)

In database management, locks are mechanisms that prevent concurrent access to data to ensure data integrity and consistency.

## Common Types of Locks

Here are the common types of locks used in databases:

*   **Shared Lock (S Lock)**

    It allows multiple transactions to read a resource simultaneously but not modify it. Other transactions can also acquire a shared lock on the same resource.

*   **Exclusive Lock (X Lock)**

    It allows a transaction to both read and modify a resource. No other transaction can acquire any type of lock on the same resource while an exclusive lock is held.

*   **Update Lock (U Lock)**

    It is used to prevent a deadlock scenario when a transaction intends to update a resource.

*   **Schema Lock**

    It is used to protect the structure of database objects.

*   **Bulk Update Lock (BU Lock)**

    It is used during bulk insert operations to improve performance by reducing the number of locks required.

*   **Key-Range Lock**

    It is used in indexed data to prevent phantom reads (inserting new rows into a range that a transaction has already read).

*   **Row-Level Lock**

    It locks a specific row in a table, allowing other rows to be accessed concurrently.

*   **Page-Level Lock**

    It locks a specific page (a fixed-size block of data) in the database.

*   **Table-Level Lock**

    It locks an entire table. This is simple to implement but can reduce concurrency significantly.
