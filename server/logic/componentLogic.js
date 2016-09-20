"use strict";

const _ = require('lodash');
const componentService = require("../services/componentService");

class ComponentLogic
{
    static getComponentByID(id, callback)
    {
        componentService.getComponentByID (id, callback);
    }  
    static getComponentsByContext(context, callback)
    {
        componentService.getComponentsByContext(context, callback);
    }
    static getComponentsByTemplate (template, callback)
    {
        componentService.getComponentsByTemplate(template, callback);
    }
    static getComponentsByTemplateContext (template, context, callback)
    {
        componentService.getComponentsByTemplateContext(template, context, callback);    
    }
    static getAllComponents(callback) 
    {
        componentService.getAll(callback);
    }
    static getDistinctContexts(callback)
    {
        componentService.getDistinctContexts(callback);
    }
}

module.exports = ComponentLogic;