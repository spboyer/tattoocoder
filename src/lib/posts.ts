import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('blog');

  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getPostSlug(post: CollectionEntry<'blog'>) {
  return post.id.replace(/\.md$/, '');
}

export function sourceLabel(source: 'tattoocoder-ghost' | 'linkedin') {
  return source === 'linkedin' ? 'LinkedIn' : 'TattooCoder';
}

export function readingTime(body = '') {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
