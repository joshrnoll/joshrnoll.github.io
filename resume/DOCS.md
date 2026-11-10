# My Cloud Resume

This project implements a cloud-hosted resume website, originally started as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev/). The resume is deployed to Azure Blob Storage and accessible at https://joshrnoll.com/resume/.

## How It Works

The project uses a hybrid resume generation system with `resume.yaml` as the single source of truth:

- **Content**: Resume data is stored in `resume.yaml` using the [RenderCV schema format](https://docs.rendercv.com/user_guide/yaml_input_structure/cv/)
- **Build Process**: Running `python make.py` generates two outputs:
  - **HTML**: Rendered via Jinja2 template (`templates/resume.html.jinja`) for web display
  - **PDF**: Generated via `rendercv` CLI tool for download
- **Deployment**: Both `index.html` and `resume.pdf` are copied to the `src/` directory and synced to Azure Blob Storage
- **CI/CD**: Gitea Actions automatically builds and deploys the site on every push to the main branch

The generated resume website includes action buttons for LinkedIn, GitHub, personal website, and PDF download.

## AI assisted resume updates

Resume updates are handled by the `update-resume` agent skill at [`.agents/skills/update-resume/SKILL.md`](../.agents/skills/update-resume/SKILL.md). It has two modes:

- **Tailor** the resume to one job posting. Each job gets its own branch. The tailored PDF is written with `python make.py --output tailored/<job-slug>` to `tailored/<job-slug>/resume.pdf`, which is gitignored. That command leaves the live `src/index.html` and `src/resume.pdf` unchanged, and those live files are not committed. Do not merge a tailoring branch: the site build regenerates the live resume from `resume.yaml`.
- **General update** of the main resume, such as a new role, accomplishment, or skill. This edits `resume.yaml`, rebuilds the live files with `python make.py`, and commits them on a branch for review. It does not push straight to `main`.

Both modes edit only the `cv` section of `resume.yaml`, and they use only material already in `resume.yaml` or `ILM.md`, or that Josh explicitly provides.

The default `python make.py` still regenerates `src/index.html` and `src/resume.pdf`.

## Setting up a developer environment

1. Install `azcopy` if you don't already have it

```
brew install azcopy
```

1. Set up the python venv

```
python -m venv ./venv
```

```
source ./venv/bin/activate
```

```
pip install -r requirements.txt
```

2. Edit `resume.yaml` to make updates to the reusme.
3. Run `python make.py` to generate a new index.html
4. Copy to Azure blob storage account

```bash
azcopy sync "./src" "https://<storage-account>.blob.core.windows.net/%24web?<sas-token>" --recursive --delete-destination=true
```
