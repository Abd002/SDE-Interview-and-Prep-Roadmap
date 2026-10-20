# devops-exercises: Misc

> Copied from <https://github.com/bregman-arie/devops-exercises#misc> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Misc

|Name|Topic|Objective & Instructions|Solution|Comments|
|--------|--------|------|----|----|
| Highly Available "Hello World" | [Exercise](https://github.com/bregman-arie/devops-exercises/blob/master/topics/devops/ha_hello_world.md) | [Solution](https://github.com/bregman-arie/devops-exercises/blob/master/topics/devops/solutions/ha_hello_world.md)

<details>
<summary>What happens when you type in a URL in an address bar in a browser?</summary><br><b>

1. The browser searches for the record of the domain name IP address in the DNS in the following order:
  * Browser cache
  * Operating system cache
  * The DNS server configured on the user's system (can be ISP DNS, public DNS, ...)
2. If it couldn't find a DNS record locally, a full DNS resolution is started.
3. It connects to the server using the TCP protocol
4. The browser sends an HTTP request to the server
5. The server sends an HTTP response back to the browser
6. The browser renders the response (e.g. HTML)
7. The browser then sends subsequent requests as needed to the server to get the embedded links, javascript, images in the HTML and then steps 3 to 5 are repeated.

TODO: add more details!
</b></details>

#### API

<details>
<summary>Explain what is an API</summary><br><b>

I like this definition from [blog.christianposta.com](https://blog.christianposta.com/microservices/api-gateways-are-going-through-an-identity-crisis):

"An explicitly and purposefully defined interface designed to be invoked over a network that enables software developers to get programmatic access to data and functionality within an organization in a controlled and comfortable way."
</b></details>

<details>
<summary>What is an API specification?</summary><br><b>

From [swagger.io](https://swagger.io/resources/articles/difference-between-api-documentation-specification):

"An API specification provides a broad understanding of how an API behaves and how the API links with other APIs. It explains how the API functions and the results to expect when using the API"
</b></details>

<details>
<summary>True or False? API Definition is the same as API Specification</summary><br><b>

False. From [swagger.io](https://swagger.io/resources/articles/difference-between-api-documentation-specification):

"An API definition is similar to an API specification in that it provides an understanding of how an API is organized and how the API functions. But the API definition is aimed at machine consumption instead of human consumption of APIs."
</b></details>

<details>
<summary>What is an API gateway?</summary><br><b>

An API gateway is like the gatekeeper that controls how different parts talk to each other and how information is exchanged between them.

The API gateway provides a single point of entry for all clients, and it can perform several tasks, including routing requests to the appropriate backend service, load balancing, security and authentication, rate limiting, caching, and monitoring.

By using an API gateway, organizations can simplify the management of their APIs, ensure consistent security and governance, and improve the performance and scalability of their backend services. They are also commonly used in microservices architectures, where there are many small, independent services that need to be accessed by different clients.
</b></details>

<details>
<summary>What are the advantages of using/implementing an API gateway?</summary><br><b>

Advantages:

  - Simplifies API management: Provides a single entry point for all requests, which simplifies the management and monitoring of multiple APIs.
  - Improves security: Able to implement security features like authentication, authorization, and encryption to protect the backend services from unauthorized access.
  - Enhances scalability: Can handle traffic spikes and distribute requests to backend services in a way that maximizes resource utilization and improves overall system performance.
  - Enables service composition: Can combine different backend services into a single API, providing more granular control over the services that clients can access.
  - Facilitates integration with external systems:  Can be used to expose internal services to external partners or customers, making it easier to integrate with external systems and enabling new business models.

</b></details>

<details>
<summary>What is a Payload in API?</summary><br><b>
</b></details>

<details>
<summary>What is Automation? How it's related or different from Orchestration?</summary><br><b>

Automation is the act of automating tasks to reduce human intervention or interaction in regards to IT technology and systems.<br>
While automation focuses on a task level, Orchestration is the process of automating processes and/or workflows which consists of multiple tasks that usually across multiple systems.
</b></details>

<details>
<summary>Tell me about interesting bugs you've found and also fixed</summary><br><b>
</b></details>

<details>
<summary>What is a Debugger and how it works?</summary><br><b>
</b></details>

<details>
<summary>What services an application might have?</summary><br><b>

  * Authorization
  * Logging
  * Authentication
  * Ordering
  * Front-end
  * Back-end
  ...
</b></details>

<details>
<summary>What is Metadata?</summary><br><b>

Data about data. Basically, it describes the type of information that an underlying data will hold.
</b></details>

<details>
<summary>You can use one of the following formats: JSON, YAML, XML. Which one would you use? Why?</summary><br><b>

I can't answer this for you :)
</b></details>

<details>
<summary>What's KPI?</summary><br><b>
</b></details>

<details>
<summary>What's OKR?</summary><br><b>
</b></details>

<details>
<summary>What's DSL (Domain Specific Language)?</summary><br><b>

Domain Specific Language (DSLs) are used to create a customised language that represents the domain such that domain experts can easily interpret it.
</b></details>

<details>
<summary>What's the difference between KPI and OKR?</summary><br><b>
</b></details>

#### YAML

<details>
<summary>What is YAML?</summary><br><b>

Data serialization language used by many technologies today like Kubernetes, Ansible, etc.
</b></details>

<details>
<summary>True or False? Any valid JSON file is also a valid YAML file</summary><br><b>

True. Because YAML is superset of JSON.
</b></details>

<details>
<summary>What is the format of the following data?

```
{
    applications: [
        {
            name: "my_app",
            language: "python",
            version: 20.17
        }
    ]
}
```
</summary><br><b>
JSON
</b></details>

<details>
<summary>What is the format of the following data?

```
applications:
  - app: "my_app"
    language: "python"
    version: 20.17
```
</summary><br><b>
YAML
</b></details>

<details>
<summary>How to write a multi-line string with YAML? What use cases is it good for?</summary><br><b>

```
someMultiLineString: |
  look mama
  I can write a multi-line string
  I love YAML
```

It's good for use cases like writing a shell script where each line of the script is a different command.
</b></details>

<details>
<summary>What is the difference between <code>someMultiLineString: |</code> to <code>someMultiLineString: ></code>?</summary><br><b>

using `>` will make the multi-line string to fold into a single line

```
someMultiLineString: >
  This is actually
  a single line
  do not let appearances fool you
```
</b></details>

<details>
<summary>What are placeholders in YAML?</summary><br><b>

They allow you reference values instead of directly writing them and it is used like this:

```
username: {{ my.user_name }}
```
</b></details>

<details>
<summary>How can you define multiple YAML components in one file?</summary><br><b>

Using this: `---`
For Examples:

```
document_number: 1
---
document_number: 2
```
</b></details>

#### Firmware

<details>
<summary>Explain what is a firmware</summary><br><b>

[Wikipedia](https://en.wikipedia.org/wiki/Firmware): "In computing, firmware is a specific class of computer software that provides the low-level control for a device's specific hardware. Firmware, such as the BIOS of a personal computer, may contain basic functions of a device, and may provide hardware abstraction services to higher-level software such as operating systems."
</b></details>

