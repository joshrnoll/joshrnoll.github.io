---
date: 2025-06-07T14:00:18-04:00
draft: false
title: JavaScript Notes
tags:
  - "programming"
  - "webdevelopment"
  - "javascript"
---
#### Ways to define a variable
```JavaScript
// Using var
var var1 = true;

// Using const
const var1 = true;

// Using let
let var1 = true;
```

#### The 'Not' Operator
```JavaScript
var sense = true;

var nonsense = !sense;

var notNonsense = !nonsense;
console.log('Not Nonsense:', notNonsense);
```
Output:
```
"Not Nonsense:" true
```

#### Numbers
One number type in JS - ```Number``` (can be pos, neg, floating point etc)
three symbolic values - ```+Infinity```, ```-Infinity```, and ```NaN``` (Not a Number)

### DOM (Document Object Model)

A DOM is a *representation* of the HTML file. It's an object that can be manipulated using JavaScript code.

### Events
An *event listener* runs when a particular event (like a click of a button) happens.

There is a _parameter_ that you can pass into your event handler functions: the event object. The event object gives you lots of information about the event. For example, you can use it to log some text to the console whenever a user clicks on an HTML element.

`this` refers to the DOM element that the listener was attached to. Put another way, whenever you write `foo.addEventListener('click', someFunction)` the context of `this` inside of `someFunction` will refer to `foo`. On the other hand, `event.target` will refer to the element that caused the event to fire.

```JavaScript
// Will log only will only log what caused the event to fire (what was clicked on)
var div = document.querySelector("div");

var logText = function(event) {
  console.log(event.target.textContent);
}

div.addEventListener("click", logText);
```

```JavaScript
// Will log everything inside the DOM
var div = document.querySelector("div");

var logText = function() {
  console.log(this.textContent);
}

div.addEventListener("click", logText);
```

When the element that fires the event is the same as the element that has the listener on it, you should see that `this` and `event.target` are the same. But there are times when you'll want to add the event listener to an element that won't necessarily be the same as the element (or elements) that will be firing the event.

When manipulating the DOM, it's important that your JavaScript code not load until the DOM is ready. There are a couple of ways to do this. The most common way is to use the `DOMContentLoaded` event:

```javascript
var imgLog = function() {
  console.log("You moused over Mega Man!");
}

document.addEventListener("DOMContentLoaded", function() {
  var img = document.querySelector('img');
  img.addEventListener('mouseover', imgLog);
});
```

This event fires when the document has been loaded and parsed. This happens before all assets (e.g. images, videos, stylesheets, etc.) have completely loaded. In other words, `DOMContentLoaded` gets fired before the window finishes loading.

When an event happens. It _captures_ down the DOM tree from `<html>` to the element where the event happened. Then, it _bubbles_ back up the DOM tree until it gets back to `<html>`. Along each element it passes, it fires the event.