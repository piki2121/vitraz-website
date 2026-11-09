# Vitraz Studio — vitraz.eu

Static site for a stained glass / glass art studio: gallery, services, about the artist,
workshops, and contact. Plain HTML/CSS/JS — no build step, no dependencies.

## Structure

```
index.html       Home
gallery.html      Stained glass / sculptures / glass fusion gallery (filterable)
services.html     Services offered
about.html        About the artist
workshops.html    Workshops and schedule
contact.html      Contact form + studio info
css/styles.css    All styles
js/main.js        Nav toggle, gallery filter, lightbox
favicon.svg       Site icon
```

## Editing content

Every page has `[Replace with ...]` placeholders and gradient `placeholder-media` tiles
standing in for real photos. To swap a placeholder tile for a real photo, replace the
`<div class="placeholder-media">...</div>` block with:

```html
<img src="images/your-photo.jpg" alt="Description of the piece" />
```

Put your photo files in the `images/` folder and reference them with a relative path
like `images/your-photo.jpg`.

## Local preview

Because `contact.html`'s form and a couple of relative paths behave best over HTTP
(not `file://`), preview with a simple local server, for example:

```bash
npx serve .
```

or, if you have Python installed:

```bash
python3 -m http.server 8000
```

Then open the printed localhost URL in your browser.

## Contact form

The contact form has no backend (static sites can't process form submissions on their
own). The easiest free option is [Formspree](https://formspree.io):

1. Create a free Formspree account and a new form.
2. Copy the form's endpoint URL.
3. In `contact.html`, replace `action="#"` with that endpoint URL.

## Deployment

This site is deployed via GitHub + Vercel:

1. Push this repo to GitHub.
2. Import the repo into Vercel (vercel.com → Add New Project).
3. Vercel will detect it as a static site — no build command needed.
4. Add `vitraz.eu` as a custom domain in the Vercel project's Domains settings, and
   update your domain registrar's DNS records as Vercel instructs.

`vercel.json` enables clean URLs (`/gallery` instead of `/gallery.html`) — Vercel
redirects the `.html` version automatically, so this needs no extra setup.

## SEO / getting found by Google and AI assistants

What's already built into the code:

- Per-page `<title>`/description, canonical URLs, Open Graph + Twitter tags.
- `LocalBusiness` structured data (JSON-LD) on every page — name, Croatia address,
  `areaServed: Europe`, Instagram link. This is what tells Google (and anything that
  reads Google's index, including AI answer engines) *where* the business is and
  *where* it serves.
- A visible FAQ on the homepage with matching `FAQPage` structured data, answering
  "where is it based" / "does it ship across Europe" directly — phrased the way
  people actually ask questions.
- `Service` structured data on the services page, one entry per service offered.
- `sitemap.xml` and `robots.txt` at the site root.

**Important — none of this works until real content replaces the `[Replace with ...]`
placeholders.** Search engines (and AI tools that cite search results) reward pages
with real, specific, substantial text and real photos — generic placeholder copy
won't rank or get cited. Prioritize filling in: the artist's real name/bio, actual
service details, and — most of all — real photos of real pieces with descriptive
`alt` text (e.g. `alt="Custom stained glass window with floral motif, Zagreb installation"`).

Steps to take once the site is live, roughly in order of impact:

1. **Submit to Google Search Console** (search.google.com/search-console) — verify
   `vitraz.eu`, submit `sitemap.xml`. This is what gets the site actually indexed.
2. **Create a Google Business Profile** (business.google.com) for Vitraz Studio in
   Croatia. This is the single biggest lever for local/regional search and is what
   feeds Google's Knowledge Graph — the structured "fact" source many AI tools draw
   from when asked "where can I order X."
3. **Submit to Bing Webmaster Tools** (also powers some AI assistants' search/grounding).
4. Get listed in a few **craft/art directories or EU stained-glass community sites**,
   and link to vitraz.eu from the Instagram bio — inbound links and mentions are what
   make a site look authoritative, not just the on-page code.
5. Keep the site updated (new gallery pieces, workshop dates) — freshness and real
   content depth matter more over time than any one-time technical setup.

**Honest caveat:** there's no way to guarantee that ChatGPT, Gemini, or Claude will
specifically recommend vitraz.eu — these tools generally surface whatever is best
indexed and most authoritative in Google/Bing (or, for some, their own training data,
which no one can directly edit). The steps above are exactly what makes a small
business site show up well in *both* regular search and AI-assisted search — there's
no separate trick beyond doing real SEO well.
