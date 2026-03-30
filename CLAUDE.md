# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
hugo server --buildDrafts      # local dev with draft artworks visible
hugo server                    # local dev, published works only
hugo --minify                  # production build (Netlify runs this)
```

## Architecture

No external theme — all layouts are in `layouts/` directly.

**Asset pipeline** (`assets/`): Hugo extended processes `css/main.css` (fingerprinted) and `js/main.js` (fingerprinted). No Sass/SCSS — plain CSS with custom properties.

**Content model** — all artworks use **leaf bundles**: one folder per artwork containing `index.md` and the artwork image named identically to the slug (e.g. `content/prints/billie-holiday/billie-holiday.jpg`). The image is a page resource; Hugo processes it to WebP at build time.

**Sections**: `prints/`, `paintings/`, `portraits/`, `about/`, `enquire/`.

**Key front matter fields**:
- All artworks: `title`, `year`, `medium`, `dimensions`, `status` (`available`|`sold`|`not_for_sale`), `price` (GBP int, omit for price on application), `featured` (bool, shows on homepage)
- Prints only: `edition_size`, `prints_remaining`
- Draft artworks (camera-roll images with no titles): `draft: true` — these appear at `hugo server --buildDrafts` but not in production

**Quickview modal** uses the native `<dialog>` element. Card data is passed via `data-*` attributes on `.artwork-card`; `main.js` reads these to populate the dialog.

**Enquiry form** uses Formspree. Set the endpoint in `hugo.toml` → `params.formspreeEndpoint`. Artwork name is passed via `?artwork=slug` URL parameter and pre-populated by inline script in `layouts/enquire/single.html`.

**Homepage** shows 5 featured works per section. Mark artworks `featured: true` to control which appear. Falls back to the first 5 if none are marked.

**Pagination**: 10 per page, configured in `hugo.toml` → `[pagination] pagerSize`.

## Deployment

Netlify, deployed from GitHub. Config in `netlify.toml`. Hugo version pinned to match local install.

## Content data gaps to fill

Every `index.md` stub needs: `year`, `dimensions`, `price` (or leave blank for POA). Prints also need `edition_size` and `prints_remaining`. Works in `paintings/img-*` and `paintings/l1000*` are `draft: true` and need manual identification before publishing.

The 5 Japanese Cherry print slugs (`japanese-cherry`, `japanese-cherry-2`, `japanese-cherry1/2/3`) need manual review — the first two came from files with trailing hyphens in the Squarespace export and may need renaming.
