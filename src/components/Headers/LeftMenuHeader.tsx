import { useState } from 'react'

function LeftMenuHeader() {
  const [currentPage] = useState('');

  return (
    <header 
        className='w-[100px] h-full border-r-1 
        border-gray-300 flex flex-col items-center 
        justify-between pb-5 max-md:hidden'>
        <ul className='flex flex-col w-full flex flex-col 
        items-center pt-10 gap-5'>
            <li className='list-none'>
                <button className={`w-[50px] h-[50px] flex 
                items-center justify-center 
                rounded-xl cursor-pointer 
                ${currentPage === "chats" ? "bg-black" : ""}`} 
                onClick={() => {
                    window.location.href = "chats"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                    className={`lucide lucide-message-square w-5 h-5  
                    ${currentPage === "chats" ? "text-white" : "text-gray-800"}`} data-fg-ccit9="1.22:1.4324:/src/app/components/Layout.tsx:32:13:1167:37:e:MessageSquare::::::BITa" data-fgid-ccit9=":r7:"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
            </li>
            <li>
                <button className={`w-[50px] h-[50px] flex 
                items-center justify-center
                rounded-xl cursor-pointer 
                ${currentPage === "profile" ? "bg-black" : ""}`} 
                onClick={() => {
                    window.location.href = "profile"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                    className={`lucide lucide-user w-5 h-5  
                    ${currentPage === "profile" ? "text-white" : "text-gray-800"}`} data-fg-ccit11="1.22:1.4324:/src/app/components/Layout.tsx:44:13:1628:28:e:User::::::wpV" data-fgid-ccit11=":r9:"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </button>
            </li>
            <li>
                <button className={`w-[50px] h-[50px] flex 
                items-center justify-center 
                rounded-xl cursor-pointer 
                ${currentPage === "settings" ? "bg-black" : ""}`}
                onClick={() => {
                    window.location.href = "settings"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                    className={`lucide lucide-settings w-5 h-5 
                    ${currentPage === "settings" ? "text-white" : "text-gray-800"}`} data-fg-ccit13="1.22:1.4324:/src/app/components/Layout.tsx:56:13:2081:32:e:Settings::::::D4nh" data-fgid-ccit13=":rb:"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </li>
        </ul>
        <button className='w-[50px] h-[50px] flex 
                items-center justify-center 
                cursor-pointer hover:bg-red-500 
                rounded-xl group'
                onClick={() => {
                    window.location.href = "login"
                }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            className="lucide lucide-log-out w-5 h-5 
            group-hover:text-white" data-fg-ccit15="1.22:1.4324:/src/app/components/Layout.tsx:64:11:2391:30:e:LogOut::::::B3pg" data-fgid-ccit15=":rd:"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
        </button>
    </header>
  )
}

export default LeftMenuHeader