# PortSwigger labs: access control

> Copied from <https://portswigger.net/web-security/access-control>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Insecure direct object references

[Open the lab](https://portswigger.net/web-security/access-control/lab-insecure-direct-object-references)

This lab stores user chat logs directly on the server's file system, and retrieves them using static URLs.

Solve the lab by finding the password for the user `carlos`, and logging into their account.

<details><summary>Official solution</summary>

1. Select the **Live chat** tab.
2. Send a message and then select **View transcript**.
3. Review the URL and observe that the transcripts are text files assigned a filename containing an incrementing number.
4. Change the filename to `1.txt` and review the text. Notice a password within the chat transcript.
5. Return to the main lab page and log in using the stolen credentials.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=jgbHaALms_Q

##### Rana Khalil

https://www.youtube.com/watch?v=EaMWR5Cmjkg

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=Sd8jL96H0hc

</details>


## 2. Method-based access control can be circumvented

[Open the lab](https://portswigger.net/web-security/access-control/lab-method-based-access-control-can-be-circumvented)

This lab implements access controls based partly on the HTTP method of requests. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.

To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator.

<details><summary>Official solution</summary>

1. Log in using the admin credentials.
2. Browse to the admin panel, promote `carlos`, and send the HTTP request to Burp Repeater.
3. Open a private/incognito browser window, and log in with the non-admin credentials.
4. Attempt to re-promote `carlos` with the non-admin user by copying that user's session cookie into the existing Burp Repeater request, and observe that the response says "Unauthorized".
5. Change the method from `POST` to `POSTX` and observe that the response changes to "missing parameter".
6. Convert the request to use the `GET` method by right-clicking and selecting "Change request method".
7. Change the username parameter to your username and resend the request.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=0mWVYM_dqIg

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=H_xREdOq1yk

</details>


## 3. Multi-step process with no access control on one step

[Open the lab](https://portswigger.net/web-security/access-control/lab-multi-step-process-with-no-access-control-on-one-step)

This lab has an admin panel with a flawed multi-step process for changing a user's role. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.

To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator.

<details><summary>Official solution</summary>

1. Log in using the admin credentials.
2. Browse to the admin panel, promote `carlos`, and send the confirmation HTTP request to Burp Repeater.
3. Open a private/incognito browser window, and log in with the non-admin credentials.
4. Copy the non-admin user's session cookie into the existing Repeater request, change the username to yours, and replay it.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=XhNzjdT0Azk

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=PQUqFrsbmRA

</details>


## 4. Referer-based access control

[Open the lab](https://portswigger.net/web-security/access-control/lab-referer-based-access-control)

This lab controls access to certain admin functionality based on the Referer header. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.

To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator.

<details><summary>Official solution</summary>

1. Log in using the admin credentials.
2. Browse to the admin panel, promote `carlos`, and send the HTTP request to Burp Repeater.
3. Open a private/incognito browser window, and log in with the non-admin credentials.
4. Browse to `/admin-roles?username=carlos&action=upgrade` and observe that the request is treated as unauthorized due to the absent Referer header.
5. Copy the non-admin user's session cookie into the existing Burp Repeater request, change the username to yours, and replay it.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=DjZ_WHlYOq0

</details>


## 5. Unprotected admin functionality with unpredictable URL

[Open the lab](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality-with-unpredictable-url)

This lab has an unprotected admin panel. It's located at an unpredictable location, but the location is disclosed somewhere in the application.

Solve the lab by accessing the admin panel, and using it to delete the user `carlos`.

<details><summary>Official solution</summary>

1. Review the lab home page's source using Burp Suite or your web browser's developer tools.
2. Observe that it contains some JavaScript that discloses the URL of the admin panel.
3. Load the admin panel and delete `carlos`.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=7Jve11VySNU

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=mml8SlN2Or4

</details>


## 6. Unprotected admin functionality

[Open the lab](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality)

This lab has an unprotected admin panel.

Solve the lab by deleting the user `carlos`.

<details><summary>Official solution</summary>

1. Go to the lab and view `robots.txt` by appending `/robots.txt` to the lab URL. Notice that the `Disallow` line discloses the path to the admin panel.
2. In the URL bar, replace `/robots.txt` with `/administrator-panel` to load the admin panel.
3. Delete `carlos`.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=qJ8mtm_G40E

##### Popo Hack

https://www.youtube.com/watch?v=XF-SNuSyVNo

</details>


## 7. URL-based access control can be circumvented

[Open the lab](https://portswigger.net/web-security/access-control/lab-url-based-access-control-can-be-circumvented)

This website has an unauthenticated admin panel at `/admin`, but a front-end system has been configured to block external access to that path. However, the back-end application is built on a framework that supports the `X-Original-URL` header.

To solve the lab, access the admin panel and delete the user `carlos`.

<details><summary>Official solution</summary>

1. Try to load `/admin` and observe that you get blocked. Notice that the response is very plain, suggesting it may originate from a front-end system.
2. Send the request to Burp Repeater. Change the URL in the request line to `/` and add the HTTP header `X-Original-URL: /invalid`. Observe that the application returns a "not found" response. This indicates that the back-end system is processing the URL from the `X-Original-URL` header.
3. Change the value of the `X-Original-URL` header to `/admin`. Observe that you can now access the admin page.
4. To delete `carlos`, add `?username=carlos` to the real query string, and change the `X-Original-URL` path to `/admin/delete`.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=AwvQrdE1Wtc

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=Rj0B12Vsh_E

</details>


## 8. User ID controlled by request parameter with data leakage in redirect

[Open the lab](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter-with-data-leakage-in-redirect)

This lab contains an access control vulnerability where sensitive information is leaked in the body of a redirect response.

To solve the lab, obtain the API key for the user `carlos` and submit it as the solution.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Log in using the supplied credentials and access your account page.
2. Send the request to Burp Repeater.
3. Change the "id" parameter to `carlos`.
4. Observe that although the response is now redirecting you to the home page, it has a body containing the API key belonging to `carlos`.
5. Submit the API key.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=aafn8BmHcIE

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=nrly0jHYFqM

</details>


## 9. User ID controlled by request parameter with password disclosure

[Open the lab](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter-with-password-disclosure)

This lab has user account page that contains the current user's existing password, prefilled in a masked input.

To solve the lab, retrieve the administrator's password, then use it to delete the user `carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Log in using the supplied credentials and access the user account page.
2. Change the "id" parameter in the URL to `administrator`.
3. View the response in Burp and observe that it contains the administrator's password.
4. Log in to the administrator account and delete `carlos`.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=tcPkT82pa6k

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=erLHrDmf2gE

</details>


## 10. User ID controlled by request parameter, with unpredictable user IDs

[Open the lab](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter-with-unpredictable-user-ids)

This lab has a horizontal privilege escalation vulnerability on the user account page, but identifies users with GUIDs.

To solve the lab, find the GUID for `carlos`, then submit his API key as the solution.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Find a blog post by `carlos`.
2. Click on `carlos` and observe that the URL contains his user ID. Make a note of this ID.
3. Log in using the supplied credentials and access your account page.
4. Change the "id" parameter to the saved user ID.
5. Retrieve and submit the API key.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=aaIfsH-fP5c

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=KMM4VkXVdjw

</details>


## 11. User ID controlled by request parameter

[Open the lab](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter)

This lab has a horizontal privilege escalation vulnerability on the user account page.

To solve the lab, obtain the API key for the user `carlos` and submit it as the solution.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Log in using the supplied credentials and go to your account page.
2. Note that the URL contains your username in the "id" parameter.
3. Send the request to Burp Repeater.
4. Change the "id" parameter to `carlos`.
5. Retrieve and submit the API key for `carlos`.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=-VaKuNDMkR8

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=pv5PfMbe_7k

</details>


## 12. User role can be modified in user profile

[Open the lab](https://portswigger.net/web-security/access-control/lab-user-role-can-be-modified-in-user-profile)

This lab has an admin panel at `/admin`. It's only accessible to logged-in users with a `roleid` of 2.

Solve the lab by accessing the admin panel and using it to delete the user `carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Log in using the supplied credentials and access your account page.
2. Use the provided feature to update the email address associated with your account.
3. Observe that the response contains your role ID.
4. Send the email submission request to Burp Repeater, add `"roleid":2` into the JSON in the request body, and resend it.
5. Observe that the response shows your `roleid` has changed to 2.
6. Browse to `/admin` and delete `carlos`.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=jjfe7WRN76o

##### Michael Sommer (no audio)

https://www.youtube.com/watch?v=4AXJpx7F9YY

</details>


## 13. User role controlled by request parameter

[Open the lab](https://portswigger.net/web-security/access-control/lab-user-role-controlled-by-request-parameter)

This lab has an admin panel at `/admin`, which identifies administrators using a forgeable cookie.

Solve the lab by accessing the admin panel and using it to delete the user `carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Browse to `/admin` and observe that you can't access the admin panel.
2. Browse to the login page.
3. In Burp Proxy, turn interception on and enable response interception.
4. Complete and submit the login page, and forward the resulting request in Burp.
5. Observe that the response sets the cookie `Admin=false`. Change it to `Admin=true`.
6. Load the admin panel and delete `carlos`.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=e_jsPdEeSto

</details>

