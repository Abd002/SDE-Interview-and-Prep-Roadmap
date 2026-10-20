# PortSwigger labs: deserialization

> Copied from <https://portswigger.net/web-security/deserialization>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Arbitrary object injection in PHP

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-arbitrary-object-injection-in-php)

This lab uses a serialization-based session mechanism and is vulnerable to arbitrary object injection as a result. To solve the lab, create and inject a malicious serialized object to delete the `morale.txt` file from Carlos's home directory. You will need to obtain source code access to solve this lab.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Hint</summary>

You can sometimes read source code by appending a tilde (`~)` to a filename to retrieve an editor-generated backup file.

</details>

<details><summary>Official solution</summary>

1. Log in to your own account and notice the session cookie contains a serialized PHP object.
2. From the site map, notice that the website references the file `/libs/CustomTemplate.php`. Right-click on the file and select "Send to Repeater".
3. In Burp Repeater, notice that you can read the source code by appending a tilde (`~`) to the filename in the request line.
4. In the source code, notice the `CustomTemplate` class contains the `__destruct()` magic method. This will invoke the `unlink()` method on the `lock_file_path` attribute, which will delete the file on this path.
5. In Burp Decoder, use the correct syntax for serialized PHP data to create a `CustomTemplate` object with the `lock_file_path` attribute set to `/home/carlos/morale.txt`. Make sure to use the correct data type labels and length indicators. The final object should look like this:

   `O:14:"CustomTemplate":1:{s:14:"lock_file_path";s:23:"/home/carlos/morale.txt";}`
6. Base64 and URL-encode this object and save it to your clipboard.
7. Send a request containing the session cookie to Burp Repeater.
8. In Burp Repeater, replace the session cookie with the modified one in your clipboard.
9. Send the request. The `__destruct()` magic method is automatically invoked and will delete Carlos's file.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=2FohOriHLl8

</details>


## 2. Developing a custom gadget chain for Java deserialization

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-developing-a-custom-gadget-chain-for-java-deserialization)

This lab uses a serialization-based session mechanism. If you can construct a suitable gadget chain, you can exploit this lab's insecure deserialization to obtain the administrator's password.

To solve the lab, gain access to the source code and use it to construct a gadget chain to obtain the administrator's password. Then, log in as the `administrator` and delete `carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

Note that solving this lab requires basic familiarity with another topic that we've covered on the [Web Security Academy](/web-security).

<details><summary>Hint</summary>

To save you some of the effort, we've provided a [generic Java program for serializing objects](https://github.com/PortSwigger/serialization-examples/tree/master/java/generic). You can adapt this to generate a suitable object for your exploit. If you don't already have a Java environment set up, you can compile and execute the program using a browser-based IDE, such as `repl.it`.

</details>

<details><summary>Official solution</summary>

**Identify the vulnerability**

1. Log in to your own account and notice the session cookie contains a serialized Java object.
2. From the site map, notice that the website references the file `/backup/AccessTokenUser.java`. You can successfully request this file in Burp Repeater.
3. Navigate upward to the `/backup` directory and notice that it also contains a `ProductTemplate.java` file.
4. Notice that the `ProductTemplate.readObject()` method passes the template's `id` attribute into a SQL statement.
5. Based on the leaked source code, write a small Java program that instantiates a `ProductTemplate` with an arbitrary ID, serializes it, and then Base64-encodes it.

   #### Template

   In case you get stuck, we've also provided a [ready-to-use program](https://github.com/PortSwigger/serialization-examples/tree/master/java/solution) that you can run instead. If you're using our program, all you need to change is the `"your-payload-here"` string in the `Main.java` file. This instantiates and serializes a new `ProductTemplate` with its `id` set to whatever payload you enter here. The object is then Base64-encoded and output to the console ready for you to copy.
6. Use your Java program to create a `ProductTemplate` with the `id` set to a single apostrophe. Copy the Base64 string and submit it in a request as your session cookie. The error message confirms that the website is vulnerable to Postgres-based SQL injection via this deserialized object.

**Extract the password**

Having identified this vulnerability, you now need to find a way to exploit it to extract the administrator's password. At this point, you have the following options for testing different payloads:

