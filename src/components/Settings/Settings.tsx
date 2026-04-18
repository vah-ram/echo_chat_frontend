import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --bg-base:        #0d0f14;
          --bg-sidebar:     #13151c;
          --bg-elevated:    #1c1f2b;
          --bg-hover:       #22263a;
          --bg-input:       #1a1d28;
          --accent:         #6c8cff;
          --accent-soft:    #3a4d99;
          --accent-glow:    rgba(108,140,255,0.18);
          --text-primary:   #eef0f8;
          --text-secondary: #8a90b0;
          --text-muted:     #454a6a;
          --border:         rgba(255,255,255,0.06);
          --border-strong:  rgba(255,255,255,0.11);
          --shadow-deep:    0 8px 32px rgba(0,0,0,0.45);
          --radius-sm:      10px;
          --radius-md:      16px;
          --radius-lg:      22px;
          --radius-pill:    999px;
          --font-display:   'Syne', sans-serif;
          --font-body:      'DM Sans', sans-serif;
        }
          
        .settings-page {
          min-height: 100vh;
          width: 100%;
          background: #0f0f13;
          padding: 40px 28px 60px;
          font-family: 'Segoe UI', sans-serif;
          color: #f0f0f5;
          overflow-y: scroll;
        }

        .settings-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 28px;
          color: #f0f0f5;
        }

        .settings-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 820px;
          width: 100%;
        }

        .settings-card {
          background: #1a1a22;
          border: 1px solid #2a2a35;
          border-radius: 16px;
          padding: 24px 28px;
          width: 100%;
        }

        .settings-row {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .settings-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(91,91,246,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #5b5bf6;
        }

        .settings-info {
          flex: 1;
          min-width: 0;
        }
        .settings-info h3 {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 3px;
          color: #f0f0f5;
        }
        .settings-info p {
          font-size: 13px;
          color: #60607a;
          margin: 0;
        }

        .toggle-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          flex-shrink: 0;
        }
        .toggle-wrap input { display: none; }
        .toggle-track {
          width: 44px;
          height: 24px;
          border-radius: 999px;
          background: #2a2a38;
          transition: background 0.2s;
          position: relative;
        }
        .toggle-wrap input:checked ~ .toggle-track {
          background: #5b5bf6;
        }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s;
          pointer-events: none;
        }
        .toggle-wrap input:checked ~ .toggle-track .toggle-thumb {
          transform: translateX(20px);
        }

        .settings-sub {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid #2a2a35;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-left: 62px;
        }

        .settings-check-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #b0b0c8;
          cursor: pointer;
        }
        .settings-check-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #5b5bf6;
          cursor: pointer;
        }

        .settings-select {
          padding: 10px 16px;
          font-size: 14px;
          background: #12121a;
          color: #e0e0ee;
          border: 1px solid #2a2a38;
          border-radius: 12px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.18s;
          flex-shrink: 0;
        }
        .settings-select:focus {
          border-color: #5b5bf6;
        }
        .settings-select option {
          background: #1a1a22;
        }

        .settings-lang-row {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .btn-change-pw {
          margin-top: 18px;
          margin-left: 62px;
          padding: 10px 22px;
          background: #23232f;
          color: #b0b0c8;
          border: 1px solid #2a2a38;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          display: inline-block;
        }
        .btn-change-pw:hover {
          background: #2a2a38;
          color: #f0f0f5;
        }

        @media (max-width: 600px) {
          .settings-page { padding: 20px 14px 100px; }
          .settings-title { font-size: 20px; margin-bottom: 20px; }
          .settings-card { padding: 18px 16px; border-radius: 14px; }
          .settings-sub { padding-left: 0; }
          .btn-change-pw { margin-left: 0; width: 100%; text-align: center; }
          .settings-lang-row { flex-direction: column; align-items: flex-start; }
          .settings-select { width: 100%; }
        }
      `}</style>

      <div className="settings-page">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-stack">

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div className="settings-info">
                <h3>Notifications</h3>
                <p>Manage your notification preferences</p>
              </div>
              <label className="toggle-wrap">
                <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} />
                <div className="toggle-track"><div className="toggle-thumb" /></div>
              </label>
            </div>
            {notifications && (
              <div className="settings-sub">
                <label className="settings-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Message notifications</span>
                </label>
                <label className="settings-check-label">
                  <input type="checkbox" defaultChecked />
                  <span>Group mentions</span>
                </label>
                <label className="settings-check-label">
                  <input type="checkbox" />
                  <span>Email notifications</span>
                </label>
              </div>
            )}
          </div>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </div>
              <div className="settings-info">
                <h3>Dark Mode</h3>
                <p>Toggle dark mode theme</p>
              </div>
              <label className="toggle-wrap">
                <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                <div className="toggle-track"><div className="toggle-thumb" /></div>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              </div>
              <div className="settings-info">
                <h3>Sound Effects</h3>
                <p>Enable sound for messages</p>
              </div>
              <label className="toggle-wrap">
                <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} />
                <div className="toggle-track"><div className="toggle-thumb" /></div>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-lang-row">
              <div className="settings-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="settings-info">
                <h3>Language</h3>
                <p>Select your language</p>
              </div>
              <select className="settings-select" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="settings-info">
                <h3>Privacy & Security</h3>
                <p>Manage your privacy settings</p>
              </div>
            </div>
            <div className="settings-sub">
              <label className="settings-check-label">
                <input type="checkbox" defaultChecked />
                <span>Show online status</span>
              </label>
              <label className="settings-check-label">
                <input type="checkbox" defaultChecked />
                <span>Read receipts</span>
              </label>
              <label className="settings-check-label">
                <input type="checkbox" />
                <span>Two-factor authentication</span>
              </label>
            </div>
            <button className="btn-change-pw">Change Password</button>
          </div>

        </div>
      </div>
    </>
  );
}