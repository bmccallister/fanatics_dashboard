"use strict";

const _ = require('lodash');
const componentDataService = require("../services/componentDataService");

class ComponentDataLogic
{
    static getComponentDataByName(name, callback)
    {
        componentDataService.getComponentDataByName (name, callback);
    }  
    static getActiveInterfaces(callback)
    {
        componentDataService.getActiveInterfaces(callback);
    }
}

module.exports = ComponentDataLogic;