import React, { useRef } from "react";
import SendIcon from "../icons/SendIcon";
import ImageIcon from "../icons/ImageIcon";
import imageCompression from "browser-image-compression";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Base64Image {
  inlineData: { data: string; mimeType: string };
}

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
  images: Base64Image[];
  onSend: () => void;
  setImages: React.Dispatch<React.SetStateAction<Base64Image[]>>;
}

function ChatBoxInput({ onSend, setImages, images, ...props }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend();
  };

  const handleButtonClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const convertToBase64 = async (file: File): Promise<Base64Image> => {
    const base64EncodedDataPromise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: (await base64EncodedDataPromise) as string,
        mimeType: file.type,
      },
    };
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 512,
        });
        const base64String = await convertToBase64(compressedFile);
        setImages((prev) => [...prev, base64String]);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className="w-full pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]">
      <div className="flex gap-2">
        {images?.map((image, index) => (
          <div className="flex justify-end items-center mt-4 " key={index}>
            <div className=" rounded-xl p-4  max-w-[100%] text-sm md:text-xl relative">
              <img
                src={image.inlineData.data}
                alt={`upload-${index}`}
                className="object-cover w-20 h-20"
              />
              <span
                className="absolute top-0 right-0 w-6 h-6 bg-gray-700 rounded-full flex justify-center items-center"
                onClick={() => removeImage(index)}
              >
                <XMarkIcon className="absolute top-0 right-0 w-6 h-6" />
              </span>
            </div>
          </div>
        ))}
      </div>
      <form
        className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
        onSubmit={handleSubmit}
      >
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="flex w-full items-center">
            <div className="flex items-center justify-between bg-slate-600 rounded-xl w-full">
              <textarea
                placeholder="Message Brainfreak..."
                className="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4 outline-none "
                style={{
                  maxHeight: "200px",
                  height: "52px",
                  overflowY: "hidden",
                }}
                {...props}
              ></textarea>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="hover:bg-transparent right-2  bg-gray-700  opacity-95 rounded-lg"
                >
                  <span>
                    <SendIcon
                      className="text-white"
                      width={30}
                      height={30}
                      color="white"
                    />
                  </span>
                </button>

                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple // Allow multiple file selection
                  accept=".jpg, .jpeg, .png, .gif"
                  ref={fileInputRef}
                />

                <button
                  type="button"
                  className=" hover:bg-transparent right-2  bg-gray-700  opacity-95 rounded-lg mr-2"
                  onClick={handleButtonClick}
                >
                  <span>
                    <ImageIcon
                      className="text-white"
                      width={30}
                      height={30}
                      color="white"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatBoxInput;
