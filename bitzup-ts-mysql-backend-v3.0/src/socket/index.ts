import { Request } from 'express';
import { Server, Socket } from 'socket.io';
import { ChatEventEnum } from '../helpers/constant';

/*----- socket handler -----*/
const initializeSocketIO = (io: Server) => {
  return io.on('connection', async (socket: Socket) => {
    try {
      // on connect
      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log('User connected 🗼 userId:', socket.id.toString());

      // if disconnect
      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
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

/*----- socket Event Emitter -----*/
/**
 *
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point
 * @param {any} payload - Data that should be sent when emitting the event
 * @description Utility function responsible to abstract the logic of socket emission via the io instance
 */

const emitSocketEvent = (req: Request, payload: any) => {
  req.app.get('io').emit('message', payload);
};

export { initializeSocketIO, emitSocketEvent };
