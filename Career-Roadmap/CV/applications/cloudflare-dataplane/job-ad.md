# Cloudflare — saved job ads (25 Nov 2026)

## Systems Engineer - Network Data Plane Software

> https://boards.greenhouse.io/cloudflare/jobs/8401119?gh_jid=8401119 (updated 2026-11-20)

About Us

At Cloudflare, we are on a mission to help build a better Internet. Today the company runs one of the world’s largest networks that powers millions of websites and other Internet properties for customers ranging from individual bloggers to SMBs to Fortune 500 companies. Cloudflare protects and accelerates any Internet application online without adding hardware, installing software, or changing a line of code. Internet properties powered by Cloudflare all have web traffic routed through its intelligent global network, which gets smarter with every request. As a result, they see significant improvement in performance and a decrease in spam and other attacks. Cloudflare was named to Entrepreneur Magazine’s Top Company Cultures list and ranked among the World’s Most Innovative Companies by Fast Company.

At Cloudflare, we’re not looking for people who wait for a polished roadmap; we’re looking for the builders who see the cracks in the Internet that everyone else has simply learned to live with. We value candidates who have the instinct to spot a "normalized" problem and the AI-native curiosity to create a solution using the latest tools. Our culture is built on iteration, leveraging AI to ship faster today to make it better tomorrow, while ensuring that every improvement, no matter how small, is shared across the team to lift everyone up. If you’re the type of person who values curiosity over bureaucracy, and that AI is a partner in solving tough problems to keep the Internet moving forward, you’ll fit right in.

Locations: Austin TX, Champaign IL, Lisbon Portugal, London England, Atlanta GA, Washington DC, 

About the team

Cloudflare is redefining the way networks are run at scale, and some of the largest networks in the world now run their traffic through us. Cloudflare's network runs in hundreds of cities on general-purpose Linux servers, not dedicated routers, so the routers, firewalls, load balancers, and proxies that carry our customers' traffic are software that we write, ship, and operate ourselves.

Our Packet Processing team builds and operates that software: high-performance code that processes customer traffic at the packet level as it moves through Cloudflare's network, in every Cloudflare data center. That includes the L4 load balancer at the front door of every server, a per-customer routing and forwarding data plane, a stateful network firewall, and a TCP/UDP reverse proxy (the engines behind products like Magic Transit, Cloudflare WAN, Cloudflare Network Firewall, and Spectrum).

We are a team of engineers who obsess over performance, correctness, and reliability at massive scale. We own what we build in production, a lot of our work happens close to the kernel and the NIC.

About the role

We're looking for engineers who want to build the software that forwards, filters, and load-balances packets for a meaningful fraction of the internet. If you've worked on routers, switches, firewalls, load balancers, or SDN data planes, and you'd like to do that in software, at Cloudflare's scale, this is the role.

We're moving towards a unified data plane platform that all of our L3/L4 products share. Instead of each product having its own data path, with its own configuration, performance work, and failure modes, we build a feature once and every product gets it.

Some of the things you'd work on:

The shared platform: packet I/O, a graph of processing stages, per-core steering, per-customer isolation, and upgrades that don't drop traffic

A userspace forwarding plane that gives each customer their own routing and forwarding, with traffic arriving and leaving over tunnels (GRE, IPsec) and direct connections

A stateful packet firewall written in Rust: rule evaluation, rate limiting, intrusion detection, packet capture, and dual-stack IPv4/IPv6

An XDP-based L4 load balancer that touches nearly every connection into Cloudflare and forwards packets between servers and between data centers

A fast path that uses XDP and eBPF to forward very large single flows at multiple Gbps

Host networking: classifying each packet once and using that result everywhere on the server, instead of separate configs that can disagree

Chasing down packet drops, latency, and throughput problems across a fleet of servers in hundreds of cities

We write mostly Go and Rust (plus C for eBPF) on Linux, and the work ranges from XDP and the kernel network stack to userspace packet pipelines and the control planes that configure them.

You'll build, deploy, and operate these systems on top of one of the largest edge networks in the world. You'll partner with some of the best engineers and product managers, on our team and across Cloudflare, to solve big problems that have a meaningful impact in the lives of our customers and users.

We're looking for curious, empathetic engineers who are excited to join us in changing the way networking is done!

Examples of desirable skills, knowledge, and experience

Systems programming experience in Rust, Go, C, or C++

A solid understanding of L3 and L4 networking: IP, TCP, UDP, routing and forwarding, tunneling (GRE, IPsec), NAT, connection tracking, and anycast

Experience building data plane software: routers, switches, firewalls, load balancers, VPN gateways, or SDN/NFV systems

