import puppeteer from "puppeteer-core";
import { put } from "@vercel/blob";
import { z } from "zod";

console.log("🚀 Starting up on port " + process.env.PORT);

const headers = {
  base: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST",
  },
};

const schema = z.object({
  url: z.string(),
  upload: z.string().optional(),
  scripts: z.array(z.string()).optional(),
});

Bun.serve({
  hostname: "::",
  port: process.env.PORT || 3001,
  fetch: async (request: Request) => {
    try {
      let url = "";
      let upload: string;
      let scripts: string[] = [];

      if (request.method === "GET") {
        const { searchParams } = new URL(request.url);

        url = searchParams.get("url") as string;
        upload = searchParams.get("upload") || "";

        if (!url) return new Response("Add ?url=example.com to the URL");
      } else {
        const body = (await request.json()) as any;

        url = body.url;
        upload = body.upload;
        scripts = body.scripts;

        if (!url) return new Response('Pass { "url": "example.com" } in body');
      }

      // Validate inputs against schema
      schema.parse({
        url,
        upload,
        scripts,
      });

      console.log(`📸 Taking screenshot of ${url}`);

      url = url.startsWith("https://") ? url : `https://${url}`;

      const browser = await puppeteer.connect({
        browserWSEndpoint: process.env.BROWSER_URL,
      });

      const page = await browser.newPage();

      // Wait until network activity settles to 2 req/s
      await page.goto(url, { waitUntil: "networkidle2" });
      await page.setViewport({ width: 1920, height: 1200 });

      // Run scripts on page
      for (const script of scripts) {
        console.log("🏃 Running: " + script);
        await page.evaluate(script, script);
      }

      const screenshot = await page.screenshot();

      let res: Response;

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
