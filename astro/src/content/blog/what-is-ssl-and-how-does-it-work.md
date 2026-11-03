---
title: 'What is SSL and How Does it Work?'
date: '2023-10-08T04:17:15+00:00'
author: 'Josh Noll'
draft: false
image: /wp-content/uploads/2023/10/SSL-Certificate-https.jpg
description: An overview on TLS/SSL and how it works
tags:
  - Cybersecurity
---

## What is SSL?

Have you ever found yourself landing at a site on the internet which produced a “This Site is Not Secure” warning? Let’s talk about that.

See, once upon a time when the greybeards invented the internet, they built a protocol known as HTTP (Hypertext Transfer Protocol). If you’ve spent any time on the internet, then you’ve used this protocol. It’s the one responsible for retrieving your web pages and sending information to them (like your username and password). You may know that most URLs have an ‘https’ in front of them. Hopefully, you’re even aware that visiting a site which doesn’t use HTTPS is considered unsafe. The ‘s’ in this case stands for ‘secure’ and it’s essentially an add-on to the original HTTP.

Staying secure on the internet in the early days went about as far as locking up the office at night to prevent physical theft. So, the original HTTP protocol had no encryption built into it. All of the information sent via HTTP is sent in plain text. This means that if anyone were to intercept your traffic going to a site using HTTP rather than HTTPS, they could see every detail of every crass meme that you clicked on. They could also see your passwords and personal information that you pass to the site.

As the internet expanded, so did the threat landscape. Quickly, it was realized that sending information in plain text was just asking for a man-in-the-middle attack. This is when someone intercepts your communications and either steals it or alters it. A layer of security needed to be added to HTTP as it quickly became the face of the internet.

![](https://joshrnoll.com/wp-content/uploads/2023/10/https-vs-http.jpg)

Enter SSL (Secure Sockets Layer). SSL was a protocol created to provide the necessary encryption for HTTP — sparking the birth of HTTPS. You may often hear SSL and TLS (Transport Layer Security) used interchangeably. This is because SSL was technically deprecated in the late 90s in favor of the more modern TLS. At this point, it’s just semantics. Many still refer to it as SSL. Some use the term SSL/TLS. But just know that everything nowadays is most likely using TLS, even if it’s referred to as SSL. I will stick to the term SSL throughout this post for consistency’s sake. Cloudflare does a good job of explaining the semantics here:

<https://www.cloudflare.com/learning/ssl/what-is-ssl/>

## How Encryption Works

To understand SSL, certificates and certificate authorities we first need to understand a little bit about how encryption works. There are two broad types of encryption: symmetric and asymmetric.

In symmetric encryption, all parties use the same shared key to encrypt and decrypt data. Let’s take the following example with our friends Bob and Alice. Bob has a message that he wants to send to Alice, but he wants the message to be private. He only wants himself and Alice to be able to read the message. So Bob starts by sending a copy of the shared encryption key to Alice.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-symmertric-01.drawio-edited-1.png)

Now that Bob and Alice both have a copy of the encryption key, Bob can confess his love for Alice without anyone else seeing the message.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-symmetric-02.drawio-edited.png)

Bob encrypts his love letter with the shared key and sends the encrypted message to Alice. If anyone were to intercept the message along the way, they would be unable to read it since they do not have the encryption key.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-symmetric-03.drawio-edited.png)

When Alice receives the encrypted message, she is able to decrypt it because she has a copy of the shared key. Now Alice can do the same thing in reverse to gently crush Bob’s hopes and dreams by informing him that she does not share in his feelings of affection.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-symmetric-04.drawio-edited.png)

But there’s a flaw with this type of encryption. Remember the first step? Where Bob sent the shared key to Alice? Well let’s say someone intercepted that exchange… Now a third party has a copy of the shared key. Because anyone with a copy of this key can encrypt and decrypt messages, this bad actor now has access to Bob’s love letter.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-symmetric-05.drawio-edited.png)

Now, this doesn’t mean that symmetric encryption isn’t used. There are plenty of techniques and technologies that make symmetric encryption very secure. In fact, near the end of this post, you’ll see exactly how it’s used in SSL. There is , however, a more robust form of encryption is known as asymmetric encryption; also commonly referred to as public key cryptography.

Let’s visit our friend’s Bob and Alice again. Bob and Alice have each generated what is known as a public/private key pair. This is exactly what it sounds like. Each party has their own unique set of keys. One is public and one is private. Your public key is meant to be shared; anyone can have a copy of it. Your private key is meant to be held by you and only you.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-asymmetric-01.drawio-edited.png)

“Gasp!” you say. A public encryption key? How can that be secure? Well, although we can encrypt something with just one key of any kind, the magic lies in the fact that to *decrypt* something, you need **both keys**.

So, Bob and Alice each publish their public keys… well, publicly. Bob has access to Alice’s public key and Alice has access to Bob’s public key.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-asymmetric-02.drawio-edited.png)

So how does Bob send his secret love letter to Alice? Well, since we can encrypt something with a single key, and Bob has access to Alice’s public key, Bob is going to encrypt his love letter with **Alice’s public key**. Then Alice can decrypt the message with her private key. This ensures that even if someone were to intercept the message, no one in the world but Alice will be able to read it.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-asymmetric-03.drawio-edited.png)

