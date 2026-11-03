---
title: "My Website's Github Actions Workflow"
date: 2026-02-19T06:22:56-05:00
draft: false
author: Josh Noll
tags:
  - Automation
  - Github Actions
  - Learn Out Loud
image: /my-websites-github-actions-workflow/github-actions.png
toc: true
---

I run this website on an Azure storage account with static site hosting enabled. I've found this to be one of the most cost effective ways of running a simple static website (it costs me about $0.07 per month to run two sites). Although there are simpler (and even completely free) options out there like Github pages, I like doing it this way because it gives me a chance to work with real cloud technologies. I wrote a post about how I originally set it up [here](https://joshrnoll.com/migrating-my-website-to-azure/).

For a while, I've been using a shell script to deploy changes to this site. With my SAS token at the ready, I could run `./deploy.sh`, answer a couple of prompts, and my changes would get pushed. The script looks like this:

```bash
#!/bin/bash

deploy_website() {
    while [[ $CHOICE != 'Y' && $CHOICE != 'N' ]]; do
        read -p "Deploy to target -- ${HUGO_TARGET}, with storage account -- ${AZURE_STORAGE_ACCOUNT}? [Y/N]: " CHOICE
    done

    if [ $CHOICE = 'Y' ]; then
        echo "Deploying to target ${HUGO_TARGET}..."
        hugo deploy --target=$HUGO_TARGET
        return $?
    fi

    if [ $CHOICE = 'N' ]; then
        echo "Aborting..."
        return 1
    fi
}

read -p 'Storage account name: ' AZURE_STORAGE_ACCOUNT
read -sp 'SAS Token: ' AZURE_STORAGE_SAS_TOKEN
echo
read -p 'Target hugo environment: ' HUGO_TARGET

CHOICE=''
export AZURE_STORAGE_AUTH_MODE="key"
export AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT
export AZURE_STORAGE_SAS_TOKEN=$AZURE_STORAGE_SAS_TOKEN

deploy_website
```

While this worked... there's a better way.

## Github Actions

Essentially, all the script is doing is synchronizing the local `public` folder in the hugo repo to the blob storage account. It uses hugo's built in `deploy` command which, in the background, is just using `azcopy`.

The problem with the script is:

1. I have to run it manually and paste an SAS token into the prompt every time
2. If I forget to run the command `hugo`, then no changes get synced because there are no updates to the `public` folder.

(Yes, I could have added the second part to the script, but I jumped ahead to the better way)

By wrapping all of this functionality into a Github Actions workflow, I could bypass the need to do any of this manually. Just push to main, and my site would get updated. Here's what the workflow looks like:

```yaml
# yaml-language-server: $schema=https://json.schemastore.org/github-workflow.json
name: Deploy Website to Azure Storage Account
on:
  push:
    paths:
      - "public/**"
    branches:
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4
      - name: Install azcopy
        uses: kheiakiyama/install-azcopy-action@v1
        with:
          version: "v10"
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "latest"
      - name: Build site
        run: hugo
      - name: Sync files to Azure storage account
        run: azcopy_v10 sync "./public" "${{ secrets.endpoint_sas_url }}" --recursive --delete-destination=true --from-to LocalBlob
```

There's one secret that needs to be set in Github for this action to work -- `endpoint_sas_url`

This is an entire connection string rather than just the SAS token. It's formatted like this:

`https://<storage-account>.blob.core.windows.net/%24web?<sas-token>`

> NOTE: If you copy this from the azure portal, it may have a $ instead of a %24.
> The $ needs to be url encoded to %24 or the azcopy command in the action will fail.
