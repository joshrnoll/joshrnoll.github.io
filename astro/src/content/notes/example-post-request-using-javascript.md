---
date: 2025-07-10T16:11:15-04:00
draft: false
title: Example POST Request using JavaScript
tags:
  - javascript
  - programming
  - http
---

```JavaScript
let newPost = {
  userId: 1,
  title: "My post",
  body: "This is my first post"
};

fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(newPost)
})
  .then((rawResponse) => {
    if (!rawResponse.ok) {
      throw new Error(
        `code: ${rawResponse.status}, status text: ${rawResponse.statusText}`
      );
    }
    return rawResponse.json();
  })
  .then((jsonifiedResponse) =>
    console.log("Jsonified data: ", jsonifiedResponse)
  )
  .catch((error) => console.log(error));
```
