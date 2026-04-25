import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import axiosInstance from "../../../lib/axios";
import { API } from "../../../config/api";
import { Message, User } from "../../../types/UserType";
import { socket } from "../../../socket/socket";
import ChatMessage from "./ChatMessage";
import UserInfoHeader from "./UserInfoHeader";
import { Capacitor } from "@capacitor/core";
import { VoiceRecorder } from "capacitor-voice-recorder";
import Voice_effect from "./voice/Voice_effect";

type Props = {
  selectedChat: any;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  setAllChats: React.Dispatch<React.SetStateAction<any[]>>;
  profile: User | null;
};

function ChatPart({ selectedChat, setSelectedChat, setAllChats, profile }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [chatImage, setChatImage] = useState<File | null>(null);
  const soundReceiveRef = useRef<HTMLAudioElement>(null);
  const soundSendRef = useRef<HTMLAudioElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const [headerBarActive, setHeaderBarActive] = useState<boolean>(false);
  const [viewingImg, setViewingImg] = useState<string | undefined>('');

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  };

  const handleVoice = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        if (!isRecording) {
          const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();

          if (!hasPermission.value) {
            const permission = await VoiceRecorder.requestAudioRecordingPermission();

            if (!permission.value) {
              return;
            }
          }

          await VoiceRecorder.startRecording();
          setIsRecording(true);
        } else {
          const result = await VoiceRecorder.stopRecording();
          setIsRecording(false);

          if (result.value && result.value.recordDataBase64) {
            const base64 = result.value.recordDataBase64;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length)
              .fill(0)
              .map((_, i) => byteCharacters.charCodeAt(i));

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "audio/aac" });

            setAudioBlob(blob);
          } else {
            console.log("Recording failed")
          }
        }
      } catch (err) {
        console.error("VoiceRecorder error:", err);
        setIsRecording(false);
      }

      return;
    }

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        streamRef.current = stream;
        chunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          chunksRef.current = [];
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const sendAudio = async () => {
      try {
        if (!audioBlob) return;
        if (!profile) return;
        if (!selectedChat) return;

        const formData = new FormData();
        const file = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: audioBlob.type || "audio/webm",
        });

        formData.append("file", file);
        formData.append("senderId", profile?.id);
        formData.append("receiverId", selectedChat?.id);

        const response = await axiosInstance.post(API.addVoice, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (response.data) {
          setChats((prev) => [...prev, response.data]);
          soundSendRef?.current?.play();
        }

        setAudioBlob(null);
        cleanupStream();
      } catch (err: any) {
        console.error("Error sending audio:", err);
        setAudioBlob(null);
      }
    };

    sendAudio();
  }, [audioBlob, profile, selectedChat]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
      setHeaderBarActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    scrollToBottom();
  }, [isTyping]);

  const addMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axiosInstance.post(API.addMessage, {
        senderId: profile?.id,
        receiverId: selectedChat.id,
        message,
      });
      if (response.data) {
        soundSendRef?.current?.play();
        setChats((prev) => [...prev, response.data]);
        setAllChats((prev) => [...prev, response.data]);
        setMessage("");
      }
    } catch (err: any) {
      console.error(err.response?.data?.message)
    }
  };

  useEffect(() => {
    const callAsync = async () => {
      try {
        const response = await axiosInstance.get(API.getAllMessages, {
          params: { receiverId: selectedChat.id },
        });

        if (response.data) {
          setChats(response.data);
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
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

    socket.on("typing", ({ senderId }) => {
      if (selectedChat?._id === senderId) {
        setIsTyping(true);
      }
    });

    socket.on("stop-typing", ({ senderId }) => {
      if (selectedChat?._id === senderId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("message-added");
      socket.off("stop-typing");
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
        data: { messageId: id },
      });

      if (res.data) {
        const updatedChats = chats.filter((chat: any) => chat.id !== id);
        setChats(updatedChats);
      }
    } catch (err: any) {
      console.log(err?.response?.data.message);
    }
  };

  socket.on("delete-chat", (messageId: string) => {
    const updatedChats = chats.filter((chat: any) => chat.id !== messageId);
    setChats(updatedChats);
  });

  useEffect(() => {
    const callAsync = async () => {
      if (!chatImage) return;
      if (!profile) return;
      if (!selectedChat) return;

      const formData = new FormData();
      formData.append("file", chatImage);
      formData.append("senderId", profile?.id);
      formData.append("receiverId", selectedChat?.id);

      try {
        const res = await axiosInstance.post(API.addImage, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (res.data) {
          setChats((prev) => [...prev, res.data]);
          soundSendRef?.current?.play();
        }

        setChatImage(null);
      } catch (err) {
        console.error(err);
      }
    };
    callAsync();
  }, [chatImage, profile, selectedChat]);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .cp-root {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #1a1a1a;
        }

        .cp-header {
          height: 70px;
          padding: 0 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          flex-shrink: 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .cp-header:hover {
          background: #fafafa;
        }

        .cp-header-left { 
          display: flex; 
          align-items: center; 
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .cp-back-btn {
          width: 40px; 
          height: 40px;
          border-radius: 10px;
          background: #f3f4f6;
          border: none;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
          flex-shrink: 0;
          padding: 0;
        }

        .cp-back-btn:hover { 
          background: #e5e7eb;
          color: #1a1a1a;
          transform: translateX(-2px);
        }

        .cp-back-btn:active {
          transform: scale(0.95);
        }

        .cp-avatar {
          width: 48px; 
          height: 48px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          border: 2px solid #e5e7eb;
          flex-shrink: 0;
          object-fit: cover;
          transition: all 0.2s ease;
        }

        .cp-avatar:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .cp-user-info { 
          display: flex; 
          flex-direction: column; 
          gap: 2px;
          min-width: 0;
          flex: 1;
        }

        .cp-username {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cp-status {
          font-size: 13px;
          color: #10b981;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cp-status.typing {
          opacity: 0.8;
          animation: anim_type 2s ease infinite;
        }

        .cp-status::before {
          content: '';
          width: 7px; 
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          display: inline-block;
        }

        .cp-status-not-active {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cp-status-not-active::before {
          content: '';
          width: 7px; 
          height: 7px;
          border-radius: 50%;
          background: #d1d5db;
          display: inline-block;
        }

        .cp-more-btn {
          width: 40px; 
          height: 40px;
          border-radius: 10px;
          background: #f3f4f6;
          border: none;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
          flex-shrink: 0;
          padding: 0;
        }

        .cp-more-btn:hover { 
          background: #e5e7eb;
          color: #1a1a1a;
        }

        .cp-more-btn:active {
          transform: scale(0.95);
        }

        .cp-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px 24px;
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #ffffff;
        }

        .cp-messages::-webkit-scrollbar {
          width: 8px;
        }

        .cp-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .cp-messages::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .cp-messages::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .cp-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 65%;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cp-msg-row--mine { 
          align-self: flex-end; 
          flex-direction: row-reverse;
          max-width: 70%;
        }

        .cp-msg-row--theirs { 
          align-self: flex-start;
          max-width: 65%;
        }

        .cp-msg-avatar {
          width: 32px; 
          height: 32px;
          border-radius: 50%;
          background-size: cover; 
          background-position: center;
          flex-shrink: 0;
          border: 2px solid #e5e7eb;
        }

        .cp-bubble {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          max-width: 100%;
          word-break: break-word;
          transition: all 0.2s ease;
        }

        .cp-bubble-file {
          padding: 0;
          overflow: hidden;
        }

        .cp-bubble--mine {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
          border-bottom-right-radius: 2.5px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .cp-bubble--mine:hover {
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
          transform: translateY(-1px);
        }

        .cp-bubble--theirs {
          background: #f3f4f6;
          color: #1a1a1a;
          border-bottom-left-radius: 2.5px;
          border: 1px solid #e5e7eb;
        }

        .cp-bubble--theirs:hover {
          background: #eeeff2;
          border-color: #d1d5db;
        }

        .cp-footer {
          flex-shrink: 0;
          height: auto;
          min-height: 90px;
          border-top: 1px solid #e5e7eb;
          background: #ffffff;
          display: flex;
          align-items: center;
          padding: 16px 24px;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .cp-icon-btn {
          width: 40px; 
          height: 40px;
          border-radius: 10px;
          background: #f3f4f6;
          border: none;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          color: #6b7280;
          transition: all 0.2s ease;
          padding: 0;
          position: relative;
        }

        .cp-icon-btn:hover { 
          background: #e5e7eb;
          color: #1a1a1a;
          transform: scale(1.05);
        }

        .cp-icon-btn:active {
          transform: scale(0.95);
        }

        .cp-icon-btn.recording {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          animation: pulse-recording 1.5s infinite;
        }

        @keyframes pulse-recording {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 4px 20px rgba(239, 68, 68, 0.5);
          }
        }

        @media (max-width: 768px) { 
          .cp-icon-btn--desktop { 
            display: none; 
          }
        }

        .cp-input-wrap {
          flex: 1;
          min-height: 44px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 5px;
          transition: all 0.2s ease;
        }

        .cp-input-wrap:focus-within {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .cp-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          color: #1a1a1a;
          caret-color: #3b82f6;
          resize: none;
          max-height: 100px;
          padding: 8px 0;
        }

        .cp-input::placeholder { 
          color: #9ca3af;
        }

        .cp-send-btn {
          width: 44px; 
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
          padding: 0;
        }

        .cp-send-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .cp-send-btn:active { 
          transform: scale(0.95);
        }

        .cp-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes anim_type {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }

        .typing {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing span {
          width: 6px;
          height: 6px;
          background: #9ca3af;
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes shadow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .shadow {
          animation: shadow 0.3s ease-out;
        }  

        @keyframes bounce {
          0%, 60%, 100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }

        @media (max-width: 768px) {
          .cp-input-wrap {
            border-radius: 24px;
            padding: 0 2px 0 15px;
          }

          .cp-send-btn {
            display: none;
          }

          .cp-icon-btn {
            display: none;
          }

          .cp-header {
            height: 64px;
            padding: 0 16px;
          }

          .cp-msg-avatar {
            display: none;
          }

          .cp-footer {
            padding: 12px 16px;
            min-height: 80px;
          }

          .cp-messages {
            padding: 16px;
            gap: 8px;
          }

          .cp-msg-row {
            max-width: 85%;
          }

          .cp-msg-row--mine {
            max-width: 85%;
          }

          .cp-avatar {
            width: 40px;
            height: 40px;
          }

          .cp-username {
            font-size: 14px;
          }
        }
      `}</style>

      {viewingImg && (
        <div
          onClick={() => setViewingImg(undefined)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fadeIn"
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <a
              href={viewingImg}
              download="image.jpg"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-white/90 hover:bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium shadow transition active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
              Save
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewingImg(undefined);
              }}
              className="bg-white/90 hover:bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium shadow transition active:scale-95"
            >
              ✕
            </button>
          </div>

          <img
            src={viewingImg}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
          />

          <div className="absolute bottom-4 text-white/60 text-xs text-center">
            Long press to save on mobile
          </div>
        </div>
      )}

      <section
        className="cp-root"
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {headerBarActive && isMobile ? (
          <UserInfoHeader
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            headerRef={headerRef}
          />
        ) : (
          <header className="cp-header" onClick={() => setHeaderBarActive(true)}>
            <div className="cp-header-left">
              <button
                className="cp-back-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedChat(null);
                }}
                title="Go back"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div
                className="cp-avatar"
                style={{
                  backgroundImage: `url(${
                    selectedChat?.profileImageUrl !== undefined
                      ? selectedChat?.profileImageUrl
                      : "/icones/user-icon.jpg"
                  })`,
                }}
              />

              <div className="cp-user-info">
                <span className="cp-username">{selectedChat?.username}</span>
                {selectedChat?.isOnline ? (
                  <span className={`cp-status ${isTyping && "typing"}`}>
                    {isTyping ? "Typing..." : "Active now"}
                  </span>
                ) : (
                  <span className="cp-status-not-active">Last seen recently</span>
                )}
              </div>
            </div>

            <button className="cp-more-btn" title="More options">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </header>
        )}

        <div className="cp-messages">
          {chats.map((chat: any) => (
            <div
              key={chat?.id}
              className={`cp-msg-row ${
                chat?.senderId === profile?.id
                  ? "cp-msg-row--mine"
                  : "cp-msg-row--theirs"
              }`}
            >
              <ChatMessage
                chat={chat}
                profile={profile}
                selectedChat={selectedChat}
                deleteMessageFunc={deleteMessageFunc}
                setViewingImg={setViewingImg}
              />
            </div>
          ))}

          {isTyping && (
            <div className="cp-msg-row cp-msg-row--theirs">
              <div
                className="cp-msg-avatar"
                style={{
                  backgroundImage: `url(${
                    selectedChat?.profileImageUrl ?? "/icones/user-icon.jpg"
                  })`,
                }}
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
          <div ref={bottomRef} />
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
            title="Attach image"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.234 20.252 21 12.3" />
              <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
            </svg>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setChatImage(e.target.files[0]);
                }
              }}
            />
          </button>

          <button
            type="button"
            className={`cp-icon-btn ${isRecording ? "recording" : ""}`}
            title={isRecording ? "Stop recording" : "Record voice"}
            onClick={handleVoice}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          </button>

          <div className="cp-input-wrap">
            <input
              type="text"
              value={message}
              placeholder="Type a message…"
              className="cp-input"
              onChange={(e) => {
                setMessage(e.target.value);
                typing();
              }}
            />

            <button
              type="submit"
              className={`hidden max-md:flex ${!message ? "max-md:hidden" : ""} 
              p-2.5 rounded-[50%] 
              items-center justify-center bg-blue-500`}
              disabled={!message.trim()}
              title="Send message"
            >
              <svg
                width="19"
                height="19"
                className="text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                <path d="m21.854 2.147-10.94 10.939" />
              </svg>
            </button>

            <button
              type="button"
              className={`p-2.5 rounded-[50%] hidden max-md:flex  
              items-center justify-center ${message ? "max-md:hidden" : ""}`}
              onClick={() => fileRef.current?.click()}
              title="Attach image"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13.234 20.252 21 12.3" />
                <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
              </svg>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setChatImage(e.target.files[0]);
                  }
                }}
              />
            </button>

            <button
              type="button"
              className={`p-2.5 rounded-[50%] hidden 
              items-center justify-center max-md:flex 
              ${message ? "max-md:hidden" : ""} ${isRecording ? "bg-blue-500" : ""}`}
              title={isRecording ? "Stop recording" : "Record voice"}
              onClick={handleVoice} 
            >
              {
                isRecording ? 
                (
                  <div className="w-[20px] h-[20px] flex 
                  items-center justify-center">
                    <Voice_effect />
                  </div>
                ) : 
                (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                )
              }
            </button>
          </div>

          <button
            type="submit"
            className="cp-send-btn"
            disabled={!message.trim()}
            title="Send message"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
              <path d="m21.854 2.147-10.94 10.939" />
            </svg>
          </button>
        </form>
      </section>

      {headerBarActive && isMobile ? (
        <div className="w-full h-full bg-[#0019] absolute top-0 left-0 
        shadow"/>
        ) : <></>
      }

      <Toaster richColors />
      <audio src="/sound/message-receive.mp3" preload="auto" ref={soundReceiveRef} />
      <audio src="/sound/message-send.mp3" preload="auto" ref={soundSendRef} />
    </>
  );
}

export default ChatPart;