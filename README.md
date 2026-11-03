# Josh Noll's Website

Personal site built with [Astro](https://astro.build). The application and its package scripts live in [`astro/`](astro/).

## Local development

```bash
cd astro
npm ci
npm run dev
```

Run the production checks with:

```bash
cd astro
npm run test
npm run build
```

## Deployment

GitHub Actions builds the Astro site and syncs it to Azure Blob Storage. Set the repository secret `endpoint_sas_url` to a static-site container SAS URL in this form:

```
https://<storage-account>.blob.core.windows.net/%24web?<sas-token>
```
