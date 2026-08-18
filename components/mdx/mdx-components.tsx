"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Heading components with anchor links
const H1 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  const id =
    props.id ||
    (props.children?.toString() || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

  return (
    <h1
      id={id}
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  );
};

const H2 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  const id =
    props.id ||
    (props.children?.toString() || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

  return (
    <h2
      id={id}
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  );
};

const H3 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  const id =
    props.id ||
    (props.children?.toString() || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

  return (
    <h3
      id={id}
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
};

const H4 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  const id =
    props.id ||
    (props.children?.toString() || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

  return (
    <h4
      id={id}
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
};

// Paragraph component - Fixed to prevent nesting issues
const P = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  // Check if children contain block-level elements
  const hasBlockElements = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      const type = child.type;
      // Check for block-level components
      return (
        type === "div" ||
        type === "pre" ||
        type === "blockquote" ||
        type === "ul" ||
        type === "ol" ||
        type === "table" ||
        (typeof type === "function" &&
          (type.name === "CodeBlock" ||
            type.name === "Alert" ||
            type.name === "Blockquote"))
      );
    }
    return false;
  });

  // If has block elements, render as div to avoid nesting issues
  if (hasBlockElements) {
    return (
      <div
        className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Otherwise render as normal paragraph
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  );
};

// List components
const UL = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
);

const OL = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
);

const LI = ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li className={cn("mt-2", className)} {...props} />
);

// Blockquote component
const Blockquote = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className={cn("mt-6 border-l-2 pl-6 italic", className)}
    {...props}
  />
);

// Code components
const InlineCode = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
      className
    )}
    {...props}
  />
);

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
}

const CodeBlock = ({ className, children, ...props }: CodeBlockProps) => {
  const language = className ? className.replace(/language-/, "") : "text";
  const code = React.Children.toArray(children).join("");
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border group relative">
      <div className="bg-muted px-4 py-2 font-mono text-sm flex justify-between items-center">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: 0 }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// Table components
const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="my-6 w-full overflow-y-auto">
    <table className={cn("w-full", className)} {...props} />
  </div>
);

const THead = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-muted", className)} {...props} />
);

const TBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
);

const TR = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("m-0 border-t p-0 even:bg-muted", className)} {...props} />
);

const TD = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("border px-4 py-2", className)} {...props} />
);

const TH = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn("border px-4 py-2 text-left font-bold", className)}
    {...props}
  />
);

// Custom components
const AlertComponent = ({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "error" | "success";
}) => {
  const icons = {
    info: <Info className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
  };

  const title = {
    info: "Note",
    warning: "Warning",
    error: "Error",
    success: "Success",
  };

  return (
    <Alert className="my-6">
      {icons[type]}
      <AlertTitle>{title[type]}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

// MDX components mapping
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  code: ({ className, children, ...props }: any) => {
    // If className contains language-, it's a code block
    if (className?.includes("language-")) {
      return (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      );
    }
    // Otherwise it's inline code
    return (
      <InlineCode className={className} {...props}>
        {children}
      </InlineCode>
    );
  },
  pre: ({ children }: { children: React.ReactNode }) => {
    // Extract the code element from pre
    if (React.isValidElement(children) && children.type === "code") {
      return children; // Return the code element directly to avoid nesting
    }
    return <div className="my-6">{children}</div>; // Use div instead of pre to avoid nesting
  },
  table: Table,
  thead: THead,
  tbody: TBody,
  tr: TR,
  td: TD,
  th: TH,
  img: ({
    alt,
    src,
    width,
    height,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <div className="my-6">
      <Image
        alt={alt || ""}
        src={src || ""}
        width={typeof width === "string" ? parseInt(width) : width || 800}
        height={typeof height === "string" ? parseInt(height) : height || 500}
        className="rounded-lg"
        {...props}
      />
    </div>
  ),
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link
      href={href || "#"}
      className="text-primary underline hover:text-primary/80"
      {...props}
    />
  ),
  Alert: AlertComponent,
};
