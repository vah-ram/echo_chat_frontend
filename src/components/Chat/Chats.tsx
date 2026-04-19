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

      if (response) {
        setContacts(response.data);
      }
    };

    callSync();
  }, []);

  useEffect(() => {
    setIsSelectedChat(selectedChat);
  }, [selectedChat, setIsSelectedChat]);

  useEffect(() => {
    const handleOnline = ({ userId }: OnlinePayload) => {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === userId ? { ...c, isOnline: true } : c
        )
      );
    };

    const handleOffline = ({ userId }: OnlinePayload) => {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === userId ? { ...c, isOnline: false } : c
        )
      );
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

    return () => {
      socket.off('contact-added');
    };
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --bg-base:        #0d0f14;
          --bg-sidebar:     #13151c;
          --bg-elevated:    #1c1f2b;
          --bg-hover:       #22263a;
          --bg-input:       #1a1d28;
          --accent:         #6c8cff;
          --accent-soft:    #3a4d99;
          --accent-glow:    rgba(108,140,255,0.18);
          --text-primary:   #eef0f8;
          --text-secondary: #8a90b0;
          --text-muted:     #454a6a;
          --border:         rgba(255,255,255,0.06);
          --border-strong:  rgba(255,255,255,0.11);
          --shadow-deep:    0 8px 32px rgba(0,0,0,0.45);
          --radius-sm:      10px;
          --radius-md:      16px;
          --radius-lg:      22px;
          --radius-pill:    999px;
          --font-display:   'Syne', sans-serif;
          --font-body:      'DM Sans', sans-serif;
        }

        /* ── Root shell ─────────────────────────────── */
        .chats-root {
          width: 100%;
          height: 100%;
          display: flex;
          background: var(--bg-base);
          font-family: var(--font-body);
          color: var(--text-primary);
          overflow: hidden;
        }

        /* ── Sidebar panel ──────────────────────────── */
        .sidebar {
          height: 100%;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width 0.28s cubic-bezier(.4,0,.2,1);
          flex-shrink: 0;
        }
        .sidebar--default  { width: 300px; }
        .sidebar--searching { width: 340px; }

        @media (max-width: 768px) {
          .sidebar--default,
          .sidebar--searching { width: 100%; }
          .sidebar--hidden   { display: none !important; }
          .chat-main--hidden { display: none !important; }
        }

        /* ── Sidebar header ─────────────────────────── */
        .sidebar-header {
          padding: 24px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sidebar-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.4px;
          margin: 0;
        }

        /* ── New-chat FAB ───────────────────────────── */
        .fab {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: var(--accent);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 18px var(--accent-glow);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          color: #fff;
          font-size: 22px;
          line-height: 1;
          padding-bottom: 2px;
          flex-shrink: 0;
        }
        .fab:hover {
          transform: scale(1.08);
          box-shadow: 0 0 28px rgba(108,140,255,0.38);
          background: #839dff;
        }
        .fab:active { transform: scale(0.96); }

        /* ── Search bar ─────────────────────────────── */
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-input);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: 0 14px;
          height: 44px;
          cursor: text;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .search-bar:hover,
        .search-bar:focus-within {
          border-color: var(--accent-soft);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
          width: 17px;
          height: 17px;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 400;
          color: var(--text-primary);
          caret-color: var(--accent);
        }
        .search-input::placeholder { color: var(--text-muted); }

        /* ── Divider ────────────────────────────────── */
        .sidebar-divider {
          height: 1px;
          background: var(--border);
          margin: 0 0 4px;
          flex-shrink: 0;
        }

        /* ── Chat list scroll area ──────────────────── */
        .chat-list {
          flex: 1;
          overflow-y: auto;
          padding: 6px 10px 100px;
          scrollbar-width: thin;
          scrollbar-color: var(--bg-elevated) transparent;
        }
        .chat-list::-webkit-scrollbar       { width: 4px; }
        .chat-list::-webkit-scrollbar-track  { background: transparent; }
        .chat-list::-webkit-scrollbar-thumb  { background: var(--bg-elevated); border-radius: 4px; }

        /* ── Main chat area ─────────────────────────── */
        .chat-main {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-base);
          position: relative;
          overflow: hidden;
        }

        /* subtle grid background on empty state */
        .chat-main::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
          opacity: 0.5;
        }

        /* ── Empty-state ────────────────────────────── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .empty-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-lg);
          background: var(--bg-elevated);
          border: 1px solid var(--border-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-deep), 0 0 40px var(--accent-glow);
        }
        .empty-icon-wrap svg {
          width: 36px;
          height: 36px;
          color: var(--accent);
        }

        .empty-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 4px 0 0;
        }

        .empty-sub {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 400;
        }
      `}</style>

      <section className="chats-root">
        <div
          className={[
            'sidebar',
            isSearching ? 'sidebar--searching' : 'sidebar--default',
            selectedChat ? 'sidebar--hidden' : '', 
          ].join(' ')}
        >
          {isSearching ? (
            <SearchUserComponent
              setIsSearching={setIsSearching}
              setSelectedChat={setSelectedChat}
            />
          ) : (
            <>
              <div className="sidebar-header">
                <div className="sidebar-top-row">
                  <h1 className="sidebar-title">Messages</h1>

                  <button
                    className="fab"
                    aria-label="New conversation"
                    title="New conversation"
                  >
                    +
                  </button>
                </div>

                <div
                  className="search-bar"
                  onClick={() => setIsSearching(true)}
                >
                  <svg
                    className="search-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search conversations…"
                    className="search-input"
                    readOnly
                  />
                </div>
              </div>

              <div className="sidebar-divider" />

              <div className="chat-list overflow-y-scroll">
                {
                  contacts?.map((contact: any) => (
                    <ChatItemComponent
                      key={contact.id}
                      user={contact}
                      setSelectedChat={setSelectedChat}
                      allChats={allChats}
                    />
                  ))
                }
              </div>
            </>
          )}
        </div>

        <div
          className={[
            'chat-main',
            !selectedChat ? 'chat-main--hidden' : '',  /* mobile: hidden when no chat */
          ].join(' ')}
          style={selectedChat ? { alignItems: 'stretch', justifyContent: 'flex-start' } : {}}
        >
          {selectedChat ? (
            <ChatPart
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setAllChats={setAllChats}
              profile={profile}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="empty-title">Select a conversation</p>
              <p className="empty-sub">Choose a chat from the list to start messaging</p>
            </div>
          )}
        </div>

      </section>
    </>
  );
}

export default Chats;