"use strict";

const _ = require('lodash');

const componentLogic = require("../logic/componentLogic");
const componentDataLogic = require("../logic/componentDataLogic");

//Socket.io Tunnels
const initialize = (io) => {    

    io.on('connection', function(socket) 
    {
        console.log('Socket connected.');
        socket.on('components', function(req,res) 
        {
            componentLogic.getAllComponents(function(error, results) 
            {
                if (error) 
                {
                    res.status(400).send(error);
                    return;
                }
                res.json(results);
            });
            io.emit('components', res);
        });

        socket.on('componentData', function(name, res) 
        {
            componentDataLogic.getComponentDataByName(name, (error, results) => {
                if (error) 
                {
                    res.status(400).send(error);
                    return;
                }
                try 
                {
                    var resObj = results[0]
                    var retVal = resObj[Object.keys(resObj)[0]];
                    res.json(retVal);
                }
                catch (exception) 
                {
                    res.status(400).send(exception);
                }
            });
            io.emit('componentData', res);
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