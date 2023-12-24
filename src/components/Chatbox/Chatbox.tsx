"use client";
import React, { useEffect, useMemo } from "react";
import ChatboxPlaceholder from "./ChatboxPlaceholder";
import ChatBoxInput from "../inputs/ChatBoxInput";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import useStore from "@/store/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import ChatFormatter from "../formatters/ChatFormatter";

interface Base64Image {
  inlineData: { data: string; mimeType: string };
}

function Chatbox() {
  const router = useRouter();
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const chatId = useSearchParams().get("chatId") || "";
  const text = useSearchParams().get("text") || "";
  const [input, setInput] = React.useState("");
  const [images, setImages] = React.useState<Base64Image[]>([]);

  //ZUSTAND STORE
  const {
    messages,
    setContinuedChatMessage,
    setInitialChatMessage,
    createChat,
    chats,
  } = useStore((state) => ({
    chats: state.chats,
    messages: state.getChatById(chatId)?.messages || [],
    setInitialChatMessage: state.setInitialChatMessages,
    setContinuedChatMessage: state.setChatContuinationMessage,
    createChat: state.setChat,
  }));

  //INITIALIZE GOOGLE AI
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
  );

  //INITIALIZE MODEL
  const model = useMemo(() => {
    const model = images.length > 0 ? "gemini-pro-vision" : "gemini-pro";
    return genAI.getGenerativeModel({ model });
  }, [images]);

  useEffect(() => {
    if (!chatId) {
      const findEmptyChat = chats.find(
        (chat) => chat.messages.length === 0 && chat.title === ""
      );

      if (findEmptyChat) {
        router.push(`/?chatId=${findEmptyChat.id}&text=${input}`);
      } else {
        const id = nanoid();
        createChat({ id, title: "", messages: [] });
        router.push(`/?chatId=${id}&text=${input}`);
      }
      return;
    }
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [messages]);

  const handleSendCheck = () => {
    if (!input) return;
    if (!chatId) {
      const findEmptyChat = chats.find(
        (chat) => chat.messages.length === 0 && chat.title === ""
      );

      if (findEmptyChat) {
        router.push(`/?chatId=${findEmptyChat.id}&text=${input}`);
      } else {
        const id = nanoid();
        createChat({ id, title: "", messages: [] });
        router.push(`/?chatId=${id}&text=${input}`);
      }
      return;
    }
    if (chatId && text) {
      router.push(`/?chatId=${chatId}`);
    }
  };

  //INITIALIZE CHAT ON SEND
  const handleSend = async () => {
    handleSendCheck();
    const messageId = nanoid();
    setInitialChatMessage(
      chatId,
      { id: nanoid(), role: "user", parts: input, images },
      input
    );
    setInitialChatMessage(chatId, { id: messageId, role: "model", parts: "" });

    setImages([]);
    setInput("");
    if (images.length > 0) {
      const result = await model.generateContentStream([
        { text: input },
        ...images.map((image) => ({
          inlineData: {
            data: image.inlineData.data.split(",")[1],
            mimeType: image.inlineData.mimeType,
          },
        })),
      ]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setContinuedChatMessage(chatId, {
          id: messageId,
          role: "model",
          parts: chunkText,
        });
      }
    } else {
      const chat = model.startChat({
        history: messages,
      });
      const result = await chat.sendMessageStream(input);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setContinuedChatMessage(chatId, {
          id: messageId,
          role: "model",
          parts: chunkText,
        });
      }
    }

    if (text) {
      router.push(`/?chatId=${chatId}`);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <ChatboxPlaceholder setInput={setInput} />
        ) : (
          <div
            className="w-full p-5 overflow-auto h-full"
            ref={chatContainerRef}
          >
            {messages.map((message, index) => {
              if (message.role === "user") {
                return (
                  <div
                    className="flex justify-end items-center mt-4 "
                    key={index}
                  >
                    <div className=" rounded-xl p-4 bg-blue-500 max-w-[100%] text-sm md:text-xl">
                      {message?.images?.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image.inlineData.data}
                            alt={`upload-${index}-${message.id}`}
                            className="object-cover w-full h-full max-w-52 rounded-xl  mb-4"
                          />
                        </div>
                      ))}

                      {message.parts}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className="flex justify-start items-center mt-4"
                    key={index}
                  >
                    <div className="bg-slate-800 rounded-xl p-4 max-w-[100%]">
                      <ChatFormatter text={message.parts} />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
      <div className="w-full pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]">
        <ChatBoxInput
          images={images}
          setImages={setImages}
          onSend={handleSend}
          value={input}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(event.target.value)
          }
        />
      </div>
    </div>
  );
}

export default Chatbox;
