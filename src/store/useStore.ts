import { create } from "zustand";
import createChatSlice from "./slices/chat";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import localforage from "localforage";

const localforageInstance = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: "chat-storage",
  storeName: "chat-storage",
  version: 1,
  size: 4980736,
});

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return await localforageInstance.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await localforageInstance.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await localforageInstance.removeItem(name);
  },
};

const useStore = create(
  persist(createChatSlice, {
    name: "chat-storage",
    storage: createJSONStorage(() => storage),
  })
);

export default useStore;
