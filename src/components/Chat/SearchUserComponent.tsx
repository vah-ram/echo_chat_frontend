import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../lib/axios';
import { API } from '../../config/api';
import { User } from '../../types/UserType';
import ChatItemComponent from './ChatItemComponent';

type Props = {
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
};

function SearchUserComponent({ setIsSearching, setSelectedChat }: Props) {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const searching = async (text: string) => {
    if (!text) { setSearchedUsers([]); return; }
    try {
      const response = await axiosInstance.post(API.searchUsers, { text });
      setSearchedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{`
        .su-root {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: var(--font-body);
        }

        .su-top {
          padding: 20px 14px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .su-back-btn {
          width: 44px; height: 44px;
          border-radius: var(--radius-sm);
          background: var(--bg-elevated);
          border: 1px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          color: var(--text-secondary);
          transition: background 0.18s ease, color 0.18s ease;
        }
        .su-back-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

        .su-search-bar {
          flex: 1;
          height: 44px;
          background: var(--bg-input);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 10px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .su-search-bar:focus-within {
          border-color: var(--accent-soft);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .su-search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
          width: 16px; height: 16px;
        }

        .su-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--text-primary);
          caret-color: var(--accent);
        }
        .su-input::placeholder { color: var(--text-muted); }

        .su-divider {
          height: 1px;
          background: var(--border);
          margin: 16px 0 4px;
          flex-shrink: 0;
        }

        .su-list {
          flex: 1;
          overflow-y: auto;
          padding: 4px 10px 12px;
          scrollbar-width: thin;
          scrollbar-color: var(--bg-elevated) transparent;
        }
        .su-list::-webkit-scrollbar { width: 4px; }
        .su-list::-webkit-scrollbar-track { background: transparent; }
        .su-list::-webkit-scrollbar-thumb { background: var(--bg-elevated); border-radius: 4px; }

        .su-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 20px;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 400;
        }
        .su-empty svg { color: var(--text-muted); opacity: 0.5; }
      `}</style>

      <div className="su-root">
        <div className="su-top">
          <button className="su-back-btn" onClick={() => setIsSearching(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="su-search-bar">
            <svg className="su-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search users…"
              className="su-input"
              onChange={(e) => { e.preventDefault(); searching(e.target.value); }}
            />
          </div>
        </div>

        <div className="su-divider" />

        <div className="su-list">
          {searchedUsers.length > 0 ? (
            searchedUsers.map((user) => (
              <ChatItemComponent
                key={user.id}
                user={user}
                setSelectedChat={setSelectedChat}
              />
            ))
          ) : (
            <div className="su-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Search for users to start a conversation</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchUserComponent;