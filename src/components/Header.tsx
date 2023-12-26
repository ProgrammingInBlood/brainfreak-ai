"use client";

import { use, useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  PlusCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import useStore from "@/store/useStore";
import { nanoid } from "nanoid";
import truncateText from "@/lib/truncateText";
import DeleteIcon from "./icons/DeleteIcon";
import LogoIcon from "./icons/LogoIcon";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const chatId = useSearchParams().get("chatId") || "";

  const { chats, removeChat } = useStore((state) => ({
    chats: state.chats?.slice().reverse(),
    createChat: state.setChat,
    removeChat: state.removeChat,
  }));

  const createNewChat = useCallback(() => {
    router.push(`/`);
    setMobileMenuOpen(false);
  }, [router]);

  const handleChatClick = useCallback(
    (id: string) => {
      router.push(`/?chatId=${id}`);
      setMobileMenuOpen(false);
    },
    [router]
  );

  const handleChatRemove = useCallback(
    (id: string) => {
      router.push(`/`);
      removeChat(id);
    },
    [router, removeChat]
  );

  return (
    <header className="bg-slate-900 visible md:hidden">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 -ml-12">
            <span className="sr-only">BrainFreak</span>
            <LogoIcon className=" -ml-18 -mt-2" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 mr-2"
            onClick={createNewChat}
          >
            <span className="sr-only">Open main menu</span>
            <PlusCircleIcon
              className="h-6 w-6"
              aria-hidden="true"
              color="white"
            />
          </button>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" color="white" />
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <LogoIcon className=" -ml-6 -mt-2" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <ul className="list-none overflow-auto p-2 mt-10">
                  <li
                    className="p-2 hover:bg-blue-700 m-2 rounded-xl text-sm bg-blue-600 mb-10 py-4 flex justify-between items-center cursor-pointer"
                    onClick={createNewChat}
                  >
                    Create New Chat{" "}
                    <PlusIcon color="white" width={20} height={20} />
                  </li>
                  {chats?.map((item) => (
                    <li
                      className={`group p-2 hover:bg-slate-700 m-2 rounded-xl text-sm py-4 flex justify-between items-center cursor-pointer ${
                        item.id === chatId &&
                        " bg-white text-black hover:bg-slate-200"
                      }`}
                      onClick={() => handleChatClick(item.id)}
                      key={item.id}
                    >
                      {truncateText(item.title, 20) || "New Chat"}

                      <DeleteIcon
                        color="red"
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
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
