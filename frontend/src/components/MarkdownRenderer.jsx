import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose-editorial">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition"
            />
          ),
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="rounded-xl shadow-sm my-6 w-full object-cover max-h-[500px]"
              loading="lazy"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 border border-gray-200 rounded-lg">
              <table {...props} className="min-w-full divide-y divide-gray-200 text-sm" />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th {...props} className="px-4 py-3 bg-gray-50 text-left font-semibold text-gray-900" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="px-4 py-3 border-t border-gray-100 text-gray-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