- Make changes in your Java file like you did in the previous step, recompile it, and run it again before pasting the new value into your session cookie. This can be time-consuming as you'll have to repeat all of these steps for each payload you want to test.
- Alternatively, you can use the [Hackvertor](https://portswigger.net/bappstore/65033cbd2c344fbabe57ac060b5dd100) extension. You can then paste the raw serialized object into Burp Repeater and add tags that will update the offsets and Base64-encode the object automatically. This makes it much quicker to test a large number of payloads, and is even compatible with Burp Intruder.

#### Template

In case you've not used Hackvertor before, we've provided the following template. Note that this is Base64-encoded here to avoid copy/paste issues:

`PEBiYXNlNjRfND6s7QAFc3IAI2RhdGEucHJvZHVjdGNhdGFsb2cuUHJvZHVjdFRlbXBsYXRlAAAAAAAAAAECAAFMAAJpZHQAEkxqYXZhL2xhbmcvU3RyaW5nO3hwdAA8QGZyb21fY2hhcmNvZGVfMz48QGdldF9sZW4vPjxAL2Zyb21fY2hhcmNvZGVfMz5ZT1VSLVBBWUxPQUQtSEVSRTxAc2V0X2xlbj48QGxlbmd0aF8wPllPVVItUEFZTE9BRC1IRVJFPEAvbGVuZ3RoXzA+PEAvc2V0X2xlbj48QC9iYXNlNjRfND4=`

To use this template:

1. Copy and paste it into your session cookie in Burp Repeater.
2. Base64-decode it to reveal something that looks like this:

   `<@base64>¬ísr#data.productcatalog.ProductTemplateLidtLjava/lang/String;xpt<@from_charcode><@get_len/></@from_charcode>YOUR-PAYLOAD-HERE<@set_len><@length>YOUR-PAYLOAD-HERE</@length></@set_len></@base64>`
3. Replace **both** occurrences of `YOUR-PAYLOAD-HERE` with the payload that you want to test. Leave everything else as it is.
4. Send the request. If you want to check the output that Hackvertor generated, you can look at the request on the "Logger" tab.

There are several ways to extract the password, but for this solution, we'll perform a simple, error-based [`UNION` attack](https://portswigger.net/web-security/sql-injection/union-attacks).

1. [Enumerate the number of columns](https://portswigger.net/web-security/sql-injection/union-attacks#determining-the-number-of-columns-required-in-an-sql-injection-union-attack) in the table (8).
2. [Determine the data type of the columns](https://portswigger.net/web-security/sql-injection/union-attacks#finding-columns-with-a-useful-data-type-in-an-sql-injection-union-attack) and identify that columns 4, 5, and 6 do not expect values of the type string. Importantly, notice that the error message reflects the string input that you entered.
3. [List the contents of the database](https://portswigger.net/web-security/sql-injection/examining-the-database#listing-the-contents-of-the-database) and identify that there is a table called `users` with a column called `password`.
4. Use a suitable SQL injection payload to extract the password from the `users` table. For example, the following payload will trigger an exception that displays the password in the error message:

   `' UNION SELECT NULL, NULL, NULL, CAST(password AS numeric), NULL, NULL, NULL, NULL FROM users--`
5. To solve the lab, log in as `administrator` using the extracted password, open the admin panel, and delete `carlos`.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=O5FooPYSz1E

</details>


## 3. Developing a custom gadget chain for PHP deserialization

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-developing-a-custom-gadget-chain-for-php-deserialization)

This lab uses a serialization-based session mechanism. By deploying a custom gadget chain, you can exploit its insecure deserialization to achieve remote code execution. To solve the lab, delete the `morale.txt` file from Carlos's home directory.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Hint</summary>

You can sometimes read source code by appending a tilde (`~`) to a filename to retrieve an editor-generated backup file.

</details>

<details><summary>Official solution</summary>

1. Log in to your own account and notice that the session cookie contains a serialized PHP object. Notice that the website references the file `/cgi-bin/libs/CustomTemplate.php`. Obtain the source code by submitting a request using the `.php~` backup file extension.
2. In the source code, notice that the `__wakeup()` magic method for a `CustomTemplate` will create a new `Product` by referencing the `default_desc_type` and `desc` from the `CustomTemplate`.
3. Also notice that the `DefaultMap` class has the `__get()` magic method, which will be invoked if you try to read an attribute that doesn't exist for this object. This magic method invokes `call_user_func()`, which will execute any function that is passed into it via the `DefaultMap->callback` attribute. The function will be executed on the `$name`, which is the non-existent attribute that was requested.
4. You can exploit this gadget chain to invoke `exec(rm /home/carlos/morale.txt)` by passing in a `CustomTemplate` object where:

   `CustomTemplate->default_desc_type = "rm /home/carlos/morale.txt";
   CustomTemplate->desc = DefaultMap;
   DefaultMap->callback = "exec"`

   If you follow the data flow in the source code, you will notice that this causes the `Product` constructor to try and fetch the `default_desc_type` from the `DefaultMap` object. As it doesn't have this attribute, the `__get()` method will invoke the callback `exec()` method on the `default_desc_type`, which is set to our shell command.
5. To solve the lab, Base64 and URL-encode the following serialized object, and pass it into the website via your session cookie:

   `O:14:"CustomTemplate":2:{s:17:"default_desc_type";s:26:"rm /home/carlos/morale.txt";s:4:"desc";O:10:"DefaultMap":1:{s:8:"callback";s:4:"exec";}}`

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=JRmOBgOQWyM

</details>


## 4. Exploiting Java deserialization with Apache Commons

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-exploiting-java-deserialization-with-apache-commons)

This lab uses a serialization-based session mechanism and loads the Apache Commons Collections library. Although you don't have source code access, you can still exploit this lab using pre-built gadget chains.

To solve the lab, use a third-party tool to generate a malicious serialized object containing a remote code execution payload. Then, pass this object into the website to delete the `morale.txt` file from Carlos's home directory.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Hint</summary>

In Java versions 16 and above, you need to set a series of command-line arguments for Java to run ysoserial. For example:

`java \
--add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED \
--add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.runtime=ALL-UNNAMED \
--add-opens=java.base/java.net=ALL-UNNAMED \
--add-opens=java.base/java.util=ALL-UNNAMED \
-jar ysoserial-all.jar [payload] '[command]'`

</details>

<details><summary>Official solution</summary>

1. Log in to your own account and observe that the session cookie contains a serialized Java object. Send a request containing your session cookie to Burp Repeater.
2. Download the "ysoserial" tool and execute the following command. This generates a Base64-encoded serialized object containing your payload:

   - In Java versions 16 and above:

     `java \
     --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED \
     --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.runtime=ALL-UNNAMED \
     --add-opens=java.base/java.net=ALL-UNNAMED \
     --add-opens=java.base/java.util=ALL-UNNAMED \
     -jar ysoserial-all.jar CommonsCollections4 'rm /home/carlos/morale.txt' | base64`
   - In Java versions 15 and below:

     `java -jar ysoserial-all.jar CommonsCollections4 'rm /home/carlos/morale.txt' | base64`
3. In Burp Repeater, replace your session cookie with the malicious one you just created. Select the entire cookie and then URL-encode it.
4. Send the request to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=UpImnfwefgE

</details>


## 5. Exploiting PHP deserialization with a pre-built gadget chain

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-exploiting-php-deserialization-with-a-pre-built-gadget-chain)

This lab has a serialization-based session mechanism that uses a signed cookie. It also uses a common PHP framework. Although you don't have source code access, you can still exploit this lab's insecure deserialization using pre-built gadget chains.

To solve the lab, identify the target framework then use a third-party tool to generate a malicious serialized object containing a remote code execution payload. Then, work out how to generate a valid signed cookie containing your malicious object. Finally, pass this into the website to delete the `morale.txt` file from Carlos's home directory.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Log in and send a request containing your session cookie to Burp Repeater. Highlight the cookie and look at the **Inspector** panel.
2. Notice that the cookie contains a Base64-encoded token, signed with a SHA-1 HMAC hash.
3. Copy the decoded cookie from the **Inspector** and paste it into Decoder.
4. In Decoder, highlight the token and then select **Decode as > Base64**. Notice that the token is actually a serialized PHP object.
5. In Burp Repeater, observe that if you try sending a request with a modified cookie, an exception is raised because the digital signature no longer matches. However, you should notice that:
   - A developer comment discloses the location of a debug file at `/cgi-bin/phpinfo.php`.
   - The error message reveals that the website is using the Symfony 4.3.6 framework.
6. Request the `/cgi-bin/phpinfo.php` file in Burp Repeater and observe that it leaks some key information about the website, including the `SECRET_KEY` environment variable. Save this key; you'll need it to sign your exploit later.
7. Download the "PHPGGC" tool and execute the following command:

   `./phpggc Symfony/RCE4 exec 'rm /home/carlos/morale.txt' | base64`

   This will generate a Base64-encoded serialized object that exploits an RCE gadget chain in Symfony to delete Carlos's `morale.txt` file.
8. You now need to construct a valid cookie containing this malicious object and sign it correctly using the secret key you obtained earlier. You can use the following PHP script to do this. Before running the script, you just need to make the following changes:
   - Assign the object you generated in PHPGGC to the `$object` variable.
   - Assign the secret key that you copied from the `phpinfo.php` file to the `$secretKey` variable.`<?php
   $object = "OBJECT-GENERATED-BY-PHPGGC";
   $secretKey = "LEAKED-SECRET-KEY-FROM-PHPINFO.PHP";
   $cookie = urlencode('{"token":"' . $object . '","sig_hmac_sha1":"' . hash_hmac('sha1', $object, $secretKey) . '"}');
   echo $cookie;`

   This will output a valid, signed cookie to the console.
9. In Burp Repeater, replace your session cookie with the malicious one you just created, then send the request to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=0HFgO26GE4I

</details>


## 6. Exploiting Ruby deserialization using a documented gadget chain

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-exploiting-ruby-deserialization-using-a-documented-gadget-chain)

