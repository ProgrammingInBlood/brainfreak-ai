import React, { useMemo } from "react";
import LogoIcon from "../icons/LogoIcon";

interface Props {
  setInput: (value: string) => void;
}

function ChatboxPlaceholder({ setInput }: Props) {
  const suggestions = [
    {
      title: "Create a content calender",
      subtitle: "for a tiktok account",
      prompt: "I want to create a content calender for a tiktok account",
    },
    {
      title: "Brainstrom content ideas",
      subtitle: "for my new podcast or youtube channel",
      prompt:
        "I want to brainstorm content ideas for my new podcast or youtube channel",
    },
    {
      title: "Tell me Fun facts",
      subtitle: "about the universe",
      prompt: "Tell me fun facts about the universe",
    },
    {
      title: "Write a thank you note",
      subtitle: "to a good friend",
      prompt: "Write a thank you note to a good friend",
    },
    {
      title: "Suggest some names",
      subtitle: "for cafe bar restaurant",
      prompt: "Suggest some names for cafe bar restaurant",
    },
    {
      title: "Come up with concepts",
      subtitle: "for a new product",
      prompt: "Come up with concepts for a new product",
    },
    {
      title: "Write a short story",
      subtitle: "about a dog and a cat",
      prompt: "Write a short story about a dog and a cat",
    },

    {
      title: "Show me code snippets",
      subtitle: "for a react app",
      prompt: "Show me code snippets for a react app",
    },
    {
      title: "Give me ideas ",
      subtitle: "for a new business, startup or app",
      prompt: "Give me ideas for a new business, startup or app",
    },
  ];

  const fourRandomSuggestions = useMemo(() => {
    const shuffledSuggestions = suggestions.sort(() => 0.5 - Math.random());
    return shuffledSuggestions.slice(0, 4);
  }, [suggestions]);

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center">
        <LogoIcon className=" scale-150 mb-5" />
        <h1 className="text-xl font-semibold text-white mb-5">
          How can I help you?
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {fourRandomSuggestions.map((suggestion, index) => (
          <div
            key={suggestion.prompt}
            className={`bg-slate-800 rounded-xl p-4  col-span-2 md:col-span-1`}
          >
            <h1 className="text-base md:text-lg">{suggestion.title}</h1>
            <p className="font-light text-gray-400 text-sm md:text-base">
              {suggestion.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatboxPlaceholder;
