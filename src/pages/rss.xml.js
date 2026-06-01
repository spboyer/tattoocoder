import rss from '@astrojs/rss';
import { getPostSlug, getPublishedPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'TattooCoder',
    description: 'Shayne Boyer’s developer field notes, stories, and lessons from building software.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${getPostSlug(post)}/`,
      categories: post.data.tags,
    })),
  });
}
