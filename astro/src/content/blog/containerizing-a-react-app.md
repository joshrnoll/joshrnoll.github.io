---
title: "Containerizing a React App"
date: 2026-03-10T06:29:50-04:00
draft: false
author: Josh Noll
tags:
  - React
  - Linux
  - sed
image: /containerizing-a-react-app/react-logo.png
toc: true
---

I've been working on deploying an internal documentation site built with [Docusaurus](https://docusaurus.io). Since Docusaurus is essentially just a React app, I ran into a familiar problem...

## Containerizing a React App

When containerizing a React app, there are two primary methods of doing so. You can either:

1. Use a node base container and just run `npm run start` from it (or whatever command serves your application).
2. Use a web server base like nginx, statically build the site, and serve the build artifacts via the webserver.

These have some major differences. Option 1 will result in more dependencies since your container requires the entire node runtime. This, subsequently results in a larger container image and a larger attack surface. So, it's slightly less performant and slightly less secure than option 2. But this comes with the benefit of simplicity. Option 1's Dockerfile could be just a few lines.

Here's an example Dockerfile for option 1:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

Option 2, of course, provides the opposite. Smaller image, more performant, less attack surface. However, this comes at the cost of some complexity. You have to _build_ your application within the dockerfile and serve the build artifacts with a webserver configuration. This option is a great candidate for a multi-stage build.

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build artifacts from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

But, here's the other catch with option 2. If you're using [dotenv](https://www.npmjs.com/package/dotenv), or any variation of it, in your code to read environment variables, those environment variables are going to be read at _build time_. This means that, once the container is built, your application no longer cares what substitutions you provide via the Docker CLI or Docker Compose.

But, there's a clever workaround... Using an entrypoint script in your Dockerfile, you can replace the values in your build aritifacts using standard linux commands like `find` and `sed`.

Here's an example:

```dockerfile
## Same content as above ##

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set the entrypoint for the container
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

And here's the corresponding `docker-entrypoint.sh` script:

```bash
#!/bin/sh

# Replace environment variable placeholders in the built JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
  "s|REACT_APP_API_URL_PLACEHOLDER|${API_URL}|g" {} +

# Execute the main container command
exec "$@"
```

In your React code, instead of using `process.env.REACT_APP_API_URL`, you'd use a placeholder string:

```javascript
const API_URL = "REACT_APP_API_URL_PLACEHOLDER";
```

Then at runtime, you can provide the actual API URL:

```bash
docker run -e API_URL=https://api.example.com my-react-app
```

The entrypoint script will replace all instances of `REACT_APP_API_URL_PLACEHOLDER` with the actual URL before nginx starts serving the application.

## How find and replace works

So, how does this script work? It looks a little cryptic doesn't it? Well, let's break it down:

#### find

The first part of this script is the `find` command. This command does exactly what its name suggests: it finds things. In this case, we are finding any file (`-type f`) in the directory `/usr/share/nginx/html` with a name (`-name`) of `*.js`. Translation: find all JavaScript files in the `/usr/share/nginx/html` directory (recursively, by default).

```bash
find /usr/share/nginx/html -type f -name "*.js"
```

Now, all this does is return the results to stdout. That's not really helpful. So, we're adding the `-exec` flag to tell find to pass the results to another command (in this case, `sed`).

#### sed

`sed` stands for "stream editor" and it allows you to edit text within files programmatically using glob patterns and regular expressions. In this case, we're doing a simple replacing of one string with another.

```bash
sed -i "s|REACT_APP_API_URL_PLACEHOLDER|${API_URL}|g"
```

The `-i` flag stands for 'in-place editing'. The `s` stands for 'substitute' and the `g` stands for 'global'. Meaning: replace all instances in this file of this pattern with that pattern.

```bash
sed -i "s|REPLACE_THIS|with_this|g"
```

The pipe symbols (`|`) in this syntax are just delimiters. They can actually be _any_ character you want. But if your pattern contains, or potentially contains your delimiter, you will need to escape it with a backslash `\`. In this case, since a URL is going to contain forward slashes, it's cleaner to use a pipe symbol as a delimiter.

There's one piece of syntax that we haven't covered and it's this part:

```
{} +
```

This actually circles us back to the `find` command. Specifically, the `-exec` flag. When, passing values from `find` to another command using `-exec`, the `{}` acts as a placeholder for the files that are found and the `+` tells find to pass all of the files at once. You can also use `\;` to tell find to pass one file at a time, spawning an individual process for each, but this would be unnecessary in this case and less performant. If we wanted to though, the whole command could look like this:

```bash
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
  "s|REACT_APP_API_URL_PLACEHOLDER|${API_URL}|g" {} \;
```
