# 🌐 Arun Pandian — Portfolio Website v2.0 Blueprint

> **Goal:** Rebuild `arun-pandian.netlify.app` as a recruiter-ready Data Analyst / AI Developer portfolio
> **Method:** ProjectPro portfolio guide principles + structure inspired by `divyagodayal.github.io`
> **Stack:** Next.js 14 + Tailwind CSS → deployed on Netlify/Vercel (free)

---

## 📌 Part 1 — Reference Site Structures

### 🔵 A) My Old Site — `arun-pandian.netlify.app` (current state)

```text
arun-pandian.netlify.app
├── Title      : "Arun Pandian | AI Software Developer"
├── Built with : Lovable (AI website builder)
├── Positioning: ML + Full-Stack + Data Science (too broad)
└── Issues to fix in v2:
    ├── ❌ Default Lovable OG image (lovable.dev placeholder) — looks template-made
    ├── ❌ "AI Software Developer" title dilutes the Data Analyst positioning
    ├── ❌ No project case studies with problem → process → insight flow
    └── ❌ No blog / write-ups to prove communication skills
```

### 🟣 B) Inspiration Site — `divyagodayal.github.io` (what to steal)

```text
divyagodayal.github.io  (Jekyll "Hyde" theme — 2-column layout)
├── LEFT SIDEBAR (fixed)
│   ├── Profile photo (Gravatar)
│   ├── Name + social icon row (GitHub, LinkedIn, Medium, +2)
│   └── Nav: Home · Skills · Experience · Projects · Tech Blogs · Poems
│
└── RIGHT CONTENT (scrolling, single page + anchors)
    ├── Hero        → "Hello, I'm Divya. A full-stack developer."
    │                 + personal motto: "Research, Design, Develop."
    ├── About       → story-driven intro, short-term goal, long-term goal
    ├── #skill-section     → skills as simple visual tags (15 skills)
    ├── #timeline-section  → Experience Timeline (numbered, logo + role +
    │                        company + dates + 1-line impact each)
    ├── #projects-section  → project cards: image/tag + title + dates +
    │                        2–3 line description + GitHub/Blog links
    └── Footer      → © year
```

**Why it works:** one page, anchor navigation, timeline storytelling, every project links to GitHub AND a blog write-up, and personality woven throughout (motto, goals, hobbies).

### 🟢 C) New Site — `arun-pandian.netlify.app` v2.0 (the build target)

```text
arun-pandian.netlify.app  (Next.js 14 + Tailwind, single page + anchors)
│
├── /  (Home — one page, 7 sections)
│   ├── 01 HERO
│   │   ├── "Hello, I'm Arun. I turn raw data into business decisions."
│   │   ├── Motto: "Query. Analyze. Story-tell."  (Divya-style)
│   │   ├── Role line: Data Analyst · SQL · Python · Power BI · GenAI
│   │   └── CTAs: [View Projects] [Download Resume] + social icon row
│   │
│   ├── 02 ABOUT  (#about)                        ← ProjectPro rule #1
│   │   ├── How I got into data (2–3 lines, story not resume)
│   │   ├── What intrigues me: job-market analytics, healthcare AI
│   │   ├── Short-term goal: first DA/SDE role
│   │   └── Long-term goal: AI-powered analytics products
│   │
│   ├── 03 SKILLS  (#skills)
│   │   ├── Data: SQL (PostgreSQL/MySQL) · Python (Pandas/NumPy) · Excel
│   │   ├── BI: Power BI (DAX) · Tableau
│   │   ├── Cloud: Snowflake · BigQuery · AWS
│   │   └── AI/Dev: PyTorch · scikit-learn · n8n · Next.js
│   │
│   ├── 04 EXPERIENCE TIMELINE  (#timeline)       ← Divya-style numbered
│   │   ├── 1. Intern — Carpediem Tech Innovations (impact line)
│   │   ├── 2. Intern — Rinex.AI (impact line)
│   │   └── 3. Research — EEG Seizure Detection, IEEE submission
│   │
│   ├── 05 FEATURED PROJECTS  (#projects)         ← ProjectPro: quality > quantity
│   │   │  Max 4 cards. Each = Problem → Data → Process → Insight → Links
│   │   ├── ⭐ SQL Job Market Analysis (90K+ postings)
│   │   │     [GitHub] [Case Study] [Dashboard]
│   │   ├── 🧠 EEG Seizure Detection — DA-GRL + SHAP/LIME
│   │   │     [GitHub] [Paper]
│   │   ├── 🤖 n8n AI Resume Optimizer
│   │   │     [GitHub] [Demo video]
│   │   └── 📈 Power BI Dashboard Suite
│   │         [GitHub] [Live dashboards]
│   │
│   ├── 06 BLOG / CASE STUDIES  (#blog)           ← ProjectPro rule #3
│   │   └── 3 write-ups (each doubles the value of a project):
│   │       ├── "What 90,000 job postings taught me about DA hiring"
│   │       ├── "Explaining a seizure-detection model with SHAP"
│   │       └── "Automating resume optimization with n8n + GPT"
│   │
│   └── 07 CONTACT  (#contact)
│       ├── Email: arunpandi47777@gmail.com
│       ├── LinkedIn: /in/arunpandian-sh2030
│       ├── GitHub: shadow-byte-warrior
│       └── Resume download (PDF, ATS-safe LaTeX version)
│
├── /projects/[slug]   → full case-study page per project (optional phase 2)
└── /blog/[slug]       → blog post pages (optional phase 2)
```

