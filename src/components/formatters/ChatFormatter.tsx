import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js";
import { useEffect, useRef } from "react";
import { marked } from "marked";

interface Props {
  text: string;
}

function ChatFormatter({ text }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = marked(text) as string;
    hljs.highlightAll();
  }, [text]);

  return (
    <div className="chat">
      <div
        ref={containerRef}
        className=" overflow-auto h-full bg-slate-800 rounded-xl  text-sm md:text-base"
      />
    </div>
  );
}

export default ChatFormatter;
