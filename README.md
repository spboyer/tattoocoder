# TattooCoder

Astro rebuild of `tattoocoder.com`: Shayne Boyer’s developer field notes, stories, and lessons from building software.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run import:content` | Import posts from the current Ghost site and public LinkedIn articles |
| `npm run dev` | Start the Astro dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the production build locally |

## Content

Posts live in `src/content/blog`. The importer preserves original Ghost slugs so existing links like `/aspnet-slack-sign-up/` continue to work. Ghost-hosted images are downloaded into `public/content/images/imported` so the new static site does not depend on the old Ghost container.

LinkedIn articles discovered from Shayne’s public profile are imported as first-class posts with `source: "linkedin"` and the original `sourceUrl` preserved in frontmatter.
