# C&C Inc SEO — Progress Tracker

**Last updated:** 19 August 2026 (round 2)
Companion to `SEO-ACTION-PLAN.md`. IDs map to findings in that document.

## Scoreboard

| | Done | Remaining |
|---|---|---|
| **P0** — correctness bugs | **7 of 7** | 0 |
| **P1** — CTR | **6 of 6** | 0 |
| **P2** — content | 2 of 6 | 4 |
| **P3** — off-site | 0 of 5 | 5 (mostly yours) |
| **P4** — technical | 5 of 10 | 5 |
| **Total** | **20 of 35** | 15 |

*35, not 34 — round 2 turned up one more pre-existing bug. See P0-8.*

> Everything is in your working tree, **uncommitted**. `.cursorrules` says never commit, so I haven't. Review with `git diff`, then commit and push. **Nothing is live until you push.**

---

## Round 2 — what just shipped

### P4-1 · Images (the big one)

Every referenced raster image already had a WebP sibling sitting in the repo — someone generated them and never wired them up. The HTML now points at them.

| | Before | After | |
|---|---:|---:|---|
| `hero.png` → `hero.webp` | 2,673 KB | **144 KB** | −95% — this is your LCP element |
| Homepage referenced imagery | 26.4 MB | **3.4 MB** | −87% |
| Social preview (`truck.png` → `truck-og.jpg`) | 1,687 KB | **170 KB** | −90% |

62 image references swapped across 8 pages. I generated `truck-og.jpg` (1200×705) fresh rather than pointing `og:image` at a WebP, because social crawlers are still inconsistent about WebP; `og:image:width`/`height` updated to match.

### P4-4 · Layout stability

97 images given intrinsic `width`/`height`, read from the actual files rather than guessed. Because they're the *true* intrinsic dimensions, layout is byte-identical — the only change is that the browser can now reserve the space before the image arrives, which is what kills CLS. Also added `decoding="async"` to lazy images.

**One thing I broke and caught:** my first pass added `loading="lazy"` to every image without one — which included the hero background and the site header logo, both above the fold. That's an LCP regression, not an improvement. Caught it by diffing loading attributes against the originals, and both are now `eager` with `fetchpriority="high"`. Worth knowing the check exists, because it's exactly the kind of thing a bulk edit gets wrong.

### P1-3 · Cannibalisation

Decided to **keep both pages** rather than fold and redirect. The deciding factor is that GitHub Pages can't issue a server-side 301 — a fold would mean a JS or meta-refresh redirect, which passes ranking signal poorly. So the two pages are now split by intent:

- **Homepage** = brand + county. H1 is now *"24/7 Towing & Wrecker Service Across Roscommon County"*.
- **`roscommon-towing.html`** = the city query. H1 is now *"24/7 Towing & Wrecker Service in Roscommon, Michigan"*.

The homepage previously linked to the Roscommon page exactly **once**, from the footer. It now links contextually from the hero and the about copy too.

I also removed two unsubstantiated superlatives while I was in there — *"Roscommon's #1 Trusted"* and *"Most Trusted Towing Service"*. Neither is defensible if challenged, and neither was earning anything.

### P2-4 · The thin location pages

| Page | Words before | After |
|---|---:|---:|
| `roscommon-towing.html` | 836 | **1,275** |
| `higgins-lake-towing.html` | 889 | **1,302** |
| `houghton-lake-towing.html` | 856 | **1,244** |
| `prudenville-towing.html` | 745 | **1,115** |

Each got a new section built on things that are only true of that place — the sand cottage lanes and both state parks at Higgins Lake, M-55 and Tip-Up Town at Houghton Lake, the M-18 corridor and Au Sable state forest two-tracks at Roscommon, the north shore at Prudenville. Each closes with a practical *"while you wait for the truck"* block, which is the kind of thing that earns links and gets quoted by AI assistants.

**Please read these before you push.** I stuck to public geography and avoided inventing anything, but some lines characterise how your business operates — *"backing a truck several hundred feet down a sand two-track is routine here"*, *"Prudenville generates a lot of lockout calls"*. Those are plausible, not verified. Correct anything that doesn't match reality.

### P2-1 · Wrecker copy

Now in visible body text on all six service pages (3–6 mentions each), plus a per-page wrecker FAQ. Targets the 348 impressions and zero clicks that `c and c wrecker service` and its variants were throwing off.

### P0-8 · NEW BUG — FAQ schema had drifted from the page

Not in the original audit; found while validating round 2. Google requires `FAQPage` markup to match content actually visible on the page.

- **`index.html`** — schema declared *"Is C&C Inc a certified towing company?"*, which appeared nowhere on the page, and worded the payment question differently from the visible one.
- **`push-up-challenge.html`** — 6 visible FAQs, only 4 in schema, 2 of those worded differently.

