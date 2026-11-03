---
date: 2025-10-10T15:36:23-04:00
draft: false
title: ImageMagick
tags:
  - tools
  - cli
---
ImageMagick is a command line tool for converting and manipulating image files and pdfs.

Install with ```brew install imagemagick```

Convert files from pdf to png with:

```
magick input.pdf output.png
```

This will produce a transparent background. To produce a solid background use:

```
magick input.pdf -flatten output.png
```

Sometimes the image version will be unreadable. The default DPI is around 72. You can change this with the ```density``` flag.

```
magick -density 500 input.pdf -flatten output.png
```