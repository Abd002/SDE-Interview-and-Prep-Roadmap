# ByteByteGo System Design 101: How NAT Enabled the Internet

> Copied from <https://github.com/ByteByteGoHq/system-design-101> (CC BY-NC-ND 4.0, by ByteByteGo). Questions and answers are the source's own; nothing was answered or rewritten here.


![](images/0231-http-header.webp)

Network Address Translation (NAT) is the process that has made the growth of the Internet possible.

But how does it work?

1. In a corporate or home setting, multiple devices (phones, computers, etc.) share one router with a single public IP address.
2. When a device wants to access the internet, it sends a request to your router. The request contains the device's private IP address.
3. The router’s NAT process replaces the private IP with the router’s public IP.
4. The modified request is sent to the internet.
5. When the response comes back, NAT checks its record and replaces the public IP with the correct private IP. It sends the response to the right device.

NAT has several important uses:

*   **Conserves public IP addresses:** Without NAT, IPv4 addresses would have been depleted much faster, severely limiting the growth of the Internet.
*   **Allows sharing:** It allows sharing a single public IP address across multiple devices.
*   **Acts as a basic firewall:** NAT acts as a basic firewall that hides internal IP addresses.
*   **Eases network management:** NAT also makes it easy to manage large networks.
