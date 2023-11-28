# Shot

Grab a screenshot of any site.

<img width="773" alt="image" src="https://github.com/RubricLab/shot/assets/36117635/8815ee0b-e1a3-4d6e-be38-475a77edca2e">

Try it [here](https://shot.rubric.sh).

Try the API like this: [shot.api.rubric.sh?url=x.com](https://shot.api.rubric.sh?url=x.com). It returns a stream of an image.

Inspired by 2 weeks of pain from [this project](https://copyai.rubric.sh/).

Made for future usage with gpt-4-vision.

## Roadmap

- [x] Run any script in the browser

## Dev

1. Run `bun i` in the [api](/api) and [web](/web) folders.
2. Populate env vars in both folders: `cp .env.example .env`.
3. Populate `BROWSER_URL` with a headless browser websocket URL eg. [browserless](https://www.browserless.io).
4. Populate `BLOB_READ_WRITE_TOKEN` with a bucket URL eg. [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).
5. Run `bun dev` in both folders.
