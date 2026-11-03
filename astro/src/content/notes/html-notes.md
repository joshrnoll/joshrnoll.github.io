---
date: 2025-06-07T14:00:18-04:00
draft: false
title: HTML Notes
tags:
  - "html"
  - "programming"
  - "webdevelopment"
---
### Indenting
A good rule of thumb to follow for HTML is that you **enter down a line and indent whenever you are nesting a new tag**

```HTML
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <h2>My coding journey starts now!</h2>
  </div>
</body>
```

### Tags and Attributes
Not all tags need a beginning and an end, some tags are self-closing and do not need to wrap content. This is because they aren't thought of as enclosing anything. Think of them as boxes that are already closed and taped up, so there's no need to close them.

```HTML
<img src="foo.com/thing.png">
<input value="Input Here!">
<hr>
```

The above examples contain **attributes**, which are more information attached to an _element_. These attributes are usually to generate content or to act as a reference for other technologies like CSS & JavaScript.

#### Structural Tags
Use these tags to create the overall hierarchy of the content in your page:
- header
- nav
- main
- section
- article
- aside
- footer
- div

The `main` tag is intended to contain content that is not repeated elsewhwere in your site. This is where the bulk of your other HTML will live. There should only be one `main` tag per HTML document.

### Tree (Box) Structure
Each element has a parent, it sometimes has siblings and it also may have children. Imagine a large box that you put smaller boxes in- the smaller boxes are contained within the larger box. They can't be in multiple boxes at once, so he larger box can be thought of as their parent or container. 

HTML pages always have the following structure:
- Doctype `<!DOCTYPE html>`
- HTML `<html>`
- head `<head>`
    - links to CSS stylesheets, some javascript links, meta-data, the `<title>` tag
- body `<body>`
    - page content (`<h1>`, `<p>`, `<div>`, `<ul>`, `<li>` etc.)

### Errors seen in HTML validator

https://validator.w3.org/#validate_by_input

#### Element span not allowed as child of element ul in this context. (Suppressing further errors from this subtree.)

Unordered lists and ordered lists can ***only*** have their respective list items inside of them as elements. 

```HTML
<ul>
  <span>Info about the list</span>  <!-- Not allowed here! -->
  <li>Item 1</li>
</ul>
```

#### No p element in scope but a p end tag seen.

This usually happens because a block-level element was placed _inside_ the opening `<p>`, which is **not allowed**.

```HTML
<p>
  <h1>Cities I've Lived</h1>      <!-- Block-level! Not allowed inside <p> -->
  <span>I've lived in many cities ...</span>
  <ul> ... </ul>                  <!-- Block-level! Not allowed inside <p> -->
</p>
```
