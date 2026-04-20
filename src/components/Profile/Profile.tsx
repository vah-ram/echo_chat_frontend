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

  const initials = profile?.username.trim().split(' ').map((w: any) => w[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('deviceId')
    localStorage.removeItem('accessToken')
    window.location.href = 'login'
  }

  useEffect(() => {
    const callAsync = async () => {
      if (!profileImage) return;
      const formData = new FormData();
      formData.append('file', profileImage);
      try {
        const res = await axiosInstance.post(API.addProfileImage, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        if (res.data) {
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    };
    callAsync();
  }, [profileImage]);

  return (
    <div className="w-full min-h-screen bg-gray-50 px-7 py-10 
    pb-25 font-sans text-gray-800 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-7 text-gray-900">Account Settings</h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-3xl w-full mb-4 shadow-sm">
        <div className="flex items-center gap-5 mb-8 flex-wrap">
          <div
            className="relative w-20 h-20 flex-shrink-0 cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {profile?.profileImageUrl !== undefined
              ? <img src={profile.profileImageUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
              : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 tracking-wider">
                  {initials}
                </div>
              )
            }
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0] && setProfileImage) {
                  setProfileImage(e.target.files[0]);
                }
              }}
            />
          </div>
          <div>
            <strong className="block text-sm font-semibold text-gray-900 mb-1">Profile Photo</strong>
            <span className="text-xs text-gray-400">Click the camera icon to upload a new photo</span>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Full Name</label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-gray-300"
            value={profile?.username}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Email Address</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-300 pointer-events-none flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400 outline-none cursor-default placeholder-gray-300"
              value={profile?.email}
              onChange={e => setEmail(e.target.value)}
              readOnly
              placeholder="Email"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Phone Number</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-300 pointer-events-none flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-gray-300"
              value={profile?.phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2 flex-wrap">
          <button className="px-7 py-3 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
            Save Changes
          </button>
          <button className="px-7 py-3 rounded-xl border border-gray-200 bg-transparent text-gray-500 text-sm font-semibold hover:bg-gray-100 hover:text-gray-700 transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {/* Logout card */}
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-6 max-w-3xl w-full flex items-center justify-between gap-5 flex-wrap mb-4 shadow-sm">
        <div>
          <strong className="block text-sm font-semibold text-gray-900 mb-1">Log out</strong>
          <span className="text-xs text-gray-400">You will be signed out of your account on this device</span>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-colors whitespace-nowrap"
          onClick={handleLogout}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          Log out
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl px-8 py-6 max-w-3xl w-full shadow-sm">
        <h3 className="text-sm font-bold text-red-500 mb-1.5">Danger Zone</h3>
        <p className="text-xs text-gray-400 mb-4">Permanently delete your account and all of your data</p>
        <button className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}

export default Profile;