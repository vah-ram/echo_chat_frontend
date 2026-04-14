import { useState, useRef } from 'react'

function Profile() {
  const [name, setName] = useState('John Doe')
  const [email] = useState('john.doe@example.com')
  const [phone, setPhone] = useState('+1 (555) 123-4567')
  const [bio, setBio] = useState('Product designer and coffee enthusiast')
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('deviceId')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profile')
    window.location.href = 'login'
  }

  return (
    <>
      <style>{`
        .profile-page {
          min-height: 100vh;
          background: var(--bg-page, #f5f5f7);
          padding: 40px 20px 60px;
          font-family: var(--font, 'Segoe UI', sans-serif);
          color: var(--text-primary, #111);
        }

        .profile-title {
          font-size: 26px;
          font-weight: 700;
          margin: 0 0 28px;
          color: var(--text-primary, #111);
        }

        .profile-card {
          background: var(--bg-card, #fff);
          border: 1px solid var(--border, #e5e5e5);
          border-radius: 16px;
          padding: 32px;
          max-width: 820px;
          margin-bottom: 20px;
        }

        /* ── Avatar ── */
        .profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }

        .profile-avatar-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .profile-avatar-img,
        .profile-avatar-initials {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-avatar-initials {
          background: var(--bg-hover, #e0e0e6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          color: var(--text-secondary, #555);
          letter-spacing: 1px;
        }

        .profile-avatar-cam {
          position: absolute;
          bottom: 0; right: 0;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #111;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .profile-avatar-cam svg { color: #fff; }

        .profile-avatar-label strong {
          display: block;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .profile-avatar-label span {
          font-size: 13px;
          color: var(--text-muted, #888);
        }

        /* ── Fields ── */
        .profile-field {
          margin-bottom: 22px;
        }
        .profile-field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary, #111);
        }

        .profile-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .profile-input-wrap .field-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted, #999);
          display: flex;
          pointer-events: none;
        }

        .profile-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: var(--bg-hover, #f0f0f3);
          font-size: 15px;
          color: var(--text-primary, #111);
          outline: none;
          transition: border-color 0.18s, background 0.18s;
          box-sizing: border-box;
        }
        .profile-input.has-icon {
          padding-left: 42px;
        }
        .profile-input:focus {
          border-color: var(--accent, #4f46e5);
          background: var(--bg-card, #fff);
        }

        textarea.profile-input {
          resize: none;
          height: 110px;
          line-height: 1.5;
        }

        /* ── Buttons row ── */
        .profile-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: var(--text-primary, #111);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.18s;
        }
        .btn-primary:hover { opacity: 0.82; }

        .btn-secondary {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: var(--bg-hover, #ebebee);
          color: var(--text-primary, #111);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s;
        }
        .btn-secondary:hover { background: var(--border, #ddd); }

        /* ── Logout card ── */
        .profile-logout-card {
          background: var(--bg-card, #fff);
          border: 1px solid var(--border, #e5e5e5);
          border-radius: 16px;
          padding: 28px 32px;
          max-width: 820px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .profile-logout-info strong {
          display: block;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .profile-logout-info span {
          font-size: 13px;
          color: var(--text-muted, #888);
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 12px;
          border: 1.5px solid rgba(239,68,68,0.35);
          background: rgba(239,68,68,0.07);
          color: #dc2626;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          white-space: nowrap;
        }
        .btn-logout:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.6);
        }

        /* ── Danger zone ── */
        .profile-danger-card {
          background: var(--bg-card, #fff);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 16px;
          padding: 28px 32px;
          max-width: 820px;
          margin-top: 20px;
        }
        .profile-danger-card h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 6px;
          color: #dc2626;
        }
        .profile-danger-card p {
          font-size: 13px;
          color: var(--text-muted, #888);
          margin: 0 0 18px;
        }
        .btn-danger {
          padding: 11px 22px;
          border-radius: 12px;
          border: none;
          background: #dc2626;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.18s;
        }
        .btn-danger:hover { opacity: 0.85; }
      `}</style>

      <div className="profile-page">
        <h1 className="profile-title">Account Settings</h1>

        {/* ── Main card ── */}
        <div className="profile-card">

          {/* Avatar */}
          <div className="profile-avatar-row">
            <div className="profile-avatar-wrap" onClick={() => fileRef.current?.click()}>
              {avatar
                ? <img src={avatar} alt="avatar" className="profile-avatar-img" />
                : <div className="profile-avatar-initials">{initials}</div>
              }
              <div className="profile-avatar-cam">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>
            <div className="profile-avatar-label">
              <strong>Profile Photo</strong>
              <span>Click the camera icon to upload a new photo</span>
            </div>
          </div>

          {/* Full Name */}
          <div className="profile-field">
            <label>Full Name</label>
            <div className="profile-input-wrap">
              <input
                className="profile-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="profile-field">
            <label>Email Address</label>
            <div className="profile-input-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                className="profile-input has-icon"
                value={email}
                readOnly
                placeholder="Email"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="profile-field">
            <label>Phone Number</label>
            <div className="profile-input-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <input
                className="profile-input has-icon"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="profile-field">
            <label>Bio</label>
            <textarea
              className="profile-input"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button className="btn-primary">Save Changes</button>
            <button className="btn-secondary">Cancel</button>
          </div>
        </div>

        {/* ── Logout card ── */}
        <div className="profile-logout-card">
          <div className="profile-logout-info">
            <strong>Log out</strong>
            <span>You will be signed out of your account on this device</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            Log out
          </button>
        </div>

        {/* ── Danger zone ── */}
        <div className="profile-danger-card">
          <h3>Danger Zone</h3>
          <p>Permanently delete your account and all of your data</p>
          <button className="btn-danger">Delete Account</button>
        </div>
      </div>
    </>
  )
}

export default Profile