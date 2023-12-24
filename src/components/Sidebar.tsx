"use client";

import React from "react";
import LogoIcon from "./icons/LogoIcon";
import useStore from "@/store/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import DeleteIcon from "./icons/DeleteIcon";
import truncateText from "@/lib/truncateText";

function Sidebar() {
  const router = useRouter();
  const chatId = useSearchParams().get("chatId") || "";

  const { createChat, chats, removeChat } = useStore((state) => ({
    chats: state.chats?.slice().reverse(),
    createChat: state.setChat,
    removeChat: state.removeChat,
  }));

  const createNewChat = () => {
    const findEmptyChat = chats.find(
      (chat) => chat.messages.length === 0 && chat.title === ""
    );

    if (findEmptyChat) {
      router.push(`/?chatId=${findEmptyChat.id}`);
    } else {
      const id = nanoid();
      createChat({ id, title: "", messages: [] });
      router.push(`/?chatId=${id}`);
    }
  };

  const handleChatClick = (id: string) => {
    router.push(`/?chatId=${id}`);
  };

  const handleChatRemove = (id: string) => {
    router.push(`/`);
    removeChat(id);
  };

  return (
    <div
      className="dark flex-shrink-0 overflow-x-hidden bg-black   hidden  md:block"
      style={{
        width: "260px",
      }}
    >
      <div className="flex justify-center mt-5">
        <LogoIcon />
      </div>
      <ul className="list-none overflow-auto p-2 mt-10">
        <li
          className="p-2 hover:bg-blue-700 m-2 rounded-xl text-sm bg-blue-600 mb-10"
          onClick={createNewChat}
        >
          Create New Chat
        </li>
        {chats?.map((item) => (
          <li
            className={`group p-2 hover:bg-slate-700 m-2 rounded-xl text-sm flex justify-between items-center cursor-pointer ${
              item.id === chatId && " bg-white text-black hover:bg-slate-200"
            }`}
            onClick={() => handleChatClick(item.id)}
            key={item.id}
          >
            {truncateText(item.title, 20) || "New Chat"}

            <DeleteIcon
              color="red"
              className="hidden group-hover:block"
              width={20}
              height={20}
              onClick={(e) => {
                e.stopPropagation();
                handleChatRemove(item.id);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
