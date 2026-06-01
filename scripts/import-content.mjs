import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src', 'content', 'blog');
const imageDir = path.join(root, 'public', 'content', 'images', 'imported');
const cacheDir = path.join(root, '.import-cache');
const siteOrigin = 'https://tattoocoder.com';
const linkedInProfile = 'https://www.linkedin.com/in/shayneboyer/';
const linkedInFallbackUrls = [
  'https://www.linkedin.com/pulse/joy-exhaustion-how-ai-coding-tools-rewired-developer-reward-boyer-n6qre',
  'https://www.linkedin.com/pulse/your-skill-has-quality-score-do-you-know-what-shayne-boyer-5iiie',
  'https://www.linkedin.com/pulse/vs-codes-container-tools-extension-game-changer-shayne-boyer-xnyfe',
  'https://www.linkedin.com/pulse/from-late-night-pings-ai-automation-how-we-built-github-shayne-boyer-oxcse',
  'https://www.linkedin.com/pulse/modern-coder-vs-vibe-code-shayne-boyer-fdx9e',
];

const turndown = new TurndownService({
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  bulletListMarker: '-',
});
turndown.use(gfm);
turndown.keep(['iframe']);
turndown.addRule('ghostImageCaption', {
  filter: ['figcaption'],
  replacement(content) {
    return content.trim() ? `\n\n_${content.trim()}_\n\n` : '';
  },
});

await fs.mkdir(contentDir, { recursive: true });
await fs.mkdir(imageDir, { recursive: true });
await fs.mkdir(cacheDir, { recursive: true });

const ghostPosts = await importGhostPosts();
const linkedInPosts = await importLinkedInArticles();

console.log(`Imported ${ghostPosts.imported}/${ghostPosts.total} Ghost posts`);
console.log(`Imported ${linkedInPosts.imported}/${linkedInPosts.total} LinkedIn articles`);

async function importGhostPosts() {
  const sitemap = await fetchText(`${siteOrigin}/sitemap-posts.xml`);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) => match[1].trim());
  let imported = 0;

  for (const url of urls) {
    try {
      const html = await cachedFetch(url);
      const post = await parseGhostPost(url, html);
      if (!post) {
        console.warn(`Skipping Ghost post without content: ${url}`);
        continue;
      }

      await writePost(post);
      imported += 1;
      await pause(80);
    } catch (error) {
      console.warn(`Failed to import Ghost post ${url}: ${error.message}`);
    }
  }

  return { total: urls.length, imported };
}

async function parseGhostPost(url, html) {
  const $ = cheerio.load(html);
  const jsonLd = parseJsonLd($);
  const slug = slugFromUrl(url);
  const title =
    $('meta[property="og:title"]').attr('content') ||
    jsonLd?.headline ||
    $('h1').first().text().trim();
  const published =
    $('meta[property="article:published_time"]').attr('content') ||
    jsonLd?.datePublished ||
    new Date().toISOString();
  const updated =
    $('meta[property="article:modified_time"]').attr('content') ||
    jsonLd?.dateModified ||
    published;
  const excerpt =
    cleanExcerpt(
      $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '',
    );
  const cover = $('meta[property="og:image"]').attr('content') || jsonLd?.image?.url || jsonLd?.image || '';
  const tags = [
    ...new Set(
      $('meta[property="article:tag"]')
        .map((_, element) => $(element).attr('content')?.trim())
        .get()
        .filter(Boolean),
    ),
  ];

  const content = firstMatch($, ['.post-full-content', '.gh-content', '.post-content', 'article section']);
  if (!content.length) return null;

  await localizeImages($, content, slug);
  const markdown = await localizeMarkdownImages(normalizeMarkdown(turndown.turndown(content.html() || '')), slug);
  const localCover = cover ? await downloadImage(cover, slug, 'cover') : '';

  return {
    slug,
    title,
    published,
    updated,
    excerpt,
    cover: localCover,
    tags,
    source: 'tattoocoder-ghost',
    sourceUrl: url,
    body: markdown,
  };
}