Linux networking: eBPF/XDP, tc, netfilter/nftables, network namespaces, sockets, etc.

High-performance packet processing in user space or the kernel (e.g., AF_XDP, DPDK, VPP)

Debugging, profiling, and optimizing systems where throughput and latency matter

Building and operating large-scale, reliable, distributed systems

Operating what you build: on-call, incident response, and root cause analysis

Reading unfamiliar code and safely evolving systems that have been in production for years

Owning work end to end, from design through deployment, and working across teams to land shared solutions

Clear written and verbal communication; we design in written specs and review each other's work

Bonus points

Router, switch, or network OS development (e.g., at a network equipment vendor or cloud provider)

Network firewalls, IDS/IPS (e.g., Suricata, Snort), or rate limiting

L4 load balancing (e.g., Maglev-style consistent hashing, Katran, IPVS)

Running large networks: ISPs, data center networks, or backbone operations

Contributions to open-source networking projects (e.g., the Linux kernel, DPDK, VPP, FRR)

Compensation

Compensation may be adjusted depending on work location.

For Champaign IL based hires: Estimated annual salary of $168,000 - $210,000.

For Washington, DC based hires: Estimated annual salary of $185,000 - $230,000.

For Seattle, WA based hires: Estimated annual salary of $185,000 - $230,000.

For Portugal based hires: Estimated annual salary is between €66,000 - 83,000.

Equity

This role is eligible to participate in Cloudflare's equity plan.

Benefits

Cloudflare offers a complete package of benefits and programs to support you and your family. Our benefits programs can help you pay health care expenses, support caregiving, build capital for the future and make life a little easier and fun! The below is a description of our benefits for employees in the United States, and benefits may vary for employees based outside the U.S.

Health & Welfare Benefits

Medical/Rx Insurance

Dental Insurance

Vision Insurance

Flexible Spending Accounts

Commuter Spending Accounts

Fertility & Family Forming Benefits

On-demand mental health support and Employee Assistance Program

Global Travel Medical Insurance

Financial Benefits

Short and Long Term Disability Insurance

Life & Accident Insurance

401(k) Retirement Savings Plan

Employee Stock Participation Plan

Time Off

Flexible paid time off covering vacation and sick leave

Leave programs, including parental, pregnancy health, medical, and bereavement leave

What Makes Cloudflare Special?

We’re not just a highly ambitious, large-scale technology company. We’re a highly ambitious, large-scale technology company with a soul. Fundamental to our mission to help build a better Internet is protecting the free and open Internet.

Project Galileo

: Since 2014, we've equipped more than 2,400 journalism and civil society organizations in 111 countries with powerful tools to defend themselves against attacks that would otherwise censor their work, technology already used by Cloudflare’s enterprise customers--at no cost.

Athenian Project

: In 2017, we created the Athenian Project to ensure that state and local governments have the highest level of protection and reliability for free, so that their constituents have access to election information and voter registration. Since the project, we've provided services to more than 425 local government election websites in 33 states.

1.1.1.1

: We released

1.1.1.1

 to help fix the foundation of the Internet by building a faster, more secure and privacy-centric public DNS resolver. This is available publicly for everyone to use - it is the first consumer-focused service Cloudflare has ever released. Here’s the deal - we don’t store client IP addresses never, ever. We will continue to abide by our

 privacy commitment

 and ensure that no user data is sold to advertisers or used to target consumers.

Sound like something you’d like to be a part of? We’d love to hear from you!

Please note that applicants who progress to the offer stage of the interview process may be asked to attend an in-person interview within one of the Cloudflare Offices or Cloudflare Hubs.  More details about this will be available at that stage of the interview process.

This position may require access to information protected under U.S. export control laws, including the U.S. Export Administration Regulations. Please note that any offer of employment may be conditioned on your authorization to receive software or technology controlled under these U.S. export laws without sponsorship for an export license.

Cloudflare is proud to be an equal opportunity employer.  We are committed to providing equal employment opportunity for all people and place great value in both diversity and inclusiveness.  All qualified applicants will be considered for employment without regard to their, or any other person's, perceived or actual

race, color, religion, sex, gender, gender identity, gender expression, sexual orientation, national origin, ancestry, citizenship, age, physical or mental disability, medical condition, family care status, or any other basis protected by law. 

We are an AA/Veterans/Disabled Employer.

Cloudflare provides reasonable accommodations to qualified individuals with disabilities.  Please tell us if you require a reasonable accommodation to apply for a job. Examples of reasonable accommodations include, but are not limited to, changing the application process, providing documents in an alternate format, using a sign language interpreter, or using specialized equipment.  If you require a reasonable accommodation to apply for a job, please contact us via e-mail at 

