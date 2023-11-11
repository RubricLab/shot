import puppeteer from "puppeteer-core";

const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  fetch: async (request: Request) => {
    const { searchParams } = new URL(request.url);

    const url = searchParams.get("url") || "https://rubric.sh";

    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSER_URL,
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    const screenshot = await page.screenshot();

    return new Response(screenshot);
  },
});