### What is an SSL Certificate?

So now we understand a little bit about encryption. But how does this relate to SSL? Well, for SSL to work, it needs a certificate. And a certificate is nothing more than a private/public key pair, just like the one’s Bob and Alice have, with some extra information (also known as metadata) attached to it. This metadata includes items such as when the certificate was generated, when it expires, who issued it etc.

Certificates can either be self-signed, or issued by what is known as a certificate authority (CA). If you’ve ever been to a site that produced a privacy warning, where you had to click on a button that said something to the effect of ‘proceed anyway’, then you were likely visiting a site with a self-signed SSL certificate.

Self signed certificates are exactly what they sound like. They’re signed by the person who is presenting them. This means that they are inherently untrusted, which is why you get the scary warning when trying to visit them. But why are they untrusted?

Picture yourself back in middle school. You want to leave school early because you have important delinquent middle-schooler matters to attend to. So you write up a sick note and sign it yourself instead of convincing the school nurse to sign it. When you present that note to your teachers, they will see that the note is signed by yourself rather than the school nurse and they, more than likely, will not dismiss you from class.

Because you are not trusted to make the judgement of whether you are sick enough to leave school early or not, your phony sick slip doesn’t cut it. The school nurse, however, is trusted to make this judgement. So if you were to get a sick slip signed by the nurse, your teachers would excuse you from class.

Now, lets say you present a sick slip that you signed yourself to the teachers and they excuse you anyway because they know you well and trust your judgement. This would be the equivalent of clicking ‘proceed anyway’ on a site that produces the scary privacy warning.

### How Does a Certificate Authority Work? 

Now, hopefully, most sites that you visit don’t have this warning banner. They are presented to you immediately and in the top left corner of your browser window you see a padlock icon indicating that the site is secure (ie. it’s using HTTPS and has an SSL certificate signed by a trusted certificate authority). Going back to our middle school analogy, this is the equivalent of presenting a valid sick note signed by the school nurse.

A certificate authority can be either a global CA, or an internal CA. A global CA is trusted broadly across the internet. There are many vendors that have globally trusted CAs — GoDaddy, Verisign and DigiCert to name a few. Anything ultimately signed by one of these globally trusted CAs will be, well, globally trusted.

Some organizations will build an internal CA. An internal CA is only trusted by members of the organization. So internal company websites may have SSL certificates issued by the company’s CA which will only be trusted by machines on the company’s domain.

As we’ve alluded to, the CA is the equivalent of the school nurse. But the school nurse acts more like an internal CA. The school nurse is trusted by the teachers within the school. Any sick note signed by him/her will be accepted as valid by teachers in that school, but not necessarily anyone outside of the school. Your manager at McDonalds, for instance likely wouldn’t accept a sick note from your school nurse.

But let’s say you get a sick note from your family medicine doctor instead. His/her signature on a note describing your ailments would likely be trusted by just about anyone, including your manager at McDonalds. The doctor, in this case, is acting like a global CA.

## How Does SSL Work?

Now, with all the analogies and broad scope out of the way, let’s dive into the nerdy details.

When you enter www.funnycatmemes.com into your favorite browser, before any HTTP or SSL happens, your computer needs to shake hands with the server for funnycatmemes.com. This is known as the TCP handshake and it looks like the red section in the diagram below. You send a SYN packet, the server sends back a SYN/ACK, and you send back an ACK. Once this is completed, you have made what is known as a stateful connection to the server.

After a TCP connection has been established, your computer sends a client hello message to the server. This message contains some information about what versions of SSL/TLS you support, as well as what encryption algorithms you can use. The server then sends two messages back. One is the server hello, which contains decisions on what SSL/TLS versions and what encryption algorithms to use. The other is the servers SSL certificate.

Since the certificate is issued by a globally trusted CA, you trust it and decide to use the certificate to proceed with communicating with the server. Within the certificate is a public key. The funnycatmemes.com server contains the correlating private key.

So, what we do from here, is generate a session key (a symmetric encryption key) to send to the server. But as we learned earlier, we don’t want to send this in plain text. If we do, a bad actor could intercept it and read all of our traffic. So, we encrypt the session key with the server’s public key (which we derived from its trusted SSL certificate) and send it over to the server. When the server receives it, it is able to decrypt it because it holds the private key.

At this point, both you and the server hold a symmetric session key which can encrypt and decrypt your messages; you are now safely sharing encrypted data with the server and at this point, you see the shiny padlock at the top left of your browser.

![](https://joshrnoll.com/wp-content/uploads/2023/10/SSL-full-diagram.drawio.png)

### Why a Session Key?

If symmetric encryption is less secure than asymmetric encryption, then why are we trying to use it at all? Isn’t it redundant to wrap symmetric encryption inside of asymmetric encryption? Why not just encrypt everything with the server’s public key?

Well, the simple answer here is that symmetric encryption is faster. Asymmetric encryption requires a lot of computational power and if we used it for everything, we would have a pretty terrible experience on Netflix, YouTube or even funnycatmemes.com.

## Happy Web Browsing!

There’s obviously much more to dive into here, but now you know the broad strokes of what his happening under the hood when you browse the internet. Keep an eye out for those padlocks, stay safe online, and happy web browsing!