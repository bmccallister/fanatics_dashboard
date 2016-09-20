"use strict";

const _ = require('lodash');
const componentLogic = require("../logic/componentLogic");
const componentDataLogic = require("../logic/componentDataLogic");

//Router endpoints
const initialize = (router) => {
    router.use('/tableau_components/:component', (req,res,next) => {
        
        var component = req.params.component;
                
        componentLogic.getComponentDataByName(req.params.component, (error, results) => {
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

    });
    
    router.use('/tableau_components', (req,res,next) => { 
        componentLogic.getAllComponents(function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    router.use('/tableau_interfaces', (req,res,next) => { 
        componentDataLogic.getActiveInterfaces(function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    

}

module.exports = {
    initialize: initialize
}