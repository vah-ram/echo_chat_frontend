import React from 'react'
import { User } from '../../types/UserType'

type Props = {
  user?: User;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
};

function ChatItemComponent({ user, setSelectedChat }: Props) {
  return (
    <>
      <style>{`
        .ci-row {
          width: 100%;
          border-radius: var(--radius-md);
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.18s ease;
          position: relative;
        }
        .ci-row:hover { background: var(--bg-hover); }
        .ci-row:active { background: var(--bg-elevated); }

        .ci-avatar-wrap { position: relative; flex-shrink: 0; }

        .ci-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          background-image: url('https://i.pinimg.com/originals/ac/14/6d/ac146dfb665377eb5cef0152a9e948a4.jpg');
          background-size: cover;
          background-position: center;
          border: 2px solid var(--border-strong);
        }

        .ci-dot {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 11px; height: 11px;
          border-radius: 50%;
          background: #4ade80;
          border: 2px solid var(--bg-sidebar);
          box-shadow: 0 0 6px #4ade80;
        }

        .ci-info { flex: 1; min-width: 0; }

        .ci-name {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .ci-sub {
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
          font-weight: 400;
        }
      `}</style>

      <div className="ci-row" onClick={() => setSelectedChat(user)}>
        <div className="ci-avatar-wrap">
          <div className="ci-avatar" />
          <span className="ci-dot" />
        </div>

        <div className="ci-info">
          <p className="ci-name">{user?.username}</p>
          <p className="ci-sub">{user?.email}</p>
        </div>
      </div>
    </>
  );
}

export default ChatItemComponent;