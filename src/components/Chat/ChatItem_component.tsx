import React from 'react'
import { User } from '../../types/UserType'

type Props = {
  user?: User;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
};

function ChatItem_component({ user, setSelectedChat }: Props) {
  return (
    <div className='w-full h-[80px] border-b-1 
    border-gray-300 hover:bg-gray-200 duration-300 
    py-2 px-4 flex items-center cursor-pointer' 
    onClick={() => setSelectedChat(user)}>
        <div className='flex gap-3'>
            <span className={`w-[45px] h-[45px] 
                rounded-full flex items-center 
                bg-[url('https://i.pinimg.com/originals/ac/14/6d/ac146dfb665377eb5cef0152a9e948a4.jpg')] 
                bg-cover bg-center
            `}/>

            <span>
                <h3>
                    {user?.username}
                </h3>
                <p className='text-[14px] text-gray-500'>
                    {user?.email}
                </p>
            </span>
        </div>
    </div>
  )
}

export default ChatItem_component