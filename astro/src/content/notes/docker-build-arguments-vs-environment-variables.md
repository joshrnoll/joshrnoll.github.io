---
date: 2025-10-24T13:33:21-04:00
draft: false
title: Docker build arguments vs environment variables
tags:
  - typescript
  - javascript
  - programming
  - docker
---
# ARG
Build arguments are only available during build time. They can be provided in a Dockerfile with the ```ARG``` keyword.

They can be passed in a docker-compose like so:

```YAML
app:
  build:
    context: ../../app
    dockerfile: Dockerfile
    target: runtime
    args:
      - VITE_API_URL=http://api
      - VITE_API_PORT=3001
```

# ENV
Environment variables persist into the running container. They can be provided with the ```ENV``` keyword in a Dockerfile and passed in docker-compose in the ```environment:``` section. 

> [!NOTE]
> If using TypeScript, ENV variables will not be used during the build process because TypeScript compiles into JavaScript and will therefore use build ARGs over ENV variables