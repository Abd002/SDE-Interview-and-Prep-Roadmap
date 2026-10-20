# PortSwigger labs: race conditions

> Copied from <https://portswigger.net/web-security/race-conditions>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Bypassing rate limits via race conditions

[Open the lab](https://portswigger.net/web-security/race-conditions/lab-race-conditions-bypassing-rate-limits)

This lab's login mechanism uses rate limiting to defend against brute-force attacks. However, this can be bypassed due to a race condition.

To solve the lab:

1. Work out how to exploit the race condition to bypass the rate limit.
2. Successfully brute-force the password for the user `carlos`.
3. Log in and access the admin panel.
4. Delete the user `carlos`.

You can log in to your account with the following credentials: `wiener:peter`.

You should use the following list of potential passwords:

<details><summary>Passwords</summary>

`123123
abc123
football
monkey
letmein
shadow
master
666666
qwertyuiop
123321
mustang
123456
password
12345678
qwerty
123456789
12345
1234
111111
1234567
dragon
1234567890
michael
x654321
superman
1qaz2wsx
baseball
7777777
121212
000000`

</details>

#### Note

- Solving this lab requires Burp Suite 2023.9 or higher. You should also use the latest version of the Turbo Intruder, which is available from the [BApp Store](https://portswigger.net/bappstore/9abaa233088242e8be252cd4ff534988).
- You have a time limit of 15 mins. If you don't solve the lab within the time limit, you can reset the lab. However, Carlos's password changes each time.

<details><summary>Official solution</summary>

## Predict a potential collision

1. Experiment with the login function by intentionally submitting incorrect passwords for your own account.
2. Observe that if you enter the incorrect password more than three times, you're temporarily blocked from making any more login attempts for the same account.
3. Try logging in using another arbitrary username and observe that you see the normal `Invalid username or password` message. This indicates that the rate limit is enforced per-username rather than per-session.
4. Deduce that the number of failed attempts per username must be stored server-side.
5. Consider that there may be a race window between:

   - When you submit the login attempt.
   - When the website increments the counter for the number of failed login attempts associated with a particular username.

## Benchmark the behavior

1. From the proxy history, find a `POST /login` request containing an unsuccessful login attempt for your own account.
2. Send this request to Burp Repeater.
3. In Repeater, add the new tab to a group. For details on how to do this, see [Creating a new tab group](https://portswigger.net/burp/documentation/desktop/tools/repeater/groups#creating-a-new-tab-group).
4. Right-click the grouped tab, then select **Duplicate tab**. Create 19 duplicate tabs. The new tabs are automatically added to the group.
5. Send the group of requests in sequence, using separate connections to reduce the chance of interference. For details on how to do this, see [Sending requests in sequence](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-sequence).
6. Observe that after two more failed login attempts, you're temporarily locked out as expected.

## Probe for clues

1. Send the group of requests again, but this time in parallel. For details on how to do this, see [Sending requests in parallel](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-parallel)
2. Study the responses. Notice that although you have triggered the account lock, more than three requests received the normal `Invalid username and password` response.
3. Infer that if you're quick enough, you're able to submit more than three login attempts before the account lock is triggered.

## Prove the concept

1. Still in Repeater, highlight the value of the `password` parameter in the `POST /login` request.
2. Right-click and select **Extensions > Turbo Intruder > Send to turbo intruder**.
3. In Turbo Intruder, in the request editor, notice that the value of the `password` parameter is automatically marked as a payload position with the `%s` placeholder.
4. Change the `username` parameter to `carlos`.
5. From the drop-down menu, select the `examples/race-single-packet-attack.py` template.
6. In the Python editor, edit the template so that your attack queues the request once using each of the candidate passwords. For simplicity, you can copy the following example:

   `def queueRequests(target, wordlists):
   # as the target supports HTTP/2, use engine=Engine.BURP2 and concurrentConnections=1 for a single-packet attack
   engine = RequestEngine(endpoint=target.endpoint,
   concurrentConnections=1,
   engine=Engine.BURP2
   )
   # assign the list of candidate passwords from your clipboard
   passwords = wordlists.clipboard
   # queue a login request using each password from the wordlist
   # the 'gate' argument withholds the final part of each request until engine.openGate() is invoked
   for password in passwords:
   engine.queue(target.req, password, gate='1')
   # once every request has been queued
   # invoke engine.openGate() to send all requests in the given gate simultaneously
   engine.openGate('1')
   def handleResponse(req, interesting):
   table.add(req)`
7. Note that we're assigning the password list from the clipboard by referencing `wordlists.clipboard`. Copy the list of candidate passwords to your clipboard.
8. Launch the attack.
9. Study the responses.

   - If you have no successful logins, wait for the account lock to reset and then repeat the attack. You might want to remove any passwords from the list that you know are incorrect.
   - If you get a 302 response, notice that this login appears to be successful. Make a note of the corresponding password from the **Payload** column.
10. Wait for the account lock to reset, then log in as `carlos` using the identified password.
11. Access the admin panel and delete the user `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=jzUJtW8rFRs

##### Popo Hack

https://www.youtube.com/watch?v=lV1W3PGLbNY

</details>


## 2. Exploiting time-sensitive vulnerabilities

[Open the lab](https://portswigger.net/web-security/race-conditions/lab-race-conditions-exploiting-time-sensitive-vulnerabilities)

This lab contains a password reset mechanism. Although it doesn't contain a race condition, you can exploit the mechanism's broken cryptography by sending carefully timed requests.

To solve the lab:

1. Identify the vulnerability in the way the website generates password reset tokens.
2. Obtain a valid password reset token for the user `carlos`.
3. Log in as `carlos`.
4. Access the admin panel and delete the user `carlos`.

You can log into your account with the following credentials: `wiener:peter`.

#### Note

Solving this lab requires Burp Suite 2023.9 or higher.

<details><summary>Official solution</summary>

## Study the behavior

1. Study the password reset process by submitting a password reset for your own account and observe that you're sent an email containing a reset link. The query string of this link includes your username and a token.
2. Send the `POST /forgot-password` request to Burp Repeater.
3. In Repeater, send the request a few times, then check your inbox again.
4. Observe that every reset request results in a link with a different token.
5. Consider the following:

   - The token is of a consistent length. This suggests that it's either a randomly generated string with a fixed number of characters, or could be a hash of some unknown data, which may be predictable.
   - The fact that the token is different each time indicates that, if it is in fact a hash digest, it must contain some kind of internal state, such as an RNG, a counter, or a timestamp.
6. Duplicate the Repeater tab and add both tabs to a new group. For details on how to do this, see [Creating a new tab group](https://portswigger.net/burp/documentation/desktop/tools/repeater/groups#creating-a-new-tab-group)
7. Send the pair of reset requests in parallel a few times. For details on how to do this, see [Sending requests in parallel](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-parallel).
8. Observe that there is still a significant delay between each response and that you still get a different token in each confirmation email. Infer that your requests are still being processed in sequence rather than concurrently.

## Bypass the per-session locking restriction

1. Notice that your session cookie suggests that the website uses a PHP back-end. This could mean that the server only processes one request at a time per session.
2. Send the `GET /forgot-password` request to Burp Repeater, remove the session cookie from the request, then send it.
3. From the response, copy the newly issued session cookie and CSRF token and use them to replace the respective values in one of the two `POST /forgot-password` requests. You now have a pair of password reset requests from two different sessions.
4. Send the two `POST` requests in parallel a few times and observe that the processing times are now much more closely aligned, and sometimes identical.

## Confirm the vulnerability

1. Go back to your inbox and notice that when the response times match for the pair of reset requests, this results in two confirmation emails that use an identical token. This confirms that a timestamp must be one of the inputs for the hash.
2. Consider that this also means the token would be predictable if you knew the other inputs for the hash function.
3. Notice the separate `username` parameter. This suggests that the username might not be included in the hash, which means that two different usernames could theoretically have the same token.
4. In Repeater, go to the pair of `POST /forgot-password` requests and change the `username` parameter in one of them to `carlos`.
5. Resend the two requests in parallel. If the attack worked, both users should be assigned the same reset token, although you won't be able to see this.
6. Check your inbox again and observe that, this time, you've only received one new confirmation email. Infer that the other email, hopefully containing the same token, has been sent to Carlos.
7. Copy the link from the email and change the username in the query string to `carlos`.
8. Visit the URL in the browser and observe that you're taken to the form for setting a new password as normal.
9. Set the password to something you'll remember and submit the form.
10. Try logging in as `carlos` using the password you just set.

    - If you can't log in, resend the pair of password reset emails and repeat the process.
    - If you successfully log in, visit the admin panel and delete the user `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=37bgZz47UbE

##### Popo Hack

https://www.youtube.com/watch?v=nalN7XAjYus

</details>


## 3. Limit overrun race conditions

[Open the lab](https://portswigger.net/web-security/race-conditions/lab-race-conditions-limit-overrun)

This lab's purchasing flow contains a race condition that enables you to purchase items for an unintended price.

To solve the lab, successfully purchase a **Lightweight L33t Leather Jacket**.

You can log in to your account with the following credentials: `wiener:peter`.

For a faster and more convenient way to trigger the race condition, we recommend that you solve this lab using the [Trigger race conditions](https://github.com/PortSwigger/bambdas/blob/main/CustomAction/ProbeForRaceCondition.bambda) custom action. This is only available in Burp Suite Professional.

#### Note

Solving this lab requires Burp Suite 2023.9 or higher.

<details><summary>Solution - Burp Suite Professional</summary>

## Predict a potential collision

1. Log in and buy the cheapest item possible, making sure to use the provided discount code so that you can study the purchasing flow.
2. Consider that the shopping cart mechanism and, in particular, the restrictions that determine what you are allowed to order, are worth trying to bypass.
3. In Burp, from the proxy history, identify all endpoints that enable you to interact with the cart. For example, a `POST /cart` request adds items to the cart and a `POST /cart/coupon` request applies the discount code.
4. Try to identify any restrictions that are in place on these endpoints. For example, observe that if you try applying the discount code more than once, you receive a `Coupon already applied` response.
5. Make sure you have an item to your cart, then send the `GET /cart` request to Burp Repeater.
6. In Repeater, try sending the `GET /cart` request both with and without your session cookie. Confirm that without the session cookie, you can only access an empty cart. From this, you can infer that:

   - The state of the cart is stored server-side in your session.
   - Any operations on the cart are keyed on your session ID or the associated user ID.

   This indicates that there is potential for a collision.
7. Consider that there may be a race window between when you first apply a discount code and when the database is updated to reflect that you've done this already.

## Benchmark the behavior

1. Make sure there is no discount code currently applied to your cart.
2. Send the request for applying the discount code (`POST /cart/coupon`) to Repeater.
3. In Repeater, send the `POST /cart/coupon` request twice.
4. Observe that the first response confirms that the discount was successfully applied, but the second response rejects the code with the same `Coupon already applied` message.

## Probe for clues

1. Remove the discount code from your cart.
2. In **Repeater**, open the **Custom actions** side panel.
3. Click **New > From template**, then select **Trigger race condition**.
4. Save the template to the **Custom actions** side panel without making any modifications.
5. Click  beside the **Trigger race condition** custom action. The request is sent 20 times in parallel.
6. In the browser, refresh your cart and confirm that the 20% reduction has been applied more than once, resulting in a significantly cheaper order.

## Prove the concept

1. Remove the applied codes and the arbitrary item from your cart and add the leather jacket to your cart instead.
2. Resend the group of `POST /cart/coupon` requests in parallel.
3. Refresh the cart and check the order total:

   - If the order total is still higher than your remaining store credit, remove the discount codes and repeat the attack.
   - If the order total is less than your remaining store credit, purchase the jacket to solve the lab.

</details>

<details><summary>Solution - Burp Suite Community Edition</summary>

## Predicting a potential collision

1. Log in and buy the cheapest item possible, making sure to use the provided discount code so that you can study the purchasing flow.
2. Consider that the shopping cart mechanism and, in particular, the restrictions that determine what you are allowed to order, are worth trying to bypass.
3. In Burp, from the proxy history, identify all endpoints that enable you to interact with the cart. For example, a `POST /cart` request adds items to the cart and a `POST /cart/coupon` request applies the discount code.
4. Try to identify any restrictions that are in place on these endpoints. For example, observe that if you try applying the discount code more than once, you receive a `Coupon already applied` response.
5. Make sure you have an item to your cart, then send the `GET /cart` request to Burp Repeater.
6. In Repeater, try sending the `GET /cart` request both with and without your session cookie. Confirm that without the session cookie, you can only access an empty cart. From this, you can infer that:

   - The state of the cart is stored server-side in your session.
   - Any operations on the cart are keyed on your session ID or the associated user ID.

   This indicates that there is potential for a collision.
7. Consider that there may be a race window between when you first apply a discount code and when the database is updated to reflect that you've done this already.

## Benchmarking the behavior

1. Make sure there is no discount code currently applied to your cart.
2. Send the request for applying the discount code (`POST /cart/coupon`) to Repeater.
3. In Repeater, add the new tab to a group. For details on how to do this, see [Creating a new tab group](https://portswigger.net/burp/documentation/desktop/tools/repeater/groups#creating-a-new-tab-group).
4. Right-click the grouped tab, then select **Duplicate tab**. Create 19 duplicate tabs. The new tabs are automatically added to the group.
5. Send the group of requests in sequence, using separate connections to reduce the chance of interference. For details on how to do this, see [Sending requests in sequence](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-sequence).
6. Observe that the first response confirms that the discount was successfully applied, but the rest of the responses consistently reject the code with the same **Coupon already applied** message.

## Probing for clues

1. Remove the discount code from your cart.
2. In Repeater, send the group of requests again, but this time in parallel, effectively applying the discount code multiple times at once. For details on how to do this, see [Sending requests in parallel](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-parallel).
3. Study the responses and observe that multiple requests received a response indicating that the code was successfully applied. If not, remove the code from your cart and repeat the attack.
4. In the browser, refresh your cart and confirm that the 20% reduction has been applied more than once, resulting in a significantly cheaper order.

## Proving the concept

1. Remove the applied codes and the arbitrary item from your cart and add the leather jacket to your cart instead.
2. Resend the group of `POST /cart/coupon` requests in parallel.
3. Refresh the cart and check the order total:

   - If the order total is still higher than your remaining store credit, remove the discount codes and repeat the attack.
   - If the order total is less than your remaining store credit, purchase the jacket to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=ci5_VmDNAo0

##### Popo Hack

https://www.youtube.com/watch?v=xkKZ69jrztA

</details>


## 4. Multi-endpoint race conditions

[Open the lab](https://portswigger.net/web-security/race-conditions/lab-race-conditions-multi-endpoint)

This lab's purchasing flow contains a race condition that enables you to purchase items for an unintended price.

To solve the lab, successfully purchase a **Lightweight L33t Leather Jacket**.

You can log into your account with the following credentials: `wiener:peter`.

#### Note

Solving this lab requires Burp Suite 2023.9 or higher.

#### Tip

When experimenting, we recommend purchasing the gift card as you can later redeem this to avoid running out of store credit.

<details><summary>Official solution</summary>

## Predict a potential collision

1. Log in and purchase a gift card so you can study the purchasing flow.
2. Consider that the shopping cart mechanism and, in particular, the restrictions that determine what you are allowed to order, are worth trying to bypass.
3. From the proxy history, identify all endpoints that enable you to interact with the cart. For example, a `POST /cart` request adds items to the cart and a `POST /cart/checkout` request submits your order.
4. Add another gift card to your cart, then send the `GET /cart` request to Burp Repeater.
5. In Repeater, try sending the `GET /cart` request both with and without your session cookie. Confirm that without the session cookie, you can only access an empty cart. From this, you can infer that:

   - The state of the cart is stored server-side in your session.
   - Any operations on the cart are keyed on your session ID or the associated user ID.

   This indicates that there is potential for a collision.
6. Notice that submitting and receiving confirmation of a successful order takes place over a single request/response cycle.
7. Consider that there may be a race window between when your order is validated and when it is confirmed. This could enable you to add more items to the order after the server checks whether you have enough store credit.

## Benchmark the behavior

1. Send both the `POST /cart` and `POST /cart/checkout` request to Burp Repeater.
2. In Repeater, add the two tabs to a new group. For details on how to do this, see [Creating a new tab group](https://portswigger.net/burp/documentation/desktop/tools/repeater/groups#creating-a-new-tab-group)
3. Send the two requests in sequence over a single connection a few times. Notice from the response times that the first request consistently takes significantly longer than the second one. For details on how to do this, see [Sending requests in sequence](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-sequence).
4. Add a `GET` request for the homepage to the start of your tab group.
5. Send all three requests in sequence over a single connection. Observe that the first request still takes longer, but by "warming" the connection in this way, the second and third requests are now completed within a much smaller window.
6. Deduce that this delay is caused by the back-end network architecture rather than the respective processing time of the each endpoint. Therefore, it is not likely to interfere with your attack.
7. Remove the `GET` request for the homepage from your tab group.
8. Make sure you have a single gift card in your cart.
9. In Repeater, modify the `POST /cart` request in your tab group so that the `productId` parameter is set to `1`, that is, the ID of the **Lightweight L33t Leather Jacket**.
10. Send the requests in sequence again.
11. Observe that the order is rejected due to insufficient funds, as you would expect.

## Prove the concept

1. Remove the jacket from your cart and add another gift card.
2. In Repeater, try sending the requests again, but this time in parallel. For details on how to do this, see [Sending requests in parallel](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-parallel).
3. Look at the response to the `POST /cart/checkout` request:

   - If you received the same "insufficient funds" response, remove the jacket from your cart and repeat the attack. This may take several attempts.
   - If you received a 200 response, check whether you successfully purchased the leather jacket. If so, the lab is solved.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=SvpxBM7s-G4

##### Popo Hack

https://www.youtube.com/watch?v=oRWT3rXdz8g

</details>


## 5. Partial construction race conditions

[Open the lab](https://portswigger.net/web-security/race-conditions/lab-race-conditions-partial-construction)

This lab contains a user registration mechanism. A race condition enables you to bypass email verification and register with an arbitrary email address that you do not own.

To solve the lab, exploit this race condition to create an account, then log in and delete the user `carlos`.

#### Note

Solving this lab requires Burp Suite 2023.9 or higher. You should also use the latest version of the Turbo Intruder, which is available from the [BApp Store](https://portswigger.net/bappstore/9abaa233088242e8be252cd4ff534988).

<details><summary>Hint</summary>

You may need to experiment with different ways of lining up the race window to successfully exploit this vulnerability.

</details>

<details><summary>Official solution</summary>

## Predict a potential collision

1. Study the user registration mechanism. Observe that:

   - You can only register using `@ginandjuice.shop` email addresses.
   - To complete the registration, you need to visit the confirmation link, which is sent via email.
   - As you don't have access to an `@ginandjuice.shop` email account, you don't appear to have a way to access a valid confirmation link.
2. In Burp, from the proxy history, notice that there is a request to fetch `/resources/static/users.js`.
3. Study the JavaScript and notice that this dynamically generates a form for the confirmation page, which is presumably linked from the confirmation email. This leaks the fact that the final confirmation is submitted via a `POST` request to `/confirm`, with the token provided in the query string.
4. In Burp Repeater, create an equivalent request to what your browser might send when clicking the confirmation link. For example:

   `POST /confirm?token=1 HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Content-Type: x-www-form-urlencoded
   Content-Length: 0`
5. Experiment with the `token` parameter in your newly crafted confirmation request. Observe that:

   - If you submit an arbitrary token, you receive an `Incorrect token: <YOUR-TOKEN>` response.
   - If you remove the parameter altogether, you receive a `Missing parameter: token` response.
   - If you submit an empty token parameter, you receive a `Forbidden` response.
6. Consider that this `Forbidden` response may indicate that the developers have patched a vulnerability that could be exploited by sending an empty token parameter.
7. Consider that there may be a small race window between:

   1. When you submit a request to register a user.
   2. When the newly generated registration token is actually stored in the database.

   If so, there may be a temporary sub-state in which `null` (or equivalent) is a valid token for confirming the user's registration.
8. Experiment with different ways of submitting a token parameter with a value equivalent to `null`. For example, some frameworks let you to pass an empty array as follows:

   `POST /confirm?token[]=`
9. Observe that this time, instead of the `Forbidden` response, you receive an `Invalid token: Array` response. This shows that you've successfully passed in an empty array, which could potentially match an uninitialized registration token.

## Benchmark the behavior

1. Send the `POST /register` request to Burp Repeater.
2. In Burp Repeater, experiment with the registration request. Observe that if you attempt to register the same username more than once, you get a different response.
3. In a separate Repeater tab, use what you've learned from the JavaScript import to construct a confirmation request with an arbitrary token. For example:

   `POST /confirm?token=1 HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: phpsessionid=YOUR-SESSION-ID
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 0`
4. Add both requests to a new tab group.
5. Try sending both requests sequentially and in parallel several times, making sure to change the username in the registration request each time to avoid hitting the separate `Account already exists with this name` code path. For details on how to do this, see
   [Sending grouped HTTP requests](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group).
6. Notice that the confirmation response consistently arrives much quicker than the response to the registration request.

## Prove the concept

1. Note that you need the server to begin creating the pending user in the database, then compare the token you send in the confirmation request before the user creation is complete.
2. Consider that as the confirmation response is always processed much more quickly, you need to delay this so that it falls within the race window.
3. In the `POST /register` request, highlight the value of the `username` parameter, then right-click and select **Extensions > Turbo Intruder > Send to turbo intruder**.
4. In Turbo Intruder, in the request editor:

   1. Notice that the value of the `username` parameter is automatically marked as a payload position with the `%s` placeholder.
   2. Make sure the `email` parameter is set to an arbitrary `@ginandjuice.shop` address that is not likely to already be registered on the site.
   3. Make a note of the static value of the `password` parameter. You'll need this later.
5. From the drop-down menu, select the `examples/race-single-packet-attack.py` template.
6. In the Python editor, modify the main body of the template as follows:

   1. Define a variable containing the confirmation request you've been testing in Repeater.
   2. Create a loop that queues a single registration request using a new username for each attempt. Set the `gate` argument to match the current iteration.
   3. Create a nested loop that queues a large number of confirmation requests for each attempt. These should also use the same release gate.
   4. Open the gate for all the requests in each attempt at the same time.

   The resulting script should look something like this:

   `def queueRequests(target, wordlists):
   engine = RequestEngine(endpoint=target.endpoint,
   concurrentConnections=1,
   engine=Engine.BURP2
   )
   confirmationReq = '''POST /confirm?token[]= HTTP/2
   Host: YOUR-LAB-ID.web-security-academy.net
   Cookie: phpsessionid=YOUR-SESSION-TOKEN
   Content-Length: 0
   '''
   for attempt in range(20):
   currentAttempt = str(attempt)
   username = 'User' + currentAttempt
   # queue a single registration request
   engine.queue(target.req, username, gate=currentAttempt)
   # queue 50 confirmation requests - note that this will probably sent in two separate packets
   for i in range(50):
   engine.queue(confirmationReq, gate=currentAttempt)
   # send all the queued requests for this attempt
   engine.openGate(currentAttempt)
   def handleResponse(req, interesting):
   table.add(req)`
7. Launch the attack.
8. In the results table, sort the results by the **Length** column.
9. If the attack was successful, you should see one or more 200 responses to your confirmation request containing the message `Account registration for user <USERNAME> successful`.
10. Make a note of the username from one of these responses. If you used the example script above, this will be something like `User4`.
11. In the browser, log in using this username and the static password you used in the registration request.
12. Access the admin panel and delete `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=tiYVcoZ6NfM

</details>


## 6. Single-endpoint race conditions

[Open the lab](https://portswigger.net/web-security/race-conditions/lab-race-conditions-single-endpoint)

This lab's email change feature contains a race condition that enables you to associate an arbitrary email address with your account.

Someone with the address `carlos@ginandjuice.shop` has a pending invite to be an administrator for the site, but they have not yet created an account. Therefore, any user who successfully claims this address will automatically inherit admin privileges.

To solve the lab:

1. Identify a race condition that lets you claim an arbitrary email address.
2. Change your email address to `carlos@ginandjuice.shop`.
3. Access the admin panel.
4. Delete the user `carlos`

You can log in to your own account with the following credentials: `wiener:peter`.

You also have access to an email client, where you can view all emails sent to `@exploit-<YOUR-EXPLOIT-SERVER-ID>.exploit-server.net` addresses.

#### Note

Solving this lab requires Burp Suite 2023.9 or higher.

<details><summary>Official solution</summary>

## Predict a potential collision

1. Log in and attempt to change your email to `anything@exploit-<YOUR-EXPLOIT-SERVER-ID>.exploit-server.net`. Observe that a confirmation email is sent to your intended new address, and you're prompted to click a link containing a unique token to confirm the change.
2. Complete the process and confirm that your email address has been updated on your account page.
3. Try submitting two different `@exploit-<YOUR-EXPLOIT-SERVER-ID>.exploit-server.net` email addresses in succession, then go to the email client.
4. Notice that if you try to use the first confirmation link you received, this is no longer valid. From this, you can infer that the website only stores one pending email address at a time. As submitting a new email address edits this entry in the database rather than appending to it, there is potential for a collision.

## Benchmark the behavior

1. Send the `POST /my-account/change-email` request to Repeater.
2. In Repeater, add the new tab to a group. For details on how to do this, see [Creating a new tab group](https://portswigger.net/burp/documentation/desktop/tools/repeater/groups#creating-a-new-tab-group).
3. Right-click the grouped tab, then select **Duplicate tab**. Create 19 duplicate tabs. The new tabs are automatically added to the group.
4. In each tab, modify the first part of the email address so that it is unique to each request, for example, `test1@exploit-<YOUR-EXPLOIT-SERVER-ID>.exploit-server.net, test2@..., test3@...` and so on.
5. Send the group of requests in sequence over separate connections. For details on how to do this, see [Sending requests in sequence](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-sequence).
6. Go back to the email client and observe that you have received a single confirmation email for each of the email change requests.

## Probe for clues

1. In Repeater, send the group of requests again, but this time in parallel, effectively attempting to change the pending email address to multiple different values at the same time. For details on how to do this, see [Sending requests in parallel](https://portswigger.net/burp/documentation/desktop/tools/repeater/send-group#sending-requests-in-parallel).
2. Go to the email client and study the new set of confirmation emails you've received. Notice that, this time, the recipient address doesn't always match the pending new email address.
3. Consider that there may be a race window between when the website:

   1. Kicks off a task that eventually sends an email to the provided address.
   2. Retrieves data from the database and uses this to render the email template.
4. Deduce that when a parallel request changes the pending email address stored in the database during this window, this results in confirmation emails being sent to the wrong address.

## Prove the concept

1. In Repeater, create a new group containing two copies of the `POST /my-account/change-email` request.
2. Change the `email` parameter of one request to `anything@exploit-<YOUR-EXPLOIT-SERVER-ID>.exploit-server.net`.
3. Change the `email` parameter of the other request to `carlos@ginandjuice.shop`.
4. Send the requests in parallel.
5. Check your inbox:

   - If you received a confirmation email in which the address in the body matches your own address, resend the requests in parallel and try again.
   - If you received a confirmation email in which the address in the body is `carlos@ginandjuice.shop`, click the confirmation link to update your address accordingly.
6. Go to your account page and notice that you now see a link for accessing the admin panel.
7. Visit the admin panel and delete the user `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Popo Hack

https://www.youtube.com/watch?v=jirzjAlp934

</details>

