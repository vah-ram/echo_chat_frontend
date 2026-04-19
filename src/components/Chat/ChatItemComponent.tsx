import React, { useEffect, useState } from 'react'
import { Message, User } from '../../types/UserType'
import axiosInstance from '../../lib/axios';
import { API } from '../../config/api';
import { toast, Toaster } from 'sonner';
import { socket } from '../../socket/socket';

type Props = {
  user?: User;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  allChats?: Message[];
};

function ChatItemComponent({ user, setSelectedChat, allChats }: Props) {
  const [unreadChats, setUnreadChats] = useState<number | undefined>();
  const [lastChat, setLastChat] = useState<string>('');
  const [lastChatFrom, setLastChatFrom] = useState<string>('');

  useEffect(() => {
    const callAsync = async () => {
      try {
        const response = await axiosInstance.get(API.getAllMessages, {
          params: { receiverId: user?.id },
        });
        if (response.data && response.data.length > 0) {
          setLastChat(response.data[response.data.length - 1].message);
          setLastChatFrom(
            response.data[response.data.length - 1].senderId === user?.id
              ? user?.username || ""
              : "Ես"
          );
        }
      } catch (err: any) {
        console.log(err.response?.data);
      }
    };
    callAsync();
  }, [user?.id, unreadChats, allChats]);

  useEffect(() => {
    const callAsyncMessages = async() => {
      try {
        const response = await axiosInstance.get(API.getAllMessages, {
          params: { receiverId: user?.id },
        });

        if(response.data) {
          const unreadCount = response.data.filter((message: Message) => 
            message.senderId === user?.id && !message.isRead
          ).length;

          setUnreadChats(unreadCount);
        }
      } catch (error: any) {
        toast.error(error.response?.data.message)
      };
    };
    callAsyncMessages();
  }, [user?.id]);

  useEffect(() => {
    if(!user?.id) return;

    const handler = (newMessage: Message) => {
      if (
        newMessage.senderId === user?.id &&
        !newMessage.isRead
      ) {
        setUnreadChats((prev) => (prev ?? 0) + 1);
      }
    };

    socket.on("message-added", handler);

    return () => {
      socket.off("message-added", handler);
    };
  });

  const readMessages = async() => {
    const response = await axiosInstance.post(API.readMessagesUrl, {
      receiverId: user?.id,
    });

    if(response.data) {
      setUnreadChats(0)
    }
  }

  return (
    <>
      <style>{`
        .ci-row {
          width: 100%;
          border-radius: var(--radius-md);
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.18s ease;
          position: relative;
        }
        .ci-row:hover { background: var(--bg-hover); }
        .ci-row:active { background: var(--bg-elevated); }

        .ci-avatar-wrap { position: relative; flex-shrink: 0; }

        .ci-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          border: 2px solid var(--border-strong);
        }

        .ci-dot {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 11px; height: 11px;
          border-radius: 50%;
          background: #4ade80;
          border: 2px solid var(--bg-sidebar);
          box-shadow: 0 0 6px #4ade80;
        }

        .ci-info { flex: 1; min-width: 0; }

        .ci-name {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .ci-sub {
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
          font-weight: 400;
        }
      `}</style>

      <div 
        className="ci-row" 
        onClick={() => {
          setSelectedChat(user)
          readMessages()
        }}>
        <div className="ci-avatar-wrap">
          <div 
            className="ci-avatar"
            style={{
              backgroundImage: 
              `url(${user?.profileImageUrl !== undefined ?  user?.profileImageUrl : '/icones/user-icon.jpg'})`,
            }} />
          {
            user?.isOnline ? (
              <span className="ci-dot" />
            ) : null
          }
        </div>

        <div className="ci-info">
          <p className="ci-name">{user?.username}</p>
          <p className="ci-sub">
            {lastChatFrom ? `${lastChatFrom}: ` : ''}{lastChat ? lastChat : ""}
          </p>
        </div>
        
        {
          unreadChats !== 0 && (
            <span className={`w-[20px] h-[20px] 
            rounded-full bg-white flex items-center justify-center 
            text-black 
            ${unreadChats! > 9 ? 'text-[12px]' : 'text-[14px]'
            } 
            font-[700]`}>
              {
                unreadChats! > 99 ? '99+' : unreadChats
              }
            </span>
          )
        }
      </div>
      <Toaster richColors/>
    </>
  );
}

export default ChatItemComponent;