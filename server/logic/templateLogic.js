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

    static createTemplate(payload, callback) {
    	templateService.createTemplate(payload, callback)
    }

    static updateTemplate(name, payload, callback) {
    	templateService.updateTemplate(name, payload, callback)
    }

    static copyTemplate(payload, callback) {
    	console.log('Inside logic copyTemplate');
    	payload.name = payload.name + '_Copy';
    	console.log('New payload name:', payload.name);
    	templateService.createTemplate(payload, callback)
    }
}

module.exports = TemplateLogic;