import React from 'react'

function UserInfoHeader({ selectedChat, setSelectedChat, headerRef }: any) {
  return (
    <header 
      className='w-full bg-white overflow-hidden shadow-lg'
      ref={headerRef}>
      
      {/* Profile Image Section */}
      <div className='w-full h-64 relative bg-gradient-to-br from-gray-100 to-gray-200'>
        <img 
          src={
            selectedChat?.profileImageUrl !== undefined ?
            selectedChat?.profileImageUrl :
            '/icones/user-icon.jpg'
          } 
          alt="Profile"
          className='w-full h-full object-cover object-center' 
        />

        {/* Back Button */}
        <button 
          className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-white/95 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
          onClick={() => setSelectedChat(null)}
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Info Section */}
      <div className='p-6'>
        <h2 className='text-lg font-medium text-gray-900 mb-1'>
          {selectedChat?.username}
        </h2>
        <p className='text-sm text-gray-500 mb-6'>User Profile</p>

        {/* Info Items */}
        <div className='space-y-4'>
          {/* Name */}
          <div className='flex gap-3'>
            <div className='w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0C447C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>Name</p>
              <p className='text-sm font-medium text-gray-900'>
                {selectedChat?.username}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className='flex gap-3'>
            <div className='w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27500A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>Phone</p>
              <p className='text-sm font-medium text-gray-900'>
                {selectedChat?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default UserInfoHeader