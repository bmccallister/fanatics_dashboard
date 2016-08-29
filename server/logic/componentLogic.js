"use strict";

const _ = require('lodash');
const componentService = require("../services/componentService");

class ComponentLogic {

    static getAllComponents(callback)
    {
        componentService.getAll(callback);
    }

}

module.exports = ComponentLogic;