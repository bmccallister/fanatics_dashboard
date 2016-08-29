"use strict";

const _ = require('lodash');
const componentLogic = require("../logic/componentLogic");
const componentDataLogic = require("../logic/componentDataLogic");

//Router endpoints
const initialize = (router) => {
    router.use('/tableau_components/:component', (req,res,next) => {
        componentDataLogic.getComponentDataByName(req, res);
    });
    
    router.use('/tableau_components', (req,res,next) => { 
        componentLogic.getAllComponents(req, res);
    });
    router.use('/socket.io/', (req,res,next) => {
        console.log('reached socket route.');
    });
}

module.exports = {
    initialize: initialize
}