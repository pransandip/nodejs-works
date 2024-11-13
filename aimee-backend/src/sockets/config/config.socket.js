'use strict';
const promise = require("bluebird");

const createRoom = (socket, payload) => {
    console.log("eld create room");
    if(!payload?.rooms?.length) {
        return socket.emit('errorMessage', { message: "DriverId not available", success: false })
    }
    let roomsArray = Array.from(socket.rooms); 
    console.log("location-rooms:", socket.rooms, roomsArray);
    return promise.map(payload?.rooms, (room)=>{
        let room_id =  `${room?.driverId}-${room?.vehicleId}`;
        if(room?.driverId && room?.vehicleId){
            socket.join(room_id);
        }
    })     
}

const createChatRoom = (socket, payload) => {
    if(!payload?.rooms?.length) {
        return socket.emit('errorMessage', { message: "DriverId not available", success: false })
    }
    let roomsArray = Array.from(socket.rooms); 
    console.log("chat-rooms:",socket.rooms, roomsArray);
    return promise.map(payload?.rooms, (room)=>{
        let room_id =  `${room?.driverId}-${room?.companyId}`;
        if(room?.driverId && room?.companyId){
            socket.join(room_id);
        }
    })     
}


exports.createRoom = createRoom;
exports.createChatRoom = createChatRoom;