Rather than hand-patch, the `FAQPage` block on every page is now **generated from the rendered DOM**, so question and answer text match exactly by construction and can't drift again. The certification Q&A was good content, so it got a visible home rather than being deleted.

---

## Verification run on round 2

- Every JSON-LD block re-parsed as valid JSON
- `img` / `iframe` / `video` / `h1` counts compared against originals — unchanged on every page
- Every referenced image path confirmed to exist on disk
- Above-the-fold images confirmed not lazy-loaded
- FAQ visible-vs-schema parity asserted as **exact string match**, not just count
- All titles re-checked ≤ 60 characters
- Confirmed zero remaining stale coordinates, `pb=` embeds, `aggregateRating` or `keywords` meta

---

## NEEDS YOU

| # | Task | Why |
|---|---|---|
| 1 | **Read the new location-page copy** and correct anything that misstates how you work. | Flagged above — plausible, not verified |
| 2 | **Confirm the map pin on your Google Business Profile.** | Census geocoding is interpolated; your GBP pin is ground truth |
| 3 | **Delete the dead files.** The bridge can't delete on your Mac:<br>`rm -rf assets/videos/source assets/videos/10.mp4 assets/videos/11.mp4`<br>`rm -f assets/stylesheets/styles.css .dims.json`<br>`find . -name .DS_Store -delete`<br>`git rm -r --cached assets/videos/source; git rm --cached .DS_Store assets/.DS_Store assets/imgs/.DS_Store` | ~45 MB unreferenced video, a 79 KB unused stylesheet, and `.dims.json` — a scratch file I wrote while measuring images and couldn't remove (it's gitignored, so it won't be committed either way) |
| 4 | **Run PageSpeed Insights**, mobile, on `/` — before and after. | I can't reach the PSI API from here, and the hero change should be dramatic |
| 5 | **Resubmit the sitemap** in Search Console after pushing. | Needs your login |
| 6 | **Start the review engine.** 13 → 30+. | Highest-leverage item on the entire plan, and entirely offline |

---

## REMAINING — 15 items

### Blocked on your answers

1. **P2-2 · Service pages.** Priority from the data: off-road recovery & winch-outs (`off road recovery near me` converts at **20% CTR from position 3.2**), junk car removal / salvage, boat & trailer, RV & camper, lockout & jump-start, heavy-duty. **Which of these do you actually run?** I won't build a page for work you can't take.
2. **P2-3 · New location pages.** St. Helen, Houghton Lake Heights, Frederic/Waters, plus I-75 and M-55 corridor pages. Say the word and I'll build them on the pattern that's now working.

### I can do these unprompted

3. **P2-5 · Informational articles.** Breakdown on I-75 in winter; what a junk car is worth right now; what a tow costs in Northern Michigan.
4. **P4-3 · Remove the dead stylesheet reference** — nothing links to `styles.css`, so this is just the file deletion in *Needs you #3*.
5. **P4-9 · IndexNow path filter** — `"*.html"` → `"**/*.html"` before you ever nest pages in subfolders.
6. **P4-10 · Regenerate `llms.txt` at deploy** rather than hand-maintaining it.
7. **NEW · Hotlinked Unsplash backgrounds.** The location pages pull decorative backgrounds straight from `images.unsplash.com` at page load — a third-party dependency on your critical path, and a licensing question if Unsplash ever changes terms. Worth self-hosting as WebP.

### Yours

8. **P3-1 · Reviews** · 9. **P3-2 · Citations** (Bing Places, Apple Business Connect, BBB, Nextdoor, the three chambers, then Agero/Quest/Allied dispatch rotations) · 10. **P3-3 · `sameAs` expansion** as you claim profiles · 11. **P3-4 · Local links** (Camp Grayling, the state parks, marinas, Tip-Up Town) · 12. **P3-5 · Google Business Profile** posts, services, products, Q&A, photos
13. **P2-6 · Pitch the Push-Up Challenge to local press.**
14. **P4-2 · Delete the dead media** — see *Needs you #3*.
15. **P4-5 · Cloudflare in front of the domain.** Free tier gets real cache headers, Brotli and image resizing, none of which GitHub Pages can do. Makes your `_headers` file actually work.

---

## What to expect

P0 and P1 are complete, and they were the cheap half — correctness and snippet work on traffic you already earn. Combined with the image work, the things most likely to move first are:

- **CTR**, from snippet rewrites — visible in Search Console within 2–3 weeks of pushing
- **Mobile Core Web Vitals**, from a 2.6 MB → 144 KB LCP image — visible in PSI immediately, in field data after ~28 days
- **`wrecker` queries**, from zero coverage to six pages — the fastest new-keyword win available

Everything left either raises the ceiling (P2 content, P3 authority) or is infrastructure. None of it is urgent in the way the coordinate bug was.
