import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import axiosInstance from "../../../lib/axios";
import { API } from "../../../config/api";
import { Message, User } from "../../../types/UserType";
import { socket } from "../../../socket/socket";
import ChatMessage from "./ChatMessage";

type Props = {
  selectedChat: any;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  setAllChats: React.Dispatch<React.SetStateAction<any[]>>;
  profile: User | null;
};

function ChatPart({ selectedChat, setSelectedChat, setAllChats, profile }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [chatImage, setChatImage] = useState<File | null>(null);
  const soundReceiveRef = useRef<HTMLAudioElement>(null);
  const soundSendRef = useRef<HTMLAudioElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isTyping]);

  const addMessage = async () => {
    if (!message) return;
    try {
      const response = await axiosInstance.post(API.addMessage, {
        senderId: profile?.id,
        receiverId: selectedChat.id,
        message,
      });
      if (response.data) {
        soundSendRef?.current?.play()
        setChats((prev) => [...prev, response.data]);
        setAllChats((prev) => [...prev, response.data]);
        setMessage("");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  useEffect(() => {
    const callAsync = async () => {
      try {
        const response = await axiosInstance.get(API.getAllMessages, {
          params: { receiverId: selectedChat.id },
        });
        console.log(response.data)
        if (response.data) setChats(response.data);
      } catch (err: any) {
        console.log(err.response?.data);
      }
    };
    callAsync();
  }, [selectedChat?.id]);

  useEffect(() => {
    socket.on("message-added", (newMessage) => {
      soundReceiveRef?.current?.play();
      setChats((prev) => [...prev, newMessage]);
    });

    socket.on('typing', ({ senderId }) => {
      if (selectedChat?._id === senderId) {
        setIsTyping(true);
      }
    });

    socket.on('stop-typing', ({ senderId }) => {
      if (selectedChat?._id === senderId) {
        setIsTyping(false);
      }
    });

    return () => { 
      socket.off('typing', () => setIsTyping(false))
      socket.off("message-added");
      socket.off('stop-typing')
    };
  });

  const typing = () => {
    socket.emit("typing", {
      typerId: profile?.id,
      receiverId: selectedChat.id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        typerId: profile?.id,
        receiverId: selectedChat.id,
      });
    }, 1000);
  };

  const deleteMessageFunc = async (id: any) => {
    try {
      const res = await axiosInstance.delete(API.deleteMessage, {
        data: { messageId: id }
      });

      if (res.data) {
        const updatedChats = chats.filter((chat: any) => chat.id !== id);
        setChats(updatedChats);
      }
    } catch (err: any) {
      console.log(err?.response?.data.message);
    }
  };

  socket.on('delete-chat', (messageId: string) => {
    const updatedChats = chats.filter((chat: any) => chat.id !== messageId);
    setChats(updatedChats);
  });

  useEffect(() => {
		const callAsync = async() => {
			if(!chatImage) return;
      if(!profile) return;

			const formData = new FormData();
			formData.append('file', chatImage);
      formData.append('senderId', profile?.id);
      formData.append('receiverId', selectedChat?.id);

			try {
				const res = await axiosInstance.post(
				API.addImage,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
					},
						withCredentials: true,
					}
				);

        if(res.data) {
          setChats((prev) => [...prev, res.data]);
        }
			} catch (err) {
				console.error(err);
			}
		};
		callAsync();
	}, [chatImage]);

  return (
    <>
      <style>{`
        .cp-root {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--bg-base);
          font-family: var(--font-body);
        }

        .cp-header {
          height: 68px;
          padding: 0 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-sidebar);
          flex-shrink: 0;
        }

        .cp-header-left { display: flex; align-items: center; gap: 10px; }

        .cp-back-btn {
          width: 36px; height: 36px;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          border: 1px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.18s ease;
          color: var(--text-secondary);
          flex-shrink: 0;
        }
        .cp-back-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

        .cp-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          border: 2px solid var(--border-strong);
          flex-shrink: 0;
        }

        .cp-user-info { display: flex; flex-direction: column; gap: 1px; }

        .cp-username {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .cp-status {
          font-size: 12px;
          color: #4ade80;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .cp-status.typing {
          opacity: .5;
          animation: anim_type 2s ease infinite;
        }
        .cp-status::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          display: inline-block;
        }

        .cp-status-not-active {
          font-size: 12px;
          color: gray;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .cp-more-btn {
          width: 38px; height: 38px;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          border: 1px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.18s ease;
          color: var(--text-secondary);
        }
        .cp-more-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

        .cp-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: none;
        }
        .cp-messages::-webkit-scrollbar { display: none; }

        .cp-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 60%;
        }
        .cp-msg-row--mine    { align-self: flex-end; flex-direction: row-reverse; }
        .cp-msg-row--theirs  { align-self: flex-start; }

        .cp-msg-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background-size: cover; background-position: center;
          flex-shrink: 0;
          border: 1.5px solid var(--border-strong);
        }

        .cp-bubble {
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          max-width: 100%;
          word-break: break-word;
        }
        .cp-bubble--mine {
          background: var(--accent);
          color: #fff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 16px var(--accent-glow);
        }
        .cp-bubble--theirs {
          background: var(--bg-elevated);
          color: var(--text-primary);
          border: 1px solid var(--border-strong);
          border-bottom-left-radius: 4px;
        }

        .cp-footer {
          flex-shrink: 0;
          height: 80px;
          border-top: 1px solid var(--border);
          background: var(--bg-sidebar);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 10px;
        }

        .cp-icon-btn {
          width: 42px; height: 42px;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          border: 1px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          color: var(--text-secondary);
          transition: background 0.18s ease, color 0.18s ease;
        }
        .cp-icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

        @media (max-width: 768px) { .cp-icon-btn--desktop { display: none; } }

        .cp-input-wrap {
          flex: 1;
          height: 44px;
          background: var(--bg-input);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          padding: 0 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cp-input-wrap:focus-within {
          border-color: var(--accent-soft);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .cp-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--text-primary);
          caret-color: var(--accent);
        }
        .cp-input::placeholder { color: var(--text-muted); }

        .cp-send-btn {
          width: 44px; height: 44px;
          border-radius: var(--radius-sm);
          background: var(--accent);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          color: #fff;
          box-shadow: 0 0 16px var(--accent-glow);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .cp-send-btn:hover {
          transform: scale(1.07);
          background: #839dff;
          box-shadow: 0 0 26px rgba(108,140,255,0.38);
        }

        @keyframes anim_type {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }

        .typing {
          display: flex;
          gap: 4px;
        }

        .typing span {
          width: 6px;
          height: 6px;
          background: #999;
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }

        .cp-send-btn:active { transform: scale(0.95); }
      `}</style>

      <section 
        className="cp-root"
        onContextMenu={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}>
        <header className="cp-header">
          <div className="cp-header-left">
            <button className="cp-back-btn" onClick={() => setSelectedChat(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div 
              className="cp-avatar"
              style={{
                backgroundImage: 
                `url(${selectedChat?.profileImageUrl !== undefined ?  selectedChat?.profileImageUrl : '/icones/user-icon.jpg'})`,
              }} />

            <div className="cp-user-info">
              <span className="cp-username">{selectedChat?.username}</span>
              {
                selectedChat?.isOnline ? (
                  <span className={`cp-status ${isTyping && 'typing'}`}>
                    {
                      isTyping ? "Typing ..." : "Active now"
                    }
                  </span>
                ) : (
                  <span className="cp-status-not-active">
                    Last seen recently
                  </span>
                )
              }
            </div>
          </div>

          <button className="cp-more-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </header>

        <div className={`cp-messages px-5 py-4 max-md:px-3 relative`}>
          {chats.map((chat: any) => (
            <div
              key={chat?.id}
              className={`cp-msg-row ${
                chat?.senderId === profile?.id ? 
                "cp-msg-row--mine" :
                "cp-msg-row--theirs"}`}
            >
              <ChatMessage 
                chat={chat}
                profile={profile}
                selectedChat={selectedChat}
                deleteMessageFunc={deleteMessageFunc}/>
            </div>
          ))}
          
          {isTyping && (
            <div className="cp-msg-row cp-msg-row--theirs">
              <div
                className="cp-msg-avatar"
                style={{ backgroundImage: `url(${
                  selectedChat?.profileImageUrl ?? '/icones/user-icon.jpg'
                })` }}
              />
              <div className="cp-bubble cp-bubble--theirs">
                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <form
          className="cp-footer"
          onSubmit={(e) => { 
            e.preventDefault(); 
            addMessage();
          }}
        >
          <button 
            type="button" 
            className="cp-icon-btn"
            onClick={() => fileRef.current?.click()}
            >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.234 20.252 21 12.3" />
              <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
            </svg>
            <input 
                ref={fileRef} 
                type="file" 
                accept=".jpg,.jpeg,.png,.webp"
                style={{ display: 'none' }} 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0] && setChatImage) {
                    setChatImage(e.target.files[0]);
                  }
                }}/>
          </button>

          <button type="button" className="cp-icon-btn cp-icon-btn--desktop">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" x2="9.01" y1="9" y2="9" />
              <line x1="15" x2="15.01" y1="9" y2="9" />
            </svg>
          </button>

          <div className="cp-input-wrap">
            <input
              type="text"
              value={message}
              placeholder="Type a message…"
              className="cp-input"
              onChange={(e) => {
                setMessage(e.target.value)
                typing()
              }}
            />
          </div>

          <button type="submit" className="cp-send-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
              <path d="m21.854 2.147-10.94 10.939" />
            </svg>
          </button>
        </form>
      </section>

      <Toaster richColors />
      <audio src="/sound/message-receive.mp3" preload="auto" ref={soundReceiveRef} />
      <audio src="/sound/message-send.mp3" preload="auto" ref={soundSendRef} />
    </>
  );
}

export default ChatPart;