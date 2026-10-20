# devops-exercises: Hardware

> Copied from <https://github.com/bregman-arie/devops-exercises#hardware> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Hardware

<details>
<summary>What is a CPU?</summary><br><b>

A central processing unit (CPU) performs basic arithmetic, logic, controlling, and input/output (I/O) operations specified by the instructions in the program. This contrasts with external components such as main memory and I/O circuitry, and specialized processors such as graphics processing units (GPUs).
</b></details>

<details>
<summary>What is RAM?</summary><br><b>

RAM (Random Access Memory) is the hardware in a computing device where the operating system (OS), application programs and data in current use are kept so they can be quickly reached by the device's processor. RAM is the main memory in a computer. It is much faster to read from and write to than other kinds of storage, such as a hard disk drive (HDD), solid-state drive (SSD) or optical drive.
</b></details>

<details>
<summary>What is a GPU?</summary><br><b>
A GPU, or Graphics Processing Unit, is a specialized electronic circuit designed to expedite image and video processing for display on a computer screen.

</b></details>

<details>
<summary>What is an embedded system?</summary><br><b>

An embedded system is a computer system - a combination of a computer processor, computer memory, and input/output peripheral devices—that has a dedicated function within a larger mechanical or electronic system. It is embedded as part of a complete device often including electrical or electronic hardware and mechanical parts. 
</b></details>

<details>
<summary>Can you give an example of an embedded system?</summary><br><b>

A common example of an embedded system is a microwave oven's digital control panel, which is managed by a microcontroller.

When committed to a certain goal, Raspberry Pi can serve as an embedded system.

</b></details>

<details>
<summary>What types of storage are there?</summary><br><b>

There are several types of storage, including hard disk drives (HDDs), solid-state drives (SSDs), and optical drives (CD/DVD/Blu-ray). Other types of storage include USB flash drives, memory cards, and network-attached storage (NAS).
</b></details>

<details>
<summary>What are some considerations DevOps teams should keep in mind when selecting hardware for their job?</summary><br>

Choosing the right DevOps hardware is essential for ensuring streamlined CI/CD pipelines, timely feedback loops, and consistent service availability. Here's a distilled guide on what DevOps teams should consider:

1. **Understanding Workloads**:
    - **CPU**: Consider the need for multi-core or high-frequency CPUs based on your tasks.
    - **RAM**: Enough memory is vital for activities like large-scale coding or intensive automation.
    - **Storage**: Evaluate storage speed and capacity. SSDs might be preferable for swift operations.

2. **Expandability**:
    - **Horizontal Growth**: Check if you can boost capacity by adding more devices.
    - **Vertical Growth**: Determine if upgrades (like RAM, CPU) to individual machines are feasible.

3. **Connectivity Considerations**:
    - **Data Transfer**: Ensure high-speed network connections for activities like code retrieval and data transfers.
    - **Speed**: Aim for low-latency networks, particularly important for distributed tasks.
    - **Backup Routes**: Think about having backup network routes to avoid downtimes.

4. **Consistent Uptime**:
    - Plan for hardware backups like RAID configurations, backup power sources, or alternate network connections to ensure continuous service.

5. **System Compatibility**:
    - Make sure your hardware aligns with your software, operating system, and intended platforms.

6. **Power Efficiency**:
    - Hardware that uses energy efficiently can reduce costs in long-term, especially in large setups.

7. **Safety Measures**:
    - Explore hardware-level security features, such as TPM, to enhance protection.

8. **Overseeing & Control**:
    - Tools like ILOM can be beneficial for remote handling.
    - Make sure the hardware can be seamlessly monitored for health and performance.

9. **Budgeting**:
    - Consider both initial expenses and long-term costs when budgeting.

10. **Support & Community**:
    - Choose hardware from reputable vendors known for reliable support.
    - Check for available drivers, updates, and community discussions around the hardware.

11. **Planning Ahead**:
    - Opt for hardware that can cater to both present and upcoming requirements.

12. **Operational Environment**:
    - **Temperature Control**: Ensure cooling systems to manage heat from high-performance units.
    - **Space Management**: Assess hardware size considering available rack space.
    - **Reliable Power**: Factor in consistent and backup power sources.

13. **Cloud Coordination**:
    - If you're leaning towards a hybrid cloud setup, focus on how local hardware will mesh with cloud resources.

14. **Life Span of Hardware**:
    - Be aware of the hardware's expected duration and when you might need replacements or upgrades.

15. **Optimized for Virtualization**:
    - If utilizing virtual machines or containers, ensure the hardware is compatible and optimized for such workloads.

16. **Adaptability**:
    - Modular hardware allows individual component replacements, offering more flexibility.

17. **Avoiding Single Vendor Dependency**:
    - Try to prevent reliance on a single vendor unless there are clear advantages.

18. **Eco-Friendly Choices**:
    - Prioritize sustainably produced hardware that's energy-efficient and environmentally responsible.

In essence, DevOps teams should choose hardware that is compatible with their tasks, versatile, gives good performance, and stays within their budget. Furthermore, long-term considerations such as maintenance, potential upgrades, and compatibility with impending technological shifts must be prioritized.

