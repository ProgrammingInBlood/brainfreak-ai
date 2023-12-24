import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js";
import { useEffect } from "react";
import { marked } from "marked";

interface Props {
  text: string;
}

function ChatFormatter({ text }: Props) {
  useEffect(() => {
    hljs.highlightAll();
  });

  return (
    <div className="chat">
      <div
        className=" overflow-auto h-full bg-slate-800 rounded-xl  text-sm md:text-xl "
        dangerouslySetInnerHTML={{ __html: marked(text) }}
      />
    </div>
  );
}

export default ChatFormatter;
