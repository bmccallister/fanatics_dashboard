"use strict";

const _ = require('lodash');
const componentDataService = require("../services/componentDataService");

class ComponentDataLogic
{
    static getActiveInterfaces(callback)
    {
        componentDataService.getActiveInterfaces(callback);
    }
}

module.exports = ComponentDataLogic;