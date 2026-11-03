---
date: 2025-06-09T14:08:31-04:00
draft: false
title: CASP Study Notes
tags:
  - "cybersecurity"
  - "casp"
  - "comptia"
---
### Acronyms
- BCP - Business Continuity Plan
- SWG - Secure Web Gateway
- CASB - Cloud Access Security Broker
- SCAP - Security Content Automation Protocol
- XCDDF - Standard for creating machine readable configuration checklists
- OVAL - Standard for expressing information about vulnerabilities
- UTM - Unified Threat Management
- SAST - Static Application Security Testing
- DAST - Dynamic Application Security Testing
- ASLR - Address Space Layout Randomization -- helps to protect against buffer overflow
- SOAR - Security Orchestration Automation and Response
- Cloud provider BCDR (Business Continuity and Disaster Recovery)
- EUBA (User and Entity Behavior Analytics)
- DNP3 - Distributed Network Protocol 3 (used with OT and SCADA systems)
- IOC - Indicators of Compromise
- ALE - Annual Loss Exposure
- MaaS - Model as a Service
- DAM - Database Activity Monitoring
- FIM - File Integrity Monitoring
- PAM - Privileged Access Management
- SASE - Secure Access Service Edge
- SAST - Static Application Security Testing
- IAST - Interactive Application Security Testing
- HMAC - Hash-based Message Authentication Code
- CRM - Customer Relationship Management
- SAN (in the context of certificates) - Subject Alternative Name
- DMARC (Domain-based Message Authentication, Reporting, and Conformance)
- UEBA - User and Entity Behavior Analytics
- ISAC (Information Sharing and Analysis Center)
- COPE (Corporate-Owned, Personally Enabled) -- contrasted with BYOD or company furnished equipment
- FOTA - Firmware-over-the-Air
- DAM - Database Activity Monitoring
### Random Notes
**SAML** can support just-in-time provisioning

**SELinux Modes:**
- Enforcing mode - policies are strictly enforced
- Protecting mode - for development and testing
- Permissive mode - allows violations to occur but does not block

**Certificate pinning** - hard coding server's public key into the client application

**Lattice-based cryptography** - class of systems based on hard questions around spaces formed by combining sets of vectors to form new vectors. All the new vectors you can form by these combinations are called a lattice.

**Homomorphic cryptography** - form of encryption that is unique in that it allows computation on ciphertexts and generates an encrypted result that, when decrypted, matches the result of the operations as if they had been performed on the plaintext.

**ARM CPU Security techniques:**
XN is a security feature that is designed to prevent certain types of malware from executing in memory. When XN is enabled, the CPU will not execute code that is stored in memory regions that have been marked as XN. This can help to prevent malware from inserting itself into another process's memory location and executing from there.

No-execute (NX) is a similar security feature that is used to prevent certain types of malware from executing in memory. NX works by marking certain memory regions as non-executable, so that the CPU will not execute code from those regions.

**MITRE ATT&CK** is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations.

**Cyber Kill Chain** is a step-by-step approach that identifies and stops enemy activity. Originally developed by Lockheed Martin in 2011, the cyber kill chain outlines the various stages of several common cyberattacks and, by extension, the points at which the information security team can prevent, detect or intercept attackers.

**Steps of the Cyber Kill Chain:**
1. Reconnaissance
2. Weaponization
3. Delivery
4. Exploitation
5. Installation
6. Command and Control
7. Actions on Objectives

**Instance-based encryption** refers to encrypting data within individual virtual machine instances. While this can provide security for data within the specific instance, it may not offer the same level of protection for the underlying storage infrastructure.

**Storage-based encryption** involves encrypting the data at rest within the storage system. This ensures that the data remains encrypted even when it is stored on physical disks or other storage media. It provides an additional layer of security, protecting the data from unauthorized access in case of breaches or physical theft of the storage devices.

**Incident Response Steps** (SANS)
1. Prepare
2. Identify
3. Contain
4. Eradicate
5. Recovery
6. Lessons Learned

**Chacha20** is a *stream cipher* that is designed to be fast and efficient, making it suitable for high-throughput applications like streaming. It is known for its speed and resistance to timing attacks, and it doesn't require specialized hardware support like some other encryption algorithms. Additionally, it has gained popularity as a replacement for older and less secure ciphers like RC4.

**HMAC** (Hash-based Message Authentication Code) is a cryptographic mechanism that uses a secret key and a hash function to verify the integrity and authenticity of a message. By utilizing HMAC for the private and public keys used in the API connection, the enterprise can ensure that the keys are securely exchanged and that any requests made to the API are authenticated and not tampered with.

