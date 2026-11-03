---
title: "Migrating My Website to Azure"
date: 2024-07-18T07:20:14-04:00
draft: false
author: Josh Noll
tags:
  - Cloud
  - How-To
  - Azure
image: /azure.png
description: How I migrated my website from a hosted WordPress to a Hugo site running on Azure
toc: true
---
I've been running this website for about a year now. You'll notice that in that time, I've made fewer than 10 posts... Part of the reason for this, besides my crippling and undiagnosed ADHD, is because of the friction it took to write something. I'm not just talking about the mental friction of coming up with ideas and drafting outlines or mind maps. I'm talking about the technical friction it took just to get to the interface in which I could physically write something. 

I had been running this site on a WordPress provider, and although this was great for simplicity and got my site off the ground quickly, it wasn't great for operating and maintaining a blog (at least for me). In order to write a post, I would have to log in to my provider's website (which happened to also be my domain's registrar -- [namecheap.com](https://namecheap.com)), then log in to the WordPress admin dashboard, create a new post, add my categories and tags and start writing. Once I started writing, I quickly became frustrated with the WordPress interface. Copy and pasting becomes a pain because of the way WordPress groups things into blocks and any features you want to add require shopping for a plugin (many of which have a cost associated with them). For example, after a lot of trial and error I landed on the [prismatic](https://prismatic.io) plugin for code blocks and syntax highlighting. 

A while ago though, my friend [Robbie](https://litts.me) turned me on to the static site generator, [Hugo](https://gohugo.io). See, I spend a lot of time in my code editor (VS Code), mostly working on my homelab's ansible playbook as of lately. Wouldn't it be great if I could write a post in the raw markdown syntax that I'm already familiar with, side-by-side with the code that I'm writing? Then when I'm done with whatever the project is, I can publish a post about it that's already written! Well Hugo allows you to do just that. And if you choose to host your site on a cloud storage account, you can even publish updates to your site by simply running ```hugo deploy``` in your terminal.  

## Prerequisites
If you'd like to follow along, I'll assume you have the following (or can figure out how to do them with a quick google):
- A domain name (you can purchase one from registrars like Cloudflare, Namecheap, GoDaddy etc.)
- Hugo installed on your computer
- Git installed on your computer (and at least a rudimentary knowledge of how git works)
- A remote git repo to push your site to (whether that's on GitHub, GitLab or a self-hosted option like Gitea)
- [An Azure account](https://azure.microsoft.com/en-us/free)
- Azure CLI installed on your computer
- [A Cloudflare account](https://dash.cloudflare.com/sign-up/)

## Install Hugo and Generate a Site
The first thing I needed to do was see what Hugo was all about. After installing it and reading through Hugo's [quickstart](https://gohugo.io/getting-started/quick-start/) tutorial, I realized I needed to pick a theme to start off with. Hugo has a list of themes [here](https://themes.gohugo.io/) but others exist that aren't on that list. You can also write your own custom themes if you feel inclined. I opted to go with the  [Hugo Profile](https://themes.gohugo.io/themes/hugo-profile/) theme.

So, my quickstart looked something like this:

```bash
hugo new site joshrnoll
cd joshrnoll
git init
cd themes
git clone https://github.com/gurusabarish/hugo-profile.git
echo "theme = 'hugo-profile'" >> hugo.toml
hugo server
```
#### Potential pitfalls
Now, there are some inconsistencies with the instructions on the Hugo Profile GitHub repo and Hugo's quickstart instructions. 

- The theme wants you to pass the ```--format="yaml"``` flag to the ```hugo new site``` command. This will create a **hugo.yml** file instead of a **hugo.toml** file for your site's configuration. 
- The theme also instructs you to cd into the themes folder and use ```git clone``` rather than creating a submodule like the quickstart does. 

If you happen to miss the ```--format="yaml"``` flag, you can just manually create a .yml file in place of the .toml file. This is what I did and did not have any issues. Also of note, the theme has you name the file ```config.yml``` rather than ```hugo.yml``` and according to Hugu's [docs](https://gohugo.io/getting-started/configuration/), this is fine as these are interchangeable. 

Using the ```git clone``` command inside of an existing git repository will cause issues when you push to your remote repository. My remote repository was on Gitea and this caused the Gitea repo to show a folder named 'hugo-profile @1^&%2312' (or something like that). The actual folder was just named hugo-profile. This had something to do with the fact that the hugo-profile folder was a git repo inside of a git repo, but it was never properly initialized as a submodule (something the quickstart will have you do with the ananke theme). I never quite figured it out and ended up cloning the theme separately and manually copying the files into the joshrnoll repo. So, my theme isn't a true submodule and won't get updates... but I ended up tweaking the theme a little to my liking anyway so I'm okay with that.

### Up and Running
Now, with the ```hugo server``` command you can bring up a local server of your site running on port 1313 from your computer. You can see your site by going to 
```
http://localhost:1313
```
If you've made no changes to the config file, your site should look like the [Hugo Profile demo site](https://hugo-profile.netlify.app/).

Now, all you need to do is tweak and configure the site to your liking! In my case, I configured the main page from scratch. I didn't use any kind of import tool to migrate the meat of the site from WordPress to Hugo (although these tools do exist). I was hoping for a fresh start anyway. 

### Migrating Content
What I didn't want a fresh start on, however, was all of my posts. I wanted to keep the posts that I had already written, but I didn't have any versions of them in markdown. I ended up using the [Jekyll Exporter](https://wordpress.com/plugins/jekyll-exporter) plugin which worked almost flawlessly. It did take some tweaking to get the images to show up properly, however, for the most part I simply copied the markdown files into the content folder for my Hugo site. 

## Set Conditions for the ```hugo deploy``` Command
The ```hugo deploy``` command offers a streamlined way to deploy your site directly to a cloud storage account. Working in very similar fashion to rsync, it will simply upload new and changed files to the storage account each time you run ```hugo deploy.``` You can also pass the ```--force``` flag to force the command to re-upload every file rather than just new and changed ones. 

If you're not very familiar with the cloud, you may be confused as to why you would want to just upload your code to a storage account. Don't you need a server to run the site? Well, most major cloud providers offer the capability to enable static site hosting on their storage services. You can simply drop your code into the object storage account and be provided a web URL to access your site from the internet. This abstracts away the need for a server. I recently passed the Azure Administrator Associate exam, so I figured I would try my hand at doing this in Azure. 

### Create a Resource Group
The first thing we'll do is [create a resource group](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups). This is simply a logical grouping of resources that allows for easier management and governance in an Azure subscription. Most major cloud providers offer the same feature. To create a resource group in Azure. You can call your resource group whatever you like and you can choose to add any tags that you like (or none at all).

### Create a Storage Account 
Next, we'll need a [storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal#create-a-storage-account). In the portal click on *storage accounts* and then click *create.* Be sure to select the resource group that you created, and give the storage account a name. The name has to be globally unique. Think of it like a domain name, but for your storage account. Don't worry about *liking* the name, because you won't access your site from it once we're finished setting up a custom domain. However, I wouldn't make it too long or hard to remember as you will need to reference it. Something like **yourdomainnamestorage** would work great. (Unfortunately you cannot add hyphens or any special characters).

In the redundancy option, I recommend setting this to either locally-redundant storage or zone-redundant storage. You can read more about storage redundancy options [here](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy), but this will keep the costs of your site to a minimum. If you need the highest availability possible for your site, you can leave the default of geo-redundant storage. You can also use the [Azure pricing calculator](https://azure.microsoft.com/en-gb/pricing/calculator/) to get an idea of the price differences between these storage tiers.

In the networking section be sure to leave the default of *enable public access from all networks.* You can leave everything else default. Be sure to add any tags that you would like and then click *review+create.*

### Enable Static Site Hosting
Now that we have a storage account, we need to enable the static site hosting capability on it, which is not enabled by default. To do this, click on your storage account and click on the *capabilities* tab in the overview panel. Then click *static website* and slide the toggle to *enabled.* If you're following along and using Hugo, your index document name will be **index.html** and your error document path will be **404.html**, unless you've changed these by making custom edits to your theme. 

At this same screen you should be provided a *primary endpoint* which will be a URL that looks something like 

```
https://yourstorageaccountname.z13.web.core.windows.net/
```

Now, we haven't uploaded any files so this URL won't produce anything just yet. But make note of it, we'll need it to test our site in a few minutes.

### Generate a Shared Access Signature (SAS) Token
We'll need a way for the ```hugo deploy``` command to authenticate into our storage account. We can accomplish this by creating a [Shared Access Signature or SAS token](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview). An SAS token allows you to provide secure, delegated access to a storage account. You can set expirations and limit the level of access the token has, but most importantly, for our use case, we can use this to access the account programmatically from the CLI. The following permissions on the SAS token should suffice, be sure to set the expiration date appropriately: 

![](/migrating-my-website-to-azure/sas-generation.png)

Once you click *Generate SAS and connection string* you will be presented with the SAS token. Make sure you copy it because once you close this screen you cannot go back to it without creating a new SAS token. I recommend that you save this in a secure password manager like [Bitwarden](https://bitwarden.com/).

### Upload Content
So, now we have a hugo site in a local git repository (and, ideally in a remote git repository as well). We have an Azure storage account with static site hosting enabled, and we have an SAS token to access that account. Now we just need to deploy our hugo site using the ```hugo deploy``` command.

The first thing we'll need to do is add the deployment information into our hugo config file. It should look something like this:

```YAML
deployment:
  targets:
    - name: production
      URL: azblob://$web
```

This, of course, assumes that your config file is in .yml format and not .toml format. If you are using a different format, adjust accordingly. The target name can be whatever you like and you can even add multiple targets.

***NOTE: If you are using Azure, the URL in this configuration is literally azblob://$web -- You do NOT add your storage account endpoint URL into this. This had me hemmed up for a while.***

Now, if you don't have Azure CLI installed, make sure to do so. You can find instructions [here](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli). The first thing we'll need to do is log in to the Azure CLI which can be done with the command ```az login```. This will simply redirect you to the Azure portal to log in as you normally would. Once logged in, you can return to your terminal. There are a few environment variables we will need to set.

#### AZURE_STORAGE_ACCOUNT
We need to set this to the name of our storage account so that ```hugo deploy``` knows which account to connect to.
```bash
export AZURE_STORAGE_ACCOUNT="yourstorageaccountname"
```

#### AZURE_STORAGE_AUTH_MODE
This will need to be set to the value **key** so that we can use our SAS token
```bash
export AZURE_STORAGE_AUTH_MODE="key"
```
#### AZURE_STORAGE_SAS_TOKEN
Finally, we will set this to the value of our SAS token. 
```bash
export AZURE_STORAGE_SAS_TOKEN="your-very-long-random-string-from-the-sas-token-goes-here"
```
Now we are ready to deploy our site! First, lets run the command ```hugo``` to publish our contents to the public folder if you haven't done that already. Otherwise, ```hugo deploy``` won't have any files to send to the storage account. 

Now, we can simply run:

```bash
hugo deploy
```
However, if you added multiple targets to your config file (maybe *test* and *production*) be aware that without passing the ```--target``` flag, Hugo will only deploy to whatever target is first. If you have a specific target, like a test environment, that you are deploying to you would need to run:

```bash
hugo deploy --target=test
```
If all went well, you should see a deployment success message. Now, let's test our site by going to the storage endpoint URL from earlier

```
https://yourstorageaccountname.z13.web.core.windows.net/
```
Now, if you're happy with that URL as your site's address, you can stop right here! You just deployed a static site to an Azure storage account. Whenever you want to update it, you can simply make the changes in your code editor and use the ```hugo deploy``` command to upload any changes. 

## Configure HTTPS with a Custom Domain
Azure storage accounts don't natively support using a custom domain with HTTPS certificates. If you are comfortable with your site having invalid certificates and producing a security warning to any of your would-be site visitors, then you can simply create a public CNAME record with whatever provider that is providing DNS for your domain which points your custom domain to the URL of the azure storage endpoint. 

***NOTE: I tried getting around this by using Cloudflare's DNS+Proxy which provides valid HTTPS certificates. However, for some reason this would return a URI invalid page. It wasn't until I created Azure CDN endpoints that Cloudflare's proxy worked.***

There are two options to produce valid HTTPS certificates for your site. [Azure Front Door](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview), which has a monthly minimum cost of $35/month, or [Azure CDN](https://learn.microsoft.com/en-us/azure/cdn/cdn-overview?toc=%2Fazure%2Ffrontdoor%2FTOC.json) which will cost pennies on the dollar for a simple static site. I obviously opted for Azure CDN, but whichever you decide to use, they are equally simple to get started with a storage account. 

### Create a CDN Profile and Endpoint
Go to your storage account and click on *Front Door and CDN.* Here, you will be able to easily provision either an Azure Front Door profile and endpoint, or an Azure CDN profile and endpoint. 

![](/migrating-my-website-to-azure/cdn-generation.png)

If you're following along with me, you'll click on Azure CDN, then select *create new*. You can call the profile and the endpoint whatever you like, however you will need to make note of the endpoint url to create a CNAME record in Cloudflare later, so I would pick something with a naming convention that is easy to remember. Select **Ignore Query String** for the query string behavior option. Finally, click *create*.

### Add a Custom Domain to your CDN Endpoint
It will take a few minutes for the resources to be created. Once they're done, go to your CDN endpoint resource. In the overview pane you will see the option to add a custom domain. 

![](/migrating-my-website-to-azure/custom-domain-button.png)

Click on this and you will be prompted to provide your *custom hostname* -- enter your domain name in this field. You will see a message stating:

*We couldn't find a DNS record for 'mydomain.com' that points to 'cdn-endpoint-mystorageaccount.azureedge.net'. Before you can associate a domain with this CDN endpoint, you need to create a CNAME record with your DNS provider for 'mydomain.com' that points to 'cdn-endpoint-mystorageaccount.azureedge.net'*

**Now, what Azure for some reason doesn't tell you here is that you actually will need a CNAME record with the cndverify prefix. For example, if your domain is mydomain.com and your storage account name is mystorageaccount, your CNAME would look like this:**

```
cdnverify.mydomain.com
```
points to
```
cdnverify.cdn-endpoint-mystorageaccount.azureedge.net
```
We will also need the CNAME records without these prefixes though. Let's take care of that.

### Creating CNAME Records in Cloudflare
Make sure you've created a Cloudflare account if you don't already have one. You'll need to click on the *Add Site* option and conduct whatever procedures are required with your domain registrar to allow Cloudflare to handle DNS for your domain. Once you've done that click on *Websites* and click on your domain name.

Once there, click on *DNS* then click *Add record*. 

![](/migrating-my-website-to-azure/cloudflare-add-record.png)

Under type, select *CNAME* then enter cdnverify.yourdomain.com under *Name* and under *Target* enter cdnverify.cdn-endpoint-mystorageaccount.azureedge.net (obviously replacing mydomain.com and mystorageaccountname with the real values).

***IMPORTANT: Ensure you DE-SELECT Proxy status for now***

![](/migrating-my-website-to-azure/cloudflare-add-record-2.png)

Be sure to do this process for **both the root domain name and the www subdomain**. Then, repeat the process **omitting the cdnverify prefix**.

Now, we can go back to Azure (we're almost done I promise).

### Verifying a Custom Domain on your CDN Endpoint
Go back to your CDN enpoint resource and try to add your domain again. You should see a green checkmark display next to it. Click *Add*. Then, repeat the process for the www subdomain (www.mydomain.com).

You should now see two custom domains under your CDN endpoint. Both should say *disabled* in the *Custom HTTPS* field. Now, here's the sucky part... Azure only supports Azure managed HTTPS certificates for subdomains. You can't add an Azure managed HTTPS certificate to your root/apex domain (the one without www). 

You can, however, bring your own certificate. However, not only would this require us to do manual certificate management (upload a new certificate every three months before it expires), but it also did not prove very easy to do. I attempted to get a server certificate from Cloudflare and upload it to Azure, however Azure didn't like the certificate format. Once I got past that, Azure didn't like the number of CAs in the certificate chain. So, I gave up. 

Not to worry though. The endpoint connections are still secured with HTTPS, they just have an invalid certificate because it is provisioned for the CDN endpoint URL and not your custom domain. We know the connection is secure and trusted, but our end users won't know that when they are met with a scary warning banner. 

There's an easy fix though. Remember how I had us turn the Cloudflare proxy off when we set up the CNAME records? Well, that was just to verify and add the domain to the CDN endpoint. We can go back and turn them back on now. Once you do, your site will be provisioned HTTPS certificates from Cloudflare and the warning banners should go away. 

And we're done! Not only does the site have valid HTTPS certificates managed by Cloudflare, but we are also taking advantage of Cloudflare's free DDOS protection and CDN. The CDN part is, of course, a little redundant since we're also using Azure's CDN. 

## Conclusion
So far, I'm loving Hugo as a tool for writing blog posts and the simplicity of being able to push updates with the ```hugo deploy``` command is a much more streamlined process than the way I updated my site in WordPress. The other added benefit is that I now own the code to this site. I can keep it version controlled in git, and if anything ever happens to my Azure account, the storage account that the site runs on or anything else, I can always take the code and host it elsewhere. Goodbye WordPress!