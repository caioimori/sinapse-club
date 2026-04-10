'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import type { Components } from 'react-markdown';

interface Props {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: Props) {
  const components: Components = {
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="rounded-lg overflow-x-auto p-4 bg-zinc-900 border border-zinc-800"
        {...props}
      >
        {children}
      </pre>
    ),
  };

  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