hr@cloudflare.com

 or via mail at 101 Townsend St. San Francisco, CA 94107.

## Systems Engineer - Network Software Performance

> https://boards.greenhouse.io/cloudflare/jobs/8401122?gh_jid=8401122 (updated 2026-11-20)

About Us

At Cloudflare, we are on a mission to help build a better Internet. Today the company runs one of the world’s largest networks that powers millions of websites and other Internet properties for customers ranging from individual bloggers to SMBs to Fortune 500 companies. Cloudflare protects and accelerates any Internet application online without adding hardware, installing software, or changing a line of code. Internet properties powered by Cloudflare all have web traffic routed through its intelligent global network, which gets smarter with every request. As a result, they see significant improvement in performance and a decrease in spam and other attacks. Cloudflare was named to Entrepreneur Magazine’s Top Company Cultures list and ranked among the World’s Most Innovative Companies by Fast Company.

At Cloudflare, we’re not looking for people who wait for a polished roadmap; we’re looking for the builders who see the cracks in the Internet that everyone else has simply learned to live with. We value candidates who have the instinct to spot a "normalized" problem and the AI-native curiosity to create a solution using the latest tools. Our culture is built on iteration, leveraging AI to ship faster today to make it better tomorrow, while ensuring that every improvement, no matter how small, is shared across the team to lift everyone up. If you’re the type of person who values curiosity over bureaucracy, and that AI is a partner in solving tough problems to keep the Internet moving forward, you’ll fit right in.

Locations: Austin TX, Champaign IL, Lisbon Portugal, London England, Atlanta GA, Washington DC, 

About the team

Cloudflare is redefining the way networks are run at scale, and some of the largest networks in the world now run their traffic through us. Cloudflare's network runs in hundreds of cities on general-purpose Linux servers, not dedicated routers, so the routers, firewalls, load balancers, and proxies that carry our customers' traffic are software that we write, ship, and operate ourselves.

Our Packet Processing team builds and operates that software: high-performance code that processes customer traffic at the packet level as it moves through Cloudflare's network, in every Cloudflare data center. That includes the L4 load balancer at the front door of every server, a per-customer routing and forwarding data plane, a stateful network firewall, and a TCP/UDP reverse proxy (the engines behind products like Magic Transit, Cloudflare WAN, Cloudflare Network Firewall, and Spectrum).

We are a team of engineers who obsess over performance, correctness, and reliability at massive scale. We own what we build in production, a lot of our work happens close to the kernel and the NIC.

About the role

For us, performance is a product feature. Customers notice single-flow throughput, packet loss, and latency right away, and every CPU cycle we spend on a packet is multiplied across every server in our network. We're looking for engineers who love finding out where the time goes, and then making it go away.

Some of the things you'd work on:

