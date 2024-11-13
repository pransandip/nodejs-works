import { Request, Response } from 'express';
import {
  createChatMessages,
  fetchMessagesList,
  getUserSocketId,
  fetchMessagesById,
  getNotification,
  fetchUserEmailById,
  updateNotification,
  createNotification
} from '../services/chat.service';
import { emitSocketEvent } from '../socket';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const messdata:any = await createChatMessages({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      message: req.body.message,
      docUrl: '',
      messageType: req.body.messageType,
    });
    
    const messdataresult = await fetchMessagesById(messdata.id);
    const socket = await getUserSocketId(req.body.receiverId);
    if (socket) {
      emitSocketEvent(
        req,
        messdataresult,
        socket?.socketId,
      );
    }
    const userEmailData = await fetchUserEmailById(req.body.receiverId);
    if(userEmailData.length>0)
    {
      const notificationCountData = await getNotification(req.body.senderId,userEmailData[0].email);
      if(notificationCountData)
      {
        await updateNotification({email:userEmailData[0].email,notificationCount:notificationCountData?.notificationCount+1,userId:req.body.senderId},notificationCountData.id);
      }else{
        await createNotification({email:userEmailData[0].email,notificationCount:1,userId:req.body.senderId});
      }
    }
    return res.status(201).json({
      success: '1',
      message: 'Message Sent.',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const fetchMessages = async (req: Request, res: Response) => {
  try {
    const messages = await fetchMessagesList(
      req.body.senderId,
      req.body.receiverId,
    );
    const userEmailData = await fetchUserEmailById(req.body.senderId);
   
    if(userEmailData.length>0)
    {
      const notificationCountData = await getNotification(req.body.receiverId,userEmailData[0].email);
       console.log("Data=>",req.body.receiverId);
      if(notificationCountData)
      {
        await updateNotification({email:userEmailData[0].email,notificationCount:0,userId:req.body.receiverId},notificationCountData.id);
      }
    }
    return res.status(201).json({
      success: '1',
      message: 'Message Sent.',
      data: messages,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
