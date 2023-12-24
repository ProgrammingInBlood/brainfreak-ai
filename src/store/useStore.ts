import { create } from "zustand";
import createChatSlice from "./slices/chat";
import { persist } from "zustand/middleware";

//add persist middleware
const useStore = create(
  persist(createChatSlice, {
    name: "chat-storage",
  })
);

export default useStore;
