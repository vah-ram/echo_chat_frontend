import { useEffect } from 'react';
import LeftMenuHeader from './components/Headers/LeftMenuHeader';
import Chats from './components/Chat/Chats';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import axiosInstance from "./lib/axios"
import { API } from './config/api';
import { connectSocket } from './socket/socket';
import ProtectedRoute from './ProtectedRoute';
import { getFcmToken } from './fcm/get-fcm';

function App() {
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
  const fetchToken = async () => {
    const fcmToken = await getFcmToken();

    const deviceId = localStorage.getItem("device_id");

    if(fcmToken) {
      try {
        await axiosInstance.post(API.setFcmtokenUrl, { 
          fcmToken,
          platform: "web",
          deviceId
        });
      } catch (error) {
        console.error("Error setting FCM token:", error);
      }
    }
  };

  fetchToken();
}, []);

  useEffect(() => {
    const callProfile = async () => {
      try {
        const response = await axiosInstance.get(API.profileUrl);
        localStorage.setItem("profile", JSON.stringify(response.data));
        connectSocket();
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    callProfile();
  }); 

  return (
    <main className="w-full flex h-screen">
      
      {!isAuthPage && (
        <LeftMenuHeader />
      )}
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ProtectedRoute>
    </main>
  );
}

export default App;