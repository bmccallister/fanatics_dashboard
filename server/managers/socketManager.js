"use strict";

const _ = require('lodash');

const componentLogic = require("../logic/componentLogic");
const componentDataLogic = require("../logic/componentDataLogic");

//Socket.io Tunnels
const initialize = (io) => {    

    io.on('connection', function(socket) 
    {
        console.log('Socket Server: Socket Connected.');
        socket.on('components', function() 
        {
            console.log('Socket Server: Retrieving Components');
            componentLogic.getAllComponents(function(error, results) 
            {
                console.log("Socket Server: Retrieved " + results.length + " components from data store.")
                io.emit('components', results);
            });
            
        });

        socket.on('componentData', function(name) 
        {
            console.log('Socket Server: Retrieving Component Data for ' + name + '.');
            componentDataLogic.getComponentDataByName(name, (error, results) => {
                var resObj = results[0]
                var retVal = resObj[Object.keys(resObj)[0]];
                
                console.log('Socket Server: Retrieved Component Data for ' + name + '.');
                io.emit('componentData', retVal);
            });
            
        });

        socket.on('test', function(msg) 
        {
            console.log('Test got a message: ' + msg);
            io.emit('test', msg);
        });
    });
}

module.exports = {
    initialize: initialize
}