**Cgroups** is a Linux kernel feature that allows for resource limitation, prioritization, and isolation of processes. It provides the ability to control and allocate system resources such as CPU, memory, disk I/O, and network bandwidth to individual processes or groups of processes.

**E-discovery**: Refers to the process of identifying, preserving, collecting, and analyzing electronically stored information (ESI) for legal purposes. In the scenario, the legal department is requesting the security team to investigate and search for specific information related to collusion and pricing. This aligns with the concept of e-discovery, where electronic information is searched and collected for potential use in legal proceedings.

```foremost``` Foremost is a forensic program to recover lost files based on their headers, footers, and internal data structures.

 **Fileless malware** refers to malicious code that operates entirely in memory and does not leave traces on the disk. In the given scenario, the PowerShell attack used the Invoke-Expression function to execute an external script. This method often involves running code from memory without creating any persistent files on the disk. Therefore, the malware is fileless.

Port 6667 = IRC

PLC (Programmable Logic Controllers) - use a graphical programming language called *ladder logic*

*Screened Subnet* = DMZ

**Perfect forward secrecy (PFS)**, is a feature of specific key-agreement protocols that gives assurances that session keys will not be compromised even if long-term secrets used in the session key exchange are compromised, limiting damage.

**Homomorphic Encryption** allows for computations to be performed on encrypted data *without the need to decrypt it.*

**EV certificate:** An Extended Validation (EV) certificate provides the highest form of web identity validation. It involves a more rigorous verification process, confirming the legal identity and operational existence of the entity behind the website. This provides a higher level of trust and security for customers.

**HSTS**: HTTP Strict Transport Security (HSTS) should be implemented to enforce the use of secure, encrypted connections. HSTS ensures that all web transactions are encrypted and helps prevent downgrade attacks. By enabling HSTS, the website instructs the browser to only use HTTPS for all future requests, providing a stronger level of security for users.

**SAST** (Static Application Security Testing): Static Application Security Testing analyzes the application's source code or compiled binaries without executing them. It scans for potential vulnerabilities, coding errors, and security flaws by analyzing the application's structure, syntax, and patterns. While SAST is more commonly applied during the development phase, it can still provide valuable insights when examining compiled binaries.

**IAST** (Interactive Application Security Testing): Interactive Application Security Testing is a dynamic analysis technique that combines elements of SAST and dynamic testing. It instruments the application at runtime to gather information about its behavior and security vulnerabilities. This can include analyzing how the application interacts with its environment, identifying vulnerabilities, and monitoring for potential security issues.

**XCCDF** is a standardized format used for documenting security configuration guidelines and settings. It provides a structured way to define security requirements and assessment criteria. It allows for the definition of security checklists and benchmarks that can be used to assess and verify security configurations on information systems.

**Mandatory access control (MAC)** is a security model that allows organizations to enforce strict access controls based on predefined rules and policies. With MAC, access permissions are determined by a central authority (usually an administrator) and are based on factors such as user roles, security clearances, and the sensitivity of the data being accessed. MAC provides a strong layer of defense against unauthorized access and reduces the risks of data exposure even in cases where an attacker gains physical or logical access to the location.

**GCM (Galois Counter Mode)** *is commonly used for TLS* and provides confidentiality and integrity

**Metric groups for calculating CVSS**
- Base - intrinsic assessment of the vulnerability itself (attack vector, complexity etc)
- Temporal - characteristics of the vulnerability that may change over time (availability of exploit code, level of patch availability etc)
- Environmental - specific facts about the environment in which the vulnerability exists (impact of affected systems, importance of affected data etc)

**Order of Volatility** refers to the practice of collecting and preserving digital evidence in a way that prioritizes volatile data first, as it is more likely to change or be lost if not captured promptly.

**OllyDbg** is a popular and powerful debugger that is commonly used for analyzing and debugging executable files, including ARM binaries. It provides features such as dynamic analysis, code and data breakpoints, memory access tracking, and step-by-step execution.

**Risks to Software Defined Networking (SDN)** - SDN introduces new components, interfaces, and communication pathways, which can potentially increase the attack surface for cyber threats. The dynamic nature of SDN environments and the abstraction of network control can introduce complexities that attackers might exploit to compromise the network.

A **legal hold** involves preserving and protecting relevant documents, data, and information that might be required as part of the investigation or legal proceedings. *This is the first step in the event of a law enforcement investigation.*

The **Subject Alternative Name (SAN)** extension is a way to include multiple domain names in a single SSL/TLS certificate. It allows a single certificate to secure multiple domain names, reducing the need for multiple certificates

A large number of **TIME_WAIT** connections can be an indication that the server is experiencing a *Denial of Service (DoS)*

