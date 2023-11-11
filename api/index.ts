import puppeteer from "puppeteer-core";
import { put } from "@vercel/blob";

console.log("🚀 Starting up on port " + process.env.PORT);

const headers = {
  common: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST",
  },
};

Bun.serve({
  hostname: "::",
  port: process.env.PORT || 3001,
  fetch: async (request: Request) => {
    const { searchParams } = new URL(request.url);

    let url = searchParams.get("url");
    let upload = Boolean(searchParams.get("upload"));

    if (!url) return new Response("Add ?url=example.com");

    console.log(
      `📸 Taking screenshot of ${url}. ${upload ? "Uploading." : ""}`
    );

    url = url.startsWith("https://") ? url : `https://${url}`;

    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSER_URL,
    });

    const page = await browser.newPage();

    // Wait until network activity settles to 2 req/s
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.setViewport({ width: 1920, height: 1080 });

    const screenshot = await page.screenshot();

    let res: any;

    if (!upload) {
      res = new Response(screenshot, {
        headers: {
          "Content-Type": "image/png",
          ...headers.common,
        },
      });
    } else {
      const uid = Math.random().toString(36).substring(2, 15);
      const strippedUrl = url.replace(/(^\w+:|^)\/\//, "");
      const fileName = `${strippedUrl}-${uid}.png`;
      const blob = new Blob([screenshot]);

      const upload = await put(fileName, blob, { access: "public" });

      res = new Response(upload.url, {
        headers: {
          "Content-Type": "text/plain",
          ...headers.common,
        },
      });
    }

    await browser.close();

    return res;
  },
});