This lab uses a serialization-based session mechanism and the Ruby on Rails framework. There are documented exploits that enable remote code execution via a gadget chain in this framework.

To solve the lab, find a documented exploit and adapt it to create a malicious serialized object containing a remote code execution payload. Then, pass this object into the website to delete the `morale.txt` file from Carlos's home directory.

You can log in to your own account using the following credentials: wiener:peter

<details><summary>Hint</summary>

Try searching for "ruby deserialization gadget chain" online.

</details>

<details><summary>Official solution</summary>

1. Log in to your own account and notice that the session cookie contains a serialized ("marshaled") Ruby object. Send a request containing this session cookie to Burp Repeater.
2. Browse the web to find the `Universal Deserialisation Gadget for Ruby 2.x-3.x` by `vakzz` on `devcraft.io`. Copy the final script for generating the payload.
3. Modify the script as follows:
   - Change the command that should be executed from `id` to `rm /home/carlos/morale.txt`.
   - Replace the final two lines with `puts Base64.encode64(payload)`. This ensures that the payload is output in the correct format for you to use for the lab.
4. Run the script and copy the resulting Base64-encoded object.
5. In Burp Repeater, replace your session cookie with the malicious one that you just created, then URL encode it.
6. Send the request to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=BQ94Rgyw3AY