async function importLinkedInArticles() {
  let html = '';
  try {
    html = await fetchText(linkedInProfile);
  } catch (error) {
    console.warn(`LinkedIn profile fetch failed, using known public article URLs: ${error.message}`);
  }
  const articleUrls = [
    ...new Set(
      [
        ...linkedInFallbackUrls,
        ...[...html.matchAll(/https:\/\/www\.linkedin\.com\/pulse\/[^"'\s)]+/g)].map((match) => match[0]),
      ]
        .map((url) => cleanLinkedInUrl(url))
        .filter(Boolean),
    ),
  ];
  let imported = 0;

  for (const url of articleUrls) {
    try {
      const articleHtml = await cachedFetch(url);
      const post = parseLinkedInArticle(url, articleHtml);
      if (!post) {
        console.warn(`Skipping LinkedIn article without content: ${url}`);
        continue;
      }

      await writePost(post);
      imported += 1;
      await pause(150);
    } catch (error) {
      console.warn(`Failed to import LinkedIn article ${url}: ${error.message}`);
    }
  }

  return { total: articleUrls.length, imported };
}

function parseLinkedInArticle(url, html) {
  const $ = cheerio.load(html);
  const title = $('meta[property="og:title"]').attr('content') || $('h1').first().text().trim();
  const description = $('meta[property="og:description"]').attr('content') || '';
  const publishedText =
    $('time').first().attr('datetime') ||
    $('body').text().match(/Published\s+([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/)?.[1] ||
    '';
  const published = publishedText ? new Date(publishedText).toISOString() : new Date().toISOString();
  const slug = slugify(title);

  const articleRoot = firstMatch($, ['article', 'main', '.article-content', '.article-main__content']);

  const bodyText = extractLinkedInMarkdown($, articleRoot, title);
  if (!title || !bodyText) return null;

  return {
    slug,
    title,
    published,
    updated: published,
    excerpt: description,
    cover: '',
    tags: ['LinkedIn', 'AI', 'Developer Experience'].filter(Boolean),
    source: 'linkedin',
    sourceUrl: url,
    body: `${bodyText}\n\n---\n\n_Originally published on [LinkedIn](${url})._`,
  };
}

function extractLinkedInMarkdown($, root, title) {
  const blocks = [];
  const contentRoot = root?.length ? root : $('main');

  contentRoot.find('h1,h2,h3,p,li,blockquote').each((_, element) => {
    const tag = element.tagName?.toLowerCase();
    const text = $(element).text().replace(/\s+/g, ' ').trim();
    if (!text || shouldSkipLinkedInText(text, title)) return;

    if (tag === 'h1') blocks.push(`# ${text}`);
    else if (tag === 'h2') blocks.push(`## ${text}`);
    else if (tag === 'h3') blocks.push(`### ${text}`);
    else if (tag === 'li') blocks.push(`- ${text}`);
    else if (tag === 'blockquote') blocks.push(`> ${text}`);
    else blocks.push(text);
  });

  return dedupeAdjacent(blocks).join('\n\n').trim();
}

function shouldSkipLinkedInText(text, title) {
  if (text === title || text === 'Shayne Boyer' || text === 'Recommended by LinkedIn') return true;
  if (/^(Agree & Join LinkedIn|Create your free account|New to LinkedIn|Report this article|\+ Follow|Published [A-Z][a-z]{2})/.test(text)) {
    return true;
  }

  return [
    'More articles by Shayne Boyer',
    'Others also viewed',
    'Similar topics',
    'Explore content categories',
    'Sign in',
    'Join now',
  ].some((skip) => text.includes(skip));
}

function firstMatch($, selectors) {
  for (const selector of selectors) {
    const match = $(selector).first();
    if (match.length) return match;
  }
  return $('');
}

async function localizeImages($, root, slug) {
  const images = root.find('img').toArray();
  let index = 0;

  for (const image of images) {
    const element = $(image);
    const src = element.attr('src') || element.attr('data-src');
    if (!src) continue;

    const localPath = await downloadImage(src, slug, `image-${index++}`);
    if (localPath) {
      element.attr('src', localPath);
      element.removeAttr('srcset');
      element.removeAttr('data-src');
      element.removeAttr('sizes');
    }
  }
}

async function downloadImage(src, slug, name) {
  const cleanedSrc = src.replace(/\\/g, '');
  const url = absolutizeUrl(cleanedSrc);
  if (!url || !url.startsWith(siteOrigin)) return src;

  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    console.warn(`Image download failed ${url}: ${response.status}`);
    return src;
  }

  const extension = extensionFromContentType(response.headers.get('content-type')) || path.extname(new URL(url).pathname) || '.jpg';
  const filename = `${slug}-${name}${extension}`;
  const target = path.join(imageDir, filename);
  await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
  return `/content/images/imported/${filename}`;
}

async function writePost(post) {
  const filePath = path.join(contentDir, `${post.slug}.md`);
  const frontmatter = {
    title: post.title,
    description: post.excerpt,
    pubDate: post.published,
    updatedDate: post.updated,
    heroImage: post.cover,
    tags: post.tags,
    source: post.source,
    sourceUrl: post.sourceUrl,
  };

  const markdown = `---\n${toYaml(frontmatter)}---\n\n${post.body.trim()}\n`;
  await fs.writeFile(filePath, markdown);
}

function toYaml(data) {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return '';
        return `${key}:\n${value.map((item) => `  - ${yamlString(item)}`).join('\n')}\n`;
      }
      return `${key}: ${yamlString(value)}\n`;
    })
    .join('');
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function parseJsonLd($) {
  for (const script of $('script[type="application/ld+json"]').toArray()) {
    try {
      const parsed = JSON.parse($(script).text());
      if (parsed?.['@type'] === 'Article' || parsed?.['@type'] === 'BlogPosting') return parsed;
      if (Array.isArray(parsed?.['@graph'])) {
        const article = parsed['@graph'].find((item) => item?.['@type'] === 'Article' || item?.['@type'] === 'BlogPosting');
        if (article) return article;
      }
    } catch {
      // Ignore malformed structured data from legacy pages.
    }
  }
  return null;
}

async function cachedFetch(url) {
  const cachePath = path.join(cacheDir, `${slugify(url)}.html`);
  try {
    return await fs.readFile(cachePath, 'utf8');
  } catch {
    const text = await fetchText(url);
    await fs.writeFile(cachePath, text);
    return text;
  }
}

async function fetchText(url) {
  const response = await fetchWithTimeout(url, {
    headers: {
      'user-agent': 'TattooCoder archive importer (+https://tattoocoder.com)',
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function slugFromUrl(url) {
  return new URL(url).pathname.split('/').filter(Boolean).at(-1);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function cleanLinkedInUrl(url) {
  return url.replace(/([?#].*)$/, '').replace(/\/$/, '');
}

function absolutizeUrl(src) {
  try {
    return new URL(src, siteOrigin).toString();
  } catch {
    return '';
  }
}

function extensionFromContentType(contentType = '') {
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('svg')) return '.svg';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  return '';
}

function normalizeMarkdown(markdown) {
  return markdown
    .replace(/<!--kg-card-begin:.*?-->/g, '')
    .replace(/<!--kg-card-end:.*?-->/g, '')
    .replace(/!\[([^\]\n]+)\\\]\((\/content\/images\/[^)]+)\)/g, (_, alt, src) => `![${alt}](${src.replace(/\\_/g, '_')})`)
    .replace(/!\\\[/g, '![')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanExcerpt(excerpt) {
  return excerpt
    .replace(/!?\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function localizeMarkdownImages(markdown, slug) {
  markdown = markdown.replace(/!\[([^\]\n]+)\\\]\((\/content\/images\/[^)]+)\)/g, (_, alt, src) => {
    return `![${alt.replace(/\\/g, '')}](${src.replace(/\\/g, '')})`;
  });

  const matches = [...markdown.matchAll(/!\[([^\]]*)\]\((\/content\/images\/(?!imported\/)[^)]+)\)/g)];
  let updated = markdown;

  for (let index = 0; index < matches.length; index += 1) {
    const [fullMatch, alt, src] = matches[index];
    const localPath = await downloadImage(src, slug, `markdown-${index}`);
    updated = updated.replace(fullMatch, `![${alt.replace(/\\/g, '')}](${localPath.replace(/\\/g, '')})`);
  }

  return updated;
}

function dedupeAdjacent(blocks) {
  const result = [];
  for (const block of blocks) {
    if (result.at(-1) !== block) result.push(block);
  }
  return result;
}

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
