import { prisma } from '../prisma/prisma.client';
import {
  IChatMessagesData,
  IChatMessagesNotificationData,
  IChatSocketUserMapData,
} from '../types/models.types';

export const createSocketMap = async (
  chatSocketUserMapData: IChatSocketUserMapData,
) => {
  try {
    return await prisma.chatSocketUserMap.create({
      data: chatSocketUserMapData,
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};
export const updateSocketMap = async (
  chatSocketUserMapData: IChatSocketUserMapData,
  id: string,
) => {
  try {
    const { socketId } = chatSocketUserMapData;
    return await prisma.chatSocketUserMap.update({
      data: { socketId: socketId },
      where: { id: id },
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};
export const verifySocketMap = async (
  chatSocketUserMapData: IChatSocketUserMapData,
) => {
  try {
    const { userId } = chatSocketUserMapData;
    return await prisma.chatSocketUserMap.findFirst({
      where: { userId: userId },
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};
export const deleteSocketMap = async (socketId: string) => {
  try {
    const socketData = await prisma.chatSocketUserMap.findFirst({
      where: { socketId },
    });
    return await prisma.chatSocketUserMap.delete({
      where: { id: socketData?.id },
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};
export const createChatMessages = async (
  chatMessagesData: IChatMessagesData,
) => {
  try {
    return await prisma.chatMessages.create({ data: chatMessagesData });
  } catch (err) {
    console.log((err as Error).message);
  }
};

export const createNotification = async (
  chatMessagesNotificationData: IChatMessagesNotificationData,
) => {
  try {
    return await prisma.chatNotification.create({data:chatMessagesNotificationData})
  } catch (err) {
    console.log((err as Error).message);
  }
};
export const updateNotification = async (
  chatMessagesNotificationData: IChatMessagesNotificationData,
  id:string
) => {
  try {
    return await prisma.chatNotification.update({data:{notificationCount:chatMessagesNotificationData.notificationCount},where:{id:id}})
  } catch (err) {
    console.log((err as Error).message);
  }
};
export const getNotification = async (userId: string,email:string) => {
  try {
    return await prisma.chatNotification.findFirst({
      select:{notificationCount:true,id:true},
      where: { userId: userId,email:email },
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};

export const getUserSocketId = async (userId: string) => {
  try {
    return await prisma.chatSocketUserMap.findFirst({
      where: { userId: userId },
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};

export const fetchMessagesList = async (
  senderId: string,
  receiverId: string,
) => {
  try {
    return await prisma.chatMessages.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      select: {
        message: true,
        id: true,
        messageType: true,
        senderId: true,
        receiverId: true,
        createdAt:true,
        sender: { select: { firstname: true, lastname: true, email: true } },
        receiver: { select: { firstname: true, lastname: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};
export const fetchMessagesById = async (id:string) => {
  try {
    return await prisma.chatMessages.findFirst({
      where: {id:id},
      select: {
        message: true,
        id: true,
        messageType: true,
        senderId: true,
        receiverId: true,
        createdAt:true,
        sender: { select: { firstname: true, lastname: true, email: true } },
        receiver: { select: { firstname: true, lastname: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};

export const fetchUserEmailById = async (userId: string) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        email: true,
      },
      where: { id:userId },
    });
    // users not present
    if (!user) throw new Error('Users not found');
    return user;
  } catch (err) {
    throw err;
  }
};