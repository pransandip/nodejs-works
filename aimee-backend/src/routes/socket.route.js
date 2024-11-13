'use strict';

const eventSocket = require("../sockets/event.socket");
// const chat = require("./Sockets")
const config = require("../sockets/config/config.socket");

const initSocketRoutes = (io) => {
   
io.on('connection', (socket) => {

    console.log("into socket !!!!", socket.id);

    socket.on("msg", (msg) => {
       console.log('msgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsg',msg); // the Set contains at least the socket ID
    });  

    // console.log( socket.client.conn.server.clientsCount + " users connected" );
    const apiData = {
        message: 'Hello from the create enquery API!',
        timestamp: new Date().toISOString(),
    };
    io.to(socket.id).emit('createenq', apiData);
    // return socket.emit("responseSavedData", { message: 'Data saved successfully'});

    // socket.on('create', (payload) => config.createRoom(socket, payload));
    // socket.on("addSaveData", (payload)=>eld.addSaveData(socket, payload));
    
});
}

module.exports = initSocketRoutes;