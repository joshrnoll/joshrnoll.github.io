---
date: 2025-06-17T05:23:04-04:00
draft: false
title: CSS Notes
tags: []
---
> Fun game for practicing learning CSS: https://flukeout.github.io/

Using inline styles is a _bad practice_, for a couple of reasons:

1. You're cluttering up your HTML, and mixing content with styling.
2. It's hard to keep your code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) if you use inline styling. If you wanted to add a second `div` with the same styling, you'd need to duplicate all that styling code.

Example of inline styles:

```HTML
<div style="width: 200px; height: 200px; background-color: red;">Here's my first div!</div>
```

Instead, use a *stylesheet*:

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Kicking it with some Divs</title>
    <!-- This can also be put in a separate file -->
    <style> 
      div {
        width: 200px;
        height: 200px;
        background-color: red;
      }
    </style>
  </head>
  <body>
    <div>Here's my first div!</div>
    <div>Here's my second div!</div>
  </body>
</html>
```

Using an external stylesheet (separate file):

```HTML
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Kicking it with some Divs</title>
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <div>Here's my first div!</div>
    <div>Here's my second div!</div>
  </body>
</html>
```

```CSS
/* style.css */

div {
  width: 200px;
  height: 200px;
  background-color: red;
}

div {
  width: 300px;
  height: 100px;
  background-color: blue;
}
```

### Which Style Rules Will Win Out?

The answer is that whichever rule comes _latest_ in the stylesheet will take precedence (this is what the _Cascading_ means). However, you can overwrite this default behavior by using a more _specific_ selector.

### Levels of specificity:
(From least specific to most specific):

1. HTML Elements
2. Class attribute
3. id 
4. Inline styling
5. !important tag

```CSS
/* This is an id */
#green {
  background-color: green;
}
/* This is a class attribute */
.red {
  width: 200px;
  height: 200px;
  background-color: red;
}

/* This is an HTML element*/
div {
  width: 300px;
  height: 100px;
  background-color: blue;
}

/* If multiple of the same style are defined, the one that comes latest in the stylesheet will win out */
div {
  width: 500px;
  height: 100px;
  background-color: red;
}
```

> `id`s for an HTML element should be _unique_: no two elements should share the same `id`, and no element should have more than one `id`. Classes, however, don't have these restrictions: an element can have multiple classes, and multiple elements can share the same class.