</details>


## 7. Modifying serialized data types

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-modifying-serialized-data-types)

This lab uses a serialization-based session mechanism and is vulnerable to authentication bypass as a result. To solve the lab, edit the serialized object in the session cookie to access the `administrator` account. Then, delete the user
`carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Hint</summary>

To access another user's account, you will need to exploit a quirk in how PHP compares data of different types.

Note that PHP's comparison behavior differs between versions. This lab assumes behavior consistent with PHP 7.x and earlier.

</details>

<details><summary>Official solution</summary>

1. Log in using your own credentials. In Burp, open the post-login `GET /my-account` request and examine the session cookie using the Inspector to reveal a serialized PHP object. Send this request to Burp Repeater.
2. In Burp Repeater, use the Inspector panel to modify the session cookie as follows:
   - Update the length of the `username` attribute to `13`.
   - Change the username to `administrator`.
   - Change the access token to the integer `0`. As this is no longer a string, you also need to remove the double-quotes surrounding the value.
   - Update the data type label for the access token by replacing `s` with `i`.

   The result should look like this:

   `O:4:"User":2:{s:8:"username";s:13:"administrator";s:12:"access_token";i:0;}`
3. Click "Apply changes". The modified object will automatically be re-encoded and updated in the request.
4. Send the request. Notice that the response now contains a link to the admin panel at `/admin`, indicating that you have successfully accessed the page as the `administrator` user.
5. Change the path of your request to `/admin` and resend it. Notice that the `/admin` page contains links to delete specific user accounts.
6. Change the path of your request to `/admin/delete?username=carlos` and send the request to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=vSRMt8VlLtc

</details>


## 8. Modifying serialized objects

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-modifying-serialized-objects)

This lab uses a serialization-based session mechanism and is vulnerable to privilege escalation as a result. To solve the lab, edit the serialized object in the session cookie to exploit this vulnerability and gain administrative privileges. Then, delete the user
`carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Log in using your own credentials. Notice that the post-login `GET /my-account` request contains a session cookie that appears to be URL and Base64-encoded.
2. Use Burp's Inspector panel to study the request in its decoded form. Notice that the cookie is in fact a serialized PHP object. The `admin` attribute contains `b:0`, indicating the boolean value `false`. Send this request to Burp Repeater.
3. In Burp Repeater, use the Inspector to examine the cookie again and change the value of the `admin` attribute to `b:1`. Click "Apply changes". The modified object will automatically be re-encoded and updated in the request.
4. Send the request. Notice that the response now contains a link to the admin panel at `/admin`, indicating that you have accessed the page with admin privileges.
5. Change the path of your request to `/admin` and resend it. Notice that the `/admin` page contains links to delete specific user accounts.
6. Change the path of your request to `/admin/delete?username=carlos` and send the request to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=tm3u3Dw8I_4

