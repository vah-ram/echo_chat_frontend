import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen w-full bg-gray-50 px-7 py-10 
    pb-25 font-sans text-gray-800 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-7 text-gray-900">Settings</h1>

      <div className="flex flex-col gap-3.5 max-w-3xl w-full">

        <div className="bg-white border border-gray-200 rounded-2xl px-7 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Notifications</h3>
              <p className="text-xs text-gray-400">Manage your notification preferences</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input type="checkbox" className="sr-only peer" checked={notifications} onChange={e => setNotifications(e.target.checked)} />
              <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-indigo-500 transition-colors relative">
                <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
          {notifications && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 pl-[60px]">
              {[
                { label: "Message notifications", defaultChecked: true },
                { label: "Group mentions", defaultChecked: true },
                { label: "Email notifications", defaultChecked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 accent-indigo-500 cursor-pointer rounded" />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl px-7 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Dark Mode</h3>
              <p className="text-xs text-gray-400">Toggle dark mode theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
              <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-indigo-500 transition-colors relative">
                <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="bg-white border border-gray-200 rounded-2xl px-7 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Sound Effects</h3>
              <p className="text-xs text-gray-400">Enable sound for messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input type="checkbox" className="sr-only peer" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} />
              <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-indigo-500 transition-colors relative">
                <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white border border-gray-200 rounded-2xl px-7 py-6 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Language</h3>
              <p className="text-xs text-gray-400">Select your language</p>
            </div>
            <select
              className="px-4 py-2.5 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-xl outline-none cursor-pointer transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 flex-shrink-0"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl px-7 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Privacy & Security</h3>
              <p className="text-xs text-gray-400">Manage your privacy settings</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 pl-[60px]">
            {[
              { label: "Show online status", defaultChecked: true },
              { label: "Read receipts", defaultChecked: true },
              { label: "Two-factor authentication", defaultChecked: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 accent-indigo-500 cursor-pointer rounded" />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <button className="mt-4 ml-[60px] px-5 py-2.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 hover:text-gray-800 transition-colors">
            Change Password
          </button>
        </div>

      </div>
    </div>
  );
}