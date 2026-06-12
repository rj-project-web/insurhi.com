type LexicalNode = {
  type?: string;
  children?: LexicalNode[];
  tag?: string;
  text?: string;
};

type LexicalRoot = {
  root?: {
    children?: LexicalNode[];
  };
};

function isLexicalContent(value: unknown): value is LexicalRoot {
  return typeof value === "object" && value !== null && "root" in value;
}

function nodeText(node: LexicalNode): string {
  if (node.type === "text" && node.text) return node.text;
  return (node.children ?? []).map(nodeText).join("").trim();
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function allocateHeadingId(text: string, used: Set<string>): string {
  const base = slugifyHeading(text) || "section";
  let id = base;
  let suffix = 2;
  while (used.has(id)) {
    id = `${base}-${suffix++}`;
  }
  used.add(id);
  return id;
}

export type CmsHeading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export function extractCmsHeadings(content: unknown): CmsHeading[] {
  if (!isLexicalContent(content)) return [];

  const headings: CmsHeading[] = [];
  const used = new Set<string>();

  const walk = (nodes: LexicalNode[] | undefined) => {
    if (!nodes?.length) return;
    for (const node of nodes) {
      if (node.type === "heading") {
        const text = nodeText(node);
        if (!text) continue;
        const tag = node.tag ?? "h2";
        const level = tag === "h3" ? 3 : tag === "h4" ? 4 : 2;
        headings.push({
          id: allocateHeadingId(text, used),
          text,
          level,
        });
      }
      walk(node.children);
    }
  };

  walk(content.root?.children);
  return headings;
}

export function buildHeadingIdList(content: unknown): string[] {
  return extractCmsHeadings(content).map((heading) => heading.id);
}

export function getArticleParagraphs(content: unknown): string[] {
  if (!isLexicalContent(content)) return [];

  return (content.root?.children ?? [])
    .filter((node) => node.type === "paragraph")
    .map((node) => nodeText(node))
    .filter(Boolean);
}

export function getArticleListItems(content: unknown, limit = 3): string[] {
  if (!isLexicalContent(content)) return [];

  const items: string[] = [];
  const walk = (nodes: LexicalNode[] | undefined) => {
    if (!nodes?.length || items.length >= limit) return;
    for (const node of nodes) {
      if (node.type === "listitem") {
        const text = nodeText(node);
        if (text) items.push(text);
        if (items.length >= limit) return;
      }
      walk(node.children);
    }
  };

  walk(content.root?.children);
  return items.slice(0, limit);
}

export function estimateReadMinutes(content: unknown): number {
  if (!isLexicalContent(content)) return 4;

  const buffer: string[] = [];
  const walk = (nodes: LexicalNode[] | undefined) => {
    if (!nodes?.length) return;
    for (const node of nodes) {
      if (node.type === "text" && node.text) buffer.push(node.text);
      walk(node.children);
    }
  };
  walk(content.root?.children);

  const words = buffer.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

export function getArticleLede(content: unknown): string | null {
  const paragraphs = getArticleParagraphs(content);
  return paragraphs[0] ?? null;
}
