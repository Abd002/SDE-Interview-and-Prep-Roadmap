# PortSwigger labs: websockets

> Copied from <https://portswigger.net/web-security/websockets>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Manipulating the WebSocket handshake to exploit vulnerabilities

[Open the lab](https://portswigger.net/web-security/websockets/lab-manipulating-handshake-to-exploit-vulnerabilities)

This online shop has a live chat feature implemented using WebSockets.

It has an aggressive but flawed XSS filter.

To solve the lab, use a WebSocket message to trigger an `alert()` popup in the support agent's browser.

<details><summary>Hint</summary>

- If you're struggling to bypass the XSS filter, try out our [XSS labs](/web-security/cross-site-scripting).
- Sometimes you can bypass IP-based restrictions using HTTP headers like `X-Forwarded-For`.

</details>

<details><summary>Official solution</summary>

1. Click "Live chat" and send a chat message.
2. In Burp Proxy, go to the WebSockets history tab, and observe that the chat message has been sent via a WebSocket message.
3. Right-click on the message and select "Send to Repeater".
4. Edit and resend the message containing a basic XSS payload, such as:

   `<img src=1 onerror='alert(1)'>`
5. Observe that the attack has been blocked, and that your WebSocket connection has been terminated.
6. Click "Reconnect", and observe that the connection attempt fails because your IP address has been banned.
7. Add the following header to the handshake request to spoof your IP address:

   `X-Forwarded-For: 1.1.1.1`
8. Click "Connect" to successfully reconnect the WebSocket.
9. Send a WebSocket message containing an obfuscated XSS payload, such as:

   `` <img src=1 oNeRrOr=alert`1`> ``

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=P89QAsl3d3o

</details>


## 2. Manipulating WebSocket messages to exploit vulnerabilities

[Open the lab](https://portswigger.net/web-security/websockets/lab-manipulating-messages-to-exploit-vulnerabilities)

This online shop has a live chat feature implemented using WebSockets.

Chat messages that you submit are viewed by a support agent in real time.

To solve the lab, use a WebSocket message to trigger an `alert()` popup in the support agent's browser.

<details><summary>Official solution</summary>

1. Click "Live chat" and send a chat message.
2. In Burp Proxy, go to the WebSockets history tab, and observe that the chat message has been sent via a WebSocket message.
3. Using the browser, send a new message containing a `<` character.
4. In Burp Proxy, find the corresponding WebSocket message and observe that the `<` has been HTML-encoded by the client before sending.
5. Ensure that Burp Proxy is configured to intercept WebSocket messages, then send another chat message.
6. Edit the intercepted message to contain the following payload:

   `<img src=1 onerror='alert(1)'>`
7. Observe that an alert is triggered in the browser. This will also happen in the support agent's browser.

</details>

<details><summary>Community solutions</summary>

##### Popo Hack

https://www.youtube.com/watch?v=Y7hTT64Cpzs

</details>

