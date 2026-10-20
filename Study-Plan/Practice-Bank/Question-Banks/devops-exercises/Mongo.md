# devops-exercises: Mongo

> Copied from <https://github.com/bregman-arie/devops-exercises#mongo> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Mongo

<details>
<summary>What are the advantages of MongoDB? Or in other words, why choosing MongoDB and not other implementation of NoSQL?</summary><br><b>

MongoDB advantages are as following:
- Schemaless
- Easy to scale-out
- No complex joins
- Structure of a single object is clear

</b></details>

<details>
<summary>What is the difference between SQL and NoSQL?</summary><br><b>

The main difference is that SQL databases are structured (data is stored in the form of
tables with rows and columns - like an excel spreadsheet table) while NoSQL is
unstructured, and the data storage can vary depending on how the NoSQL DB is set up, such
as key-value pair, document-oriented, etc.
</b></details>

<details>
<summary>In what scenarios would you prefer to use NoSQL/Mongo over SQL?</summary><br><b>

  * Heterogeneous data which changes often
  * Data consistency and integrity is not top priority
  * Best if the database needs to scale rapidly
</b></details>

<details>
<summary>What is a document? What is a collection?</summary><br><b>

  * A document is a record in MongoDB, which is stored in BSON (Binary JSON) format and is the basic unit of data in MongoDB.
  * A collection is a group of related documents stored in a single database in MongoDB.
</b></details>

<details>
<summary>What is an aggregator?</summary><br><b>

  * An aggregator is a framework in MongoDB that performs operations on a set of data to return a single computed result.
</b></details>

<details>
<summary>What is better? Embedded documents or referenced?</summary><br><b>

  * There is no definitive answer to which is better, it depends on the specific use case and requirements. Some explanations : Embedded documents provide atomic updates, while referenced documents allow for better normalization.
</b></details>

<details>
<summary>Have you performed data retrieval optimizations in Mongo? If not, can you think about ways to optimize a slow data retrieval?</summary><br><b>

  * Some ways to optimize data retrieval in MongoDB are: indexing, proper schema design, query optimization and database load balancing.
</b></details>

##### Queries

<details>
<summary>Explain this query: <code>db.books.find({"name": /abc/})</code></summary><br><b>
</b></details>

<details>
<summary>Explain this query: <code>db.books.find().sort({x:1})</code></summary><br><b>
</b></details>

<details>
<summary>What is the difference between find() and find_one()?</code></summary><br><b>
	
  * `find()` returns all documents that match the query conditions.
  * find_one() returns only one document that matches the query conditions (or null if no match is found).
</b></details>

<details>
<summary>How can you export data from Mongo DB?</code></summary><br><b>

* mongoexport
* programming languages
</b></details>

