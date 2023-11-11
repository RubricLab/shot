import puppeteer from "puppeteer-core";
import { put } from "@vercel/blob";

console.log("🚀 Starting up on port " + process.env.PORT);

const headers = {
  base: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST",
  },
};

Bun.serve({
  hostname: "::",
  port: process.env.PORT || 3001,
  fetch: async (request: Request) => {
    try {
      const { searchParams } = new URL(request.url);

      let url = searchParams.get("url");
      let upload = searchParams.get("upload");

      if (!url) return new Response("Add ?url=example.com");

      console.log(`📸 Taking screenshot of ${url}`);

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
            ...headers.base,
          },
        });
      } else {
        const uid = Math.random().toString(36).substring(2, 15);
        const baseUrl = url.replace(/(^\w+:|^)\/\//, "");
        const fileName = `${baseUrl}-${uid}.png`;

        console.log(`⏫ Uploading ${fileName}`);

        const blob = new Blob([screenshot]);

        const upload = await put(fileName, blob, { access: "public" });

        res = new Response(upload.url, {
          headers: {
            "Content-Type": "text/plain",
            ...headers.base,
          },
        });
      }

      await browser.close();

      console.log("⚾ Closing browser\n\n");

      return res;
    } catch (error: any) {
      console.error(error);

      return new Response(`Something went wrong: ${error.message || "?"}`, {
        status: 500,
      });
    }
  },
});
