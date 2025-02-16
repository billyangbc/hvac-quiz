import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { customMDComponents } from "./markdown-components";
import "./markdown.css";

export default async function MarkdownCard(props: {content: string, css?: string}) {
  const { content, css } = props;
  const currentDate = new Date().toLocaleString("en-US", { year: "numeric", month: "long" });
  const outContent = content.replace(/\[\[Date\]\]/g, currentDate);
  return (
    <Card className={cn("border-2 my-6 relative", css ?? "")}>
      <CardContent className="markdown-content text-lg md:px-8 max-w-5xl">
        <ReactMarkdown components={customMDComponents}>{outContent}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}