import argparse
import os
import re
import shutil
import subprocess

import yaml
from jinja2 import Environment, FileSystemLoader

LIVE_HTML = "src/index.html"
LIVE_PDF = "src/resume.pdf"
RENDERCV_PDF = "rendercv_output/Josh_Noll_CV.pdf"


def markdown_link_to_html(text):
    """Convert markdown links [text](url) to HTML <a> tags"""
    pattern = r"\[([^\]]+)\]\(([^\)]+)\)"
    return re.sub(pattern, r'<a href="\2">\1</a>', text)


def render_html(dest):
    with open("resume.yaml", "r") as f:
        values = yaml.full_load(f)

    env = Environment(loader=FileSystemLoader("templates"))
    env.filters["md_link"] = markdown_link_to_html
    template = env.get_template("resume.html.jinja")
    output = template.render(values)

    with open(dest, "w") as f:
        f.write(output)


def build_live():
    # Default path: regenerate the live site files in src/.
    print("Running rendercv to generate PDF...", flush=True)
    subprocess.run(["rendercv", "render", "resume.yaml"], check=True)

    render_html(LIVE_HTML)
    print(f"Generated {LIVE_HTML}")

    if os.path.exists(RENDERCV_PDF):
        shutil.copy(RENDERCV_PDF, LIVE_PDF)
        print(f"Copied {RENDERCV_PDF} to {LIVE_PDF}")
    else:
        print(f"Warning: {RENDERCV_PDF} not found!")


def build_tailored(output_dir):
    """Write DIR/resume.pdf and leave the live src/ files alone."""
    live_src = os.path.abspath("src")
    resolved = os.path.abspath(output_dir)
    if resolved == live_src or resolved.startswith(live_src + os.sep):
        raise SystemExit(
            "Refusing to write --output inside src/. That directory is the live resume."
        )

    os.makedirs(output_dir, exist_ok=True)
    pdf_dest = os.path.join(output_dir, "resume.pdf")
    # Keep the Typst source next to the PDF so RenderCV does not refresh the
    # tracked rendercv_output/ directory during a tailored build.
    typst_dest = os.path.join(output_dir, "resume.typ")

    print(f"Running rendercv to generate PDF in {output_dir}...", flush=True)
    subprocess.run(
        [
            "rendercv",
            "render",
            "resume.yaml",
            "--pdf-path",
            pdf_dest,
            "--typst-path",
            typst_dest,
            "--dont-generate-markdown",
            "--dont-generate-html",
            "--dont-generate-png",
        ],
        check=True,
    )

    if not os.path.exists(pdf_dest):
        raise SystemExit(f"Error: {pdf_dest} was not created.")

    print(f"Generated {pdf_dest}")
    print(f"Left {LIVE_HTML} and {LIVE_PDF} unchanged.")


def main():
    parser = argparse.ArgumentParser(
        description="Build the resume from resume.yaml. Run this from the resume/ directory."
    )
    parser.add_argument(
        "--output",
        metavar="DIR",
        help=(
            "Write a tailored PDF to DIR/resume.pdf and leave "
            "src/index.html and src/resume.pdf unchanged."
        ),
    )
    args = parser.parse_args()
    if args.output:
        build_tailored(args.output)
    else:
        build_live()


if __name__ == "__main__":
    main()
