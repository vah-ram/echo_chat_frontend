import { useEffect, useState } from 'react';
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
import { User } from './types/UserType';
import { PushNotifications } from '@capacitor/push-notifications';
import { getDeviceId } from './fcm/get-fcm';
import { Capacitor } from '@capacitor/core';

const initPush = async () => {
  const access = localStorage.getItem("accessToken")

  if(!access) return;

  const permission = await PushNotifications.requestPermissions();

  if (permission.receive === 'granted') {
    await PushNotifications.register();
  }

  PushNotifications.addListener('registration', token => {
    const deviceId = getDeviceId();

    const callFcm = async() => {
      try {
        await axiosInstance.post(API.setFcmtokenUrl, { 
          fcmToken: token.value,
          platform: "web",
          deviceId
        });
      } catch (error) {
        console.error("Error setting FCM token:", error);
      }
    };
    callFcm()
  });

  PushNotifications.addListener('registrationError', err => {
    console.error(err);
  });

  PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log(JSON.stringify(notification));
  });
};

function App() {
  const location = useLocation();

  const access = localStorage.getItem("accessToken")

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const [selectedChat, setIsSelectedChat] = useState<User | null>(null);
  
   useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      initPush();
    }
  }, []);

  useEffect(() => {
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('✅ SW registered:', registration);
        } catch (err) {
          console.error('❌ SW registration failed:', err);
        }
      }
    };

    registerSW();
  }, []);

  useEffect(() => {
    const callProfile = async () => {
      try {
        const response = await axiosInstance.get(API.profileUrl);
        localStorage.setItem(
          "profile", 
          JSON.stringify(response.data)
        );
        connectSocket();
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    callProfile();
  }, [access]); 

  return (
    <main className="w-full flex h-screen">
      
      {!isAuthPage  && (
        <LeftMenuHeader selectedChat={selectedChat}/>
      )}
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route path="/chats" element={<Chats setIsSelectedChat={setIsSelectedChat}/>} />
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