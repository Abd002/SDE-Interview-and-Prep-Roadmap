# devops-exercises: SQL

> Copied from <https://github.com/bregman-arie/devops-exercises#sql> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## SQL

### SQL Exercises

|Name|Topic|Objective & Instructions|Solution|Comments|
|--------|--------|------|----|----|
| Functions vs. Comparisons | Query Improvements | [Exercise](https://github.com/bregman-arie/devops-exercises/blob/master/topics/sql/improve_query.md) | [Solution](https://github.com/bregman-arie/devops-exercises/blob/master/topics/sql/solutions/improve_query.md)

### SQL Self Assessment

<details>
<summary>What is SQL?</summary><br><b>

SQL (Structured Query Language) is a standard language for relational databases (like MySQL, MariaDB, ...).<br>
It's used for reading, updating, removing and creating data in a relational database.
</b></details>

<details>
<summary>How is SQL Different from NoSQL</summary><br><b>

The main difference is that SQL databases are structured (data is stored in the form of
tables with rows and columns - like an excel spreadsheet table) while NoSQL is
unstructured, and the data storage can vary depending on how the NoSQL DB is set up, such
as key-value pair, document-oriented, etc.
</b></details>

<details>
<summary>When is it best to use SQL? NoSQL?</summary><br><b>

SQL - Best used when data integrity is crucial. SQL is typically implemented with many
businesses and areas within the finance field due to it's ACID compliance.

NoSQL - Great if you need to scale things quickly. NoSQL was designed with web applications
in mind, so it works great if you need to quickly spread the same information around to
multiple servers

Additionally, since NoSQL does not adhere to the strict table with columns and rows structure
that Relational Databases require, you can store different data types together.
</b></details>

##### Practical SQL - Basics

For these questions, we will be using the Customers and Orders tables shown below:

**Customers**

Customer_ID | Customer_Name | Items_in_cart | Cash_spent_to_Date
------------ | ------------- | ------------- | -------------
100204 | John Smith | 0 | 20.00
100205 | Jane Smith | 3 | 40.00
100206 | Bobby Frank | 1 | 100.20

**ORDERS**

Customer_ID | Order_ID | Item | Price | Date_sold
------------ | ------------- | ------------- | ------------- | -------------
100206 | A123 | Rubber Ducky | 2.20 | 2019-09-18
100206 | A123 | Bubble Bath | 8.00 | 2019-09-18
100206 | Q987 | 80-Pack TP | 90.00 | 2019-09-20
100205 | Z001 | Cat Food - Tuna Fish | 10.00 | 2019-08-05
100205 | Z001 | Cat Food - Chicken | 10.00 | 2019-08-05
100205 | Z001 | Cat Food - Beef | 10.00 | 2019-08-05
100205 | Z001 | Cat Food - Kitty quesadilla | 10.00 | 2019-08-05
100204 | X202 | Coffee | 20.00 | 2019-04-29

<details>
<summary>How would I select all fields from this table?</summary><br><b>

Select * <br>
From Customers;
</b></details>

<details>
<summary>How many items are in John's cart?</summary><br><b>

Select Items_in_cart <br>
From Customers <br>
Where Customer_Name = "John Smith";
</b></details>

<details>
<summary>What is the sum of all the cash spent across all customers?</summary><br><b>

Select SUM(Cash_spent_to_Date) as SUM_CASH <br>
From Customers;
</b></details>

<details>
<summary>How many people have items in their cart?</summary><br><b>

Select count(1) as Number_of_People_w_items <br>
From Customers <br>
where Items_in_cart > 0;
</b></details>

<details>
<summary>How would you join the customer table to the order table?</summary><br><b>

You would join them on the unique key. In this case, the unique key is Customer_ID in
both the Customers table and Orders table
</b></details>

<details>
<summary>How would you show which customer ordered which items?</summary><br><b>

Select c.Customer_Name, o.Item <br>
From Customers c <br>
Left Join Orders o <br>
  On c.Customer_ID = o.Customer_ID;

</b></details>

<details>
<summary>Using a with statement, how would you show who ordered cat food, and the total amount of money spent?</summary><br><b>

with cat_food as ( <br>
Select Customer_ID, SUM(Price) as TOTAL_PRICE <br>
From Orders <br>
Where Item like "%Cat Food%" <br>
Group by Customer_ID <br>
) <br>
Select Customer_name, TOTAL_PRICE <br>
From Customers c <br>
Inner JOIN cat_food f <br>
  ON c.Customer_ID = f.Customer_ID <br>
where c.Customer_ID in (Select Customer_ID from cat_food);

Although this was a simple statement, the "with" clause really shines when
a complex query needs to be run on a table before joining to another. With statements are nice,
because you create a pseudo temp when running your query, instead of creating a whole new table.

The Sum of all the purchases of cat food weren't readily available, so we used a with statement to create
the pseudo table to retrieve the sum of the prices spent by each customer, then join the table normally.
</b></details>

<details>
<summary>Which of the following queries would you use?

```
SELECT count(*)                             SELECT count(*)
FROM shawarma_purchases                     FROM shawarma_purchases
WHERE                               vs.     WHERE
  YEAR(purchased_at) == '2017'              purchased_at >= '2017-01-01' AND
                                            purchased_at <= '2017-31-12'
```
</summary><br><b>

```
SELECT count(*)
FROM shawarma_purchases
WHERE
  purchased_at >= '2017-01-01' AND
  purchased_at <= '2017-31-12'
```

When you use a function (`YEAR(purchased_at)`) it has to scan the whole database as opposed to using indexes and basically the column as it is, in its natural state.
</b></details>

