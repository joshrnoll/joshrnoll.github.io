---
date: 2025-09-17T06:14:23-04:00
draft: false
title: Promises vs Thenables in JavaScript
tags:
  - javascript
  - promise
  - async
---
A ***Promise object*** in JavaScript is an object that is returned when conducting an asynchronous operation (such as an API call using ```fetch```). It represents the eventual completion of the task. It will always have an initial state of ```pending```, but will eventually *resolve* to a status of either ```fulfilled``` or ```rejected```.

Promise objects have a ```.then``` and ```.catch``` function which can be used to execute code only when the promise is either fulfilled or rejected (respectively). 

A ***thenable*** in JavaScript is any object that has a ```.then``` function. *All Promises are thenables but*  ***not all thenables are Promises.***

Thenables enable the use of ```async``` / ```await```, but do not necessarily have all the same features as a typical Promise object, such as the ability to do ```.then``` chaining. 

## Example
Mongoose queries are thenables but are not promises:
https://mongoosejs.com/docs/queries.html#queries-are-not-promises

The following code logs the ouptut of the query:

```JavaScript
  const availableRbacGroups = () => {
    rbacGroups.find().exec()
    .then(res => console.log(res))
  }
  availableRbacGroups()
```

However, if we were to chain an additional ```.then``` onto the function, it will log the output of the query, followed by undefined:

```JavaScript
  const availableRbacGroups = () => {
    rbacGroups.find().exec()
    .then(res => console.log(res))
    .then(res => console.log(res))
  }
  availableRbacGroups()
```