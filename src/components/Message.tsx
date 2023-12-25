import React from "react";
import ChatFormatter from "./formatters/ChatFormatter";

interface Props {
  message: IMessage;
}

function Message({ message }: Props) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end items-center mt-4">
        <div className=" rounded-xl p-4 bg-blue-500 max-w-[100%] text-sm md:text-base">
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
      <div className="flex justify-start items-center mt-4">
        <div className="bg-slate-800 rounded-xl p-4 max-w-[100%]">
          <ChatFormatter text={message.parts} />
        </div>
      </div>
    );
  }
}

export default Message;
