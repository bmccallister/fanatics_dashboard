"use strict";

const _ = require('lodash');
const templateService = require("../services/templateService");

class TemplateLogic {

    static getAllTemplates(callback)
    {
        templateService.getAll(callback);
    }

    static getTemplateByName(name, callback)
    {
        templateService.getTemplateByName(name, callback);
    }
}

module.exports = TemplateLogic;