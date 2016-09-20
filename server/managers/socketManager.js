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
            
        });

        socket.on('componentByID', function(id) 
        {
            console.log('Socket Server: Retrieving component for ID: ' + id + '.');
            componentLogic.getComponentDataByID(id, (error, results) => {
                var resObj = results[0];
                var retVal = resObj[Object.keys(resObj)[0]];
                
                console.log('Socket Server: Retrieved Component for ' + id + '.');
                io.emit('componentsByID', retVal);
            });
            
        });

        socket.on('componentsByContext', function(context) 
        {
            console.log('Socket Server: Retrieving components for context: ' + context + '.');
            componentLogic.getComponentDataByContext(context, (error, results) => {                
                console.log('Socket Server: Retrieved components for context: ' + context + '.');
                io.emit('componentsByContext', results);
            });
            
        });

        socket.on('componentsByTemplate', function(template) 
        {
            console.log('Socket Server: Retrieving components for template: ' + template + '.');
            componentLogic.getComponentDataByTemplate(template, (error, results) => {                
                console.log('Socket Server: Retrieved components for template: ' + template + '.');
                io.emit('componentsByTemplate', results);
            });
            
        });

        socket.on('componentsByTemplateContext', function(template, context) 
        {
            console.log('Socket Server: Retrieving components for template: ' + template + ' and context: ' + context + '.');
            componentLogic.getComponentDataByTemplateContext(template, context, (error, results) => {               
                console.log('Socket Server: Retrieved components for template: ' + template + ' and context: ' + context + '.');
                io.emit('componentsByTemplateContext', results);
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