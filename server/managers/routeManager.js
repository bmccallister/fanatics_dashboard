"use strict";

const _ = require('lodash');
const templateLogic = require("../logic/templateLogic");
const componentLogic = require("../logic/componentLogic");

//Router endpoints
const initialize = (router) => {


    //Get distinct contexts
    router.use('/contexts', (req,res,next) => { 
        componentLogic.getDistinctContexts(function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            console.log(results);
            res.json(results);
        });
    });


    //Get template by name
    router.use('/templates/:template', (req,res,next) => { 
        console.log('Using get template by name')
        templateLogic.getTemplateByName(req.params.template, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    //Get all templates
    router.use('/templates', (req,res,next) => {  
        console.log('Using get all templates')
        templateLogic.getAllTemplates(function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    

    //Get all components by context
    router.use('/components/context/:context', (req,res,next) => { 
        componentLogic.getComponentsByContext(req.params.context, (error, results) => {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    //Get a specific component by its component ID
    router.use('/component/:ID', (req,res,next) => {
                        
        componentLogic.getComponentByID(req.params.ID, (error, results) => {
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
    
    //Get all components
    router.use('/components', (req,res,next) => { 
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

}

module.exports = {
    initialize: initialize
}