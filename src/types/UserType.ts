import React from "react";

export type User = {
    id: string,
    address: string,
    email: string,
    username: string,
    profileImageUrl: string,
};


export type Message = {
    senderId: string,
    receiverId: string,
    message: string,
    createdAt: string,
    updatedAt: string,
}