</details>

<details>
<summary>What is the role of hardware in disaster recovery planning and implementation?</summary><br>

Hardware is critical in disaster recovery (DR) solutions. While the broader scope of DR includes things like standard procedures, norms, and human roles, it's the hardware that keeps business processes running smoothly. Here's an outline of how hardware works with DR:

1. **Storing Data and Ensuring Its Duplication**:
    - **Backup Equipment**: Devices like tape storage, backup servers, and external HDDs keep essential data stored safely at a different location.
    - **Disk Arrays**: Systems such as RAID offer a safety net. If one disk crashes, the others compensate.

2. **Alternate Systems for Recovery**:
    - **Backup Servers**: These step in when the main servers falter, maintaining service flow.
    - **Traffic Distributors**: Devices like load balancers share traffic across servers. If a server crashes, they reroute users to operational ones.

3. **Alternate Operation Hubs**:
    - **Ready-to-use Centers**: Locations equipped and primed to take charge immediately when the main center fails.
    - **Basic Facilities**: Locations with necessary equipment but lacking recent data, taking longer to activate.
    - **Semi-prepped Facilities**: Locations somewhat prepared with select systems and data, taking a moderate duration to activate.

4. **Power Backup Mechanisms**:
    - **Instant Power Backup**: Devices like UPS offer power during brief outages, ensuring no abrupt shutdowns.
    - **Long-term Power Solutions**: Generators keep vital systems operational during extended power losses.

5. **Networking Equipment**:
    - **Backup Internet Connections**: Having alternatives ensures connectivity even if one provider faces issues.
    - **Secure Connection Tools**: Devices ensuring safe remote access, especially crucial during DR situations.

6. **On-site Physical Setup**:
    - **Organized Housing**: Structures like racks to neatly store and manage hardware.
    - **Emergency Temperature Control**: Backup cooling mechanisms to counter server overheating in HVAC malfunctions.

7. **Alternate Communication Channels**:
    - **Orbit-based Phones**: Handy when regular communication methods falter.
    - **Direct Communication Devices**: Devices like radios useful when primary systems are down.

8. **Protection Mechanisms**:
    - **Electronic Barriers & Alert Systems**: Devices like firewalls and intrusion detection keep DR systems safeguarded.
    - **Physical Entry Control**: Systems controlling entry and monitoring, ensuring only cleared personnel have access.

9. **Uniformity and Compatibility in Hardware**:
    - It's simpler to manage and replace equipment in emergencies if hardware configurations are consistent and compatible.

10. **Equipment for Trials and Upkeep**:
    - DR drills might use specific equipment to ensure the primary systems remain unaffected. This verifies the equipment's readiness and capacity to manage real crises.

In summary, while software and human interventions are important in disaster recovery operations, it is the hardware that provides the underlying support. It is critical for efficient disaster recovery plans to keep this hardware resilient, duplicated, and routinely assessed.

</details>

<details>
<summary>What is a RAID?</summary><br>
<b>
RAID is an acronym that stands for "Redundant Array of Independent Disks." It is a technique that combines numerous hard drives into a single device known as an array in order to improve performance, expand storage capacity, and/or offer redundancy to prevent data loss. RAID levels (for example, RAID 0, RAID 1, and RAID 5) provide varied benefits in terms of performance, redundancy, and storage efficiency.

</b></details>

<details>
<summary>What is a microcontroller?</summary><br>
<b>
A microcontroller is a small integrated circuit that controls certain tasks in an embedded system. It typically includes a CPU, memory, and input/output peripherals.

</b></details>

<details>
<summary>What is a Network Interface Controller or NIC?</summary><br><b>
A Network Interface Controller (NIC) is a piece of hardware that connects a computer to a network and allows it to communicate with other devices.

</b></details>

<details>
<summary>What is a DMA?</summary><br><b>

Direct memory access (DMA) is a feature of computer systems that allows certain hardware subsystems to access main system memory independently of the central processing unit (CPU).DMA enables devices to share and receive data from the main memory in a computer. It does this while still allowing the CPU to perform other tasks.
</b></details>

<details>
<summary>What is a Real-Time Operating Systems?</summary><br><b>

A real-time operating system (RTOS) is an operating system (OS) for real-time computing applications that processes data and events that have critically defined time constraints. An RTOS is distinct from a time-sharing operating system, such as Unix, which manages the sharing of system resources with a scheduler, data buffers, or fixed task prioritization in a multitasking or multiprogramming environment. Processing time requirements need to be fully understood and bound rather than just kept as a minimum. All processing must occur within the defined constraints. Real-time operating systems are event-driven and preemptive, meaning the OS can monitor the relevant priority of competing tasks, and make changes to the task priority. Event-driven systems switch between tasks based on their priorities, while time-sharing systems switch the task based on clock interrupts.
</b></details>

<details>
<summary>List of interrupt types</summary><br><b>

There are six classes of interrupts possible:
* External
* Machine check
* I/O
* Program
* Restart
* Supervisor call (SVC)
</b></details>

