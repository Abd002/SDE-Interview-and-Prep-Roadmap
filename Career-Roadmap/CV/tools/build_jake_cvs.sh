#!/bin/bash
# Rebuild the Jake's Resume copy of every tailored CV (applications/<co>/jakes-template/).
# The --drop lists remove the weakest bullets so the 11pt template fits one page;
# the main tailored CVs keep everything.
set -e
cd "$(dirname "$0")/.."
build() {
  co=$1; shift
  out=applications/$co/jakes-template/Abdelrahman-Khalifa-CV.tex
  python3 tools/make_jake_cv.py applications/$co/Abdelrahman-Khalifa-CV.tex "$out" "$@"
  (cd applications/$co/jakes-template && for i in 1 2; do pdflatex -interaction=nonstopmode Abdelrahman-Khalifa-CV.tex >/dev/null; done
   echo "$co: $(pdfinfo Abdelrahman-Khalifa-CV.pdf | awk '/Pages/{print $2}') page(s)"; rm -f *.aux *.log *.out)
}
SYS=(--drop 'Tested on real HP printers' --drop 'Desktop \& embedded' --drop 'Designed the stack as 5 Rust crates'
  --sub ' and a standalone app sharing the same UI: printers grouped by device, status and supply levels, print queue control, test pages, live updates, and an Add Printer flow that sets up legacy printers through Printer Applications (PAPPL) instead of PPD drivers::: and a standalone app: printers grouped by device, supply levels, print queues, live updates and an Add Printer flow for legacy printers via PAPPL'
  --sub 'cups-rs (Rust): ported it to libcups3 with CUPS 2 and CUPS 3 builds and CI; added IPP management operations, Printer Application support, IP/port connections, \texttt{lpoptions} and FFI bindings for the libcups3 DNS-SD API:::cups-rs (Rust): ported to libcups3 with CI, IPP management, Printer Application support and DNS-SD FFI bindings'
  --sub 'libcups (C): fixed crashes in \texttt{cupsDNSSDDelete()} and a leaked client in the Avahi DNS-SD code:::libcups (C): fixed DNS-SD crashes and a leaked client'
  --sub '; added remote control and firmware updates through a Node.js/MongoDB backend:::'
  --sub ' Graduation project: AUTOSAR V2X vehicle on STM32 with a dual-bank bootloader.:::'
  --sub '; the standalone app falls back to running it in-process:::'
  --sub ', testing, debugging, performance optimization, code review:::, debugging, code review'
  --sub 'concurrency (async/event-driven, multithreading), memory management, :::async and multithreaded code, memory management, '
  --drop 'IoT Device Communication System')
build canonical "${SYS[@]}" --sub ' B.Sc. with Honors, Codeforces Expert and 4-time ECPC finalist.:::'
build cloudflare "${SYS[@]}"
build igalia "${SYS[@]}"
build nxp --sub '\textbf{7 PRs merged upstream}:::7 PRs merged upstream' --drop 'Door Locker Security System' --drop 'AUTOSAR PORT and GPIO drivers' \
  --drop 'IoT Device Communication System' --drop 'Seat Heater Control System' \
  --sub '; merged a Zephyr networking contribution:::' \
  --sub ' for more deterministic timing, devicetree-based drivers and easier porting to other boards:::' \
  --sub ' (calibration and a Mahony filter for orientation):::' \
  --sub 'Developed the PyQt5 desktop app that controls the simulator over a UART protocol; cut its CPU usage and latency by about 40\% (measured) using asyncio to wait for ESP32 and server messages concurrently, off the UI thread.:::Cut CPU usage and latency of the PyQt5 desktop app by about 40\% (measured) with asyncio.' \
  --sub 'Engineered remote operation and firmware updates: a Node.js/Express + MongoDB backend that the desktop app polls over REST, then flashes new firmware with esptool; GitHub Actions CI.:::Built remote operation and firmware updates (Node.js/MongoDB backend, esptool) with GitHub Actions CI.' \
  --sub ' (printer status, supply levels, print queues, adding printers):::' \
  --sub ', reviewed and merged upstream (:::, merged upstream (' \
  --sub 'Created custom Linux images with Yocto and Buildroot and wrote a Linux kernel module; worked with device trees, root file systems and hardware flashing. Scored 100\% in the final evaluation.:::Built Linux images with Yocto and Buildroot and a kernel module; scored 100\% in the final evaluation.' \
  --drop 'Rust ecosystem' \
  --sub ' Also works in modern C++, Rust and Python.:::' \
  --sub 'character device driver that walks the process list under RCU and exports per-task IDs, memory, threads, context switches and CPU time to user space; run on QEMU.:::character device driver that exports per-task memory, threads, context switches and CPU time to user space using RCU.'
build amazon --drop 'Team projects' --drop 'Systems \& Linux' --drop 'Inventory Management System' \
  --sub 'Created custom Linux images with Yocto and Buildroot and wrote a Linux kernel module; worked with device trees, root file systems and hardware flashing. Scored 100\% in the final evaluation.:::Built custom Linux images with Yocto and Buildroot and a Linux kernel module; scored 100\% in the final evaluation.' \
  --sub "Grade: Very Good with Honors. Graduation project: AUTOSAR-based V2X vehicle on STM32; implemented the firmware update path and a dual-bank bootloader with rollback.:::Grade: Very Good with Honors." \
  --sub " At EKSON, builds the simulators' firmware, app and REST backend (MongoDB).:::" \
  --sub 'Developed the PyQt5 control app; used asyncio to wait for ESP32 and server messages concurrently, cutting CPU use and latency by about 40\% (measured).:::Cut CPU use and latency of the PyQt5 control app by about 40\% (measured) using asyncio.' \
  --sub 'ported cups-rs to libcups3 with CUPS 2 and 3 builds and CI, added DNS-SD bindings:::ported cups-rs to libcups3 with CI, added DNS-SD bindings' \
  --sub ' with the same UI: printers grouped by device, status and supply levels, print queues, live updates, and an Add Printer flow for legacy printers::: for printer status, supply levels, print queues and adding printers' \
  --sub ' that the desktop app polls over REST to relay commands and flash new firmware with esptool::: polled over REST, with esptool flashing' \
  --sub ' (Egyptian Collegiate Programming Contest):::' \
  --sub 'Data structures and algorithms, operating systems, concurrency and multithreading, async/event-driven design, memory management, networking (TCP/UDP, IPC):::Data structures and algorithms, operating systems, concurrency, memory management, networking (TCP/UDP)' \
  --sub 'Git (version control), GitHub Actions CI, CMake, testing, debugging and troubleshooting, code review:::Git, GitHub Actions CI, CMake, testing, debugging, code review'
