"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import ChatboxPlaceholder from "./ChatboxPlaceholder";
import ChatBoxInput from "../inputs/ChatBoxInput";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { nanoid } from "nanoid";
import useStore from "@/store/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import Message from "../Message";

interface Base64Image {
  inlineData: { data: string; mimeType: string };
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

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
  const genAI = useMemo(() => {
    return new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
    );
  }, []);

  //INITIALIZE MODEL
  const model = useMemo(() => {
    const model = images.length > 0 ? "gemini-pro-vision" : "gemini-pro";
    return genAI.getGenerativeModel({
      model,
      safetySettings: safetySettings,
    });
  }, [images, genAI]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(event.target.value);
    },
    []
  );

  const resetState = () => {
    setImages([]);
    setInput("");
  };

  const handleChatId = useCallback(() => {
    if (!chatId) {
      const id = nanoid();
      createChat({ id, title: "", messages: [] });
      router.push(`/?chatId=${id}`);
      return id;
    } else {
      return chatId;
    }
  }, [chatId, createChat, router]);

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [messages]);

  const memoizedChats = useMemo(() => chats, [chats]);

  useEffect(() => {
    if (!chatId) return;
    const chatExists = memoizedChats?.some((chat) => chat.id === chatId);
    if (chatExists) {
      return;
    }
    router.push(`/`);
  }, [memoizedChats, chatId, router]);

  // Rest of your component logic...

  //INITIALIZE CHAT ON SEND
  const handleSend = useCallback(async () => {
    if (!input) return;
    const messageId = nanoid();
    const chatId = handleChatId();

    setInitialChatMessage(
      chatId,
      [
        { id: nanoid(), role: "user", parts: input, images },
        { id: messageId, role: "model", parts: "" },
      ],
      input
    );

    resetState();
    const processChunk = async (chunk: any, messageId: string) => {
      const chunkText = (await chunk) ? chunk.text() : "";
      setContinuedChatMessage(chatId, {
        id: messageId,
        role: "model",
        parts: chunkText,
      });
    };

    if (images.length > 0) {
      const result = await model.generateContentStream([
        { text: input },
        ...images.map((image) => ({
          inlineData: {
            data:
              image?.inlineData?.data &&
              image?.inlineData?.data?.split(",")?.[1],
            mimeType: image.inlineData.mimeType,
          },
        })),
      ]);

      for await (const chunk of result.stream) {
        await processChunk(chunk, messageId);
      }
    } else {
      const chat = model.startChat({ history: messages });
      const result = await chat.sendMessageStream(input);

      for await (const chunk of result.stream) {
        await processChunk(chunk, messageId);
      }
    }
  }, [
    input,
    images,
    messages,
    model,
    setContinuedChatMessage,
    setInitialChatMessage,
    handleChatId,
  ]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <ChatboxPlaceholder setInput={setInput} />
        ) : (
          <div
            className="w-full p-5 overflow-auto h-full"
            ref={chatContainerRef}
          >
            {messages.map((message, index) => {
              return <Message message={message} key={index} />;
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
            handleChange(event)
          }
        />
      </div>
    </div>
  );
}

export default Chatbox;
