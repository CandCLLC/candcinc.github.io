# C&C Inc (candcinc.net) — SEO Audit & Action Plan

**Prepared:** 19 August 2026
**Scope:** `candcinc.github.io` repo (7 pages, robots.txt, sitemap.xml, llms.txt, `_headers`, IndexNow workflow) + Google Search Console export for 18 Mar – 17 Aug 2026.

---

## 1. Where you stand today

| Metric (6 months) | Value | Read |
|---|---|---|
| Clicks | 94 | ~0.61/day |
| Impressions | 4,869 | you are being *seen* |
| CTR | 1.93% | you are not being *clicked* |
| Avg. position | 10.5 | bottom of page 1 / top of page 2 |
| Mobile | 2,960 impr · 2.53% CTR · pos 8.2 | the whole business |
| Desktop | 1,850 impr · 1.03% CTR · pos 14.3 | mostly noise |
| US share of impressions | 4,665 of 4,869 (96%) | targeting is clean |

**Per-page performance — this is the story:**

| Page | Impr | Clicks | CTR | Pos | Verdict |
|---|---:|---:|---:|---:|---|
| `/` | 3,088 | 60 | 1.94% | 11.3 | carrying everything |
| `grayling-towing.html` | 800 | 17 | **2.12%** | 8.6 | best sub-page |
| `roscommon-towing.html` | 1,051 | 7 | **0.67%** | 9.3 | badly underperforming |
| `houghton-lake-towing.html` | 831 | 6 | **0.72%** | 9.9 | badly underperforming |
| `higgins-lake-towing.html` | 323 | 3 | **0.93%** | **7.0** | worst — ranks well, nobody clicks |
| `prudenville-towing.html` | 105 | 4 | 3.81% | 6.2 | fine, just tiny |
| `push-up-challenge.html` | 71 | 1 | 1.41% | 6.2 | underused asset |

A page sitting at **position 7 with 0.93% CTR** is the clearest signal in the whole dataset. Typical CTR at position 7 is roughly 3–4%. Higgins Lake is earning about a quarter of the traffic its ranking already entitles it to. Same story at Roscommon and Houghton Lake. **You do not have a ranking problem first — you have a snippet problem first.** Grayling, the only page with genuinely distinct copy, is also the only page clicking at a normal rate. That is not a coincidence.

> **Caveat on the query data:** the Queries export accounts for only 28 of 94 clicks and 1,897 of 4,869 impressions. Google anonymises rare queries, so ~70% of your clicks come from terms you cannot see. Everything below treats the query list as directional, not complete.

---

## 2. P0 — Bugs actively working against you

These are wrong, not merely suboptimal. Fix first; they are all cheap.

