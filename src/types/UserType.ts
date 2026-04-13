
export type User = {
    id: string,
    address: string,
    email: string,
    username: string,
    profileImageUrl: string,
    isOnline?: boolean;
};


export type Message = {
    senderId: string,
    receiverId: string,
    message: string,
    createdAt: string,
    updatedAt: string,
}