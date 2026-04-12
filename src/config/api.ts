const BASE_URL = "https://echo-chat-backend-8.onrender.com";
//https://echo-chat-backend-8.onrender.com
export const API = {
    socketMessageUrl: `${BASE_URL}/message`,
    profileUrl: `${BASE_URL}/user`,
    searchUsers: `${BASE_URL}/user/search-users`,
    addMessage: `${BASE_URL}/message/add-message`,
    getAllMessages: `${BASE_URL}/user/all-messages`,
    getContacts: `${BASE_URL}/user/get-contacts`,
    registerUrl: `${BASE_URL}/auth/register`,
    loginUrl: `${BASE_URL}/auth/login`,
    verifyEmailUrl: `${BASE_URL}/auth/verify-email`
}