import React, { useState, useEffect, useRef, useCallback } from 'react'
import axiosInstance from '../../../lib/axios'
import { API } from '../../../config/api'

interface ContextMenuItem {
  icon: string
  label: string
  action: () => void
  danger?: boolean
}

function ChatMessage({ profile, chat, selectedChat, deleteMessageFunc }: any) {
  const isMine = chat.senderId === profile?.id
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const avatarUrl = isMine
    ? profile?.profileImageUrl ?? '/icones/user-icon.jpg'
    : selectedChat?.profileImageUrl ?? '/icones/user-icon.jpg'

  let menuItems: (ContextMenuItem | 'divider')[] = []

  {
    isMine ? 
    menuItems = [
    {
      icon: '⎘',
      label: 'Copy',
      action: () => navigator.clipboard.writeText(chat.message),
    },
    // {
    //   icon: '↩',
    //   label: 'Reply',
    //   action: () => console.log('reply', chat),
    // },
    // {
    //   icon: '⇥',
    //   label: 'Forward',
    //   action: () => console.log('forward', chat),
    // },
    'divider',
    {
      icon: '⌫',
      label: 'Delete',
      action: () => deleteMessageFunc(chat.id),
      danger: true,
    },
  ]
  :
    menuItems = [
        {
        icon: '⎘',
        label: 'Copy',
        action: () => navigator.clipboard.writeText(chat.message),
        }
    ]
  }

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
  }, [])

  const closeMenu = useCallback(() => setMenuPos(null), [])

  useEffect(() => {
    if (!menuPos) return
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [menuPos, closeMenu])

  const adjustedPos = menuPos
    ? {
        left: Math.min(menuPos.x, window.innerWidth - 200),
        top: Math.min(menuPos.y, window.innerHeight - 250),
      }
    : null;

  return (
    <>
      <div
        className="cp-msg-avatar"
        style={{ backgroundImage: `url(${avatarUrl})` }}
      />

      <div
        onContextMenu={handleContextMenu}
        className={`cp-bubble select-none ${isMine ? 'cp-bubble--mine' : 'cp-bubble--theirs'}`}
      >
       {chat.fileUrl ? 
       <>
        <img src={chat.fileUrl} alt="" width="100%" height="100%"/>
       </>
        : chat.message}
      </div>

      {menuPos && adjustedPos && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[180px] rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden py-1"
          style={{ left: adjustedPos.left, top: adjustedPos.top }}
        >
          {menuItems.map((item, i) =>
            item === 'divider' ? (
              <div key={i} className="my-1 h-px bg-neutral-100 dark:bg-neutral-700" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.action()
                  closeMenu()
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 text-sm text-left transition-colors
                  hover:bg-neutral-100 dark:hover:bg-neutral-700
                  ${item.danger
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-neutral-800 dark:text-neutral-100'
                  }`}
              >
                <span className="w-4 text-center text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </>
  )
}

export default ChatMessage