# Prompt: Fully Editable Landing Page with Admin Panel

Copy everything in the "PROMPT TO PASTE" section below into your AI builder (Cursor, v0, Lovable, Claude Code, Bolt, etc.). The sections above it explain the analysis and the full list of editable elements so you understand what you're asking for.

---

## 1. Analysis — What This Actually Requires

You are asking for a **content-managed landing page**: a public marketing page where the owner can log into a hidden admin panel and change every piece of content (text, images, videos, blogs, links, colors) without touching code. This breaks into four parts:

1. **Public site** — the landing page visitors see. Hero, sections, blog list, videos, footer.
2. **Content store** — a database (or JSON/CMS) that holds every editable value. The public site reads from it.
3. **Admin panel** — a password-protected dashboard where the owner edits those values. Saving writes back to the content store.
4. **Auth + entry point** — a login for the admin, reached via a small **admin button at the bottom** of the page.

Key design decisions the prompt below makes for you:

- **Everything is data-driven.** No text is hardcoded. Every string, image URL, and video URL comes from the content store, so the admin can change it.
- **Sections are a list, not fixed.** Sections are stored as an ordered array so the admin can reorder, show/hide, and add/remove them.
- **Blogs and videos are collections.** Each is a repeatable item with its own fields (add, edit, delete).
- **Live preview + draft/publish.** Edits should be previewable before going live.
- **Recommended stack:** Next.js (App Router) + a database (Supabase/PostgreSQL or SQLite) + an auth layer + an image/video upload store. Swap for your preferred stack if needed.

---

## 2. Full List of Editable Elements (Give This to the Builder as the Spec)

### Global / Site-wide
- Site name / logo (image + alt text)
- Favicon
- Primary, secondary, accent colors (theme)
- Font family / heading font
- SEO: page title, meta description, social share image (OG image)
- Announcement bar text + link (show/hide toggle)

### Navigation bar
- Each nav link: label + URL (add / edit / delete / reorder)
- CTA button in nav: label + URL
- Logo (links to home)

### Hero section
- Eyebrow / badge text
- Main headline (heading)
- Subheadline / description paragraph
- Primary button: label + URL
- Secondary button: label + URL
- Background image OR background video (URL/upload) + toggle which one
- Hero image / illustration
- Alignment (left / center) toggle

### Repeatable content sections (ordered, add/remove/reorder/hide each)
- **Section type** (features grid, text + image, testimonials, stats, pricing, FAQ, CTA banner, logos, gallery)
- Section heading + subheading
- For each item inside (feature card, testimonial, stat, price tier, FAQ Q&A): all text, icon, image, link fields editable
- Section background color / toggle

### Dynamic Blog section
- Section heading + subheading
- Blog posts collection — each post has: title, slug, cover image, author name + avatar, publish date, category/tags, excerpt, full body (rich text), status (draft/published), featured toggle
- Add / edit / delete / reorder posts
- Individual blog detail page auto-generated from each post
- "Load more" / pagination

### Dynamic Video section
- Section heading + subheading
- Videos collection — each video has: title, description, video URL (YouTube / Vimeo / uploaded MP4), thumbnail image, category, order
- Add / edit / delete / reorder videos
- Layout toggle (grid / carousel)

### Testimonials / Social proof
- Each testimonial: quote, name, role/company, avatar, star rating

### Contact / CTA section
- Heading, description, button label + URL
- Contact form fields config (labels), destination email
- Social links (icon + URL, add/remove)

### Footer
- Footer logo + tagline
- Footer link columns: column title + links (add/edit/delete)
- Copyright text
- Social icons + URLs
- Newsletter box: heading + placeholder + button label

### Admin entry
- **Admin button fixed at the bottom of the page** (small, subtle) that opens the login / admin panel

---

## 3. PROMPT TO PASTE

````
Build a fully content-managed marketing landing page with a hidden admin panel. EVERY piece of content on the public page must be editable from the admin panel — no hardcoded text, images, videos, or links anywhere. The public page reads all content from a database; the admin writes to it.

TECH STACK
- Next.js (App Router) + TypeScript + Tailwind CSS.
- Database: Supabase (PostgreSQL) — or SQLite/Prisma if simpler. Store all editable content here.
- Auth: email + password login for a single admin (NextAuth or Supabase Auth). Protect all /admin routes.
- Media: image and video uploads to Supabase Storage (or Cloudinary). Also allow pasting external URLs (YouTube/Vimeo).
- Rich text editor for blog bodies (e.g., Tiptap).

