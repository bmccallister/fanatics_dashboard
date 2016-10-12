"use strict";

const _ = require('lodash');
const templateLogic = require("../logic/templateLogic");
const componentLogic = require("../logic/componentLogic");

//Router endpoints
const initialize = (router) => {


    //Get distinct contexts
    router.get('/contexts', (req,res,next) => { 
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
    router.get('/templates/:template', (req,res,next) => { 
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

    //Delete template by name
    router.delete('/templates/:template', (req,res,next) => { 
        console.log('Using delete template by name')
        templateLogic.deleteTemplateByName(req.params.template, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });
    //Post template by name
    router.post('/templates/copy/:template', (req,res,next) => { 
        console.log('Calling copy template')
        templateLogic.copyTemplate(req.body, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    //Post template by name
    router.post('/templates', (req,res,next) => { 
        console.log('Calling create template')
        templateLogic.createTemplate(req.body, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

      //Post template by name
    router.put('/templates/:template', (req,res,next) => { 
        console.log('Calling update template with template:' + req.params.template)
         templateLogic.updateTemplate(req.params.template, req.body, function(error, results) 
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
    router.get('/templates', (req,res,next) => {  
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
    router.get('/components/context/:context', (req,res,next) => { 
        componentLogic.getComponentsByContext(req.params.context, (error, results) => {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    router.post('/components/copy/:template', (req,res,next) => { 
        console.log('Calling copy template with reqbody:', req.body)
        componentLogic.copyComponent(req.body, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });
    router.get('/components/:component', (req,res,next) => { 
        console.log('Using get components by name')
        componentLogic.getComponentByID(req.params.component, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    router.post('/components', (req,res,next) => { 
        console.log('Calling update component with component:' + req.params.component)
         componentLogic.createComponent(req.body, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    router.put('/components/:component', (req,res,next) => { 
        console.log('Calling update component with component:' + req.params.component)
         componentLogic.updateComponent(req.params.component, req.body, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });

    router.delete('/components/:component', (req,res,next) => { 
        console.log('Using delete components by name')
        componentLogic.deleteComponentByName(req.params.component, function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    });
    //Get a specific component by its component ID
    router.get('/component/:ID', (req,res,next) => {
                        
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
    router.get('/components', (req,res,next) => { 
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