# Google Search Console Indexing Monitoring — 2 Week Checklist

**Site:** https://evara3d.ae
**Sitemap:** https://evara3d.ae/sitemap.xml — submitted 2026-07-22 (9 URLs, 0 indexed at submission)
**GSC property:** https://search.google.com/search-console?resource_id=https://evara3d.ae/

Typical timeline: Google discovers URLs within 1–3 days, indexes them within 4–14 days. Some pages may take longer if content is thin or duplicate.

---

## Pages to track

Priority pages (check each one in GSC → **URL Inspection**):

- [ ] `/` — Home
- [ ] `/shop` — Shop landing
- [ ] `/shop/keepsaker` — Product
- [ ] `/shop/achiever` — Product
- [ ] `/shop/legacy` — Product
- [ ] `/shop/3d-map-display` — Product
- [ ] `/gallery`
- [ ] `/about`
- [ ] `/faq`

---

## Day 1 — 2026-07-22 (today, done)

- [x] Site verified in GSC (META tag)
- [x] Property `https://evara3d.ae/` added
- [x] Sitemap submitted (9 URLs)
- [ ] For each priority page: open **URL Inspection** → click **Request Indexing** (speeds up first crawl)

## Day 2–3 — by 2026-07-25

- [ ] **Sitemaps** report: status = *Success*, `Discovered URLs` = 9
- [ ] **Pages** report: at least a few URLs moved from *Not indexed* → *Crawled – currently not indexed* or *Indexed*
- [ ] No new entries in **Pages → Why pages aren't indexed** for priority URLs

## Day 5–7 — by 2026-07-29

- [ ] At least 3–5 priority pages showing **Indexed** in URL Inspection
- [ ] **Performance** report starts showing impressions (even single digits) for brand terms (`evara3d`, `evara 3d`)
- [ ] `site:evara3d.ae` in Google returns results
- [ ] Check **Coverage → Excluded** — investigate anything under *Duplicate*, *Soft 404*, or *Blocked by robots.txt*

## Day 10–14 — by 2026-08-05

- [ ] All 9 sitemap URLs indexed (or with a documented reason if not)
- [ ] **Performance** report shows impressions for non-brand terms (e.g. `strava frame`, `3d map`, `run keepsake`)
- [ ] At least 1 page has a real click-through
- [ ] **Enhancements**: no errors under *Product snippets*, *Sitelinks searchbox*, or structured data

---

## Weekly recurring checks (Mon)

- [ ] **Sitemaps**: still `Success`, no drop in Discovered URLs
- [ ] **Pages**: total *Indexed* count trending up
- [ ] **Performance**: impressions/clicks week over week
- [ ] **Experience → Core Web Vitals**: LCP/CLS/INP still *Good* on mobile & desktop
- [ ] **Manual Actions** and **Security Issues**: both empty

---

## If a page still isn't indexed after 14 days

1. **URL Inspection** → read the exact reason (e.g. *Crawled - currently not indexed*, *Discovered - not indexed*, *Duplicate without user-selected canonical*).
2. Confirm the page returns HTTP 200 and the meta title/description/canonical are unique.
3. Check the page has real, non-boilerplate content (>150 words of unique copy helps).
4. Make sure it is linked from at least one other indexed page (internal links matter).
5. Re-run **Request Indexing**. Google rate-limits this; once per URL per week is enough.
6. If *Blocked by robots.txt* or *Noindex tag*: fix and re-request.

---

## Quick GSC links

- Overview: https://search.google.com/search-console?resource_id=https://evara3d.ae/
- Pages report: …/index
- Sitemaps: …/sitemaps
- Performance: …/performance/search-analytics
- URL Inspection: top search bar in GSC
