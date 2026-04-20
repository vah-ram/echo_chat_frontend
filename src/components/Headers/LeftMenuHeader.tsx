import { useState } from 'react'
import { User } from '../../types/UserType';

type Props = {
  selectedChat: User | null;
};

function LeftMenuHeader({ selectedChat }: Props) {
  const [currentPage] = useState('');

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <header className={`
        hidden md:flex
        w-[72px] h-full bg-white border-r border-gray-200
        flex-col items-center justify-between
        py-6 flex-shrink-0
      `}>
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md flex-shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        {/* Nav */}
        <ul className="flex flex-col items-center gap-1.5 list-none m-0 p-0">
          {[
            {
              page: 'chats',
              href: 'chats',
              title: 'Messages',
              icon: (
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              ),
            },
            {
              page: 'profile',
              href: 'profile',
              title: 'Profile',
              icon: (
                <>
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </>
              ),
            },
            {
              page: 'settings',
              href: 'settings',
              title: 'Settings',
              icon: (
                <>
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ),
            },
          ].map(({ page, href, title, icon }) => (
            <li key={page}>
              <button
                className={`w-[46px] h-[46px] rounded-xl border-none flex items-center justify-center cursor-pointer transition-all
                  ${currentPage === page
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                onClick={() => { window.location.href = href; }}
                title={title}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {icon}
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button
          className="w-[46px] h-[46px] rounded-xl bg-transparent border-none flex items-center justify-center cursor-pointer text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Log out"
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('profile');
            window.location.href = 'login';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </button>
      </header>

      {/* Mobile: floating bottom nav bar — hidden when a chat is open */}
      {!selectedChat && (
        <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50
          flex flex-row items-center gap-1 px-3 py-2
          bg-white/90 backdrop-blur-xl border border-gray-200
          rounded-[28px] shadow-xl"
        >
          {[
            {
              page: 'chats',
              href: 'chats',
              title: 'Messages',
              icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
            },
            {
              page: 'profile',
              href: 'profile',
              title: 'Profile',
              icon: (
                <>
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </>
              ),
            },
            {
              page: 'settings',
              href: 'settings',
              title: 'Settings',
              icon: (
                <>
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ),
            },
          ].map(({ page, href, title, icon }) => (
            <button
              key={page}
              className={`w-[52px] h-11 rounded-[18px] border-none flex items-center justify-center cursor-pointer transition-all
                ${currentPage === page
                  ? 'bg-indigo-500 text-white shadow-md -translate-y-0.5'
                  : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              onClick={() => { window.location.href = href; }}
              title={title}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </button>
          ))}
        </nav>
      )}
    </>
  );
}

export default LeftMenuHeader;