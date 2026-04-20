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
    <div className="w-full h-full flex flex-col font-sans">

      {/* Top bar */}
      <div className="px-3.5 pt-5 pb-0 flex items-center gap-2.5">
        <button
          className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          onClick={() => setIsSearching(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex-1 h-11 bg-gray-100 border border-gray-200 rounded-xl flex items-center px-3.5 gap-2.5 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search users…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 caret-indigo-500"
            onChange={(e) => { e.preventDefault(); searching(e.target.value); }}
          />
        </div>
      </div>

      <div className="h-px bg-gray-100 mt-4 flex-shrink-0" />

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-2.5 py-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {searchedUsers.length > 0 ? (
          searchedUsers.map((user) => (
            <ChatItemComponent
              key={user.id}
              user={user}
              setSelectedChat={setSelectedChat}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
            <svg className="w-8 h-8 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-sm">Search for users to start a conversation</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchUserComponent;