import { getToken } from "firebase/messaging";
import { messaging } from "./firebase.config";

export const getFcmToken = async () => {
  console.log("1. getFcmToken սկսվեց");

  if (!("Notification" in window)) {
    return null;
  }

  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    if (!registration) {
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BIers6aXG2XQmsWobmOCSL8eQ0NGbLJ8pWFqwDbqogorv0jbfKX7nxn9odh6adgXKv1YgjrZlPyTraG-f0wWSyo",
      serviceWorkerRegistration: registration
    });


    if (!token) {
      console.warn("❌ Token is null (FCM չտվեց token)");
    }

    return token;

  } catch (error: any) {
    return null;
  }
};

const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = generateUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};