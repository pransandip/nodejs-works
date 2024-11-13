'use strict'
//const initenqueryController = require("../../controllers/Controllers/enqry.controller");

const enqueryEvent = async (socket, payload) => {
    var buf = Buffer.from(payload, 'base64').toString('ascii'); 
    payload = JSON.parse(buf);
    let room_id = `${payload?.companyId}-${payload?.vehicleId}`;
    // const { error } = saveELDDataValidator.validate(payload);
    if(error){
        return socket.emit("errorMessage", { message: 'Data not saved', error: error});
    }
   
    //console.log('payload---->',payload);
    return enqueryEventUpdate(payload?.companyId,payload?.vehicleId)
        .then(async (savedData)=>{
            let response = { enquery: savedData}
            socket.to(room_id).emit("updateEnqueryData", response);
            return socket.emit("responseupdateEnqueryData", { message: 'Data saved successfully'});
        })
}



exports.enqueryEvent = enqueryEvent;
