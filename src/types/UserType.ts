
export type User = {
    id: string,
    address: string,
    email: string,
    username: string,
    profileImageUrl: string,
    isOnline?: boolean;
    phone: string;
};

export type Message = {
    senderId: string,
    receiverId: string,
    message: string,
    isRead: boolean,
    fileUrl?: string,
    voiceUrl?: string,
    createdAt: string,
    updatedAt: string,
}