Pushing single large flows (e.g., one tunnel carrying a customer's whole data center) to multiple Gbps and beyond, and making that performance consistent

Finding out exactly where packets get dropped and why: NIC queues, interrupts and softirq, XDP, veth and namespaces, userspace rings, and everything in between

CPU placement: NUMA, RSS, core isolation, and steering traffic to the right cores on servers that also run many other services

Cutting the CPU cost per packet in hot paths written in Rust, C, and Go: batching, cache-friendly data structures, fewer copies, fewer locks

Measuring all of it: profiling with perf, eBPF tracing, and flame graphs; continuous profiling across the fleet; benchmarks in the lab and careful experiments in production

Building the benchmark and test tooling that keeps performance regressions from shipping

Helping shape a unified data plane platform so that it's fast from the start

We write mostly Go and Rust (plus C for eBPF) on Linux, and the work ranges from NIC configuration and the kernel network stack to userspace packet pipelines.

You'll build, deploy, and operate these systems on top of one of the largest edge networks in the world. You'll partner with some of the best engineers and product managers, on our team and across Cloudflare, to solve big problems that have a meaningful impact in the lives of our customers and users.

We're looking for curious, empathetic engineers who are excited to join us in changing the way networking is done!

Examples of desirable skills, knowledge, and experience

Systems programming experience in Rust, Go, C, or C++

Performance analysis on Linux: perf, eBPF-based tracing (e.g., bpftrace, BCC), flame graphs, hardware counters

A working model of modern CPUs and memory: caches, NUMA, branch prediction, SIMD, and how they show up in a profile

Knowledge of how packets move through Linux: NIC queues, RSS, NAPI, GRO/GSO, softirq, and the socket layer

Experience making high-throughput or low-latency systems faster, and proving it with good measurements

A solid understanding of L3 and L4 networking: IP, TCP, UDP, and tunneling

Building and operating large-scale, reliable, distributed systems

Operating what you build: on-call, incident response, and root cause analysis

Reading unfamiliar code and safely evolving systems that have been in production for years

Owning work end to end, from design through deployment, and working across teams to land shared solutions

Clear written and verbal communication; we design in written specs and review each other's work

Bonus points

Tuning AF_XDP, DPDK, or other kernel-bypass systems

Low-latency backgrounds such as trading systems, HPC, games, or storage

Go runtime or Rust async performance work

NIC offloads and features (e.g., checksum, TSO/LRO, flow steering, SR-IOV)

Contributions to the Linux kernel or open-source performance tooling

Compensation

Compensation may be adjusted depending on work location.

For Champaign IL based hires: Estimated annual salary of $168,000 - $210,000.

For Washington, DC based hires: Estimated annual salary of $185,000 - $230,000.

For Seattle, WA based hires: Estimated annual salary of $185,000 - $230,000.

For Portugal based hires: Estimated annual salary is between €66,000 - 83,000.

Equity

This role is eligible to participate in Cloudflare's equity plan.

Benefits

Cloudflare offers a complete package of benefits and programs to support you and your family. Our benefits programs can help you pay health care expenses, support caregiving, build capital for the future and make life a little easier and fun! The below is a description of our benefits for employees in the United States, and benefits may vary for employees based outside the U.S.

Health & Welfare Benefits

Medical/Rx Insurance

Dental Insurance

Vision Insurance

Flexible Spending Accounts

Commuter Spending Accounts

Fertility & Family Forming Benefits

On-demand mental health support and Employee Assistance Program

Global Travel Medical Insurance

Financial Benefits

Short and Long Term Disability Insurance

Life & Accident Insurance

401(k) Retirement Savings Plan

Employee Stock Participation Plan

Time Off

Flexible paid time off covering vacation and sick leave

Leave programs, including parental, pregnancy health, medical, and bereavement leave

What Makes Cloudflare Special?

We’re not just a highly ambitious, large-scale technology company. We’re a highly ambitious, large-scale technology company with a soul. Fundamental to our mission to help build a better Internet is protecting the free and open Internet.

Project Galileo

: Since 2014, we've equipped more than 2,400 journalism and civil society organizations in 111 countries with powerful tools to defend themselves against attacks that would otherwise censor their work, technology already used by Cloudflare’s enterprise customers--at no cost.

Athenian Project

: In 2017, we created the Athenian Project to ensure that state and local governments have the highest level of protection and reliability for free, so that their constituents have access to election information and voter registration. Since the project, we've provided services to more than 425 local government election websites in 33 states.

1.1.1.1

: We released

1.1.1.1

 to help fix the foundation of the Internet by building a faster, more secure and privacy-centric public DNS resolver. This is available publicly for everyone to use - it is the first consumer-focused service Cloudflare has ever released. Here’s the deal - we don’t store client IP addresses never, ever. We will continue to abide by our

 privacy commitment

 and ensure that no user data is sold to advertisers or used to target consumers.

Sound like something you’d like to be a part of? We’d love to hear from you!

Please note that applicants who progress to the offer stage of the interview process may be asked to attend an in-person interview within one of the Cloudflare Offices or Cloudflare Hubs.  More details about this will be available at that stage of the interview process.

This position may require access to information protected under U.S. export control laws, including the U.S. Export Administration Regulations. Please note that any offer of employment may be conditioned on your authorization to receive software or technology controlled under these U.S. export laws without sponsorship for an export license.

Cloudflare is proud to be an equal opportunity employer.  We are committed to providing equal employment opportunity for all people and place great value in both diversity and inclusiveness.  All qualified applicants will be considered for employment without regard to their, or any other person's, perceived or actual

race, color, religion, sex, gender, gender identity, gender expression, sexual orientation, national origin, ancestry, citizenship, age, physical or mental disability, medical condition, family care status, or any other basis protected by law. 

We are an AA/Veterans/Disabled Employer.

Cloudflare provides reasonable accommodations to qualified individuals with disabilities.  Please tell us if you require a reasonable accommodation to apply for a job. Examples of reasonable accommodations include, but are not limited to, changing the application process, providing documents in an alternate format, using a sign language interpreter, or using specialized equipment.  If you require a reasonable accommodation to apply for a job, please contact us via e-mail at 

hr@cloudflare.com

 or via mail at 101 Townsend St. San Francisco, CA 94107.

