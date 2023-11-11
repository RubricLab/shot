import puppeteer from "puppeteer-core";

Bun.serve({
  hostname: "::",
  port: process.env.PORT || 3000,
  fetch: async (request: Request) => {
    console.log("Starting up on " + process.env.PORT);

    const { searchParams } = new URL(request.url);

    let url = searchParams.get("url");

    if (!url) return new Response("Do ?url=https://example.com");

    url = url.startsWith("https://") ? url : `https://${url}`;

    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSER_URL,
    });

    const page = await browser.newPage();

    // Wait until network activity settles to 2 req/s
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    const screenshot = await page.screenshot();

    const res = new Response(screenshot);

    // Set generous CORS headers
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Headers", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST");

    return res;
  },
});
