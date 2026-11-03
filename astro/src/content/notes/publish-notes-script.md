---
date: 2025-05-22T05:16:21-04:00
draft: false
title: Publish Notes Script
tags:
  - python
  - automation
---
Since deploying a dedicated website for publishing my notes, I'm seeking to reduce the friction in actually publishing the notes. Ideally, I want to be able to check a box and have a note published to the site. 

# Front-matter
I figure I can leverage the Hugo [front matter](https://gohugo.io/content-management/front-matter/) to accomplish this. I'll start by creating a daily note template in obsidian with front matter that matches what my Hugo site uses, with the addition of the field ```publishNote```.

```
---
date: 
draft: false
title: 
tags:
---
```

### Date field
Hugo uses *ISO 8601* date formats. I'll get this in bash using the following command:

```
date '+%Y-%m-%dT%H:%M:%S%:z'
```

To make this easier, I've added an alias in my ```~/.bashrc``` file:

```
alias hugo-date="date '+%Y-%m-%dT%H:%M:%S%:z'"
```

### Draft field
This field tells Hugo whether the post should be published or not. Setting this to ```false``` will publish the note/post.

### Title field
This is the post's title in hugo. For my notes, I just keep this the same as the filename

### hideReply field
This field is used by the Hugo template I use to toggle a "reply" button on the post which would send an email to whatever email I configure in the template. I don't use this feature, so this is set to false every time.

### publishNote field

**This a custom field I've added** which I will use in a python script to check whether or not to publish the note.

### Tags field
This is used by Hugo to add tags to the post. Tags added here will also become tags in Obsidian.

