---
date: 2025-05-24T05:34:51-04:00
draft: false
title: CI-CD Pipeline for Obsidian Notes
tags:
  - CI-CD
  - automation
  - Gitea
  - Hugo
---
### 1. Write a python script to move files from Obsidian vault to Hugo content path

```python
import frontmatter
import os
import shutil

def main(vault_path, hugo_path):
    notes_to_publish = find_publish_notes(vault_path)
    for note in notes_to_publish:
        note_name = os.path.basename(note)
        publish_path = os.path.join(hugo_path, note_name)

        # Check if the file already exists in the publish directory
        if os.path.exists(publish_path):
            print(f"File {note_name} already exists in {hugo}. Skipping.")
            continue
        
        # Copy the file to the publish directory
        shutil.copy(note, hugo_path)
        print(f"Copied {note_name} to {hugo}")

# Find notes in the vault with the publishNote frontmatter set to true
def find_publish_notes(path):
    publish_notes = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    note = frontmatter.load(f)
                    if("publishNote" in note.metadata and note.metadata['publishNote'] == "true"):
                        publish_notes.append(file_path)
    return publish_notes

if __name__ == "__main__":
    vault = "/var/home/josh/Documents/Obsidian/josh-obsidian-vault"
    hugo = "/var/home/josh/gitea/notes-joshrnoll/content/notes"
    main(vault, hugo)
```

### 2. Write Gitea Actions to publish website changes on git commit:

First attempt - runner doesn't have hugo installed by default. Added install command to first step:

```YAML
- name: Install Hugo

run: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install hugo
```

The run still failed after that with this in the logs:

```
Warning: /home/linuxbrew/.linuxbrew/bin is not in your PATH.
  Instructions on how to configure your shell for Homebrew
  can be found in the 'Next steps' section below.
==> Installation successful!
==> Homebrew has enabled anonymous aggregate formulae and cask analytics.
Read the analytics documentation (and how to opt-out) here:
  https://docs.brew.sh/Analytics
No analytics data has been sent yet (nor will any be during this install run).
==> Homebrew is run entirely by unpaid volunteers. Please consider donating:
  https://github.com/Homebrew/brew#donations
==> Next steps:
- Run these commands in your terminal to add Homebrew to your PATH:
    echo >> /root/.bashrc
    echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /root/.bashrc
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
- Install Homebrew's dependencies if you have sudo access:
    sudo apt-get install build-essential
  For more information, see:
    https://docs.brew.sh/Homebrew-on-Linux
- We recommend that you install GCC:
    brew install gcc
- Run brew help to get started
- Further documentation:
    https://docs.brew.sh
/var/run/act/workflow/1: line 2: brew: command not found
```

Looks like after installing Homebrew, you need to add it to $PATH (Homebrew is installed by default on Bluefin linux, which is what i'm using as my main workstation at the time of this writing, so I totally missed this).

I added the following to first step in the action:

```YAML
      - name: Install Homebrew and Hugo
        run: |
          /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
          echo >> /root/.bashrc
          echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /root/.bashrc
          eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
          brew install hugo
```

After adding this, the above step in the action finally ran successfully, however, the next step, which was simply meant to run the ```hugo``` command to build the site failed with the error ```/var/run/act/workflow/2: line 2: hugo: command not found```... I suspect that modifying the environment doesn't persist between steps.

As I suspected. The [docs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps) say:

>Because steps run in their own process, changes to environment variables are not preserved between steps.

My guess is that when running ```brew install hugo```, homebrew is actually adding the path to hugo's executable to the system's $PATH, which isn't persisted between steps because this is a modification of an environment variable.

I'll have to look into this, but it seems like the simplest fix is to add everthing into one step:

```YAML
      - name: Install Homebrew and Hugo
        env:
          AZURE_STORAGE_ACCOUNT_AUTH_MODE: key
          AZURE_STORAGE_ACCOUNT: ${{ secrets.AZURE_STORAGE_ACCOUNT }}
          AZURE_STORAGE_SAS_TOKEN: ${{ secrets.AZURE_STORAGE_SAS_TOKEN }}
        run: |
          /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
          echo >> /root/.bashrc
          echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /root/.bashrc
          eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
          brew install hugo
          hugo && hugo deploy --target=production
```

This worked! 🥳🥳

### 3. Write a bash script that runs git add, commit and push
```bash
#!/bin/bash

set -euo pipefail # Set strict mode to exit script on errors

REPO_DIR="/var/home/josh/gitea/publish-notes"
HUGO_DIR="/var/home/josh/gitea/notes-joshrnoll"
CURRENT_DATE=$(date '+%Y-%m-%dT%H:%M:%S%:z')

cd "$REPO_DIR"

source ./venv/bin/activate

python ./copy-notes.py

cd "$HUGO_DIR"

git checkout main
git add .

set +euo pipefail # Unset strict mode to allow for custom error handling

git commit -m "Update notes $CURRENT_DATE"
if [ $? -ne 0 ]; then
    echo "No changes published, skipping push"
    exit 0
fi

git push origin main
if [ $? -ne 0 ]; then
    echo "Issue pushing to remote repository"
    exit 1
fi
```
