#!/bin/bash

read -p "Post title: " title

slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
date=$(date +%Y-%m-%dT%H:%M:%S%z)
file="astro/src/content/blog/${slug}.md"

if [[ -f "$file" ]]; then
  echo "Error: $file already exists" >&2
  exit 1
fi

cat > "$file" <<EOF
---
title: "${title}"
date: ${date}
draft: true
author: Josh Noll
tags: []
image: ""
description: ""
toc: false
---
EOF

echo "Created: $file"