**Single-tenant vs. multi-tenant** - in the context of the cloud, this refers to whether your solution would be sharing hardware with another customer on that cloud provider. For example, a multi-tenant IaaS offering would mean that your virtual machine shares hardware with other customer's virtual machines. A single-tenant offering would mean that you have a dedicated machine with no other customer's VMs.

**AES** = SYMMETRIC
**RSA** = ASYMMETRIC

**Single-use translation** involves generating a unique token or temporary credit card number for each transaction, which is associated with the original primary credit card number (the sensitive data).

**bcrypt** is a password hashing function specifically designed for secure password storage.

**DMARC (Domain-based Message Authentication, Reporting, and Conformance)**: DMARC is a protocol that helps prevent email spoofing and phishing by allowing email senders to specify how their emails should be authenticated.

**ssdeep** is a tool and algorithm commonly used for fuzzy hashing, which can identify similarities between files even if they are slightly modified.

**Content Security Policy (CSP)** is a security feature that helps prevent cross-site scripting (XSS) attacks by controlling which resources can be loaded by a web page.

**Tokenization** is a data security technique that replaces sensitive data, such as credit card numbers, with non-sensitive placeholders called tokens.

**Security challenge with DNP3** -- One of its security challenges is that the available function codes are not standardized, which means that different implementations of DNP3 may have varying sets of function codes and behaviors.

**Query parameterization** helps prevent SQL injection attacks by separating SQL code from user input

**Port 502** = Modbus

**(UEBA) User and Entity Behavior Analytics** solutions are designed to monitor and analyze the behavior of users and devices within an organization's network, whether they are on or off the network.

**ISAC (Information Sharing and Analysis Center)** -- ISACs are member-driven organizations that gather and share information on cyber threats to critical infrastructure sectors.

**Key stretching** techniques, such as PBKDF2, bcrypt, and scrypt, are designed to make it computationally expensive for attackers to generate *rainbow tables* by applying a hashing algorithm multiple times

**eFuses** are used to enforce hardware security policies, such as preventing the loading of unapproved firmware by blowing a fuse, which cannot be reset.

A **secure enclave** provides a dedicated secure area within the hardware for storing sensitive data, such as biometric information.

A **local historian** is a system specifically designed to collect, store, and retrieve time-series data from *industrial control systems*, including PLCs (Programmable Logic Controllers)

A **runbook** provides detailed, step-by-step procedures for responding to specific types of incidents. It serves as a reference guide that the entire SOC team can use to address future incidents effectively and consistently. A well-prepared runbook ensures that all team members follow the same processes and protocols, improving the overall incident response.

**The Sleuth Kit** is a collection of command-line tools that allows for the thorough analysis of disk images and the recovery of evidence from digital media.

**ExifTool** is a widely used tool for reading, writing, and editing metadata in a variety of file types, including images and documents. It would be ideal for analyzing metadata in publicly shared files on a website.

**Passive scanning** is *time consuming.*

**Ghidra** is an open-source software reverse engineering (SRE) framework developed by the National Security Agency (NSA). It includes a suite of full-featured software analysis tools that can be used for binary analysis, decompilation, and disassembly, making it a powerful tool for forensic analysts and security researchers.

**RACI** is a project management acronym for the different responsibility types within a project: **R**esponsible, **A**ccountable, **C**onsulted, and **I**nformed. The **RACI matrix**, or RACI chart, clarifies the roles named individuals or groups will play in the successful delivery of the project.

The ```strings``` command is used to search for and display printable strings in binary files. This can be particularly useful in digital forensics for finding human-readable content in data that might provide clues about the file's purpose or origin.

An **Extended Validation (EV)** certificate provides the highest form of web identity validation.

**DAM (Database Activity Monitoring)**: DAM solutions are specifically designed to monitor and analyze activities within database management systems. They provide real-time monitoring of privileged and malicious user activities, enabling the detection of suspicious or unauthorized actions. DAM operates at the application layer and can generate alerts based on predefined policies, helping to detect compromises within the database management system. Additionally, DAM solutions can be tuned to have a low false positive rate, providing accurate and actionable alerts.

**ISO 27018** outlines requirements for handling PII and compliance with GDPR

```hex dump``` is a command used for generating a hex dump of a binary file to analyze its contents at the byte level.

The **Diamond Model** of Intrusion Analysis focuses on mapping cyber intrusion activities into a structured analysis model consisting of four key elements: adversary, infrastructure, capability, and victim.

**Advisories** are official communications that provide detailed and actionable information about specific vulnerabilities, threats, and sometimes include mitigation strategies or patches. They are a crucial source of information for organizations looking to address vulnerabilities in a timely and effective manner.