import { StateCreator } from "zustand";

const createChatSlice: StateCreator<IChatSlice> = (set, get) => ({
  chats: [],
  setChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  setInitialChatMessages: (id, messages, title) =>
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            title: title || chat.title,
            messages: [...chat.messages, ...messages],
          };
        } else {
          return chat;
        }
      }),
    })),

  setChatContuinationMessage: (id, message) =>
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            messages: chat.messages.map((m) => {
              if (message.id === m.id) {
                return {
                  ...message,
                  parts: m.parts + message.parts,
                };
              } else {
                return m;
              }
            }),
          };
        } else {
          return chat;
        }
      }),
    })),
  getChatById: (id) => {
    const chats = get().chats;
    return chats.find((chat) => chat.id === id);
  },

  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
    })),
});

export default createChatSlice;
