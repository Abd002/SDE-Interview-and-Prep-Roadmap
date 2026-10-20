# ByteByteGo System Design 101: How to Design Stack Overflow

> Copied from <https://github.com/ByteByteGoHq/system-design-101> (CC BY-NC-ND 4.0, by ByteByteGo). Questions and answers are the source's own; nothing was answered or rewritten here.


![Image](images/0343-stack-overflow-architecture.webp)

If your answer is on-premise servers and monolith, you would likely fail the interview, but that's how it is built in reality!

**What people think it should look like**
The interviewer is probably expecting something on the left side.

*   Microservice is used to decompose the system into small components.
*   Each service has its own database. Use cache heavily.
*   The service is sharded.
*   The services talk to each other asynchronously through message queues.
*   The service is implemented using Event Sourcing with CQRS.
*   Showing off knowledge in distributed systems such as eventual consistency, CAP theorem, etc.

**What it actually is**
Stack Overflow serves all the traffic with only 9 on-premise web servers, and it’s on monolith! It has its own servers and does not run on the cloud.

This is contrary to all our popular beliefs these days.
