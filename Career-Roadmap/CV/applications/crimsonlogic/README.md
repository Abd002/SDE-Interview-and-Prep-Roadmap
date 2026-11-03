# CrimsonLogic (Oman): everything for this application

> From the [Oman check](../../../08-Application-Tracker.md#oman-check-3-nov-2026) on 3 Nov 2026: the only role in Oman that you can realistically apply for.

## 1. The role

| | |
|---|---|
| **Role** | [Junior System Engineer](https://www.linkedin.com/jobs/view/4475189924), Infrastructure team (posted 7 Oct 2026, open on 3 Nov 2026) |
| **Where** | Muscat, Oman. **Contract.** The ad doesn't say "Omani nationals only". In the Gulf the employer sponsors the work visa, so ask the recruiter to confirm they will sponsor one for an Egyptian. |
| **Level** | Fresh graduates to 2 years |
| **The work** | **Operations, not development:** monitoring and maintaining Linux/Windows servers, deploying apps on Apache and Tomcat, logs and troubleshooting, patching and backups, documentation |
| **Required** | Linux administration basics, networking basics (TCP/IP, DNS, DHCP, VLANs, routing, subnetting), Apache/Tomcat basics, SQL basics |
| **Preferred** | CCNA, RHCSA, AWS/Azure, Bash/Python scripting |
| **Status** | **Applied** |
| **Applied on** | 3 Nov 2026 |
| **Contact** | Sushit Babaji, HR Executive (LinkedIn): connection request with a note sent; full message (with the visa question and CV) once accepted |
| **Follow up** | 10 Nov 2026 if Sushit hasn't replied (one short message, then stop); 24 Nov 2026 on the application itself |

**Think before applying:** this is a sysadmin role. It's fine as a way into Oman, but it moves you away from software and embedded development, which is where your CV is strongest.

## 2. Files

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Word copy |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad as it was on 3 Nov 2026 |

## 3. How your work maps to the ad

| The ad asks for | What the CV shows (checked in your repos) |
|---|---|
| Linux administration | Daily Linux (Ubuntu/Debian, CachyOS), Yocto and Buildroot images, a kernel module, root file systems |
| Monitor CPU, memory, processes | **Kernel Monitor**: reports every process's memory, threads, context switches and CPU time |
| Networking | The QEMU test network: Linux bridge and TAP interfaces, IP forwarding, TFTP network boot, static addressing; Zephyr IPv4 networking; DNS-SD/mDNS (Avahi) |
| Services and troubleshooting | Running CUPS and Avahi services in CI; the libcups crash investigation; the backend as a separate system service |
| Scripting | Bash environment-setup script (idempotent, with backups); Python; CI automation |
| SQL | SQL Server (Inventory audit triggers), DuckDB |

**Not claimed (you haven't used them):** Apache, Tomcat, RHEL/CentOS, DHCP or VLAN configuration, AWS/Azure, CCNA, RHCSA.

## 4. Before an interview

- Install Apache and Tomcat on a Linux VM and deploy a sample WAR file once.
- Revise DNS, DHCP, subnetting and VLANs (the CCNA basics).
- Learn `systemctl`, `journalctl`, `top`/`htop`, `df`, `free`, `ss`, `ip`.

## 5. Checklist

- [x] Re-open the posting and check it is still open.
- [ ] Ask whether they sponsor a work visa for Egyptian applicants.
- [x] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf).
- [x] Fill in **Applied on** above, in 08 and in Notion.
