  import React, { useEffect, useRef, useState } from "react";
  import { toast, Toaster } from "sonner";
  import axiosInstance from "../../../lib/axios";
  import { API } from "../../../config/api";
  import { Message } from "../../../types/UserType";
  import { socket } from "../../../socket/socket";

  type Props = {
    selectedChat: any,
    setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  }
  function ChatPart({ selectedChat , setSelectedChat}: Props) {
    const soundRef = useRef<HTMLAudioElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState<Message[]>([]);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    const addMessage = async () => {
      if(!message) return;

      try {
          const response = await axiosInstance.post(API.addMessage, {
              senderId: profile.id,
              receiverId: selectedChat.id,
              message
          });

          if (response.data) {
            setChats((prev) => [...prev, response.data]);
            setMessage("");
        }
    } catch(err: any) {
        toast.error(err.response?.data?.message);
    }
  };

  useEffect(() => {
    const callAsync = async() => {
        try {
            const response = await axiosInstance.get(API.getAllMessages, {
                  params: {
                  receiverId: selectedChat.id,
                },
            });

            if (response.data) {
                setChats(response.data);
            }

            } catch (err: any) {
                console.log(err.response?.data);
            }
    };
    callAsync();
  }, [])

  useEffect(() => {
    socket.on('message-added', (newMessage) => {
      soundRef?.current?.play();
      setChats((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('message-added');
    };
  });

  return (
    <>
      <section className="w-full h-full flex flex-col">
        <header
          className="py-3 px-5 border-b-1 border-gray-300 
            flex items-center justify-between relative"
        >
          <div className="flex gap-2 items-center">
            <button className='w-[38px] h-[38px] flex items-center 
                justify-center rounded-xl cursor-pointer' 
                onClick={() => setSelectedChat(null)}>
                    <img src="/icones/left.png" alt="" />
            </button>
            <div className="flex gap-3">
              <span
                className={`w-[50px] h-[50px] 
                          rounded-full flex items-center 
                          bg-[url('https://i.pinimg.com/originals/ac/14/6d/ac146dfb665377eb5cef0152a9e948a4.jpg')] 
                          bg-cover bg-center
                      `}
              />

              <span>
                <h3>{selectedChat?.username}</h3>
                <p className="text-[14px] text-gray-500">Active now</p>
              </span>
            </div>
          </div>

          <button
            className="cursor-pointer p-3 flex 
                items-center justify-center rounded-xl 
                border-1 border-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-more-horizontal text-gray-600 
                        w-5 h-5 rotate-90"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </header>
        <div
          className="w-full h-full flex 
            flex-col p-4 gap-3 overflow-y-scroll"
          style={{
            scrollbarWidth: 'none'
          }}
        >
          {chats.map((chat) => (
            <div
              className={`flex gap-2 items-center max-w-[30%] 
                    ${chat.senderId === profile.id ? "self-end flex-row-reverse" : "self-start flex-row"}`}
            >
              <span
                className={`w-[35px] h-[35px] shrink-0 
                        rounded-full flex items-center 
                        bg-[url('https://i.pinimg.com/originals/ac/14/6d/ac146dfb665377eb5cef0152a9e948a4.jpg')] 
                        bg-cover bg-center mt-auto 
                    `}
              />
              <div
                className={`px-3 py-1.5 rounded-xl 
                        ${chat.senderId === profile.id ? "bg-black self-end text-white" : 
                          "bg-blue-500 text-white self-start"}`}
              >
                {chat.message}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form
          className="w-full h-[100px] 
                border-t-1 border-gray-300 flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            addMessage()
          }}
        >
          <ul className="w-full flex gap-3 px-2">
            <li className="list-none max-md:hidden">
              <button
                className="w-[45px] h-[45px] flex 
                        items-center justify-center border-1 border-gray-300 
                        rounded-xl cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-paperclip w-5 h-5"
                  data-fg-dkix31="1.24:1.5820:/src/app/pages/Chat.tsx:131:13:4778:33:e:Paperclip::::::DrT2"
                  data-fgid-dkix31=":r3v:"
                >
                  <path d="M13.234 20.252 21 12.3"></path>
                  <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"></path>
                </svg>
              </button>
            </li>
            <li className="list-none max-md:hidden">
              <button
                className="w-[45px] h-[45px] flex 
                        items-center justify-center border-1 border-gray-300 
                        rounded-xl cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-smile w-5 h-5"
                  data-fg-dkix33="1.24:1.5820:/src/app/pages/Chat.tsx:137:13:5026:29:e:Smile::::::DQNC"
                  data-fgid-dkix33=":r41:"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" x2="9.01" y1="9" y2="9"></line>
                  <line x1="15" x2="15.01" y1="9" y2="9"></line>
                </svg>
              </button>
            </li>

            <li className="list-none w-full">
              <div
                className="flex items-center justify-center 
                            w-full h-[45px] rounded-xl bg-[#f3f3f3] 
                            border-1 border-gray-300 mr-2"
              >
                <input
                  type="text"
                  value={message}
                  placeholder="Type a message..."
                  className="w-full h-full outline-none 
                                    border-none px-3"
                  onChange={(e) => {
                    e.preventDefault();
                    setMessage(e.target.value);
                  }}
                />
              </div>
            </li>

            <li className="list-none">
              <button
                type="submit"
                className="w-[45px] h-[45px] flex 
                        items-center justify-center bg-black 
                        rounded-xl cursor-pointer"
                onSubmit={addMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-white lucide lucide-send w-4 h-4 md:w-5 md:h-5"
                  data-fg-dkix36="1.24:1.5820:/src/app/pages/Chat.tsx:152:13:5686:42:e:Send::::::dtm"
                  data-fgid-dkix36=":r44:"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                  <path d="m21.854 2.147-10.94 10.939"></path>
                </svg>
              </button>
            </li>
          </ul>
        </form>
      </section>
      <Toaster richColors/>
      <audio 
        src="/sound/message-send.mp3" 
        preload="auto" 
        ref={soundRef}/>
    </>
  );
}

export default ChatPart;
