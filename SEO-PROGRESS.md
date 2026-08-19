# C&C Inc SEO — Progress Tracker

**Last updated:** 19 August 2026
Companion to `SEO-ACTION-PLAN.md`. Every item below maps to a finding ID in that document.

---

## DONE — shipped to the repo, not yet committed to git

> All changes are in your working tree only. `.cursorrules` says never commit, so I didn't. Review with `git diff`, then commit and push when you're happy. **Nothing is live until you push.**

### P0 — correctness bugs (all 7 fixed)

| ID | Fix | Detail |
|---|---|---|
| P0-1 | Homepage coordinates corrected | `44.0967746, -84.6042138` → **`44.454214, -84.780239`** |
| P0-2 | Same fix propagated | `llms.txt` coordinates + 5 stale Google Maps profile URLs carrying the bad pair |
| P0-3 | Map embeds replaced | All 11 fabricated `pb=` embed strings (the fake `!4v1617292345678` ones) swapped for reliable address/city queries |
| P0-4 | Geo made consistent | All 7 pages now carry one identical, correct `GeoCoordinates`; the 3 pages that had none now have it |
| P0-5 | `aggregateRating` removed | The self-serving `4.9 / 13 reviews` block is gone from `index.html`. Review text on the page is untouched |
| P0-6 | Entities consolidated | One canonical business at `@id: https://candcinc.net/#business`. The 5 duplicate `TowingService` entities are now `Service` records pointing at it via `provider` |
| P0-7 | `sitemap.xml` regenerated | Honest `lastmod` (2026-08-19), `llms.txt` entry removed, 7 real pages, `push-up-challenge` re-weighted to 0.7 |

**Important:** the coordinates came from the **US Census Bureau geocoder** for `8320 N HARRISON RD, ROSCOMMON, MI, 48653`. They put you west of the village, which matches your own pages' "12 miles from Houghton Lake" and "8 miles from Higgins Lake" claims far better than the old values did. Worth eyeballing the pin against your Google Business Profile before you push — see *Needs you* below.

### P1 — CTR work (5 of 6 fixed)

| ID | Fix |
|---|---|
| P1-1 | All 7 titles rewritten. Every one now under 60 characters, all differentiated, all carrying "wrecker" or a proximity hook |
| P1-2 | All 7 meta descriptions rewritten to lead with response and phone rather than a service list |
| P1-4 | `og:image`, dimensions, alt, `og:site_name` and full Twitter Card added to the 6 pages that had none |
| P1-5 | `max-image-preview:large, max-snippet:-1, max-video-preview:-1` added sitewide |
| P1-6 | Obsolete `<meta name="keywords">` removed from all 7 pages |

### P2 / P4 — partial

| ID | Fix |
|---|---|
| P2-1 | "Wrecker" language added: schema `alternateName` on every page, a new visible FAQ on the homepage, and the word now appears in 6 of 7 titles/descriptions. Targets the 348 zero-click impressions |
| P4-6 | `404.html` created — branded, matches site fonts and colour, big call button, links to all 7 pages, `noindex, follow` |
| P4-7 | `Crawl-delay: 1` removed from `robots.txt` (was throttling Bing for no benefit) |
| P4-8 | `.gitignore` created covering `.DS_Store` and `assets/videos/source/` |

**Verified before writing:** every JSON-LD block re-parsed as valid JSON; element counts compared against the originals (no images, links, iframes, videos or headings lost anywhere); title lengths asserted; and the two maps per location page confirmed still pointing at the right places — the *service-area* map still shows the city, the *contact* map shows the shop.

---

## NEEDS YOU — I can't do these from here

| # | Task | Why |
|---|---|---|
| 1 | **Confirm the map pin against your Google Business Profile.** Open your GBP, check the pin sits on the shop, and if it doesn't, drag it and tell me the real coordinates. | Census geocoding is address-interpolated; your GBP pin is ground truth and it's what Google actually ranks on |
| 2 | **Delete the dead media.** The bridge to your Mac can't delete files. Run this in the repo:<br>`git rm -r --cached assets/videos/source`<br>`rm -rf assets/videos/source assets/videos/10.mp4 assets/videos/11.mp4`<br>`rm -f assets/stylesheets/styles.css`<br>`find . -name .DS_Store -delete && git rm --cached .DS_Store assets/.DS_Store assets/imgs/.DS_Store` | ~45 MB of unreferenced video + a 79 KB stylesheet nothing links to. All verified unused |
| 3 | **Run PageSpeed Insights** on `/` and one location page, mobile. | I couldn't reach the PSI API from this environment |
| 4 | **Resubmit the sitemap** in Search Console after pushing, and request indexing on the homepage. | Needs your GSC login |
| 5 | **Start the review engine.** 13 → 30+. Text a Google review link after every completed job. | The single highest-leverage item on the whole plan, and it's entirely offline |

