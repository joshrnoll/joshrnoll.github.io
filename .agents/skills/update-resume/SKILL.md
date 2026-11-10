---
name: update-resume
description: Use when updating Josh's resume, either to tailor it to a job posting or to make a general change such as a new role, accomplishment, or skill.
---

# Update resume

The resume lives in `resume/` in this repository. `resume/resume.yaml` is the source. `resume/src/index.html` and `resume/src/resume.pdf` are the live site files deployed with the website. Do not treat paths as if this were the old standalone resume repo.

Python setup is documented in `resume/README.md` and `resume/DOCS.md`. From `resume/`, build with `python make.py`. Do not recreate the virtualenv steps.

## Rules for both modes

1. Do the work on a new git branch. Never commit on `main`, and never push straight to `main`.
2. Edit only the `cv` section of `resume/resume.yaml`. Never modify `design`, `locale`, or `settings`.
3. Never change formatting, spacing, fonts, margins, or any other styling.
4. Keep the RenderCV schema exactly as it exists, and follow the writing style already in the file.
5. Use only material that is already in `resume/resume.yaml` or `resume/ILM.md`, or that Josh explicitly provides. Never invent accomplishments, employers, dates, metrics, or skills.
6. Reorder, rephrase, select, or add only from those sources. If a fact is not in those files and Josh has not stated it, leave it out.
7. Verify that `python make.py` completes successfully before committing.

Read `resume/resume.yaml` and `resume/ILM.md` before editing.

## Choose a mode

- **Tailor mode** when Josh gives a job posting URL, a job description, or a job title to target.
- **General-update mode** when he wants the main resume changed (a new role, accomplishment, skill, or similar) without aiming it at one posting.

## Tailor mode

One branch per job posting. Start from `main` so job branches do not stack on each other.

Derive `<job-slug>` from the job title. If the input is a URL, fetch the posting and use its title. Lowercase kebab-case, letters, numbers, and hyphens only, 50 characters maximum.

```bash
git checkout main
git checkout -b tailor/<job-slug>
```

### Edit

In the `cv` section of `resume/resume.yaml` only:

- **Summary.** Two or three sentences. Emphasize experience that matches the posting, using its keywords only where they describe real work.
- **Skills.** Put the most relevant skills first. Add a skill from `resume/ILM.md` when it is relevant and not already listed. Keep the comma-separated format.
- **Experience.** Reorder highlights so the relevant ones come first. Add accomplishments from `resume/ILM.md` that are not already on the resume. Rephrase with posting keywords only when the claim stays true. Drop less relevant highlights if the resume gets too long. Keep company, position, dates, and highlights in the existing RenderCV shape.
- **Projects.** Put the most relevant projects first. Expand a description only with details from `resume/ILM.md`.
- **Certifications and education.** Leave these as they are unless reordering them clearly helps. Do not rewrite the facts.

### Build

From `resume/`:

```bash
python make.py --output "tailored/<job-slug>"
```

That writes `resume/tailored/<job-slug>/resume.pdf` and does not modify `resume/src/index.html` or `resume/src/resume.pdf`. `resume/tailored/` is gitignored.

Confirm the PDF exists and the live files are untouched:

```bash
test -s "tailored/<job-slug>/resume.pdf"
git status --short -- src/index.html src/resume.pdf
```

The status command must print nothing.

### Commit

From the repository root, stage only the resume source. Do not stage `resume/src/resume.pdf`, `resume/src/index.html`, `resume/tailored/`, or `resume/rendercv_output/`.

```bash
git add resume/resume.yaml
git commit -m "Tailor resume for: <job title>"
```

Do not merge this branch. The site build runs `python make.py` and would republish whatever is in `resume/resume.yaml`. Merging a tailoring branch would replace the live resume with the tailored one. The branch is for review. Josh applies with the PDF at `resume/tailored/<job-slug>/resume.pdf`.

Tell him the branch name, how to review it (`git diff main -- resume/resume.yaml`), and that the branch should not be merged.

### Gaps report

End every tailor run with a gaps report, after the summary of what changed.

List each requirement from the posting that the tailored resume still does not show evidence for. Evidence means a skill, highlight, project, certification, or education entry that actually demonstrates it. For a job title with no posting, use the typical requirements for that title and mark them as inferred.

For each gap, ask Josh whether he has real experience to add, and what the wording should be. Do not fill a gap until he confirms it, and only then with facts he provides or that already exist in `resume/resume.yaml` or `resume/ILM.md`.

If nothing is missing, say that explicitly.

## General-update mode

Use this for a lasting change to the main resume. One branch per update. Start from `main`.

```bash
git checkout main
git checkout -b resume/<short-slug>
```

Edit only the `cv` section. A fact Josh states in the request counts as explicitly provided. Do not embellish it with numbers, scope, or tools he did not give you and that are not already in `resume/resume.yaml` or `resume/ILM.md`.

Rebuild the live files with the default build, from `resume/`:

```bash
python make.py
```

Verify `resume/src/index.html` and `resume/src/resume.pdf` were generated.

From the repository root, commit the source and those live outputs on the branch:

```bash
git add resume/resume.yaml resume/src/index.html resume/src/resume.pdf
```

If that default build also changes already-tracked files under `resume/rendercv_output/`, include them in the same commit so the README preview matches the resume. Do not push to `main`. Tell Josh the branch name and that it is ready for him to review.

## Finish

In either mode, close with:

- the branch name
- which sections changed and why
- the top matching points between the resume and the request
- tailor mode only: the tailored PDF path, the reminder not to merge, and the gaps report
