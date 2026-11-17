import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma';

export interface KnowledgeArticle {
  title: string;
  category: string;
  slug: string;
  source: string;
  content: string;
  tags: string[];
}

export interface KnowledgeSearchResult {
  title: string;
  category: string;
  slug: string;
  source: string;
  contentSnippet: string;
  similarityScore: number;
}

/**
 * Parses frontmatter and body from a markdown file
 */
export function parseMarkdownArticle(fileContent: string): KnowledgeArticle {
  const frontmatterMatch = fileContent.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (!frontmatterMatch) {
    return {
      title: 'PCOS Guide',
      category: 'basics',
      slug: 'guide',
      source: 'Clinical Guidelines',
      content: fileContent,
      tags: [],
    };
  }

  const rawYaml = frontmatterMatch[1];
  const body = frontmatterMatch[2].trim();

  let title = 'PCOS Guide';
  let category = 'basics';
  let slug = 'guide';
  let source = 'Evidence-based PCOS Guidelines';
  let tags: string[] = [];

  for (const line of rawYaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (key === 'title') title = val;
      if (key === 'category') category = val;
      if (key === 'slug') slug = val;
      if (key === 'source') source = val;
      if (key === 'tags') {
        try {
          tags = JSON.parse(val.replace(/'/g, '"'));
        } catch (_) {
          tags = val.split(',').map((s) => s.trim());
        }
      }
    }
  }

  return { title, category, slug, source, content: body, tags };
}

/**
 * Loads all knowledge markdown articles from /content/knowledge
 */
export function loadAllKnowledgeArticles(): KnowledgeArticle[] {
  const knowledgeDir = path.resolve(process.cwd(), 'content/knowledge');
  if (!fs.existsSync(knowledgeDir)) {
    return [];
  }

  const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith('.md'));
  const articles: KnowledgeArticle[] = [];

  for (const file of files) {
    const fullPath = path.join(knowledgeDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    articles.push(parseMarkdownArticle(content));
  }

  return articles;
}

/**
 * Simple TF-IDF / Token overlap semantic similarity score
 */
function computeRelevanceScore(query: string, article: KnowledgeArticle): number {
  const queryTokens = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
  if (queryTokens.length === 0) return 0;

  const contentLower = article.content.toLowerCase();
  const titleLower = article.title.toLowerCase();
  const tagsLower = article.tags.map((t) => t.toLowerCase()).join(' ');

  let score = 0;
  for (const token of queryTokens) {
    if (titleLower.includes(token)) score += 5.0;
    if (tagsLower.includes(token)) score += 3.0;
    const occurrences = (contentLower.match(new RegExp(token, 'g')) || []).length;
    score += Math.min(4.0, occurrences * 0.5);
  }

  return score;
}

/**
 * Searches the curated PCOS knowledge base using semantic ranking
 */
export async function searchKnowledgeBase(
  query: string,
  topK: number = 2
): Promise<KnowledgeSearchResult[]> {
  const articles = loadAllKnowledgeArticles();
  if (articles.length === 0) return [];

  const scored = articles.map((art) => {
    const score = computeRelevanceScore(query, art);
    const snippet = art.content.slice(0, 450) + '...';
    return {
      title: art.title,
      category: art.category,
      slug: art.slug,
      source: art.source,
      contentSnippet: snippet,
      similarityScore: score,
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return scored.slice(0, topK);
}
