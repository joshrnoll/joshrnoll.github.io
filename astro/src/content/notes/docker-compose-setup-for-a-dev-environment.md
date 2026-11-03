---
date: 2025-10-05T07:19:16-04:00
draft: false
title: Docker Compose Setup for a Dev Environment
tags:
  - docker
  - programming
---
An example of how to set up a development environment in Docker using docker compose. These are NOT builds for production, and therefore use a Docker build stage identified as ```DEV```. (You can call this whatever you want really). Using Docker build stages allows you to cleanly add on to the Dockerfile later for a production build. 

The example is for a React Vite app with an Express backend. 
## Vite App
### package.json

Ensure you add ```--host``` to your dev script. This will allow you to access the app from outside of the container. 

```JSON
  "scripts": {
    "dev": "vite --host", // <-- Ensure you add --host
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
```
### Dockerfile

The dockerfile is straight forward. We don't need to copy any files because we will pass everything in with a bind mount.

```Dockerfile
FROM node:24-alpine as DEV
WORKDIR /src/app
CMD ["npm", "run", "dev"]
```
## Express App (API)

### package.json

For the API, we'll need to create a ```dev``` script that will run the app via nodemon. We also need a ```build-db``` script that will run database migrations and seeds.

```JSON
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build-db": "npx knex migrate:latest && npx knex seed:run"
  },
```

### Dockerfile

Then in the Dockerfile, we run both of those scripts with the ```&&``` shell operator. Using JSON notation like the Vite app's Dockerfile is recommended and your editor may yell at you for not using it (as I don't in this example). But the shell operator won't work in JSON notation, so I do it this way. 

```Dockerfile
FROM node:24-alpine as DEV
WORKDIR /src/app
CMD npm run build-db && npm run dev
```

## .env file

Ensure you have a ```.env``` file for any environment variables that your code may be using. Here's my example:

```
VITE_API_PROTO=http
VITE_API_HOST=localhost
VITE_API_PORT=3001

NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=supersecretjwtsaucethatnobodycanguess
COOKIE_SECRET=supersecretcookiesaucethatnobodycanguess

DB_NAME=clearminder
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=docker
```

## Docker Compose

Finally, here's the docker compose that runs everything, referencing environment variables from the ```.env``` file. Notice that API and UI (vite) containers have volumes (bind mounts) to the code in the repo. This is why we don't need to run a ```COPY``` or ```npm install``` operation within the Dockerfile.

```yaml
---
services:
  db:
    image: postgres
    hostname: clearminder-db
    container_name: clearminder-db
    restart: unless-stopped
    # set shared memory limit when using docker compose
    shm_size: 128mb
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - "./dev-pg-data:/var/lib/postgresql"
  api:
    build:
      context: api/
      target: DEV
    hostname: clearminder-api
    container_name: clearminder-api
    restart: unless-stopped
    ports:
      - "3001:3001"
    volumes:
      - "./api:/src/app"
    environment:
      - CORS_ORIGINS=${CORS_ORIGINS}
      - JWT_SECRET=${JWT_SECRET}
      - COOKIE_SECRET=${COOKIE_SECRET}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
    depends_on:
      - db
  ui:
    build:
      context: ui/
      target: DEV
    hostname: clearminder
    container_name: clearminder
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - VITE_API_PROTO=${VITE_API_PROTO}
      - VITE_API_HOST=${VITE_API_HOST}
      - VITE_API_PORT=${VITE_API_PORT}
    volumes:
      - "./ui:/src/app"
    depends_on:
      - db
      - api
```