// scripts/submit-indexnow.js
/**
 * Submit sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver, etc.)
 *
 * Usage:
 *   node scripts/submit-indexnow.js            # submit all sitemap URLs
 *   node scripts/submit-indexnow.js --dry-run  # print payload only
 *   node scripts/submit-indexnow.js https://candcinc.net/page.html
 */

const fs = require("fs");
const path = require("path");

const HOST = "candcinc.net";
const KEY = "5333e792db22bcd01c8da6d111aa1b6f";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const SITEMAP_PATH = path.join(__dirname, "..", "sitemap.xml");

function parseArgs(argv) {
  const dryRun = argv.includes("--dry-run");
  const urls = argv.filter((arg) => !arg.startsWith("--") && arg.startsWith("http"));
  return { dryRun, urls };
}

function urlsFromSitemap(filePath) {
  const xml = fs.readFileSync(filePath, "utf8");
  const matches = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)];
  return matches.map((match) => match[1].trim());
}

async function submit(urlList, dryRun) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  console.log(`IndexNow · ${urlList.length} URL(s)`);
  urlList.forEach((url) => console.log(`  • ${url}`));

  if (dryRun) {
    console.log("\nDry run — payload not sent:");
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  console.log(`\nHTTP ${response.status}${body ? ` — ${body}` : ""}`);

  // 200 = OK, 202 = Accepted (key file may still be verifying)
  if (response.status !== 200 && response.status !== 202) {
    process.exitCode = 1;
  }
}

async function main() {
  const { dryRun, urls } = parseArgs(process.argv.slice(2));
  const urlList = urls.length > 0 ? urls : urlsFromSitemap(SITEMAP_PATH);

  if (urlList.length === 0) {
    console.error("No URLs to submit.");
    process.exit(1);
  }

  await submit(urlList, dryRun);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