</details>


## 9. Using application functionality to exploit insecure deserialization

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-using-application-functionality-to-exploit-insecure-deserialization)

This lab uses a serialization-based session mechanism. A certain feature invokes a dangerous method on data provided in a serialized object. To solve the lab, edit the serialized object in the session cookie and use it to delete the `morale.txt` file from Carlos's home directory.

You can log in to your own account using the following credentials: `wiener:peter`

You also have access to a backup account: `gregg:rosebud`

<details><summary>Official solution</summary>

1. Log in to your own account. On the "My account" page, notice the option to delete your account by sending a `POST` request to `/my-account/delete`.
2. Send a request containing a session cookie to Burp Repeater.
3. In Burp Repeater, study the session cookie using the Inspector panel. Notice that the serialized object has an `avatar_link` attribute, which contains the file path to your avatar.
4. Edit the serialized data so that the `avatar_link` points to `/home/carlos/morale.txt`. Remember to update the length indicator. The modified attribute should look like this:

   `s:11:"avatar_link";s:23:"/home/carlos/morale.txt"`
5. Click "Apply changes". The modified object will automatically be re-encoded and updated in the request.
6. Change the request line to `POST /my-account/delete` and send the request. Your account will be deleted, along with Carlos's `morale.txt` file.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=7FhbmnaGCkc

</details>


## 10. Using PHAR deserialization to deploy a custom gadget chain

[Open the lab](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-using-phar-deserialization-to-deploy-a-custom-gadget-chain)

This lab does not explicitly use deserialization. However, if you combine `PHAR` deserialization with other advanced hacking techniques, you can still achieve remote code execution via a custom gadget chain.

To solve the lab, delete the `morale.txt` file from Carlos's home directory.

You can log in to your own account using the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

1. Observe that the website has a feature for uploading your own avatar, which only accepts `JPG` images. Upload a valid `JPG` as your avatar. Notice that it is loaded using `GET /cgi-bin/avatar.php?avatar=wiener`.
2. In Burp Repeater, request `GET /cgi-bin` to find an index that shows a `Blog.php` and `CustomTemplate.php` file. Obtain the source code by requesting the files using the `.php~` backup extension.
3. Study the source code and identify the gadget chain involving the `Blog->desc` and `CustomTemplate->lockFilePath` attributes.
4. Notice that the `file_exists()` filesystem method is called on the `lockFilePath` attribute.
5. Notice that the website uses the Twig template engine. You can use deserialization to pass in an server-side template injection (SSTI) payload. Find a documented SSTI payload for remote code execution on Twig, and adapt it to delete Carlos's file:

   `{{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("rm /home/carlos/morale.txt")}}`
6. Write a some PHP for creating a `CustomTemplate` and `Blog` containing your SSTI payload:

   `class CustomTemplate {}
   class Blog {}
   $object = new CustomTemplate;
   $blog = new Blog;
   $blog->desc = '{{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("rm /home/carlos/morale.txt")}}';
   $blog->user = 'user';
   $object->template_file_path = $blog;`
7. Create a `PHAR-JPG` polyglot containing your PHP script. You can find several scripts for doing this online (search for "`phar jpg polyglot`"). Alternatively, you can download our  [ready-made one](https://github.com/PortSwigger/serialization-examples/blob/master/php/phar-jpg-polyglot.jpg).
8. Upload this file as your avatar.
9. In Burp Repeater, modify the request line to deserialize your malicious avatar using a `phar://` stream as follows:

   `GET /cgi-bin/avatar.php?avatar=phar://wiener`
10. Send the request to solve the lab.

</details>

<details><summary>Community solutions</summary>

##### Emanuele Picariello

https://www.youtube.com/watch?v=K1y30prBzjo

</details>