---

## 📌 Part 2 — Rules Compiled from the ProjectPro Guide

1. **Three design laws:** simplicity, easy navigation, visual appeal. Readable by technical AND non-technical audiences.
2. **About Me must answer:** how you started with data, what intrigues you, your interest areas — plus contact links.
3. **Projects must demonstrate, in combination:** scraping/collecting data, cleaning datasets, multiple analysis types (descriptive/diagnostic, time-series, regression), visualization (charts/graphs/geomaps), solid SQL, concise communication (write-up/blog), teamwork (one group project if possible), and a standout extra (Python/GenAI).
4. **Curate, don't dump:** only projects relevant to the target role — NOT everything you've ever built. (You have 13+; the site shows 4.)
5. **Skills to spotlight:** SQL first (it's the DA screening language), then statistics, Python/R, data visualization (Tableau/Power BI), and critical thinking shown via problem → action → finding → solution framing.
6. **Blog posts = communication proof.** Write about your approach and insights per project.
7. **Add credibility extras:** testimonials (internship mentors at Carpediem/Rinex.AI), events/webinars attended, any recognition.
8. **Hosting path:** GitHub / LinkedIn / Kaggle free at the start → standalone site as career grows (you're already at this stage — keep Netlify).

---

## 📌 Part 3 — Build & Deploy Instructions

### Step 1 — Scaffold
```bash
npx create-next-app@latest arun-portfolio --typescript --tailwind --app
cd arun-portfolio
npm install lucide-react framer-motion
```

### Step 2 — File structure
```text
arun-portfolio/
├── app/
│   ├── page.tsx            # single page: all 7 sections
│   ├── layout.tsx          # metadata (fix the OG image here!)
│   └── globals.css
├── components/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Timeline.tsx        # Divya-style numbered timeline
│   ├── ProjectCard.tsx     # Problem→Data→Process→Insight format
│   ├── Blog.tsx
│   └── Contact.tsx
├── data/
│   └── projects.ts         # all content as data — easy to update
└── public/
    ├── resume.pdf          # ATS-safe LaTeX export
    ├── og-image.png        # custom 1200×630 (replaces Lovable default)
    └── projects/           # dashboard screenshots
```

### Step 3 — Metadata fix (the #1 old-site issue)
```tsx
// app/layout.tsx
export const metadata = {
  title: "Arun Pandian | Data Analyst — SQL · Python · Power BI",
  description:
    "Data Analyst portfolio: 90K+ job postings analyzed with SQL, EEG seizure detection research, Power BI dashboards & AI automation.",
  openGraph: {
    images: ["/og-image.png"],   // ← custom image, not lovable.dev default
  },
};
```

### Step 4 — Deploy to Netlify (keep the same URL)
```bash
git init && git add . && git commit -m "portfolio v2"
git remote add origin https://github.com/shadow-byte-warrior/portfolio-v2.git
git push -u origin main
```
Then in Netlify: **Site settings → Build & deploy → link the new repo** to `arun-pandian.netlify.app`. Build command `npm run build`, publish directory `.next` (enable the Next.js runtime plugin — Netlify auto-detects it).

### Step 5 — Post-launch checklist
- [ ] Custom OG image renders on LinkedIn share preview
- [ ] Resume PDF downloads correctly
- [ ] All 4 project cards link to live GitHub repos
- [ ] Lighthouse score 90+ (performance & accessibility)
- [ ] Add site link to GitHub profile README + LinkedIn Featured section
- [ ] Write blog post #1 (SQL job market) within a week of launch

---

## 🎨 Design Direction

| Element | Choice |
|---|---|
| Theme | Dark (`#0d1117` bg) with `#70a5fd` accent — matches your GitHub README dashboard |
| Layout | Single page + anchor nav (Divya-style), sticky top navbar on mobile |
| Typography | Inter (body) + Fira Code (headings/accents for terminal feel) |
| Motion | Subtle Framer Motion fade-ins only — recruiters skim, don't make them wait |
| Voice | First person, story-first, numbers everywhere ("90,000+ postings", "0.9 F1") |

---

*v2.0 target: ship in one weekend. Content > polish — recruiters spend 30 seconds; make the hero line and 4 project cards do the work.*