ARCHITECTURE REQUIREMENTS
1. Content is 100% data-driven. Define a content schema in the DB. The public page renders entirely from that data. Changing a value in admin instantly changes the live page.
2. Sections are an ordered array of blocks. The admin can add, remove, reorder (drag-and-drop), and show/hide any section.
3. Blogs and Videos are collections (CRUD): add, edit, delete, reorder each item.
4. Support draft vs published state and a "Preview" mode before publishing.
5. Seed the database with sensible default content so the page looks complete on first load.

PUBLIC PAGE — build these sections, all editable:
- Announcement bar (text + link, toggle on/off)
- Navbar: logo, nav links (label+url, add/remove/reorder), CTA button
- Hero: eyebrow badge, headline, subheadline, primary & secondary buttons (label+url), background image OR background video (toggle), hero image, alignment toggle
- Flexible content sections (features grid, text+image, stats, testimonials, pricing, FAQ, CTA banner, logo cloud, gallery) — each with editable heading, subheading, and repeatable items (all text/icon/image/link fields editable)
- Dynamic Blogs section: shows published posts (title, cover image, author+avatar, date, category, excerpt). Clicking a post opens an auto-generated detail page rendering its rich-text body. Include pagination/"load more".
- Dynamic Videos section: grid or carousel of videos (title, description, thumbnail, video URL — supports YouTube, Vimeo, or uploaded MP4). Clicking plays the video.
- Testimonials (quote, name, role, avatar, rating)
- Contact/CTA section with a working contact form (config labels, destination email) and social links
- Footer: logo, tagline, link columns (add/edit/delete), social icons+urls, newsletter box, copyright text
- A small, subtle ADMIN BUTTON fixed at the BOTTOM of the page. Clicking it goes to the admin login (or admin dashboard if already logged in).

ADMIN PANEL (/admin, auth-protected):
- Login page. Redirect unauthenticated users away from all /admin routes.
- Dashboard sidebar with sections: Global Settings, Navbar, Hero, Sections, Blogs, Videos, Testimonials, Footer, SEO.
- Global Settings: site name, logo, favicon, theme colors (primary/secondary/accent color pickers), fonts, announcement bar.
- Every field from the public page must have a corresponding edit control here (text inputs, textareas, rich text, image upload with preview, video URL/upload, toggles, color pickers).
- Sections manager: drag-and-drop reorder, show/hide toggle, add section (choose type), delete section, edit each section's items.
- Blogs manager: table of posts with Add/Edit/Delete. Editor has title, slug (auto from title, editable), cover image, author name+avatar, date, category/tags, excerpt, rich-text body, draft/published toggle, featured toggle.
- Videos manager: Add/Edit/Delete, reorder. Fields: title, description, video URL or upload, thumbnail, category.
- SEO manager: page title, meta description, OG share image per page.
- Save buttons persist to the DB. Show success/error toasts. Include a "Preview" and a "Publish" action.

QUALITY
- Responsive (mobile-first), accessible (semantic HTML, alt text, keyboard nav), fast.
- Clean, modern design with the theme colors applied from Global Settings.
- Validate inputs; handle empty states (e.g., "No blogs yet").
- Include a README explaining setup, env vars, running locally, and how to log into the admin (with default admin credentials to change).

DELIVERABLES
- Full working codebase, DB schema/migrations, seed script, and the README.
Start by defining the DB schema and the content model, then build the public page reading from it, then the admin CRUD, then auth, then polish.
````

---

## 4. Tips for Best Results

- **Feed it in stages** if the tool struggles with one giant prompt: (1) schema + public page, (2) admin CRUD, (3) auth + admin button, (4) blogs/videos collections, (5) polish.
- **Name your stack** in the prompt if you already have one (WordPress, Webflow CMS, Strapi, Sanity, Payload CMS are all strong "everything editable" options if you don't want to build auth/DB yourself).
- **For no-code:** if you don't want to maintain code, a headless CMS (Sanity, Payload, Strapi) or Webflow gives you the admin panel out of the box — paste the "Full List of Editable Elements" as your content model spec instead.
- **Security:** always change default admin credentials, and put the admin button/login behind real authentication, not just a hidden URL.
