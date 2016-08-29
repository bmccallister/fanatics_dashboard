"use strict";

const _ = require('lodash');
const componentDataService = require("../services/componentDataService");

class ComponentDataService
{
    static getComponentDataByName(req, res)
    {
        var component = req.params.component;
                
        componentDataService.getComponentDataByName(req.params.component, (error, results) => {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            try 
            {
                var resObj = results[0]
                var retVal = resObj[Object.keys(resObj)[0]];
                res.json(retVal);
            }
            catch (exception) 
            {
                res.status(400).send(exception);
            }
        });
    }  
}
module.exports = ComponentDataService;