---

## REMAINING — ranked by value

### Next up (I can do these — just say go)

1. **P4-1 · Image optimisation.** `hero.png` is **2.6 MB** and it's your LCP element on mobile, which is 61% of your impressions. Plus `truck.png` 1.7 MB (your `og:image`) and `cards.png` 1.5 MB. I'd convert to WebP with PNG fallback, target <150 KB, add `srcset`, and rewrite the references. Biggest remaining technical win.
2. **P4-4 · Intrinsic dimensions.** Only 3 of 80 homepage images declare width/height. Mechanical CLS fix, scriptable in one pass.
3. **P1-3 · Homepage vs Roscommon cannibalisation.** I've part-solved this by pointing the homepage title at brand + county and the Roscommon page at the city, but it needs the H1 and body copy aligned to match. **Needs a decision from you first:** keep both pages, or fold Roscommon into the homepage and 301 it?
4. **P2-4 · Rewrite the 4 thin location pages.** 745–889 words of near-identical boilerplate is doorway-page shaped. Each needs 300+ words that can't appear anywhere else — named roads, exits, seasonal hazards, actual jobs. I'd need you to tell me a few real local details; I won't invent them.
5. **P2-1 (remainder) · Wrecker copy in page bodies.** Currently in schema, titles and descriptions and one homepage FAQ. Should also appear naturally in location page body text.

### Content build (needs your input on scope)

6. **P2-2 · Service pages.** Priority order from the data: off-road recovery & winch-outs (`off road recovery near me` is converting at **20% CTR from position 3.2**), junk car removal / salvage, wrecker service, boat & trailer, RV & camper, lockout & jump-start. **Tell me which of these you actually run** — I won't build a page for work you can't take.
7. **P2-3 · New location pages.** St. Helen, Houghton Lake Heights, Frederic/Waters, plus I-75 and M-55 corridor pages.
8. **P2-5 · Informational articles.** Breakdown-on-I-75-in-winter, what a junk car is worth right now, what a tow costs in Northern Michigan.
9. **P2-6 · Pitch the Push-Up Challenge to local press.** Genuinely newsworthy and currently earning 71 impressions in six months.

### Off-site (yours, mostly)

10. **P3-1 · Reviews** — see *Needs you*.
11. **P3-2 · Citations.** Bing Places, Apple Business Connect, BBB, Nextdoor, the Roscommon / Houghton Lake / Grayling chambers. Then motor-club dispatch rotations — Agero, Quest, Allied — which pay directly, not just in rankings.
12. **P3-4 · Local links.** Camp Grayling, the two state parks, marinas, campgrounds, Tip-Up Town.
13. **P3-5 · Google Business Profile.** Posts, full service list, junk-car pricing products, seeded Q&A, photo cadence.

### Infrastructure

14. **P4-5 · Cloudflare in front of the domain.** Free tier gets you real cache headers, Brotli and image resizing — none of which GitHub Pages can do. Makes your `_headers` file actually work.
15. **P4-9 · IndexNow path filter.** Change `"*.html"` to `"**/*.html"` in the workflow before you ever move pages into subfolders.

---

## Scoreboard

| | Done | Remaining |
|---|---|---|
| **P0** — bugs | **7 of 7** | 0 |
| **P1** — CTR | **5 of 6** | 1 (needs your decision) |
| **P2** — content | 1 of 6 | 5 |
| **P3** — off-site | 0 of 5 | 5 (mostly yours) |
| **P4** — technical | 3 of 10 | 7 |
| **Total** | **16 of 34** | 18 |

Everything in P0 and P1 was the cheap half — snippet and correctness work on traffic you already earn. That's where the 1.93% → 3.5% CTR target comes from, and you should see movement in Search Console within 2–3 weeks of pushing. The remaining items are what raise the ceiling rather than collect what's already on the table.
