"use client";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxComponents } from "./mdx-components";

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export default function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <article className="mdx-content">
      <MDXRemote {...source} components={mdxComponents} />
    </article>
  );
}
