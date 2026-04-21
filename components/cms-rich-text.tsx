import type { CSSProperties, ReactNode } from "react";

type LexicalTextNode = {
  type?: "text";
  text?: string;
  format?: number | string;
  style?: string;
};

type LexicalNode = {
  type?: string;
  children?: LexicalNode[];
  tag?: string;
  value?: number;
  listType?: string;
  url?: string;
  text?: string;
  format?: number | string;
  style?: string;
};

type LexicalRoot = {
  root?: {
    children?: LexicalNode[];
  };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLexicalContent(value: unknown): value is LexicalRoot {
  return isObject(value) && "root" in value;
}

function hasFormat(format: number | string | undefined, flag: number, keyword: string): boolean {
  if (typeof format === "number") return (format & flag) !== 0;
  if (typeof format === "string") return format.toLowerCase().includes(keyword);
  return false;
}

function parseInlineStyle(styleText: string | undefined): CSSProperties | undefined {
  if (!styleText?.trim()) return undefined;
  const style: Record<string, string> = {};
  for (const part of styleText.split(";")) {
    const [rawKey, rawValue] = part.split(":");
    if (!rawKey || !rawValue) continue;
    const key = rawKey.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    style[key] = rawValue.trim();
  }
  return Object.keys(style).length > 0 ? (style as CSSProperties) : undefined;
}

function applyTextFormats(text: string, format: number | string | undefined, styleText?: string): ReactNode {
  const withLineBreaks: ReactNode = text.split("\n").map((part, index, arr) => (
    <span key={`${index}-${part.slice(0, 8)}`}>
      {part}
      {index < arr.length - 1 ? <br /> : null}
    </span>
  ));
  let node: ReactNode = withLineBreaks;
  if (hasFormat(format, 1, "bold")) node = <strong>{node}</strong>;
  if (hasFormat(format, 2, "italic")) node = <em>{node}</em>;
  if (hasFormat(format, 8, "underline")) node = <u>{node}</u>;
  if (hasFormat(format, 16, "strikethrough")) node = <s>{node}</s>;
  if (hasFormat(format, 32, "code")) node = <code>{node}</code>;
  if (hasFormat(format, 64, "subscript")) node = <sub>{node}</sub>;
  if (hasFormat(format, 128, "superscript")) node = <sup>{node}</sup>;
  const inlineStyle = parseInlineStyle(styleText);
  if (inlineStyle) {
    node = <span style={inlineStyle}>{node}</span>;
  }
  return node;
}

function renderChildren(children: LexicalNode[] | undefined): ReactNode[] {
  if (!children?.length) return [];
  return children.map((child, index) => <span key={index}>{renderNode(child)}</span>);
}

function renderNode(node: LexicalNode): ReactNode {
  if (node.type === "text") {
    return applyTextFormats(node.text ?? "", node.format, node.style);
  }

  if (node.type === "linebreak") {
    return <br />;
  }

  if (node.type === "paragraph") {
    return <p className="mb-4 leading-7 last:mb-0">{renderChildren(node.children)}</p>;
  }

  if (node.type === "heading") {
    const level = node.tag ?? "h2";
    if (level === "h1") return <h1 className="mb-4 text-3xl font-semibold tracking-tight">{renderChildren(node.children)}</h1>;
    if (level === "h2") return <h2 className="mb-3 mt-6 text-2xl font-semibold tracking-tight">{renderChildren(node.children)}</h2>;
    if (level === "h3") return <h3 className="mb-2 mt-5 text-xl font-semibold tracking-tight">{renderChildren(node.children)}</h3>;
    return <h4 className="mb-2 mt-4 text-lg font-semibold tracking-tight">{renderChildren(node.children)}</h4>;
  }

  if (node.type === "quote") {
    return <blockquote className="my-4 border-l-2 pl-4 italic text-muted-foreground">{renderChildren(node.children)}</blockquote>;
  }

  if (node.type === "list") {
    const isOrdered = node.listType === "number";
    if (isOrdered) {
      return <ol className="my-4 list-decimal space-y-2 pl-6">{renderChildren(node.children)}</ol>;
    }
    return <ul className="my-4 list-disc space-y-2 pl-6">{renderChildren(node.children)}</ul>;
  }

  if (node.type === "listitem") {
    return <li>{renderChildren(node.children)}</li>;
  }

  if (node.type === "link") {
    const href = node.url ?? "#";
    return (
      <a href={href} className="underline underline-offset-4">
        {renderChildren(node.children)}
      </a>
    );
  }

  return <>{renderChildren(node.children)}</>;
}

export function extractCmsText(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (!isLexicalContent(content)) return "";

  const buffer: string[] = [];
  const walk = (nodes: LexicalNode[] | undefined) => {
    if (!nodes?.length) return;
    for (const node of nodes) {
      if (node.type === "text" && node.text) buffer.push(node.text);
      walk(node.children);
      if (node.type === "paragraph" || node.type === "heading" || node.type === "listitem") {
        buffer.push(" ");
      }
    }
  };
  walk(content.root?.children);
  return buffer.join(" ").replace(/\s+/g, " ").trim();
}

export function CmsRichText({
  content,
  className,
}: {
  content: unknown;
  className?: string;
}) {
  const rootClass = className ?? "leading-7 text-foreground/90";
  if (typeof content === "string") {
    return <div className={`whitespace-pre-wrap ${rootClass}`}>{content}</div>;
  }
  if (!isLexicalContent(content)) return null;

  const children = content.root?.children ?? [];
  return <div className={rootClass}>{children.map((node, index) => <div key={index}>{renderNode(node)}</div>)}</div>;
}
