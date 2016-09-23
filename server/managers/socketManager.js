"use strict";

const _ = require('lodash');

const templateLogic = require("../logic/templateLogic");
const componentLogic = require("../logic/componentLogic");

//Socket.io Tunnels
const initialize = (io) => {    

    io.on('connection', function(socket) 
    {
        console.log('Socket Server: Socket Connected.');
        socket.on('templates', function() 
        {
            console.log('Socket Server: Retrieving Templates');
            templateLogic.getAllTemplates(function(error, results) 
            {
                console.log("Socket Server: Retrieved " + results.length + " templates from data store.");
                io.emit('templates', results);
            });
            console.log("Current Socket Connection Count: " + io.engine.clientsCount);
        });
        socket.on('components', function() 
        {
            console.log('Socket Server: Retrieving Components');
            componentLogic.getAllComponents(function(error, results) 
            {
                console.log("Socket Server: Retrieved " + results.length + " components from data store.");
                io.emit('components', results);
            });
            console.log("Current Socket Connection Count: " + io.engine.clientsCount);
        });
        socket.on('componentByID', function(id) 
        {
            console.log('Socket Server: Retrieving component for ID: ' + id + '.');
            componentLogic.getComponentByID(id, (error, results) => {
                var resObj = results[0];
                var retVal = resObj[Object.keys(resObj)[0]];
                
                console.log('Socket Server: Retrieved Component for ' + id + '.');
                console.log(retVal);
                io.emit('componentByID', retVal);
            });
            console.log("Current Socket Connection Count: " + io.engine.clientsCount);
        });

        socket.on('componentsByContext', function(context) 
        {
            console.log('Socket Server: Retrieving components for context: ' + context + '.');
            componentLogic.getComponentsByContext(context, (error, results) => {                
                console.log('Socket Server: Retrieved components for context: ' + context + '.');
                io.emit('componentsByContext', results);
            });
            console.log("Current Socket Connection Count: " + io.engine.clientsCount);
        });

        socket.on('componentsByTemplate', function(template) 
        {
            console.log('Socket Server: Retrieving components for template: ' + template + '.');
            componentLogic.getComponentByTemplate(template, (error, results) => {                
                console.log('Socket Server: Retrieved components for template: ' + template + '.');
                io.emit('componentsByTemplate', results);
            });
            console.log("Current Socket Connection Count: " + io.engine.clientsCount);
        });

        socket.on('componentsByTemplateContext', function(template, context) 
        {
            console.log('Socket Server: Retrieving components for template: ' + template + ' and context: ' + context + '.');
            componentLogic.getComponentByTemplateContext(template, context, (error, results) => {               
                console.log('Socket Server: Retrieved components for template: ' + template + ' and context: ' + context + '.');
                io.emit('componentsByTemplateContext', results);
            });
            console.log("Current Socket Connection Count: " + io.engine.clientsCount);
        });

        socket.on('test', function(msg) 
        {
            console.log('Test got a message: ' + msg);
            io.emit('test', msg);
            console.log("Current Socket Connection Count: " + io.engine.clientsCount);
        });
    });
}

module.exports = {
    initialize: initialize
}