# Public content preservation audit — 16 October 2026

Before publishing, the existing HTML and stylesheet were downloaded from
https://santanban.github.io/TaxDirection/ and preserved as `legacy.html` and
`legacy.css`. The archived page changes only the stylesheet reference so its
original appearance does not depend on the replacement site's styles.

The redesigned homepage was compared with that live version, including every
external link and image. Three omitted historical resources were restored:
the original Google Form, its submission QR code and the original page-building
reference. The previous Hugging Face Space URL is also retained as an explicit
source/runtime resource, alongside the new workspace entry point.

| Existing information | Where it remains available |
|---|---|
| Tax as a scalar becoming a vector; hyperlocal citizen priorities | Homepage introduction, problem explanation and workflow |
| Original Google Form and optional suggested solutions | Research/history resources and original archived page |
| Submission QR | Visible homepage figure, original PNG asset and archived page |
| Change.org petition | Get involved and footer |
| Project repository and proposal/analysis outputs | Homepage research links, GitHub repo and unchanged analysis folders |
| Omdena challenge, collaboration repository and Notion workspace | Omdena background section |
| MyGov suggestion dataset through January 2023 | Research explanation and dataset link |
| Financial-weight and sentiment heatmaps | Both original images remain displayed with their files intact |
| Hugging Face migration/application | Source/runtime link, app workspace and framework explanation |
| LinkedIn and Facebook | Footer social links and archive |
| Original page-building reference | Research/history resources and archive |

The redesigned page additionally includes the conference record, book chapter,
FOSS project, allocation example and project-origin account already present in
the working checkout. The research notebooks, Excel files, images and presentation
are not replaced or removed. Historical or aspirational material is retained as
such; unsupported claims of live PAN verification or government permission have
been corrected for the actual demonstration status.

Run `python scripts/audit_content.py` from this repository to verify that every
unique original link and all original images are on the redesigned homepage and
that referenced local image files exist. This tests preservation, not whether
every third-party historical destination is still maintained or publicly readable.

GitHub Pages serves the project pages and `app.html`. The latter embeds the
Hugging Face application, whose Python backend cannot execute on GitHub Pages.
A direct application link is included for browsers that restrict embedded cookies.
