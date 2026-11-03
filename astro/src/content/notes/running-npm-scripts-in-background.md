---
date: 2025-09-09T06:21:50-04:00
draft: false
title: Running NPM Scripts in Background
tags:
  - npm
  - node
  - javascript
---
> **BOTTOM LINE:** NPM scripts cannot interpret the & character in order to run a process in the background. You need to execute your start script using the shell directly as in the following example:

```
"scripts": {
  "start": "sh -c 'node server.js & node dummy/dummy.js'",
  "dev": "sh -c 'nodemon server.js & nodemon dummy/dummy.js &'"
}
```

In the above example, I need to run server.js (which, by default will run in the foreground) but I also need to run dummy.js to seed the server with data (which also runs in the foreground by default).

Dummy.js will never execute if server.js is not run in the background. Normally, we would achieve this by appending the & character. However, this is not interpreted by the NPM script runner without using ```sh -c``` at the start of the command. 