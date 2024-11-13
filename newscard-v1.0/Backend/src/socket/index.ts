import { Request } from 'express';
import { Server, Socket } from 'socket.io';
import { ChatEventEnum } from '../helpers/constants';
import {
  createSocketMap,
  deleteSocketMap,
  updateSocketMap,
  verifySocketMap,
} from '../services/chat.service';

// Socket handler
const initializeSocketIO = (io: Server) => {
  return io.on('connection', async (socket: Socket) => {
    try {
      const { userId } = socket.handshake.query;
      if (userId && !Array.isArray(userId)) {
        const userData = await verifySocketMap({
          socketId: socket.id,
          userId: userId,
        });
        if (userData) {
          await updateSocketMap(
            { socketId: socket.id, userId: userId },
            userData.id,
          );
        } else {
          await createSocketMap({ socketId: socket.id, userId: userId });
        }
        console.log('User connected 🗼 userId:', socket.id.toString());
      }
      // if disconnect
      socket.on(ChatEventEnum.DISCONNECT_EVENT, async () => {
        await deleteSocketMap(socket.id);
        console.log('user has disconnected 🚫 userId:' + socket.id.toString());
      });
    } catch (err) {
      console.log((err as Error).message);
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        (err as Error)?.message ||
          'Something went wrong while connecting to the socket.',
      );
    }
  });
};

// Socket Event Emitter
/**
 *
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point
 * @param {any} payload - Data that should be sent when emitting the event
 * @description Utility function responsible to abstract the logic of socket emission via the io instance
 */

const emitSocketEvent = (req: Request, payload: any, socketId: string) => {
  req.app.get('io').to(socketId).emit('message', payload);
};

export { emitSocketEvent, initializeSocketIO };
