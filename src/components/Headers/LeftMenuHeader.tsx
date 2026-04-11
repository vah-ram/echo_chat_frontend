import { useState } from 'react'

function LeftMenuHeader() {
  const [currentPage] = useState('');

  return (
    <>
      <style>{`
        .lmh-root {
          width: 72px;
          height: 100%;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 20px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) { .lmh-root { display: none; } }

        .lmh-logo {
          width: 40px; height: 40px;
          border-radius: var(--radius-sm);
          background: var(--accent);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 18px var(--accent-glow);
          flex-shrink: 0;
        }
        .lmh-logo svg { color: #fff; width: 20px; height: 20px; }

        .lmh-nav {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          list-style: none;
          margin: 0; padding: 0;
        }

        .lmh-nav-btn {
          width: 46px; height: 46px;
          border-radius: var(--radius-sm);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
          position: relative;
        }
        .lmh-nav-btn--active {
          background: var(--accent);
          color: #fff;
          box-shadow: 0 0 18px var(--accent-glow);
        }
        .lmh-nav-btn--inactive {
          background: transparent;
          color: var(--text-muted);
        }
        .lmh-nav-btn--inactive:hover {
          background: var(--bg-hover);
          color: var(--text-secondary);
        }

        .lmh-logout-btn {
          width: 46px; height: 46px;
          border-radius: var(--radius-sm);
          background: transparent;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-muted);
          transition: background 0.18s ease, color 0.18s ease;
        }
        .lmh-logout-btn:hover {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }
      `}</style>

      <header className="lmh-root">
        <div className="lmh-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <ul className="lmh-nav">
          <li>
            <button
              className={`lmh-nav-btn ${currentPage === 'chats' ? 'lmh-nav-btn--active' : 'lmh-nav-btn--inactive'}`}
              onClick={() => { window.location.href = 'chats'; }}
              title="Messages"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </li>
          <li>
            <button
              className={`lmh-nav-btn ${currentPage === 'profile' ? 'lmh-nav-btn--active' : 'lmh-nav-btn--inactive'}`}
              onClick={() => { window.location.href = 'profile'; }}
              title="Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </li>
          <li>
            <button
              className={`lmh-nav-btn ${currentPage === 'settings' ? 'lmh-nav-btn--active' : 'lmh-nav-btn--inactive'}`}
              onClick={() => { window.location.href = 'settings'; }}
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </li>
        </ul>

        <button
          className="lmh-logout-btn"
          title="Log out"
          onClick={() => { window.location.href = 'login'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </button>
      </header>
    </>
  );
}

export default LeftMenuHeader;