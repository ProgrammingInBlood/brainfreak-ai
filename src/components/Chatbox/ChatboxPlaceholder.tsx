import React from "react";
import LogoIcon from "../icons/LogoIcon";

interface Props {
  setInput: (value: string) => void;
}

function ChatboxPlaceholder({ setInput }: Props) {
  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center">
        <LogoIcon className=" scale-150 mb-5" />
        <h1 className="text-xl font-semibold text-white mb-5">
          How can I help you?
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        <div
          className="bg-slate-800 rounded-xl p-4"
          onClick={() =>
            setInput("I want to create a content calender for a tiktok account")
          }
        >
          <h1>Create a content calender</h1>
          <p className=" font-light text-gray-400 font-sm">
            for a tiktok account
          </p>
        </div>
        <div
          className="bg-slate-800 rounded-xl p-4"
          onClick={() =>
            setInput(
              "I want to brainstorm content ideas for my new podcast or youtube channel"
            )
          }
        >
          <h1>Brainstrom content ideas</h1>
          <p className=" font-light text-gray-400 font-sm">
            for my new podcast or youtube channel
          </p>
        </div>
        <div
          className="bg-slate-800 rounded-xl p-4"
          onClick={() => setInput("Tell me fun facts about the universe")}
        >
          <h1>Tell me Fun facts </h1>
          <p className=" font-light text-gray-400 font-sm">
            about the universe
          </p>
        </div>
        <div
          className="bg-slate-800 rounded-xl p-4"
          onClick={() => setInput(" Write a thank you note to a good friend")}
        >
          <h1>Write a thank you note</h1>
          <p className=" font-light text-gray-400 font-sm">to a good friend</p>
        </div>
      </div>
    </div>
  );
}

export default ChatboxPlaceholder;
