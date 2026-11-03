---
title: "Fixing Project Root Detection in Neovim"
date: 2026-02-27T20:04:53-05:00
draft: false
author: Josh Noll
tags:
  - NeoVim
image: /neovim.svg
toc: true
---

In the past few months, I've been swallowed by the NeoVim rabbit hole. It was intimidating at first, but I honestly cannot imagine using another IDE anymore. NeoVim is so powerful and so lightweight and infinitely customizable. I'll deep dive into my configuration some other day, but today I just want to share a quick problem I solved using NeoVim's concept of auto-commands.

## The plugins at play

The bottom line is that I had two plugins fighting with each other. One of them, [project.nvim](https://github.com/ahmedkhalf/project.nvim) uses either the LSP, a file pattern (like recognizing a `.git/` directory), or both to automatically detect a project. It will then store the path to this project's root directory (detected by either the LSP or the file pattern) in a JSON file at:

```
~/.local/share/nvim/project_nvim/project_history
```

It provides a [Telescope](https://github.com/nvim-telescope/telescope.nvim) extension for switching between projects and it _automatically set's NeoVim's current working directory to the project root_. This is helpful because when you want to search for files with Telescope, you generally want the entire project included in that search, not just the sub-directory that you happen to be working in.

BUT

I also use [oil.nvim](https://github.com/stevearc/oil.nvim): a nifty file explorer that let's you edit files as if they were a NeoVim buffer. Want to create a directory? Just enter insert mode and type `my-directory/`. Want to delete a file? Just use `dd`.

Now, it's not built in to oil by default, but I wanted NeoVim's working directory to be set to the parent directory of the file I'm opening. To do that, I added this to my config:

```lua
vim.api.nvim_create_autocmd("BufEnter", {
    pattern = "oil://*",
    callback = function()
        vim.cmd("lcd " .. require("oil").get_current_dir())
    end,
})
```

So, you might have already spotted the problem. If this is sourced before my project.nvim configuration, then oil is going to override the setting of the project root by project.nvim. So, if I opened a file like this:

```
nvim ~/projectroot/some_project_file
```

Then NeoVim's working directory would be set to the `~/projectroot` directory. But, from there, if I opened oil and navigated to `~/projectroot/some_subdir/some_project_file`, then oil would set the working directory to `~/projectroot/some_subdir` instead.

## The problem

This is the desired behavior when _not_ working in a project. If I'm just navigating items in my `~/Documents` folder, I would want NeoVim to just set the working directory to that directory. This allows me to open terminals in that directory and run other commands from the correct positioning.

But, when I'm working in a project, like a React project, a python project, or some kind of mixed monorepo, I want that project root directory to persist as NeoVim's working directory even if I navigate deep within the code base. This allows my floating terminals that I open with [fterm](https://github.com/numToStr/FTerm.nvim) to open in the project root directory every time and also allows me to search for files with Telescope throughout the entire codebase rather than just where I currently am.

## The solution

After some back and forth with claude, I finally found a working configuration:

```lua
-- Cache last project root directory on every buffer enter
vim.g.last_project_root = nil
vim.api.nvim_create_autocmd("BufEnter", {
	pattern = "*",
	callback = function()
		if vim.bo.filetype ~= "oil" then
			local ok, root = pcall(require("project_nvim.project").get_project_root)
			if ok and root then
				vim.g.last_project_root = root
			end
		end
	end,
})

-- Change nvim directory on oil buffers
vim.api.nvim_create_autocmd("BufEnter", {
	pattern = "oil://*",
	callback = function()
		if vim.g.last_project_root then
			vim.cmd("lcd " .. vim.g.last_project_root)
		else
			vim.cmd("lcd " .. require("oil").get_current_dir())
		end
	end,
})
```

The first part caches the project root directory to a global variable on _anything that is not an oil buffer_. That part is critical because project.nvim returns `nil` for the project root within an oil buffer and therefore throws a big, gross error every time oil opens.

The second part essentially tells oil to respect the project root if it exists. Otherwise it sets the working directory to the path of what you just opened.

This is what I love about things like NeoVim and Arch linux. It's a never-ending problem-solving journey. Some people are turned off by that, but I find excitement in it.
