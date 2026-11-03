---
date: 2025-10-05T06:52:41-04:00
draft: false
title: NeoVim Auto Change Dir
tags:
  - neovim
  - config
  - editor
---
Add to ``` ~/.config/nvim/lua/config/autocmds.lua``` to ensure NeoVim changes directory when running ```nvim /path/to/dir```

```lua
vim.api.nvim_create_autocmd("VimEnter", {
  callback = function()
    local arg = vim.fn.argv(0)
    if type(arg) == "string" and arg ~= "" and vim.fn.isdirectory(arg) == 1 then
      vim.cmd.cd(arg)
    end
  end,
})
```
