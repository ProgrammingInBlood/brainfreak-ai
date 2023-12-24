interface IBase64Image {
  inlineData: { data: string; mimeType: string };
}

interface IMessage {
  id: string;
  role: "user" | "model";
  parts: string;
  images?: IBase64Image[];
}

interface IChat {
  id: string;
  title: string;
  messages: IMessage[];
}

interface IChatSlice {
  chats: IChat[];
  setChat: (chat: IChat) => void;
  setInitialChatMessages: (
    id: string,
    message: IMessage,
    title?: string
  ) => void;
  setChatContuinationMessage: (id: string, message: IMessage) => void;
  getChatById: (id: string) => IChat | undefined;
  removeChat: (id: string) => void;
}
