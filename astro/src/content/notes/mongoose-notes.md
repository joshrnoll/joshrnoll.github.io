---
date: 2025-10-01T06:25:58-04:00
draft: false
title: Mongoose Notes
tags:
  - mongodb
  - javascript
  - mongoose
---
## exec()
The exec function (stands for execute) can be used on a Query object to... execute the Query. For example. The following code does not actually execute the query. It just returns a Mongoose Query object and, therefore, will log out ```undefined```:

```JavaScript
usersModel.find({ groupName: "admin" })
.then((group) => {
	console.log(group)
})
```

However, adding exec will execute the query.

```JavaScript
usersModel.find({ groupName: "admin" }).exec()
.then((group) => {
	console.log(group)
})
```