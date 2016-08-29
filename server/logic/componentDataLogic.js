"use strict";

const _ = require('lodash');
const componentDataService = require("../services/componentDataService");

class ComponentDataLogic
{
    static getComponentDataByName(name, callback)
    {
        componentDataService.getComponentDataByName (name, callback);
    }  
}

module.exports = ComponentDataLogic;