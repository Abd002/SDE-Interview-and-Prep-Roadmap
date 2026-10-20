# PortSwigger labs: file path traversal

> Copied from <https://portswigger.net/web-security/file-path-traversal>. Questions and answers are the source's own; nothing was answered or rewritten here.


## 1. File path traversal, traversal sequences blocked with absolute path bypass

[Open the lab](https://portswigger.net/web-security/file-path-traversal/lab-absolute-path-bypass)

This lab contains a path traversal vulnerability in the display of product images.

The application blocks traversal sequences but treats the supplied filename as being relative to a default working directory.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify a request that fetches a product image.
2. Modify the `filename` parameter, giving it the value `/etc/passwd`.
3. Observe that the response contains the contents of the `/etc/passwd` file.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=Gt92eIZjkvw

##### z3nsh3ll

https://www.youtube.com/watch?v=RtpIbtf7ReY

##### Intigriti

https://www.youtube.com/watch?v=17KYOIf5ZbU

##### Michael Sommer

https://www.youtube.com/watch?v=jGyse5X9ltA

</details>


## 2. File path traversal, traversal sequences stripped non-recursively

[Open the lab](https://portswigger.net/web-security/file-path-traversal/lab-sequences-stripped-non-recursively)

This lab contains a path traversal vulnerability in the display of product images.

The application strips path traversal sequences from the user-supplied filename before using it.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify a request that fetches a product image.
2. Modify the `filename` parameter, giving it the value:

   `....//....//....//etc/passwd`
3. Observe that the response contains the contents of the `/etc/passwd` file.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=_6ADm32rENs

##### Intigriti

https://www.youtube.com/watch?v=17KYOIf5ZbU

##### z3nsh3ll

https://www.youtube.com/watch?v=n0M-nOEB6a8

##### Michael Sommer

https://www.youtube.com/watch?v=bydjunJhZaE

</details>


## 3. File path traversal, simple case

[Open the lab](https://portswigger.net/web-security/file-path-traversal/lab-simple)

This lab contains a path traversal vulnerability in the display of product images.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify a request that fetches a product image.
2. Modify the `filename` parameter, giving it the value:

   `../../../etc/passwd`
3. Observe that the response contains the contents of the `/etc/passwd` file.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=XhieEh9BlGc

##### Intigriti

https://www.youtube.com/watch?v=17KYOIf5ZbU

##### z3nsh3ll

https://www.youtube.com/watch?v=Wt0gk05MBz0

##### Michael Sommer

https://www.youtube.com/watch?v=3CyrBt0E8AA

</details>


## 4. File path traversal, traversal sequences stripped with superfluous URL-decode

[Open the lab](https://portswigger.net/web-security/file-path-traversal/lab-superfluous-url-decode)

This lab contains a path traversal vulnerability in the display of product images.

The application blocks input containing path traversal sequences. It then performs a URL-decode of the input before using it.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify a request that fetches a product image.
2. Modify the `filename` parameter, giving it the value:

   `..%252f..%252f..%252fetc/passwd`
3. Observe that the response contains the contents of the `/etc/passwd` file.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=IldKjJLnRdA

##### Intigriti

https://www.youtube.com/watch?v=nvITajiF3rs

##### z3nsh3ll

https://www.youtube.com/watch?v=nclJPOL3PXc

##### Michael Sommer

https://www.youtube.com/watch?v=7slk8nYGtY0

</details>


## 5. File path traversal, validation of file extension with null byte bypass

[Open the lab](https://portswigger.net/web-security/file-path-traversal/lab-validate-file-extension-null-byte-bypass)

This lab contains a path traversal vulnerability in the display of product images.

The application validates that the supplied filename ends with the expected file extension.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify a request that fetches a product image.
2. Modify the `filename` parameter, giving it the value:

   `../../../etc/passwd%00.png`
3. Observe that the response contains the contents of the `/etc/passwd` file.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=szfkxDCUgOw

##### z3nsh3ll

https://www.youtube.com/watch?v=HqsmzPMAPc8

##### Intigriti

https://www.youtube.com/watch?v=nvITajiF3rs

##### Michael Sommer

https://www.youtube.com/watch?v=vFkrWxsWnoY

</details>


## 6. File path traversal, validation of start of path

[Open the lab](https://portswigger.net/web-security/file-path-traversal/lab-validate-start-of-path)

This lab contains a path traversal vulnerability in the display of product images.

The application transmits the full file path via a request parameter, and validates that the supplied path starts with the expected folder.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

<details><summary>Official solution</summary>

1. Use Burp Suite to intercept and modify a request that fetches a product image.
2. Modify the `filename` parameter, giving it the value:

   `/var/www/images/../../../etc/passwd`
3. Observe that the response contains the contents of the `/etc/passwd` file.

</details>

<details><summary>Community solutions</summary>

##### Rana Khalil

https://www.youtube.com/watch?v=36gLJH6BdUk

##### z3nsh3ll

https://www.youtube.com/watch?v=lB_GEPEb_iw

##### Intigriti

https://www.youtube.com/watch?v=nvITajiF3rs

##### Michael Sommer

https://www.youtube.com/watch?v=9ym9W88oS7w

</details>

