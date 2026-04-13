import { getToken } from "firebase/messaging";
import { messaging } from "./firebase.config";

export const getFcmToken = async () => {
  console.log("1. getFcmToken սկսվեց");

  const permission = await Notification.requestPermission();

  if (permission !== "granted") return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: "BIers6aXG2XQmsWobmOCSL8eQ0NGbLJ8pWFqwDbqogorv0jbfKX7nxn9odh6adgXKv1YgjrZlPyTraG-f0wWSyo"
    });
    return token;
  } catch (error) {
    return null;
  }
};
