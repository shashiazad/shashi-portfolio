import { createElement } from 'react';
import { marked } from 'marked';

export const articleContentClassName =
  'prose prose-invert max-w-none space-y-4 text-[#d4d4d8] [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-[#f5f5f7] [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[#f5f5f7] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#f5f5f7] [&_p]:leading-8 [&_p]:text-[#d4d4d8] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:leading-7 [&_blockquote]:border-l-2 [&_blockquote]:border-[#2997ff] [&_blockquote]:pl-4 [&_blockquote]:text-[#a1a1a6] [&_a]:text-[#2997ff] [&_a]:underline [&_a]:underline-offset-2 [&_img]:my-6 [&_img]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-white/[0.08] [&_pre]:p-4 [&_code]:rounded [&_code]:bg-white/[0.08] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm';

export function ArticleBody({ content }: { content: string }) {
  const value = content?.trim() ?? '';
  if (!value) return null;

  const html = marked.parse(value, {
    gfm: true,
    breaks: true,
  });

  return createElement('div', {
    className: articleContentClassName,
    dangerouslySetInnerHTML: { __html: typeof html === 'string' ? html : '' },
  });
}
