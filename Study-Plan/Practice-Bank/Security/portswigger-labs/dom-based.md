# PortSwigger labs: dom based

> Copied from <https://portswigger.net/web-security/dom-based>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. DOM XSS using web messages and a JavaScript URL

[Open the lab](https://portswigger.net/web-security/dom-based/controlling-the-web-message-source/lab-dom-xss-using-web-messages-and-a-javascript-url)

This lab demonstrates a DOM-based redirection vulnerability that is triggered by web messaging. To solve this lab, construct an HTML page on the exploit server that exploits this vulnerability and calls the `print()` function.

<details><summary>Official solution</summary>

1. Notice that the home page contains an `addEventListener()` call that listens for a web message. The JavaScript contains a flawed `indexOf()` check that looks for the strings `"http:"` or `"https:"` anywhere within the web message. It also contains the sink `location.href`.
2. Go to the exploit server and add the following `iframe` to the body, remembering to replace `YOUR-LAB-ID` with your lab ID:

   `<iframe src="https://YOUR-LAB-ID.web-security-academy.net/" onload="this.contentWindow.postMessage('javascript:print()//http:','*')">`
3. Store the exploit and deliver it to the victim.

This script sends a web message containing an arbitrary JavaScript payload, along with the string `"http:"`. The second argument specifies that any `targetOrigin` is allowed for the web message.

When the `iframe` loads, the `postMessage()` method sends the JavaScript payload to the main page. The event listener spots the `"http:"` string and proceeds to send the payload to the `location.href` sink, where the `print()` function is called.

</details>


## 2. DOM XSS using web messages and JSON.parse

[Open the lab](https://portswigger.net/web-security/dom-based/controlling-the-web-message-source/lab-dom-xss-using-web-messages-and-json-parse)

This lab uses web messaging and parses the message as JSON. To solve the lab, construct an HTML page on the exploit server that exploits this vulnerability and calls the `print()` function.

<details><summary>Official solution</summary>

1. Notice that the home page contains an event listener that listens for a web message. This event listener expects a string that is parsed using `JSON.parse()`. In the JavaScript, we can see that the event listener expects a `type` property and that the `load-channel` case of the `switch` statement changes the `iframe src` attribute.
2. Go to the exploit server and add the following `iframe` to the body, remembering to replace `YOUR-LAB-ID` with your lab ID:

   `<iframe src=https://YOUR-LAB-ID.web-security-academy.net/ onload='this.contentWindow.postMessage("{\"type\":\"load-channel\",\"url\":\"javascript:print()\"}","*")'>`
3. Store the exploit and deliver it to the victim.

When the `iframe` we constructed loads, the `postMessage()` method sends a web message to the home page with the type `load-channel`. The event listener receives the message and parses it using `JSON.parse()` before sending it to the `switch`.

The `switch` triggers the `load-channel` case, which assigns the `url` property of the message to the `src` attribute of the `ACMEplayer.element` `iframe`. However, in this case, the `url` property of the message actually contains our JavaScript payload.

As the second argument specifies that any `targetOrigin` is allowed for the web message, and the event handler does not contain any form of origin check, the payload is set as the `src` of the `ACMEplayer.element` `iframe`. The `print()` function is called when the victim loads the page in their browser.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=Nwj-ufySWRI

</details>


## 3. DOM XSS using web messages

[Open the lab](https://portswigger.net/web-security/dom-based/controlling-the-web-message-source/lab-dom-xss-using-web-messages)

This lab demonstrates a simple web message vulnerability. To solve this lab, use the exploit server to post a message to the target site that causes the `print()` function to be called.

<details><summary>Official solution</summary>

1. Notice that the home page contains an `addEventListener()` call that listens for a web message.
2. Go to the exploit server and add the following `iframe` to the body. Remember to add your own lab ID:

   `<iframe src="https://YOUR-LAB-ID.web-security-academy.net/" onload="this.contentWindow.postMessage('<img src=1 onerror=print()>','*')">`
3. Store the exploit and deliver it to the victim.

When the `iframe` loads, the `postMessage()` method sends a web message to the home page. The event listener, which is intended to serve ads, takes the content of the web message and inserts it into the `div` with the ID `ads`. However, in this case it inserts our `img` tag, which contains an invalid `src` attribute. This throws an error, which causes the `onerror` event handler to execute our payload.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=lghaq9HROi0

</details>


## 4. DOM-based cookie manipulation

[Open the lab](https://portswigger.net/web-security/dom-based/cookie-manipulation/lab-dom-cookie-manipulation)

This lab demonstrates DOM-based client-side cookie manipulation. To solve this lab, inject a cookie that will cause XSS on a different page and call the `print()` function. You will need to use the exploit server to direct the victim to the correct pages.

<details><summary>Official solution</summary>

1. Notice that the home page uses a client-side cookie called `lastViewedProduct`, whose value is the URL of the last product page that the user visited.
2. Go to the exploit server and add the following `iframe` to the body, remembering to replace `YOUR-LAB-ID` with your lab ID:

   `<iframe src="https://YOUR-LAB-ID.web-security-academy.net/product?productId=1&'><script>print()</script>" onload="if(!window.x)this.src='https://YOUR-LAB-ID.web-security-academy.net';window.x=1;">`
3. Store the exploit and deliver it to the victim.

The original source of the `iframe` matches the URL of one of the product pages, except there is a JavaScript payload added to the end. When the `iframe` loads for the first time, the browser temporarily opens the malicious URL, which is then saved as the value of the `lastViewedProduct` cookie. The `onload` event handler ensures that the victim is then immediately redirected to the home page, unaware that this manipulation ever took place. While the victim's browser has the poisoned cookie saved, loading the home page will cause the payload to execute.

</details>


## 5. Clobbering DOM attributes to bypass HTML filters

[Open the lab](https://portswigger.net/web-security/dom-based/dom-clobbering/lab-dom-clobbering-attributes-to-bypass-html-filters)

This lab uses the HTMLJanitor library, which is vulnerable to DOM clobbering. To solve this lab, construct a vector that bypasses the filter and uses DOM clobbering to inject a vector that calls the `print()` function. You may need to use the exploit server in order to make your vector auto-execute in the victim's browser.

#### Note

The intended solution to this lab will not work in Firefox. We recommend using Chrome to complete this lab.

<details><summary>Official solution</summary>

1. Go to one of the blog posts and create a comment containing the following HTML:

   `<form id=x tabindex=0 onfocus=print()><input id=attributes>`
2. Go to the exploit server and add the following `iframe` to the body:

   `<iframe src=https://YOUR-LAB-ID.web-security-academy.net/post?postId=3 onload="setTimeout(()=>this.src=this.src+'#x',500)">`

   Remember to change the URL to contain your lab ID and make sure that the `postId` parameter matches the `postId` of the blog post into which you injected the HTML in the previous step.
3. Store the exploit and deliver it to the victim. The next time the page loads, the `print()` function is called.

The library uses the `attributes` property to filter HTML attributes. However, it is still possible to clobber the `attributes` property itself, causing the length to be undefined. This allows us to inject any attributes we want into the `form` element. In this case, we use the `onfocus` attribute to smuggle the `print()` function.

When the `iframe` is loaded, after a 500ms delay, it adds the `#x` fragment to the end of the page URL. The delay is necessary to make sure that the comment containing the injection is loaded before the JavaScript is executed. This causes the browser to focus on the element with the ID `"x"`, which is the form we created inside the comment. The `onfocus` event handler then calls the `print()` function.

</details>


## 6. Exploiting DOM clobbering to enable XSS

[Open the lab](https://portswigger.net/web-security/dom-based/dom-clobbering/lab-dom-xss-exploiting-dom-clobbering)

This lab contains a DOM-clobbering vulnerability. The comment functionality allows "safe" HTML. To solve this lab, construct an HTML injection that clobbers a variable and uses XSS to call the `alert()` function.

#### Note

Please note that the intended solution to this lab will only work in Chrome.

<details><summary>Official solution</summary>

1. Go to one of the blog posts and create a comment containing the following anchors:

   `<a id=defaultAvatar><a id=defaultAvatar name=avatar href="cid:&quot;onerror=alert(1)//">`
2. Return to the blog post and create a second comment containing any random text. The next time the page loads, the `alert()` is called.

The page for a specific blog post imports the JavaScript file `loadCommentsWithDomClobbering.js`, which contains the following code:

`let defaultAvatar = window.defaultAvatar || {avatar: '/resources/images/avatarDefault.svg'}`

The `defaultAvatar` object is implemented using this dangerous pattern containing the logical `OR` operator in conjunction with a global variable. This makes it vulnerable to DOM clobbering.

You can clobber this object using anchor tags. Creating two anchors with the same ID causes them to be grouped in a DOM collection. The `name` attribute in the second anchor contains the value `"avatar"`, which will clobber the `avatar` property with the contents of the `href` attribute.

Notice that the site uses the DOMPurify filter in an attempt to reduce DOM-based vulnerabilities. However, DOMPurify allows you to use the `cid:` protocol, which does not URL-encode double-quotes. This means you can inject an encoded double-quote that will be decoded at runtime. As a result, the injection described above will cause the `defaultAvatar` variable to be assigned the clobbered property `{avatar: ‘cid:"onerror=alert(1)//’}` the next time the page is loaded.

When you make a second post, the browser uses the newly-clobbered global variable, which smuggles the payload in the `onerror` event handler and triggers the `alert()`.

</details>


## 7. DOM-based open redirection

[Open the lab](https://portswigger.net/web-security/dom-based/open-redirection/lab-dom-open-redirection)

This lab contains a DOM-based open-redirection vulnerability. To solve this lab, exploit this vulnerability and redirect the victim to the exploit server.

<details><summary>Official solution</summary>

The blog post page contains the following link, which returns to the home page of the blog:

`<a href='#' onclick='returnURL' = /url=https?:\/\/.+)/.exec(location); if(returnUrl)location.href = returnUrl[1];else location.href = "/"'>Back to Blog</a>`

The `url` parameter contains an open redirection vulnerability that allows you to change where the "Back to Blog" link takes the user. To solve the lab, construct and visit the following URL, remembering to change the URL to contain your lab ID and your exploit server ID:

`https://YOUR-LAB-ID.web-security-academy.net/post?postId=4&url=https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net/`

</details>

