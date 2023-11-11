# Shot

Grab a screenshot of any site.

Try it [here](https://shot.rubric.sh).

Try the API like this: [shot.api.rubric.sh?url=x.com](https://shot.api.rubric.sh?url=x.com). It returns a stream of an image.

Inspired by 2 weeks of pain from [this project](https://copyai.rubric.sh/).

Made for future usage with gpt-4-vision.

## Roadmap

- [ ] Run any script in the browser

## Dev

1. Run `bun i` in the **api/** and **web/** folders.
2. Populate env vars in both folders: `cp .env.example .env`. You'll need a headless browser websocket URL eg. [browserless](https://www.browserless.io).
3. Run `bun dev` in both folders.
