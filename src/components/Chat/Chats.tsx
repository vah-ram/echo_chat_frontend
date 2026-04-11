import React, { useEffect, useState } from 'react'
import ChatItem_component from './ChatItem_component'
import SearchUserComponent from './SearchUserComponent'
import { User } from '../../types/UserType';
import ChatPart from './ChatPart/ChatPart';

function Chats() {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedChat, setSelectedChat] = useState<User | null>(null);

  return (
    <section className='w-full h-full flex'>
        <div className={`${isSearching ? 'w-[30%] max-md:w-full' : 'w-[25%] max-md:w-full'} h-full 
        border-r-1 border-gray-300 flex 
        flex-col max-md:${selectedChat ? 'hidden' : ''}`}>
            {
                isSearching ? (
                    <SearchUserComponent 
                        setIsSearching={setIsSearching}  
                        setSelectedChat={setSelectedChat}/>
                ) : (
                    <> 
                        <div className='p-4 w-full pt-5 flex flex-col'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-[19px] montserrat font-[600]'>
                                    Messages
                                </h1>
                                
                                <span className='w-[40px] h-[40px] 
                                flex justify-center items-center text-white 
                                bg-black text-[25px] rounded-xl pb-1 
                                cursor-pointer'>
                                    +
                                </span>
                            </div>

                            <div 
                                className='flex items-center justify-center 
                                w-full h-[45px] rounded-xl bg-[#f3f3f3] 
                                border-1 border-gray-300 mt-5'
                                onClick={() => setIsSearching(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                className="lucide lucide-search text-[#3d3d3d] w-5 h-5 text-muted-foreground mx-3"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                                <input 
                                    type="text"
                                    placeholder='Search users' 
                                    className='w-full h-full outline-none 
                                    border-none'/>
                            </div>
                        </div>

                        <div className='w-full h-full flex flex-col border-t-1 
                        border-gray-300 mt-2'>
                            <ChatItem_component 
                                setSelectedChat={setSelectedChat}/>
                        </div>
                    </>
                )
            }
        </div>
        <div className={`chat_part w-full h-full 
        flex flex-col items-center justify-center 
        max-md:${selectedChat ? '' : 'hidden'}`}>
            {
                selectedChat ? (
                    <ChatPart 
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}/>
                ) : 
                (
                    <>
                        <span className='p-7 bg-gray-200 rounded-full'>
                            <svg className="w-12 h-12 text-muted-foreground text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </span>

                        <span className='font-[600] text-[20px] mt-1 text-gray-800'>
                            Select a conversation
                        </span>
                        <p className='font-[600] text-gray-600 mt-2 text-[15px]'>
                            Choose a chat from the list to start messaging
                        </p>
                    </>
                )
            }
        </div>
    </section>
  )
}

export default Chats