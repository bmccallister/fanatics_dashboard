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
        if (context == '' || context=='all')
        {
            componentService.getAll(callback);
        }
        else
        {
            componentService.getComponentsByContext(context, callback);
        }
    }
    static getComponentsByTemplate (template, callback)
    {
        componentService.getComponentsByTemplate(template, callback);
    }
    static deleteComponentByName(name, callback)
    {
        componentService.deleteComponentByName(name, callback);
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
    static copyComponent(payload, callback) {
        console.log('Inside logic copyComponent');
        payload.id = payload.id + '_Copy';
        console.log('New payload name:', payload.id);
        componentService.createComponent(payload, callback)
    }
}

module.exports = ComponentLogic;