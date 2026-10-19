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
SYS=(--drop 'Tested on real HP printers' --drop 'Desktop \& embedded'
  --sub ' and a standalone app sharing the same UI: printers grouped by device, status and supply levels, print queue control, test pages, live updates, and an Add Printer flow that sets up legacy printers through Printer Applications (PAPPL) instead of PPD drivers::: and a standalone app: printers grouped by device, supply levels, print queues, live updates and an Add Printer flow for legacy printers via PAPPL'
  --sub 'ported to libcups3 with CUPS 2 and CUPS 3 builds and CI; added IPP management operations, Printer Application support, IP/port connections, \texttt{lpoptions} and FFI bindings:::ported to libcups3 (CUPS 2 and 3 builds, CI); added IPP management operations, Printer Application support and FFI bindings')
build canonical "${SYS[@]}"
build cloudflare "${SYS[@]}"
build igalia "${SYS[@]}"
build nxp --sub '\textbf{7 PRs accepted upstream}:::7 PRs accepted upstream' --drop 'Door Locker Security System' --drop 'AUTOSAR PORT and GPIO drivers' \
  --sub 'real-time controller with temperature monitoring, heater-level control and UART diagnostics, using tasks, mutexes and event flags:::real-time temperature and heater control with UART diagnostics, using tasks, mutexes and event flags'
build amazon --drop 'Team projects' --drop 'Systems \& Linux' \
  --sub 'Graduation project: AUTOSAR-based V2X vehicle on STM32; implemented the firmware update path and a dual-bank bootloader with rollback.:::Graduation project: AUTOSAR V2X vehicle on STM32 with a dual-bank bootloader.'
