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

  const searching = async(text: string) => {
    if(!text) {
        setSearchedUsers([])
    };

    try {
        const response = await axiosInstance.post(API.searchUsers, { text });
        setSearchedUsers(response.data)
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <>
        <div>
            <div className='w-full h-auto px-1'>
                <div className='w-full flex items-center mt-5 gap-2'>
                    <button className='w-[45px] h-[45px] flex items-center 
                        justify-center rounded-xl border-1 border-gray-300 
                        cursor-pointer' 
                    onClick={() => setIsSearching(false)}>
                        <img src="/icones/left.png" alt="" />
                    </button>
                    <div className='flex items-center justify-center 
                    w-full h-[45px] rounded-xl bg-[#f3f3f3] 
                    border-1 border-gray-300 mr-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                        className="lucide lucide-search text-[#3d3d3d] w-5 h-5 text-muted-foreground mx-3"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        <input 
                            type="text"
                            placeholder='Search users' 
                            className='w-full h-full outline-none 
                            border-none'
                            onChange={(e) => {
                                e.preventDefault();
                                searching(e.target.value);
                            }}
                            ref={inputRef}/>
                    </div>
                </div>
            </div>
            <div className='w-full h-full border-t-1 
                border-gray-300 mt-10'>
                {
                    searchedUsers.map((user) => (
                        <ChatItemComponent
                            user={user}
                            setSelectedChat={setSelectedChat}
                        />
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default SearchUserComponent