"use strict";

const _ = require('lodash');
const componentService = require("../services/componentService");

class ComponentLogic {

    static getAllComponents(callback)
    {
        componentService.getAll(callback);
    }

    static getComponentDataByName(name, callback)
    {
        componentService.getComponentDataByName (name, callback);
    }  
}

module.exports = ComponentLogic;