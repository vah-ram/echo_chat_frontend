import { useState, useRef, useEffect } from 'react'
import axiosInstance from '../../lib/axios';
import { API } from '../../config/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

function Profile() {
  const [name, setName] = useState<string | undefined>('');
  const [email, setEmail] = useState<string | undefined>('')
  const [phone, setPhone] = useState('+1 (555) 123-4567')
  const fileRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const profile = useSelector((state: RootState) => state.auth.user);

  const initials = profile?.username.trim().split(' ').map((w: any)=> w[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('deviceId')
    localStorage.removeItem('accessToken')
    window.location.href = 'login'
  }

  useEffect(() => {
		const callAsync = async() => {
			if(!profileImage) return;

			const formData = new FormData();
			formData.append('file', profileImage);

			try {
				const res = await axiosInstance.post(
				API.addProfileImage,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
					},
						withCredentials: true,
					}
				);
				
				if (res.data) {
          const updatedProfile = {
            ...profile,
            profileImageUrl: res.data.imageUrl
          };

          window.location.reload();
        }
			} catch (err) {
				console.error(err);
			}
		};
		callAsync();
	}, [profileImage]);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

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

        .profile-page {
          width: 100% !important;
          min-height: 100vh;
          width: 100%;
          background: #0f0f13;
          padding: 40px 28px 60px;
          font-family: var(--font, 'Segoe UI', sans-serif);
          color: #f0f0f5;
          overflow-y: scroll;
        }

        .profile-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 28px;
          color: #f0f0f5;
        }

        .profile-card {
          background: #1a1a22;
          border: 1px solid #2a2a35;
          border-radius: 16px;
          padding: 32px;
          max-width: 820px;
          width: 100%;
          margin-bottom: 16px;
        }

        .profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
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
          background: #2a2a38;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          color: #9090aa;
          letter-spacing: 1px;
        }

        .profile-avatar-cam {
          position: absolute;
          bottom: 0; right: 0;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #5b5bf6;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 6px rgba(91,91,246,0.5);
        }
        .profile-avatar-cam svg { color: #fff; }

        .profile-avatar-label strong {
          display: block;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #f0f0f5;
        }
        .profile-avatar-label span {
          font-size: 13px;
          color: #6060778;
        }

        .profile-field {
          margin-bottom: 20px;
        }
        .profile-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #9090aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .profile-input-wrap .field-icon {
          position: absolute;
          left: 14px;
          color: #50506a;
          display: flex;
          pointer-events: none;
        }

        .profile-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid #2a2a38;
          background: #12121a;
          font-size: 15px;
          color: #e0e0ee;
          outline: none;
          transition: border-color 0.18s, background 0.18s;
        }
        .profile-input.has-icon {
          padding-left: 42px;
        }
        .profile-input:focus {
          border-color: #5b5bf6;
          background: #14141e;
        }
        .profile-input::placeholder {
          color: #40405a;
        }
        .profile-input[readonly] {
          color: #60607a;
          cursor: default;
        }

        textarea.profile-input {
          resize: none;
          height: 110px;
          line-height: 1.5;
        }

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
          background: #5b5bf6;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.18s;
        }
        .btn-primary:hover { opacity: 0.85; }

        .btn-secondary {
          padding: 12px 28px;
          border-radius: 12px;
          border: 1px solid #2a2a38;
          background: transparent;
          color: #9090aa;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .btn-secondary:hover {
          background: #2a2a38;
          color: #e0e0ee;
        }

        .profile-logout-card {
          background: #1a1a22;
          border: 1px solid #2a2a35;
          border-radius: 16px;
          padding: 24px 32px;
          max-width: 820px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .profile-logout-info strong {
          display: block;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #f0f0f5;
        }
        .profile-logout-info span {
          font-size: 13px;
          color: #60607a;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 12px;
          border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.08);
          color: #f87171;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          white-space: nowrap;
        }
        .btn-logout:hover {
          background: rgba(239,68,68,0.16);
          border-color: rgba(239,68,68,0.5);
        }

        .profile-danger-card {
          background: #1a1a22;
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 16px;
          padding: 24px 32px;
          max-width: 820px;
          width: 100%;
        }
        .profile-danger-card h3 {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 6px;
          color: #f87171;
        }
        .profile-danger-card p {
          font-size: 13px;
          color: #60607a;
          margin: 0 0 18px;
        }
        .btn-danger {
          padding: 11px 22px;
          border-radius: 12px;
          border: none;
          background: #dc2626;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.18s;
        }
        .btn-danger:hover { opacity: 0.85; }

        @media (max-width: 768px) {
          .profile-page { padding: 24px 16px 48px; }
          .profile-title { font-size: 20px; margin-bottom: 20px; }
          .profile-card,
          .profile-logout-card,
          .profile-danger-card { padding: 20px 18px; border-radius: 14px; }
          .profile-avatar-row { gap: 14px; margin-bottom: 24px; }
          .profile-input { font-size: 14px; padding: 12px 14px; }
          .profile-input.has-icon { padding-left: 40px; }
          .btn-primary, .btn-secondary { padding: 11px 20px; font-size: 14px; }
          .btn-logout { padding: 10px 16px; font-size: 13px; }
        }

        @media (max-width: 480px) {
          .profile-page { padding: 16px 12px 100px; }
          .profile-title { font-size: 18px; margin-bottom: 16px; }
          .profile-card,
          .profile-logout-card,
          .profile-danger-card { padding: 18px 14px; border-radius: 12px; }
          .profile-avatar-row { flex-direction: column; align-items: flex-start; gap: 10px; margin-bottom: 20px; }
          .profile-field { margin-bottom: 16px; }
          .profile-field label { font-size: 12px; }
          .profile-input { font-size: 14px; padding: 11px 12px; border-radius: 10px; }
          .profile-input.has-icon { padding-left: 38px; }
          textarea.profile-input { height: 90px; }
          .profile-actions { flex-direction: column; gap: 10px; }
          .btn-primary, .btn-secondary {
            width: 100%;
            text-align: center;
            padding: 13px 16px;
            font-size: 15px;
            border-radius: 10px;
          }
          .profile-logout-card { flex-direction: column; align-items: flex-start; gap: 14px; }
          .btn-logout { width: 100%; justify-content: center; padding: 12px 16px; border-radius: 10px; }
          .btn-danger { width: 100%; text-align: center; padding: 12px 16px; border-radius: 10px; }
        }
      `}</style>

      <div className="profile-page">
        <h1 className="profile-title">Account Settings</h1>
        <div className="profile-card">
          <div className="profile-avatar-row">
            <div className="profile-avatar-wrap" onClick={() => fileRef.current?.click()}>
              {profile?.profileImageUrl !== undefined 
                ? <img src={profile.profileImageUrl} alt="avatar" className="profile-avatar-img" />
                : <div className="profile-avatar-initials">{initials}</div>
              }
              <div className="profile-avatar-cam">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input 
                ref={fileRef} 
                type="file" 
                accept=".jpg,.jpeg,.png,.webp"
                style={{ display: 'none' }} 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0] && setProfileImage) {
                    setProfileImage(e.target.files[0]);
                  }
                }}/>
            </div>
            <div className="profile-avatar-label">
              <strong>Profile Photo</strong>
              <span>Click the camera icon to upload a new photo</span>
            </div>
          </div>

          <div className="profile-field">
            <label>Full Name</label>
            <div className="profile-input-wrap">
              <input 
                className="profile-input" 
                value={profile?.username} 
                onChange={e => setName(e.target.value)} 
                placeholder="Full Name" />
            </div>
          </div>

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
                value={profile?.email} 
                onChange={e => setEmail(e.target.value)} 
                readOnly placeholder="Email" />
            </div>
          </div>

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
                value={profile?.phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="Phone Number" />
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary">Save Changes</button>
            <button className="btn-secondary">Cancel</button>
          </div>
        </div>

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