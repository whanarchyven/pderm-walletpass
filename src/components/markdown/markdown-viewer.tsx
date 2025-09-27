import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function MarkdownViewer(props: { content: string }) {
  return (
    <article className="prose mx-auto mb-10">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula} // try passing different color schemes, drak, dracula etc.
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code>{children}</code>
            );
          },
        }}
      >
        {props.content}
      </ReactMarkdown>
    </article>
  );
}
