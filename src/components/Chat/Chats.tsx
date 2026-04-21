import { useEffect, useState } from 'react'
import ChatItemComponent from './ChatItemComponent';
import SearchUserComponent from './SearchUserComponent'
import { Message, User } from '../../types/UserType';
import ChatPart from './ChatPart/ChatPart';
import { API } from '../../config/api';
import axiosInstance from '../../lib/axios';
import { socket } from '../../socket/socket';

type OnlinePayload = {
  userId: string;
};

function Chats({
  setIsSelectedChat,
  profile
}: {
  setIsSelectedChat: (chat: User | null) => void;
  profile: User | null;
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [allChats, setAllChats] = useState<Message[]>([]);

  useEffect(() => {
    const callSync = async () => {
      const response = await axiosInstance.get(API.getContacts);
      if (response) setContacts(response.data);
    };
    callSync();
  }, []);

  useEffect(() => {
    setIsSelectedChat(selectedChat);
  }, [selectedChat, setIsSelectedChat]);

  useEffect(() => {
    const handleOnline = ({ userId }: OnlinePayload) => {
      setContacts(prev => prev.map(c => c.id === userId ? { ...c, isOnline: true } : c));
    };
    const handleOffline = ({ userId }: OnlinePayload) => {
      setContacts(prev => prev.map(c => c.id === userId ? { ...c, isOnline: false } : c));
    };

    socket.on('user-online', handleOnline);
    socket.on('user-offline', handleOffline);

    return () => {
      socket.off('user-online', handleOnline);
      socket.off('user-offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    socket.on('contact-added', (contact) => {
      setContacts(prev => [...prev, contact]);
    });
    return () => { socket.off('contact-added'); };
  }, []);

  return (
    <section className="w-full h-full flex bg-gray-50 overflow-hidden font-sans text-gray-800">

      {/* ── Sidebar ───────────────────────────────────────────────
          Desktop : fixed 300/340 px, always visible
          Mobile  : w-full, shown only when NO chat is selected     */}
      <div
        className={[
          'h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300',
          isSearching ? 'md:w-[340px]' : 'md:w-[300px]',
          selectedChat
            ? 'hidden md:flex'    
            : 'flex w-full md:w-auto', 
        ].join(' ')}
      >
        {isSearching ? (
          <SearchUserComponent
            setIsSearching={setIsSearching}
            setSelectedChat={setSelectedChat}
          />
        ) : (
          <>
            <div className="px-5 pt-6 pb-4 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 tracking-[1px]">
                  Ecнo
                </h1>
              </div>

              <div
                className="flex items-center gap-2.5 bg-gray-100 border border-gray-200 rounded-xl px-3.5 h-11 cursor-text transition hover:border-indigo-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"
                onClick={() => setIsSearching(true)}
              >
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations…"
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 cursor-text"
                  readOnly
                />
              </div>
            </div>

            <div className="h-px bg-gray-100 flex-shrink-0" />

            <div className="flex-1 overflow-y-auto px-2.5 py-1.5 pb-24 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {contacts?.map((contact: any) => (
                <ChatItemComponent
                  key={contact.id}
                  user={contact}
                  setSelectedChat={setSelectedChat}
                  allChats={allChats}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Main chat area ─────────────────────────────────────────
          Desktop : flex-1, always shown
          Mobile  : w-full, shown only when a chat IS selected       */}
      <div
        className={[
          'h-full flex flex-col bg-gray-50 relative overflow-hidden',
          selectedChat
            ? 'flex w-full md:flex-1'                          // chat open  → full width on mobile
            : 'hidden md:flex md:flex-1 items-center justify-center', // no chat → hidden on mobile
        ].join(' ')}
        style={selectedChat ? { alignItems: 'stretch', justifyContent: 'flex-start' } : {}}
      >
        {!selectedChat && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        )}

        {selectedChat ? (
          <ChatPart
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            setAllChats={setAllChats}
            profile={profile}
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-md">
              <svg className="w-9 h-9 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-800 mt-1">Select a conversation</p>
            <p className="text-sm text-gray-400 font-normal">Choose a chat from the list to start messaging</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Chats;