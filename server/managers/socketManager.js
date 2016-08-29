"use strict";

const _ = require('lodash');

const componentLogic = require("../logic/componentLogic");
const componentDataLogic = require("../logic/componentDataLogic");

//Socket.io Tunnels
const initialize = (http) => {

    var io = require('socket.io')(http);

    io.on('connection', function(socket) 
    {
        console.log('a user connected');
        socket.on('components', function(req,res) 
        {
            componentLogic.getAllComponents(req, res);
            io.emit('components', res);
        });

        socket.on('componentData', function(req,res) 
        {
            componentDataLogic.getComponentDataByName(req, res);
            io.emit('componentData', res);
        });
    });
}

module.exports = {
    initialize: initialize
}