**P0-1 · The homepage tells Google you are 28 miles from where you are.**
`index.html` line 97 declares `"latitude": 44.0967746, "longitude": -84.6042138`. Roscommon, MI is at **44.4983, -84.5919** ([Wikipedia](https://en.wikipedia.org/wiki/Roscommon,_Michigan)). That is ~0.40° of latitude — about **28 miles / 45 km south** of your actual address, landing in the middle of nowhere near the Gladwin County line. Your most authoritative page is geo-tagged to the wrong place. Fix to `44.4983, -84.5919`.

**P0-2 · The same wrong coordinates are in three more places.**
- `llms.txt` line 165: `Coordinates: 44.0967746, -84.6042138`
- `llms.txt` lines 25 & 86 and `index.html` lines 118 & 1631: the Google Maps profile URL is built on `@44.0967746,-84.6042138`
- The `<iframe>` map embed on **all seven pages** uses `!2d-84.6042138!3d44.0967746`

**P0-3 · The map embed is a hand-edited placeholder.**
Every page carries the identical embed string ending `!4v1617292345678` — a 2021 placeholder timestamp — with coordinates that do not match the `place_id` or the address in the same URL. Regenerate a fresh embed from Google Maps → Share → Embed, from your real Business Profile, and use that one string everywhere.

**P0-4 · Geo data is inconsistent page to page.**
`roscommon`, `houghton-lake` and `higgins-lake` correctly carry `44.4983 / -84.5922`. `index` carries the wrong pair. `grayling`, `prudenville` and `push-up-challenge` carry **no `geo` at all**. Pick one correct pair; put it everywhere.

**P0-5 · Self-serving `AggregateRating` on the homepage.**
`index.html` declares `4.9 / 13 reviews` in JSON-LD. Google does not grant review rich results for reviews a business collects about itself and marks up on its own site; the markup is ineligible at best and a structured-data manual-action risk at worst. Remove the `aggregateRating` block. Your 4.9 already shows in the map pack, which is where it counts. Keep the review *text* on the page as human-facing social proof.

**P0-6 · Five duplicate business entities.**
Each location page declares its own standalone `TowingService` with the same name-ish, same address, same phone. To a crawler that reads as five businesses at one address. Restructure to one canonical entity with a stable `@id` (`https://candcinc.net/#business`) on the homepage, and have each location page emit a `WebPage` + `Service` that references it via `"provider": {"@id": "https://candcinc.net/#business"}`.

**P0-7 · Sitemap is stale and contains a non-page.**
`lastmod` on every URL says `2026-04-24`; the HTML files were last edited `2026-08-13`. Stale `lastmod` values train Google to distrust the whole file. Also, `llms.txt` is listed as a sitemap URL — it is not an indexable HTML page and should be removed. Generate `lastmod` from git commit dates in the IndexNow workflow so it can never drift again.

---

## 3. P1 — The CTR fix (highest ROI work on this list)

You already have 4,869 impressions. Moving CTR from 1.93% to a normal-for-position 3.5% is **+78 clicks per six months with zero new rankings.** That is a doubling, from snippet copy alone.

**P1-1 · Rewrite all seven titles. They are currently template clones.**
Every location page reads `Towing Service in {City}, MI | 24/7 Emergency Towing | C&C Inc` — 60–68 characters, truncated on mobile, three of the five words identical across pages, zero differentiation in a SERP where every competitor says the same thing.

Rewrite front-loading what your reviews say and your competitors cannot claim — proximity in minutes, family-owned since 2007, a real person answers. Direction, to be tuned per page:

| Page | Proposed title (≤ 58 chars) |
|---|---|
| `/` | `C&C Towing Roscommon MI — 24/7 Tow Truck & Recovery` |
| `roscommon-towing.html` | `Tow Truck in Roscommon, MI — Local, 24/7, Family-Run` |
| `grayling-towing.html` | `Grayling MI Towing — I-75 & Au Sable, 18 Min Away` |
| `houghton-lake-towing.html` | `Houghton Lake Towing — 12 Miles Away, Open 24/7` |
| `higgins-lake-towing.html` | `Higgins Lake Tow Truck — 8 Miles, State Parks, 24/7` |
| `prudenville-towing.html` | `Prudenville Towing — Closest Truck on M-55, 24/7` |
| `push-up-challenge.html` | `20 Push-Ups = $20 Off Your Tow — C&C Roscommon MI` |

**P1-2 · Rewrite the meta descriptions to answer the panicked question.**
Someone searching "tow truck near me" at 11pm wants three facts: *how fast, how much, will a human answer.* Current descriptions list services. Lead with response time and the phone number, and mention payment (Cash App / Zelle is a genuine differentiator worth stating).

**P1-3 · Resolve the homepage ↔ Roscommon page cannibalisation.**
`index.html` targets Roscommon in its title, description, H1, keywords and schema. So does `roscommon-towing.html`. They have 3,088 and 1,051 impressions respectively — Google is splitting signals between two pages competing for one query set, and the Roscommon page's 0.67% CTR is partly Google showing the wrong one. Two clean options:

- **(a) Recommended:** homepage becomes the *brand + service hub* — target "C&C Towing", "towing Northern Michigan", "Roscommon County towing" — and `roscommon-towing.html` owns "towing Roscommon MI" outright. Rewrite the homepage H1 and title accordingly.
- **(b) Simpler:** fold the Roscommon page's unique content into the homepage and 301 `roscommon-towing.html` → `/`. Loses a URL, consolidates all signal.

**P1-4 · Location pages have no social/preview metadata.**
Only `index.html` has `og:image` and `twitter:card`. The five location pages and the push-up page have `og:title`/`og:description` but no image at all — every Facebook or text-message share of those URLs renders as a bare grey box. Add per-page `og:image` (ideally a city-specific photo), `og:image:alt`, dimensions, and `twitter:card`.

**P1-5 · Add `<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1">` sitewide.**
Free opt-in to large image thumbnails in mobile results. For a visual, trust-driven local service this measurably lifts CTR and you are currently not opted in.

**P1-6 · Every page has a `<meta name="keywords">` tag.**
Ignored by every major engine since ~2009. Harmless but it is 200+ characters of noise per page and it signals "template SEO" to anyone auditing you. Delete.

---

## 4. P2 — Content gaps the data is handing you

**P2-1 · "Wrecker" — 348 impressions, 0 clicks, and the word appears zero times on your site.**
Six query variants, led by **`c and c wrecker service` at 222 impressions, position 11.2, zero clicks** — your single largest zero-click query by a wide margin. People are searching for you by a name you never use. Add "wrecker service" as a schema `alternateName`, an H2, an FAQ answer, and natural body copy. This is the cheapest win in the document.

**P2-2 · Service pages that should exist and do not.**
Every service is currently a bullet on a page instead of a page. The data shows demand:

| Service page to build | Evidence in your GSC data |
|---|---|
| Off-road recovery & winch-outs | `off road recovery near me` — **20% CTR at position 3.2**; 12 related queries, 61 impressions |
| Junk car removal / salvage / auto recycling | 11 queries, 32 impressions; `junk yards near me` converted at **100%**; `roscommon auto recyclers` sits at position 48 |
| Wrecker service | 348 impressions (above) |
| Boat, trailer & jet-ski towing | resort county, three lakes, and `boat towing near me` already appears |
| RV & camper towing | 3 queries; Houghton Lake is an RV destination |
| Lockout & jump-start / battery | `locksmith near me`, `roadside assistance fuel delivery near me` |
| Flatbed towing | mentioned 7× on the homepage, has no page |
| Heavy-duty / semi / big-rig | 4 queries — worth a page only if you actually run the equipment |
| Impound & repossession towing | appears in queries; only build if you do this work |

Build only the ones you genuinely service. A page for work you cannot do costs you a phone call and a bad review.

**P2-3 · Geographic gaps.**
No page for **St. Helen, Houghton Lake Heights, Frederic/Waters, West Branch, Gladwin, Harrison, Lake City, Mio, Lewiston**, or corridor pages for **I-75, M-55, M-18**. Grayling is proof the format works — it is your best-converting sub-page precisely because it is anchored to real local landmarks (Camp Grayling, Au Sable, I-75 exits). Prioritise by drive time from 8320 N. Harrison Rd, not by population.

**P2-4 · The location pages are thin and near-identical.**
745–889 words each, of which the large majority is boilerplate with the city name swapped. Google's own guidance on doorway pages is unambiguous, and thin duplicated location pages are the classic trigger. Each page needs **300+ words that could not appear on any other page**: named roads and exits, seasonal hazards (Tip-Up Town, ice-fishing season, deer season on M-18, Memorial Day traffic on I-75), specific landmarks, actual local jobs you have run. Grayling already does this. Copy that pattern to the other four.

**P2-5 · No informational content at all.**
Nothing to earn a link, nothing to capture the research-phase searcher. A handful of genuinely useful pieces — *"What to do if you break down on I-75 north of Grayling in winter"*, *"What your junk car is actually worth in Roscommon County right now"*, *"How much does a tow cost in Northern Michigan?"* — are linkable, quotable by AI assistants, and rank for long-tail terms you will never see in GSC.

**P2-6 · The Push-Up Challenge is your most under-exploited asset.**
71 impressions in six months for a story that is objectively newsworthy. It is a local-news segment, a Reddit post, a chamber newsletter item and a link magnet, and right now it is a page nobody links to. Pitch it: Roscommon County news, MLive, Up North Live, the chambers, local Facebook groups.

---

## 5. P3 — Off-site: where the actual ceiling is

**"Near me" is 82 queries, 603 impressions, 7 clicks, average position 7.4.** Those searches are won in the map pack, not in organic results. No amount of on-page work moves them. The levers are:

**P3-1 · Reviews. 13 is the binding constraint.**
Review count and, more importantly, review *velocity* are among the strongest map-pack ranking factors. Thirteen reviews in a resort county with summer competition is thin. Set up a review request that goes out by text within an hour of every completed job — a short link to your Google review form. Target **+3/month sustained**, 13 → 30+ within six months. Reply to every one, including any negative.

**P3-2 · Citation footprint is three profiles.**
You have Google, Yelp and Facebook. Missing and worth claiming: **Bing Places, Apple Business Connect, BBB, Nextdoor, Roscommon County / Houghton Lake / Grayling chambers of commerce**, and towing-specific directories. Also worth pursuing: motor-club and insurance dispatch rotations (Agero, Quest, Allied, AAA contractor lists) — those drive revenue directly, not just rankings.

**P3-3 · `sameAs` is uneven.**
The homepage lists three profiles; every location page lists only Facebook. Make it uniform and expand it as you claim new profiles.

**P3-4 · Local links.**
Camp Grayling, the Higgins Lake and Houghton Lake state park visitor pages, Tip-Up Town sponsorship, local marinas and campgrounds, the county road commission — each is a plausible, genuinely relevant link. You currently appear to have essentially none outside your own profiles.

**P3-5 · Google Business Profile is under-used.**
Posts, the full services list, product entries for junk-car pricing, seeded Q&A, and a regular photo cadence are all free ranking and conversion surface you are not using.

---

## 6. P4 — Performance & housekeeping

**P4-1 · `hero.png` is a 2.6 MB PNG, loaded eagerly, as the LCP element.**
On a rural mobile connection this alone can put Largest Contentful Paint several seconds over budget, and Core Web Vitals is a live ranking signal — on the exact device class that is 61% of your impressions. Convert to WebP/AVIF, target < 150 KB, and serve a responsive `srcset`. `truck.png` (1.7 MB — and it is your `og:image`) and `cards.png` (1.5 MB) need the same treatment.

**P4-2 · ~45 MB of unreferenced media is committed and publicly served.**
Verified dead weight, referenced by no page:
- `assets/videos/source/` — three raw `.mov` files totalling **26.8 MB** (12.5 / 13.4 / 0.96 MB)
- `assets/videos/10.mp4` (**10.9 MB**) and `11.mp4` (**7.2 MB**) — only `1.mp4` through `9.mp4` are referenced anywhere

Total assets are **133 MB**, 81 MB of it video. Delete the unused files from the deployed branch.

**P4-3 · A 79 KB stylesheet ships and is referenced by nothing.**
`design-2.css` (70 KB) is referenced by all seven pages. `assets/stylesheets/styles.css` (**79 KB**) is referenced by none — confirmed dead. Delete it. `main.js` is 57 KB and worth a look for unused code.

**P4-4 · Only 3 of the homepage's 80 `<img>` tags declare width/height.**
That is a Cumulative Layout Shift liability. Add intrinsic dimensions to all of them — mechanical, scriptable, and it also lets the browser reserve space correctly.

**P4-5 · `_headers` does nothing on GitHub Pages.**
Your own comment in the file says so. Putting **Cloudflare** in front of `candcinc.net` (free tier) gets you real `Cache-Control`, Brotli, and automatic image resizing — and makes `_headers` moot. Highest-leverage infrastructure change available.

**P4-6 · No `404.html`.**
Visitors and crawlers hitting a bad URL get GitHub's generic 404 with no route back into the site. A branded 404 with the phone number and service-area links recovers those.

**P4-7 · `Crawl-delay: 1` in robots.txt.**
Google ignores it; **Bing honours it**, so you are needlessly throttling Bing's crawl of a 7-page site. Remove it.

**P4-8 · `.DS_Store` committed at repo root and under `assets/`.**
Publicly fetchable, leaks local directory structure. Delete and add to `.gitignore`.

**P4-9 · IndexNow is set up correctly — keep it.**
Genuinely good work, and rare on a site this size. One narrowing: the workflow triggers on `"*.html"`, which in GitHub Actions path filters does not match nested directories. If you ever move pages into subfolders, change it to `"**/*.html"`.

**P4-10 · `llms.txt` is strong — just keep it true.**
It is well-structured and the AI-crawler allowlist in robots.txt is forward-looking. It currently carries the wrong coordinates (P0-2), a hardcoded review count that will drift, and no entries for pages you have not built yet. Regenerate it as part of the deploy rather than hand-maintaining it.

---

## 7. Sequenced plan

### Week 1 — bugs & snippets *(a few hours, no new content)*
1. Fix coordinates in `index.html`, `llms.txt`, and all seven map embeds (P0-1 → P0-4)
2. Regenerate the Google Maps embed from the live Business Profile (P0-3)
3. Remove `aggregateRating` (P0-5)
4. Consolidate schema to one `@id`'d business entity (P0-6)
5. Regenerate `sitemap.xml`; drop `llms.txt`; wire `lastmod` to git dates (P0-7)
6. Rewrite all 7 titles + descriptions (P1-1, P1-2)
7. Add `max-image-preview:large` robots meta; delete `keywords` meta (P1-5, P1-6)
8. Add `og:image` to the six pages missing it (P1-4)
9. Remove `Crawl-delay`; add `404.html`; purge `.DS_Store` and `.mov` sources (P4-6 → P4-8, P4-2)

### Weeks 2–4 — conversion & foundations
10. Convert `hero.png`, `truck.png`, `cards.png` to WebP with `srcset` (P4-1)
11. Add width/height to all images (P4-4)
12. Stand up the review-request text flow; target +3 Google reviews/month (P3-1)
13. Claim Bing Places, Apple Business Connect, BBB, Nextdoor, three chambers (P3-2)
14. Decide and execute the homepage-vs-Roscommon split (P1-3)
15. Add "wrecker service" language and `alternateName` throughout (P2-1)

### Days 30–60 — content build
16. Ship 4–5 service pages, starting with off-road recovery and junk car removal (P2-2)
17. Rewrite the four weak location pages with 300+ words of genuinely local content each (P2-4)
18. Ship 2–3 new location pages — St. Helen, Houghton Lake Heights, and one corridor page (P2-3)

### Days 60–90 — authority & compounding
19. Put Cloudflare in front of the domain (P4-5)
20. Pitch the Push-Up Challenge to local press and chambers (P2-6)
21. Publish the first 3 informational articles (P2-5)
22. Pursue motor-club / insurance dispatch rotations (P3-2)
23. Re-pull GSC and measure against the baseline below

---

## 8. How we will know it worked

Re-pull the same GSC export at day 90 and compare against this baseline:

| KPI | Today | 90-day target |
|---|---|---|
| Sitewide CTR | 1.93% | **3.5%** |
| Location-page CTR | 0.67 – 0.93% | **≥ 2.5%** each |
| Clicks / day | 0.61 | **2.0** |
| Avg. position | 10.5 | **< 8.0** |
| Google reviews | 13 | **30+** |
| Indexed pages | 7 | **18–20** |
| Zero-click queries at pos ≤ 10 | 152 queries / 456 impr | **halved** |

The first three are achievable on P0 + P1 alone — that is snippet work on traffic you already earn. Everything from P2 down is what raises the ceiling.

---

## 9. What I did not check

Honest gaps, so you know what this plan does not cover:

- **Live Core Web Vitals.** I could not reach the PageSpeed Insights API from this environment; the performance findings are inferred from file sizes and markup, which is reliable for the 2.6 MB LCP image but not a substitute for a real field measurement. Run PSI on mobile for `/` and one location page.
- **Competitor SERPs.** I have not looked at who actually occupies the Roscommon / Houghton Lake map pack, their review counts, or their content depth. That should inform how aggressively to chase P3-1.
- **Backlink profile.** No third-party link data was available; "essentially no external links" is inferred from the site's own outbound profile, not measured.
- **The Google Business Profile itself.** Everything in P3 assumes the profile is claimed, categorised as *Towing service*, and has correct hours and service areas. Worth confirming before anything else — a miscategorised GBP would outweigh most of this document.
