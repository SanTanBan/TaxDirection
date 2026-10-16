# #TaxDirection — the Platform

**New international framework:** the sibling Hugging Face application checkout now
contains `framework/`, a connected citizen and government web application. From that
checkout run `python -m framework.server --demo`, then open http://127.0.0.1:8787.
All app launch buttons now link to [the workspace](app.html), embedded in the GitHub Pages site,
which offers a local preview and the verified Hugging Face application host
https://santanubanerjee-taxdirection.hf.space. The Hugging Face checkout includes a
Docker entrypoint so that the existing Space can serve the same framework after
publication and a successful build. The implementation and
documentation cover annual drafts/locks, 15 country configurations, transactional
batch heatmaps, proposal provenance, government responses and production requirements.
The country registry does not
imply live verification or official endorsement.

The previous public site is preserved in [legacy.html](legacy.html). See [CONTENT_AUDIT.md](CONTENT_AUDIT.md) for the source-by-source preservation check.

> **"Revolutionizing Tax from a scalar to a vector."**

#TaxDirection lets Indian taxpayers direct a small, government-allowed fraction of their tax (default **5%**) toward the specific problems they most want solved. Taxpayers log in, verify their PAN, declare the year's tax, and submit **up to 3 "wishes"** — each with a percentage weight (the three auto-normalize to 100%). Wishes are aggregated and **clustered by problem-domain and geography**; each cluster gets a financial weight (the sum of its wishes' directed amounts), and an **LLM generates one project proposal per cluster**.

It turns a single tax number into a *direction* — a vector of citizen priorities — giving the government more data, insight, and accountability while still retaining full control over whether (and how much) to apply the rule.

### Two parts, two repos

| Part | Repo / Host | What it is |
|------|-------------|------------|
| **Public site + dashboard** | *this repo* → [GitHub Pages](https://santanban.github.io/TaxDirection/) | A static landing/explainer page (`index.html`) and a live public results **dashboard** (`dashboard.html`) that renders the aggregated clusters and their AI proposals. |
| **App + AI pipeline** | [Hugging Face Space](https://huggingface.co/spaces/SantanuBanerjee/TaxDirection) | The Docker-hosted international framework and its Python API, with the older Gradio/NLP code retained. |

### This repo's GitHub Pages site

- **`index.html`** — landing page / explainer for the concept and the weighting model, with a styled walkthrough and a link to the app.
- **`dashboard.html`** + **`dashboard.js`** — the public results dashboard. It reads the aggregated `clusters` table from Supabase using **only** the public anon key (guarded by Row-Level Security) and renders one card per cluster: problem/location labels, financial weight, wish count, and the AI-generated proposal.
- **`config.js`** — paste your `SUPABASE_URL` and `SUPABASE_ANON_KEY` here to connect the dashboard. The anon key is safe to commit; the service-role key is **never** used in this repo. Until configured, the dashboard shows a friendly "Backend not configured" banner.
- **`styles.css`** — shared styling for the site.

### How the weighting works

```
normalized_weight_pct = raw_weight_pct * 100 / sum(raw weights of that user's wishes)
directed_amount_inr   = declared_tax_inr * (GOVT_ALLOWED_PCT / 100) * (normalized_weight_pct / 100)
```

`GOVT_ALLOWED_PCT` (default 5) is an admin setting, never editable by the user. PAN is validated, then stored only as a `sha256` hash plus the last 4 characters — the **raw PAN is never stored**.

### Try it / set it up

- **Live dashboard:** <https://santanban.github.io/TaxDirection/>
- **App (Hugging Face Space):** <https://huggingface.co/spaces/SantanuBanerjee/TaxDirection>
- **Full free-tier setup** (Supabase + Groq + HF + GitHub Pages): see `SETUP.md` in the Hugging Face repo.

---

# TaxDirection
Tagging public wishes globally and creating weighted investment of individual tax amounts based on the InSociEUP philosophy to life.


## The presentation slides from the conference are also uploaded to this repository
Conference, Venue & Date: 10th Management Doctoral Colloquium & VGSOM Research Scholars Day (MDC-VRS 2024); Vinod Gupta School of Management, IIT Kharagpur, India: https://www.linkedin.com/posts/vgsomiitkgp_mdc-vrs-2024-activity-7142869683329810432-Hc_y

Presentation Date: 1st February, 2024

Track: Finance and Accounting


### The index.html and styles.css files are for the website: https://santanban.github.io/TaxDirection/
## New pipeline with UI can be found here: https://huggingface.co/spaces/SantanuBanerjee/TaxDirection
(For sample datasets on HuggingFace, we used the MyGov portal submissions: https://github.com/SanTanBan/MyGov-Idea-Box-Suggestions-Scraping)
### OK Challenge Page: https://www.omdena.com/chapter-challenges/tax-allocation-manager-system


# The conference paper has been accepted as a Book Chapter
Chapter Title: Aggregating Citizens’ Personalised Recommendations into Tax Directions for automatic Project Proposal development using NLP, enabling Sustainable Hyperlocal Governance and Longevity

Authors: Santanu Banerjee, Tiyasa Mishra, Anandita Das, Atul Kumar Dubey, Krishna Das

Editor: Prof. Dr. Ramesh Chandra Das; Publisher: Routledge (Taylor & Francis)

ISBN: 9781041025276 ; Chapter No.: 15

Link: https://www.taylorfrancis.com/chapters/edit/10.4324/9781003619703-18/aggregating-citizens-personalised-recommendations-tax-directions-automatic-project-proposal-development-using-nlp-enabling-sustainable-hyperlocal-governance-longevity-santanu-banerjee-tiyasa-mishra-anandita-das-atul-kumar-dubey-krishna-das

## The current proposal in FOSS 2026 is to develop an upgraded deployable version of the HuggingFace implementation and brainstorm on how to verify users based on PAN/Taxation...
Project Link: https://fossunited.org/hack/fosshack26/p/c6s7kea2an


### Interesting Fact:
I attended Zu\~Grama (https://zugrama.org/) in January-Feb 2025 and discussed the idea with an attendee Prof. M. V. Rajeev Gowda, a former Member of Parliament for Karnataka in the Rajya Sabha from 2014 to 2020 and a distinguished professor at IIM Bangalore from 2000 to 2014 (https://www.oneindia.com/politicians/prof.-m.-v.-rajeev-gowda-76817.html; https://en.wikipedia.org/wiki/Rajeev_Gowda). He actually was interested, and himself proposed that "maybe not 100% of the amount, but say 5% can be allocated to projects of their choice". Before this I believed that this Tax\~Direction could just be a good feedback system to tell the government regarding which decision to make (per year, through the budgets and policies); but actually allowing 5% of every person's tax amount to be allocated to the specific use case which the individual wants the government to solve (maybe a very specific problem) could be a gamechanger. Therefore, it is actually possible in leading democracies to pitch for a similar 5-10% Tax~Direction based Yearly Budgeting (yes, through this feedback every taxpayer will be able to affect each year's financial budget) and (unbiased) AI-enabled holistic policy development.. The government still retains the power to decide whether to implement the 5% or some-per cent rule; so this is just a soft control, but will probably be for the better than the worse due to more data, insights and accountability...
